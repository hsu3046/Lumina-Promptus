// lib/exporters/NanoBananaProExporter.ts
// Nano Banana Pro 모델용 8섹션 프롬프트 Exporter

import type { PromptIR, UserSettings, StudioSubject } from '@/types';
import { getCameraById } from '@/config/mappings/cameras';
import { getLensById } from '@/config/mappings/lenses';
import {
    TOP_WEAR_OPTIONS,
    BOTTOM_WEAR_OPTIONS,
    FOOTWEAR_OPTIONS,
    ACCESSORY_OPTIONS,
} from '@/config/mappings/fashion-options';

export class NanoBananaProExporter {
    private ir: PromptIR;
    private settings: UserSettings;

    constructor(ir: PromptIR, settings?: UserSettings) {
        this.ir = ir;
        // settings가 제공되지 않으면 IR에서 추론 (하위 호환성)
        this.settings = settings || {} as UserSettings;
    }

    /**
     * IR을 Nano Banana Pro 8섹션 구조 프롬프트로 변환
     * [Subject] → [Fashion] → [Pose] → [Face] → [Composition] → [Lighting] → [Location] → [Tech Specs] → [Style]
     */
    export(): string {
        const sections: string[] = [];
        const subjects = this.settings.userInput?.studioSubjects || [];
        const isMultiple = subjects.length >= 2;

        // 1. [Subject] - 외모 (성별+나이+체형+얼굴형+눈색+피부톤+머리색+헤어스타일)
        const subject = this.getSubjectSection();
        if (subject) sections.push(subject);

        // 2. [Fashion] - 패션 (상의+하의+신발+악세서리)
        const fashion = this.getFashionSection();
        if (fashion) sections.push(fashion);

        // 3. [Composition] - 프레이밍, 구도, 앵글
        const composition = this.getCompositionSection();
        if (composition) sections.push(composition);

        // 4. [Expression/Pose] - 포즈, 표정, 시선 통합
        const expressionPose = this.getExpressionPoseSection();
        if (expressionPose) sections.push(expressionPose);

        // 5. [Location] - 배경
        const location = this.getLocationSection();
        if (location) sections.push(location);

        // 6. [Lighting] - 조명 설정
        const lighting = this.getLightingSection();
        if (lighting) sections.push(lighting);

        // 8. [Tech Specs] - 카메라 바디, 렌즈
        const techSpecs = this.getTechSpecsSection();
        if (techSpecs) sections.push(techSpecs);

        // 9. [Style] - 카메라/렌즈 characteristics + bokeh + vignetting
        const style = this.getStyleSection();
        if (style) sections.push(style);

        // 2명 이상일 때 섹션 사이에 빈 줄 추가
        return sections.filter(Boolean).join(isMultiple ? '\n\n' : ' ');
    }

    /**
     * [Composition] - 프레이밍(구도), 구성 규칙, 앵글
     * 문장 구조: 
     * - A 굳 classic 35mm portrait with a bust-shot framing.
     * - The subject is aligned with the rule of thirds composition.
     * - Shot from a direct eye-level angle.
     */
    private getCompositionSection(): string {
        const sentences: string[] = [];

        // 1. 첫 번째 문장: 비율 + 프레이밍
        const aspectRatio = this.ir.slots.aspect_ratio?.content || '';
        const framing = this.settings.userInput?.studioComposition;

        const framingMap: Record<string, string> = {
            'extreme-close-up': 'extreme close-up',
            'close-up': 'close-up',
            'bust-shot': 'bust shot',
            'waist-shot': 'waist shot',
            'half-shot': 'medium shot',
            'three-quarter-shot': 'knee shot',
            'full-shot': 'full body shot',
            'long-shot': 'long shot',
        };
        const framingText = framingMap[framing || ''] || 'standard';

        // 첫 번째 피사체의 여백(margin) 가져오기
        const subjects = this.settings.userInput?.studioSubjects || [];
        const margin = subjects?.[0]?.margin || 'normal';
        const isMultipleSubjects = subjects.length >= 2;

        // 여백에 따른 텍스트 (normal이면 추가 안함)
        const marginText = margin === 'tight' ? 'tight ' : margin === 'loose' ? 'loose ' : '';

        if (aspectRatio) {
            sentences.push(`${aspectRatio} with a ${marginText}${framingText} framing.`);
        } else if (framing) {
            sentences.push(`A ${marginText}${framingText} framing.`);
        }

        // 2. 두 번째 문장: 앵글
        const cameraAngle = this.settings.artDirection?.cameraAngle;
        if (cameraAngle) {
            const angleMap: Record<string, string> = {
                'eye_level': 'a direct eye-level',
                'high_angle': 'a high',
                'low_angle': 'a low',
                'birds_eye': 'a bird\'s eye',
                'worms_eye': 'a worm\'s eye'
            };
            const angleText = angleMap[cameraAngle] || cameraAngle;
            sentences.push(`Shot from ${angleText} angle.`);
        }

        // 3. 위치 정보: 2명 이상일 때 각 인물의 위치 표시
        if (isMultipleSubjects) {
            const positionDescriptions = subjects.map((subject, idx) => {
                if (!subject.position || subject.position === 'center') return null;
                const positionText = subject.position === 'left' ? 'left' : 'right';
                return `Person ${idx + 1} is positioned on the ${positionText} side`;
            }).filter(Boolean);

            if (positionDescriptions.length > 0) {
                sentences.push(`${positionDescriptions.join(', ')}.`);
            }
        } else if (subjects.length === 1 && subjects[0]?.position && subjects[0]?.position !== 'center') {
            // 1명일 때 기존 로직
            const positionText = subjects[0].position === 'left' ? 'left' : 'right';
            sentences.push(`The subject positioned on the ${positionText} side of the frame.`);
        }

        if (sentences.length === 0) return '';
        return `[Composition] ${sentences.join(' ')}`;
    }

    /**
     * [Subject] - 외모 정보만 추출
     * 성별+나이+체형+얼굴형+눈색+피부톤+머리색+헤어스타일
     */
    private getSubjectSection(): string {
        const subjects = this.settings.userInput?.studioSubjects || [];
        if (subjects.length === 0) {
            // IR에서 subject 슬롯 사용 (fallback)
            const subjectContent = this.ir.slots.subject?.content || '';
            if (!subjectContent) return '';
            return `[Subject & Fashion]\n${subjectContent}`;
        }

        const isMultiple = subjects.length >= 2;
        const descriptions = subjects.map((subject, idx) => {
            const desc = this.buildAppearanceDescription(subject, isMultiple ? idx + 1 : null);
            // 2명 이상일 때 "- Person N:" 형식
            return isMultiple ? `- ${desc}` : desc;
        });

        // 피사체가 2명 이상일 때 통합 사진 지시문 + 줄바꿈 구조
        if (isMultiple) {
            const unifiedInstruction = `Display the following ${subjects.length} people together in a single unified photograph without any dividing lines or frames.`;
            return `${unifiedInstruction}\n\n[Subject]\n${descriptions.join('\n')}`;
        }

        return `[Subject] ${descriptions.join(' ')}`;
    }

    /**
     * 외모 정보만 추출 (패션/포즈/표정 제외)
     */
    private buildAppearanceDescription(subject: StudioSubject, personNumber: number | null): string {
        const parts: string[] = [];

        if (personNumber) {
            parts.push(`Person ${personNumber}:`);
        }

        // 성별
        const genderMap: Record<string, string> = { male: 'man', female: 'woman', androgynous: 'androgynous model' };
        const gender = genderMap[subject.gender] || 'person';

        // 나이 (gender와 조합하여 사용)
        const ageMap: Record<string, string> = {
            'early-20s': 'young',
            'late-20s': 'young',
            '30s': '',
            '40s-50s': 'middle-aged',
            '60s-70s': 'senior',
            '80plus': 'elderly'
        };
        const agePrefix = ageMap[subject.ageGroup] || '';

        // 나이 상세 (in early 20s, in 30s 등)
        const ageDetailMap: Record<string, string> = {
            'early-20s': 'in early 20s',
            'late-20s': 'in late 20s',
            '30s': 'in 30s',
            '40s-50s': 'in 40s-50s',
            '60s-70s': 'in 60s-70s',
            '80plus': '80 plus'
        };
        const ageDetail = ageDetailMap[subject.ageGroup] || '';

        // 피부톤
        const skinToneMap: Record<string, string> = {
            fair: 'very fair complexion',
            light: 'fair complexion',
            medium: 'light medium complexion',
            tan: 'medium complexion',
            brown: 'olive tan complexion',
            dark: 'deep dark complexion'
        };
        const skinTone = skinToneMap[subject.skinTone] || '';

        // 체형
        const bodyMap: Record<string, string> = {
            slim: 'slim build',
            average: 'average build',
            athletic: 'athletic build',
            muscular: 'muscular build',
            curvy: 'curvy build'
        };
        const bodyType = bodyMap[subject.bodyType] || '';

        // 얼굴형
        const faceShapeMap: Record<string, string> = {
            oval: 'an oval face',
            round: 'a round face',
            square: 'a square face',
            heart: 'a heart-shaped face',
            diamond: 'a diamond face',
            oblong: 'an oblong face'
        };
        const faceShape = faceShapeMap[subject.faceShape] || '';

        // 눈색
        const eyeColorMap: Record<string, string> = {
            black: 'deep black eyes',
            brown: 'dark brown eyes',
            'light-brown': 'light brown eyes',
            hazel: 'hazel eyes',
            blue: 'blue eyes',
            green: 'green eyes',
            gray: 'gray eyes'
        };
        const eyeColor = eyeColorMap[subject.eyeColor] || '';

        // 머리색
        const hairColorMap: Record<string, string> = {
            black: 'jet black',
            brown: 'dark brown',
            blonde: 'golden blonde',
            red: 'auburn',
            gray: 'silver gray',
            white: 'platinum blonde'
        };

        // 헤어스타일
        const hairStyleMap: Record<string, string> = {
            short: 'short', medium: 'medium-length', long: 'long flowing',
            wavy: 'wavy', curly: 'curly', straight: 'straight',
            bald: 'bald', ponytail: 'ponytail', bun: 'elegant bun', braids: 'braided'
        };

        let hair = '';
        if (subject.hairStyle === 'bald') {
            hair = 'bald head';
        } else {
            hair = `${hairStyleMap[subject.hairStyle] || ''} ${hairColorMap[subject.hairColor] || ''} hair`.trim();
        }

        // 외모 프리셋 ID에서 국가/인종 정보 추출 (예: 'korean' -> 'Korean')
        const nationalityLabel = subject.appearancePresetId
            ? subject.appearancePresetId.split('-').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')
            : '';

        // 조합: "A Korean young man in his early 20s with a fair complexion and an average build"
        // 1) 국적(있으면)+나이+성별+나이상세
        const subjectCore = nationalityLabel
            ? `${nationalityLabel} ${agePrefix} ${gender} in ${subject.gender === 'male' ? 'his' : 'her'} ${ageDetail.replace('in ', '')}`
            : (agePrefix ? `${agePrefix} ${gender} in ${subject.gender === 'male' ? 'his' : 'her'} ${ageDetail.replace('in ', '')}` : `${gender} in ${subject.gender === 'male' ? 'his' : 'her'} ${ageDetail.replace('in ', '')}`);
        // 2) 피부톤+체형: "with a fair complexion and an average build"
        const physicalDesc = `with a ${skinTone.replace(' complexion', '')} complexion and ${bodyType.startsWith('a') ? 'an' : 'a'} ${bodyType}`;
        // 3) 얼굴형, 눈색, 머리카락은 별도의 문장
        parts.push(`A ${subjectCore} ${physicalDesc}, featuring ${faceShape}, ${eyeColor}, and ${hair}`);

        return parts.join(' ').replace(/\s+/g, ' ').trim();
    }

    /**
     * [Fashion] - 패션 정보 (상의+하의+신발+악세서리)
     */
    private getFashionSection(): string {
        const subjects = this.settings.userInput?.studioSubjects || [];
        if (subjects.length === 0) return '';

        const isMultiple = subjects.length >= 2;
        const fashionDescriptions = subjects.map((subject, idx) => {
            const fashionParts: string[] = [];
            const topPrompt = TOP_WEAR_OPTIONS.find(o => o.value === subject.topWear)?.prompt;
            const bottomPrompt = BOTTOM_WEAR_OPTIONS.find(o => o.value === subject.bottomWear)?.prompt;
            const footPrompt = FOOTWEAR_OPTIONS.find(o => o.value === subject.footwear)?.prompt;
            const accPrompt = ACCESSORY_OPTIONS.find(o => o.value === subject.accessory)?.prompt;

            // 관사(a/an) 추가
            if (topPrompt) fashionParts.push(this.addArticle(topPrompt));
            if (bottomPrompt) fashionParts.push(bottomPrompt); // pants, jeans 등 복수형은 관사 없음
            if (footPrompt) fashionParts.push(footPrompt); // sneakers, shoes 등 복수형은 관사 없음
            if (accPrompt) fashionParts.push(this.addArticle(accPrompt));

            if (fashionParts.length === 0) return '';

            // 마지막 항목 앞에 "and" 추가
            const fashionText = this.joinWithAnd(fashionParts);
            const prefix = isMultiple ? `Person ${idx + 1}: ` : '';
            return `${isMultiple ? '- ' : ''}${prefix}wearing ${fashionText}`;
        }).filter(Boolean);

        if (fashionDescriptions.length === 0) return '';

        // 2명 이상일 때 줄바꿈 구조
        if (isMultiple) {
            return `[Fashion]\n${fashionDescriptions.join('\n')}`;
        }
        return `[Fashion] ${fashionDescriptions.join(' ')}`;
    }

    /**
     * 단어에 적절한 관사(a/an) 추가
     */
    private addArticle(text: string): string {
        if (!text) return text;
        const vowels = ['a', 'e', 'i', 'o', 'u'];
        const firstChar = text.toLowerCase().charAt(0);
        const article = vowels.includes(firstChar) ? 'an' : 'a';
        return `${article} ${text}`;
    }

    /**
     * 배열을 쉼표로 연결하되, 마지막 항목 앞에 "and" 추가
     * 예: ["a", "b", "c"] → "a, b, and c"
     */
    private joinWithAnd(parts: string[]): string {
        if (parts.length === 0) return '';
        if (parts.length === 1) return parts[0];
        if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
        return `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`;
    }

    /**
     * [Expression/Pose] - 포즈, 표정, 시선 통합
     * 예: "in an elegant contrapposto pose with relaxed natural hands, a natural warm smile, and direct eye contact with the camera"
     */
    private getExpressionPoseSection(): string {
        const subjects = this.settings.userInput?.studioSubjects || [];
        if (subjects.length === 0) return '';

        const isMultiple = subjects.length >= 2;
        const descriptions = subjects.map((subject, idx) => {
            // 바디 포즈
            const bodyPoseMap: Record<string, string> = {
                straight: 'a natural standing pose',
                contrapposto: 'an elegant contrapposto pose',
                's-curve': 'an s-curve body pose',
                'three-quarter-turn': 'a three-quarter turn pose',
                sitting: 'a sitting pose',
                reclining: 'a reclining pose'
            };

            // 핸드 포즈
            const handPoseMap: Record<string, string> = {
                'natural-relaxed': 'relaxed natural hands',
                'editorial-hands': 'editorial hands touching face',
                'pocket-hands': 'hands in pockets',
                'crossed-arms': 'arms crossed',
                'framing-face': 'hands framing face',
                'hair-touch': 'touching hair'
            };

            // 표정
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

            // 시선
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

            const bodyPose = bodyPoseMap[subject.bodyPose] || '';
            const handPose = handPoseMap[subject.handPose] || '';
            const expression = expressionMap[subject.expression] || '';
            const gaze = gazeMap[subject.gazeDirection] || '';

            // 조합: "in an elegant contrapposto pose with relaxed natural hands, a natural warm smile, and direct eye contact with the camera"
            const parts: string[] = [];

            // 포즈 부분: "in {pose} with {handPose}"
            if (bodyPose && handPose) {
                parts.push(`in ${bodyPose} with ${handPose}`);
            } else if (bodyPose) {
                parts.push(`in ${bodyPose}`);
            } else if (handPose) {
                parts.push(`with ${handPose}`);
            }

            // 표정, 시선 추가
            if (expression) parts.push(expression);
            if (gaze) parts.push(gaze);

            if (parts.length === 0) return '';

            const prefix = isMultiple ? `Person ${idx + 1}: ` : '';
            return `${isMultiple ? '- ' : ''}${prefix}${this.joinWithAnd(parts)}`;
        }).filter(Boolean);

        if (descriptions.length === 0) return '';

        // 2명 이상일 때 줄바꿈 구조
        if (isMultiple) {
            return `[Expression/Pose]\n${descriptions.join('\n')}`;
        }
        return `[Expression/Pose] ${descriptions.join(' ')}`;
    }

    /**
     * [Lighting] - 조명 설정
     */
    private getLightingSection(): string {
        const content = this.ir.slots.lighting?.content || '';
        if (!content) return '';
        return `[Lighting] ${content}`;
    }

    /**
     * [Location] - 배경
     */
    private getLocationSection(): string {
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

        const background = backgroundMap[backgroundType] || 'studio backdrop';
        return `[Location] ${background}`;
    }

    /**
     * [Tech Specs] - 카메라 바디, 렌즈, 조리개
     * 문장 구조:
     * - Shot on a Sony A7R V with a Sony FE 85mm f/1.4 GM lens for extreme sharpness and resolution.
     * - Shallow depth of field (f/1.4) creates a creamy, cinematic bokeh background that perfectly isolates the subject.
     */
    private getTechSpecsSection(): string {
        const camera = getCameraById(this.settings.camera?.bodyId);
        const lens = getLensById(this.settings.camera?.lensId);

        if (!camera && !lens) {
            // Fallback to IR slots
            const cameraBody = this.ir.slots.camera_body?.content || '';
            const lensContent = this.ir.slots.lens?.content || '';
            if (cameraBody || lensContent) {
                return `[Tech Specs] ${[cameraBody, lensContent].filter(Boolean).join(', ')}`;
            }
            return '';
        }

        const sentences: string[] = [];

        // 1. 첫 번째 문장: "Shot on a {Camera} with a {Lens} lens for {characteristic_studio}."
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

        // 2. 두 번째 문장: 조리개가 maxAperture인 경우 bokeh + vignetting 설명 추가
        const currentAperture = this.settings.camera?.aperture;
        if (lens && currentAperture) {
            const isMaxAperture = currentAperture === lens.maxAperture;
            if (isMaxAperture) {
                // Bokeh 설명
                if (lens.bokeh) {
                    sentences.push(`Shallow depth of field (${currentAperture}) creates ${lens.bokeh} that perfectly isolates the subject.`);
                }
                // Vignetting 설명
                if (lens.vignetting) {
                    sentences.push(`${lens.vignetting} adds artistic depth to the image.`);
                }
            } else if (currentAperture) {
                // maxAperture가 아닌 경우 간단한 조리개 정보
                sentences.push(`Shot at ${currentAperture} aperture.`);
            }
        }

        if (sentences.length === 0) return '';
        return `[Tech Specs] ${sentences.join(' ')}`;
    }

    /**
     * [Style] - ISO, Shutter Speed 정보 (Auto가 아닌 경우만)
     */
    private getStyleSection(): string {
        const parts: string[] = [];

        // ISO (Auto가 아닌 경우만)
        const iso = this.settings.camera?.iso;
        const isoAuto = this.settings.camera?.isoAuto;
        if (iso && !isoAuto) {
            if (iso <= 400) {
                parts.push(`ISO ${iso} for clean noise-free image`);
            } else if (iso <= 1600) {
                parts.push(`ISO ${iso} for balanced noise and light sensitivity`);
            } else {
                parts.push(`ISO ${iso} for low-light conditions with visible grain`);
            }
        }

        // Shutter Speed (Auto가 아닌 경우만)
        const shutterSpeed = this.settings.camera?.shutterSpeed;
        const shutterSpeedAuto = this.settings.camera?.shutterSpeedAuto;
        if (shutterSpeed && !shutterSpeedAuto) {
            // 셔터 스피드 값에서 숫자 추출 (예: "1/500" -> 500)
            const speedMatch = shutterSpeed.match(/1\/(\d+)/);
            if (speedMatch) {
                const speed = parseInt(speedMatch[1]);
                if (speed >= 500) {
                    parts.push(`${shutterSpeed}s shutter speed freezing all motion`);
                } else if (speed >= 125) {
                    parts.push(`${shutterSpeed}s shutter speed for sharp handheld shots`);
                } else {
                    parts.push(`${shutterSpeed}s shutter speed allowing some motion blur`);
                }
            } else if (shutterSpeed.includes('"')) {
                // 긴 노출 (예: "2"")
                parts.push(`${shutterSpeed} long exposure for smooth motion effects`);
            }
        }

        if (parts.length === 0) return '';
        return `[Style] ${parts.join('. ')}.`;
    }

    /**
     * 프롬프트 메타데이터 반환
     */
    getMetadata(): {
        totalTokens: number;
        slotBreakdown: Record<string, number>;
        warnings: string[];
    } {
        const slotBreakdown: Record<string, number> = {};
        let totalTokens = 0;

        for (const [slotId, slot] of Object.entries(this.ir.slots)) {
            slotBreakdown[slotId] = slot.tokens;
            totalTokens += slot.tokens;
        }

        const warnings: string[] = [];
        if (totalTokens > 1500) {
            warnings.push(`프롬프트가 권장 길이(1500 토큰)를 초과합니다: ${totalTokens} 토큰`);
        }

        return { totalTokens, slotBreakdown, warnings };
    }
}
