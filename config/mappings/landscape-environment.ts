// config/mappings/landscape-environment.ts
// 풍경 사진 환경 설정 매핑

import type {
    LandscapeTimeOfDay,
    LandscapeWeather,
    LandscapeSeason,
    LandscapeLensType,
} from '@/types/landscape.types';

// ===== 시간대 옵션 =====

export const LANDSCAPE_TIME_OPTIONS: { value: LandscapeTimeOfDay; label: string; desc: string }[] = [
    { value: 'sunrise', label: '일출', desc: '따뜻한 황금빛, 긴 그림자' },
    { value: 'golden-hour', label: '골든아워', desc: '드라마틱한 황금빛, 풍부한 색상' },
    { value: 'midday', label: '한낮', desc: '밝은 태양, 높은 대비' },
    { value: 'blue-hour', label: '블루아워', desc: '시원한 청색 톤, 부드러운 빛' },
    { value: 'night', label: '밤', desc: '도시 불빛, 장노출 효과' },
];

// ===== 날씨 옵션 =====

export const LANDSCAPE_WEATHER_OPTIONS: { value: LandscapeWeather; label: string; desc: string }[] = [
    { value: 'clear', label: '맑음', desc: '맑은 하늘, 선명한 색상' },
    { value: 'partly-cloudy', label: '구름 조금', desc: '역동적인 구름, 다양한 조명' },
    { value: 'overcast', label: '흐림', desc: '부드러운 확산광, 차분한 색상' },
    { value: 'light-rain', label: '가벼운 비', desc: '젖은 표면 반사, 분위기 있는 무드' },
];

// ===== 계절 옵션 =====

export const LANDSCAPE_SEASON_OPTIONS: { value: LandscapeSeason; label: string; desc: string }[] = [
    { value: 'spring', label: '봄', desc: '신선한 녹색, 벚꽃, 생동감' },
    { value: 'summer', label: '여름', desc: '푸른 초목, 맑은 대기' },
    { value: 'autumn', label: '가을', desc: '황금빛 단풍, 따뜻한 색조' },
    { value: 'winter', label: '겨울', desc: '앙상한 나무, 눈, 차가운 톤' },
];

// ===== 렌즈 스펙 (프롬프트 생성용) =====

export interface LandscapeLensSpec {
    type: string;           // 렌즈 유형 설명
    aperture: string;       // 권장 조리개
    iso: string;            // 권장 ISO
    dof: string;            // 피사계심도 설명
    characteristic: string; // 렌즈 특성
    fov: number;            // 화각 (degrees)
}

export const LANDSCAPE_LENS_SPECS: Record<LandscapeLensType, LandscapeLensSpec> = {
    '14mm': {
        type: 'ultra-wide-angle',
        aperture: 'f/8',
        iso: 'ISO 200',
        dof: 'deep depth of field',
        characteristic: 'expansive view with slight barrel distortion',
        fov: 114,
    },
    '24mm': {
        type: 'wide-angle',
        aperture: 'f/5.6',
        iso: 'ISO 200',
        dof: 'deep depth of field',
        characteristic: 'natural wide perspective, minimal distortion',
        fov: 84,
    },
    '35mm': {
        type: 'standard wide',
        aperture: 'f/8',
        iso: 'ISO 200',
        dof: 'deep depth of field',
        characteristic: 'documentary perspective, balanced view',
        fov: 63,
    },
    '50mm': {
        type: 'standard lens',
        aperture: 'f/8',
        iso: 'ISO 200',
        dof: 'deep depth of field',
        characteristic: 'natural human eye perspective',
        fov: 47,
    },
    '85mm': {
        type: 'portrait telephoto',
        aperture: 'f/5.6',
        iso: 'ISO 200',
        dof: 'moderate depth of field',
        characteristic: 'compressed perspective, subject isolation',
        fov: 28,
    },
    '105mm': {
        type: 'telephoto',
        aperture: 'f/4',
        iso: 'ISO 400',
        dof: 'shallow depth of field',
        characteristic: 'strong compression, background magnification',
        fov: 23,
    },
};

// ===== 프롬프트 설명 생성 함수 =====

export function getLightingDescription(time: LandscapeTimeOfDay): string {
    const descriptions: Record<LandscapeTimeOfDay, string> = {
        'sunrise': '(warm golden light, long shadows, soft glow)',
        'golden-hour': '(warm golden tones, dramatic long shadows, rich colors)',
        'midday': '(bright overhead sun, short shadows, high contrast)',
        'blue-hour': '(cool blue tones, soft diffused light, minimal shadows)',
        'night': '(city lights, artificial illumination, long exposure feel)',
    };
    return descriptions[time];
}

export function getWeatherDescription(weather: LandscapeWeather): string {
    const descriptions: Record<LandscapeWeather, string> = {
        'clear': '(crystal clear sky, high visibility, vivid colors)',
        'partly-cloudy': '(dynamic clouds, varied lighting, depth)',
        'overcast': '(soft diffused light, muted colors, even illumination)',
        'light-rain': '(wet surfaces, enhanced reflections, atmospheric mood)',
    };
    return descriptions[weather];
}

export function getSeasonDescription(season: LandscapeSeason): string {
    const descriptions: Record<LandscapeSeason, string> = {
        'spring': '(fresh green foliage, cherry blossoms, vibrant)',
        'summer': '(lush green vegetation, clear atmosphere)',
        'autumn': '(golden and red foliage, warm earth tones)',
        'winter': '(bare trees, possible snow, crisp air, cool tones)',
    };
    return descriptions[season];
}

// ===== 나침반 방향 =====

export function getCompassDirection(heading: number): string {
    const directions = [
        'N', 'NNE', 'NE', 'ENE',
        'E', 'ESE', 'SE', 'SSE',
        'S', 'SSW', 'SW', 'WSW',
        'W', 'WNW', 'NW', 'NNW',
    ];
    const index = Math.round(heading / 22.5) % 16;
    return directions[index];
}

export function getCompassLabel(heading: number): string {
    return getCompassDirection(heading);
}
