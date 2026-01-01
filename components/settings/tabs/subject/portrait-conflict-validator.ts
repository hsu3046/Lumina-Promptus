// lib/portrait-conflict-validator.ts
// 포트레이트 구도/포즈/표정/시선 충돌 검증

import type {
    PortraitFraming,
    PortraitBodyPose,
    PortraitHandPose,
    PortraitExpression,
    PortraitGaze
} from '@/types';

import {
    FRAMING_BODY_POSE_CONFLICTS,
    FRAMING_HAND_POSE_CONFLICTS,
    BODY_POSE_EXPRESSION_CONFLICTS,
    HAND_POSE_EXPRESSION_CONFLICTS,
    EXPRESSION_GAZE_CONFLICTS,
    BODY_POSE_GAZE_CONFLICTS,
    HAND_POSE_GAZE_CONFLICTS,
    ANGLE_GAZE_CONFLICTS,
    type ConflictLevel
} from '@/config/mappings/portrait-composition';

export interface PortraitConflict {
    level: ConflictLevel;
    field1: string;
    field2: string;
    value1: string;
    value2: string;
    message: string;
}

export interface PortraitConfig {
    framing: PortraitFraming;
    bodyPose: PortraitBodyPose;
    handPose: PortraitHandPose;
    expression: PortraitExpression;
    gaze: PortraitGaze;
    angle?: string;  // 카메라 앵글 (옵션)
}

/**
 * 포트레이트 설정 전체 검증
 */
export function validatePortraitConfig(config: PortraitConfig): PortraitConflict[] {
    const conflicts: PortraitConflict[] = [];

    // 1. 구도 ↔ Body Pose
    const framingBodyPose = FRAMING_BODY_POSE_CONFLICTS[config.framing]?.[config.bodyPose];
    if (framingBodyPose) {
        conflicts.push({
            level: framingBodyPose,
            field1: 'framing',
            field2: 'bodyPose',
            value1: config.framing,
            value2: config.bodyPose,
            message: framingBodyPose === 'critical'
                ? `${config.framing}에서는 ${config.bodyPose} 포즈가 화면에 보이지 않습니다`
                : `${config.framing}에서 ${config.bodyPose} 포즈는 비효율적입니다`,
        });
    }

    // 2. 구도 ↔ Hand Pose
    const framingHandPose = FRAMING_HAND_POSE_CONFLICTS[config.framing]?.[config.handPose];
    if (framingHandPose) {
        conflicts.push({
            level: framingHandPose,
            field1: 'framing',
            field2: 'handPose',
            value1: config.framing,
            value2: config.handPose,
            message: framingHandPose === 'critical'
                ? `${config.framing}에서는 ${config.handPose}가 화면에 보이지 않습니다`
                : `${config.framing}에서 ${config.handPose}는 디테일이 약합니다`,
        });
    }

    // 3. Body Pose ↔ Expression
    const bodyPoseExpression = BODY_POSE_EXPRESSION_CONFLICTS[config.bodyPose]?.[config.expression];
    if (bodyPoseExpression) {
        conflicts.push({
            level: bodyPoseExpression,
            field1: 'bodyPose',
            field2: 'expression',
            value1: config.bodyPose,
            value2: config.expression,
            message: `${config.bodyPose} 포즈와 ${config.expression} 표정이 어울리지 않습니다`,
        });
    }

    // 4. Hand Pose ↔ Expression
    const handPoseExpression = HAND_POSE_EXPRESSION_CONFLICTS[config.handPose]?.[config.expression];
    if (handPoseExpression) {
        conflicts.push({
            level: handPoseExpression,
            field1: 'handPose',
            field2: 'expression',
            value1: config.handPose,
            value2: config.expression,
            message: handPoseExpression === 'critical'
                ? `${config.handPose}와 ${config.expression}는 신체 언어가 모순됩니다`
                : `${config.handPose}와 ${config.expression}는 부자연스럽습니다`,
        });
    }

    // 5. Expression ↔ Gaze
    const expressionGaze = EXPRESSION_GAZE_CONFLICTS[config.expression]?.[config.gaze];
    if (expressionGaze) {
        conflicts.push({
            level: expressionGaze,
            field1: 'expression',
            field2: 'gaze',
            value1: config.expression,
            value2: config.gaze,
            message: expressionGaze === 'critical'
                ? `${config.expression} 표정과 ${config.gaze} 시선은 불가능합니다`
                : `${config.expression} 표정과 ${config.gaze} 시선은 어울리지 않습니다`,
        });
    }

    // 6. Body Pose ↔ Gaze
    const bodyPoseGaze = BODY_POSE_GAZE_CONFLICTS[config.bodyPose]?.[config.gaze];
    if (bodyPoseGaze) {
        conflicts.push({
            level: bodyPoseGaze,
            field1: 'bodyPose',
            field2: 'gaze',
            value1: config.bodyPose,
            value2: config.gaze,
            message: `${config.bodyPose} 포즈에서 ${config.gaze} 시선은 부자연스럽습니다`,
        });
    }

    // 7. Hand Pose ↔ Gaze
    const handPoseGaze = HAND_POSE_GAZE_CONFLICTS[config.handPose]?.[config.gaze];
    if (handPoseGaze) {
        conflicts.push({
            level: handPoseGaze,
            field1: 'handPose',
            field2: 'gaze',
            value1: config.handPose,
            value2: config.gaze,
            message: `${config.handPose}와 ${config.gaze} 시선은 어울리지 않습니다`,
        });
    }

    // 8. Camera Angle ↔ Gaze (앵글-시선 충돌)
    if (config.angle) {
        const angleGaze = ANGLE_GAZE_CONFLICTS[config.angle]?.[config.gaze];
        if (angleGaze) {
            conflicts.push({
                level: angleGaze,
                field1: 'angle',
                field2: 'gaze',
                value1: config.angle,
                value2: config.gaze,
                message: angleGaze === 'critical'
                    ? `${config.angle} 앵글에서 ${config.gaze} 시선은 불가능합니다`
                    : `${config.angle} 앵글에서 ${config.gaze} 시선은 부자연스럽습니다`,
            });
        }
    }

    return conflicts;
}

/**
 * 특정 필드 변경 시 충돌 레벨 확인
 */
export function getFieldConflictLevel(
    currentConfig: PortraitConfig,
    field: keyof PortraitConfig,
    newValue: string
): { level: ConflictLevel; message?: string } {
    const testConfig = { ...currentConfig, [field]: newValue } as PortraitConfig;
    const conflicts = validatePortraitConfig(testConfig);

    // 해당 필드와 관련된 충돌만 필터
    const relevantConflicts = conflicts.filter(c => c.field1 === field || c.field2 === field);

    if (relevantConflicts.length === 0) return { level: 'ok' };

    // 가장 심각한 충돌 반환
    const hasError = relevantConflicts.some(c => c.level === 'critical');
    if (hasError) {
        const error = relevantConflicts.find(c => c.level === 'critical')!;
        return { level: 'critical', message: error.message };
    }

    const warning = relevantConflicts.find(c => c.level === 'warning')!;
    return { level: 'warning', message: warning.message };
}
