// lib/exporters/ChatGPTExporter.ts
// ChatGPT/DALL-E 최적화 프롬프트 Exporter
// NanoBananaProExporter와 동일한 구조 사용

import type { PromptIR, UserSettings, StudioSubject } from '@/types';
import { getCameraById, getCameraTypeLabel } from '@/config/mappings/cameras';
import { getLensById } from '@/config/mappings/lenses';
import { getPrompt, ANGLE_DICT } from '@/lib/dictionary';
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
        const subjects = this.settings.userInput?.studioSubjects || [];
        const isMultiple = subjects.length >= 2;
        const isSnap = this.settings.artDirection?.lensCharacteristicType === 'street';

        // 1. Location - 배경 (먼저!)
        const location = this.getLocationSection();
        if (location) sections.push(location);

        // 2. Subject - 외모
        const subject = this.getSubjectSection();
        if (subject) sections.push(subject);

        // Snap 모드에서는 Fashion/Expression 생략
        if (!isSnap) {
            // 3. Fashion - 패션
            const fashion = this.getFashionSection();
            if (fashion) sections.push(fashion);

            // 4. Expression/Pose - 포즈, 표정, 시선 통합
            const expressionPose = this.getExpressionPoseSection();
            if (expressionPose) sections.push(expressionPose);
        }

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

        // 2명 이상일 때 섹션 사이에 빈 줄 추가
        const content = sections.filter(Boolean).join(isMultiple ? '\n\n' : '. ');

        // Snap 모드 prefix
        if (isSnap) {
            return `Generate a candid street photograph. ${content}`;
        }

        // 카메라 mount 기반 동적 타입 라벨
        const camera = getCameraById(this.settings.camera?.bodyId);
        const cameraType = camera ? getCameraTypeLabel(camera.mount) : 'DSLR';

        // 피사체가 2명 이상일 때 통합 사진 지시문 포함
        if (isMultiple) {
            return `Create a ${cameraType} editorial portrait of the following ${subjects.length} people together in a single unified photograph without any dividing lines or frames.\n\n${content}`;
        }

        return `Create a ${cameraType} editorial portrait. ${content}`;
    }

    /**
     * [Composition] - 프레이밍(구도), 구성 규칙, 앵글
     */
    private getCompositionSection(): string {
        const sentences: string[] = [];
        const isSnap = this.settings.artDirection?.lensCharacteristicType === 'street';

        // 1. 첫 번째 문장: 비율 + 프레이밍
        const aspectRatio = this.ir.slots.aspect_ratio?.content || '';

        if (isSnap) {
            // Snap 모드: 렌즈 화각 기반 framing
            const lens = getLensById(this.settings.camera.lensId);
            const snapFramingMap: Record<string, string> = {
                'ultra_wide': 'environmental wide shot',
                'wide': 'full body shot',
                'standard': 'three-quarter shot',
                'medium_telephoto': 'medium shot',
                'telephoto': 'tight medium shot',
                'macro': 'extreme close-up',
            };
            const snapFraming = snapFramingMap[lens?.category || ''] || 'medium shot';

            if (aspectRatio) {
                sentences.push(`${aspectRatio} with a ${snapFraming} framing.`);
            } else {
                sentences.push(`A ${snapFraming} framing.`);
            }

            // Snap 모드: Studio의 angle dictionary 대신 관찰자 시점
            sentences.push('Shot from a natural, observational perspective.');
        } else {
            // Studio 모드: 기존 로직 유지
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

            const subjects = this.settings.userInput?.studioSubjects || [];
            const margin = subjects?.[0]?.margin || 'normal';
            const isMultipleSubjects = subjects.length >= 2;

            const marginText = margin === 'tight' ? 'tight ' : margin === 'loose' ? 'loose ' : '';

            if (aspectRatio) {
                sentences.push(`${aspectRatio} with a ${marginText}${framingText} framing.`);
            } else if (framing) {
                sentences.push(`A ${marginText}${framingText} framing.`);
            }

            const cameraAngle = this.settings.artDirection?.cameraAngle;
            if (cameraAngle) {
                const framing = this.settings.userInput?.studioComposition || 'half-shot';
                const anglePrompt = getPrompt(ANGLE_DICT, cameraAngle, { framing });
                if (anglePrompt) {
                    sentences.push(anglePrompt);
                }
            }

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
                const positionText = subjects[0].position === 'left' ? 'left' : 'right';
                sentences.push(`The subject positioned on the ${positionText} side of the frame.`);
            }
        }

        if (sentences.length === 0) return '';
        return `Composition: ${sentences.join(' ')}`;
    }

    /**
     * [Subject] - 외모 정보만 추출
     */
    private getSubjectSection(): string {
        // Snap(Street) 모드: IR 슬롯의 narrative 직접 사용
        if (this.settings.artDirection?.lensCharacteristicType === 'street') {
            const subjectContent = this.ir.slots.subject?.content || '';
            if (!subjectContent) return '';
            return `Subject: ${subjectContent}`;
        }

        const subjects = this.settings.userInput?.studioSubjects || [];
        if (subjects.length === 0) {
            const subjectContent = this.ir.slots.subject?.content || '';
            if (!subjectContent) return '';
            return `Subject & Fashion: ${subjectContent}`;
        }

        const isMultiple = subjects.length >= 2;
        const descriptions = subjects.map((subject, idx) => {
            const desc = this.buildAppearanceDescription(subject, isMultiple ? idx + 1 : null);
            return isMultiple ? `- ${desc}` : desc;
        });

        // 2명 이상일 때 줄바꿈 구조
        if (isMultiple) {
            return `Subject:\n${descriptions.join('\n')}`;
        }
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
     * [Fashion] - 패션 정보 (IR 슬롯 사용)
     */
    private getFashionSection(): string {
        const fashion = this.ir.slots.fashion?.content;
        if (fashion) {
            const subjects = this.settings.userInput?.studioSubjects || [];
            const isMultiple = subjects.length >= 2;
            if (isMultiple) {
                return `Fashion:\n${fashion}`;
            }
            return `Fashion: ${fashion}`;
        }
        return '';
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

        const isMultiple = subjects.length >= 2;
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

            const prefix = isMultiple ? `Person ${idx + 1}: ` : '';
            return `${isMultiple ? '- ' : ''}${prefix}${this.joinWithAnd(parts)}`;
        }).filter(Boolean);

        if (descriptions.length === 0) return '';

        // 2명 이상일 때 줄바꿈 구조
        if (isMultiple) {
            return `Expression/Pose:\n${descriptions.join('\n')}`;
        }
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
     * [Location] - 배경 (IR 슬롯 사용)
     */
    private getLocationSection(): string {
        const location = this.ir.slots.location?.content;
        if (location) {
            return `Location: ${location}`;
        }
        return '';
    }

    /**
     * [Tech Specs] - 카메라 바디, 렌즈, 조리개 (IR 슬롯 사용)
     */
    private getTechSpecsSection(): string {
        const techSpecs = this.ir.slots.tech_specs?.content;
        if (techSpecs) {
            return `Tech Specs: ${techSpecs}`;
        }

        // Fallback: 기존 IR 슬롯 조합
        const cameraBody = this.ir.slots.camera_body?.content || '';
        const lensContent = this.ir.slots.lens?.content || '';
        if (cameraBody || lensContent) {
            return `Tech Specs: ${[cameraBody, lensContent].filter(Boolean).join(', ')}`;
        }
        return '';
    }

    /**
     * [Style] - ISO, Shutter Speed + Photo Style 프리셋
     */
    private getStyleSection(): string {
        const parts: string[] = [];

        // 1) Photo Style (IR style 슬롯에서 가져옴)
        const styleContent = this.ir.slots.style?.content;
        if (styleContent) {
            parts.push(styleContent);
        }

        // 2) ISO
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

        // 3) Shutter Speed
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
