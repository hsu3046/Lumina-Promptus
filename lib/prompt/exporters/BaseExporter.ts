// lib/prompt/exporters/BaseExporter.ts
// Exporter 계층의 공통 로직을 담는 추상 클래스

import type { PromptIR, UserSettings, StudioSubject } from '@/types';
import { getCameraById } from '@/config/mappings/cameras';
import { getLensById } from '@/config/mappings/lenses';

export abstract class BaseExporter {
    protected ir: PromptIR;
    protected settings: UserSettings;

    constructor(ir: PromptIR, settings?: UserSettings) {
        this.ir = ir;
        // settings가 제공되지 않으면 IR에서 추론 (하위 호환성)
        this.settings = settings || {} as UserSettings;
    }

    /**
     * 각 Exporter가 구현해야 할 메인 변환 메서드
     */
    abstract export(): string;

    /**
     * 프롬프트 메타데이터를 반환하는 메서드
     */
    abstract getMetadata(): any;

    /**
     * 단어에 적절한 관사(a/an) 추가
     */
    protected addArticle(text: string): string {
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
    protected joinWithAnd(parts: string[]): string {
        if (parts.length === 0) return '';
        if (parts.length === 1) return parts[0];
        if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
        return `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`;
    }

    /**
     * 외모 정보만 추출 (패션/포즈/표정 제외)
     */
    protected buildAppearanceDescription(subject: StudioSubject, personNumber: number | null): string {
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
}
