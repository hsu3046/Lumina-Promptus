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
    { value: 'half-shot', label: '하프샷', prompt: 'half shot portrait' },
    { value: 'three-quarter-shot', label: '3/4샷', prompt: 'three-quarter shot portrait' },
    { value: 'full-shot', label: '풀샷', prompt: 'full body shot' },
    { value: 'long-shot', label: '롱샷', prompt: 'long shot, environmental portrait' },
];

export const BODY_POSE_OPTIONS: { value: PortraitBodyPose; label: string; prompt: string }[] = [
    { value: 'straight', label: '스트레이트', prompt: 'straight frontal pose' },
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
    { value: 'sensual', label: '관능적', prompt: 'sensual expression' },
];

export const GAZE_OPTIONS: { value: PortraitGaze; label: string; prompt: string }[] = [
    { value: 'direct-eye-contact', label: '카메라 직시', prompt: 'direct eye contact with camera' },
    { value: 'off-camera', label: '카메라 밖', prompt: 'looking off-camera' },
    { value: 'looking-up', label: '위 응시', prompt: 'looking upward' },
    { value: 'looking-down', label: '아래 응시', prompt: 'looking downward' },
    { value: 'side-gaze', label: '옆 응시', prompt: 'side gaze' },
    { value: 'over-shoulder', label: '어깨 너머', prompt: 'looking over shoulder' },
    { value: 'eyes-closed', label: '눈 감음', prompt: 'eyes closed' },
    { value: 'half-closed-eyes', label: '반쯤 뜬 눈', prompt: 'half-closed eyes' },
];

// ===== 충돌 레벨 =====
export type ConflictLevel = 'disabled' | 'critical' | 'warning' | 'ok';

// ===== 구도 ↔ Body Pose 충돌 =====
export const FRAMING_BODY_POSE_CONFLICTS: Record<PortraitFraming, Partial<Record<PortraitBodyPose, ConflictLevel>>> = {
    'extreme-close-up': { 'contrapposto': 'critical', 's-curve': 'critical', 'sitting': 'critical', 'reclining': 'critical' },
    'close-up': { 'contrapposto': 'critical', 's-curve': 'critical', 'sitting': 'warning', 'reclining': 'warning' },
    'bust-shot': { 's-curve': 'critical', 'reclining': 'warning' },
    'waist-shot': { 's-curve': 'warning' },
    'half-shot': {},
    'three-quarter-shot': {},
    'full-shot': {},
    'long-shot': {},
};

// ===== 구도 ↔ Hand Pose 충돌 =====
export const FRAMING_HAND_POSE_CONFLICTS: Record<PortraitFraming, Partial<Record<PortraitHandPose, ConflictLevel>>> = {
    'extreme-close-up': { 'pocket-hands': 'critical', 'crossed-arms': 'critical' },
    'close-up': { 'pocket-hands': 'critical', 'crossed-arms': 'critical' },
    'bust-shot': { 'pocket-hands': 'critical', 'crossed-arms': 'warning' },
    'waist-shot': {},
    'half-shot': {},
    'three-quarter-shot': { 'editorial-hands': 'warning', 'framing-face': 'warning' },
    'full-shot': { 'editorial-hands': 'warning', 'framing-face': 'warning' },
    'long-shot': { 'editorial-hands': 'critical', 'framing-face': 'critical', 'hair-touch': 'warning' },
};

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

export const FRAMING_ANGLE_CONFLICTS: Record<PortraitFraming, Record<string, FramingAngleConflictLevel>> = {
    'extreme-close-up': {
        eye_level: 'recommend',
        high_angle: 'ok',
        low_angle: 'warning',  // 턱 과장
        birds_eye: 'disabled',  // 정수리만 보임
        worms_eye: 'disabled',  // 극단적 왜곡
        drone: 'disabled',  // 드론으로 클로즈업 불가
    },
    'close-up': {
        eye_level: 'recommend',
        high_angle: 'ok',
        low_angle: 'warning',
        birds_eye: 'critical',  // 정수리만 보임
        worms_eye: 'critical',  // 극단적 턱 왜곡
        drone: 'disabled',
    },
    'bust-shot': {
        eye_level: 'recommend',
        high_angle: 'ok',
        low_angle: 'ok',
        birds_eye: 'warning',  // 어색한 상반신
        worms_eye: 'warning',
        drone: 'disabled',
    },
    'waist-shot': {
        eye_level: 'recommend',
        high_angle: 'ok',
        low_angle: 'ok',
        birds_eye: 'warning',
        worms_eye: 'warning',
        drone: 'warning',  // 가능하지만 비추천
    },
    'half-shot': {
        eye_level: 'recommend',
        high_angle: 'ok',
        low_angle: 'ok',
        birds_eye: 'warning',
        worms_eye: 'warning',
        drone: 'warning',
    },
    'three-quarter-shot': {
        eye_level: 'ok',
        high_angle: 'ok',
        low_angle: 'recommend',  // 히어로 앵글
        birds_eye: 'ok',
        worms_eye: 'ok',
        drone: 'warning',
    },
    'full-shot': {
        eye_level: 'ok',
        high_angle: 'ok',
        low_angle: 'recommend',  // 히어로샷
        birds_eye: 'recommend',  // 환경+전신
        worms_eye: 'recommend',  // 웅장함
        drone: 'recommend',
    },
    'long-shot': {
        eye_level: 'ok',
        high_angle: 'ok',
        low_angle: 'recommend',
        birds_eye: 'recommend',
        worms_eye: 'recommend',
        drone: 'recommend',
    },
};
