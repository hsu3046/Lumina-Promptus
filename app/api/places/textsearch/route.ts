// app/api/places/textsearch/route.ts
// Google Places Text Search API - 장소 검색
// Pro 가격: types, editorialSummary 포함

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

        // 정렬 기준 적용
        const requestBody = {
            textQuery: query,
            languageCode: 'ko',
            maxResultCount: 10,
            rankPreference: rankPreference, // RELEVANCE 또는 POPULARITY
        };

        console.log('[API] Text Search request:', { query });

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                // Pro 가격: types, editorialSummary, formattedAddress 포함
                'X-Goog-FieldMask': 'places.id,places.displayName,places.location,places.types,places.editorialSummary,places.formattedAddress',
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('[API] Text Search error:', data);
            return NextResponse.json({ error: data.error?.message || 'Search failed' }, { status: response.status });
        }

        console.log('[API] Text Search response:', response.status, 'places:', data.places?.length || 0);

        // 응답 변환 (types, editorialSummary, address 포함)
        const places = (data.places || []).map((place: {
            id: string;
            displayName?: { text: string; languageCode?: string };
            location?: { latitude: number; longitude: number };
            types?: string[];
            editorialSummary?: { text: string; languageCode?: string };
            formattedAddress?: string;
        }) => ({
            placeId: place.id,
            name: place.displayName?.text || '',
            lat: place.location?.latitude ?? 0,
            lng: place.location?.longitude ?? 0,
            types: place.types || [],
            summary: place.editorialSummary?.text || null,
            address: place.formattedAddress || null,
        }));

        return NextResponse.json({ places, status: 'OK' });
    } catch (error) {
        console.error('[API] Text Search error:', error);
        return NextResponse.json({ error: 'Failed to search' }, { status: 500 });
    }
}
