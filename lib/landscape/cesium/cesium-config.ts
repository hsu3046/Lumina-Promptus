// lib/landscape/cesium/cesium-config.ts
// CesiumJS 구성 및 초기화

/**
 * CesiumJS 기본 설정
 * Google Photorealistic 3D Tiles 사용을 위한 구성
 */
export const CESIUM_CONFIG = {
    // Cesium Ion 기본 토큰 (무료 플랜으로 시작 가능)
    // https://ion.cesium.com/signup 에서 발급
    defaultAccessToken: process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN || '',

    // Google Maps API 키 (3D Tiles에도 사용)
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',

    // 3D Tiles URL (API 키 포함)
    get google3DTilesUrl() {
        return `https://tile.googleapis.com/v1/3dtiles/root.json?key=${this.googleMapsApiKey}`;
    },
};

/**
 * 카메라 위치를 Cesium Cartesian3로 변환
 */
export function latLngToCartesian(
    lat: number,
    lng: number,
    height: number = 0
) {
    // CesiumJS의 Cartesian3.fromDegrees와 동일한 계산
    // 지구 반지름 (WGS84)
    const a = 6378137.0; // 적도 반지름 (m)
    const b = 6356752.3142; // 극 반지름 (m)

    const latRad = lat * (Math.PI / 180);
    const lngRad = lng * (Math.PI / 180);

    const cosLat = Math.cos(latRad);
    const sinLat = Math.sin(latRad);
    const cosLng = Math.cos(lngRad);
    const sinLng = Math.sin(lngRad);

    // 지구 타원체 상의 위치
    const N = a / Math.sqrt(1 - ((a * a - b * b) / (a * a)) * sinLat * sinLat);

    const x = (N + height) * cosLat * cosLng;
    const y = (N + height) * cosLat * sinLng;
    const z = ((b * b) / (a * a) * N + height) * sinLat;

    return { x, y, z };
}

/**
 * 도 단위를 라디안으로 변환
 */
export function degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
 * 라디안을 도 단위로 변환
 */
export function radiansToDegrees(radians: number): number {
    return radians * (180 / Math.PI);
}

/**
 * 렌즈 초점거리에 따른 FOV 계산
 * 35mm 풀프레임 기준
 */
export function focalLengthToFov(focalLengthMm: number): number {
    // 대각선 FOV = 2 * atan(d / (2 * f))
    // 35mm 풀프레임 대각선 = 43.27mm
    const diagonalMm = 43.27;
    const fovRadians = 2 * Math.atan(diagonalMm / (2 * focalLengthMm));
    return radiansToDegrees(fovRadians);
}

/**
 * 24mm 광각 렌즈 투영 설정
 */
export const LENS_PROJECTIONS = {
    '14mm': { fov: focalLengthToFov(14), near: 0.1, far: 50000 },
    '24mm': { fov: focalLengthToFov(24), near: 0.1, far: 50000 },
    '35mm': { fov: focalLengthToFov(35), near: 0.1, far: 50000 },
    '50mm': { fov: focalLengthToFov(50), near: 0.1, far: 50000 },
    '85mm': { fov: focalLengthToFov(85), near: 0.1, far: 50000 },
    '105mm': { fov: focalLengthToFov(105), near: 0.1, far: 50000 },
};
