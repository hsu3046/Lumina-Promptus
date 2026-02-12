// config/mappings/portrait-composition.ts
// 포트레이트 구도/포즈/표정/시선 매핑 및 충돌 규칙

import type {
    PortraitFraming,
    PortraitBodyPose,
    PortraitHandPose,
    PortraitExpression,
    PortraitGaze
} from '@/types';

// ===== 옵션 정의 =====

export const FRAMING_OPTIONS: { value: PortraitFraming; label: string; prompt: string }[] = [
    { value: 'extreme-close-up', label: '익스트림 클로즈업', prompt: 'extreme close-up portrait, face detail' },
    { value: 'close-up', label: '클로즈업', prompt: 'close-up portrait' },
    { value: 'bust-shot', label: '바스트샷', prompt: 'bust shot portrait' },
    { value: 'waist-shot', label: '웨이스트샷', prompt: 'waist shot portrait' },
    { value: 'half-shot', label: '미디엄샷', prompt: 'medium shot portrait' },
    { value: 'three-quarter-shot', label: '니샷', prompt: 'knee shot portrait' },
    { value: 'full-shot', label: '풀샷', prompt: 'full body shot' },
    { value: 'long-shot', label: '롱샷', prompt: 'long shot, environmental portrait' },
];

export const BODY_POSE_OPTIONS: { value: PortraitBodyPose; label: string; prompt: string }[] = [
    { value: 'straight', label: '자연스럽게', prompt: 'natural relaxed standing pose' },
    { value: 'contrapposto', label: '컨트라포스토', prompt: 'elegant contrapposto pose' },
    { value: 's-curve', label: 'S커브', prompt: 's-curve body pose' },
    { value: 'three-quarter-turn', label: '3/4 턴', prompt: 'three-quarter turn pose' },
    { value: 'sitting', label: '시팅', prompt: 'sitting pose' },
    { value: 'reclining', label: '리클라인', prompt: 'reclining pose' },
];

export const HAND_POSE_OPTIONS: { value: PortraitHandPose; label: string; prompt: string }[] = [
    { value: 'natural-relaxed', label: '자연스럽게', prompt: 'relaxed natural hands' },
    { value: 'editorial-hands', label: '에디토리얼 핸즈', prompt: 'editorial hands touching face' },
    { value: 'pocket-hands', label: '포켓 핸즈', prompt: 'hands in pockets' },
    { value: 'crossed-arms', label: '팔짱', prompt: 'arms crossed' },
    { value: 'framing-face', label: '프레이밍', prompt: 'hands framing face' },
    { value: 'hair-touch', label: '헤어 터치', prompt: 'touching hair' },
];

export const EXPRESSION_OPTIONS: { value: PortraitExpression; label: string; prompt: string }[] = [
    { value: 'natural-smile', label: '자연스러운 미소', prompt: 'natural warm smile' },
    { value: 'bright-smile', label: '활짝 웃음', prompt: 'bright joyful smile' },
    { value: 'subtle-smile', label: '은은한 미소', prompt: 'subtle elegant smile' },
    { value: 'neutral', label: '중립적', prompt: 'neutral expression' },
    { value: 'serious', label: '시리어스', prompt: 'serious expression' },
    { value: 'pensive', label: '사색적', prompt: 'pensive thoughtful expression' },
    { value: 'mysterious', label: '신비로운', prompt: 'mysterious expression' },
    { value: 'intense', label: '강렬한', prompt: 'intense expression' },
    { value: 'playful', label: '장난스러운', prompt: 'playful expression' },
];

export const GAZE_OPTIONS: { value: PortraitGaze; label: string; prompt: string }[] = [
    { value: 'direct-eye-contact', label: '카메라 직시', prompt: 'direct eye contact with camera' },
    { value: 'off-camera', label: '카메라 밖', prompt: 'looking off-camera' },
    { value: 'looking-up', label: '위 응시', prompt: 'looking upward' },
    { value: 'looking-down', label: '아래 응시', prompt: 'looking downward' },
    { value: 'side-gaze', label: '옆 응시', prompt: 'side gaze' },
    { value: 'eyes-closed', label: '눈 감음', prompt: 'eyes closed' },
];

// ===== 충돌 레벨 =====
export type ConflictLevel = 'disabled' | 'critical' | 'warning' | 'ok';

// NOTE: FRAMING_BODY_POSE_CONFLICTS, FRAMING_HAND_POSE_CONFLICTS, FRAMING_ANGLE_CONFLICTS는
// lib/rules/conflict-rules.ts의 STUDIO_CONFLICT_RULES로 마이그레이션되어 삭제됨 (2026-01-01)

// ===== Body Pose ↔ Expression 충돌 =====
export const BODY_POSE_EXPRESSION_CONFLICTS: Record<PortraitBodyPose, Partial<Record<PortraitExpression, ConflictLevel>>> = {
    'straight': {},
    'contrapposto': { 'serious': 'warning' },
    's-curve': {},
    'three-quarter-turn': {},
    'sitting': {},
    'reclining': { 'serious': 'warning' },
};

// ===== Hand Pose ↔ Expression 충돌 =====
export const HAND_POSE_EXPRESSION_CONFLICTS: Record<PortraitHandPose, Partial<Record<PortraitExpression, ConflictLevel>>> = {
    'natural-relaxed': { 'intense': 'warning' },
    'editorial-hands': { 'neutral': 'warning', 'playful': 'warning' },
    'pocket-hands': {},
    'crossed-arms': { 'bright-smile': 'critical', 'playful': 'critical', 'sensual': 'critical' },
    'framing-face': {},
    'hair-touch': { 'neutral': 'warning', 'serious': 'warning' },
};

// ===== Expression ↔ Gaze 충돌 =====
export const EXPRESSION_GAZE_CONFLICTS: Record<PortraitExpression, Partial<Record<PortraitGaze, ConflictLevel>>> = {
    'natural-smile': {},
    'bright-smile': { 'looking-down': 'critical', 'eyes-closed': 'critical' },
    'subtle-smile': {},
    'neutral': { 'eyes-closed': 'warning' },
    'serious': { 'looking-up': 'warning', 'eyes-closed': 'warning' },
    'pensive': { 'direct-eye-contact': 'warning' },
    'mysterious': { 'looking-up': 'warning', 'looking-down': 'warning', 'eyes-closed': 'warning' },
    'intense': {},
    'playful': { 'looking-down': 'warning', 'eyes-closed': 'critical' },
    'sensual': { 'looking-up': 'critical' },
};

// ===== Body Pose ↔ Gaze 충돌 =====
export const BODY_POSE_GAZE_CONFLICTS: Record<PortraitBodyPose, Partial<Record<PortraitGaze, ConflictLevel>>> = {
    'straight': {},
    'contrapposto': {},
    's-curve': {},
    'three-quarter-turn': {},
    'sitting': {},
    'reclining': { 'over-shoulder': 'critical' },
};

// ===== Hand Pose ↔ Gaze 충돌 =====
export const HAND_POSE_GAZE_CONFLICTS: Record<PortraitHandPose, Partial<Record<PortraitGaze, ConflictLevel>>> = {
    'natural-relaxed': {},
    'editorial-hands': {},
    'pocket-hands': {},
    'crossed-arms': { 'looking-down': 'warning' },
    'framing-face': {},
    'hair-touch': { 'eyes-closed': 'warning' },
};

// ===== Camera Angle ↔ Gaze 충돌 =====
// 앵글 키: eye_level, high_angle, low_angle, birds_eye, worms_eye, drone
export const ANGLE_GAZE_CONFLICTS: Record<string, Partial<Record<PortraitGaze, ConflictLevel>>> = {
    'eye_level': {},  // 아이레벨은 모두 자연스러움
    'high_angle': {
        'looking-down': 'warning',  // 정수리만 보임, 시선 안 보임
    },
    'low_angle': {
        'looking-up': 'warning',  // 턱+눈동자 과장, 부자연스러움
    },
    'birds_eye': {
        'direct-eye-contact': 'warning',  // 과도한 고개 젖힘
        'looking-up': 'critical',  // 극단적 부자연스러움
    },
    'worms_eye': {
        'looking-down': 'warning',  // 극단적 부자연스러움
        'direct-eye-contact': 'warning',  // 과도한 고개 숙임
    },
    'drone': {
        'direct-eye-contact': 'warning',  // 과도한 고개 젖힘
        'looking-up': 'critical',  // 드론과 동일
    },
};

// ===== 구도 ↔ 앵글 충돌 =====
// 레벨: 'disabled' | 'critical' | 'warning' | 'ok' | 'recommend'
export type FramingAngleConflictLevel = 'disabled' | 'critical' | 'warning' | 'ok' | 'recommend';

// NOTE: FRAMING_ANGLE_CONFLICTS는 lib/rules/conflict-rules.ts로 마이그레이션됨 (2026-01-01)

// ===== 구성(Composition Rule) ↔ 앵글 충돌 =====
// 구성 규칙별 앵글 호환성
export const COMPOSITION_ANGLE_CONFLICTS: Record<string, Record<string, FramingAngleConflictLevel>> = {
    'rule_of_thirds': {
        eye_level: 'recommend',  // 삼분법은 아이레벨에서 계산 용이
        high_angle: 'ok',
        low_angle: 'ok',
        birds_eye: 'warning',  // 극단적 앵글에서 1/3 배치 어색
        worms_eye: 'warning',
    },
    'golden_ratio': {
        eye_level: 'recommend',  // 황금비는 아이레벨에서 정교한 배치 가능
        high_angle: 'ok',
        low_angle: 'ok',
        birds_eye: 'warning',
        worms_eye: 'warning',
    },
    'center': {
        eye_level: 'recommend',  // 중앙 구도는 아이레벨이 가장 안정적
        high_angle: 'ok',
        low_angle: 'ok',
        birds_eye: 'ok',  // 중앙 배치는 앵글에 덜 민감
        worms_eye: 'ok',
    },
    'leading_lines': {
        eye_level: 'ok',
        high_angle: 'ok',
        low_angle: 'ok',
        birds_eye: 'recommend',  // 버즈아이에서 배경 라인이 잘 보임
        worms_eye: 'warning',  // 바닥 라인 안 보임
    },
    'symmetry': {
        eye_level: 'recommend',  // 대칭은 아이레벨에서 가장 정확
        high_angle: 'ok',
        low_angle: 'critical',  // 로우앵글은 대칭 깨짐 (상하 불균형)
        birds_eye: 'ok',
        worms_eye: 'critical',  // 대칭 완전 깨짐
    },
};

// ===== 구성(Composition Rule) ↔ 구도 충돌 =====
// 구성 규칙별 구도 호환성
export const COMPOSITION_FRAMING_CONFLICTS: Record<string, Record<PortraitFraming, FramingAngleConflictLevel>> = {
    'rule_of_thirds': {
        'extreme-close-up': 'ok',
        'close-up': 'recommend',  // 얼굴 1/3 배치에 효과적
        'bust-shot': 'recommend',
        'waist-shot': 'ok',
        'half-shot': 'ok',
        'three-quarter-shot': 'ok',
        'full-shot': 'ok',
        'long-shot': 'ok',
    },
    'golden_ratio': {
        'extreme-close-up': 'ok',
        'close-up': 'ok',
        'bust-shot': 'recommend',  // 황금비 배치에 적합
        'waist-shot': 'recommend',
        'half-shot': 'ok',
        'three-quarter-shot': 'ok',
        'full-shot': 'ok',
        'long-shot': 'ok',
    },
    'center': {
        'extreme-close-up': 'recommend',  // 클로즈업은 중앙 배치 자연스러움
        'close-up': 'ok',
        'bust-shot': 'ok',
        'waist-shot': 'ok',
        'half-shot': 'ok',
        'three-quarter-shot': 'warning',  // 넓은 프레임에 중앙 배치 어색
        'full-shot': 'warning',
        'long-shot': 'warning',  // 작은 피사체가 넓은 프레임 중앙에 어색
    },
    'leading_lines': {
        'extreme-close-up': 'critical',  // 배경이 거의 안 보여 시선유도 불가
        'close-up': 'warning',  // 배경 적음
        'bust-shot': 'ok',
        'waist-shot': 'ok',
        'half-shot': 'ok',
        'three-quarter-shot': 'ok',
        'full-shot': 'ok',
        'long-shot': 'recommend',  // 환경이 많이 보여 시선유도 극대화
    },
    'symmetry': {
        'extreme-close-up': 'ok',
        'close-up': 'ok',
        'bust-shot': 'ok',
        'waist-shot': 'recommend',  // 대칭 구도에 적합한 중간 크기
        'half-shot': 'ok',
        'three-quarter-shot': 'ok',
        'full-shot': 'ok',
        'long-shot': 'ok',
    },
};
