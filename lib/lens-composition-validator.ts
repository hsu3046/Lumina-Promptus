// lib/lens-composition-validator.ts
// 렌즈-구도/앵글 충돌 감지 시스템

import { getLensById } from '@/config/mappings/lenses';
import type { Lens } from '@/types';

// ===== 타입 정의 =====
export type LensConflictLevel = 'disabled' | 'critical' | 'warning' | 'ok' | 'recommend';

export interface LensConflictReport {
    id: string;
    level: LensConflictLevel;
    message: string;
}

interface ConflictContext {
    framing: string;           // studioComposition
    angle: string;             // cameraAngle
    compositionRule: string;   // compositionRule
    focalMm: number;           // 렌즈 초점거리 (mm)
    category: Lens['category']; // 렌즈 카테고리
}

interface ConflictRule {
    id: string;
    level: LensConflictLevel;
    condition: (ctx: ConflictContext) => boolean;
    message: string;
}

// ===== 유틸리티: 초점거리 파싱 =====
export function parseFocalLength(focalLength: string): number {
    if (!focalLength) return 50;

    const zoomMatch = focalLength.match(/(\d+)-(\d+)mm/i);
    if (zoomMatch) {
        const min = parseInt(zoomMatch[1], 10);
        const max = parseInt(zoomMatch[2], 10);
        return Math.round((min + max) / 2);
    }

    const primeMatch = focalLength.match(/(\d+)mm/i);
    if (primeMatch) {
        return parseInt(primeMatch[1], 10);
    }

    return 50;
}

// ===== 구도 × 렌즈 카테고리 매칭 매트릭스 =====
type LensCategory = Lens['category'];
type FramingType = string;

// 매트릭스: framing → category → level
const FRAMING_LENS_MATRIX: Record<FramingType, Partial<Record<LensCategory, LensConflictLevel>>> = {
    'extreme-close-up': {
        ultra_wide: 'critical',
        wide: 'warning',
        standard: 'ok',
        medium_telephoto: 'recommend',
        telephoto: 'ok',
        macro: 'recommend',
    },
    'close-up': {
        ultra_wide: 'critical',
        wide: 'warning',
        standard: 'ok',
        medium_telephoto: 'recommend',
        telephoto: 'ok',
        macro: 'ok',
    },
    'bust-shot': {
        ultra_wide: 'warning',
        wide: 'ok',
        standard: 'recommend',
        medium_telephoto: 'recommend',
        telephoto: 'ok',
        macro: 'disabled',
    },
    'waist-shot': {
        ultra_wide: 'warning',
        wide: 'ok',
        standard: 'recommend',
        medium_telephoto: 'ok',
        telephoto: 'warning',
        macro: 'disabled',
    },
    'half-shot': {
        ultra_wide: 'ok',
        wide: 'recommend',
        standard: 'ok',
        medium_telephoto: 'ok',
        telephoto: 'warning',
        macro: 'disabled',
    },
    'three-quarter-shot': {
        ultra_wide: 'ok',
        wide: 'recommend',
        standard: 'ok',
        medium_telephoto: 'warning',
        telephoto: 'warning',
        macro: 'disabled',
    },
    'full-shot': {
        ultra_wide: 'recommend',
        wide: 'recommend',
        standard: 'ok',
        medium_telephoto: 'warning',
        telephoto: 'critical',
        macro: 'disabled',
    },
    'long-shot': {
        ultra_wide: 'recommend',
        wide: 'recommend',
        standard: 'ok',
        medium_telephoto: 'warning',
        telephoto: 'critical',
        macro: 'disabled',
    },
};

// ===== 추가 충돌 규칙 (앵글/구성규칙 관련) =====
const CONFLICT_RULES: ConflictRule[] = [
    // 앵글 관련
    {
        id: 'closeup-low',
        level: 'critical',
        condition: ({ framing, angle }) =>
            ['headshot', 'close-up', 'extreme-close-up'].includes(framing) && angle === 'low_angle',
        message: '콧구멍 강조: 클로즈업에 로우앵글은 턱이 거대해집니다',
    },
    {
        id: 'symmetry-tilted',
        level: 'critical',
        condition: ({ compositionRule, angle }) =>
            compositionRule === 'symmetry' &&
            ['low_angle', 'high_angle', 'worms_eye'].includes(angle),
        message: '대칭 파괴: 앵글이 기울면 수직선이 수렴합니다',
    },
    {
        id: 'drone-tele',
        level: 'warning',
        condition: ({ angle, category }) =>
            ['birds_eye', 'drone'].includes(angle) &&
            ['medium_telephoto', 'telephoto'].includes(category),
        message: '고도감 소실: 드론샷에 망원은 평면적입니다',
    },
    // 구성규칙 관련
    {
        id: 'golden-tele',
        level: 'warning',
        condition: ({ compositionRule, category }) =>
            compositionRule === 'golden_ratio' && category === 'telephoto',
        message: '피사계 심도: 황금비율 요소가 bokeh에 묻힙니다',
    },
    {
        id: 'leading-bust-tele',
        level: 'warning',
        condition: ({ compositionRule, framing, category }) =>
            compositionRule === 'leading_lines' &&
            ['bust-shot', 'headshot', 'close-up'].includes(framing) &&
            ['medium_telephoto', 'telephoto'].includes(category),
        message: '배경 소실: 리딩라인이 bokeh로 사라집니다',
    },
];

// ===== 메인 함수: 렌즈 상태 계산 =====
/**
 * 특정 렌즈의 현재 구도 설정에 대한 상태 반환
 */
export function getLensStatusForOption(
    framing: string,
    angle: string,
    compositionRule: string,
    lensId: string
): LensConflictReport {
    const lens = getLensById(lensId);
    if (!lens) return { id: 'unknown', level: 'ok', message: '' };

    const focalMm = parseFocalLength(lens.focalLength);
    const category = lens.category;

    // 1. 매트릭스에서 기본 레벨 조회
    const matrixLevel = FRAMING_LENS_MATRIX[framing]?.[category] ?? 'ok';

    // disabled면 바로 반환
    if (matrixLevel === 'disabled') {
        return { id: 'matrix-disabled', level: 'disabled', message: '이 구도에서 사용 불가' };
    }

    // 2. 추가 규칙 체크 (더 나쁜 레벨로 오버라이드)
    const context: ConflictContext = { framing, angle, compositionRule, focalMm, category };

    for (const rule of CONFLICT_RULES) {
        if (rule.condition(context)) {
            // disabled/critical은 무조건 반환
            if (rule.level === 'disabled' || rule.level === 'critical') {
                return { id: rule.id, level: rule.level, message: rule.message };
            }
            // warning은 recommend/ok보다 우선
            if (rule.level === 'warning' && (matrixLevel === 'recommend' || matrixLevel === 'ok')) {
                return { id: rule.id, level: 'warning', message: rule.message };
            }
        }
    }

    // 3. 매트릭스 레벨 반환
    const messages: Record<LensConflictLevel, string> = {
        recommend: '권장 조합',
        ok: '',
        warning: '비추천',
        critical: '결과물 심각하게 망가짐',
        disabled: '사용 불가',
    };

    return { id: 'matrix', level: matrixLevel, message: messages[matrixLevel] };
}

// 하위 호환: 기존 함수 유지
export function getLensConflictForOption(
    framing: string,
    angle: string,
    compositionRule: string,
    lensId: string
): LensConflictReport | null {
    const status = getLensStatusForOption(framing, angle, compositionRule, lensId);
    if (status.level === 'ok' || status.level === 'recommend') return null;
    return status;
}

