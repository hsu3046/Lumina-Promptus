import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { MODEL_REFINE_RULES } from '@/config/prompts/model-refine-rules';
import type { TargetModel } from '@/store/usePromptStore';

export async function POST(request: NextRequest) {
    try {
        const { draftPrompt, targetModel = 'nanoBanana' } = await request.json();

        if (!draftPrompt) {
            return NextResponse.json(
                { error: 'Draft prompt is required' },
                { status: 400 }
            );
        }

        // 유효한 모델인지 체크
        const validModels: TargetModel[] = ['nanoBanana', 'chatgpt', 'midjourney'];
        const model: TargetModel = validModels.includes(targetModel) ? targetModel : 'nanoBanana';

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn('GEMINI_API_KEY not found, returning draft prompt as-is');
            return NextResponse.json({ refinedPrompt: draftPrompt, targetModel: model });
        }

        // 모델별 시스템 프롬프트 선택
        const systemPrompt = MODEL_REFINE_RULES[model];

        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [
                {
                    role: 'user',
                    parts: [{ text: `Refine this AI image generation prompt:\n\n${draftPrompt}` }],
                },
            ],
            config: {
                systemInstruction: systemPrompt,
                maxOutputTokens: 3000,
                temperature: 0.3,
            },
        });

        // 응답 디버깅 - finishReason 확인
        const finishReason = response.candidates?.[0]?.finishReason;
        console.log(`[${model}] Gemini finishReason:`, finishReason);
        console.log(`[${model}] Gemini text length:`, response.text?.length);

        // text 속성 또는 candidates에서 추출
        let refinedPrompt = '';
        if (response.text) {
            refinedPrompt = response.text.trim();
        } else if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
            refinedPrompt = response.candidates[0].content.parts[0].text.trim();
        } else {
            console.warn('Could not extract text from response, using draft');
            refinedPrompt = draftPrompt;
        }

        // 응답이 너무 짧거나 문장이 완료되지 않은 경우 Draft 사용
        // (Midjourney는 짧을 수 있으므로 모델별 분기)
        const minLength = model === 'midjourney' ? 30 : 100;
        const endsWithPunctuation = /[.!?]$/.test(refinedPrompt) || model === 'midjourney';

        if (refinedPrompt.length < minLength || !endsWithPunctuation) {
            console.warn(`[${model}] Response incomplete or too short, using draft`);
            console.log('Refined was:', refinedPrompt);
            refinedPrompt = draftPrompt;
        }

        return NextResponse.json({ refinedPrompt, targetModel: model });
    } catch (error) {
        console.error('Prompt refinement failed:', error);
        return NextResponse.json(
            { error: 'Refinement failed' },
            { status: 500 }
        );
    }
}

