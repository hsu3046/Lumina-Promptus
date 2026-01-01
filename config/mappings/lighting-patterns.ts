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
    butterfly: 'Butterfly lighting (Paramount lighting, key light placed above pointing down at face, creates shadow under nose and chin resembling a butterfly shape—this is a lighting metaphor, do not create an actual butterfly)',
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
        key: 'mid-key',
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

// ===== 조명 프리셋 (8개) =====

export interface LightingPreset {
    id: string;
    label: string;
    description: string;
    params: {
        pattern: LightingPattern;
        key: LightingKey;
        ratio?: LightingRatio;
        quality?: LightQuality;
        colorTemp?: ColorTemperature;
        mood?: LightingMood;
        special?: SpecialLighting[];
    };
    hiddenKeywords: string[];
}

export const LIGHTING_PRESETS: LightingPreset[] = [
    // 1. Standard Portrait (기존 11번)
    {
        id: 'standard_portrait',
        label: '스탠다드 프로필',
        description: '가장 자연스럽고 호불호 없는 정석 프로필 조명',
        params: {
            pattern: 'loop',
            key: 'mid-key',
            ratio: '3:1',
            quality: 'soft',
            colorTemp: 'daylight',
            mood: 'natural',
            special: []
        },
        hiddenKeywords: [
            'large octabox',
            'catchlight in eyes',
            'studio portrait photography'
        ]
    },
    // 2. K-Beauty Pop (기존 9번)
    {
        id: 'k_beauty_pop',
        label: 'K-뷰티 화보',
        description: '아이돌 화보처럼 그림자 없이 화사하고 뽀샤시한 뷰티 조명',
        params: {
            pattern: 'butterfly',
            key: 'high-key',
            ratio: '2:1',
            quality: 'soft',
            colorTemp: 'daylight',
            mood: 'glamorous',
            special: ['clamshell']
        },
        hiddenKeywords: [
            'soft beauty dish lighting',
            'reflector under chin',
            'shadowless face',
            'glowing skin texture'
        ]
    },
    // 3. Soft Window Light (기존 8번)
    {
        id: 'soft_window_light',
        label: '오후의 자연광',
        description: '큰 창으로 들어오는 은은하고 차분한 오후의 자연광',
        params: {
            pattern: 'rembrandt',
            key: 'mid-key',
            ratio: '4:1',
            quality: 'soft',
            colorTemp: 'cloudy',
            mood: 'natural',
            special: []
        },
        hiddenKeywords: [
            'north facing window',
            'painterly light',
            'vermeer style',
            'indoor natural light',
            'dust motes in light'
        ]
    },
    // 4. Golden Hour Glow (기존 6번)
    {
        id: 'golden_hour_glow',
        label: '골든아워 역광',
        description: '해 질 녘 등 뒤에서 쏟아지는 따뜻하고 로맨틱한 역광',
        params: {
            pattern: 'loop',
            key: 'high-key',
            ratio: '3:1',
            quality: 'soft',
            colorTemp: 'warm-golden',
            mood: 'natural',
            special: ['rim-light', 'hair-light']
        },
        hiddenKeywords: [
            'sun flare',
            'backlit photography',
            'warm haze',
            'dreamy atmosphere',
            'magic hour light'
        ]
    },
    // 5. High Fashion Flash (기존 7번)
    {
        id: 'fashion_editorial',
        label: '매거진 플래시',
        description: '잡지 화보처럼 쨍하고 선명한 직광 플래시 스타일',
        params: {
            pattern: 'butterfly',
            key: 'high-key',
            ratio: '2:1',
            quality: 'hard',
            colorTemp: 'daylight',
            mood: 'editorial',
            special: ['broad-lighting']
        },
        hiddenKeywords: [
            'direct flash photography',
            'hard shadows on wall',
            'high contrast color',
            'vogue magazine style',
            'sharp focus'
        ]
    },
    // 6. Mystery Dark (기존 12번)
    {
        id: 'mystery_dark',
        label: '딥 쉐도우',
        description: '얼굴의 절반을 어둠에 숨기는 강렬한 미스터리',
        params: {
            pattern: 'split',
            key: 'low-key',
            ratio: '16:1',
            quality: 'hard',
            colorTemp: 'cool-blue',
            mood: 'mysterious',
            special: ['edge-lighting']
        },
        hiddenKeywords: [
            'silhouette style',
            'sharp shadow edge',
            'no fill light',
            'dark background'
        ]
    },
    // 7. Cinematic Noir (기존 10번)
    {
        id: 'cinematic_noir',
        label: '시네마틱 느와르',
        description: '영화 대부 같은 깊은 명암과 중후한 남성적 분위기',
        params: {
            pattern: 'rembrandt',
            key: 'low-key',
            ratio: '8:1',
            quality: 'hard',
            colorTemp: 'tungsten',
            mood: 'cinematic',
            special: ['chiaroscuro']
        },
        hiddenKeywords: [
            'film noir style',
            'deep black shadows',
            'negative fill',
            'dramatic volume'
        ]
    },
    // 8. Cyberpunk Neon (기존 5번)
    {
        id: 'cyberpunk_neon',
        label: '사이버펑크 네온',
        description: '네온 사인의 핑크와 블루가 섞인 미래지향적 컬러 조명',
        params: {
            pattern: 'split',
            key: 'mid-key',
            ratio: '4:1',
            quality: 'hard',
            colorTemp: 'cool-blue',
            mood: 'cinematic',
            special: ['rim-light', 'background-light']
        },
        hiddenKeywords: [
            'bi-color lighting',
            'teal and orange',
            'neon glowing skin',
            'futuristic atmosphere',
            'blade runner style'
        ]
    }
];

// 프리셋 ID로 프리셋 찾기
export function getPresetById(id: string): LightingPreset | undefined {
    return LIGHTING_PRESETS.find(p => p.id === id);
}

// 프리셋으로 프롬프트 빌드 (hiddenKeywords 포함)
export function buildPresetPrompt(preset: LightingPreset): string {
    const basePrompt = buildLightingPrompt(preset.params);
    const hiddenPart = preset.hiddenKeywords.join(', ');
    return `${basePrompt}, ${hiddenPart}`;
}