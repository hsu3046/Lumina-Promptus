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

        // 프롬프트 조합: 1) metaToken, 2) "shot with" + brand + model, 3) 나머지 promptKeywords
        const parts: string[] = [];

        // 1. metaToken (가장 앞)
        if (camera.metaToken) {
            parts.push(camera.metaToken);
        }

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

        // 현재 조리개가 maxAperture인지 확인
        const currentAperture = this.settings.camera.aperture;
        const isMaxAperture = currentAperture === lens.maxAperture;

        // 3. maxAperture 조건부 추가 (현재 설정된 조리개가 maxAperture와 일치하면)
        if (isMaxAperture) {
            parts.push(`a maximum aperture of ${lens.maxAperture}`);
        }

        // 4. bokeh (maxAperture일 때만)
        if (lens.bokeh && isMaxAperture) {
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

        // 6. vignetting (maxAperture일 때만)
        if (lens.vignetting && isMaxAperture) {
            parts.push(lens.vignetting);
        }

        return parts.join(', ');
    }

    private getCameraSettings(): string {
        const { iso, aperture, whiteBalance } = this.settings.camera;
        const parts: string[] = [];

        // ISO → Grain/Noise 표현으로 변환
        if (iso) {
            if (iso <= 100) {
                parts.push('clean very low noise image, high dynamic range');
            } else if (iso <= 400) {
                parts.push('clean image, smooth tonal transitions');
            } else if (iso <= 800) {
                parts.push('slight film grain, natural texture');
            } else if (iso <= 1600) {
                parts.push('visible film grain, textured look');
            } else if (iso <= 3200) {
                parts.push('prominent grain, artistic noise');
            } else {
                parts.push('heavy grain, high ISO aesthetic');
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

        // 색온도 (스튜디오 모드에서는 Lighting의 studioColorTemp 사용하므로 생략)
        const isStudioMode = this.settings.artDirection.lensCharacteristicType === 'studio';
        if (whiteBalance && !isStudioMode) {
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
        return buildLightingPrompt(this.settings.lighting);
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
