// config/lighting-rules.ts
// 조명 충돌 규칙 및 권장 조합

import type {
    LightingPattern,
    LightingKey,
    LightingRatio,
    LightQuality,
    ColorTemperature,
    LightingMood,
    TimeLighting,
    SpecialLighting
} from '@/types/lighting.types';

// ===== 충돌 규칙 정의 =====

interface PatternKeyConflict {
    pattern: LightingPattern;
    key: LightingKey;
    reason: string;
    suggestion: string;
}

interface KeyRatioConflict {
    key: LightingKey;
    ratios: LightingRatio[];
    reason: string;
    suggestion: string;
}

interface PatternRatioConflict {
    pattern: LightingPattern;
    ratios: LightingRatio[];
    reason: string;
    suggestion: string;
}

interface SpecialConflict {
    key?: LightingKey;
    pattern?: LightingPattern;
    specials: SpecialLighting[];
    reason: string;
    suggestion: string;
}

interface QualityConflict {
    quality: LightQuality;
    patterns: LightingPattern[];
    reason: string;
    suggestion: string;
}

interface ColorMoodConflict {
    colorTemp: ColorTemperature;
    moods: LightingMood[];
    reason: string;
    suggestion: string;
}

interface TimeConflict {
    timeBase: TimeLighting;
    patterns: LightingPattern[];
    reason: string;
    suggestion: string;
}

export const LIGHTING_CONFLICTS = {
    // Pattern + Key 충돌
    patternKeyConflicts: [
        {
            pattern: 'split',
            key: 'high-key',
            reason: 'Split lighting은 그림자 대비가 필요하며, high-key와 호환되지 않습니다',
            suggestion: 'Split lighting에는 mid-key 또는 low-key를 사용하세요'
        },
        {
            pattern: 'rembrandt',
            key: 'high-key',
            reason: 'Rembrandt 삼각형은 그림자가 필요하며, high-key에서는 사라집니다',
            suggestion: 'Rembrandt에는 mid-key를 사용하세요'
        }
    ] as PatternKeyConflict[],

    // Key + Ratio 충돌
    keyRatioConflicts: [
        {
            key: 'high-key',
            ratios: ['8:1', '16:1'],
            reason: 'High-key는 낮은 대비(2:1 또는 3:1)가 필요합니다',
            suggestion: 'High-key에는 2:1 또는 3:1 비율을 사용하세요'
        },
        {
            key: 'low-key',
            ratios: ['2:1', '3:1'],
            reason: 'Low-key는 높은 대비(8:1 또는 16:1)가 필요합니다',
            suggestion: 'Low-key에는 8:1 또는 16:1 비율을 사용하세요'
        }
    ] as KeyRatioConflict[],

    // Pattern + Ratio 충돌
    patternRatioConflicts: [
        {
            pattern: 'butterfly',
            ratios: ['8:1', '16:1'],
            reason: 'Butterfly lighting은 일반적으로 부드러운 비율을 사용합니다',
            suggestion: 'Butterfly에는 2:1 또는 3:1 비율을 사용하세요'
        },
        {
            pattern: 'split',
            ratios: ['2:1', '3:1'],
            reason: 'Split lighting은 강한 대비가 필요합니다',
            suggestion: 'Split에는 8:1 또는 16:1 비율을 사용하세요'
        }
    ] as PatternRatioConflict[],

    // Special + Pattern/Key 충돌
    specialConflicts: [
        {
            key: 'low-key',
            specials: ['clamshell'],
            reason: 'Clamshell(뷰티 라이팅)은 low-key 드라마와 호환되지 않습니다',
            suggestion: 'Clamshell에는 high-key 또는 mid-key를 사용하세요'
        },
        {
            pattern: 'split',
            specials: ['clamshell'],
            reason: 'Clamshell은 균일한 정면 조명이 필요하며, 측면 split과 맞지 않습니다',
            suggestion: 'Clamshell에는 butterfly 패턴을 사용하세요'
        },
        {
            pattern: 'rembrandt',
            specials: ['clamshell'],
            reason: 'Clamshell은 정면 조명이 필요하며, Rembrandt 측면 조명과 맞지 않습니다',
            suggestion: 'Clamshell에는 butterfly 패턴을 사용하세요'
        },
        {
            pattern: 'loop',
            specials: ['clamshell'],
            reason: 'Clamshell은 정면 조명이 필요하며, Loop 측면 조명과 맞지 않습니다',
            suggestion: 'Clamshell에는 butterfly 패턴을 사용하세요'
        },
        {
            key: 'high-key',
            specials: ['chiaroscuro'],
            reason: 'Chiaroscuro는 극적인 명암 대비가 필요하며, 밝은 high-key와 호환되지 않습니다',
            suggestion: 'Chiaroscuro에는 low-key를 사용하세요'
        }
    ] as SpecialConflict[],

    // Special 간 충돌 (NEW)
    specialToSpecialConflicts: [
        {
            special1: 'broad-lighting' as SpecialLighting,
            special2: 'short-lighting' as SpecialLighting,
            reason: 'Broad와 Short lighting은 정의상 반대 개념이며 동시에 사용할 수 없습니다',
            suggestion: '하나만 선택하세요 - Broad(넓은 면) 또는 Short(좁은 면)',
            severity: 'error' as const
        },
        {
            special1: 'rim-light' as SpecialLighting,
            special2: 'edge-lighting' as SpecialLighting,
            reason: 'Rim light와 Edge lighting은 유사한 기능으로 효과가 중복됩니다',
            suggestion: '하나만 선택하세요 - Rim(전체 윤곽) 또는 Edge(선택적 강조)',
            severity: 'warning' as const
        }
    ],

    // Special 개수 제한 (NEW)
    specialCountLimit: {
        max: 3,
        reason: '너무 많은 특수 조명은 각 효과를 희석시킵니다',
        suggestion: '2-3개의 핵심 기법에 집중하세요'
    },

    // Quality + Pattern 충돌
    qualityConflicts: [
        {
            quality: 'hard',
            patterns: ['butterfly'],
            reason: 'Butterfly/뷰티 라이팅은 soft 품질이 필요합니다',
            suggestion: 'Butterfly에는 soft 디퓨즈드 라이트를 사용하세요'
        }
    ] as QualityConflict[],

    // ColorTemp + Mood 충돌
    colorMoodConflicts: [
        {
            colorTemp: 'tungsten',
            moods: ['mysterious'],
            reason: '따뜻한 tungsten은 차가운/신비로운 무드와 모순됩니다',
            suggestion: 'Mysterious 무드에는 cool-blue 또는 daylight를 사용하세요'
        }
    ] as ColorMoodConflict[],

    // TimeBase + Pattern 충돌
    timeConflicts: [
        {
            timeBase: 'window-light',
            patterns: ['split', 'rembrandt'],
            reason: '자연 창문 빛은 정밀한 스튜디오 패턴을 만들기 어렵습니다',
            suggestion: '스튜디오 셋업을 사용하거나 자연스러운 패턴을 선택하세요'
        }
    ] as TimeConflict[],

    // ColorTemp + TimeBase 충돌 (Error) - NEW
    colorTempTimeConflicts: [
        // Golden Hour 충돌
        {
            colorTemp: 'cool-blue' as ColorTemperature,
            timeBases: ['golden-hour'] as TimeLighting[],
            reason: 'Golden hour는 따뜻한 황금빛(2500-3500K)을 생성하며, cool blue(8000K+)와 호환되지 않습니다',
            suggestion: 'Golden hour에는 warm-golden 또는 tungsten을 사용하세요'
        },
        {
            colorTemp: 'shade' as ColorTemperature,
            timeBases: ['golden-hour'] as TimeLighting[],
            reason: 'Golden hour는 직사광(따뜻함)이며, shade는 차가운 간접광(7500K)입니다',
            suggestion: 'Golden hour에는 warm-golden 또는 daylight를 사용하세요'
        },
        {
            colorTemp: 'cloudy' as ColorTemperature,
            timeBases: ['golden-hour'] as TimeLighting[],
            reason: 'Golden hour는 맑은 하늘이 필요하며, 흐린 조건에서는 효과가 없습니다',
            suggestion: 'Golden hour에는 warm-golden을 사용하거나, 흐린 날에는 overcast를 사용하세요'
        },
        // Blue Hour 충돌
        {
            colorTemp: 'warm-golden' as ColorTemperature,
            timeBases: ['blue-hour'] as TimeLighting[],
            reason: 'Blue hour는 차가운 청색 빛(8000-12000K)을 생성하며, warm golden(2800K)과 호환되지 않습니다',
            suggestion: 'Blue hour에는 cool-blue 또는 shade를 사용하세요'
        },
        {
            colorTemp: 'tungsten' as ColorTemperature,
            timeBases: ['blue-hour'] as TimeLighting[],
            reason: 'Blue hour는 자연 차가운 빛이며, tungsten은 따뜻한 인공광(3200K)입니다',
            suggestion: 'Blue hour에는 cool-blue 또는 shade를 사용하세요'
        },
        // Overcast 충돌
        {
            colorTemp: 'warm-golden' as ColorTemperature,
            timeBases: ['overcast'] as TimeLighting[],
            reason: 'Overcast 조건은 차가운 확산광(6500-7500K)을 생성하며, warm golden이 아닙니다',
            suggestion: 'Overcast에는 cloudy 또는 shade를 사용하세요'
        },
        {
            colorTemp: 'tungsten' as ColorTemperature,
            timeBases: ['overcast'] as TimeLighting[],
            reason: 'Overcast는 자연 차가운 빛이며, tungsten은 따뜻한 인공광입니다',
            suggestion: 'Overcast에는 cloudy 또는 daylight를 사용하세요'
        },
        // Midday Sun 충돌
        {
            colorTemp: 'cool-blue' as ColorTemperature,
            timeBases: ['midday-sun'] as TimeLighting[],
            reason: 'Midday sun은 중성 백색광(5200-5800K)이며, cool blue(8000K+)가 아닙니다',
            suggestion: 'Midday sun에는 daylight를 사용하세요'
        }
    ],

    // ColorTemp + TimeBase 경고 (Warning) - NEW
    colorTempTimeWarnings: [
        {
            colorTemp: 'tungsten' as ColorTemperature,
            timeBases: ['midday-sun'] as TimeLighting[],
            reason: '인공 tungsten(3200K)과 자연 midday sun(5600K)의 혼합은 색상 캐스트를 만듭니다',
            suggestion: '자연 정오 빛에는 daylight 색온도를 사용하세요'
        },
        {
            colorTemp: 'warm-golden' as ColorTemperature,
            timeBases: ['window-light'] as TimeLighting[],
            reason: 'Window light는 일반적으로 더 차갑습니다(5000-7000K), warm golden(2800K)은 너무 따뜻할 수 있습니다',
            suggestion: '일반 창문 빛에는 daylight 또는 cloudy를 사용하세요'
        },
        {
            colorTemp: 'cool-blue' as ColorTemperature,
            timeBases: ['window-light'] as TimeLighting[],
            reason: 'Window light는 북향 그늘이 아니면 거의 cool blue(8000K+)에 도달하지 않습니다',
            suggestion: '일반 창문 빛에는 daylight 또는 cloudy를 사용하세요'
        },
        {
            colorTemp: 'daylight' as ColorTemperature,
            timeBases: ['golden-hour'] as TimeLighting[],
            reason: 'Daylight(5600K)는 일반적인 golden hour(2500-3500K)보다 차갑습니다',
            suggestion: '진정한 golden hour 따뜻함에는 warm-golden을 사용하세요'
        },
        {
            colorTemp: 'daylight' as ColorTemperature,
            timeBases: ['blue-hour'] as TimeLighting[],
            reason: 'Daylight(5600K)는 blue hour(8000-12000K)보다 따뜻합니다',
            suggestion: '진정한 blue hour 차가움에는 cool-blue 또는 shade를 사용하세요'
        }
    ]
};

// ===== 권장 조합 =====

export const RECOMMENDED_COMBINATIONS: Record<LightingPattern, {
    key: LightingKey;
    ratio: LightingRatio;
    quality: LightQuality;
    colorTemp: ColorTemperature;
    mood: LightingMood;
    special?: SpecialLighting[];
}> = {
    rembrandt: {
        key: 'mid-key',
        ratio: '4:1',
        quality: 'soft',
        colorTemp: 'daylight',
        mood: 'natural'
    },
    butterfly: {
        key: 'high-key',
        ratio: '2:1',
        quality: 'soft',
        colorTemp: 'daylight',
        mood: 'glamorous',
        special: ['clamshell']
    },
    loop: {
        key: 'mid-key',
        ratio: '3:1',
        quality: 'soft',
        colorTemp: 'daylight',
        mood: 'natural'
    },
    split: {
        key: 'low-key',
        ratio: '8:1',
        quality: 'hard',
        colorTemp: 'cool-blue',
        mood: 'dramatic',
        special: ['rim-light']
    }
};

// ===== UI 옵션 라벨 =====

export const PATTERN_OPTIONS: { value: LightingPattern; label: string; desc: string }[] = [
    { value: 'rembrandt', label: '렘브란트', desc: '45° 삼각형 하이라이트' },
    { value: 'butterfly', label: '버터플라이', desc: '정면 뷰티 라이팅' },
    { value: 'loop', label: '루프', desc: '30° 자연스러운' },
    { value: 'split', label: '스플릿', desc: '90° 드라마틱' },
];

export const KEY_OPTIONS: { value: LightingKey; label: string; desc: string }[] = [
    { value: 'high-key', label: 'High-Key', desc: '밝고 환함' },
    { value: 'mid-key', label: 'Mid-Key', desc: '균형잡힌' },
    { value: 'low-key', label: 'Low-Key', desc: '어둡고 극적' },
];

export const RATIO_OPTIONS: { value: LightingRatio; label: string; desc: string }[] = [
    { value: '2:1', label: '2:1', desc: '부드러운' },
    { value: '3:1', label: '3:1', desc: '자연스러운' },
    { value: '4:1', label: '4:1', desc: '중간' },
    { value: '8:1', label: '8:1', desc: '강한' },
    { value: '16:1', label: '16:1', desc: '극적' },
];

export const QUALITY_OPTIONS: { value: LightQuality; label: string; desc: string }[] = [
    { value: 'soft', label: 'Soft', desc: '부드러운 그림자' },
    { value: 'hard', label: 'Hard', desc: '선명한 그림자' },
];

export const COLOR_TEMP_OPTIONS: { value: ColorTemperature; label: string; desc: string }[] = [
    { value: 'warm-golden', label: '황금빛', desc: '2800K' },
    { value: 'tungsten', label: '텅스텐', desc: '3200K' },
    { value: 'daylight', label: '주광', desc: '5600K' },
    { value: 'cloudy', label: '흐린 날', desc: '6500K' },
    { value: 'shade', label: '그늘', desc: '7500K' },
    { value: 'cool-blue', label: '차가운 청색', desc: '8000K+' },
];

export const MOOD_OPTIONS: { value: LightingMood; label: string }[] = [
    { value: 'dramatic', label: '극적인' },
    { value: 'natural', label: '자연스러운' },
    { value: 'glamorous', label: '화려한' },
    { value: 'mysterious', label: '신비로운' },
    { value: 'editorial', label: '에디토리얼' },
    { value: 'cinematic', label: '시네마틱' },
];

export const TIME_BASE_OPTIONS: { value: TimeLighting; label: string }[] = [
    { value: 'none', label: '자연광 없음' },
    { value: 'golden-hour', label: '골든 아워' },
    { value: 'blue-hour', label: '블루 아워' },
    { value: 'midday-sun', label: '한낮 햇빛' },
    { value: 'overcast', label: '흐린 날' },
    { value: 'window-light', label: '창문 빛' },
];

export const SPECIAL_OPTIONS: { value: SpecialLighting; label: string }[] = [
    { value: 'rim-light', label: '림 라이트' },
    { value: 'hair-light', label: '헤어 라이트' },
    { value: 'background-light', label: '배경 라이트' },
    { value: 'chiaroscuro', label: '키아로스쿠로' },
    { value: 'clamshell', label: '클램쉘' },
    { value: 'broad-lighting', label: '브로드 라이팅' },
    { value: 'short-lighting', label: '쇼트 라이팅' },
    { value: 'edge-lighting', label: '엣지 라이팅' },
];

// Re-export from lighting-patterns.ts
export { PATTERN_PRESETS } from '@/config/mappings/lighting-patterns';
