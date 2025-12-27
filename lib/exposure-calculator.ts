// lib/exposure-calculator.ts
// 노출 계산 유틸리티 - EV 공식 기반

/**
 * 렌즈 특성 타입별 기준 EV 값
 */
export const TARGET_EV_BY_CHARACTERISTIC: Record<string, number> = {
    studio: 12,        // 밝은 스튜디오 조명
    landscape: 14,     // 맑은 날 야외
    architecture: 10,  // 실내 건축
    product: 11,       // 제품 촬영 조명
    street: 13,        // 밝은 도심
};

/**
 * f-number를 EV 스톱 단위로 변환
 * EV stops = 2 * log₂(N)
 */
export function apertureToStops(aperture: string): number {
    const fNumber = parseFloat(aperture.replace('f/', ''));
    if (isNaN(fNumber) || fNumber <= 0) return 0;
    return 2 * Math.log2(fNumber);
}

/**
 * EV 스톱을 f-number로 변환
 */
export function stopsToAperture(stops: number): number {
    return Math.pow(2, stops / 2);
}

/**
 * 셔터 스피드 문자열을 초 단위로 변환
 * 예: "1/200" -> 0.005, "2" -> 2
 */
export function shutterSpeedToSeconds(shutter: string): number {
    if (shutter.includes('/')) {
        const [numerator, denominator] = shutter.split('/').map(Number);
        return numerator / denominator;
    }
    return parseFloat(shutter);
}

/**
 * 셔터 스피드를 EV 스톱 단위로 변환
 * EV stops = -log₂(t) where t is in seconds
 */
export function shutterSpeedToStops(shutter: string): number {
    const seconds = shutterSpeedToSeconds(shutter);
    if (isNaN(seconds) || seconds <= 0) return 0;
    return -Math.log2(seconds);
}

/**
 * EV 스톱을 초 단위 셔터 스피드로 변환
 */
export function stopsToShutterSpeed(stops: number): number {
    return Math.pow(2, -stops);
}

/**
 * ISO를 EV 스톱 단위로 변환
 * EV stops = log₂(ISO / 100)
 */
export function isoToStops(iso: number): number {
    if (iso <= 0) return 0;
    return Math.log2(iso / 100);
}

/**
 * EV 스톱을 ISO로 변환
 */
export function stopsToISO(stops: number): number {
    return 100 * Math.pow(2, stops);
}

/**
 * 현재 설정의 EV (Exposure Value) 계산
 * EV = log₂(N² / t) - log₂(ISO / 100)
 * 
 * 간소화:
 * EV = apertureStops + shutterStops - isoStops
 */
export function calculateEV(aperture: string, shutterSpeed: string, iso: number): number {
    const aStops = apertureToStops(aperture);
    const sStops = shutterSpeedToStops(shutterSpeed);
    const iStops = isoToStops(iso);

    return aStops + sStops - iStops;
}

/**
 * 가장 가까운 스톱 값 찾기
 */
export function findClosestStop<T>(value: number, stops: T[], getValue: (stop: T) => number): T {
    if (stops.length === 0) return stops[0];

    let closest = stops[0];
    let minDiff = Math.abs(getValue(stops[0]) - value);

    for (const stop of stops) {
        const diff = Math.abs(getValue(stop) - value);
        if (diff < minDiff) {
            minDiff = diff;
            closest = stop;
        }
    }

    return closest;
}

/**
 * 목표 EV를 달성하기 위한 조리개 계산
 * targetEV = apertureStops + shutterStops - isoStops
 * apertureStops = targetEV - shutterStops + isoStops
 */
export function calculateAutoAperture(
    targetEV: number,
    shutterSpeed: string,
    iso: number,
    apertureStops: string[]
): string {
    const sStops = shutterSpeedToStops(shutterSpeed);
    const iStops = isoToStops(iso);

    const requiredApertureStops = targetEV - sStops + iStops;
    const requiredFNumber = stopsToAperture(requiredApertureStops);

    // 가장 가까운 조리개 값 찾기
    return findClosestStop(
        requiredFNumber,
        apertureStops,
        (f) => parseFloat(f.replace('f/', ''))
    );
}

/**
 * 목표 EV를 달성하기 위한 셔터 스피드 계산
 * targetEV = apertureStops + shutterStops - isoStops
 * shutterStops = targetEV - apertureStops + isoStops
 */
export function calculateAutoShutterSpeed(
    targetEV: number,
    aperture: string,
    iso: number,
    shutterStops: string[]
): string {
    const aStops = apertureToStops(aperture);
    const iStops = isoToStops(iso);

    const requiredShutterStops = targetEV - aStops + iStops;
    const requiredSeconds = stopsToShutterSpeed(requiredShutterStops);

    // 가장 가까운 셔터 스피드 찾기
    return findClosestStop(
        requiredSeconds,
        shutterStops,
        shutterSpeedToSeconds
    );
}

/**
 * 목표 EV를 달성하기 위한 ISO 계산
 * targetEV = apertureStops + shutterStops - isoStops
 * isoStops = apertureStops + shutterStops - targetEV
 */
export function calculateAutoISO(
    targetEV: number,
    aperture: string,
    shutterSpeed: string,
    isoStops: number[]
): number {
    const aStops = apertureToStops(aperture);
    const sStops = shutterSpeedToStops(shutterSpeed);

    const requiredISOStops = aStops + sStops - targetEV;
    const requiredISO = stopsToISO(requiredISOStops);

    // 가장 가까운 ISO 찾기
    return findClosestStop(
        requiredISO,
        isoStops,
        (iso) => iso
    );
}

/**
 * EV 차이 계산 (현재 EV - 목표 EV)
 * 양수: 과다 노출, 음수: 노출 부족
 */
export function getEVDifference(
    aperture: string,
    shutterSpeed: string,
    iso: number,
    targetEV: number
): number {
    const currentEV = calculateEV(aperture, shutterSpeed, iso);
    return currentEV - targetEV;
}

/**
 * 노출 상태 확인
 */
export function getExposureStatus(evDifference: number, tolerance = 0.5): 'underexposed' | 'normal' | 'overexposed' {
    if (evDifference < -tolerance) return 'underexposed';
    if (evDifference > tolerance) return 'overexposed';
    return 'normal';
}
