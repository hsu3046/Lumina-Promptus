// lib/image-gen/providers/openai.ts
// OpenAI GPT Image 1 API

import type { ImageGenOptions } from '../client';

/**
 * GPT Image 1을 통한 이미지 생성
 * Next.js 프록시 경유: /api/image-proxy
 */
export async function generateWithOpenAI(
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
            provider: 'openai',
            prompt,
            aspectRatio: options?.aspectRatio,
        }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `OpenAI API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.imageUrl; // base64 data URL or URL
}
