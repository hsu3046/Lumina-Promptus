// lib/prompt/builders/SnapBuilder.ts
// Snap(Street) 모드 전용 IR Builder
// StudioBuilder로부터 분리된 독립 Builder (SRP 원칙)

import type { PromptIR, UserSettings, SnapSettings } from '@/types';
import { getCameraById, getCameraTypeLabel } from '@/config/mappings/cameras';
import { getLensById } from '@/config/mappings/lenses';
import { detectConflicts } from '@/lib/rules/conflict-resolver';
import {
    SNAP_SUBJECT_TYPES,
    SNAP_TIME_OF_DAY,
    SNAP_LOCATIONS,
    SNAP_SPECIFIC_PLACES,
    SNAP_COMPANIONS,
    SNAP_ACTIONS,
    SNAP_MANNERS,
    SNAP_WEATHER,
    SNAP_SEASONS,
    SNAP_ATMOSPHERE,
    SNAP_LIGHTING,
    SNAP_CROWD_DENSITY,
} from '@/config/mappings/snap-options';


export class SnapBuilder {
    private ir: PromptIR;
    private settings: UserSettings;
    private snap: SnapSettings;

    constructor(settings: UserSettings) {
        this.settings = settings;
        this.snap = settings.snap!;
        this.ir = {
            slots: {},
            metadata: {
                conflicts: [],
                warnings: [],
                suggestions: []
            },
            version: '2.0',
            timestamp: Date.now()
        };
    }

    /**
     * IR 생성 (메인 진입점)
     */
    async buildIR(): Promise<PromptIR> {
        // 1. 슬롯 채우기
        this.fillSlots();

        // 2. 충돌 감지
        this.ir.metadata.conflicts = detectConflicts(this.ir);

        return this.ir;
    }

    // ===== 슬롯 채우기 =====

    private fillSlots(): void {
        // 공통 슬롯: 카메라/렌즈/설정
        this.setSlot('meta_tokens', this.getMetaTokens(), {
            priority: 10,
            source: 'deterministic',
            locked: true
        });

        this.setSlot('camera_body', this.getCameraBody(), {
            priority: 9,
            source: 'deterministic',
            locked: true
        });

        this.setSlot('lens', this.getLens(), {
            priority: 9,
            source: 'deterministic',
            locked: true
        });

        this.setSlot('camera_settings', this.getCameraSettings(), {
            priority: 8,
            source: 'deterministic',
            locked: false
        });

        this.setSlot('aspect_ratio', this.getAspectRatio(), {
            priority: 7,
            source: 'deterministic',
            locked: false
        });

        // Snap 전용 슬롯: 피사체(스토리)
        this.setSlot('subject', this.buildSubjectNarrative(), {
            priority: 9,
            source: 'deterministic',
            locked: false
        });

        // Snap 전용 슬롯: 환경/장소
        this.setSlot('location', this.buildLocationContext(), {
            priority: 7,
            source: 'deterministic',
            locked: false
        });

        // Snap 전용 슬롯: 조명/시간대
        this.setSlot('lighting', this.buildLightingContext(), {
            priority: 8,
            source: 'deterministic',
            locked: false
        });

        // Snap 전용 슬롯: 분위기/스타일 + photoStyle 프리셋 병합
        {
            const styleParts: string[] = [];

            // 1) Snap 분위기 (season + atmosphere)
            const snapStyle = this.buildStyleContext();
            if (snapStyle) styleParts.push(snapStyle);

            // 2) Photo Style 프리셋 (필름 스톡 / 작가 스타일)
            const photoStyleId = this.settings.artDirection?.photoStyleId;
            if (photoStyleId) {
                const { getStyleById } = require('@/config/mappings/photo-styles');
                const photoStyle = getStyleById(photoStyleId);
                if (photoStyle) {
                    styleParts.push(photoStyle.promptTokens);
                }
            }

            if (styleParts.length > 0) {
                this.setSlot('style', styleParts.join(', '), {
                    priority: 6,
                    source: photoStyleId ? 'deterministic' : 'deterministic',
                    locked: false
                });
            }
        }
    }

    // ===== Snap 전용: 피사체 내러티브 =====

    /**
     * 스토리 빌더 6요소(누가/무엇을/어떻게/누구와/어디서/언제)를
     * 자연스러운 영어 내러티브로 변환
     */
    private buildSubjectNarrative(): string {
        const parts: string[] = [];

        // 피사체 유형 분류 (candidness 지시문 차등 적용용)
        const humanSubjects = ['pedestrian', 'elderly', 'child', 'couple', 'street-artist', 'vendor'];
        const animalSubjects = ['street-cat', 'pigeon', 'stray-dog'];
        const subjectType = this.snap.subject || '';
        const isHuman = humanSubjects.includes(subjectType);
        const isAnimal = animalSubjects.includes(subjectType);

        // 1. 기본 스타일 선언 + candidness 강화
        if (isHuman) {
            parts.push('A candid, unposed street photograph');
        } else {
            parts.push('A candid street photograph');
        }

        // 2. 피사체 (누가)
        if (this.snap.subject) {
            const subjectInfo = SNAP_SUBJECT_TYPES.find(s => s.value === this.snap.subject);
            if (subjectInfo) {
                const subjectMap: Record<string, string> = {
                    // 인물
                    'pedestrian': 'a pedestrian',
                    'elderly': 'an elderly person',
                    'child': 'a child',
                    'couple': 'a couple',
                    'street-artist': 'a street artist',
                    'vendor': 'a street vendor',
                    // 동물
                    'street-cat': 'a street cat',
                    'pigeon': 'a pigeon',
                    'stray-dog': 'a stray dog',
                    // 탈것
                    'bicycle': 'a bicycle',
                    'motorcycle': 'a motorcycle',
                    'taxi': 'a taxi',
                    'tram': 'a tram',
                    // 사물
                    'umbrella': 'an umbrella',
                    'bench': 'a bench',
                    'sign': 'a sign',
                    'poster': 'a poster',
                };
                parts.push(`of ${subjectMap[this.snap.subject] || subjectInfo.label}`);
            }
        }

        // 3. Candidness 지시문 (피사체 유형별 차등)
        //    → AI 모델의 "정면 응시" 기본 경향을 명시적으로 차단
        if (isHuman) {
            parts.push('captured unaware, not looking at the camera, photographed from a distance');
        } else if (isAnimal) {
            parts.push('captured in a natural moment');
        }

        // 4. 행동 (무엇을) — 동사구로 변환
        if (this.snap.action) {
            const actionMap: Record<string, string> = {
                'walking': 'walking',
                'waiting': 'waiting',
                'sitting': 'sitting',
                'running': 'running',
                'talking': 'talking',
                'resting': 'resting',
                'working': 'working',
                'napping': 'napping',
                'eating': 'eating',
                'watching': 'gazing into the distance',
            };
            const actionText = actionMap[this.snap.action];
            if (actionText) parts.push(actionText);
        }

        // 5. 방식 (어떻게) — 부사구로 변환
        if (this.snap.manner) {
            const mannerMap: Record<string, string> = {
                'hurriedly': 'hurriedly',
                'leisurely': 'leisurely',
                'secretly': 'furtively',
                'silently': 'silently',
                'absentmindedly': 'absent-mindedly',
                'lonely': 'with a lonely expression',
                'busy': 'busily',
                'peaceful': 'peacefully',
                'tense': 'tensely',
                'nostalgic': 'with a nostalgic air',
                'vibrant': 'vibrantly',
                'mysterious': 'with a mysterious aura',
                'melancholic': 'with a melancholic mood',
            };
            const mannerText = mannerMap[this.snap.manner];
            if (mannerText) parts.push(mannerText);
        }

        // 6. 동반자 (누구와)
        if (this.snap.companion) {
            const companionMap: Record<string, string> = {
                'alone': 'alone',
                'with-friend': 'with a friend',
                'with-lover': 'with a lover',
                'with-family': 'with family',
                'with-pet': 'with a pet',
                'in-crowd': 'in a crowd',
            };
            const companionText = companionMap[this.snap.companion];
            if (companionText) parts.push(companionText);
        }

        // 7. 장소 (어디서) — 전치사 포함
        if (this.snap.location) {
            const locationMap: Record<string, string> = {
                'alley': 'in an alley',
                'crosswalk': 'at a crosswalk',
                'park': 'in a park',
                'market': 'at a market',
                'subway-station': 'at a subway station',
                'bus-stop': 'at a bus stop',
                'cafe': 'outside a café',
                'downtown': 'on a downtown street',
                'underpass': 'in an underpass',
                'stairs': 'on a stairway',
            };
            const locationText = locationMap[this.snap.location];
            if (locationText) parts.push(locationText);
        }

        // 8. 시간대 (언제) — 전치사 포함
        if (this.snap.timeOfDay) {
            const timeMap: Record<string, string> = {
                'dawn': 'at dawn',
                'morning': 'in the morning',
                'midday': 'at midday',
                'afternoon': 'in the afternoon',
                'golden-hour': 'during golden hour',
                'blue-hour': 'during blue hour',
                'night': 'at night',
                'late-night': 'late at night',
            };
            const timeText = timeMap[this.snap.timeOfDay];
            if (timeText) parts.push(timeText);
        }

        return parts.filter(Boolean).join(' ');
    }

    // ===== Snap 전용: 환경 슬롯 =====

    /**
     * 장소 + 구체적 장소 + 군중밀도 → location 슬롯
     */
    private buildLocationContext(): string {
        const parts: string[] = [];

        // 구체적 장소 (value → 영어 장소명, 한글 label 사용 금지)
        if (this.snap.specificPlace) {
            const placeMap: Record<string, string> = {
                'tokyo-shibuya': 'Shibuya, Tokyo',
                'paris-montmartre': 'Montmartre, Paris',
                'new-york-times-square': 'Times Square, New York',
                'london-soho': 'Soho, London',
                'hongkong-mongkok': 'Mong Kok, Hong Kong',
                'seoul-hongdae': 'Hongdae, Seoul',
                'seoul-myeongdong': 'Myeongdong, Seoul',
                'bangkok-khaosan': 'Khaosan Road, Bangkok',
                'amsterdam-jordaan': 'Jordaan, Amsterdam',
                'havana-old-town': 'Old Havana',
                'marrakech-medina': 'Medina, Marrakech',
                'venice-canals': 'Venice canals',
            };
            const placeText = placeMap[this.snap.specificPlace];
            if (placeText) parts.push(`Set in ${placeText}`);
        }

        // 군중 밀도
        if (this.snap.crowdDensity) {
            const crowdMap: Record<string, string> = {
                'empty': 'empty streets',
                'sparse': 'sparse crowd',
                'moderate': 'moderate crowd',
                'crowded': 'crowded street',
                'packed': 'densely packed crowd',
            };
            const crowdText = crowdMap[this.snap.crowdDensity];
            if (crowdText) parts.push(crowdText);
        }

        return parts.join(', ');
    }

    /**
     * 시간대 + 조명 + 날씨 → lighting 슬롯
     */
    private buildLightingContext(): string {
        const parts: string[] = [];

        // 조명 유형 (value → 영어 매핑, 한글 label 사용 금지)
        if (this.snap.lighting) {
            const lightingMap: Record<string, string> = {
                'natural': 'natural light',
                'neon': 'neon light illumination',
                'streetlight': 'streetlight illumination',
                'shop-light': 'warm shop light spilling onto the street',
                'car-headlight': 'car headlight beams',
                'mixed': 'mixed artificial lighting',
            };
            const lightingText = lightingMap[this.snap.lighting];
            if (lightingText) parts.push(lightingText);
        }

        // 날씨
        if (this.snap.weather) {
            const weatherMap: Record<string, string> = {
                'clear': 'clear sky',
                'cloudy': 'overcast sky',
                'rainy': 'rain',
                'after-rain': 'wet surfaces after rain',
                'foggy': 'foggy atmosphere',
                'snowy': 'falling snow',
                'windy': 'windy conditions',
            };
            const weatherText = weatherMap[this.snap.weather];
            if (weatherText) parts.push(weatherText);
        }

        return parts.join(', ');
    }

    /**
     * 분위기/효과 + 계절 → style 슬롯
     */
    private buildStyleContext(): string {
        const parts: string[] = [];

        // 계절
        if (this.snap.season) {
            const seasonMap: Record<string, string> = {
                'spring': 'spring',
                'summer': 'summer',
                'autumn': 'autumn',
                'winter': 'winter',
            };
            const seasonText = seasonMap[this.snap.season];
            if (seasonText) parts.push(`${seasonText} mood`);
        }

        // 분위기/효과 (value → 영어 매핑, 한글 label 사용 금지)
        if (this.snap.atmosphere) {
            const atmosphereMap: Record<string, string> = {
                'mist': 'subtle mist',
                'haze': 'cinematic haze',
                'clear': 'crystal clear air',
                'grain': 'analog film grain',
                'rays': 'dramatic god rays',
                'lens-flare': 'lens flare',
                'raindrops-lens': 'raindrops on lens',
                'motion-blur': 'motion blur',
                'freeze-frame': 'freeze frame',
                'long-exposure': 'long exposure',
                'bokeh': 'bokeh balls',
                'light-leak': 'light leak',
                'vignette': 'vignette effect',
            };
            const atmosphereText = atmosphereMap[this.snap.atmosphere];
            if (atmosphereText) parts.push(atmosphereText);
        }

        return parts.join(', ');
    }

    // ===== 공통 슬롯 (카메라/렌즈) =====

    private getMetaTokens(): string {
        const camera = getCameraById(this.settings.camera.bodyId);
        return camera?.metaToken || '';
    }

    private getCameraBody(): string {
        const camera = getCameraById(this.settings.camera.bodyId);
        return camera?.metaToken || '';
    }

    private getLens(): string {
        const lens = getLensById(this.settings.camera.lensId);
        if (!lens) return '';

        const parts: string[] = [];

        // focalLength + category
        const categoryMap: Record<string, string> = {
            ultra_wide: 'ultra wide',
            wide: 'wide',
            standard: 'standard',
            medium_telephoto: 'medium telephoto',
            telephoto: 'telephoto',
            macro: 'macro'
        };
        if (lens.focalLength && lens.category && categoryMap[lens.category]) {
            parts.push(`${lens.focalLength} ${categoryMap[lens.category]} lens look`);
        } else if (lens.focalLength) {
            parts.push(`${lens.focalLength} lens`);
        }

        // 조리개가 maxAperture인지 확인
        const currentAperture = this.settings.camera.aperture;
        const isMaxAperture = currentAperture === lens.maxAperture;

        if (isMaxAperture) {
            if (lens.bokeh) parts.push(lens.bokeh);
            if (lens.vignetting) parts.push(lens.vignetting);
        } else {
            // street 모드 characteristic 우선, 기본 포커스
            const charKeywords = lens.characteristic_street || lens.characteristic;
            if (charKeywords) parts.push(charKeywords);
        }

        return parts.join(', ');
    }

    private getCameraSettings(): string {
        const { iso, shutterSpeed, whiteBalance, isoAuto, shutterSpeedAuto } = this.settings.camera;
        const parts: string[] = [];

        // ISO → 그레인 표현 (Auto가 아닐 때만)
        if (!isoAuto && iso) {
            if (iso <= 200) {
                parts.push('clean, noise-free image');
            } else if (iso <= 800) {
                parts.push('subtle film grain');
            } else if (iso <= 3200) {
                parts.push('visible grain, analog feel');
            } else {
                parts.push('heavy grain, gritty texture');
            }
        }

        // 색온도
        if (whiteBalance) {
            if (whiteBalance <= 3500) {
                parts.push('warm golden tones');
            } else if (whiteBalance <= 5000) {
                parts.push('neutral balanced colors');
            } else if (whiteBalance <= 6500) {
                parts.push('daylight white balance');
            } else {
                parts.push('cool blue tint');
            }
        }

        // 셔터스피드 → 모션 표현
        if (!shutterSpeedAuto && shutterSpeed) {
            const shutterNum = this.parseShutterSpeed(shutterSpeed);
            if (shutterNum <= 1 / 15) {
                parts.push('motion blur, long exposure');
            } else if (shutterNum >= 1 / 250) {
                parts.push('frozen motion, sharp');
            }
        }

        return parts.join(', ');
    }

    private getAspectRatio(): string {
        const { aspectRatio } = this.settings.camera;
        if (!aspectRatio) return '';

        const [w, h] = aspectRatio.split(':').map(Number);
        const isPortrait = h > w;
        const isSquare = h === w;

        // 카메라 mount 기반 동적 타입 라벨
        const camera = getCameraById(this.settings.camera.bodyId);
        const cameraType = camera ? getCameraTypeLabel(camera.mount) : 'DSLR';

        const ratioPrompts: Record<string, string> = {
            '2:3': `A 2:3 ratio ${cameraType} portrait`,
            '3:4': 'A 3:4 ratio portrait',
            '9:16': 'A 9:16 smartphone portrait',
            '4:5': 'A 4:5 ratio large format portrait',
            '3:2': `A 3:2 ratio ${cameraType} photograph, landscape orientation`,
            '4:3': 'A 4:3 ratio photograph, landscape orientation',
            '16:9': 'A 16:9 cinematic widescreen photograph, landscape orientation',
            '5:4': 'A 5:4 ratio large format photograph, landscape orientation',
            '1:1': 'A 1:1 square format photograph',
        };

        const prompt = ratioPrompts[aspectRatio];
        if (prompt) return prompt;

        if (isSquare) return `A ${aspectRatio} square format`;
        const orientationText = isPortrait ? 'vertical portrait' : 'horizontal landscape orientation';
        return `A ${aspectRatio} ${orientationText}`;
    }

    // ===== 유틸리티 =====

    private parseShutterSpeed(shutter: string): number {
        if (shutter.startsWith('1/')) {
            return 1 / parseInt(shutter.replace('1/', ''));
        }
        return parseFloat(shutter);
    }

    private setSlot(id: string, content: string, options: {
        priority: number;
        source: string;
        locked: boolean;
    }): void {
        if (!content) return;

        this.ir.slots[id] = {
            slotId: id,
            content,
            priority: options.priority,
            tokens: content.split(/\s+/).length,
            source: options.source as 'deterministic' | 'ai_refined' | 'user_direct',
            locked: options.locked,
        };
    }
}
