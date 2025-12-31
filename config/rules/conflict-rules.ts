// config/rules/conflict-rules.ts
// 충돌 규칙 중앙 관리

// ===== 타입 정의 =====

export type Restriction = 'hide' | 'disabled' | 'none';

export interface ConflictRule {
    restriction: Restriction;
    source: {
        field: string;
        values: string[];
    };
    target: {
        field: string;
        affected: string[];
    };
}

// ===== 스튜디오 모드 규칙 =====

export const STUDIO_CONFLICT_RULES: ConflictRule[] = [
    // === 구도-앵글 충돌 ===

    // 클로즈업/익스트림 클로즈업에서 버즈아이/웜즈아이/하이앵글/로우앵글 불가
    {
        restriction: 'disabled',
        source: { field: 'framing', values: ['close-up', 'extreme-close-up'] },
        target: { field: 'angle', affected: ['birds_eye', 'worms_eye', 'high_angle', 'low_angle'] },
    },

    // 버스트샷에서 버즈아이/웜즈아이 불가
    {
        restriction: 'disabled',
        source: { field: 'framing', values: ['bust-shot'] },
        target: { field: 'angle', affected: ['birds_eye', 'worms_eye'] },
    },

    // === 구도-포즈 충돌 ===

    // 클로즈업에서 전신 포즈 불가 (sitting, reclining)
    {
        restriction: 'disabled',
        source: { field: 'framing', values: ['close-up', 'extreme-close-up'] },
        target: { field: 'bodyPose', affected: ['sitting', 'reclining'] },
    },

    // 버스트샷에서 sitting/reclining 불가
    {
        restriction: 'disabled',
        source: { field: 'framing', values: ['bust-shot'] },
        target: { field: 'bodyPose', affected: ['sitting', 'reclining'] },
    },

    // === 구도-핸드 포즈 충돌 ===

    // 클로즈업에서 pocket-hands, crossed-arms 불가 (손 프레임 밖)
    {
        restriction: 'disabled',
        source: { field: 'framing', values: ['close-up', 'extreme-close-up'] },
        target: { field: 'handPose', affected: ['pocket-hands', 'crossed-arms'] },
    },

    // 바스트샷에서 pocket-hands 불가
    {
        restriction: 'disabled',
        source: { field: 'framing', values: ['bust-shot'] },
        target: { field: 'handPose', affected: ['pocket-hands'] },
    },

    // === 패션 visibility ===

    // 클로즈업~웨이스트샷: 하의 숨김
    {
        restriction: 'disabled',
        source: { field: 'framing', values: ['extreme-close-up', 'close-up', 'bust-shot', 'waist-shot'] },
        target: { field: 'bottomWear', affected: ['*'] },
    },

    // 클로즈업~니샷: 신발 숨김 (니샷도 포함)
    {
        restriction: 'disabled',
        source: { field: 'framing', values: ['extreme-close-up', 'close-up', 'bust-shot', 'waist-shot', 'half-shot', 'three-quarter-shot'] },
        target: { field: 'footwear', affected: ['*'] },
    },

    // === 라이팅 충돌 ===
    // (라이팅 충돌은 legacy-adapter.ts에서 처리)

    // === 구도-렌즈 화각 충돌 ===

    // 클로즈업에서 초광각(10~24mm) 사용 시 왜곡 발생 (경고)
    {
        restriction: 'none',
        source: { field: 'framing', values: ['close-up', 'extreme-close-up'] },
        target: { field: 'focalLength', affected: ['ultra-wide', 'wide'] },
    },

    // 풀샷/롱샷에서 초망원(200mm+) 사용 시 압축 과도 (경고)
    {
        restriction: 'none',
        source: { field: 'framing', values: ['full-shot', 'long-shot'] },
        target: { field: 'focalLength', affected: ['super-telephoto'] },
    },

    // 클로즈업에서 어안렌즈 사용 불가 (disabled)
    {
        restriction: 'disabled',
        source: { field: 'framing', values: ['close-up', 'extreme-close-up', 'bust-shot'] },
        target: { field: 'focalLength', affected: ['fisheye'] },
    },
];

// ===== 풍경 모드 규칙 =====

export const LANDSCAPE_CONFLICT_RULES: ConflictRule[] = [
    // 드론 높이에서 일반 카메라/렌즈 사용 불가
    {
        restriction: 'disabled',
        source: { field: 'height', values: ['drone'] },
        target: { field: 'cameraBody', affected: ['*'] },
    },
    {
        restriction: 'disabled',
        source: { field: 'height', values: ['drone'] },
        target: { field: 'lens', affected: ['*'] },
    },

    // 시간대-분위기 충돌 (밤 + 빛내림)
    {
        restriction: 'disabled',
        source: { field: 'time', values: ['night', 'late-night'] },
        target: { field: 'atmosphere', affected: ['rays'] },
    },

    // 날씨-분위기 충돌 (비/폭우 + 박무/연무/빛내림)
    {
        restriction: 'disabled',
        source: { field: 'weather', values: ['rainy', 'heavy-rain'] },
        target: { field: 'atmosphere', affected: ['mist', 'haze', 'rays'] },
    },
];

// ===== 스냅 모드 규칙 =====

export const SNAP_CONFLICT_RULES: ConflictRule[] = [
    // === 동반자-감정 충돌 ===

    // 가족/친구/연인과 + 쓸쓸한/우울한 (모순)
    {
        restriction: 'none',
        source: { field: 'companion', values: ['with-family', 'with-friend', 'with-lover'] },
        target: { field: 'mood', affected: ['lonely', 'melancholic'] },
    },

    // === 동반자-방식 충돌 ===

    // 가족/친구/연인과 + 몰래 (모순)
    {
        restriction: 'none',
        source: { field: 'companion', values: ['with-family', 'with-friend', 'with-lover'] },
        target: { field: 'manner', affected: ['secretly'] },
    },

    // 홀로 + 대화하는 (불가능)
    {
        restriction: 'disabled',
        source: { field: 'companion', values: ['alone'] },
        target: { field: 'action', affected: ['talking'] },
    },

    // === 피사체-행동 충돌 ===

    // 동물/탈것/사물은 대화/일하기/먹기 불가
    {
        restriction: 'disabled',
        source: { field: 'subjectCategory', values: ['animal', 'vehicle', 'object'] },
        target: { field: 'action', affected: ['talking', 'working', 'eating'] },
    },

    // 탈것/사물은 뛰기/앉기/낮잠 불가
    {
        restriction: 'disabled',
        source: { field: 'subjectCategory', values: ['vehicle', 'object'] },
        target: { field: 'action', affected: ['running', 'sitting', 'napping', 'resting'] },
    },

    // === 방식-감정 충돌 ===

    // 급하게 + 평화로운/느긋한 (모순)
    {
        restriction: 'none',
        source: { field: 'manner', values: ['hurriedly'] },
        target: { field: 'mood', affected: ['peaceful'] },
    },

    // 느긋하게 + 분주한/긴장된 (모순)
    {
        restriction: 'none',
        source: { field: 'manner', values: ['leisurely'] },
        target: { field: 'mood', affected: ['busy', 'tense'] },
    },

    // === 장소-분위기 충돌 ===

    // 시장/도심거리 + 신비로운 (어색)
    {
        restriction: 'none',
        source: { field: 'location', values: ['market', 'downtown'] },
        target: { field: 'mood', affected: ['mysterious'] },
    },
];

