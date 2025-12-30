// app/api/weather/route.ts
// Open-Meteo API - 무료 날씨 정보

import { NextRequest, NextResponse } from 'next/server';

// WMO 날씨 코드 → 한국어 매핑
const WEATHER_MAP: Record<number, { label: string; icon: string }> = {
    0: { label: '맑음', icon: '☀️' },
    1: { label: '대체로 맑음', icon: '🌤️' },
    2: { label: '약간 흐림', icon: '⛅' },
    3: { label: '흐림', icon: '☁️' },
    45: { label: '안개', icon: '🌫️' },
    48: { label: '안개', icon: '🌫️' },
    51: { label: '이슬비', icon: '🌧️' },
    53: { label: '이슬비', icon: '🌧️' },
    55: { label: '이슬비', icon: '🌧️' },
    61: { label: '비', icon: '🌧️' },
    63: { label: '비', icon: '🌧️' },
    65: { label: '폭우', icon: '⛈️' },
    66: { label: '진눈깨비', icon: '🌨️' },
    67: { label: '진눈깨비', icon: '🌨️' },
    71: { label: '눈', icon: '❄️' },
    73: { label: '눈', icon: '❄️' },
    75: { label: '폭설', icon: '❄️' },
    77: { label: '싸락눈', icon: '🌨️' },
    80: { label: '소나기', icon: '🌦️' },
    81: { label: '소나기', icon: '🌦️' },
    82: { label: '폭우', icon: '⛈️' },
    85: { label: '눈', icon: '🌨️' },
    86: { label: '폭설', icon: '🌨️' },
    95: { label: '뇌우', icon: '⛈️' },
    96: { label: '우박', icon: '⛈️' },
    99: { label: '우박', icon: '⛈️' },
};

// 위도 기반 계절 계산
function getSeason(lat: number, month: number): { label: string; icon: string } {
    const isNorthern = lat >= 0;
    const absLat = Math.abs(lat);

    // 열대 (적도 ±23.5°)
    if (absLat < 23.5) {
        return { label: '열대', icon: '🌴' };
    }

    // 극지 (66.5° 이상)
    if (absLat > 66.5) {
        // 6-8월: 북반구 백야, 남반구 극야
        const isSummer = month >= 6 && month <= 8;
        if (isNorthern) {
            return isSummer
                ? { label: '백야', icon: '🌅' }
                : { label: '극야', icon: '🌑' };
        } else {
            return isSummer
                ? { label: '극야', icon: '🌑' }
                : { label: '백야', icon: '🌅' };
        }
    }

    // 온대 사계절
    const seasons = isNorthern
        ? [
            { label: '겨울', icon: '❄️' },
            { label: '봄', icon: '🌸' },
            { label: '여름', icon: '☀️' },
            { label: '가을', icon: '🍂' },
        ]
        : [
            { label: '여름', icon: '☀️' },
            { label: '가을', icon: '🍂' },
            { label: '겨울', icon: '❄️' },
            { label: '봄', icon: '🌸' },
        ];

    // 3,4,5=봄(1), 6,7,8=여름(2), 9,10,11=가을(3), 12,1,2=겨울(0)
    const seasonIndex = Math.floor(((month + 9) % 12) / 3);
    return seasons[seasonIndex];
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const lat = parseFloat(searchParams.get('lat') || '0');
        const lng = parseFloat(searchParams.get('lng') || '0');

        if (lat === 0 && lng === 0) {
            return NextResponse.json({ error: 'lat and lng are required' }, { status: 400 });
        }

        // Open-Meteo API 호출 (무료, API 키 불필요)
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=weather_code,temperature_2m`;

        const response = await fetch(url);
        const data = await response.json();

        const weatherCode = data.current?.weather_code ?? 0;
        const temperature = data.current?.temperature_2m;
        const weather = WEATHER_MAP[weatherCode] || { label: '알 수 없음', icon: '❓' };

        // 현재 월로 계절 계산
        const currentMonth = new Date().getMonth() + 1;
        const season = getSeason(lat, currentMonth);

        return NextResponse.json({
            weather: {
                code: weatherCode,
                label: weather.label,
                icon: weather.icon,
                temperature: temperature ? Math.round(temperature) : null,
            },
            season: {
                label: season.label,
                icon: season.icon,
            },
        });
    } catch (error) {
        console.error('[API] Weather error:', error);
        return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 500 });
    }
}
