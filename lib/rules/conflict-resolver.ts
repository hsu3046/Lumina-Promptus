// lib/conflict-resolver/rules.ts
// 충돌 감지 규칙 엔진

import type { PromptIR, ConflictReport, ConflictResolution } from '@/types';

export interface ConflictRule {
    id: string;
    condition: (ir: PromptIR) => boolean;
    severity: 'error' | 'warning' | 'info';
    message: string;
    resolutions: ConflictResolution[];
}

export const CONFLICT_RULES: ConflictRule[] = [
    // Rule 1: 흑백 스타일 vs 컬러 필름
    {
        id: 'bw_vs_color_film',
        condition: (ir) => {
            const colorGrading = ir.slots['color_grading']?.content || '';
            const style = ir.slots['style']?.content || '';

            const hasColorFilm = /portra|velvia|ektar|kodachrome/i.test(colorGrading);
            const hasBWStyle = /black and white|monochrome|grayscale|noir/i.test(style);

            return hasColorFilm && hasBWStyle;
        },
        severity: 'warning',
        message: '흑백 스타일과 컬러 필름이 충돌합니다',
        resolutions: [
            {
                action: 'override',
                description: '컬러 필름 우선 (흑백 스타일 제거)',
                expectedOutcome: '선택한 필름 스톡의 컬러로 생성됩니다'
            },
            {
                action: 'override',
                description: '흑백 스타일 우선 (필름 스톡 무시)',
                expectedOutcome: '흑백으로 생성되며 필름 특성은 대비/입자에만 적용됩니다'
            },
            {
                action: 'merge',
                description: '실험적 조합 (둘 다 적용)',
                expectedOutcome: '결과 예측 어려움 - 둘 다 프롬프트에 포함됩니다'
            }
        ]
    },

    // Rule 2: Hard Light vs Soft 분위기 묘사
    {
        id: 'hard_light_vs_soft_mood',
        condition: (ir) => {
            const lighting = ir.slots['lighting']?.content || '';
            const style = ir.slots['style']?.content || '';

            const hasHardLight = /hard light|sharp shadow|direct light/i.test(lighting);
            const hasSoftMood = /soft|gentle|dreamy|ethereal|delicate/i.test(style);

            return hasHardLight && hasSoftMood;
        },
        severity: 'info',
        message: '조명 설정(Hard Light)과 분위기 묘사(Soft)가 상충될 수 있습니다',
        resolutions: [
            {
                action: 'ask_user',
                description: '사용자에게 확인',
                expectedOutcome: '의도적인 대비 효과인지 확인 후 진행합니다'
            },
            {
                action: 'override',
                description: '조명 설정 우선',
                expectedOutcome: '분위기 묘사에서 "soft" 관련 키워드가 제거됩니다'
            }
        ]
    },

    // Rule 3: 초광각 렌즈 + 인물 클로즈업
    {
        id: 'ultra_wide_portrait_closeup',
        condition: (ir) => {
            const lens = ir.slots['lens']?.content || '';
            const composition = ir.slots['composition']?.content || '';
            const subject = ir.slots['subject']?.content || '';

            const hasUltraWide = /14mm|16mm|ultra wide|fisheye/i.test(lens);
            const hasCloseup = /close-?up|headshot|face portrait/i.test(composition) ||
                /close-?up|headshot|face/i.test(subject);

            return hasUltraWide && hasCloseup;
        },
        severity: 'warning',
        message: '초광각 렌즈로 인물 클로즈업 시 왜곡이 발생할 수 있습니다',
        resolutions: [
            {
                action: 'skip',
                description: '그대로 진행 (의도적 왜곡 효과)',
                expectedOutcome: '초광각 특유의 원근 왜곡이 적용됩니다'
            },
            {
                action: 'ask_user',
                description: '85mm 인물용 렌즈로 변경 권장',
                expectedOutcome: '더 자연스러운 인물 비율로 생성됩니다'
            }
        ]
    }
];

/**
 * IR에서 모든 충돌을 감지하고 ConflictReport 배열 반환
 */
export function detectConflicts(ir: PromptIR): ConflictReport[] {
    const conflicts: ConflictReport[] = [];

    for (const rule of CONFLICT_RULES) {
        if (rule.condition(ir)) {
            conflicts.push({
                type: 'slot_conflict',
                severity: rule.severity,
                slots: extractAffectedSlots(rule.id),
                message: rule.message,
                suggestions: rule.resolutions
            });
        }
    }

    return conflicts;
}

/**
 * 규칙 ID에서 영향받는 슬롯 ID 추출
 */
function extractAffectedSlots(ruleId: string): string[] {
    const slotMap: Record<string, string[]> = {
        'bw_vs_color_film': ['color_grading', 'style'],
        'hard_light_vs_soft_mood': ['lighting', 'style'],
        'ultra_wide_portrait_closeup': ['lens', 'composition', 'subject']
    };

    return slotMap[ruleId] || [];
}

/**
 * 충돌 해결 적용
 */
export function applyResolution(
    ir: PromptIR,
    ruleId: string,
    resolution: ConflictResolution
): PromptIR {
    const updatedIR = { ...ir, slots: { ...ir.slots } };

    switch (ruleId) {
        case 'bw_vs_color_film':
            if (resolution.action === 'override') {
                if (resolution.description.includes('컬러 필름')) {
                    // 스타일에서 흑백 관련 키워드 제거
                    const styleSlot = updatedIR.slots['style'];
                    if (styleSlot) {
                        updatedIR.slots['style'] = {
                            ...styleSlot,
                            content: styleSlot.content.replace(/black and white|monochrome|grayscale|noir/gi, '').trim()
                        };
                    }
                } else {
                    // 컬러 필름 슬롯 제거
                    delete updatedIR.slots['color_grading'];
                }
            }
            break;

        case 'hard_light_vs_soft_mood':
            if (resolution.action === 'override') {
                const styleSlot = updatedIR.slots['style'];
                if (styleSlot) {
                    updatedIR.slots['style'] = {
                        ...styleSlot,
                        content: styleSlot.content.replace(/soft|gentle|dreamy|ethereal|delicate/gi, '').trim()
                    };
                }
            }
            break;

        // 다른 규칙들도 필요에 따라 추가
    }

    return updatedIR;
}
