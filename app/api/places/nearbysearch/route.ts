// app/api/places/nearbysearch/route.ts
// Google Places Nearby Search API (New) - 주변 랜드마크 검색 (스마트 필터링)

import { NextRequest, NextResponse } from 'next/server';

// ===== 레이어별 허용 타입 =====

// 근경 (0~50m): 디테일한 질감, 프레임 역할
const FOREGROUND_TYPES = new Set([
    'fountain', 'garden', 'botanical_garden', 'aquarium',
    'sculpture', 'monument', 'memorial',
    'visitor_center', 'kiosk', 'gate',
    'plaza', 'courtyard', 'pedestrian_area',
    'park', 'tourist_attraction', 'natural_feature',
]);

// 중경 (50~500m): 지역 정체성, 시대적 배경
const MIDGROUND_TYPES = new Set([
    // 종교/역사
    'church', 'cathedral', 'mosque', 'hindu_temple', 'synagogue', 'shrine',
    'historical_landmark', 'cultural_landmark', 'historical_place',
    // 문화/공공
    'museum', 'art_gallery', 'performing_arts_center', 'library',
    'city_hall', 'embassy', 'university',
    // 대형 구조물
    'bridge', 'stadium', 'convention_center', 'event_venue', 'lighthouse',
    // 관광
    'tourist_attraction', 'amusement_park', 'observation_deck',
    'monument', 'memorial', 'park',
]);

// 원경 (500m+): 스케일감, 수평선 분위기 (자연 중심!)
const BACKGROUND_TYPES = new Set([
    // 수계
    'river', 'canal', 'lake', 'sea', 'waterfall', 'bay', 'beach',
    // 지형
    'mountain', 'volcano', 'island', 'cliff', 'valley', 'glacier',
    // 대규모 녹지
    'national_park', 'forest', 'nature_reserve', 'natural_feature', 'park',
    // 대형 랜드마크 (원경에서도 보이는)
    'tourist_attraction', 'observation_deck', 'stadium',
]);

// ===== 노이즈 타입 (항상 제외) =====
const NOISE_TYPES = new Set([
    // 금융/사무
    'finance', 'bank', 'atm', 'lawyer', 'accounting', 'insurance_agency',
    // 의료
    'hospital', 'dentist', 'pharmacy', 'doctor', 'veterinary_care',
    // 행정
    'police', 'fire_station', 'post_office', 'local_government_office',
    // 교육 (일반)
    'school', 'preschool', 'primary_school', 'secondary_school',
    // 기타 비visual
    'parking', 'gas_station', 'car_wash', 'car_repair', 'car_dealer',
    'real_estate_agency', 'moving_company', 'storage',
    // 지역명 (시각화 어려움)
    'locality', 'sublocality', 'administrative_area_level_1',
    'administrative_area_level_2', 'political', 'neighborhood',
]);

// ===== 우선순위 타입 (상단 배치) =====
const PRIORITY_TYPES = new Set([
    'tourist_attraction', 'historical_place', 'historical_landmark',
    'natural_feature', 'national_park', 'museum', 'monument',
]);

// 두 좌표 사이 거리 계산 (Haversine 공식, 미터 단위)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// 두 좌표 사이 방위각 계산 (0-360도)
function calculateBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;

    const x = Math.sin(dLng) * Math.cos(lat2Rad);
    const y = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
        Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);

    let bearing = Math.atan2(x, y) * 180 / Math.PI;
    return (bearing + 360) % 360;
}

// 타입이 노이즈인지 확인
function isNoiseType(types: string[]): boolean {
    return types.some(t => NOISE_TYPES.has(t));
}

// 레이어에 맞는 타입인지 확인
function isValidForLayer(types: string[], layer: 'foreground' | 'middleground' | 'background'): boolean {
    const layerTypes = layer === 'foreground' ? FOREGROUND_TYPES :
        layer === 'middleground' ? MIDGROUND_TYPES :
            BACKGROUND_TYPES;
    return types.some(t => layerTypes.has(t));
}

// 우선순위 점수 계산 (높을수록 상단)
function getPriorityScore(types: string[]): number {
    return types.filter(t => PRIORITY_TYPES.has(t)).length;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { lat, lng, radius = 5000 } = body;

        if (!lat || !lng) {
            return NextResponse.json({ error: 'lat and lng are required' }, { status: 400 });
        }

        const apiKey = process.env.GOOGLE_PLACES_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
        }

        const url = 'https://places.googleapis.com/v1/places:searchNearby';

        const requestBody = {
            maxResultCount: 20,
            rankPreference: 'POPULARITY',
            languageCode: 'en',  // 영어로 직접 받아서 Details API 호출 절약
            locationRestriction: {
                circle: {
                    center: { latitude: lat, longitude: lng },
                    radius: radius,
                },
            },
        };


        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': 'places.id,places.displayName,places.location,places.types,places.formattedAddress',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[API] Nearby Search error:', errorText);
            return NextResponse.json({ error: 'API request failed', details: errorText }, { status: response.status });
        }

        const data = await response.json();

        // 거리 및 방위각 계산 후 분류
        const places = (data.places || []).map((place: {
            id: string;
            displayName?: { text: string };
            location?: { latitude: number; longitude: number };
            types?: string[];
            formattedAddress?: string;
        }) => {
            const placeLat = place.location?.latitude ?? 0;
            const placeLng = place.location?.longitude ?? 0;
            const distance = calculateDistance(lat, lng, placeLat, placeLng);
            const bearing = calculateBearing(lat, lng, placeLat, placeLng);
            const types = place.types || [];

            // 거리 기준 레이어 분류
            let layer: 'foreground' | 'middleground' | 'background';
            if (distance <= 50) {
                layer = 'foreground';
            } else if (distance <= 500) {
                layer = 'middleground';
            } else {
                layer = 'background';
            }

            return {
                placeId: place.id,
                name: place.displayName?.text || '',
                lat: placeLat,
                lng: placeLng,
                distance: Math.round(distance),
                bearing: Math.round(bearing),
                types,
                address: place.formattedAddress || null,
                layer,
                priority: getPriorityScore(types),
            };
        });

        // 스마트 필터링
        const filteredPlaces = places.filter((p: { types: string[]; layer: 'foreground' | 'middleground' | 'background' }) => {
            // 1. 노이즈 타입 제외
            if (isNoiseType(p.types)) return false;
            // 2. 레이어에 맞는 타입만 허용
            if (!isValidForLayer(p.types, p.layer)) return false;
            return true;
        });

        // 우선순위 + 거리 정렬
        filteredPlaces.sort((a: { priority: number; distance: number }, b: { priority: number; distance: number }) => {
            if (b.priority !== a.priority) return b.priority - a.priority;
            return a.distance - b.distance;
        });


        return NextResponse.json({ places: filteredPlaces });
    } catch (error) {
        console.error('[API] Nearby Search exception:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
