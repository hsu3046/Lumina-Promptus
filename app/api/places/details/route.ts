// app/api/places/details/route.ts
// Google Places API (New) - Place Details 프록시
// 비용 최적화: Session Token + Field Mask (최소 필드만 요청)

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const placeId = searchParams.get('placeId') || searchParams.get('place_id');
    const sessionToken = searchParams.get('sessionToken');

    if (!placeId) {
        return NextResponse.json({ error: 'placeId required' }, { status: 400 });
    }

    // 서버용 API 키 사용 (HTTP Referrer 제한 없음)
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey || apiKey === 'YOUR_BACKEND_PLACES_API_KEY_HERE') {
        return NextResponse.json({ error: 'Server API key not configured' }, { status: 500 });
    }

    try {
        // Places API (New) endpoint
        // Session Token을 쿼리 파라미터로 전달하면 Autocomplete 세션과 묶임
        let url = `https://places.googleapis.com/v1/places/${placeId}`;

        // Session Token이 있으면 URL에 추가 (Autocomplete 세션과 묶어서 비용 절감)
        if (sessionToken) {
            url += `?sessionToken=${encodeURIComponent(sessionToken)}`;
        }

        console.log('[API] Place Details request:', {
            placeId,
            hasSessionToken: !!sessionToken,
            sessionTokenPreview: sessionToken?.substring(0, 8) + '...'
        });

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                // 필드 마스킹: 필요한 필드만 요청 (비용 최적화 핵심!)
                // location + formattedAddress만 요청 = 최소 비용
                'X-Goog-FieldMask': 'location,displayName,formattedAddress',
            },
        });

        const data = await response.json();
        console.log('[API] Place Details response:', response.status, {
            hasLocation: !!data.location,
            hasAddress: !!data.formattedAddress,
        });

        // 에러 상세 로깅
        if (!response.ok || data.error) {
            console.log('[API] Place Details error:', JSON.stringify(data, null, 2));
            return NextResponse.json({ error: data.error?.message || 'Place not found' }, { status: response.status });
        }

        if (data.location) {
            return NextResponse.json({
                name: data.displayName?.text || 'Unknown',
                location: {
                    lat: data.location.latitude,
                    lng: data.location.longitude,
                },
                formattedAddress: data.formattedAddress || null,
            });
        }

        return NextResponse.json({ error: 'Place not found' }, { status: 404 });
    } catch (error) {
        console.error('Place Details error:', error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}
