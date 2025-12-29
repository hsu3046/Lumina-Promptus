// app/api/places/autocomplete/route.ts
// Google Places API (New) Autocomplete 프록시
// 비용 최적화: Session Token + 최소 필드만 요청

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    const sessionToken = searchParams.get('sessionToken');

    if (!query) {
        return NextResponse.json({ predictions: [] });
    }

    // 서버용 API 키 사용 (HTTP Referrer 제한 없음)
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey || apiKey === 'YOUR_BACKEND_PLACES_API_KEY_HERE') {
        return NextResponse.json({ error: 'Server API key not configured' }, { status: 500 });
    }

    try {
        // Places API (New) - POST 요청 사용
        const url = 'https://places.googleapis.com/v1/places:autocomplete';

        // Session Token으로 여러 Autocomplete 요청을 하나의 세션으로 묶음
        // → 최종 Place Details 호출 시 1건의 비용만 청구
        const requestBody: {
            input: string;
            languageCode: string;
            sessionToken?: string;
        } = {
            input: query,
            languageCode: 'ko',
        };

        // Session Token이 있으면 추가 (비용 최적화 핵심)
        if (sessionToken) {
            requestBody.sessionToken = sessionToken;
        }

        console.log('[API] Autocomplete request:', {
            query,
            hasSessionToken: !!sessionToken,
            sessionTokenPreview: sessionToken?.substring(0, 8) + '...'
        });

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        console.log('[API] Autocomplete response:', response.status, 'suggestions:', data.suggestions?.length || 0);

        // 에러 상세 로깅
        if (!response.ok || data.error) {
            console.log('[API] Autocomplete error:', JSON.stringify(data, null, 2));
        }

        // 응답 변환 (camelCase)
        const predictions = (data.suggestions || []).map((suggestion: {
            placePrediction?: {
                placeId: string;
                text: { text: string };
                structuredFormat?: {
                    mainText: { text: string };
                    secondaryText?: { text: string };
                };
            };
        }) => {
            const place = suggestion.placePrediction;
            if (!place) return null;

            return {
                placeId: place.placeId,
                mainText: place.structuredFormat?.mainText?.text || place.text?.text || '',
                secondaryText: place.structuredFormat?.secondaryText?.text || '',
            };
        }).filter(Boolean);

        return NextResponse.json({ predictions, status: 'OK' });
    } catch (error) {
        console.error('Places Autocomplete error:', error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}
