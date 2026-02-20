// lib/image-gen/client.ts
// Image generation client - provider abstraction

import type { ImageProvider } from '@/store/useApiKeyStore';
import { generateWithGemini } from './providers/gemini';
import { generateWithOpenAI } from './providers/openai';
import { generateWithSeedream } from './providers/seedream';

export interface GenerateImageResult {
    success: boolean;
    imageUrl?: string; // base64 data URL or remote URL
    error?: string;
    durationMs?: number;
}

export interface ImageGenOptions {
    aspectRatio?: string; // e.g. '2:3', '16:9'
    referenceImage?: string; // base64 data URL (data:image/png;base64,...)
}

/**
 * 이미지 생성 통합 클라이언트
 * provider에 따라 적절한 API 호출
 */
export async function generateImage(
    provider: ImageProvider,
    prompt: string,
    apiKey: string,
    options?: ImageGenOptions
): Promise<GenerateImageResult> {
    const startTime = Date.now();

    try {
        if (!prompt || prompt.trim() === '') {
            return { success: false, error: '프롬프트가 비어있습니다.' };
        }

        if (!apiKey || apiKey.trim() === '') {
            return { success: false, error: 'API Key가 설정되지 않았습니다. ⚙️ 버튼에서 설정해주세요.' };
        }

        let imageUrl: string;

        switch (provider) {
            case 'gemini':
                imageUrl = await generateWithGemini(prompt, apiKey, options);
                break;
            case 'openai':
                imageUrl = await generateWithOpenAI(prompt, apiKey, options);
                break;
            case 'seedream':
                imageUrl = await generateWithSeedream(prompt, apiKey);
                break;
            default:
                return { success: false, error: '지원하지 않는 이미지 생성 엔진입니다.' };
        }

        const durationMs = Date.now() - startTime;
        return { success: true, imageUrl, durationMs };
    } catch (error) {
        const durationMs = Date.now() - startTime;
        const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
        return { success: false, error: message, durationMs };
    }
}
