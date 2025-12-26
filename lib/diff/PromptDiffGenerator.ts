// lib/diff/PromptDiffGenerator.ts
// Before/After Diff 생성기

import type { PromptIR, PromptDiff } from '@/types';

export class PromptDiffGenerator {
    /**
     * 두 IR 간의 차이점 생성
     */
    static generateDiff(before: PromptIR | null, after: PromptIR): PromptDiff[] {
        const diffs: PromptDiff[] = [];

        if (!before) {
            // 이전 상태가 없으면 모든 슬롯을 "added"로 처리
            for (const [slotId, slot] of Object.entries(after.slots)) {
                diffs.push({
                    slotId,
                    before: '',
                    after: slot.content,
                    changeType: 'added',
                    impact: this.estimateImpact(slotId, '', slot.content)
                });
            }
            return diffs;
        }

        // 변경/추가된 슬롯
        for (const [slotId, afterSlot] of Object.entries(after.slots)) {
            const beforeContent = before.slots[slotId]?.content || '';
            const afterContent = afterSlot.content;

            if (beforeContent !== afterContent) {
                diffs.push({
                    slotId,
                    before: beforeContent,
                    after: afterContent,
                    changeType: this.determineChangeType(beforeContent, afterContent),
                    impact: this.estimateImpact(slotId, beforeContent, afterContent)
                });
            }
        }

        // 제거된 슬롯
        for (const slotId of Object.keys(before.slots)) {
            if (!after.slots[slotId]) {
                diffs.push({
                    slotId,
                    before: before.slots[slotId].content,
                    after: '',
                    changeType: 'removed',
                    impact: this.estimateImpact(slotId, before.slots[slotId].content, '')
                });
            }
        }

        return diffs;
    }

    /**
     * 변경 타입 결정
     */
    private static determineChangeType(
        before: string,
        after: string
    ): PromptDiff['changeType'] {
        if (!before) return 'added';
        if (!after) return 'removed';
        return 'modified';
    }

    /**
     * 영향도 추정
     */
    private static estimateImpact(
        slotId: string,
        before: string,
        after: string
    ): PromptDiff['impact'] {
        const impactRules: Record<string, (b: string, a: string) => { description: string; severity: 'low' | 'medium' | 'high' }> = {
            lighting: (b, a) => {
                if (b.includes('soft') && a.includes('hard')) {
                    return { description: '그림자 강도 증가, 대비 향상 예상', severity: 'medium' };
                }
                if (b.includes('hard') && a.includes('soft')) {
                    return { description: '그림자 부드러워짐, 플래터링 효과', severity: 'medium' };
                }
                return { description: '조명 특성 변경', severity: 'low' };
            },

            camera_settings: (b, a) => {
                const beforeISO = this.extractISO(b);
                const afterISO = this.extractISO(a);
                const isoChange = afterISO - beforeISO;

                if (isoChange > 400) {
                    return { description: `grain 증가, 디테일 손실 가능 (ISO +${isoChange})`, severity: 'high' };
                }
                if (isoChange < -400) {
                    return { description: `더 깨끗한 이미지 (ISO ${isoChange})`, severity: 'medium' };
                }

                // 조리개 변화
                const beforeAperture = this.extractAperture(b);
                const afterAperture = this.extractAperture(a);

                if (beforeAperture && afterAperture) {
                    if (afterAperture < beforeAperture) {
                        return { description: '배경 흐림 강화 (얕은 DOF)', severity: 'medium' };
                    }
                    if (afterAperture > beforeAperture) {
                        return { description: '더 깊은 피사계 심도', severity: 'medium' };
                    }
                }

                return { description: '카메라 설정 변경', severity: 'low' };
            },

            subject: () => ({
                description: '피사체 묘사 변경 - 결과 크게 달라질 수 있음',
                severity: 'high'
            }),

            lens: (b, a) => {
                const beforeFocal = this.extractFocalLength(b);
                const afterFocal = this.extractFocalLength(a);

                if (beforeFocal && afterFocal) {
                    if (afterFocal < beforeFocal) {
                        return { description: '더 넓은 화각, 배경 포함 증가', severity: 'medium' };
                    }
                    if (afterFocal > beforeFocal) {
                        return { description: '더 좁은 화각, 압축 효과 증가', severity: 'medium' };
                    }
                }
                return { description: '렌즈 특성 변경', severity: 'medium' };
            },

            composition: () => ({
                description: '구도/앵글 변경',
                severity: 'low'
            }),

            quality: () => ({
                description: '품질 키워드 변경',
                severity: 'low'
            }),

            negative: () => ({
                description: '네거티브 프롬프트 변경 - 원하지 않는 요소 제어',
                severity: 'medium'
            })
        };

        const impactFn = impactRules[slotId];
        if (impactFn) {
            return impactFn(before, after);
        }

        return { description: `${slotId} 변경`, severity: 'low' };
    }

    /**
     * ISO 값 추출
     */
    private static extractISO(content: string): number {
        const match = content.match(/ISO\s*(\d+)/i);
        return match ? parseInt(match[1]) : 0;
    }

    /**
     * 조리개 값 추출 (f/1.4 → 1.4)
     */
    private static extractAperture(content: string): number {
        const match = content.match(/f\/?([\d.]+)/i);
        return match ? parseFloat(match[1]) : 0;
    }

    /**
     * 초점거리 추출 (85mm → 85)
     */
    private static extractFocalLength(content: string): number {
        const match = content.match(/(\d+)mm/i);
        return match ? parseInt(match[1]) : 0;
    }
}
