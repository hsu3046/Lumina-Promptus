// lib/exporters/MidjourneyExporter.ts
// Midjourney 최적화 프롬프트 Exporter

import type { PromptIR } from '@/types';

interface MidjourneyParams {
    aspectRatio?: string;    // --ar
    version?: string;        // --v
    stylize?: number;        // --s (0-1000)
    chaos?: number;          // --c (0-100)
    quality?: number;        // --q (0.25, 0.5, 1)
    raw?: boolean;           // --style raw
}

export class MidjourneyExporter {
    private ir: PromptIR;
    private params: MidjourneyParams;

    constructor(ir: PromptIR, params?: Partial<MidjourneyParams>) {
        this.ir = ir;
        // 기본 파라미터
        this.params = {
            version: '6.1',
            stylize: 250,
            quality: 1,
            ...params,
        };
    }

    /**
     * IR을 Midjourney 최적화 프롬프트로 변환
     * - 키워드 기반 간결한 형식
     * - 끝에 파라미터 추가 (--ar, --v, --s 등)
     */
    export(): string {
        const slots = this.ir.slots;
        const parts: string[] = [];

        // 1. 피사체 (가장 중요 - 맨 앞)
        if (slots.subject?.content) {
            parts.push(slots.subject.content);
        }

        // 2. 조명
        if (slots.lighting?.content) {
            parts.push(slots.lighting.content);
        }

        // 3. 구도
        if (slots.composition?.content) {
            parts.push(slots.composition.content);
        }

        // 4. 카메라/렌즈 정보
        if (slots.camera_body?.content) {
            parts.push(slots.camera_body.content);
        }
        if (slots.lens?.content) {
            parts.push(slots.lens.content);
        }

        // 5. 스타일 키워드 추가
        parts.push('professional photography');
        parts.push('highly detailed');
        parts.push('8k');

        // 프롬프트 조합
        const promptText = parts.filter(Boolean).join(', ');

        // 파라미터 추가
        const paramsStr = this.buildParams();

        return `${promptText} ${paramsStr}`.trim();
    }

    /**
     * Midjourney 파라미터 문자열 생성
     */
    private buildParams(): string {
        const params: string[] = [];

        // Aspect Ratio - IR에서 추출하거나 기본값 사용
        const aspectRatio = this.extractAspectRatio();
        if (aspectRatio) {
            params.push(`--ar ${aspectRatio}`);
        }

        // Version
        if (this.params.version) {
            params.push(`--v ${this.params.version}`);
        }

        // Stylize
        if (this.params.stylize !== undefined) {
            params.push(`--s ${this.params.stylize}`);
        }

        // Quality
        if (this.params.quality !== undefined && this.params.quality !== 1) {
            params.push(`--q ${this.params.quality}`);
        }

        // Chaos
        if (this.params.chaos !== undefined && this.params.chaos > 0) {
            params.push(`--c ${this.params.chaos}`);
        }

        // Raw mode
        if (this.params.raw) {
            params.push('--style raw');
        }

        return params.join(' ');
    }

    /**
     * IR에서 aspect ratio 추출
     */
    private extractAspectRatio(): string | null {
        const aspectContent = this.ir.slots.aspect_ratio?.content;
        if (!aspectContent) return '2:3'; // 기본값: 세로 포트레이트

        // "2:3 aspect ratio" 등에서 비율 추출
        const match = aspectContent.match(/(\d+:\d+)/);
        return match ? match[1] : '2:3';
    }

    /**
     * 파라미터 설정
     */
    setParams(params: Partial<MidjourneyParams>): void {
        this.params = { ...this.params, ...params };
    }

    /**
     * 프롬프트 메타데이터 반환
     */
    getMetadata(): {
        totalTokens: number;
        model: string;
        params: MidjourneyParams;
    } {
        let totalTokens = 0;
        for (const slot of Object.values(this.ir.slots)) {
            totalTokens += slot.tokens;
        }

        return {
            totalTokens,
            model: 'midjourney',
            params: this.params,
        };
    }
}
