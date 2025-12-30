// lib/landscape/environment-validator.ts
// 환경 설정 충돌 검사기

import type { LandscapeWeather, LandscapeSeason } from '@/types/landscape.types';

export interface EnvironmentConflict {
    type: 'warning' | 'error';
    message: string;
    fields: string[];
}

// 계절-날씨 충돌 규칙
const SEASON_WEATHER_CONFLICTS: {
    season: LandscapeSeason;
    weather: LandscapeWeather[];
    message: string;
}[] = [
        {
            season: 'summer',
            weather: ['snow', 'heavy-snow'],
            message: '여름에 눈이 내리는 것은 일반적이지 않습니다',
        },
        {
            season: 'spring',
            weather: ['snow', 'heavy-snow'],
            message: '봄에 폭설은 드문 현상입니다',
        },
        {
            season: 'autumn',
            weather: ['heavy-snow'],
            message: '가을에 폭설은 드문 현상입니다',
        },
    ];

// 계절-날씨 권장 조합
const SEASON_WEATHER_RECOMMENDATIONS: {
    season: LandscapeSeason;
    weather: LandscapeWeather[];
    message: string;
}[] = [
        {
            season: 'winter',
            weather: ['snow', 'heavy-snow'],
            message: '겨울에 눈 날씨가 잘 어울립니다',
        },
    ];

/**
 * 환경 설정 충돌 검사
 */
export function validateEnvironment(
    season: LandscapeSeason,
    weather: LandscapeWeather
): EnvironmentConflict[] {
    const conflicts: EnvironmentConflict[] = [];

    // 계절-날씨 충돌 검사
    for (const rule of SEASON_WEATHER_CONFLICTS) {
        if (rule.season === season && rule.weather.includes(weather)) {
            conflicts.push({
                type: 'warning',
                message: rule.message,
                fields: ['season', 'weather'],
            });
        }
    }

    return conflicts;
}

/**
 * 환경 설정이 조화로운지 확인
 */
export function isHarmoniousEnvironment(
    season: LandscapeSeason,
    weather: LandscapeWeather
): boolean {
    const conflicts = validateEnvironment(season, weather);
    return conflicts.length === 0;
}
