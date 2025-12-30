'use client';

import { useEffect, useState, useRef } from 'react';
import { Camera, Info, Tag } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { getSolarTimes, type SolarInfo } from '@/lib/landscape/solar-calculator';
import type { LandscapeWeather, LandscapeSeason, LandscapeTimeOfDay } from '@/types/landscape.types';

// Google Places API 타입 → 한국어 변환
const TYPE_TRANSLATIONS: Record<string, string> = {
    'park': '공원',
    'national_park': '국립공원',
    'state_park': '주립공원',
    'garden': '정원',
    'botanical_garden': '식물원',
    'hiking_area': '등산로',
    'wildlife_park': '야생동물원',
    'wildlife_refuge': '야생보호구역',
    'beach': '해변',
    'campground': '캠핑장',
    'natural_feature': '자연경관',
    'museum': '박물관',
    'art_gallery': '미술관',
    'art_studio': '아트 스튜디오',
    'monument': '기념비',
    'landmark': '랜드마크',
    'cultural_landmark': '문화랜드마크',
    'historical_landmark': '역사적 명소',
    'historical_place': '역사유적',
    'sculpture': '조각상',
    'tourist_attraction': '관광명소',
    'amusement_park': '놀이공원',
    'aquarium': '수족관',
    'zoo': '동물원',
    'observation_deck': '전망대',
    'church': '교회',
    'mosque': '모스크',
    'hindu_temple': '힌두사원',
    'synagogue': '유대교회당',
    'place_of_worship': '예배장소',
    'shopping_mall': '쇼핑몰',
    'stadium': '경기장',
    'auditorium': '공연장',
    'establishment': '시설',
    'point_of_interest': '명소',
};

const getTypeLabel = (type: string): string => {
    return TYPE_TRANSLATIONS[type] || type.replace(/_/g, ' ');
};

// API 날씨 라벨 → store 타입 매핑
const WEATHER_LABEL_TO_TYPE: Record<string, LandscapeWeather> = {
    '맑음': 'clear',
    '대체로 맑음': 'clear',
    '약간 흐림': 'partly-cloudy',
    '흐림': 'overcast',
    '안개': 'overcast',
    '이슬비': 'light-rain',
    '비': 'light-rain',
    '폭우': 'light-rain',
    '진눈깨비': 'light-rain',
    '눈': 'clear', // 눈은 별도 타입이 없어서 clear로
    '폭설': 'clear',
    '싸락눈': 'clear',
    '소나기': 'light-rain',
    '뇌우': 'light-rain',
    '우박': 'light-rain',
};

const SEASON_LABEL_TO_TYPE: Record<string, LandscapeSeason> = {
    '봄': 'spring',
    '여름': 'summer',
    '가을': 'autumn',
    '겨울': 'winter',
    '열대': 'summer',
    '백야': 'summer',
    '극야': 'winter',
};

const PHASE_TO_TIME: Record<string, LandscapeTimeOfDay> = {
    'golden-hour': 'golden-hour',
    'blue-hour': 'blue-hour',
    'night': 'night',
    'day': 'midday',
};

// 날씨/계절 라벨 (표시용)
const WEATHER_LABELS: Record<LandscapeWeather, { label: string; icon: string }> = {
    'clear': { label: '맑음', icon: '☀️' },
    'partly-cloudy': { label: '약간 흐림', icon: '⛅' },
    'overcast': { label: '흐림', icon: '☁️' },
    'light-rain': { label: '비', icon: '🌧️' },
};

const SEASON_LABELS: Record<LandscapeSeason, { label: string; icon: string }> = {
    'spring': { label: '봄', icon: '🌸' },
    'summer': { label: '여름', icon: '☀️' },
    'autumn': { label: '가을', icon: '🍂' },
    'winter': { label: '겨울', icon: '❄️' },
};

const TIME_LABELS: Record<LandscapeTimeOfDay, { label: string; icon: string }> = {
    'sunrise': { label: '일출', icon: '🌅' },
    'golden-hour': { label: '골든아워', icon: '🌅' },
    'midday': { label: '주간', icon: '☀️' },
    'blue-hour': { label: '블루아워', icon: '🌆' },
    'night': { label: '야간', icon: '🌙' },
};

/**
 * 장소 상세 정보 표시 컴포넌트 (날씨/계절 Store에 저장)
 */
export function PlaceDetails() {
    const { settings, updateLandscape } = useSettingsStore();
    const { location, environment } = settings.landscape;
    const [solarInfo, setSolarInfo] = useState<SolarInfo | null>(null);
    const fetchedLocationRef = useRef<string | null>(null); // 캐시용

    // 좌표 변경 시 태양 정보 계산
    useEffect(() => {
        if (location?.coordinates?.lat && location?.coordinates?.lng) {
            const info = getSolarTimes(
                location.coordinates.lat,
                location.coordinates.lng,
                new Date()
            );
            setSolarInfo(info);

            // 태양 phase를 environment.time에 반영 (최초 또는 장소 변경 시)
            const timeOfDay = PHASE_TO_TIME[info.currentPhase] || 'midday';
            if (environment.time !== timeOfDay && fetchedLocationRef.current !== location.name) {
                updateLandscape({
                    environment: { ...environment, time: timeOfDay }
                });
            }
        }
    }, [location?.coordinates?.lat, location?.coordinates?.lng, location?.name, environment, updateLandscape]);

    // 날씨 정보 가져오기 (장소 변경 시에만)
    useEffect(() => {
        if (!location?.coordinates?.lat || !location?.coordinates?.lng) return;
        if (!location.name) return;

        // 이미 이 장소를 조회했으면 스킵
        if (fetchedLocationRef.current === location.name) return;

        fetch(`/api/weather?lat=${location.coordinates.lat}&lng=${location.coordinates.lng}`)
            .then(res => res.json())
            .then(data => {
                if (data.weather && data.season) {
                    // Store에 저장
                    const weatherType = WEATHER_LABEL_TO_TYPE[data.weather.label] || 'clear';
                    const seasonType = SEASON_LABEL_TO_TYPE[data.season.label] || 'autumn';

                    updateLandscape({
                        environment: {
                            ...environment,
                            weather: weatherType,
                            season: seasonType,
                        }
                    });

                    fetchedLocationRef.current = location.name;
                }
            })
            .catch(console.error);
    }, [location?.coordinates?.lat, location?.coordinates?.lng, location?.name, environment, updateLandscape]);

    if (!location?.name) {
        return null;
    }

    const types = location.types || [];

    // Store에서 환경 정보 읽기
    const weatherInfo = WEATHER_LABELS[environment.weather];
    const seasonInfo = SEASON_LABELS[environment.season];
    const timeInfo = TIME_LABELS[environment.time];

    return (
        <div className="space-y-3">
            {/* 장소명 + 주소 */}
            <div className="flex items-start gap-3">
                <Camera className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-white truncate">{location.name}</h3>
                    <p className="text-xs text-zinc-500 truncate">
                        {location.address || '주소 정보 없음'}
                    </p>
                </div>
            </div>

            {/* 장소 유형 태그 */}
            {types.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                    <Tag className="w-3 h-3 text-zinc-500 shrink-0" />
                    {types.slice(0, 5).map((type) => (
                        <span
                            key={type}
                            className="px-2 py-0.5 text-[10px] bg-zinc-700/50 text-zinc-300 rounded-full"
                        >
                            {getTypeLabel(type)}
                        </span>
                    ))}
                </div>
            )}

            {/* 설명 */}
            {location.summary && (
                <div className="flex items-start gap-2 text-xs text-zinc-400">
                    <Info className="w-3 h-3 shrink-0 mt-0.5" />
                    <p className="line-clamp-2">{location.summary}</p>
                </div>
            )}

            {/* 환경 정보 (2열: 왼쪽=날씨정보, 오른쪽=태양정보) */}
            <>
                <hr className="border-zinc-700/50" />
                <div className="flex justify-between items-start text-[10px]">
                    {/* 왼쪽: 날씨 / 계절 / 기온 / 현재시간대 */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span>{weatherInfo.icon} {weatherInfo.label}</span>
                        <span className="text-zinc-600">·</span>
                        <span>{seasonInfo.icon} {seasonInfo.label}</span>
                        <span className="text-zinc-600">·</span>
                        <span>{timeInfo.icon} {timeInfo.label}</span>
                    </div>
                    {/* 오른쪽: 일출/일몰 + 태양 각도 */}
                    {solarInfo && (
                        <div className="text-right text-zinc-400 shrink-0 ml-4">
                            🌅 {solarInfo.sunrise.getHours().toString().padStart(2, '0')}:{solarInfo.sunrise.getMinutes().toString().padStart(2, '0')}
                            {' · '}
                            🌆 {solarInfo.sunset.getHours().toString().padStart(2, '0')}:{solarInfo.sunset.getMinutes().toString().padStart(2, '0')}
                            {' · '}
                            <span className="text-zinc-500">
                                ☀️ {solarInfo.position.altitude.toFixed(0)}°/{solarInfo.position.azimuth.toFixed(0)}°
                            </span>
                        </div>
                    )}
                </div>
            </>
        </div>
    );
}
