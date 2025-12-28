// lib/prompt-builder/PromptBuilderV2.ts
// IR(Intermediate Representation) 기반 프롬프트 빌더

import type { PromptIR, SlotContent, UserSettings, ConflictReport, StudioSubject } from '@/types';
import { PROMPT_SLOTS, getSlotById } from '@/config/slots/slot-definitions';
import { getCameraById } from '@/config/mappings/cameras';
import { getLensById } from '@/config/mappings/lenses';
import { buildLightingPrompt } from '@/config/mappings/lighting-patterns';
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
        const { studioSubjectCount, studioComposition, studioBackgroundType, studioSubjects } = this.settings.userInput;
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

        // 배경 타입 매핑
        const backgroundMap: Record<string, string> = {
            seamless_white: 'seamless white studio background',
            seamless_gray: 'seamless gray studio background',
            seamless_blue: 'seamless blue studio background',
            textured: 'textured studio backdrop'
        };
        if (studioBackgroundType && backgroundMap[studioBackgroundType]) {
            parts.push(backgroundMap[studioBackgroundType]);
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

        // Person N (복수 인물일 때)
        if (personNumber) {
            parts.push(`Person ${personNumber}:`);
        }

        // === AI 이미지 생성 우선순위 순서로 배치 ===

        // 1. 시선 (가장 중요 - 인물의 표현/감정)
        if (!subject.autoMode) {
            const gazeMap: Record<string, string> = {
                camera: 'looking directly at camera',
                aside: 'gazing to the side',
                down: 'looking down thoughtfully',
                up: 'looking upward'
            };
            parts.push(gazeMap[subject.gazeDirection] || '');
        }

        // 2. 성별 + 인종 + 나이대 (핵심 정체성)
        const genderMap: Record<string, string> = { male: 'man', female: 'woman' };
        const ethnicityMap: Record<string, string> = {
            korean: 'Korean',
            asian: 'Asian',
            caucasian: 'Caucasian',
            black: 'Black',
            hispanic: 'Hispanic',
            middle_eastern: 'Middle Eastern'
        };
        const ageMap: Record<string, string> = {
            child: 'young',
            teen: 'teenage',
            '20s': 'young adult',
            '30s': 'adult',
            '40s': 'mature',
            '50plus': 'middle-aged',
            elderly: 'elderly'
        };

        const ethnicity = ethnicityMap[subject.ethnicity] || '';
        const age = ageMap[subject.ageGroup] || '';
        const gender = genderMap[subject.gender] || 'person';

        // "Korean young adult woman" 형식
        parts.push(`${ethnicity} ${age} ${gender}`.trim());

        // 3. 체형 (전체적인 실루엣)
        const bodyMap: Record<string, string> = {
            slim: 'with slim figure',
            average: 'with average build',
            athletic: 'with athletic physique',
            curvy: 'with curvy figure',
            plus: 'with plus-size body'
        };
        parts.push(bodyMap[subject.bodyType] || '');

        // Auto 모드가 OFF일 때만 상세 정보 포함
        if (!subject.autoMode) {
            // 4. 머리카락 (시각적 특징)
            const hairColorMap: Record<string, string> = {
                black: 'black', brown: 'brown', blonde: 'blonde',
                red: 'red', gray: 'gray', white: 'white'
            };
            const hairStyleMap: Record<string, string> = {
                short: 'short', medium: 'medium-length', long: 'long flowing',
                wavy: 'wavy', curly: 'curly', straight: 'straight',
                bald: 'bald', ponytail: 'ponytail', bun: 'elegant bun', braids: 'braided'
            };
            if (subject.hairStyle === 'bald') {
                parts.push('bald head');
            } else {
                parts.push(`${hairStyleMap[subject.hairStyle]} ${hairColorMap[subject.hairColor]} hair`);
            }

            // 5. 포즈
            const poseMap: Record<string, string> = {
                contrapposto: 'classic contrapposto, weight shifted to one hip, one knee slightly bent, elegant body curve, shoulders angled 45 degrees, confident editorial stance',
                sitting: 'sitting on a minimalist studio stool, legs crossed elegantly, leaning slightly back, hands resting naturally on knees, effortless high-fashion aesthetic, relaxed posture',
                shoulder_lookback: 'looking back over the shoulder, dynamic body twist, elegant neck line, hair gently flowing, sophisticated gaze, subtle side-profile',
                hands_to_face: 'editorial hand-to-face gesture, slender fingers near jawline, soft hand placement, intense eye contact, high-fashion beauty pose, focus on facial expression',
                walking: 'mid-action walking pose, forward motion, natural stride, fluid movement, hair and clothes in motion, candid fashion photography style'
            };
            parts.push(poseMap[subject.pose] || poseMap['contrapposto']);

            // 6. 패션 (마지막 - 의상)
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

        // 스펙: metaToken만 사용
        return camera.metaToken || '';
    }

    private getLens(): string {
        const lens = getLensById(this.settings.camera.lensId);
        if (!lens) return '';

        const parts: string[] = [];
        const isStudioMode = this.settings.artDirection.lensCharacteristicType === 'studio';

        // 1. category 정보
        const categoryMap: Record<string, string> = {
            ultra_wide: 'ultra wide angle',
            wide: 'wide angle',
            standard: 'standard',
            medium_telephoto: 'medium telephoto',
            telephoto: 'telephoto',
            macro: 'macro'
        };
        if (lens.category && categoryMap[lens.category]) {
            parts.push(categoryMap[lens.category]);
        }

        // 현재 조리개가 maxAperture인지 확인
        const currentAperture = this.settings.camera.aperture;
        const isMaxAperture = currentAperture === lens.maxAperture;

        // 2. maxAperture 분기 처리
        if (isMaxAperture) {
            // maxAperture일 때: bokeh + vignetting
            if (lens.bokeh) {
                parts.push(lens.bokeh);
            }
            if (lens.vignetting) {
                parts.push(lens.vignetting);
            }
        } else {
            // 그 외일 때: characteristic_studio (또는 선택된 characteristic 타입)
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
        }

        return parts.join(', ');
    }

    private getCameraSettings(): string {
        const { iso, aperture, whiteBalance, shutterSpeed } = this.settings.camera;
        const parts: string[] = [];

        const isStudioMode = this.settings.artDirection.lensCharacteristicType === 'studio';
        const isLightingOn = this.settings.lighting.enabled;

        // 스펙: 라이팅 ON일 때는 ISO/셔터/색온도 생략
        if (isStudioMode && isLightingOn) {
            // 라이팅 ON: 이 함수에서는 아무것도 추가 안함 (렌즈 특성은 getLens에서 처리)
            return '';
        }

        // 라이팅 OFF: 언어 표현 매핑 사용

        // ISO → 그레인 표현
        if (iso) {
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

        // 색온도 → 색감 표현
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

        // 셔터스피드 → 모션 표현 (극단적인 경우만)
        if (shutterSpeed) {
            const shutterNum = this.parseShutterSpeed(shutterSpeed);
            if (shutterNum <= 1 / 15) {
                parts.push('motion blur, long exposure');
            } else if (shutterNum >= 1 / 250) {
                parts.push('frozen motion, sharp');
            }
            // 일반적인 범위(1/30-1/125)는 생략
        }

        return parts.join(', ');
    }

    private parseShutterSpeed(shutter: string): number {
        if (shutter.startsWith('1/')) {
            return 1 / parseInt(shutter.replace('1/', ''));
        }
        return parseFloat(shutter);
    }

    private getLighting(): string {
        const lighting = this.settings.lighting;

        // 스펙: 스튜디오 라이팅 OFF일 때 프롬프트 없음
        if (!lighting.enabled) {
            return '';
        }

        return buildLightingPrompt({
            pattern: lighting.pattern,
            key: lighting.key,
            ratio: lighting.ratio,
            quality: lighting.quality,
            colorTemp: lighting.colorTemp,
            mood: lighting.mood,
            timeBase: lighting.timeBase === 'none' ? undefined : lighting.timeBase,
            special: lighting.special,
        });
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


    // ===== 우선순위 적용 =====

    private applyPriorities(): void {
        // 총 토큰 수 계산
        const totalTokens = Object.values(this.ir.slots)
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
