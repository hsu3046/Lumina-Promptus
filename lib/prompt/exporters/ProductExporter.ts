// lib/prompt/exporters/ProductExporter.ts
// 제품 촬영 모드 전용 Exporter — IR 슬롯을 프롬프트로 변환

import { BaseExporter } from './BaseExporter';
import type { PromptIR, UserSettings } from '@/types';
import { getLensById } from '@/config/mappings/lenses';
import { getCameraById, getCameraTypeLabel } from '@/config/mappings/cameras';

export class ProductExporter extends BaseExporter {
    constructor(ir: PromptIR, settings?: UserSettings) {
        super(ir, settings);
    }

    /**
     * IR을 제품 촬영 프롬프트로 변환
     * 구조: [Aspect Ratio] + [Subject] + [Composition] + [Location/Surface] + [Lighting] + [Tech Specs] + [Style]
     */
    export(): string {
        const sections: string[] = [];

        // 1. [Aspect Ratio] — 비율
        const aspectRatio = this.ir.slots['aspect_ratio']?.content;
        if (aspectRatio) sections.push(aspectRatio);

        // 2. [Subject] — 제품 피사체
        const subject = this.ir.slots['subject']?.content;
        if (subject) sections.push(subject);

        // 3. [Composition] — 구도/샷 타입
        const composition = this.ir.slots['composition']?.content;
        if (composition) sections.push(composition);

        // 4. [Location/Surface] — 서페이스/배경
        const location = this.ir.slots['location']?.content;
        if (location) sections.push(location);

        // 5. [Lighting] — 조명
        const lighting = this.ir.slots['lighting']?.content;
        if (lighting) sections.push(lighting);

        // 6. [Tech Specs] — 카메라 + 렌즈
        const techSpecs = this.buildTechSpecs();
        if (techSpecs) sections.push(techSpecs);

        // 7. [Style] — 카메라 설정 + 상품 사진 지시문
        const style = this.ir.slots['style']?.content;
        if (style) sections.push(style);

        return sections.filter(Boolean).join('. ') + '.';
    }

    /**
     * 카메라 + 렌즈 테크 스펙
     */
    private buildTechSpecs(): string {
        const parts: string[] = [];

        // 카메라 바디
        const camera = getCameraById(this.settings.camera?.bodyId);
        if (camera) {
            parts.push(`Shot on ${camera.brand} ${camera.model}`);
        }

        // 렌즈
        const lens = getLensById(this.settings.camera?.lensId);
        if (lens) {
            if (lens.focalLength) {
                parts.push(`with ${lens.focalLength} lens`);
            }
            if (lens.maxAperture) {
                parts.push(`at f/${lens.maxAperture}`);
            }
        }

        return parts.join(' ');
    }

    getMetadata(): {
        totalTokens: number;
        slotBreakdown: Record<string, number>;
        warnings: string[];
    } {
        const slotBreakdown: Record<string, number> = {};
        let totalTokens = 0;

        for (const [key, slot] of Object.entries(this.ir.slots)) {
            slotBreakdown[key] = slot.tokens;
            totalTokens += slot.tokens;
        }

        return {
            totalTokens,
            slotBreakdown,
            warnings: [],
        };
    }
}
