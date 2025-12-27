// config/mappings/lighting-patterns.ts
// 조명 패턴 데이터 매핑 - 물리적 거동 중심 (v1.2)

import type { LightingPattern } from '@/types';

export const LIGHTING_PATTERNS: LightingPattern[] = [
    {
        id: 'rembrandt',
        name: 'Rembrandt Lighting',
        description: '45도 각도 메인 라이트로 뺨에 삼각형 하이라이트 형성. 입체감이 뛰어난 광학 구조.',
        suitableFor: ['portrait', 'dramatic'],
        // 장르 단어 제거, 빛의 기하학적 배치에 집중
        promptKeywords: 'Rembrandt lighting pattern, directional key light at 45-degree, small triangle highlight on opposite cheek, deep shadow transitions'
    },
    {
        id: 'butterfly',
        name: 'Butterfly Lighting (Paramount)',
        description: '정면 상단 조명으로 코 아래 대칭 그림자 형성. 얼굴의 골격을 강조.',
        suitableFor: ['beauty', 'fashion'],
        // 'Beauty photography' 같은 장르 태그 삭제
        promptKeywords: 'butterfly lighting, symmetrical nose shadow, high-angle frontal illumination, centered overhead key light'
    },
    {
        id: 'split',
        name: 'Split Lighting',
        description: '얼굴을 수직으로 나누어 한쪽만 조명. 강한 대비와 분리감.',
        suitableFor: ['dramatic', 'moody'],
        // 'Mysterious mood' 대신 빛의 각도 명시
        promptKeywords: 'split lighting, side illumination at 90-degree, vertical facial division, high contrast shadows on one side'
    },
    {
        id: 'loop',
        name: 'Loop Lighting',
        description: '코 옆에 작은 고리 모양 그림자 형성. 가장 대중적이고 안정적인 각도.',
        suitableFor: ['portrait', 'natural'],
        // 'Natural-looking' 같은 추상적 표현 제거
        promptKeywords: 'loop lighting, small oval nose shadow, subtle directional light, 30-degree key light offset'
    }
];

// 광질 (Hard/Soft)
export const LIGHT_QUALITIES = [
    {
        id: 'hard',
        name: 'Hard Light',
        description: '선명한 그림자 경계와 강한 대비',
        // 'Direct light source'를 명시하여 빛의 성질 강조
        promptKeywords: 'hard lighting, sharp shadow edges, specular highlights, high contrast, undiffused small light source'
    },
    {
        id: 'soft',
        name: 'Soft Light',
        description: '부드러운 그림자 전이와 낮은 대비',
        // 'Flattering' 대신 'Soft transitions' 강조
        promptKeywords: 'soft diffused light, gradual shadow falloff, low contrast, smooth tonal transitions, large light source'
    }
];

// 시간대/색온도 프리셋
export const TIME_OF_DAY_PRESETS = [
    {
        id: 'golden_hour',
        name: 'Golden Hour',
        colorTemp: 2800,
        description: '따뜻한 오렌지빛 톤과 긴 그림자',
        // 장소(Sunset) 대신 빛의 색과 길이에 집중
        promptKeywords: 'warm golden hour illumination, low-angle sunlight, 2800K color temperature, long soft shadows, amber glow'
    },
    {
        id: 'daylight',
        name: 'Daylight',
        colorTemp: 5600,
        description: '중립적인 백색 주광',
        // 'Outdoor' 단어 제거 (실내 HMI 조명으로도 구현 가능하기 때문)
        promptKeywords: 'neutral daylight, balanced 5600K white balance, midday sun spectrum, clean color rendering'
    },
    {
        id: 'overcast',
        name: 'Overcast',
        colorTemp: 6500,
        description: '차가운 톤의 무지향성 확산광',
        // 'Giant softbox'는 좋은 비유이므로 유지
        promptKeywords: 'overcast lighting, 6500K cool skylight, shadowless illumination, highly diffused ambient light, giant softbox effect'
    },
    {
        id: 'blue_hour',
        name: 'Blue Hour',
        colorTemp: 8000,
        description: '해지기 직전/직후의 차분한 푸른빛',
        // 'City lights' 같은 배경 요소 제거
        promptKeywords: 'blue hour lighting, deep cool blue tones, 8000K color temperature, low ambient illumination, soft indirect skylight'
    },
    {
        id: 'tungsten',
        name: 'Tungsten',
        colorTemp: 3200,
        description: '따뜻한 인공 광원 느낌',
        promptKeywords: 'tungsten light source, 3200K warm incandescent tones, artificial orange glow, interior lighting temperature'
    }
];

// 노출 대비 비율 (Key:Fill)
export const LIGHTING_RATIO_PRESETS = [
    {
        id: 'high_contrast',
        name: '고대비 (Low-key)',
        ratio: '8:1',
        description: '그림자가 깊고 드라마틱한 표현',
        // 'Dramatic' 대신 'Low-key' 기술 용어 사용
        promptKeywords: 'low-key lighting, 8:1 lighting ratio, deep unlit shadows, high tonal contrast'
    },
    {
        id: 'standard',
        name: '표준 (Standard)',
        ratio: '4:1',
        description: '적당한 입체감의 자연스러운 대비',
        promptKeywords: 'standard 4:1 lighting ratio, balanced highlights and shadows, natural facial volume'
    },
    {
        id: 'low_contrast',
        name: '저대비 (High-key)',
        ratio: '2:1',
        description: '그림자가 거의 없는 화사한 표현',
        // 'Beauty' 대신 'High-key' 사용
        promptKeywords: 'high-key lighting, 2:1 lighting ratio, minimal shadows, flat and bright illumination'
    }
];

// 헬퍼 함수
export function getLightingPatternById(id: string): LightingPattern | undefined {
    return LIGHTING_PATTERNS.find(pattern => pattern.id === id);
}

export function getTimeOfDayPresetById(id: string) {
    return TIME_OF_DAY_PRESETS.find(preset => preset.id === id);
}