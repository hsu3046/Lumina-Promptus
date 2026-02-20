// lib/image-gen/providers/seedream.ts
// ByteDance SeedDream 4.5 API (via fal.ai)

/**
 * SeedDream 4.5를 통한 이미지 생성
 * Next.js 프록시 경유: /api/image-proxy
 */
export async function generateWithSeedream(
    prompt: string,
    apiKey: string
): Promise<string> {
    const response = await fetch('/api/image-proxy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
        },
        body: JSON.stringify({
            provider: 'seedream',
            prompt,
        }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `SeedDream API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.imageUrl; // URL
}
