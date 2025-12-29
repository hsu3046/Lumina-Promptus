// lib/landscape/reference-image-generator.ts
// 14장 참조 이미지 URL 생성기

import type { LandscapeReferenceImage } from '@/types/landscape.types';

interface StreetViewConfig {
    location: [number, number]; // [lat, lng]
    heading: number;
    pitch: number;
    fov: number;
    size: [number, number]; // [width, height]
}

/**
 * Street View Static API URL 생성
 */
function generateStreetViewURL(config: StreetViewConfig, apiKey?: string): string {
    const [lat, lng] = config.location;
    const [width, height] = config.size;

    // API 키가 없으면 placeholder URL 생성 (개발용)
    if (!apiKey) {
        return `https://maps.googleapis.com/maps/api/streetview?size=${width}x${height}&location=${lat},${lng}&heading=${config.heading}&pitch=${config.pitch}&fov=${config.fov}&key=YOUR_API_KEY`;
    }

    return `https://maps.googleapis.com/maps/api/streetview?` +
        `size=${width}x${height}` +
        `&location=${lat},${lng}` +
        `&heading=${config.heading}` +
        `&pitch=${config.pitch}` +
        `&fov=${config.fov}` +
        `&key=${apiKey}`;
}

/**
 * Mapbox Satellite API URL 생성
 */
function generateSatelliteURL(
    location: [number, number],
    mapboxToken?: string
): string {
    const [lat, lng] = location;
    const zoom = 15;
    const width = 600;
    const height = 400;

    // API 키가 없으면 placeholder URL 생성
    if (!mapboxToken) {
        return `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${lng},${lat},${zoom},0/${width}x${height}@2x?access_token=YOUR_MAPBOX_TOKEN`;
    }

    return `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/` +
        `${lng},${lat},${zoom},0/${width}x${height}@2x?` +
        `access_token=${mapboxToken}`;
}

/**
 * 14장 참조 이미지 URL 생성
 * - 중심 뷰 5장 (정확한 각도 + 미세 변형)
 * - 360° 주변 8장
 * - 위성 이미지 1장
 */
export function generate14ReferenceImages(
    location: [number, number],
    userHeading: number,
    userPitch: number,
    options?: {
        googleApiKey?: string;
        mapboxToken?: string;
        imageSize?: [number, number];
        fov?: number;
    }
): LandscapeReferenceImage[] {
    const images: LandscapeReferenceImage[] = [];
    const size = options?.imageSize || [600, 400];
    const fov = options?.fov || 90;

    // ===== 1-5: 중심 뷰 (미세 각도 변형) =====
    const centerVariations = [
        { heading: userHeading, pitch: userPitch, label: 'center_exact', desc: '유저 선택 정확한 각도' },
        { heading: userHeading - 10, pitch: userPitch, label: 'center_left10', desc: '왼쪽 10°' },
        { heading: userHeading + 10, pitch: userPitch, label: 'center_right10', desc: '오른쪽 10°' },
        { heading: userHeading, pitch: userPitch + 5, label: 'center_up5', desc: '위 5°' },
        { heading: userHeading, pitch: userPitch - 5, label: 'center_down5', desc: '아래 5°' },
    ];

    centerVariations.forEach((v, idx) => {
        const url = generateStreetViewURL(
            { location, heading: v.heading, pitch: v.pitch, fov, size },
            options?.googleApiKey
        );
        images.push({
            id: `ref_${String(idx + 1).padStart(2, '0')}`,
            type: 'center',
            label: v.label,
            heading: v.heading,
            pitch: v.pitch,
            url,
        });
    });

    // ===== 6-13: 360° 주변 (8방향) =====
    const surroundingDirections = [
        { heading: 0, label: 'north_0', desc: '북쪽' },
        { heading: 45, label: 'northeast_45', desc: '북동' },
        { heading: 90, label: 'east_90', desc: '동쪽' },
        { heading: 135, label: 'southeast_135', desc: '남동' },
        { heading: 180, label: 'south_180', desc: '남쪽' },
        { heading: 225, label: 'southwest_225', desc: '남서' },
        { heading: 270, label: 'west_270', desc: '서쪽' },
        { heading: 315, label: 'northwest_315', desc: '북서' },
    ];

    surroundingDirections.forEach((d, idx) => {
        const url = generateStreetViewURL(
            { location, heading: d.heading, pitch: 0, fov, size },
            options?.googleApiKey
        );
        images.push({
            id: `ref_${String(idx + 6).padStart(2, '0')}`,
            type: 'surrounding',
            label: d.label,
            heading: d.heading,
            pitch: 0,
            url,
        });
    });

    // ===== 14: 위성 이미지 =====
    const satelliteUrl = generateSatelliteURL(location, options?.mapboxToken);
    images.push({
        id: 'ref_14',
        type: 'satellite',
        label: 'satellite',
        heading: 0,
        pitch: -90,
        url: satelliteUrl,
    });

    return images;
}

/**
 * 참조 이미지 목록을 파일명으로 변환 (다운로드용)
 */
export function getReferenceImageFilenames(images: LandscapeReferenceImage[]): string[] {
    return images.map((img, idx) => {
        const num = String(idx + 1).padStart(2, '0');
        return `${num}_${img.label}.jpg`;
    });
}
