// config/mappings/lighting-patterns.ts
// 조명 패턴 프롬프트 빌더 (8개 항목 기반)

import type {
    LightingPattern,
    LightingKey,
    LightingRatio,
    LightQuality,
    ColorTemperature,
    LightingMood,
    TimeLighting,
    SpecialLighting,
} from '@/types/lighting.types';

// ===== 패턴별 프롬프트 키워드 =====

const PATTERN_PROMPTS: Record<LightingPattern, string> = {
    rembrandt: 'Rembrandt lighting with triangle highlight on shadow cheek, 45-degree key light position',
    butterfly: 'Butterfly lighting with butterfly shadow under nose, overhead frontal key light, glamorous beauty look',
    loop: 'Loop lighting with nose shadow looping toward cheek, 30-degree key light, natural flattering light',
    split: 'Split lighting with face divided in half, 90-degree side light, dramatic mood',
};

const KEY_PROMPTS: Record<LightingKey, string> = {
    'high-key': 'high-key bright and airy overall mood, minimal shadows',
    'mid-key': 'balanced mid-key exposure, natural contrast',
    'low-key': 'low-key dramatic dark mood, deep shadows',
};

const RATIO_PROMPTS: Record<LightingRatio, string> = {
    '2:1': 'soft 2:1 key-to-fill ratio',
    '3:1': 'natural 3:1 lighting ratio',
    '4:1': 'medium 4:1 lighting contrast',
    '8:1': 'strong 8:1 high contrast',
    '16:1': 'dramatic 16:1 extreme contrast',
};

const QUALITY_PROMPTS: Record<LightQuality, string> = {
    soft: 'soft diffused light, gentle shadow transitions',
    hard: 'hard direct light, sharp defined shadows',
};

const COLOR_TEMP_PROMPTS: Record<ColorTemperature, string> = {
    'warm-golden': 'warm golden 2800K color temperature',
    tungsten: 'tungsten 3200K warm amber glow',
    daylight: 'daylight balanced 5600K neutral white',
    cloudy: 'cool overcast 6500K slight blue tint',
    shade: 'shade 7500K cool blue cast',
    'cool-blue': 'cool blue 8000K+ clinical modern look',
};

const MOOD_PROMPTS: Record<LightingMood, string> = {
    dramatic: 'dramatic intense mood',
    natural: 'natural organic atmosphere',
    glamorous: 'glamorous sophisticated elegance',
    mysterious: 'mysterious enigmatic ambiance',
    editorial: 'editorial fashion-forward style',
    cinematic: 'cinematic film-like quality',
};

const TIME_PROMPTS: Record<TimeLighting, string> = {
    none: '', // 자연광 없음 - 프롬프트 생략
    'golden-hour': 'golden hour warm sunset light',
    'blue-hour': 'blue hour cool twilight atmosphere',
    'midday-sun': 'midday sun harsh overhead lighting',
    overcast: 'overcast soft diffused natural light',
    'window-light': 'natural window light directional indoor',
};

const SPECIAL_PROMPTS: Record<SpecialLighting, string> = {
    'rim-light': 'rim light edge separation',
    'hair-light': 'hair light adding dimension',
    'background-light': 'background light depth separation',
    chiaroscuro: 'chiaroscuro Renaissance contrast',
    clamshell: 'clamshell beauty lighting setup',
    'broad-lighting': 'broad lighting illuminated side facing camera',
    'short-lighting': 'short lighting shadow side facing camera',
    'edge-lighting': 'edge lighting dramatic silhouette outline',
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

// ===== 프롬프트 빌더 =====

interface LightingPromptParams {
    pattern: LightingPattern;
    key: LightingKey;
    ratio?: LightingRatio;
    quality?: LightQuality;
    colorTemp?: ColorTemperature;
    mood?: LightingMood;
    timeBase?: TimeLighting;
    special?: SpecialLighting[];
}

export function buildLightingPrompt(params: LightingPromptParams): string {
    const parts: string[] = [];

    // 1. 패턴 (핵심)
    parts.push(PATTERN_PROMPTS[params.pattern]);

    // 2. 키
    parts.push(KEY_PROMPTS[params.key]);

    // 3. 비율
    if (params.ratio) {
        parts.push(RATIO_PROMPTS[params.ratio]);
    }

    // 4. 광질
    if (params.quality) {
        parts.push(QUALITY_PROMPTS[params.quality]);
    }

    // 5. 색온도
    if (params.colorTemp) {
        parts.push(COLOR_TEMP_PROMPTS[params.colorTemp]);
    }

    // 6. 분위기
    if (params.mood) {
        parts.push(MOOD_PROMPTS[params.mood]);
    }

    // 7. 시간대
    if (params.timeBase) {
        parts.push(TIME_PROMPTS[params.timeBase]);
    }

    // 8. 특수 조명
    if (params.special && params.special.length > 0) {
        params.special.forEach(s => {
            parts.push(SPECIAL_PROMPTS[s]);
        });
    }

    return parts.join(', ');
}