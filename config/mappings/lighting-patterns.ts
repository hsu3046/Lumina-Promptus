// config/mappings/lighting-patterns.ts
// 조명 패턴 프롬프트 빌더 (컴팩트 버전)

import type {
    LightingPattern,
    LightingKey,
    LightingRatio,
    LightQuality,
    ColorTemperature,
    LightingMood,
    SpecialLighting,
} from '@/types/lighting.types';

// ===== 컴팩트 프롬프트 키워드 =====

const PATTERN_NAMES: Record<LightingPattern, string> = {
    rembrandt: 'Rembrandt lighting',
    butterfly: 'Butterfly lighting',
    loop: 'Loop lighting',
    split: 'Split lighting',
};

const KEY_NAMES: Record<LightingKey, string> = {
    'high-key': 'high-key',
    'mid-key': 'balanced',
    'low-key': 'low-key dramatic',
};

const RATIO_NAMES: Record<LightingRatio, string> = {
    '2:1': '2:1 soft',
    '3:1': '3:1 natural',
    '4:1': '4:1 medium',
    '8:1': '8:1 high',
    '16:1': '16:1 extreme',
};

const QUALITY_NAMES: Record<LightQuality, string> = {
    soft: 'soft diffused',
    hard: 'hard direct',
};

const COLOR_TEMP_NAMES: Record<ColorTemperature, string> = {
    'warm-golden': 'warm 2800K',
    tungsten: 'tungsten 3200K',
    daylight: 'daylight 5600K',
    cloudy: 'cloudy 6500K',
    shade: 'shade 7500K',
    'cool-blue': 'cool blue 8000K',
};

const MOOD_NAMES: Record<LightingMood, string> = {
    dramatic: 'dramatic',
    natural: 'natural',
    glamorous: 'glamorous',
    mysterious: 'mysterious',
    editorial: 'editorial',
    cinematic: 'cinematic',
};

const SPECIAL_NAMES: Record<SpecialLighting, string> = {
    'rim-light': 'rim light',
    'hair-light': 'hair light',
    'background-light': 'background light',
    chiaroscuro: 'chiaroscuro',
    clamshell: 'clamshell',
    'broad-lighting': 'broad lighting',
    'short-lighting': 'short lighting',
    'edge-lighting': 'edge lighting',
};

// ===== 패턴별 추천 프리셋 =====
export interface PatternPreset {
    key: LightingKey;
    ratio?: LightingRatio;
    quality?: LightQuality;
    colorTemp?: ColorTemperature;
    mood?: LightingMood;
}

export const PATTERN_PRESETS: Record<LightingPattern, PatternPreset> = {
    rembrandt: {
        key: 'mid-key',
        ratio: '4:1',
        quality: 'soft',
        colorTemp: 'tungsten',
        mood: 'dramatic',
    },
    butterfly: {
        key: 'high-key',
        ratio: '2:1',
        quality: 'soft',
        colorTemp: 'daylight',
        mood: 'glamorous',
    },
    loop: {
        key: 'mid-key',
        ratio: '3:1',
        quality: 'soft',
        colorTemp: 'daylight',
        mood: 'natural',
    },
    split: {
        key: 'low-key',
        ratio: '8:1',
        quality: 'hard',
        colorTemp: 'tungsten',
        mood: 'dramatic',
    },
};

// ===== 프롬프트 빌더 (컴팩트 문장형) =====

interface LightingPromptParams {
    pattern: LightingPattern;
    key: LightingKey;
    ratio?: LightingRatio;
    quality?: LightQuality;
    colorTemp?: ColorTemperature;
    mood?: LightingMood;
    special?: SpecialLighting[];
}

export function buildLightingPrompt(params: LightingPromptParams): string {
    // 패턴 + 키 + 광질 결합: "high-key Rembrandt lighting with soft diffused quality"
    const patternName = PATTERN_NAMES[params.pattern];
    const keyName = KEY_NAMES[params.key];
    const qualityName = params.quality ? QUALITY_NAMES[params.quality] : '';

    let result = qualityName
        ? `${keyName} ${patternName} with ${qualityName} quality`
        : `${keyName} ${patternName}`;

    // 콘트라스트 비율: "medium contrast ratio"
    if (params.ratio) {
        const ratioName = RATIO_NAMES[params.ratio].split(' ')[1]; // '4:1 medium' -> 'medium'
        result += `, ${ratioName} contrast ratio`;
    }

    // 색온도 (화이트밸런스): "daylight white balance"
    if (params.colorTemp) {
        const tempName = COLOR_TEMP_NAMES[params.colorTemp].split(' ')[0]; // 'daylight 5600K' -> 'daylight'
        result += `, ${tempName} white balance`;
    }

    // 분위기: "natural mood"
    if (params.mood) {
        result += `, ${MOOD_NAMES[params.mood]} mood`;
    }

    // 특수 조명 (있으면 추가)
    if (params.special && params.special.length > 0) {
        const specials = params.special.map(s => SPECIAL_NAMES[s]).join(' and ');
        result += ` with ${specials}`;
    }

    return result;
}