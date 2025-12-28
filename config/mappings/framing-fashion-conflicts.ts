// config/mappings/framing-fashion-conflicts.ts
// 구도(Framing)와 패션 아이템 간의 충돌/가시성 규칙

import type { PortraitFraming } from '@/types';
import type { ConflictLevel } from './portrait-composition';

// ===== 악세서리 카테고리 분류 =====
export type AccessoryCategory = 'headwear' | 'eyewear' | 'neckwear' | 'earwear' | 'wristwear' | 'other';

export const ACCESSORY_CATEGORIES: Record<string, AccessoryCategory> = {
    // 헤드웨어 (머리에 착용)
    'baseball-cap': 'headwear',
    'beanie': 'headwear',
    'fedora': 'headwear',
    'straw-hat': 'headwear',
    'beret': 'headwear',
    'veil': 'headwear',
    'tiara': 'headwear',
    'binyeo': 'headwear',
    // 아이웨어
    'sunglasses': 'eyewear',
    'glasses': 'eyewear',
    // 귀 착용
    'earrings': 'earwear',
    'hoop-earrings': 'earwear',
    // 목 착용
    'gold-chain': 'neckwear',
    'pearl-necklace': 'neckwear',
    'choker': 'neckwear',
    'necktie': 'neckwear',
    'bow-tie': 'neckwear',
    'scarf': 'neckwear',
    // 손목 착용
    'watch': 'wristwear',
    'bracelet': 'wristwear',
    // 기타
    'belt': 'other',
    'bag': 'other',
};

// ===== 구도별 패션 아이템 가시성 규칙 =====
// visible: 보임 (충돌 없음)
// partial: 일부만 보임 (warning)
// hidden: 안 보임 (critical - 설정해도 의미 없음)

export interface FramingVisibility {
    topWear: 'visible' | 'partial' | 'hidden';
    bottomWear: 'visible' | 'partial' | 'hidden';
    footwear: 'visible' | 'partial' | 'hidden';
    accessoryCategories: {
        headwear: 'visible' | 'partial' | 'hidden';
        eyewear: 'visible' | 'partial' | 'hidden';
        neckwear: 'visible' | 'partial' | 'hidden';
        earwear: 'visible' | 'partial' | 'hidden';
        wristwear: 'visible' | 'partial' | 'hidden';
        other: 'visible' | 'partial' | 'hidden';
    };
}

export const FRAMING_VISIBILITY: Record<PortraitFraming, FramingVisibility> = {
    // 극도로 가까운 샷: 얼굴만 보임
    'extreme-close-up': {
        topWear: 'hidden',
        bottomWear: 'hidden',
        footwear: 'hidden',
        accessoryCategories: {
            headwear: 'hidden',      // 너무 가까워서 모자 잘림
            eyewear: 'visible',      // 안경/선글라스 보임
            neckwear: 'hidden',      // 목걸이 안 보임
            earwear: 'partial',      // 귀걸이 일부 보임
            wristwear: 'hidden',
            other: 'hidden',
        },
    },
    // 클로즈업: 얼굴~어깨 상단
    'close-up': {
        topWear: 'partial',          // 목 라인만 보임
        bottomWear: 'hidden',
        footwear: 'hidden',
        accessoryCategories: {
            headwear: 'partial',     // 모자 일부 잘릴 수 있음
            eyewear: 'visible',
            neckwear: 'visible',     // 목걸이 보임
            earwear: 'visible',
            wristwear: 'hidden',
            other: 'hidden',
        },
    },
    // 바스트샷: 상반신
    'bust-shot': {
        topWear: 'visible',
        bottomWear: 'hidden',
        footwear: 'hidden',
        accessoryCategories: {
            headwear: 'visible',
            eyewear: 'visible',
            neckwear: 'visible',
            earwear: 'visible',
            wristwear: 'hidden',
            other: 'hidden',
        },
    },
    // 웨이스트샷: 허리까지
    'waist-shot': {
        topWear: 'visible',
        bottomWear: 'partial',       // 허리 라인만
        footwear: 'hidden',
        accessoryCategories: {
            headwear: 'visible',
            eyewear: 'visible',
            neckwear: 'visible',
            earwear: 'visible',
            wristwear: 'partial',    // 손 위치에 따라
            other: 'partial',        // 벨트 보일 수 있음
        },
    },
    // 하프샷: 무릎 위까지
    'half-shot': {
        topWear: 'visible',
        bottomWear: 'visible',
        footwear: 'hidden',
        accessoryCategories: {
            headwear: 'visible',
            eyewear: 'visible',
            neckwear: 'visible',
            earwear: 'visible',
            wristwear: 'visible',
            other: 'visible',
        },
    },
    // 3/4샷: 무릎~종아리까지
    'three-quarter-shot': {
        topWear: 'visible',
        bottomWear: 'visible',
        footwear: 'partial',         // 발 잘릴 수 있음
        accessoryCategories: {
            headwear: 'visible',
            eyewear: 'visible',
            neckwear: 'visible',
            earwear: 'visible',
            wristwear: 'visible',
            other: 'visible',
        },
    },
    // 풀샷: 전신
    'full-shot': {
        topWear: 'visible',
        bottomWear: 'visible',
        footwear: 'visible',
        accessoryCategories: {
            headwear: 'visible',
            eyewear: 'visible',
            neckwear: 'visible',
            earwear: 'visible',
            wristwear: 'visible',
            other: 'visible',
        },
    },
    // 롱샷: 전신 + 환경
    'long-shot': {
        topWear: 'visible',
        bottomWear: 'visible',
        footwear: 'visible',
        accessoryCategories: {
            headwear: 'visible',
            eyewear: 'partial',      // 너무 작아서 잘 안 보임
            neckwear: 'hidden',      // 작아서 안 보임
            earwear: 'hidden',       // 작아서 안 보임
            wristwear: 'hidden',
            other: 'partial',        // 가방 등은 보일 수 있음
        },
    },
};

// ===== 충돌 레벨 변환 =====
export function getVisibilityConflictLevel(visibility: 'visible' | 'partial' | 'hidden'): ConflictLevel {
    switch (visibility) {
        case 'visible': return 'ok';
        case 'partial': return 'warning';
        case 'hidden': return 'critical';
    }
}

// ===== 특정 구도에서 패션 아이템 충돌 체크 =====
export interface FashionConflictResult {
    field: 'bottomWear' | 'footwear' | 'accessory';
    level: ConflictLevel;
    reason: string;
}

export function checkFashionConflicts(
    framing: PortraitFraming,
    bottomWear: string,
    footwear: string,
    accessory: string
): FashionConflictResult[] {
    const visibility = FRAMING_VISIBILITY[framing];
    const results: FashionConflictResult[] = [];
    const framingLabel = getFramingLabel(framing);

    // 하의 체크
    if (bottomWear && bottomWear !== '') {
        const level = getVisibilityConflictLevel(visibility.bottomWear);
        if (level !== 'ok') {
            results.push({
                field: 'bottomWear',
                level,
                reason: level === 'critical'
                    ? `${framingLabel}에서는 하의가 보이지 않습니다`
                    : `${framingLabel}에서는 하의가 일부만 보입니다`,
            });
        }
    }

    // 신발 체크
    if (footwear && footwear !== '') {
        const level = getVisibilityConflictLevel(visibility.footwear);
        if (level !== 'ok') {
            results.push({
                field: 'footwear',
                level,
                reason: level === 'critical'
                    ? `${framingLabel}에서는 신발이 보이지 않습니다`
                    : `${framingLabel}에서는 신발이 일부만 보입니다`,
            });
        }
    }

    // 악세서리 체크
    if (accessory && accessory !== '') {
        const category = ACCESSORY_CATEGORIES[accessory] || 'other';
        const catVisibility = visibility.accessoryCategories[category];
        const level = getVisibilityConflictLevel(catVisibility);
        if (level !== 'ok') {
            const categoryLabel = getCategoryLabel(category);
            results.push({
                field: 'accessory',
                level,
                reason: level === 'critical'
                    ? `${framingLabel}에서는 ${categoryLabel}이(가) 보이지 않습니다`
                    : `${framingLabel}에서는 ${categoryLabel}이(가) 잘 안 보일 수 있습니다`,
            });
        }
    }

    return results;
}

// ===== 헬퍼 함수 =====
function getFramingLabel(framing: PortraitFraming): string {
    const labels: Record<PortraitFraming, string> = {
        'extreme-close-up': '익스트림 클로즈업',
        'close-up': '클로즈업',
        'bust-shot': '바스트샷',
        'waist-shot': '웨이스트샷',
        'half-shot': '하프샷',
        'three-quarter-shot': '3/4샷',
        'full-shot': '풀샷',
        'long-shot': '롱샷',
    };
    return labels[framing] || framing;
}

function getCategoryLabel(category: AccessoryCategory): string {
    const labels: Record<AccessoryCategory, string> = {
        'headwear': '모자류',
        'eyewear': '안경류',
        'neckwear': '목걸이류',
        'earwear': '귀걸이류',
        'wristwear': '손목 악세서리',
        'other': '악세서리',
    };
    return labels[category];
}
