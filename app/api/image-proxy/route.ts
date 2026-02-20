// app/api/image-proxy/route.ts
// Next.js API Route — CORS 우회 프록시
// API Key는 요청 헤더에서 수신 → 외부 API 전달 → 즉시 폐기, 서버 저장 없음

import { NextRequest, NextResponse } from 'next/server';

type Provider = 'gemini' | 'openai' | 'seedream';

interface ProxyRequestBody {
    provider: Provider;
    prompt: string;
    aspectRatio?: string;
    referenceImage?: string; // base64 data URL (data:image/png;base64,...)
}

export async function POST(request: NextRequest) {
    try {
        const apiKey = request.headers.get('X-API-Key');
        if (!apiKey) {
            return NextResponse.json(
                { error: 'API Key가 제공되지 않았습니다.' },
                { status: 401 }
            );
        }

        const body: ProxyRequestBody = await request.json();
        const { provider, prompt, aspectRatio, referenceImage } = body;

        if (!prompt || prompt.trim() === '') {
            return NextResponse.json(
                { error: '프롬프트가 비어있습니다.' },
                { status: 400 }
            );
        }

        switch (provider) {
            case 'gemini':
                return await handleGemini(apiKey, prompt, aspectRatio, referenceImage);
            case 'openai':
                return await handleOpenAI(apiKey, prompt, aspectRatio, referenceImage);
            case 'seedream':
                return await handleSeedream(apiKey, prompt);
            default:
                return NextResponse.json(
                    { error: '지원하지 않는 provider입니다.' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('[image-proxy] Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// ===== Gemini 3 Pro Image =====
async function handleGemini(apiKey: string, prompt: string, aspectRatio?: string, referenceImage?: string) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${apiKey}`;

    // Gemini 이미지 설정
    const imageConfig: Record<string, string> = {};
    if (aspectRatio) {
        imageConfig.aspectRatio = aspectRatio;
    }

    // 콘텐츠 parts 구성: 텍스트 + (레퍼런스 이미지)
    const requestParts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];

    // 레퍼런스 이미지가 있으면 먼저 추가
    if (referenceImage) {
        const match = referenceImage.match(/^data:(image\/\w+);base64,(.+)$/);
        if (match) {
            requestParts.push({
                inlineData: {
                    mimeType: match[1],
                    data: match[2],
                },
            });
        }
    }

    // 프롬프트 추가 (레퍼런스 이미지가 있으면 지시사항 세분화)
    const promptText = referenceImage
        ? `Using the attached product image as reference, generate a professional product photograph with the following specifications:\n\n${prompt}`
        : prompt;
    requestParts.push({ text: promptText });

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [
                {
                    parts: requestParts,
                },
            ],
            generationConfig: {
                responseModalities: ['IMAGE'],
                ...(Object.keys(imageConfig).length > 0 && { imageConfig }),
            },
        }),
    });

    if (!response.ok) {
        const errBody = await response.text();
        console.error('[Gemini] API Error:', errBody);
        throw new Error(`Gemini API 오류 (${response.status}): ${errBody.slice(0, 200)}`);
    }

    const data = await response.json();

    // Gemini 응답에서 이미지 추출
    const candidates = data.candidates;
    if (!candidates || candidates.length === 0) {
        throw new Error('Gemini에서 이미지를 생성하지 못했습니다.');
    }

    const parts = candidates[0].content?.parts || [];
    const imagePart = parts.find(
        (p: { inlineData?: { mimeType: string; data: string } }) => p.inlineData
    );

    if (!imagePart?.inlineData) {
        throw new Error('Gemini 응답에 이미지가 포함되지 않았습니다.');
    }

    const { mimeType, data: base64Data } = imagePart.inlineData;
    const imageUrl = `data:${mimeType};base64,${base64Data}`;

    return NextResponse.json({ imageUrl });
}

// ===== OpenAI GPT Image 1.5 =====
// aspectRatio → OpenAI size 매핑
function mapAspectRatioToOpenAISize(aspectRatio?: string): string {
    if (!aspectRatio) return '1024x1024';
    const [w, h] = aspectRatio.split(':').map(Number);
    if (!w || !h) return '1024x1024';
    const ratio = w / h;
    if (ratio > 1) return '1536x1024'; // 가로 (landscape)
    if (ratio < 1) return '1024x1536'; // 세로 (portrait)
    return '1024x1024'; // 정사각
}

async function handleOpenAI(apiKey: string, prompt: string, aspectRatio?: string, referenceImage?: string) {
    const size = mapAspectRatioToOpenAISize(aspectRatio);

    // OpenAI 요청 바디 구성
    const requestBody: Record<string, unknown> = {
        model: 'gpt-image-1',
        prompt: referenceImage
            ? `Using the attached product image as reference, generate a professional product photograph with the following specifications:\n\n${prompt}`
            : prompt,
        n: 1,
        size,
        quality: 'medium',
        moderation: 'low',
    };

    // 레퍼런스 이미지가 있으면 image 파라미터 추가
    if (referenceImage) {
        const match = referenceImage.match(/^data:(image\/\w+);base64,(.+)$/);
        if (match) {
            requestBody.image = [{
                type: 'base64',
                media_type: match[1],
                data: match[2],
            }];
        }
    }

    const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const errBody = await response.text();
        console.error('[OpenAI] API Error:', errBody);
        throw new Error(`OpenAI API 오류 (${response.status}): ${errBody.slice(0, 200)}`);
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
        throw new Error('OpenAI에서 이미지를 생성하지 못했습니다.');
    }

    const imageData = data.data[0];
    let imageUrl: string;

    if (imageData.b64_json) {
        imageUrl = `data:image/png;base64,${imageData.b64_json}`;
    } else if (imageData.url) {
        imageUrl = imageData.url;
    } else {
        throw new Error('OpenAI 응답에 이미지가 포함되지 않았습니다.');
    }

    return NextResponse.json({ imageUrl });
}

// ===== ByteDance SeedDream 4.5 (via BytePlus ModelArk) =====
async function handleSeedream(apiKey: string, prompt: string) {
    // BytePlus ModelArk — OpenAI 호환 이미지 생성 API
    const response = await fetch('https://ark.ap-southeast.bytepluses.com/api/v3/images/generations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: 'seedream-4-5-250422',
            prompt,
            size: '1024x1024',
            n: 1,
            response_format: 'url',
        }),
    });

    if (!response.ok) {
        const errBody = await response.text();
        console.error('[SeedDream] API Error:', errBody);
        throw new Error(`SeedDream API 오류 (${response.status}): ${errBody.slice(0, 200)}`);
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
        throw new Error('SeedDream에서 이미지를 생성하지 못했습니다.');
    }

    const imageData = data.data[0];
    let imageUrl: string;

    if (imageData.b64_json) {
        imageUrl = `data:image/png;base64,${imageData.b64_json}`;
    } else if (imageData.url) {
        imageUrl = imageData.url;
    } else {
        throw new Error('SeedDream 응답에 이미지가 포함되지 않았습니다.');
    }

    return NextResponse.json({ imageUrl });
}
