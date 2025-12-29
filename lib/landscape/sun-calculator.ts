// lib/landscape/sun-calculator.ts
// 태양 위치 및 그림자 방향 계산 유틸리티
// suncalc 라이브러리 기반

import SunCalc from 'suncalc';

export interface SunPosition {
    altitude: number;      // 태양 고도 (라디안 → 도 변환 필요)
    azimuth: number;       // 태양 방위각 (라디안 → 도 변환 필요)
    altitudeDeg: number;   // 태양 고도 (도)
    azimuthDeg: number;    // 태양 방위각 (도, 북=0°, 시계방향)
}

export interface ShadowInfo {
    direction: number;     // 그림자 방향 (도, 북=0°)
    lengthRatio: number;   // 그림자 길이 비율 (건물 높이 대비)
    isVisible: boolean;    // 태양이 지평선 위인지
}

export interface GoldenHourInfo {
    isGoldenHour: boolean;
    isBlueHour: boolean;
    isSunrise: boolean;
    isSunset: boolean;
    sunriseTime: Date;
    sunsetTime: Date;
    goldenHourStart: Date;
    goldenHourEnd: Date;
}

/**
 * 주어진 위치와 시간에서 태양의 위치를 계산
 */
export function calculateSunPosition(
    lat: number,
    lng: number,
    date: Date = new Date()
): SunPosition {
    const position = SunCalc.getPosition(date, lat, lng);

    // 라디안을 도로 변환
    const altitudeDeg = position.altitude * (180 / Math.PI);

    // SunCalc의 azimuth는 남쪽=0이고 서쪽이 양수
    // 우리는 북쪽=0, 시계방향(동=90°)으로 변환
    let azimuthDeg = position.azimuth * (180 / Math.PI) + 180;
    if (azimuthDeg >= 360) azimuthDeg -= 360;
    if (azimuthDeg < 0) azimuthDeg += 360;

    return {
        altitude: position.altitude,
        azimuth: position.azimuth,
        altitudeDeg,
        azimuthDeg,
    };
}

/**
 * 그림자 정보 계산 (태양 반대 방향)
 */
export function calculateShadowInfo(
    sunPosition: SunPosition,
    buildingHeight: number = 10
): ShadowInfo {
    // 태양이 지평선 아래면 그림자 없음
    if (sunPosition.altitudeDeg <= 0) {
        return {
            direction: 0,
            lengthRatio: 0,
            isVisible: false,
        };
    }

    // 그림자 방향은 태양의 반대 방향 (180° 반전)
    let shadowDirection = sunPosition.azimuthDeg + 180;
    if (shadowDirection >= 360) shadowDirection -= 360;

    // 그림자 길이 = 건물 높이 / tan(태양 고도)
    // 태양이 낮을수록 그림자가 길어짐
    const tanAltitude = Math.tan(sunPosition.altitude);
    const lengthRatio = tanAltitude > 0 ? 1 / tanAltitude : 0;

    return {
        direction: shadowDirection,
        lengthRatio: Math.min(lengthRatio, 10), // 최대 10배로 제한
        isVisible: true,
    };
}

/**
 * 골든아워/블루아워 정보 계산
 */
export function calculateGoldenHourInfo(
    lat: number,
    lng: number,
    date: Date = new Date()
): GoldenHourInfo {
    const times = SunCalc.getTimes(date, lat, lng);
    const sunPosition = calculateSunPosition(lat, lng, date);

    // 골든아워: 태양 고도 -4° ~ 6°
    // 블루아워: 태양 고도 -6° ~ -4°
    const altitude = sunPosition.altitudeDeg;

    const isGoldenHour = altitude >= -4 && altitude <= 6;
    const isBlueHour = altitude >= -6 && altitude < -4;

    // 일출/일몰 시간 전후 30분
    const now = date.getTime();
    const sunriseTime = times.sunrise.getTime();
    const sunsetTime = times.sunset.getTime();

    const isSunrise = Math.abs(now - sunriseTime) < 30 * 60 * 1000;
    const isSunset = Math.abs(now - sunsetTime) < 30 * 60 * 1000;

    return {
        isGoldenHour,
        isBlueHour,
        isSunrise,
        isSunset,
        sunriseTime: times.sunrise,
        sunsetTime: times.sunset,
        goldenHourStart: times.goldenHour,
        goldenHourEnd: times.goldenHourEnd,
    };
}

/**
 * 현재 시간대를 라벨로 변환
 */
export function getTimeOfDayLabel(
    lat: number,
    lng: number,
    date: Date = new Date()
): string {
    const sunPosition = calculateSunPosition(lat, lng, date);
    const goldenHour = calculateGoldenHourInfo(lat, lng, date);

    if (goldenHour.isBlueHour) {
        return 'Blue Hour';
    }
    if (goldenHour.isGoldenHour) {
        if (goldenHour.isSunrise) return 'Sunrise';
        if (goldenHour.isSunset) return 'Sunset';
        return 'Golden Hour';
    }
    if (sunPosition.altitudeDeg < 0) {
        return 'Night';
    }
    if (sunPosition.altitudeDeg > 60) {
        return 'Midday';
    }
    return 'Daytime';
}

/**
 * Gemini 프롬프트용 태양/그림자 설명 생성
 */
export function generateLightingPrompt(
    lat: number,
    lng: number,
    date: Date = new Date(),
    buildingHeight: number = 50
): string {
    const sunPos = calculateSunPosition(lat, lng, date);
    const shadow = calculateShadowInfo(sunPos, buildingHeight);
    const timeLabel = getTimeOfDayLabel(lat, lng, date);

    // 태양이 지평선 아래
    if (!shadow.isVisible) {
        return `Time: ${timeLabel}. No direct sunlight - night scene with artificial lighting.`;
    }

    // 태양 방향을 나침반 라벨로 변환
    const sunDirection = getCompassDirection(sunPos.azimuthDeg);
    const shadowDirection = getCompassDirection(shadow.direction);

    const lines = [
        `Lighting Conditions: ${timeLabel}`,
        `Sun Position: ${sunPos.altitudeDeg.toFixed(1)}° altitude from ${sunDirection}`,
        `Shadow Direction: ${shadowDirection}, length ratio ${shadow.lengthRatio.toFixed(1)}x building height`,
    ];

    if (buildingHeight > 0) {
        const shadowLength = (buildingHeight * shadow.lengthRatio).toFixed(0);
        lines.push(`For a ${buildingHeight}m structure, shadows extend approximately ${shadowLength}m`);
    }

    return lines.join('\n');
}

/**
 * 방위각을 나침반 방향으로 변환
 */
function getCompassDirection(azimuth: number): string {
    const directions = [
        'North', 'North-Northeast', 'Northeast', 'East-Northeast',
        'East', 'East-Southeast', 'Southeast', 'South-Southeast',
        'South', 'South-Southwest', 'Southwest', 'West-Southwest',
        'West', 'West-Northwest', 'Northwest', 'North-Northwest',
    ];
    const index = Math.round(azimuth / 22.5) % 16;
    return directions[index];
}
