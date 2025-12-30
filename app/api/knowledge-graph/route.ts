// app/api/knowledge-graph/route.ts
// Google Knowledge Graph API - 인지도 점수 및 상세 정보 조회

import { NextRequest, NextResponse } from 'next/server';

export interface KnowledgeGraphResult {
    found: boolean;
    score: number;                    // resultScore (인지도)
    name?: string;                    // 정식 명칭
    description?: string;             // 짧은 설명
    detailedDescription?: string;     // Wikipedia 상세 설명
    wikipediaUrl?: string;            // Wikipedia 링크
    imageUrl?: string;                // 대표 이미지 URL
    types?: string[];                 // 엔티티 타입
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
        return NextResponse.json({ error: 'query is required' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_KNOWLEDGE_GRAPH_API_KEY || process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        console.warn('[Knowledge Graph] API key not found, returning default response');
        return NextResponse.json({
            found: false,
            score: 0,
        } as KnowledgeGraphResult);
    }

    try {
        const url = new URL('https://kgsearch.googleapis.com/v1/entities:search');
        url.searchParams.set('query', query);
        url.searchParams.set('key', apiKey);
        url.searchParams.set('limit', '1');
        url.searchParams.set('languages', 'en');


        const response = await fetch(url.toString());

        if (!response.ok) {
            console.error('[Knowledge Graph] API error:', response.status);
            return NextResponse.json({
                found: false,
                score: 0,
            } as KnowledgeGraphResult);
        }

        const data = await response.json();

        if (!data.itemListElement || data.itemListElement.length === 0) {
            return NextResponse.json({
                found: false,
                score: 0,
            } as KnowledgeGraphResult);
        }

        const item = data.itemListElement[0];
        const result = item.result;
        const score = item.resultScore || 0;


        const response_data: KnowledgeGraphResult = {
            found: true,
            score,
            name: result.name,
            description: result.description,
            detailedDescription: result.detailedDescription?.articleBody?.slice(0, 300),
            wikipediaUrl: result.detailedDescription?.url,
            imageUrl: result.image?.contentUrl,
            types: result['@type'] || [],
        };

        return NextResponse.json(response_data);

    } catch (error) {
        console.error('[Knowledge Graph] Error:', error);
        return NextResponse.json({
            found: false,
            score: 0,
        } as KnowledgeGraphResult);
    }
}
