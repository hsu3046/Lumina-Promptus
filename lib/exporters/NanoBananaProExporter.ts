// lib/exporters/NanoBananaProExporter.ts
// Nano Banana Pro 모델용 프롬프트 Exporter

import type { PromptIR } from '@/types';
import { NANO_BANANA_PRO_SLOT_ORDER } from '@/config/slots/slot-definitions';

export class NanoBananaProExporter {
    private ir: PromptIR;

    constructor(ir: PromptIR) {
        this.ir = ir;
    }

    /**
     * IR을 Nano Banana Pro 최적화 프롬프트로 변환
     */
    export(): string {
        const positiveParts = NANO_BANANA_PRO_SLOT_ORDER
            .map(slotId => this.ir.slots[slotId]?.content)
            .filter(Boolean);

        return this.optimizePrompt(positiveParts.join(', '));
    }

    /**
     * Positive 프롬프트 최적화
     */
    private optimizePrompt(prompt: string): string {
        // 중복 키워드 제거
        const words = prompt.split(/,\s*/);
        const seen = new Set<string>();
        const unique: string[] = [];

        for (const word of words) {
            const normalized = word.toLowerCase().trim();
            if (normalized && !seen.has(normalized)) {
                seen.add(normalized);
                unique.push(word.trim());
            }
        }

        // 연속 공백 정리
        return unique.join(', ').replace(/\s+/g, ' ').trim();
    }

    /**
     * 프롬프트 메타데이터 반환
     */
    getMetadata(): {
        totalTokens: number;
        slotBreakdown: Record<string, number>;
        warnings: string[];
    } {
        const slotBreakdown: Record<string, number> = {};
        let totalTokens = 0;

        for (const [slotId, slot] of Object.entries(this.ir.slots)) {
            slotBreakdown[slotId] = slot.tokens;
            totalTokens += slot.tokens;
        }

        const warnings: string[] = [];
        if (totalTokens > 1500) {
            warnings.push(`프롬프트가 권장 길이(1500 토큰)를 초과합니다: ${totalTokens} 토큰`);
        }

        return { totalTokens, slotBreakdown, warnings };
    }
}
