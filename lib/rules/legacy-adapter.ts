// lib/rules/legacy-adapter.ts
// 충돌 규칙 어댑터 - 새 conflict-rules.ts 기반

import type { ConflictLevel } from '@/components/ui/combobox-field';
import { STUDIO_CONFLICT_RULES, type Restriction } from '@/config/rules/conflict-rules';
import {
    FRAMING_BODY_POSE_CONFLICTS,
    FRAMING_HAND_POSE_CONFLICTS,
    type ConflictLevel as LegacyConflictLevel,
} from '@/config/mappings/portrait-composition';
import type { PortraitFraming, PortraitBodyPose, PortraitHandPose } from '@/types';

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
 * 레거시 충돌 레벨을 새 ConflictLevel로 변환 (하위 호환)
 */
function mapLegacyLevel(level: string | undefined): ConflictLevel {
    if (!level || level === 'ok') return 'ok';
    if (level === 'disabled') return 'disabled';
    if (level === 'critical') return 'disabled';
    if (level === 'warning') return 'none';
    if (level === 'recommend') return 'recommend';
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

// ===== 라이팅 충돌 =====

import {
    FRAMING_PATTERN_CONFLICTS,
    LIGHTING_CONFLICTS,
    type FramingPatternConflictLevel,
} from '@/config/lighting-rules';
import type { LightingPattern, LightingKey, LightingRatio, SpecialLighting } from '@/types/lighting.types';

/**
 * 구도 기반 라이팅 패턴 충돌 레벨 조회
 */
export function getLightingPatternConflict(framing: string, pattern: string): ConflictLevel {
    const matrix = FRAMING_PATTERN_CONFLICTS[framing];
    if (!matrix) return 'ok';
    const level = matrix[pattern as LightingPattern];
    return mapLegacyLevel(level as FramingPatternConflictLevel);
}

/**
 * 패턴-키 충돌 여부 조회
 */
export function getPatternKeyConflict(pattern: string, key: string): ConflictLevel {
    const conflicts = LIGHTING_CONFLICTS.patternKeyConflicts;
    const found = conflicts.find(c => c.pattern === pattern && c.key === key);
    return found ? 'disabled' : 'ok';
}

/**
 * 키-비율 충돌 여부 조회
 */
export function getKeyRatioConflict(key: string, ratio: string): ConflictLevel {
    const conflicts = LIGHTING_CONFLICTS.keyRatioConflicts;
    const found = conflicts.find(c => c.key === key && (c.ratios as string[]).includes(ratio));
    return found ? 'disabled' : 'ok';
}

/**
 * 패턴-비율 충돌 여부 조회
 */
export function getPatternRatioConflict(pattern: string, ratio: string): ConflictLevel {
    const conflicts = LIGHTING_CONFLICTS.patternRatioConflicts;
    const found = conflicts.find(c => c.pattern === pattern && (c.ratios as string[]).includes(ratio));
    return found ? 'disabled' : 'ok';
}

/**
 * 특수 조명 간 충돌 여부 조회
 */
export function getSpecialConflict(special1: string, special2: string): ConflictLevel {
    const conflicts = LIGHTING_CONFLICTS.specialToSpecialConflicts;
    const found = conflicts.find(c =>
        (c.special1 === special1 && c.special2 === special2) ||
        (c.special1 === special2 && c.special2 === special1)
    );
    if (!found) return 'ok';
    return found.severity === 'error' ? 'disabled' : 'none';
}

