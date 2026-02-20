// config/mappings/product-options.ts
// 제품 모드 옵션 정의

// ===== 제품 카테고리 =====
export const PRODUCT_CATEGORIES = [
    { value: 'cosmetics', label: '화장품/뷰티' },
    { value: 'food', label: '음식/음료' },
    { value: 'electronics', label: '전자기기' },
    { value: 'fashion', label: '패션 잡화' },
    { value: 'interior', label: '가구/인테리어' },
    { value: 'custom', label: '직접 입력' },
] as const;

// ===== 제품 재질 =====
export const PRODUCT_MATERIALS = [
    { value: 'glass', label: '유리/투명' },
    { value: 'metal', label: '금속' },
    { value: 'matte', label: '매트' },
    { value: 'glossy', label: '광택' },
    { value: 'fabric', label: '직물' },
    { value: 'leather', label: '가죽' },
    { value: 'ceramic', label: '세라믹' },
    { value: 'paper', label: '종이/패키징' },
    { value: 'food-organic', label: '유기물 (음식)' },
] as const;

// ===== 서페이스/백드롭 =====
export const PRODUCT_SURFACES = [
    { value: 'studio-white', label: '스튜디오 화이트' },
    { value: 'studio-black', label: '스튜디오 블랙' },
    { value: 'white-marble', label: '대리석 (흰색)' },
    { value: 'black-marble', label: '대리석 (검정)' },
    { value: 'wood', label: '원목 테이블' },
    { value: 'concrete', label: '콘크리트' },
    { value: 'linen', label: '린넨 패브릭' },
    { value: 'acrylic', label: '아크릴/유리' },
    { value: 'gradient', label: '그라데이션 배경' },
    { value: 'natural', label: '자연 배경' },
] as const;

// ===== 제품 구도 =====
export const PRODUCT_SHOT_TYPES = [
    { value: 'hero', label: '히어로 샷', description: '45° 앵글, 제품 강조' },
    { value: 'flat-lay', label: '플랫레이', description: '탑다운 90°' },
    { value: 'eye-level', label: '아이레벨', description: '정면' },
    { value: 'low-angle', label: '로우앵글', description: '아래에서 위로' },
    { value: 'styled', label: '스타일링 샷', description: '소품과 함께' },
    { value: 'detail', label: '디테일 샷', description: '텍스처/로고 클로즈업' },
    { value: 'lifestyle', label: '라이프스타일', description: '사용 장면' },
] as const;

// ===== 서페이스 → 프롬프트 매핑 =====
export const SURFACE_PROMPT_MAP: Record<string, string> = {
    'studio-white': 'on a clean white studio background, seamless white backdrop',
    'studio-black': 'on a dark black studio background, seamless black backdrop',
    'white-marble': 'on a white marble surface with subtle gray veins',
    'black-marble': 'on a black marble surface with gold veins',
    'wood': 'on a natural wood table, warm wood grain texture',
    'concrete': 'on a raw concrete surface, industrial texture',
    'linen': 'on a soft linen fabric backdrop, natural texture',
    'acrylic': 'on a clear reflective acrylic surface, mirror-like reflection',
    'gradient': 'on a smooth gradient backdrop',
    'natural': 'in a natural outdoor setting with soft greenery',
};

// ===== 재질 → 프롬프트 매핑 =====
export const MATERIAL_PROMPT_MAP: Record<string, string> = {
    'glass': 'transparent glass material, light refraction, clear surface',
    'metal': 'metallic surface, reflective, brushed or polished finish',
    'matte': 'matte finish, non-reflective surface, soft texture',
    'glossy': 'glossy surface, high shine, reflective',
    'fabric': 'textile/fabric material, visible weave texture',
    'leather': 'leather material, rich texture, premium feel',
    'ceramic': 'ceramic surface, smooth glaze, subtle sheen',
    'paper': 'paper/cardboard packaging, printed graphics',
    'food-organic': 'organic food textures, fresh ingredients, natural colors',
};

// ===== 구도 → 프롬프트 매핑 =====
export const SHOT_TYPE_PROMPT_MAP: Record<string, string> = {
    'hero': 'hero shot, 3/4 angle (45 degrees), product as the main focal point',
    'flat-lay': 'flat lay composition, shot directly from above (90 degrees), top-down view',
    'eye-level': 'eye-level shot, straight-on front view',
    'low-angle': 'low-angle shot, looking slightly upward at the product, commanding presence',
    'styled': 'styled product shot with complementary props arranged around the product',
    'detail': 'extreme close-up detail shot showcasing texture, logo, or material quality',
    'lifestyle': 'lifestyle product shot, the product shown in a natural use case scenario',
};

// ===== 카테고리 → 프롬프트 힌트 =====
export const CATEGORY_PROMPT_MAP: Record<string, string> = {
    'cosmetics': 'beauty product, cosmetic packaging',
    'food': 'food photography, appetizing presentation',
    'electronics': 'tech product, clean modern design',
    'fashion': 'fashion accessory, luxury feel',
    'interior': 'interior design product, home décor',
    'custom': '',
};
