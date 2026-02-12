// lib/conflict-aware-random.ts
// 충돌 회피 랜덤 선택 유틸리티

import type {
    PortraitBodyPose,
    PortraitHandPose,
    PortraitExpression,
    PortraitGaze,
} from '@/types';

import {
    HAND_POSE_EXPRESSION_CONFLICTS,
    EXPRESSION_GAZE_CONFLICTS,
    BODY_POSE_GAZE_CONFLICTS,
    HAND_POSE_GAZE_CONFLICTS,
    ANGLE_GAZE_CONFLICTS,
    BODY_POSE_OPTIONS,
    HAND_POSE_OPTIONS,
    EXPRESSION_OPTIONS,
    GAZE_OPTIONS,
    type ConflictLevel,
} from '@/config/mappings/portrait-composition';

import {
    FRAMING_VISIBILITY,
    ACCESSORY_CATEGORIES,
} from '@/lib/rules/conflict-framing-fashion';

import {
    getBodyPoseConflict,
    getHandPoseConflict,
} from '@/lib/rules/conflict-adapter';

// ===== 헬퍼: 충돌 레벨 확인 =====
function isConflict(level: ConflictLevel | string | undefined): boolean {
    return level === 'warning' || level === 'critical' || level === 'disabled' || level === 'none';
}

// ===== 배열에서 랜덤 선택 =====
function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ===== 순차적 충돌 회피 랜덤 선택 =====

export interface ConflictAwareRandomParams {
    framing: string;   // 현재 구도
    angle: string;     // 현재 앵글
}

export interface ConflictAwarePoseResult {
    bodyPose: PortraitBodyPose;
    handPose: PortraitHandPose;
    expression: PortraitExpression;
    gaze: PortraitGaze;
}

/**
 * 구도/앵글에 호환되는 포즈 조합을 순차적으로 선택
 * STUDIO_CONFLICT_RULES 기반 (conflict-adapter 사용)
 */
export function selectConflictAwarePose(params: ConflictAwareRandomParams): ConflictAwarePoseResult {
    const { framing, angle } = params;

    // 1. 구도에 호환되는 바디포즈 필터링 (conflict-adapter 사용)
    const compatibleBodyPoses = BODY_POSE_OPTIONS.filter(
        opt => getBodyPoseConflict(framing, opt.value) === 'ok'
    );
    const bodyPose = compatibleBodyPoses.length > 0
        ? pickRandom(compatibleBodyPoses).value
        : 'straight'; // fallback

    // 2. 구도에 호환되는 핸드포즈 필터링 (conflict-adapter 사용)
    const compatibleHandPoses = HAND_POSE_OPTIONS.filter(
        opt => getHandPoseConflict(framing, opt.value) === 'ok'
    );
    const handPose = compatibleHandPoses.length > 0
        ? pickRandom(compatibleHandPoses).value
        : 'natural-relaxed'; // fallback

    // 3. 핸드포즈에 호환되는 표정 필터링
    const handExpressionConflicts = HAND_POSE_EXPRESSION_CONFLICTS[handPose] || {};
    const compatibleExpressions = EXPRESSION_OPTIONS.filter(
        opt => !isConflict(handExpressionConflicts[opt.value])
    );
    const expression = pickRandom(compatibleExpressions).value;

    // 4. 표정 + 바디포즈 + 핸드포즈 + 앵글에 호환되는 시선 필터링
    const expressionGazeConflicts = EXPRESSION_GAZE_CONFLICTS[expression] || {};
    const bodyGazeConflicts = BODY_POSE_GAZE_CONFLICTS[bodyPose] || {};
    const handGazeConflicts = HAND_POSE_GAZE_CONFLICTS[handPose] || {};
    const angleGazeConflicts = ANGLE_GAZE_CONFLICTS[angle] || {};

    const compatibleGazes = GAZE_OPTIONS.filter(opt => {
        const value = opt.value;
        return !isConflict(expressionGazeConflicts[value])
            && !isConflict(bodyGazeConflicts[value])
            && !isConflict(handGazeConflicts[value])
            && !isConflict(angleGazeConflicts[value]);
    });
    const gaze = compatibleGazes.length > 0
        ? pickRandom(compatibleGazes).value
        : 'direct-eye-contact'; // fallback

    return { bodyPose, handPose, expression, gaze };
}

// ===== 구도에 호환되는 패션 아이템 체크 =====

export interface FashionVisibilityCheck {
    bottomWear: boolean;  // 하의 보임
    footwear: boolean;    // 신발 보임
    accessoryOk: (accessoryValue: string) => boolean;  // 악세서리 보임
}

/**
 * 구도에서 패션 아이템이 보이는지 체크
 * critical이 아니면 OK (warning은 허용)
 */
export function getFashionVisibility(framing: string): FashionVisibilityCheck {
    const visibility = FRAMING_VISIBILITY[framing as keyof typeof FRAMING_VISIBILITY];

    return {
        bottomWear: visibility.bottomWear !== 'hidden',
        footwear: visibility.footwear !== 'hidden',
        accessoryOk: (accessoryValue: string) => {
            if (!accessoryValue) return true;
            const category = ACCESSORY_CATEGORIES[accessoryValue] || 'other';
            return visibility.accessoryCategories[category] !== 'hidden';
        },
    };
}
