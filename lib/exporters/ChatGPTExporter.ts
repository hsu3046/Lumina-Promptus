// lib/exporters/ChatGPTExporter.ts
// ChatGPT/DALL-E 최적화 프롬프트 Exporter
// NanoBananaProExporter와 동일한 구조 사용

import type { PromptIR, UserSettings, StudioSubject } from '@/types';
import { getCameraById } from '@/config/mappings/cameras';
import { getLensById } from '@/config/mappings/lenses';
import {
    TOP_WEAR_OPTIONS,
    BOTTOM_WEAR_OPTIONS,
    FOOTWEAR_OPTIONS,
    ACCESSORY_OPTIONS,
} from '@/config/mappings/fashion-options';

export class ChatGPTExporter {
    private ir: PromptIR;
    private settings: UserSettings;

    constructor(ir: PromptIR, settings?: UserSettings) {
        this.ir = ir;
        this.settings = settings || {} as UserSettings;
    }

    /**
     * IR을 ChatGPT 8섹션 구조 프롬프트로 변환
     * Location: → Subject: → Fashion: → Expression/Pose: → Composition: → Lighting: → Tech Specs: → Style:
     */
    export(): string {
        const sections: string[] = [];

        // 1. Location - 배경 (먼저!)
        const location = this.getLocationSection();
        if (location) sections.push(location);

        // 2. Subject - 외모
        const subject = this.getSubjectSection();
        if (subject) sections.push(subject);

        // 3. Fashion - 패션
        const fashion = this.getFashionSection();
        if (fashion) sections.push(fashion);

        // 4. Expression/Pose - 포즈, 표정, 시선 통합
        const expressionPose = this.getExpressionPoseSection();
        if (expressionPose) sections.push(expressionPose);

        // 5. Composition - 프레이밍, 구도, 앵글
        const composition = this.getCompositionSection();
        if (composition) sections.push(composition);

        // 6. Lighting - 조명 설정
        const lighting = this.getLightingSection();
        if (lighting) sections.push(lighting);

        // 7. Tech Specs - 카메라 바디, 렌즈
        const techSpecs = this.getTechSpecsSection();
        if (techSpecs) sections.push(techSpecs);

        // 8. Style - ISO, Shutter Speed
        const style = this.getStyleSection();
        if (style) sections.push(style);

        // 각 섹션 끝의 마침표 제거 후 '. '로 조합 (이중 마침표 방지)
        const content = sections.filter(Boolean).map(s => s.replace(/\.+$/, '')).join('. ');
        return `Create a DSLR editorial portrait. ${content}`;
    }

    /**
     * [Composition] - 프레이밍(구도), 구성 규칙, 앵글
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
        const subjects = this.settings.userInput?.studioSubjects;
        const margin = subjects?.[0]?.margin || 'normal';
        const position = subjects?.[0]?.position || 'center';

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

            // 위치에 따른 텍스트 (center면 추가 안함)
            if (position !== 'center') {
                const positionText = position === 'left' ? 'left' : 'right';
                sentences.push(`Shot from ${angleText} angle. The subject positioned on the ${positionText} side of the frame.`);
            } else {
                sentences.push(`Shot from ${angleText} angle.`);
            }
        }

        if (sentences.length === 0) return '';
        return `Composition: ${sentences.join(' ')}`;
    }

    /**
     * [Subject] - 외모 정보만 추출
     */
    private getSubjectSection(): string {
        const subjects = this.settings.userInput?.studioSubjects || [];
        if (subjects.length === 0) {
            const subjectContent = this.ir.slots.subject?.content || '';
            if (!subjectContent) return '';
            return `Subject & Fashion: ${subjectContent}`;
        }

        const descriptions = subjects.map((subject, idx) => {
            return this.buildAppearanceDescription(subject, subjects.length > 1 ? idx + 1 : null);
        });

        return `Subject: ${descriptions.join(' ')}`;
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

        // 나이
        const ageMap: Record<string, string> = {
            'early-20s': 'young',
            'late-20s': 'young',
            '30s': '',
            '40s-50s': 'middle-aged',
            '60s-70s': 'senior',
            '80plus': 'elderly'
        };
        const agePrefix = ageMap[subject.ageGroup] || '';

        // 나이 상세
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

        // 외모 프리셋 ID에서 국가/인종 정보 추출
        const nationalityLabel = subject.appearancePresetId
            ? subject.appearancePresetId.split('-').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')
            : '';

        // 조합
        const subjectCore = nationalityLabel
            ? `${nationalityLabel} ${agePrefix} ${gender} in ${subject.gender === 'male' ? 'his' : 'her'} ${ageDetail.replace('in ', '')}`
            : (agePrefix ? `${agePrefix} ${gender} in ${subject.gender === 'male' ? 'his' : 'her'} ${ageDetail.replace('in ', '')}` : `${gender} in ${subject.gender === 'male' ? 'his' : 'her'} ${ageDetail.replace('in ', '')}`);
        const physicalDesc = `with a ${skinTone.replace(' complexion', '')} complexion and ${bodyType.startsWith('a') ? 'an' : 'a'} ${bodyType}`;
        parts.push(`A ${subjectCore} ${physicalDesc}, featuring ${faceShape}, ${eyeColor}, and ${hair}`);

        return parts.join(' ').replace(/\s+/g, ' ').trim();
    }

    /**
     * [Fashion] - 패션 정보
     */
    private getFashionSection(): string {
        const subjects = this.settings.userInput?.studioSubjects || [];
        if (subjects.length === 0) return '';

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
            const prefix = subjects.length > 1 ? `Person ${idx + 1}: ` : '';
            return `${prefix}wearing ${fashionText}`;
        }).filter(Boolean);

        if (fashionDescriptions.length === 0) return '';
        return `Fashion: ${fashionDescriptions.join(' ')}`;
    }

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

    /**
     * [Expression/Pose] - 포즈, 표정, 시선 통합
     */
    private getExpressionPoseSection(): string {
        const subjects = this.settings.userInput?.studioSubjects || [];
        if (subjects.length === 0) return '';

        const descriptions = subjects.map((subject, idx) => {
            const bodyPoseMap: Record<string, string> = {
                straight: 'a natural standing pose',
                contrapposto: 'an elegant contrapposto pose',
                's-curve': 'an s-curve body pose',
                'three-quarter-turn': 'a three-quarter turn pose',
                sitting: 'a sitting pose',
                reclining: 'a reclining pose'
            };

            const handPoseMap: Record<string, string> = {
                'natural-relaxed': 'relaxed natural hands',
                'editorial-hands': 'editorial hands touching face',
                'pocket-hands': 'hands in pockets',
                'crossed-arms': 'arms crossed',
                'framing-face': 'hands framing face',
                'hair-touch': 'touching hair'
            };

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

            const bodyPose = bodyPoseMap[subject.bodyPose] || '';
            const handPose = handPoseMap[subject.handPose] || '';
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

            const prefix = subjects.length > 1 ? `Person ${idx + 1}: ` : '';
            return `${prefix}${this.joinWithAnd(parts)}`;
        }).filter(Boolean);

        if (descriptions.length === 0) return '';
        return `Expression/Pose: ${descriptions.join(' ')}`;
    }

    /**
     * [Lighting] - 조명 설정
     */
    private getLightingSection(): string {
        const content = this.ir.slots.lighting?.content || '';
        if (!content) return '';
        return `Lighting: ${content}`;
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
        return `Location: ${background}`;
    }

    /**
     * [Tech Specs] - 카메라 바디, 렌즈, 조리개
     */
    private getTechSpecsSection(): string {
        const camera = getCameraById(this.settings.camera?.bodyId);
        const lens = getLensById(this.settings.camera?.lensId);

        if (!camera && !lens) {
            const cameraBody = this.ir.slots.camera_body?.content || '';
            const lensContent = this.ir.slots.lens?.content || '';
            if (cameraBody || lensContent) {
                return `Tech Specs: ${[cameraBody, lensContent].filter(Boolean).join(', ')}`;
            }
            return '';
        }

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

        if (sentences.length === 0) return '';
        return `Tech Specs: ${sentences.join(' ')}`;
    }

    /**
     * [Style] - ISO, Shutter Speed 정보
     */
    private getStyleSection(): string {
        const parts: string[] = [];

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

        const shutterSpeed = this.settings.camera?.shutterSpeed;
        const shutterSpeedAuto = this.settings.camera?.shutterSpeedAuto;
        if (shutterSpeed && !shutterSpeedAuto) {
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
                parts.push(`${shutterSpeed} long exposure for smooth motion effects`);
            }
        }

        if (parts.length === 0) return '';
        return `Style: ${parts.join('. ')}.`;
    }

    getMetadata(): { totalTokens: number; model: string; } {
        let totalTokens = 0;
        for (const slot of Object.values(this.ir.slots)) {
            totalTokens += slot.tokens;
        }
        return { totalTokens, model: 'chatgpt' };
    }
}
