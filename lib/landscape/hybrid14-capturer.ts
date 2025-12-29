// lib/landscape/hybrid14-capturer.ts
// Hybrid 14 참조 이미지 캡처 로직
// 3D Tiles 6장 + Street View 8장 = 14장 자동 생성

export interface Hybrid14Config {
    lat: number;
    lng: number;
    userHeading: number;  // 사용자가 선택한 주요 방향
    userPitch: number;
    elevation: number;
}

export interface CaptureSlot {
    slot: number;
    type: '3d_birdseye' | '3d_target' | 'streetview';
    altitude: number;
    heading: number;
    pitch: number;
    fov: number;
    description: string;
}

/**
 * Hybrid 14 슬롯 구성 생성
 */
export function generateHybrid14Slots(config: Hybrid14Config): CaptureSlot[] {
    const { userHeading, userPitch, elevation } = config;

    const slots: CaptureSlot[] = [];

    // === 3D Tiles: 6장 ===

    // A. 버드아이 뷰 (2장) - 구조 파악용
    slots.push({
        slot: 1,
        type: '3d_birdseye',
        altitude: 200,
        heading: 0,
        pitch: -90,  // 직하방
        fov: 60,
        description: 'Bird\'s eye view 200m - building layout',
    });

    slots.push({
        slot: 2,
        type: '3d_birdseye',
        altitude: 500,
        heading: 0,
        pitch: -90,  // 직하방
        fov: 60,
        description: 'Bird\'s eye view 500m - area context',
    });

    // B. 24mm 타겟 뷰 (4장) - 구도 가이드용
    slots.push({
        slot: 3,
        type: '3d_target',
        altitude: elevation + 1.7,  // 눈높이
        heading: userHeading,
        pitch: userPitch,
        fov: 84,  // 24mm FOV
        description: '24mm target view - main composition',
    });

    slots.push({
        slot: 4,
        type: '3d_target',
        altitude: elevation + 1.7,
        heading: userHeading,
        pitch: userPitch - 15,  // 약간 위로
        fov: 84,
        description: '24mm upper view - sky context',
    });

    slots.push({
        slot: 5,
        type: '3d_target',
        altitude: elevation + 1.7,
        heading: normalizeHeading(userHeading - 30),  // 좌측
        pitch: userPitch,
        fov: 84,
        description: '24mm left view - perspective guide',
    });

    slots.push({
        slot: 6,
        type: '3d_target',
        altitude: elevation + 1.7,
        heading: normalizeHeading(userHeading + 30),  // 우측
        pitch: userPitch,
        fov: 84,
        description: '24mm right view - perspective guide',
    });

    // === Street View: 8장 ===

    // C. 45도 간격 파노라마 (8장) - 질감 데이터
    const streetViewHeadings = [0, 45, 90, 135, 180, 225, 270, 315];

    streetViewHeadings.forEach((heading, index) => {
        slots.push({
            slot: 7 + index,
            type: 'streetview',
            altitude: 0,  // Street View는 고도 없음
            heading: normalizeHeading(userHeading + heading),
            pitch: 0,
            fov: 90,
            description: `Street View ${heading}° - texture reference`,
        });
    });

    return slots;
}

/**
 * 방향을 0-360 범위로 정규화
 */
function normalizeHeading(heading: number): number {
    while (heading < 0) heading += 360;
    while (heading >= 360) heading -= 360;
    return heading;
}

/**
 * 캡처 진행 상태
 */
export interface CaptureProgress {
    currentSlot: number;
    totalSlots: number;
    currentType: '3d_birdseye' | '3d_target' | 'streetview' | null;
    currentDescription: string;
    phase: 'preparing' | 'rendering' | 'capturing' | 'complete' | 'error';
    percentage: number;
    capturedImages: string[];  // Data URLs
    error?: string;
}

/**
 * 초기 진행 상태
 */
export function createInitialProgress(): CaptureProgress {
    return {
        currentSlot: 0,
        totalSlots: 14,
        currentType: null,
        currentDescription: '',
        phase: 'preparing',
        percentage: 0,
        capturedImages: [],
    };
}

/**
 * Street View Static API URL 생성
 */
export function generateStreetViewUrl(
    lat: number,
    lng: number,
    heading: number,
    pitch: number = 0,
    fov: number = 90,
    size: string = '640x640'
): string {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return '';

    return `https://maps.googleapis.com/maps/api/streetview?` +
        `size=${size}` +
        `&location=${lat},${lng}` +
        `&heading=${heading}` +
        `&pitch=${pitch}` +
        `&fov=${fov}` +
        `&key=${apiKey}`;
}

/**
 * 메타데이터 JSON 생성 (Gemini 프롬프트용)
 */
export function generateCaptureMetadata(
    config: Hybrid14Config,
    slots: CaptureSlot[]
): object {
    return {
        location: {
            lat: config.lat,
            lng: config.lng,
            elevation: config.elevation,
        },
        userSettings: {
            heading: config.userHeading,
            pitch: config.userPitch,
        },
        captureGuide: {
            total: 14,
            tiles3D: {
                count: 6,
                purpose: 'Spatial structure, shadow direction, perspective geometry',
                slots: slots.filter(s => s.type !== 'streetview'),
            },
            streetView: {
                count: 8,
                purpose: 'Real-world textures, materials, signage, vegetation',
                slots: slots.filter(s => s.type === 'streetview'),
            },
        },
    };
}
