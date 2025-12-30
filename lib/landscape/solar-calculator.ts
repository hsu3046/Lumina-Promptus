// lib/landscape/solar-calculator.ts
// 태양 위치 계산기 - SunCalc 기반
// 골든아워, 블루아워 정확한 시간 계산

import SunCalc from 'suncalc';

export interface SolarPosition {
    altitude: number;      // 고도 (도)
    azimuth: number;       // 방위각 (도, 북=0, 시계방향)
}

export interface GoldenHourInfo {
    morningStart: Date;    // 아침 골든아워 시작
    morningEnd: Date;      // 아침 골든아워 끝 (일출)
    eveningStart: Date;    // 저녁 골든아워 시작 (일몰)
    eveningEnd: Date;      // 저녁 골든아워 끝
}

export interface BlueHourInfo {
    morningStart: Date;    // 아침 블루아워 시작
    morningEnd: Date;      // 아침 블루아워 끝
    eveningStart: Date;    // 저녁 블루아워 시작
    eveningEnd: Date;      // 저녁 블루아워 끝
}

export interface SolarInfo {
    position: SolarPosition;
    goldenHour: GoldenHourInfo;
    blueHour: BlueHourInfo;
    sunrise: Date;
    sunset: Date;
    solarNoon: Date;
    currentPhase: 'night' | 'blue-hour' | 'golden-hour' | 'daylight';
}

/**
 * 라디안을 도(degree)로 변환
 */
function toDegrees(radians: number): number {
    return radians * (180 / Math.PI);
}

/**
 * 현재 태양 위치 계산
 */
export function getSolarPosition(lat: number, lng: number, date: Date = new Date()): SolarPosition {
    const pos = SunCalc.getPosition(date, lat, lng);

    // azimuth: 남=0 기준 → 북=0 기준으로 변환 (+180)
    let azimuth = toDegrees(pos.azimuth) + 180;
    if (azimuth >= 360) azimuth -= 360;

    return {
        altitude: toDegrees(pos.altitude),
        azimuth: azimuth,
    };
}

/**
 * 태양 이벤트 시간 계산 (일출, 일몰, 골든아워, 블루아워)
 */
export function getSolarTimes(lat: number, lng: number, date: Date = new Date()): SolarInfo {
    const times = SunCalc.getTimes(date, lat, lng);
    const position = getSolarPosition(lat, lng, date);

    // 골든아워: 일출/일몰 전후 약 30분
    const goldenHour: GoldenHourInfo = {
        morningStart: new Date(times.sunrise.getTime() - 30 * 60 * 1000),
        morningEnd: times.sunrise,
        eveningStart: times.sunset,
        eveningEnd: new Date(times.sunset.getTime() + 30 * 60 * 1000),
    };

    // 블루아워: 일출 전/일몰 후 약 30분 (nautical twilight)
    const blueHour: BlueHourInfo = {
        morningStart: times.nauticalDawn,
        morningEnd: times.dawn,
        eveningStart: times.dusk,
        eveningEnd: times.nauticalDusk,
    };

    // 현재 시간대 판단
    const now = date;
    let currentPhase: SolarInfo['currentPhase'] = 'daylight';

    if (position.altitude < -6) {
        currentPhase = 'night';
    } else if (position.altitude < 0) {
        currentPhase = 'blue-hour';
    } else if (position.altitude < 6) {
        currentPhase = 'golden-hour';
    }

    return {
        position,
        goldenHour,
        blueHour,
        sunrise: times.sunrise,
        sunset: times.sunset,
        solarNoon: times.solarNoon,
        currentPhase,
    };
}

/**
 * 골든아워 시간을 한국어 문자열로 포맷
 */
export function formatGoldenHour(goldenHour: GoldenHourInfo): string {
    const format = (d: Date) => {
        const h = d.getHours().toString().padStart(2, '0');
        const m = d.getMinutes().toString().padStart(2, '0');
        return `${h}:${m}`;
    };

    return `아침 ${format(goldenHour.morningStart)}-${format(goldenHour.morningEnd)}, 저녁 ${format(goldenHour.eveningStart)}-${format(goldenHour.eveningEnd)}`;
}

/**
 * 빛 방향 설명 생성 (프롬프트용)
 */
export function getLightingDescription(solarInfo: SolarInfo): string {
    const { position, currentPhase } = solarInfo;

    // 방위각을 방향으로 변환
    const getDirection = (azimuth: number): string => {
        if (azimuth < 22.5 || azimuth >= 337.5) return 'from the north';
        if (azimuth < 67.5) return 'from the northeast';
        if (azimuth < 112.5) return 'from the east';
        if (azimuth < 157.5) return 'from the southeast';
        if (azimuth < 202.5) return 'from the south';
        if (azimuth < 247.5) return 'from the southwest';
        if (azimuth < 292.5) return 'from the west';
        return 'from the northwest';
    };

    const direction = getDirection(position.azimuth);
    const altitude = position.altitude.toFixed(0);

    switch (currentPhase) {
        case 'golden-hour':
            return `warm golden light ${direction}, sun at ${altitude}° altitude, long dramatic shadows`;
        case 'blue-hour':
            return `soft blue ambient light, cool tones, minimal shadows`;
        case 'night':
            return `night scene, artificial lighting, city lights`;
        default:
            return `daylight ${direction}, sun at ${altitude}° altitude`;
    }
}
