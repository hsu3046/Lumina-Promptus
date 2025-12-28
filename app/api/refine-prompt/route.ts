import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `**Role:**
You are "Lumina Obscura" — a Senior Technical Photographer & Prompt Engineer. Transform structured camera data into a logically consistent, high-fidelity prompt for AI image generators.

**Core Directives:**

1. **Hardware Integrity (Non-Negotiable):**
   - Preserve all hardware identifiers exactly as provided (e.g., NEF_NIKON_D850, Nikon AF-S 85mm f/1.4G).
   - Place hardware identifiers at the beginning of the output.

2. **Optical Logic Reconciliation:**
   - **Wide Aperture (f/1.2–f/2.8):** Emphasize "creamy bokeh," "shallow depth of field," "subject isolation."
   - **Narrow Aperture (f/5.6–f/11):** Remove bokeh keywords. Emphasize "edge-to-edge sharpness," "deep depth of field."
   - Resolve contradictions: If input has "bokeh" but aperture is f/8, delete "bokeh."

3. **ISO & Grain Consistency:**
   - **High ISO (800+):** Include "visible film grain," "textured look."
   - **Low ISO (≤400):** Include "clean image," "smooth tonal transitions."

4. **Lighting-Material Connection:**
   - **Softbox:** "smooth skin transitions," "diffused highlights."
   - **Beauty Dish:** "micro-contrast," "defined contours," "specular highlights."
   - Match catchlight shape to light source.

5. **Semantic Polish:**
   - Eliminate redundancies (mention each term once).
   - Use professional terminology.
   - Structure: [Hardware] → [Technical Settings] → [Subject] → [Lighting] → [Quality]

6. **Strict Constraints:**
   - Do NOT add elements not in the input.
   - Do NOT invent specifications.
   - Target 80-120 words. Always complete sentences.
   - Output ONLY the final prompt string, no explanations.`;

export async function POST(request: NextRequest) {
    try {
        const { draftPrompt } = await request.json();

        if (!draftPrompt) {
            return NextResponse.json(
                { error: 'Draft prompt is required' },
                { status: 400 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn('GEMINI_API_KEY not found, returning draft prompt as-is');
            return NextResponse.json({ refinedPrompt: draftPrompt });
        }

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
                systemInstruction: SYSTEM_PROMPT,
                maxOutputTokens: 3000,
                temperature: 0.3,
            },
        });

        // 응답 디버깅 - finishReason 확인
        const finishReason = response.candidates?.[0]?.finishReason;
        console.log('Gemini finishReason:', finishReason);
        console.log('Gemini text length:', response.text?.length);

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
        const endsWithPunctuation = /[.!?]$/.test(refinedPrompt);
        if (refinedPrompt.length < 100 || !endsWithPunctuation) {
            console.warn('Response incomplete or too short, using draft');
            console.log('Refined was:', refinedPrompt);
            refinedPrompt = draftPrompt;
        }

        return NextResponse.json({ refinedPrompt });
    } catch (error) {
        console.error('Prompt refinement failed:', error);
        return NextResponse.json(
            { error: 'Refinement failed' },
            { status: 500 }
        );
    }
}
