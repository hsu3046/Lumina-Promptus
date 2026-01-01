// lib/exporters/MidjourneyExporter.ts
// Midjourney 최적화 프롬프트 Exporter - 간결한 키워드 스타일

import type { PromptIR, UserSettings, StudioSubject } from '@/types';
import { getCameraById } from '@/config/mappings/cameras';
import { getLensById } from '@/config/mappings/lenses';
import {
    TOP_WEAR_OPTIONS,
    BOTTOM_WEAR_OPTIONS,
    FOOTWEAR_OPTIONS,
    ACCESSORY_OPTIONS,
} from '@/config/mappings/fashion-options';

interface MidjourneyParams {
    aspectRatio?: string;    // --ar
}

export class MidjourneyExporter {
    private ir: PromptIR;
    private settings: UserSettings;
    private params: MidjourneyParams;

    constructor(ir: PromptIR, settings?: UserSettings, params?: Partial<MidjourneyParams>) {
        this.ir = ir;
        this.settings = settings || {} as UserSettings;
        this.params = { ...params };
    }

    /**
     * IR을 Midjourney 최적화 프롬프트로 변환
     * 간결한 키워드 스타일, 세그먼트 라벨 없음
     * Subject → Fashion → Expression/Pose → Composition → Location → Lighting → --raw --style 0
     */
    export(): string {
        const parts: string[] = [];

        // 1. Subject - 외모 (키워드)
        const subject = this.getSubjectKeywords();
        if (subject) parts.push(subject);

        // 2. Fashion - 패션 (키워드)
        const fashion = this.getFashionKeywords();
        if (fashion) parts.push(fashion);

        // 3. Expression/Pose - 포즈, 표정 (키워드)
        const expressionPose = this.getExpressionPoseKeywords();
        if (expressionPose) parts.push(expressionPose);

        // 4. Composition - 프레이밍, 앵글 (키워드)
        const composition = this.getCompositionKeywords();
        if (composition) parts.push(composition);

        // 5. Location - 배경 (키워드)
        const location = this.getLocationKeywords();
        if (location) parts.push(location);

        // 6. Lighting - 조명 (키워드)
        const lighting = this.getLightingKeywords();
        if (lighting) parts.push(lighting);

        // 7. Camera/Lens - 카메라, 렌즈 (키워드)
        const cameraLens = this.getCameraLensKeywords();
        if (cameraLens) parts.push(cameraLens);

        // 콤마로 조합 후 Midjourney 파라미터 추가
        const content = parts.filter(Boolean).join(', ');
        const paramsStr = this.buildParams();

        return `${content} ${paramsStr}`.trim();
    }

    /**
     * Midjourney 파라미터 문자열 생성
     */
    private buildParams(): string {
        const params: string[] = [];

        // Aspect Ratio
        const aspectRatio = this.extractAspectRatio();
        if (aspectRatio) {
            params.push(`--ar ${aspectRatio}`);
        }

        // 고정 파라미터: --raw --style 0 (또는 --s 0)
        params.push('--style raw');
        params.push('--s 0');

        return params.join(' ');
    }

    /**
     * IR에서 aspect ratio 추출
     */
    private extractAspectRatio(): string | null {
        const aspectContent = this.ir.slots.aspect_ratio?.content;
        if (!aspectContent) return '2:3'; // 기본값: 세로 포트레이트

        const match = aspectContent.match(/(\d+:\d+)/);
        return match ? match[1] : '2:3';
    }

    /**
     * Subject - 간결한 키워드
     */
    private getSubjectKeywords(): string {
        const subjects = this.settings.userInput?.studioSubjects || [];
        if (subjects.length === 0) {
            return this.ir.slots.subject?.content || '';
        }

        return subjects.map(subject => this.buildSubjectKeywords(subject)).join(', ');
    }

    private buildSubjectKeywords(subject: StudioSubject): string {
        const keywords: string[] = [];

        // 국적
        if (subject.appearancePresetId) {
            const nationality = subject.appearancePresetId.split('-').map(w =>
                w.charAt(0).toUpperCase() + w.slice(1)
            ).join(' ');
            keywords.push(nationality);
        }

        // 나이 + 성별
        const ageMap: Record<string, string> = {
            'early-20s': 'young', 'late-20s': 'young', '30s': '',
            '40s-50s': 'middle-aged', '60s-70s': 'senior', '80plus': 'elderly'
        };
        const genderMap: Record<string, string> = { male: 'man', female: 'woman', androgynous: 'model' };
        const age = ageMap[subject.ageGroup] || '';
        const gender = genderMap[subject.gender] || 'person';
        keywords.push(`${age} ${gender}`.trim());

        // 피부톤
        const skinMap: Record<string, string> = {
            fair: 'fair skin', light: 'light skin', medium: 'medium skin',
            tan: 'tan skin', brown: 'brown skin', dark: 'dark skin'
        };
        if (skinMap[subject.skinTone]) {
            keywords.push(skinMap[subject.skinTone]);
            keywords.push('natural skin texture');
            keywords.push('hyper-realistic');
        }

        // 체형
        const bodyMap: Record<string, string> = {
            slim: 'slim', average: '', athletic: 'athletic', muscular: 'muscular', curvy: 'curvy'
        };
        if (bodyMap[subject.bodyType]) keywords.push(bodyMap[subject.bodyType]);

        // 얼굴형
        const faceMap: Record<string, string> = {
            oval: 'oval face', round: 'round face', square: 'square face',
            heart: 'heart face', diamond: 'diamond face', oblong: 'oblong face'
        };
        if (faceMap[subject.faceShape]) keywords.push(faceMap[subject.faceShape]);

        // 눈색
        const eyeMap: Record<string, string> = {
            black: 'black eyes', brown: 'brown eyes', 'light-brown': 'light brown eyes',
            hazel: 'hazel eyes', blue: 'blue eyes', green: 'green eyes', gray: 'gray eyes'
        };
        if (eyeMap[subject.eyeColor]) keywords.push(eyeMap[subject.eyeColor]);

        // 헤어
        const hairColorMap: Record<string, string> = {
            black: 'black', brown: 'brown', blonde: 'blonde',
            red: 'auburn', gray: 'gray', white: 'white'
        };
        const hairStyleMap: Record<string, string> = {
            'short-straight': 'short straight', 'medium-straight': 'medium', 'long-straight': 'long straight',
            'short-wavy': 'short wavy', 'medium-wavy': 'medium wavy', 'long-wavy': 'long wavy',
            ponytail: 'ponytail', bun: 'bun', braids: 'braids', 'half-up': 'half-up',
            curly: 'curly', bald: 'bald'
        };
        if (subject.hairStyle === 'bald') {
            keywords.push('bald');
        } else {
            const color = hairColorMap[subject.hairColor] || '';
            const style = hairStyleMap[subject.hairStyle] || '';
            if (color || style) keywords.push(`${color} ${style} hair`.trim());
        }

        return keywords.filter(Boolean).join(', ');
    }

    /**
     * Fashion - 간결한 키워드
     */
    private getFashionKeywords(): string {
        const subjects = this.settings.userInput?.studioSubjects || [];
        if (subjects.length === 0) return '';

        const fashionParts: string[] = [];
        for (const subject of subjects) {
            const topPrompt = TOP_WEAR_OPTIONS.find(o => o.value === subject.topWear)?.prompt;
            const bottomPrompt = BOTTOM_WEAR_OPTIONS.find(o => o.value === subject.bottomWear)?.prompt;
            const footPrompt = FOOTWEAR_OPTIONS.find(o => o.value === subject.footwear)?.prompt;
            const accPrompt = ACCESSORY_OPTIONS.find(o => o.value === subject.accessory)?.prompt;

            if (topPrompt) fashionParts.push(topPrompt);
            if (bottomPrompt) fashionParts.push(bottomPrompt);
            if (footPrompt) fashionParts.push(footPrompt);
            if (accPrompt) fashionParts.push(accPrompt);
        }

        return fashionParts.length > 0 ? `wearing ${fashionParts.join(', ')}` : '';
    }

    /**
     * Expression/Pose - 간결한 키워드
     */
    private getExpressionPoseKeywords(): string {
        const subjects = this.settings.userInput?.studioSubjects || [];
        if (subjects.length === 0) return '';

        const keywords: string[] = [];
        for (const subject of subjects) {
            const bodyPoseMap: Record<string, string> = {
                straight: 'standing', contrapposto: 'contrapposto', 's-curve': 's-curve pose',
                'three-quarter-turn': 'three-quarter turn', sitting: 'sitting', reclining: 'reclining'
            };
            const handPoseMap: Record<string, string> = {
                'natural-relaxed': '', 'editorial-hands': 'hands on face',
                'pocket-hands': 'hands in pockets', 'crossed-arms': 'crossed arms',
                'framing-face': 'framing face', 'hair-touch': 'touching hair'
            };
            const expressionMap: Record<string, string> = {
                'natural-smile': 'natural smile', 'bright-smile': 'bright smile',
                'subtle-smile': 'subtle smile', neutral: 'neutral expression',
                serious: 'serious', pensive: 'pensive', mysterious: 'mysterious',
                intense: 'intense', playful: 'playful', sensual: 'sensual'
            };
            const gazeMap: Record<string, string> = {
                'direct-eye-contact': 'direct eye contact', 'off-camera': 'looking away',
                'looking-up': 'looking up', 'looking-down': 'looking down',
                'side-gaze': 'side gaze', 'over-shoulder': 'over shoulder look',
                'eyes-closed': 'eyes closed', 'half-closed-eyes': 'half-closed eyes'
            };

            if (bodyPoseMap[subject.bodyPose]) keywords.push(bodyPoseMap[subject.bodyPose]);
            if (handPoseMap[subject.handPose]) keywords.push(handPoseMap[subject.handPose]);
            if (expressionMap[subject.expression]) keywords.push(expressionMap[subject.expression]);
            if (gazeMap[subject.gazeDirection]) keywords.push(gazeMap[subject.gazeDirection]);
        }

        return keywords.filter(Boolean).join(', ');
    }

    /**
     * Composition - 간결한 키워드
     */
    private getCompositionKeywords(): string {
        const keywords: string[] = [];

        // 프레이밍
        const framing = this.settings.userInput?.studioComposition;
        const framingMap: Record<string, string> = {
            'extreme-close-up': 'extreme close-up', 'close-up': 'close-up',
            'bust-shot': 'bust shot', 'waist-shot': 'waist shot',
            'half-shot': 'medium shot', 'three-quarter-shot': 'knee shot',
            'full-shot': 'full body', 'long-shot': 'long shot'
        };
        if (framingMap[framing || '']) keywords.push(framingMap[framing || '']);

        // 앵글
        const angle = this.settings.artDirection?.cameraAngle;
        const angleMap: Record<string, string> = {
            'eye_level': 'eye level', 'high_angle': 'high angle',
            'low_angle': 'low angle', 'birds_eye': 'bird\'s eye view',
            'worms_eye': 'worm\'s eye view'
        };
        if (angleMap[angle || '']) keywords.push(angleMap[angle || '']);

        return keywords.filter(Boolean).join(', ');
    }

    /**
     * Location - 간결한 키워드
     */
    private getLocationKeywords(): string {
        const backgroundType = this.settings.userInput?.studioBackgroundType;
        if (!backgroundType) return '';

        const backgroundMap: Record<string, string> = {
            'seamless_white': 'white studio backdrop',
            'seamless_gray': 'gray studio backdrop',
            'seamless_black': 'black studio backdrop',
            'seamless_red': 'red studio backdrop',
            'seamless_blue': 'blue screen',
            'seamless_green': 'green screen',
            'seamless_beige': 'beige studio backdrop',
            'textured': 'textured backdrop'
        };

        return backgroundMap[backgroundType] || '';
    }

    /**
     * Lighting - 간결한 키워드
     */
    private getLightingKeywords(): string {
        const content = this.ir.slots.lighting?.content || '';
        if (!content) return 'studio lighting';

        // 긴 문장을 간결하게 축약 (앞부분만 사용)
        // 예: "balanced Loop lighting with soft diffused quality" → "Loop lighting, soft light"
        const lightingPattern = this.settings.lighting?.pattern;
        const lightingQuality = this.settings.lighting?.quality;

        const patternMap: Record<string, string> = {
            rembrandt: 'Rembrandt lighting', butterfly: 'butterfly lighting',
            loop: 'loop lighting', split: 'split lighting'
        };
        const qualityMap: Record<string, string> = {
            soft: 'soft light', hard: 'hard light'
        };

        const keywords: string[] = [];
        if (patternMap[lightingPattern || '']) keywords.push(patternMap[lightingPattern || '']);
        if (qualityMap[lightingQuality || '']) keywords.push(qualityMap[lightingQuality || '']);

        return keywords.length > 0 ? keywords.join(', ') : 'studio lighting';
    }

    /**
     * Camera/Lens - 간결한 키워드
     */
    private getCameraLensKeywords(): string {
        const keywords: string[] = [];

        const camera = getCameraById(this.settings.camera?.bodyId);
        const lens = getLensById(this.settings.camera?.lensId);

        if (camera) {
            keywords.push(`shot on ${camera.brand} ${camera.model}`);
        }

        if (lens) {
            keywords.push(`${lens.brand} ${lens.model}`);
        }

        // 조리개 정보
        const aperture = this.settings.camera?.aperture;
        if (aperture && !this.settings.camera?.apertureAuto) {
            keywords.push(aperture);
        }

        return keywords.filter(Boolean).join(', ');
    }

    /**
     * 파라미터 설정
     */
    setParams(params: Partial<MidjourneyParams>): void {
        this.params = { ...this.params, ...params };
    }

    /**
     * 프롬프트 메타데이터 반환
     */
    getMetadata(): {
        totalTokens: number;
        model: string;
        params: MidjourneyParams;
    } {
        let totalTokens = 0;
        for (const slot of Object.values(this.ir.slots)) {
            totalTokens += slot.tokens;
        }

        return {
            totalTokens,
            model: 'midjourney',
            params: this.params,
        };
    }
}
