// lib/rules/conflict-evaluator.ts
// 충돌 규칙 평가 엔진

import type { ConflictRule, Restriction } from '@/lib/rules/conflict-rules';

export interface RestrictionInfo {
    field: string;
    value: string;
    restriction: Restriction;
    sourceField: string;
    sourceValue: string;
}

/**
 * 현재 설정을 기반으로 충돌 규칙을 평가하고
 * 각 필드/값에 대한 restriction 정보를 반환
 */
export function evaluateConflicts(
    settings: Record<string, string>,
    rules: ConflictRule[]
): RestrictionInfo[] {
    const restrictions: RestrictionInfo[] = [];

    for (const rule of rules) {
        const sourceValue = settings[rule.source.field];

        // source 조건 매칭 확인
        if (!rule.source.values.includes(sourceValue)) {
            continue;
        }

        // 매칭되면 target에 restriction 적용
        for (const affectedValue of rule.target.affected) {
            restrictions.push({
                field: rule.target.field,
                value: affectedValue,
                restriction: rule.restriction,
                sourceField: rule.source.field,
                sourceValue: sourceValue,
            });
        }
    }

    return restrictions;
}

/**
 * 특정 필드의 특정 값에 대한 restriction 조회
 * 여러 규칙이 겹칠 경우 가장 강한 restriction 반환 (hide > disabled > none)
 */
export function getRestriction(
    restrictions: RestrictionInfo[],
    field: string,
    value: string
): Restriction | null {
    const matches = restrictions.filter(
        r => r.field === field && (r.value === value || r.value === '*')
    );

    if (matches.length === 0) {
        return null;
    }

    // 우선순위: hide > disabled > none
    if (matches.some(r => r.restriction === 'hide')) return 'hide';
    if (matches.some(r => r.restriction === 'disabled')) return 'disabled';
    if (matches.some(r => r.restriction === 'none')) return 'none';

    return null;
}

/**
 * 옵션 배열에 restriction 정보를 추가
 */
export function applyRestrictionsToOptions<T extends { value: string }>(
    options: T[],
    restrictions: RestrictionInfo[],
    field: string
): (T & { restriction: Restriction | null })[] {
    return options.map(option => ({
        ...option,
        restriction: getRestriction(restrictions, field, option.value),
    }));
}
