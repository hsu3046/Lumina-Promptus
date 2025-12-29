// config/prompts/model-refine-rules.ts
// AI 이미지 생성 모델별 Refine 규칙
// 전략: 원본 유지 + 모순 제거 + 민감 표현 순화

import type { TargetModel } from '@/store/usePromptStore';

// 공통 검증 규칙 (모든 모델 공유)
const VALIDATION_RULES = `
**CRITICAL: VALIDATION-ONLY MODE**
Your job is NOT to rewrite or enhance. Your job is to VALIDATE and CLEAN.

**Rule 1: Preserve Original Text**
- Keep the original wording as much as possible
- Do NOT add new descriptive phrases
- Do NOT change the structure or order unless necessary

**Rule 2: Remove/Merge Contradictions**
Examples of contradictions to fix:
- "bright smile" + "serious expression" → keep one that fits context
- "eyes closed" + "direct eye contact" → remove one
- "shallow DOF" + "deep focus" → keep one
- "high key lighting" + "dramatic shadows" → merge or choose one

**Rule 3: Sanitize Sensitive Content**
Replace problematic terms with professional alternatives:
- Overly sexual terms → neutral/professional descriptions
- Discriminatory language → inclusive alternatives
- Age-inappropriate content → age-neutral descriptions
- Body-shaming terms → neutral body descriptions

**Rule 4: Minimal Changes**
- If no contradictions or sensitive content found, return the original prompt UNCHANGED
- Count of changes should be minimal (0-3 changes typical)
`;

// 모델별 시스템 프롬프트 (Refine 규칙)
export const MODEL_REFINE_RULES: Record<TargetModel, string> = {
   // ===== Nano Banana Pro =====
   nanoBanana: `${VALIDATION_RULES}

**Output Format:**
Return the validated prompt. If unchanged, return the exact original.
Keep all technical specifications (camera, lens, settings) intact.
Output ONLY the prompt, no explanations.`,

   // ===== ChatGPT (DALL-E 3) =====
   chatgpt: `${VALIDATION_RULES}

**Additional for ChatGPT/DALL-E:**
- Remove camera model names and technical specs (they don't help DALL-E)
- Keep visual descriptions intact
- Ensure natural language flow

**Output Format:**
Return the validated prompt without camera/lens specs.
Output ONLY the prompt, no explanations.`,

   // ===== Midjourney =====
   midjourney: `${VALIDATION_RULES}

**Additional for Midjourney:**
- Remove camera model names, lens specs, metaTokens
- Convert aspect ratio description to --ar parameter
- Add --stylize 250 at the end

**Aspect Ratio to Parameter:**
- "vertical portrait format" or "2:3" → --ar 2:3
- "classic 35mm" or "3:2" → --ar 3:2
- "square format" or "1:1" → --ar 1:1
- "widescreen" or "16:9" → --ar 16:9

**Output Format:**
[validated keywords] --ar X:X --stylize 250
Output ONLY the prompt with parameters.`,
};

// 모델별 레이블
export const MODEL_LABELS: Record<TargetModel, string> = {
   nanoBanana: 'Nano Banana Pro',
   chatgpt: 'ChatGPT / DALL-E',
   midjourney: 'Midjourney',
};
