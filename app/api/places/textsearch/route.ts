// app/api/places/textsearch/route.ts
// Google Places Text Search API - 장소 검색
// Basic 가격: displayName, location, types, formattedAddress만 요청

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { query, rankPreference = 'RELEVANCE' } = body;

        if (!query || query.length < 2) {
            return NextResponse.json({ places: [] });
        }

        const apiKey = process.env.GOOGLE_PLACES_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
        }

        // Text Search API (New) 호출
        const url = 'https://places.googleapis.com/v1/places:searchText';

        // Text Search API (New)는 RELEVANCE만 지원 (POPULARITY는 Nearby Search 전용)
        // 정렬 기준 적용 - Text Search는 항상 RELEVANCE 사용
        const requestBody = {
            textQuery: query,
            languageCode: 'ko',
            maxResultCount: 10,
            // rankPreference: 'RELEVANCE', // Text Search는 RELEVANCE만 지원
        };


        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                // Basic 가격: editorialSummary 제거하여 비용 절감
                'X-Goog-FieldMask': 'places.id,places.displayName,places.location,places.types,places.formattedAddress',
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('[API] Text Search error:', data);
            return NextResponse.json({ error: data.error?.message || 'Search failed' }, { status: response.status });
        }


        // 선택된 장소에 대해 영어 이름 가져오기 (별도 요청에서 처리)
        const places = (data.places || []).map((place: {
            id: string;
            displayName?: { text: string; languageCode?: string };
            location?: { latitude: number; longitude: number };
            types?: string[];
            formattedAddress?: string;
        }) => ({
            placeId: place.id,
            name: place.displayName?.text || '',
            lat: place.location?.latitude ?? 0,
            lng: place.location?.longitude ?? 0,
            types: place.types || [],
            address: place.formattedAddress || null,
        }));

        return NextResponse.json({ places, status: 'OK' });
    } catch (error) {
        console.error('[API] Text Search error:', error);
        return NextResponse.json({ error: 'Failed to search' }, { status: 500 });
    }
}
