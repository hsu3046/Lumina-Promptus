// lib/rules/conflict-adapter.ts
// 충돌 규칙 어댑터 - conflict-rules.ts 기반

import type { ConflictLevel } from '@/components/ui/combobox-field';
import { STUDIO_CONFLICT_RULES, type Restriction } from '@/lib/rules/conflict-rules';

/**
 * Restriction을 ConflictLevel로 변환
 */
function mapRestriction(restriction: Restriction | null): ConflictLevel {
    if (!restriction) return 'ok';
    if (restriction === 'disabled') return 'disabled';
    if (restriction === 'none') return 'none';
    if (restriction === 'hide') return 'disabled';
    return 'ok';
}

/**
 * 새 규칙 시스템에서 충돌 조회
 */
function getConflictFromRules(
    rules: typeof STUDIO_CONFLICT_RULES,
    sourceField: string,
    sourceValue: string,
    targetField: string,
    targetValue: string
): Restriction | null {
    for (const rule of rules) {
        if (
            rule.source.field === sourceField &&
            rule.source.values.includes(sourceValue) &&
            rule.target.field === targetField &&
            (rule.target.affected.includes(targetValue) || rule.target.affected.includes('*'))
        ) {
            return rule.restriction;
        }
    }
    return null;
}

/**
 * 구도 기반 앵글 충돌 레벨 조회 (새 시스템)
 */
export function getAngleConflict(framing: string, angle: string): ConflictLevel {
    const restriction = getConflictFromRules(STUDIO_CONFLICT_RULES, 'framing', framing, 'angle', angle);
    return mapRestriction(restriction);
}

/**
 * 구도 기반 바디 포즈 충돌 레벨 조회 (새 시스템)
 */
export function getBodyPoseConflict(framing: string, bodyPose: string): ConflictLevel {
    const restriction = getConflictFromRules(STUDIO_CONFLICT_RULES, 'framing', framing, 'bodyPose', bodyPose);
    return mapRestriction(restriction);
}

/**
 * 구도 기반 핸드 포즈 충돌 레벨 조회 (새 시스템)
 */
export function getHandPoseConflict(framing: string, handPose: string): ConflictLevel {
    const restriction = getConflictFromRules(STUDIO_CONFLICT_RULES, 'framing', framing, 'handPose', handPose);
    return mapRestriction(restriction);
}

/**
 * 구도 기반 패션 아이템 disabled 여부 조회 (새 시스템)
 * 하의: 클로즈업~웨이스트샷 disabled
 * 신발: 클로즈업~니샷 disabled
 */
export function getFashionDisabled(framing: string): { bottomWear: boolean; footwear: boolean } {
    const bottomRestriction = getConflictFromRules(STUDIO_CONFLICT_RULES, 'framing', framing, 'bottomWear', '*');
    const footwearRestriction = getConflictFromRules(STUDIO_CONFLICT_RULES, 'framing', framing, 'footwear', '*');
    return {
        bottomWear: bottomRestriction === 'disabled',
        footwear: footwearRestriction === 'disabled',
    };
}

/**
 * 옵션 배열에 충돌 레벨 정보를 추가하는 헬퍼
 */
export function applyFramingConflicts<T extends { value: string }>(
    options: readonly T[],
    framing: string,
    getConflict: (framing: string, value: string) => ConflictLevel
): (T & { conflictLevel: ConflictLevel })[] {
    return options.map(opt => ({
        ...opt,
        conflictLevel: getConflict(framing, opt.value),
    }));
}

// ===== 라이팅 충돌 (새 시스템) =====

/**
 * 패턴 선택 시 키와의 충돌 조회
 */
export function getLightingPatternConflict(pattern: string, currentKey: string): ConflictLevel {
    const restriction = getConflictFromRules(STUDIO_CONFLICT_RULES, 'lightingPattern', pattern, 'lightingKey', currentKey);
    return mapRestriction(restriction);
}

/**
 * 키 선택 시 패턴과의 충돌 조회
 */
export function getLightingKeyConflictForPattern(key: string, currentPattern: string): ConflictLevel {
    const restriction = getConflictFromRules(STUDIO_CONFLICT_RULES, 'lightingPattern', currentPattern, 'lightingKey', key);
    return mapRestriction(restriction);
}

/**
 * 키 선택 시 비율과의 충돌 조회
 */
export function getLightingKeyConflictForRatio(key: string, currentRatio: string): ConflictLevel {
    const restriction = getConflictFromRules(STUDIO_CONFLICT_RULES, 'lightingKey', key, 'lightingRatio', currentRatio);
    return mapRestriction(restriction);
}

/**
 * 비율 선택 시 키와의 충돌 조회
 */
export function getLightingRatioConflictForKey(ratio: string, currentKey: string): ConflictLevel {
    const restriction = getConflictFromRules(STUDIO_CONFLICT_RULES, 'lightingKey', currentKey, 'lightingRatio', ratio);
    return mapRestriction(restriction);
}

/**
 * 비율 선택 시 광질과의 충돌 조회
 */
export function getLightingRatioConflictForQuality(ratio: string, currentQuality: string): ConflictLevel {
    const restriction = getConflictFromRules(STUDIO_CONFLICT_RULES, 'lightingQuality', currentQuality, 'lightingRatio', ratio);
    return mapRestriction(restriction);
}

/**
 * 광질 선택 시 비율과의 충돌 조회
 */
export function getLightingQualityConflictForRatio(quality: string, currentRatio: string): ConflictLevel {
    const restriction = getConflictFromRules(STUDIO_CONFLICT_RULES, 'lightingQuality', quality, 'lightingRatio', currentRatio);
    return mapRestriction(restriction);
}

/**
 * 광질 선택 시 패턴과의 경고 조회
 */
export function getLightingQualityWarningForPattern(quality: string, currentPattern: string): ConflictLevel {
    const restriction = getConflictFromRules(STUDIO_CONFLICT_RULES, 'lightingQuality', quality, 'lightingPattern', currentPattern);
    return mapRestriction(restriction);
}
