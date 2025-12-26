// config/mappings/lighting-patterns.ts
// 조명 패턴 데이터 매핑

import type { LightingPattern } from '@/types';

export const LIGHTING_PATTERNS: LightingPattern[] = [
    {
        id: 'rembrandt',
        name: 'Rembrandt Lighting',
        description: '45도 각도 메인 라이트로 뺨에 삼각형 하이라이트 형성. 드라마틱하면서도 클래식한 느낌.',
        suitableFor: ['portrait', 'headshot', 'dramatic'],
        promptKeywords: 'Rembrandt lighting, dramatic shadow, triangle highlight on cheek, 45-degree key light, classic portrait lighting'
    },
    {
        id: 'butterfly',
        name: 'Butterfly Lighting (Paramount)',
        description: '정면 상단에서 조명. 코 아래 나비 모양 그림자. 글래머러스한 인물 사진에 적합.',
        suitableFor: ['beauty', 'fashion', 'glamour'],
        promptKeywords: 'butterfly lighting, Paramount lighting, beauty photography, frontal key light from above, glamorous lighting'
    },
    {
        id: 'split',
        name: 'Split Lighting',
        description: '얼굴을 반으로 나누어 한쪽만 조명. 극적이고 미스터리한 분위기.',
        suitableFor: ['dramatic', 'artistic', 'moody'],
        promptKeywords: 'split lighting, half-face illumination, dramatic contrast, mysterious mood, one side lit'
    },
    {
        id: 'loop',
        name: 'Loop Lighting',
        description: 'Rembrandt보다 부드럽고 자연스러운 각도. 코 옆에 작은 루프 그림자 형성.',
        suitableFor: ['portrait', 'corporate', 'natural'],
        promptKeywords: 'loop lighting, soft portrait lighting, small nose shadow, natural-looking portrait, flattering light'
    },
    {
        id: 'broad',
        name: 'Broad Lighting',
        description: '카메라를 향한 얼굴의 넓은 부분을 조명. 얼굴을 넓어 보이게 함.',
        suitableFor: ['portrait', 'thin_face'],
        promptKeywords: 'broad lighting, wide side illumination, face-widening light angle'
    },
    {
        id: 'short',
        name: 'Short Lighting',
        description: '카메라에서 먼 쪽 얼굴을 조명. 얼굴을 슬림하게 보이게 하고 깊이감 추가.',
        suitableFor: ['portrait', 'round_face', 'slimming'],
        promptKeywords: 'short lighting, narrow side illumination, face-slimming light, added depth and dimension'
    }
];

// 광질 (Hard/Soft)
export const LIGHT_QUALITIES = [
    {
        id: 'hard',
        name: 'Hard Light',
        description: '선명한 그림자, 강한 대비, 엣지있는 느낌',
        promptKeywords: 'hard light, sharp shadows, high contrast, defined edges, direct light source'
    },
    {
        id: 'soft',
        name: 'Soft Light',
        description: '부드러운 그림자, 낮은 대비, 자연스러운 느낌',
        promptKeywords: 'soft diffused light, gentle shadows, low contrast, soft transitions, flattering light'
    }
];

// 시간대/색온도 프리셋
export const TIME_OF_DAY_PRESETS = [
    {
        id: 'golden_hour',
        name: 'Golden Hour',
        colorTemp: 2800,
        description: '해질녘/일출 직후의 따뜻한 황금빛',
        promptKeywords: 'golden hour lighting, warm orange glow, 2800K color temperature, sunset/sunrise light'
    },
    {
        id: 'daylight',
        name: 'Daylight',
        colorTemp: 5600,
        description: '자연 주광, 균형잡힌 색온도',
        promptKeywords: 'natural daylight, balanced 5600K color temperature, outdoor midday light'
    },
    {
        id: 'overcast',
        name: 'Overcast',
        colorTemp: 6500,
        description: '흐린 날 하늘, 거대한 소프트박스 효과',
        promptKeywords: 'overcast sky lighting, 6500K cool tones, natural soft diffusion, giant softbox effect'
    },
    {
        id: 'blue_hour',
        name: 'Blue Hour',
        colorTemp: 8000,
        description: '해지기 직전/직후의 푸른 시간대',
        promptKeywords: 'blue hour lighting, twilight, cool blue tones, 8000K color temperature, ambient city lights'
    },
    {
        id: 'tungsten',
        name: 'Tungsten (Indoor)',
        colorTemp: 3200,
        description: '실내 텅스텐 조명, 따뜻한 인공광',
        promptKeywords: 'tungsten lighting, 3200K warm tones, indoor artificial light, incandescent glow'
    }
];

// Key:Fill:Back 비율 프리셋
export const LIGHTING_RATIO_PRESETS = [
    {
        id: 'high_contrast',
        name: '고대비',
        ratio: '8:1:1',
        description: '드라마틱, 강한 그림자, 예술적',
        promptKeywords: 'high contrast lighting, 8:1 key to fill ratio, dramatic shadows'
    },
    {
        id: 'standard',
        name: '표준',
        ratio: '4:2:1',
        description: '균형잡힌 대비, 자연스러운 깊이감',
        promptKeywords: 'balanced lighting, 4:2:1 lighting ratio, natural depth'
    },
    {
        id: 'low_contrast',
        name: '저대비',
        ratio: '2:1.5:0.5',
        description: '부드러운 그림자, 플래터링, 뷰티용',
        promptKeywords: 'low contrast lighting, soft fill, flattering beauty lighting, minimal shadows'
    }
];

// 헬퍼 함수
export function getLightingPatternById(id: string): LightingPattern | undefined {
    return LIGHTING_PATTERNS.find(pattern => pattern.id === id);
}

export function getTimeOfDayPresetById(id: string) {
    return TIME_OF_DAY_PRESETS.find(preset => preset.id === id);
}
