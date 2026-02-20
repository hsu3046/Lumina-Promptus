// lib/image-gen/providers/gemini.ts
// Google Gemini 3 Pro Image API

import type { ImageGenOptions } from '../client';

export interface GeminiImageRequest {
    prompt: string;
    apiKey: string;
    options?: ImageGenOptions;
}

export interface GeminiImageResponse {
    imageBase64: string;
    mimeType: string;
}

/**
 * Gemini 3 Pro Image를 통한 이미지 생성
 * Next.js 프록시 경유: /api/image-proxy
 */
export async function generateWithGemini(
    prompt: string,
    apiKey: string,
    options?: ImageGenOptions
): Promise<string> {
    const response = await fetch('/api/image-proxy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
        },
        body: JSON.stringify({
            provider: 'gemini',
            prompt,
            aspectRatio: options?.aspectRatio,
        }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `Gemini API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.imageUrl; // base64 data URL
}
