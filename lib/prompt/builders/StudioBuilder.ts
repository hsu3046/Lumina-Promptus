// lib/prompt-builder/PromptBuilderV2.ts
// IR(Intermediate Representation) 기반 프롬프트 빌더

import type { PromptIR, SlotContent, UserSettings, ConflictReport, StudioSubject } from '@/types';
import { PROMPT_SLOTS, getSlotById } from '@/lib/prompt/slot-definitions';
import { getCameraById, getCameraTypeLabel } from '@/config/mappings/cameras';
import { getLensById } from '@/config/mappings/lenses';
import { buildLightingPrompt } from '@/config/mappings/lighting-patterns';
import { detectConflicts } from '@/lib/rules/conflict-resolver';
import { getPrompt, BODY_POSE_DICT, HAND_POSE_DICT, ANGLE_DICT } from '@/lib/dictionary';
import {
    TOP_WEAR_OPTIONS,
    BOTTOM_WEAR_OPTIONS,
    FOOTWEAR_OPTIONS,
    ACCESSORY_OPTIONS,
} from '@/config/mappings/fashion-options';


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

        // 스타일/분위기 — photoStyle 프리셋 + 사용자 mood 입력 병합
        {
            const styleParts: string[] = [];

            // 1) Photo Style 프리셋 (필름 스톡 / 작가 스타일)
            const photoStyleId = this.settings.artDirection?.photoStyleId;
            if (photoStyleId) {
                const { getStyleById } = require('@/config/mappings/photo-styles');
                const photoStyle = getStyleById(photoStyleId);
                if (photoStyle) {
                    styleParts.push(photoStyle.promptTokens);
                }
            }

            // 2) 사용자 mood 입력 (Studio 이외 모드)
            if (this.settings.artDirection.lensCharacteristicType !== 'studio' && this.settings.userInput.moodDescription) {
                styleParts.push(this.settings.userInput.moodDescription);
            }

            if (styleParts.length > 0) {
                this.setSlot('style', styleParts.join(', '), {
                    priority: 6,
                    source: photoStyleId ? 'deterministic' : 'user_direct',
                    locked: false
                });
            }
        }

        // 사진 비율 (Aspect Ratio)
        this.setSlot('aspect_ratio', this.getAspectRatio(), {
            priority: 7,
            source: 'deterministic',
            locked: false
        });

        // Studio 모드일 때만 추가 슬롯 채우기
        if (this.settings.artDirection.lensCharacteristicType === 'studio') {
            // 배경/장소
            this.setSlot('location', this.getLocation(), {
                priority: 7,
                source: 'deterministic',
                locked: false
            });

            // 패션
            this.setSlot('fashion', this.getFashion(), {
                priority: 7,
                source: 'deterministic',
                locked: false
            });

            // 표정/포즈
            this.setSlot('expression_pose', this.getExpressionPose(), {
                priority: 7,
                source: 'deterministic',
                locked: false
            });

            // 기술 스펙
            this.setSlot('tech_specs', this.getTechSpecs(), {
                priority: 6,
                source: 'deterministic',
                locked: false
            });
        }
    }

    // 피사체 프롬프트 생성 (Studio 전용)
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

        // 구도 매핑 (PortraitFraming 타입과 일치)
        const compositionMap: Record<string, string> = {
            'extreme-close-up': 'extreme close-up portrait, face detail',
            'close-up': 'close-up portrait',
            'bust-shot': 'bust shot portrait',
            'waist-shot': 'waist shot portrait',
            'half-shot': 'half shot portrait',
            'three-quarter-shot': 'three-quarter shot portrait',
            'full-shot': 'full body shot',
            'long-shot': 'long shot, environmental portrait'
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

        // 2. 성별 + 피부톤 + 나이대 (핵심 정체성)
        const genderMap: Record<string, string> = { male: 'man', female: 'woman', androgynous: 'androgynous person' };
        const skinToneMap: Record<string, string> = {
            fair: 'very fair complexion',
            light: 'fair complexion',
            medium: 'light medium complexion',
            tan: 'medium complexion',
            brown: 'olive tan complexion',
            dark: 'deep dark complexion'
        };
        const ageMap: Record<string, string> = {
            'early-20s': 'young adult in early 20s',
            'late-20s': 'young adult in late 20s',
            '30s': 'adult in 30s',
            '40s-50s': 'middle-aged adult in 40s-50s',
            '60s-70s': 'senior adult in 60s-70s',
            '80plus': 'elderly adult 80 plus'
        };

        const skinTone = skinToneMap[subject.skinTone] || '';
        const age = ageMap[subject.ageGroup] || '';
        const gender = genderMap[subject.gender] || 'person';

        // 외모 프리셋 ID에서 국가/인종 정보 추출 (예: 'korean' -> 'Korean')
        const nationalityLabel = subject.appearancePresetId
            ? subject.appearancePresetId.split('-').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')
            : '';

        // "Korean young adult woman with very fair complexion" 형식
        if (nationalityLabel) {
            parts.push(`${nationalityLabel} ${age} ${gender} with ${skinTone}`.trim());
        } else {
            parts.push(`${skinTone}, ${age} ${gender}`.trim());
        }

        // 3. 체형 (전체적인 실루엣)
        const bodyMap: Record<string, string> = {
            slim: 'with slim build',
            average: 'with average build',
            athletic: 'with athletic build',
            muscular: 'with muscular build',
            curvy: 'with curvy build'
        };
        parts.push(bodyMap[subject.bodyType] || '');

        // Auto 모드가 OFF일 때만 상세 정보 포함
        if (!subject.autoMode) {
            // 4. 머리카락 (시각적 특징)
            const hairColorMap: Record<string, string> = {
                black: 'jet black',
                brown: 'dark brown',
                blonde: 'golden blonde',
                red: 'auburn',
                gray: 'silver gray',
                white: 'platinum blonde'
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

            // 4.5. 눈색 (Eye Color)
            const eyeColorMap: Record<string, string> = {
                black: 'deep black eyes',
                brown: 'dark brown eyes',
                'light-brown': 'light brown eyes',
                hazel: 'hazel eyes',
                blue: 'blue eyes',
                green: 'green eyes',
                gray: 'gray eyes'
            };
            parts.push(eyeColorMap[subject.eyeColor] || '');

            // 4.6. 얼굴형 (Face Shape)
            const faceShapeMap: Record<string, string> = {
                oval: 'oval face shape',
                round: 'round face shape',
                square: 'square face shape',
                heart: 'heart face shape',
                diamond: 'diamond face shape',
                oblong: 'oblong face shape'
            };
            parts.push(faceShapeMap[subject.faceShape] || '');

            // 5. Body Pose
            const bodyPoseMap: Record<string, string> = {
                straight: 'straight frontal stance',
                contrapposto: 'elegant contrapposto pose',
                's-curve': 's-curve body pose',
                'three-quarter-turn': 'three-quarter turn pose',
                sitting: 'sitting pose',
                reclining: 'reclining pose'
            };
            parts.push(bodyPoseMap[subject.bodyPose] || bodyPoseMap['contrapposto']);

            // 6. Hand Pose
            const handPoseMap: Record<string, string> = {
                'natural-relaxed': 'relaxed natural hands',
                'editorial-hands': 'editorial hands touching face',
                'pocket-hands': 'hands in pockets',
                'crossed-arms': 'arms crossed',
                'framing-face': 'hands framing face',
                'hair-touch': 'touching hair'
            };
            parts.push(handPoseMap[subject.handPose] || '');

            // 7. Expression
            const expressionMap: Record<string, string> = {
                'natural-smile': 'natural warm smile',
                'bright-smile': 'bright joyful smile',
                'subtle-smile': 'subtle elegant smile',
                'neutral': 'neutral expression',
                'serious': 'serious expression',
                'pensive': 'pensive thoughtful expression',
                'mysterious': 'mysterious expression',
                'intense': 'intense expression',
                'playful': 'playful expression',
                'sensual': 'sensual expression'
            };
            parts.push(expressionMap[subject.expression] || '');

            // 8. Gaze
            const gazeMap: Record<string, string> = {
                'direct-eye-contact': 'direct eye contact with camera',
                'off-camera': 'looking off-camera',
                'looking-up': 'looking upward',
                'looking-down': 'looking downward',
                'side-gaze': 'side gaze',
                'over-shoulder': 'looking over shoulder',
                'eyes-closed': 'eyes closed',
                'half-closed-eyes': 'half-closed eyes'
            };
            parts.push(gazeMap[subject.gazeDirection] || '');

            // 9. 패션 (마지막 - 의상) - value를 prompt로 변환
            const fashionParts: string[] = [];
            const topPrompt = TOP_WEAR_OPTIONS.find(o => o.value === subject.topWear)?.prompt;
            const bottomPrompt = BOTTOM_WEAR_OPTIONS.find(o => o.value === subject.bottomWear)?.prompt;
            const footPrompt = FOOTWEAR_OPTIONS.find(o => o.value === subject.footwear)?.prompt;
            const accPrompt = ACCESSORY_OPTIONS.find(o => o.value === subject.accessory)?.prompt;
            if (topPrompt) fashionParts.push(topPrompt);
            if (bottomPrompt) fashionParts.push(bottomPrompt);
            if (footPrompt) fashionParts.push(footPrompt);
            if (accPrompt) fashionParts.push(accPrompt);
            if (fashionParts.length > 0) {
                parts.push(`wearing ${fashionParts.join(', ')}`);
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

        // 1. focalLength + category 조합 (예: "24mm wide lens look")
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
            // 그 외일 때: 모드별 characteristic 오버라이드 우선, 없으면 기본 characteristic 사용
            const charType = this.settings.artDirection.lensCharacteristicType;
            const modeSpecificMap: Record<string, string | undefined> = {
                studio: lens.characteristic_studio,
                landscape: lens.characteristic_landscape,
                architecture: lens.characteristic_architecture,
                product: lens.characteristic_product,
                street: lens.characteristic_street,
            };
            // 모드별 값이 있으면 사용, 없으면 기본 characteristic 폴백
            const charKeywords = modeSpecificMap[charType] || lens.characteristic;

            if (charKeywords) {
                parts.push(charKeywords);
            }
        }

        return parts.join(', ');
    }

    private getCameraSettings(): string {
        const { iso, aperture, whiteBalance, shutterSpeed, isoAuto, shutterSpeedAuto, apertureAuto } = this.settings.camera;
        const parts: string[] = [];

        const isStudioMode = this.settings.artDirection.lensCharacteristicType === 'studio';
        const isLightingOn = this.settings.lighting.enabled;

        // 스펙: 라이팅 ON일 때는 ISO/셔터/색온도 생략
        if (isStudioMode && isLightingOn) {
            // 라이팅 ON: 이 함수에서는 아무것도 추가 안함 (렌즈 특성은 getLens에서 처리)
            return '';
        }

        // 라이팅 OFF: 언어 표현 매핑 사용

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

        // 셔터스피드 → 모션 표현 (Auto가 아닐 때만, 극단적인 경우만)
        if (!shutterSpeedAuto && shutterSpeed) {
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
            special: lighting.special,
        });
    }

    private getComposition(): string {
        const parts: string[] = [];
        const framing = this.settings.userInput?.studioComposition || 'half-shot';

        if (this.settings.artDirection.cameraAngle) {
            // Dictionary 기반 구도별 앵글 프롬프트 조회
            const anglePrompt = getPrompt(ANGLE_DICT, this.settings.artDirection.cameraAngle, { framing });
            if (anglePrompt) {
                parts.push(anglePrompt);
            }
        }

        return parts.filter(Boolean).join(', ');
    }

    private getAspectRatio(): string {
        const { aspectRatio } = this.settings.camera;
        if (!aspectRatio) return '';

        // 가로(3:2, 4:3 등) vs 세로(2:3, 3:4 등) 판단
        const [w, h] = aspectRatio.split(':').map(Number);
        const isPortrait = h > w;
        const isSquare = h === w;

        // 카메라 mount 기반 동적 타입 라벨
        const camera = getCameraById(this.settings.camera.bodyId);
        const cameraType = camera ? getCameraTypeLabel(camera.mount) : 'DSLR';

        // 비율별 전체 프롬프트 (세로 비율은 맞춤 프롬프트 사용)
        const ratioPrompts: Record<string, string> = {
            // 세로 (Portrait)
            '2:3': `A 2:3 ratio ${cameraType} portrait`,
            '3:4': 'A 3:4 ratio portrait',
            '9:16': 'A 9:16 smartphone portrait',
            '4:5': 'A 4:5 ratio large format portrait',
            // 가로 (Landscape) - landscape orientation 추가
            '3:2': `A 3:2 ratio ${cameraType} photograph, landscape orientation`,
            '4:3': 'A 4:3 ratio photograph, landscape orientation',
            '16:9': 'A 16:9 cinematic widescreen photograph, landscape orientation',
            '5:4': 'A 5:4 ratio large format photograph, landscape orientation',
            // 정사각형
            '1:1': 'A 1:1 square format photograph',
        };

        const prompt = ratioPrompts[aspectRatio];
        if (prompt) {
            return prompt;
        }

        // 기본 폴백
        if (isSquare) {
            return `A ${aspectRatio} square format`;
        }
        const orientationText = isPortrait ? 'vertical portrait' : 'horizontal landscape orientation';
        return `A ${aspectRatio} ${orientationText}`;
    }

    // ===== 새 IR 슬롯 메서드 =====

    /**
     * [Location] - 배경/장소
     */
    private getLocation(): string {
        const backgroundType = this.settings.userInput?.studioBackgroundType;
        if (!backgroundType) return '';

        const backgroundMap: Record<string, string> = {
            'seamless_white': 'clean white studio backdrop',
            'seamless_gray': 'neutral gray studio backdrop',
            'seamless_black': 'dark black studio backdrop',
            'seamless_red': 'wine red studio backdrop',
            'seamless_blue': 'chromakey blue screen',
            'seamless_green': 'chromakey green screen',
            'seamless_beige': 'warm beige studio backdrop',
            'textured': 'textured studio backdrop'
        };

        return backgroundMap[backgroundType] || 'studio backdrop';
    }

    /**
     * [Fashion] - 패션/의상
     */
    private getFashion(): string {
        const subjects = this.settings.userInput?.studioSubjects || [];
        if (subjects.length === 0) return '';

        const isMultiple = subjects.length >= 2;
        const fashionDescriptions = subjects.map((subject, idx) => {
            const fashionParts: string[] = [];
            const topPrompt = TOP_WEAR_OPTIONS.find(o => o.value === subject.topWear)?.prompt;
            const bottomPrompt = BOTTOM_WEAR_OPTIONS.find(o => o.value === subject.bottomWear)?.prompt;
            const footPrompt = FOOTWEAR_OPTIONS.find(o => o.value === subject.footwear)?.prompt;
            const accPrompt = ACCESSORY_OPTIONS.find(o => o.value === subject.accessory)?.prompt;

            if (topPrompt) fashionParts.push(this.addArticle(topPrompt));
            if (bottomPrompt) fashionParts.push(bottomPrompt);
            if (footPrompt) fashionParts.push(footPrompt);
            if (accPrompt) fashionParts.push(this.addArticle(accPrompt));

            if (fashionParts.length === 0) return '';

            const fashionText = this.joinWithAnd(fashionParts);
            const prefix = isMultiple ? `Person ${idx + 1}: ` : '';
            return `${isMultiple ? '- ' : ''}${prefix}wearing ${fashionText}`;
        }).filter(Boolean);

        if (fashionDescriptions.length === 0) return '';

        if (isMultiple) {
            return fashionDescriptions.join('\n');
        }
        return fashionDescriptions.join(' ');
    }

    /**
     * [Expression/Pose] - 표정, 포즈, 시선
     */
    private getExpressionPose(): string {
        const subjects = this.settings.userInput?.studioSubjects || [];
        if (subjects.length === 0) return '';

        const isMultiple = subjects.length >= 2;
        const framing = this.settings.userInput?.studioComposition || 'half-shot';

        const descriptions = subjects.map((subject, idx) => {
            // Dictionary 기반 구도별 프롬프트 조회
            const bodyPose = getPrompt(BODY_POSE_DICT, subject.bodyPose, { framing });
            const handPose = getPrompt(HAND_POSE_DICT, subject.handPose, { framing });

            const expressionMap: Record<string, string> = {
                'natural-smile': 'a natural warm smile',
                'bright-smile': 'a bright joyful smile',
                'subtle-smile': 'a subtle elegant smile',
                'neutral': 'a neutral expression',
                'serious': 'a serious expression',
                'pensive': 'a pensive thoughtful expression',
                'mysterious': 'a mysterious expression',
                'intense': 'an intense expression',
                'playful': 'a playful expression',
                'sensual': 'a sensual expression'
            };

            const gazeMap: Record<string, string> = {
                'direct-eye-contact': 'direct eye contact with the camera',
                'off-camera': 'looking off-camera',
                'looking-up': 'looking upward',
                'looking-down': 'looking downward',
                'side-gaze': 'a side gaze',
                'over-shoulder': 'looking over shoulder',
                'eyes-closed': 'eyes closed',
                'half-closed-eyes': 'half-closed eyes'
            };

            const expression = expressionMap[subject.expression] || '';
            const gaze = gazeMap[subject.gazeDirection] || '';

            const parts: string[] = [];

            if (bodyPose && handPose) {
                parts.push(`in ${bodyPose} with ${handPose}`);
            } else if (bodyPose) {
                parts.push(`in ${bodyPose}`);
            } else if (handPose) {
                parts.push(`with ${handPose}`);
            }

            if (expression) parts.push(expression);
            if (gaze) parts.push(gaze);

            if (parts.length === 0) return '';

            const prefix = isMultiple ? `Person ${idx + 1}: ` : '';
            return `${isMultiple ? '- ' : ''}${prefix}${this.joinWithAnd(parts)}`;
        }).filter(Boolean);

        if (descriptions.length === 0) return '';

        if (isMultiple) {
            return descriptions.join('\n');
        }
        return descriptions.join(' ');
    }

    /**
     * [Tech Specs] - 카메라/렌즈 상세 스펙
     */
    private getTechSpecs(): string {
        const camera = getCameraById(this.settings.camera?.bodyId);
        const lens = getLensById(this.settings.camera?.lensId);

        if (!camera && !lens) return '';

        const sentences: string[] = [];

        const cameraText = camera ? `${camera.brand} ${camera.model}` : '';
        const lensText = lens ? `${lens.brand} ${lens.model}` : '';
        const characteristic = lens?.characteristic_studio || '';

        if (cameraText && lensText && characteristic) {
            sentences.push(`Shot on a ${cameraText} with a ${lensText} lens for ${characteristic}.`);
        } else if (cameraText && lensText) {
            sentences.push(`Shot on a ${cameraText} with a ${lensText} lens.`);
        } else if (cameraText) {
            sentences.push(`Shot on a ${cameraText}.`);
        } else if (lensText) {
            sentences.push(`Shot with a ${lensText} lens.`);
        }

        const currentAperture = this.settings.camera?.aperture;
        if (lens && currentAperture) {
            const isMaxAperture = currentAperture === lens.maxAperture;
            if (isMaxAperture) {
                if (lens.bokeh) {
                    sentences.push(`Shallow depth of field (${currentAperture}) creates ${lens.bokeh} that perfectly isolates the subject.`);
                }
                if (lens.vignetting) {
                    sentences.push(`${lens.vignetting} adds artistic depth to the image.`);
                }
            } else if (currentAperture) {
                sentences.push(`Shot at ${currentAperture} aperture.`);
            }
        }

        return sentences.join(' ');
    }

    // ===== 유틸리티 헬퍼 =====

    private addArticle(text: string): string {
        if (!text) return text;
        const vowels = ['a', 'e', 'i', 'o', 'u'];
        const firstChar = text.toLowerCase().charAt(0);
        const article = vowels.includes(firstChar) ? 'an' : 'a';
        return `${article} ${text}`;
    }

    private joinWithAnd(parts: string[]): string {
        if (parts.length === 0) return '';
        if (parts.length === 1) return parts[0];
        if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
        return `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`;
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
