// config/mappings/landscape-environment.ts
// 풍경 사진 환경 설정 매핑

import type {
    LandscapeTimeOfDay,
    LandscapeWeather,
    LandscapeSeason,
    LandscapeLensType,
    LandscapeAtmosphere,
} from '@/types/landscape.types';

// ===== 시간대 옵션 =====

export const LANDSCAPE_TIME_OPTIONS: { value: LandscapeTimeOfDay; label: string; desc: string }[] = [
    { value: 'dawn', label: '새벽', desc: '어두운 하늘, 고요한 분위기' },
    { value: 'sunrise', label: '일출', desc: '따뜻한 황금빛, 긴 그림자' },
    { value: 'golden-hour', label: '골든아워', desc: '드라마틱한 황금빛' },
    { value: 'morning', label: '오전', desc: '상쾌한 아침 햇살' },
    { value: 'midday', label: '한낮', desc: '밝은 태양, 높은 대비' },
    { value: 'afternoon', label: '오후', desc: '부드러운 오후 햇살' },
    { value: 'sunset', label: '일몰', desc: '붉은 하늘, 드라마틱 광선' },
    { value: 'blue-hour', label: '블루아워', desc: '시원한 청색 톤' },
    { value: 'dusk', label: '황혼', desc: '마지막 여명, 보라색 하늘' },
    { value: 'night', label: '밤', desc: '도시 불빛, 장노출 효과' },
];

// ===== 날씨 옵션 =====

export const LANDSCAPE_WEATHER_OPTIONS: { value: LandscapeWeather; label: string; desc: string }[] = [
    { value: 'clear', label: '맑음', desc: '맑은 하늘, 선명한 색상' },
    { value: 'mostly-clear', label: '대체로 맑음', desc: '약간의 구름, 화창한 날' },
    { value: 'partly-cloudy', label: '구름 조금', desc: '역동적인 구름, 다양한 조명' },
    { value: 'overcast', label: '흐림', desc: '부드러운 확산광' },
    { value: 'fog', label: '안개', desc: '신비로운 분위기, 실루엿' },
    { value: 'drizzle', label: '이슬비', desc: '부슬부슬 비, 촉촉한 느낌' },
    { value: 'rain', label: '비', desc: '젯은 표면 반사, 분위기 있는 무드' },
    { value: 'heavy-rain', label: '폭우', desc: '강렬한 빗줄기, 드라마틱' },
    { value: 'snow', label: '눈', desc: '하얀 눈, 고요한 분위기' },
    { value: 'heavy-snow', label: '폭설', desc: '두꺿게 쌍인 눈, 환상적' },
    { value: 'thunderstorm', label: '뇌우', desc: '번개, 어두운 하늘, 극적' },
];

// ===== 계절 옵션 =====

export const LANDSCAPE_SEASON_OPTIONS: { value: LandscapeSeason; label: string; desc: string }[] = [
    { value: 'spring', label: '봄', desc: '신선한 녹색, 벚꽃, 생동감' },
    { value: 'summer', label: '여름', desc: '푸른 초목, 맑은 대기' },
    { value: 'autumn', label: '가을', desc: '황금빛 단풍, 따뜻한 색조' },
    { value: 'winter', label: '겨울', desc: '앙상한 나무, 눈, 차가운 톤' },
];

// ===== 분위기 옵션 =====

export const LANDSCAPE_ATMOSPHERE_OPTIONS: { value: LandscapeAtmosphere; label: string; desc: string }[] = [
    { value: 'mist', label: '은은한 박무', desc: '부드러운 안개, 실루엣 강조' },
    { value: 'haze', label: '시네마틱 연무', desc: '깊이감 있는 공기 레이어' },
    { value: 'clear', label: '투명한 공기', desc: '선명한 디테일, 높은 대비' },
    { value: 'grain', label: '아날로그 입자감', desc: '필름 질감, 빈티지 느낌' },
    { value: 'rays', label: '웅장한 빛내림', desc: '구름 사이 빛줄기, 드라마틱' },
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
        'dawn': 'pre-dawn darkness, quiet atmosphere, deep blue sky',
        'sunrise': 'warm golden light, long shadows, soft glow',
        'golden-hour': 'warm golden tones, dramatic long shadows, rich colors',
        'morning': 'fresh morning light, crisp shadows, energetic feel',
        'midday': 'bright overhead sun, short shadows, high contrast',
        'afternoon': 'soft warm afternoon light, gentle shadows',
        'sunset': 'red and orange sky, dramatic backlighting',
        'blue-hour': 'cool blue tones, soft diffused light, minimal shadows',
        'dusk': 'last twilight, purple and pink hues, fading light',
        'night': 'city lights, artificial illumination, long exposure feel',
    };
    return descriptions[time] || descriptions['midday'];
}

export function getWeatherDescription(weather: LandscapeWeather): string {
    const descriptions: Record<LandscapeWeather, string> = {
        'clear': 'crystal clear sky, high visibility, vivid colors',
        'mostly-clear': 'mostly clear with few clouds, bright day',
        'partly-cloudy': 'dynamic clouds, varied lighting, depth',
        'overcast': 'soft diffused light, muted colors, even illumination',
        'fog': 'mysterious fog, silhouettes, low visibility, ethereal',
        'drizzle': 'light drizzle, wet surfaces, soft atmosphere',
        'rain': 'wet surfaces, enhanced reflections, atmospheric mood',
        'heavy-rain': 'heavy rainfall, dramatic streaks, moody atmosphere',
        'snow': 'white snow, quiet atmosphere, soft lighting',
        'heavy-snow': 'heavy snowfall, winter wonderland, pristine',
        'thunderstorm': 'lightning, dark clouds, dramatic sky',
    };
    return descriptions[weather] || descriptions['clear'];
}

export function getSeasonDescription(season: LandscapeSeason): string {
    const descriptions: Record<LandscapeSeason, string> = {
        'spring': 'fresh green foliage, cherry blossoms, vibrant',
        'summer': 'lush green vegetation, clear atmosphere',
        'autumn': 'golden and red foliage, warm earth tones',
        'winter': 'bare trees, possible snow, crisp air, cool tones',
    };
    return descriptions[season];
}

export function getAtmosphereDescription(atmosphere: LandscapeAtmosphere): string {
    const descriptions: Record<LandscapeAtmosphere, string> = {
        'mist': 'soft mist layer, silhouettes emphasized, low contrast distant elements',
        'haze': 'cinematic haze with visible light particles, enhanced depth',
        'clear': 'transparent air, no atmospheric effects, maximum detail',
        'grain': 'analog film grain texture, nostalgic feel, organic imperfections',
        'rays': 'god rays through clouds, dramatic light beams, high contrast',
    };
    return descriptions[atmosphere];
}

// ===== 나침반 방향 =====

export function getCompassDirection(heading: number): string {
    const directions = [
        'North', 'North-Northeast', 'Northeast', 'East-Northeast',
        'East', 'East-Southeast', 'Southeast', 'South-Southeast',
        'South', 'South-Southwest', 'Southwest', 'West-Southwest',
        'West', 'West-Northwest', 'Northwest', 'North-Northwest',
    ];
    const index = Math.round(heading / 22.5) % 16;
    return directions[index];
}

export function getCompassLabel(heading: number): string {
    return getCompassDirection(heading);
}

