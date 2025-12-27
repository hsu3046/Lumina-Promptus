// lib/prompt-builder/PromptBuilderV2.ts
// IR(Intermediate Representation) 기반 프롬프트 빌더

import type { PromptIR, SlotContent, UserSettings, ConflictReport, StudioSubject } from '@/types';
import { PROMPT_SLOTS, getSlotById } from '@/config/slots/slot-definitions';
import { getCameraById } from '@/config/mappings/cameras';
import { getLensById } from '@/config/mappings/lenses';
import { getLightingPatternById, getTimeOfDayPresetById, LIGHT_QUALITIES, LIGHTING_RATIO_PRESETS } from '@/config/mappings/lighting-patterns';
import { detectConflicts } from '@/lib/conflict-resolver/rules';

export class PromptBuilderV2 {
    private ir: PromptIR;
    private settings: UserSettings;

    constructor(settings: UserSettings) {
        this.settings = settings;
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
     * Phase 1: IR 생성 (메인 진입점)
     */
    async buildIR(): Promise<PromptIR> {
        // 1. 결정론적 슬롯 채우기
        this.fillDeterministicSlots();

        // 2. 충돌 감지 (AI 정제 전 1차)
        this.ir.metadata.conflicts = detectConflicts(this.ir);

        // 3. 가중치 및 우선순위 적용
        this.applyPriorities();

        return this.ir;
    }

    // ===== 결정론적 슬롯 =====

    private fillDeterministicSlots(): void {
        // 메타 토큰
        this.setSlot('meta_tokens', this.getMetaTokens(), {
            priority: 10,
            source: 'deterministic',
            locked: true
        });

        // 카메라 바디
        this.setSlot('camera_body', this.getCameraBody(), {
            priority: 9,
            source: 'deterministic',
            locked: true
        });

        // 렌즈
        this.setSlot('lens', this.getLens(), {
            priority: 9,
            source: 'deterministic',
            locked: true
        });

        // 카메라 설정 (ISO, 조리개, 셔터스피드)
        this.setSlot('camera_settings', this.getCameraSettings(), {
            priority: 8,
            source: 'deterministic',
            locked: false
        });

        // 조명
        this.setSlot('lighting', this.getLighting(), {
            priority: 8,
            source: 'deterministic',
            locked: false
        });

        // 구도
        this.setSlot('composition', this.getComposition(), {
            priority: 5,
            source: 'deterministic',
            locked: false
        });

        // 품질 키워드
        this.setSlot('quality', this.getQualityKeywords(), {
            priority: 4,
            source: 'deterministic',
            locked: false
        });

        // 네거티브 프롬프트
        this.setSlot('negative', this.getNegativePrompt(), {
            priority: 10,
            source: 'deterministic',
            locked: false
        });

        // 피사체 (Studio 모드 또는 직접 입력)
        const subjectPrompt = this.getSubjectPrompt();
        if (subjectPrompt) {
            this.setSlot('subject', subjectPrompt, {
                priority: 9,
                source: this.settings.artDirection.lensCharacteristicType === 'studio' ? 'deterministic' : 'user_direct',
                locked: false
            });
        }

        // 스타일/분위기 (사용자 입력) - Studio 모드가 아닐 때만
        if (this.settings.artDirection.lensCharacteristicType !== 'studio' && this.settings.userInput.moodDescription) {
            this.setSlot('style', this.settings.userInput.moodDescription, {
                priority: 6,
                source: 'user_direct',
                locked: false
            });
        }
    }

    // Studio 모드 피사체 프롬프트 생성
    private getSubjectPrompt(): string {
        const { lensCharacteristicType } = this.settings.artDirection;

        // Studio 모드: 폼 데이터 기반
        if (lensCharacteristicType === 'studio') {
            return this.buildStudioSubjectPrompt();
        }

        // 다른 모드: 기존 직접 입력
        return this.settings.userInput.subjectDescription || '';
    }

    private buildStudioSubjectPrompt(): string {
        const { studioSubjectCount, studioComposition, studioSubjects } = this.settings.userInput;
        const parts: string[] = [];

        // 구도 매핑
        const compositionMap: Record<string, string> = {
            extreme_closeup: 'extreme close-up portrait',
            closeup: 'close-up portrait',
            bust: 'bust shot portrait',
            waist: 'waist-up portrait',
            full: 'full body portrait'
        };
        parts.push(compositionMap[studioComposition] || 'portrait');

        // 인원수
        if (studioSubjectCount > 1) {
            parts.push(`of ${studioSubjectCount} people`);
        }

        // 각 인물 설명
        const subjectDescriptions = studioSubjects.slice(0, studioSubjectCount).map((subject, idx) => {
            return this.buildSingleSubjectDescription(subject, studioSubjectCount > 1 ? idx + 1 : null);
        });

        parts.push(subjectDescriptions.join('; '));

        return parts.join(', ');
    }

    private buildSingleSubjectDescription(subject: StudioSubject, personNumber: number | null): string {
        const parts: string[] = [];

        // 성별 & 나이대 매핑
        const genderMap: Record<string, string> = { male: 'man', female: 'woman' };
        const ageMap: Record<string, string> = {
            child: 'child',
            teen: 'teenager',
            '20s': 'in their 20s',
            '30s': 'in their 30s',
            '40s': 'in their 40s',
            '50plus': 'in their 50s',
            elderly: 'elderly'
        };

        // Person N (복수 인물일 때)
        if (personNumber) {
            parts.push(`Person ${personNumber}:`);
        }

        // 인종 (항상 포함)
        const ethnicityMap: Record<string, string> = {
            asian: 'Asian',
            caucasian: 'Caucasian',
            black: 'Black',
            hispanic: 'Hispanic',
            middle_eastern: 'Middle Eastern',
            mixed: 'mixed ethnicity'
        };
        parts.push(ethnicityMap[subject.ethnicity] || '');

        // 나이대 + 성별 (항상 포함)
        const ageText = ageMap[subject.ageGroup] || '';
        const genderText = genderMap[subject.gender] || 'person';
        if (subject.ageGroup === 'child' || subject.ageGroup === 'teen' || subject.ageGroup === 'elderly') {
            parts.push(`${ageText} ${genderText}`);
        } else {
            parts.push(`${genderText} ${ageText}`);
        }

        // Auto 모드가 OFF일 때만 상세 정보 포함
        if (!subject.autoMode) {
            // 머리
            const hairColorMap: Record<string, string> = {
                black: 'black', brown: 'brown', blonde: 'blonde', red: 'red', gray: 'gray', white: 'white'
            };
            const hairStyleMap: Record<string, string> = {
                short: 'short', medium: 'medium-length', long: 'long', wavy: 'wavy', curly: 'curly', straight: 'straight', bald: 'bald', ponytail: 'ponytail', bun: 'bun', braids: 'braided'
            };
            if (subject.hairStyle !== 'bald') {
                parts.push(`${hairStyleMap[subject.hairStyle]} ${hairColorMap[subject.hairColor]} hair`);
            } else {
                parts.push('bald');
            }

            // 눈
            const eyeColorMap: Record<string, string> = {
                brown: 'brown', blue: 'blue', green: 'green', hazel: 'hazel', gray: 'gray'
            };
            parts.push(`${eyeColorMap[subject.eyeColor]} eyes`);

            // 피부
            const skinMap: Record<string, string> = {
                smooth: 'smooth skin',
                natural: 'natural skin texture',
                freckled: 'freckled skin',
                weathered: 'weathered skin'
            };
            parts.push(skinMap[subject.skinTexture] || '');

            // 체형
            const bodyMap = {
                slim: 'slim body',
                average: 'average build',
                athletic: 'athletic build',
                curvy: 'curvy figure',
                plus: 'plus size'
            };
            parts.push(bodyMap[subject.bodyType] || '');


            // 시선
            const gazeMap = {
                camera: 'looking at camera',
                aside: 'looking aside',
                down: 'looking down',
                up: 'looking up'
            };
            parts.push(gazeMap[subject.gazeDirection] || '');

            // 악세서리
            const accessoryMap = {
                none: '',
                glasses: 'wearing glasses',
                sunglasses: 'wearing sunglasses',
                earrings: 'wearing earrings',
                necklace: 'wearing necklace',
                hat: 'wearing hat',
                scarf: 'wearing scarf'
            };
            if (accessoryMap[subject.accessory]) {
                parts.push(accessoryMap[subject.accessory]);
            }

            // 패션
            if (subject.fashion.trim()) {
                parts.push(`wearing ${subject.fashion.trim()}`);
            }
        }

        return parts.filter(p => p).join(', ');
    }

    // ===== 개별 슬롯 생성 메서드 =====

    private getMetaTokens(): string {
        const camera = getCameraById(this.settings.camera.bodyId);
        return camera?.metaToken || '';
    }

    private getCameraBody(): string {
        const camera = getCameraById(this.settings.camera.bodyId);
        if (!camera) return '';

        // 프롬프트 조합: 1) metaToken, 2) "shot with" + brand + model, 3) 나머지 promptKeywords
        const parts: string[] = [];

        // 1. metaToken (가장 앞)
        if (camera.metaToken) {
            parts.push(camera.metaToken);
        }

        // 2. "shot with" + brand + model
        parts.push(`shot with ${camera.brand} ${camera.model}`);

        // 3. 나머지 promptKeywords (metaToken과 "shot with..."가 이미 포함된 경우 제외)
        if (camera.promptKeywords) {
            // 기존 promptKeywords에서 metaToken과 "shot with..." 패턴 제거
            let cleanedKeywords = camera.promptKeywords
                .replace(new RegExp(`^${camera.metaToken},?\\s*`, 'i'), '')
                .replace(/shot (with|on) [^,]+,?\s*/i, '')
                .trim();

            // 선행 쉼표 제거
            cleanedKeywords = cleanedKeywords.replace(/^,\s*/, '');

            if (cleanedKeywords) {
                parts.push(cleanedKeywords);
            }
        }

        return parts.join(', ');
    }

    private getLens(): string {
        const lens = getLensById(this.settings.camera.lensId);
        if (!lens) return '';

        const parts: string[] = [];

        // 1. brand + model (가장 앞)
        parts.push(`${lens.brand} ${lens.model}`);

        // 2. category 정보
        const categoryMap: Record<string, string> = {
            ultra_wide: 'ultra wide angle lens',
            wide: 'wide angle lens',
            standard: 'standard lens',
            medium_telephoto: 'medium telephoto lens',
            telephoto: 'telephoto lens',
            macro: 'macro lens'
        };
        if (lens.category && categoryMap[lens.category]) {
            parts.push(categoryMap[lens.category]);
        }

        // 3. maxAperture 조건부 추가 (현재 설정된 조리개가 maxAperture와 일치하면)
        if (this.settings.camera.aperture === lens.maxAperture) {
            parts.push(`a maximum aperture of ${lens.maxAperture}`);
        }

        // 4. bokeh
        if (lens.bokeh) {
            parts.push(lens.bokeh);
        }

        // 5. 선택된 characteristic 타입에 따른 키워드
        const charType = this.settings.artDirection.lensCharacteristicType;
        const charKeywords = {
            studio: lens.characteristic_studio,
            landscape: lens.characteristic_landscape,
            architecture: lens.characteristic_architecture,
            product: lens.characteristic_product,
            street: lens.characteristic_street,
        }[charType];

        if (charKeywords) {
            parts.push(charKeywords);
        }

        // 6. vignetting
        if (lens.vignetting) {
            parts.push(lens.vignetting);
        }

        return parts.join(', ');
    }

    private getCameraSettings(): string {
        const { iso, aperture, shutterSpeed, whiteBalance } = this.settings.camera;
        const parts: string[] = [];

        // ISO
        if (iso) {
            parts.push(`ISO ${iso}`);
            if (iso > 800) {
                parts.push('visible grain');
            } else if (iso <= 200) {
                parts.push('clean low noise image');
            }
        }

        // 조리개
        if (aperture) {
            parts.push(`${aperture} aperture`);
            const fNumber = parseFloat(aperture.replace('f/', ''));
            if (fNumber <= 2.0) {
                parts.push('shallow depth of field, beautiful bokeh');
            } else if (fNumber >= 8) {
                parts.push('deep depth of field, everything in focus');
            }
        }

        // 셔터스피드
        if (shutterSpeed) {
            parts.push(`${shutterSpeed}s shutter speed`);
            if (shutterSpeed.includes('/') && parseInt(shutterSpeed.split('/')[1]) < 60) {
                parts.push('motion blur');
            } else if (shutterSpeed.includes('/') && parseInt(shutterSpeed.split('/')[1]) >= 500) {
                parts.push('frozen motion, sharp action');
            }
        }

        // 색온도
        if (whiteBalance) {
            if (whiteBalance < 4000) {
                parts.push(`warm ${whiteBalance}K color temperature`);
            } else if (whiteBalance > 6000) {
                parts.push(`cool ${whiteBalance}K color temperature`);
            } else {
                parts.push(`neutral ${whiteBalance}K daylight white balance`);
            }
        }

        return parts.join(', ');
    }

    private getLighting(): string {
        const parts: string[] = [];
        const { lensCharacteristicType } = this.settings.artDirection;

        // 스튜디오 전용 라이팅
        if (lensCharacteristicType === 'studio') {
            const { studioLightingSetup, studioLightingTool, studioBackgroundDetail, studioColorTemp } = this.settings.lighting;

            // 조명 구조
            const setupMap: Record<string, string> = {
                '1point': 'single key light source, dramatic chiaroscuro, high contrast shadows',
                '2point': 'key and fill lighting setup, balanced facial shadows, natural volume',
                '3point': 'professional 3-point setup, rim light, hair light, subject separation',
                'backlight': 'strong backlighting, glowing edges, dark frontal exposure, silhouette effect'
            };
            parts.push(setupMap[studioLightingSetup] || '');

            // 광질 및 도구
            const toolMap: Record<string, string> = {
                'softbox': 'diffused softbox light, smooth skin transitions, gentle shadow falloff',
                'beautydish': 'beauty dish illumination, crisp facial contours, specular highlights, micro-contrast',
                'spotlight': 'focused snoot light, narrow beam, dramatic light falloff, cinematic focus',
                'umbrella': 'wide umbrella bounce, even global illumination, open shadows'
            };
            parts.push(toolMap[studioLightingTool] || '');

            // 디테일 및 배경
            const detailMap: Record<string, string> = {
                'circular': 'sharp circular catchlights in irises, vibrant eye reflections',
                'window': 'rectangular window catchlights, realistic eye highlights',
                'halo': 'halo light on backdrop, gradual background glow behind subject',
                'blackout': 'pitch black background, zero ambient light, pure subject isolation'
            };
            parts.push(detailMap[studioBackgroundDetail] || '');

            // 색온도
            const tempMap: Record<string, string> = {
                '5600k': 'neutral 5600K white balance, daylight balanced strobes, accurate color rendering',
                '3200k': 'warm tungsten lighting, 3200K amber glow, cozy indoor atmosphere, nostalgic mood',
                '7500k': 'cool blueish studio light, 7500K temperature, clinical and modern look, high-tech mood',
                'colorgel': 'creative color gels, dual-tone lighting, cyan and magenta contrast'
            };
            parts.push(tempMap[studioColorTemp] || '');

            return parts.filter(p => p).join(', ');
        }

        // 기존 라이팅 로직 (다른 모드용)
        // 조명 패턴
        const pattern = getLightingPatternById(this.settings.lighting.patternId);
        if (pattern) {
            parts.push(pattern.promptKeywords);
        }

        // 광질
        const quality = LIGHT_QUALITIES.find(q => q.id === this.settings.lighting.quality);
        if (quality) {
            parts.push(quality.promptKeywords);
        }

        // 색온도/시간대
        if (this.settings.lighting.timeOfDay) {
            const timePreset = getTimeOfDayPresetById(this.settings.lighting.timeOfDay);
            if (timePreset) {
                parts.push(timePreset.promptKeywords);
            }
        }

        // Key:Fill:Back 비율
        if (this.settings.lighting.keyFillBackRatio) {
            const ratioPreset = LIGHTING_RATIO_PRESETS.find(
                r => r.ratio === this.settings.lighting.keyFillBackRatio
            );
            if (ratioPreset) {
                parts.push(ratioPreset.promptKeywords);
            }
        }

        return parts.join(', ');
    }

    private getComposition(): string {
        const parts: string[] = [];

        if (this.settings.artDirection.compositionRule) {
            const compositionMap: Record<string, string> = {
                'rule_of_thirds': 'rule of thirds composition',
                'golden_ratio': 'golden ratio composition, fibonacci spiral',
                'center': 'centered composition, symmetrical framing',
                'leading_lines': 'leading lines composition, visual flow',
                'symmetry': 'perfect symmetry, mirror composition'
            };
            parts.push(compositionMap[this.settings.artDirection.compositionRule] || '');
        }

        if (this.settings.artDirection.cameraAngle) {
            const angleMap: Record<string, string> = {
                'eye_level': 'eye level angle, straight-on view',
                'high_angle': 'high angle shot, looking down',
                'low_angle': 'low angle shot, looking up, heroic perspective',
                'birds_eye': 'bird\'s eye view, top-down perspective',
                'worms_eye': 'worm\'s eye view, extreme low angle'
            };
            parts.push(angleMap[this.settings.artDirection.cameraAngle] || '');
        }

        if (this.settings.artDirection.shotType) {
            const shotMap: Record<string, string> = {
                'close_up': 'close-up shot, face detail',
                'medium': 'medium shot, waist up',
                'full_body': 'full body shot, entire figure',
                'wide': 'wide shot, environment context',
                'extreme_close_up': 'extreme close-up, macro detail'
            };
            parts.push(shotMap[this.settings.artDirection.shotType] || '');
        }

        return parts.filter(Boolean).join(', ');
    }

    private getQualityKeywords(): string {
        const levelMap: Record<string, string> = {
            'standard': 'professional photography, high quality',
            'high': 'professional photography, high detail, sharp focus, award-winning photograph, exceptional quality',
            'premium': 'professional photography, ultra high detail, tack sharp focus, award-winning photograph, gallery quality, exceptional resolution'
        };

        return levelMap[this.settings.quality.level] || levelMap['standard'];
    }

    private getNegativePrompt(): string {
        const baseNegatives = [
            'blurry', 'out of focus', 'low quality', 'low resolution',
            'oversaturated', 'overexposed', 'underexposed', 'noise',
            'artifacts', 'distortion', 'watermark', 'text', 'logo'
        ];

        // 사용자 커스텀 네거티브 추가
        const allNegatives = [...baseNegatives, ...this.settings.quality.customNegatives];

        // 중복 제거
        return [...new Set(allNegatives)].join(', ');
    }

    // ===== 우선순위 적용 =====

    private applyPriorities(): void {
        // 총 토큰 수 계산
        const totalTokens = Object.values(this.ir.slots)
            .filter(slot => slot.slotId !== 'negative')
            .reduce((sum, slot) => sum + slot.tokens, 0);

        // 1500 토큰 초과 시 낮은 우선순위 슬롯 트리밍
        if (totalTokens > 1500) {
            this.trimLowPrioritySlots(1500);
        }
    }

    private trimLowPrioritySlots(targetTokens: number): void {
        // 우선순위 낮은 순으로 정렬
        const sortedSlots = Object.values(this.ir.slots)
            .filter(slot => slot.slotId !== 'negative' && !slot.locked)
            .sort((a, b) => a.priority - b.priority);

        let currentTotal = Object.values(this.ir.slots)
            .filter(slot => slot.slotId !== 'negative')
            .reduce((sum, slot) => sum + slot.tokens, 0);

        for (const slot of sortedSlots) {
            if (currentTotal <= targetTokens) break;

            // 슬롯 내용 축소 또는 제거
            this.ir.metadata.warnings.push(
                `토큰 예산 초과로 "${slot.slotId}" 슬롯이 축소될 수 있습니다`
            );
        }
    }

    // ===== 유틸리티 =====

    private setSlot(
        slotId: string,
        content: string,
        options: {
            priority: number;
            source: SlotContent['source'];
            locked: boolean;
        }
    ): void {
        if (!content) return;

        this.ir.slots[slotId] = {
            slotId,
            content,
            priority: options.priority,
            tokens: this.estimateTokens(content),
            source: options.source,
            locked: options.locked
        };
    }

    private estimateTokens(text: string): number {
        // 대략적인 토큰 추정 (단어 수 * 1.3)
        return Math.ceil(text.split(/\s+/).length * 1.3);
    }

    // ===== Getter =====

    getIR(): PromptIR {
        return this.ir;
    }
}
