// app/api/image-proxy/download/route.ts
// 이미지 다운로드 프록시 — 브라우저 CORS 우회

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { url } = await request.json();

        if (!url || typeof url !== 'string') {
            return NextResponse.json({ error: 'URL이 필요합니다.' }, { status: 400 });
        }

        // 허용된 도메인만 프록시
        const allowedDomains = [
            'oaidalleapiprodscus.blob.core.windows.net', // OpenAI
            'fal.media', // fal.ai
            'fal-cdn.batelu.com', // fal.ai CDN
            'ark-', // BytePlus ModelArk
            'storage.googleapis.com', // Google
        ];

        const urlObj = new URL(url);
        const isDomainAllowed = allowedDomains.some(
            (domain) => urlObj.hostname.includes(domain)
        );

        if (!isDomainAllowed) {
            return NextResponse.json({ error: '허용되지 않은 도메인입니다.' }, { status: 403 });
        }

        const response = await fetch(url);
        if (!response.ok) {
            return NextResponse.json({ error: '이미지를 가져올 수 없습니다.' }, { status: 502 });
        }

        const blob = await response.blob();
        return new NextResponse(blob, {
            headers: {
                'Content-Type': response.headers.get('Content-Type') || 'image/png',
                'Content-Disposition': 'attachment; filename="lumina_image.png"',
            },
        });
    } catch (error) {
        console.error('[download-proxy] Error:', error);
        return NextResponse.json({ error: '다운로드 실패' }, { status: 500 });
    }
}
