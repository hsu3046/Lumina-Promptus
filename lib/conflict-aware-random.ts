// lib/conflict-aware-random.ts
// 충돌 회피 랜덤 선택 유틸리티

import type {
    PortraitFraming,
    PortraitBodyPose,
    PortraitHandPose,
    PortraitExpression,
    PortraitGaze,
} from '@/types';

import {
    FRAMING_BODY_POSE_CONFLICTS,
    FRAMING_HAND_POSE_CONFLICTS,
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
} from '@/config/mappings/framing-fashion-conflicts';

// ===== 헬퍼: 충돌 레벨 확인 =====
function isCritical(level: ConflictLevel | undefined): boolean {
    return level === 'critical' || level === 'disabled';
}

// ===== 배열에서 랜덤 선택 =====
function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ===== 순차적 충돌 회피 랜덤 선택 =====

export interface ConflictAwareRandomParams {
    framing: PortraitFraming;   // 현재 구도
    angle: string;               // 현재 앵글
}

export interface ConflictAwarePoseResult {
    bodyPose: PortraitBodyPose;
    handPose: PortraitHandPose;
    expression: PortraitExpression;
    gaze: PortraitGaze;
}

/**
 * 구도/앵글에 호환되는 포즈 조합을 순차적으로 선택
 * 1. 구도에 호환되는 바디포즈 선택
 * 2. 구도+선택된 바디포즈에 호환되는 핸드포즈 선택
 * 3. 핸드포즈에 호환되는 표정 선택
 * 4. 표정+바디포즈+핸드포즈+앵글에 호환되는 시선 선택
 */
export function selectConflictAwarePose(params: ConflictAwareRandomParams): ConflictAwarePoseResult {
    const { framing, angle } = params;

    // 1. 구도에 호환되는 바디포즈 필터링
    const framingBodyConflicts = FRAMING_BODY_POSE_CONFLICTS[framing] || {};
    const compatibleBodyPoses = BODY_POSE_OPTIONS.filter(
        opt => !isCritical(framingBodyConflicts[opt.value])
    );
    const bodyPose = pickRandom(compatibleBodyPoses).value;

    // 2. 구도에 호환되는 핸드포즈 필터링
    const framingHandConflicts = FRAMING_HAND_POSE_CONFLICTS[framing] || {};
    const compatibleHandPoses = HAND_POSE_OPTIONS.filter(
        opt => !isCritical(framingHandConflicts[opt.value])
    );
    const handPose = pickRandom(compatibleHandPoses).value;

    // 3. 핸드포즈에 호환되는 표정 필터링
    const handExpressionConflicts = HAND_POSE_EXPRESSION_CONFLICTS[handPose] || {};
    const compatibleExpressions = EXPRESSION_OPTIONS.filter(
        opt => !isCritical(handExpressionConflicts[opt.value])
    );
    const expression = pickRandom(compatibleExpressions).value;

    // 4. 표정 + 바디포즈 + 핸드포즈 + 앵글에 호환되는 시선 필터링
    const expressionGazeConflicts = EXPRESSION_GAZE_CONFLICTS[expression] || {};
    const bodyGazeConflicts = BODY_POSE_GAZE_CONFLICTS[bodyPose] || {};
    const handGazeConflicts = HAND_POSE_GAZE_CONFLICTS[handPose] || {};
    const angleGazeConflicts = ANGLE_GAZE_CONFLICTS[angle] || {};

    const compatibleGazes = GAZE_OPTIONS.filter(opt => {
        const value = opt.value;
        return !isCritical(expressionGazeConflicts[value])
            && !isCritical(bodyGazeConflicts[value])
            && !isCritical(handGazeConflicts[value])
            && !isCritical(angleGazeConflicts[value]);
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
export function getFashionVisibility(framing: PortraitFraming): FashionVisibilityCheck {
    const visibility = FRAMING_VISIBILITY[framing];

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
