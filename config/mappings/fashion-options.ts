import {
    TShirtIcon,
    HoodieIcon,
    Shirt01Icon,
    Dress01Icon,
    LongSleeveShirtIcon,
    VestIcon,
    SleevelessIcon,
    JoggerPantsIcon,
    ShortsPantsIcon,
    Dress03Icon,
} from '@hugeicons/core-free-icons';
import type { IconSvgElement } from '@hugeicons/react';

// 성별 태그 타입
export type GenderTag = 'male' | 'female' | 'unisex';

// ===== 상의 (Top Wear) =====
export const TOP_WEAR_OPTIONS = [
    { value: '', label: '선택 안함', prompt: '', gender: 'unisex' as GenderTag },
    // 캐주얼
    { value: 'white-tshirt', label: '흰 티셔츠', prompt: 'white t-shirt', gender: 'unisex' as GenderTag },
    { value: 'black-tshirt', label: '검은 티셔츠', prompt: 'black t-shirt', gender: 'unisex' as GenderTag },
    { value: 'graphic-tee', label: '그래픽 티', prompt: 'graphic printed t-shirt', gender: 'unisex' as GenderTag },
    { value: 'hoodie', label: '후디', prompt: 'casual hoodie', gender: 'unisex' as GenderTag },
    { value: 'sweater', label: '스웨터', prompt: 'cozy knit sweater', gender: 'unisex' as GenderTag },
    { value: 'cardigan', label: '가디건', prompt: 'soft cardigan', gender: 'unisex' as GenderTag },
    // 정장/포멀
    { value: 'dress-shirt', label: '드레스 셔츠', prompt: 'crisp dress shirt', gender: 'unisex' as GenderTag },
    { value: 'suit-jacket', label: '수트 재킷', prompt: 'tailored suit jacket', gender: 'male' as GenderTag },
    { value: 'blazer', label: '블레이저', prompt: 'smart blazer', gender: 'unisex' as GenderTag },
    { value: 'tuxedo', label: '턱시도', prompt: 'black tuxedo jacket', gender: 'male' as GenderTag },
    // 드레스
    { value: 'casual-dress', label: '캐주얼 드레스', prompt: 'casual everyday dress', gender: 'female' as GenderTag },
    { value: 'cocktail-dress', label: '칵테일 드레스', prompt: 'elegant cocktail dress', gender: 'female' as GenderTag },
    { value: 'evening-gown', label: '이브닝 가운', prompt: 'luxurious evening gown', gender: 'female' as GenderTag },
    { value: 'wedding-dress', label: '웨딩 드레스', prompt: 'white wedding gown with lace details', gender: 'female' as GenderTag },
    // 아웃웨어
    { value: 'leather-jacket', label: '가죽 재킷', prompt: 'leather jacket', gender: 'unisex' as GenderTag },
    { value: 'denim-jacket', label: '데님 재킷', prompt: 'denim jacket', gender: 'unisex' as GenderTag },
    { value: 'trench-coat', label: '트렌치 코트', prompt: 'classic trench coat', gender: 'unisex' as GenderTag },
    { value: 'wool-coat', label: '울 코트', prompt: 'warm wool coat', gender: 'unisex' as GenderTag },
    { value: 'puffer-jacket', label: '패딩 재킷', prompt: 'puffer down jacket', gender: 'unisex' as GenderTag },
    // 스포츠/캐주얼
    { value: 'tank-top', label: '탱크탑', prompt: 'athletic tank top', gender: 'unisex' as GenderTag },
    { value: 'crop-top', label: '크롭탑', prompt: 'trendy crop top', gender: 'female' as GenderTag },
    { value: 'polo-shirt', label: '폴로셔츠', prompt: 'polo shirt', gender: 'unisex' as GenderTag },
    // 전통
    { value: 'hanbok-jeogori', label: '한복 저고리', prompt: 'traditional Korean hanbok jeogori', gender: 'unisex' as GenderTag },
    // 기타
    { value: 'turtleneck', label: '터틀넥', prompt: 'slim turtleneck', gender: 'unisex' as GenderTag },
    { value: 'blouse', label: '블라우스', prompt: 'elegant blouse', gender: 'female' as GenderTag },
] as const;

// ===== 하의 (Bottom Wear) =====
export const BOTTOM_WEAR_OPTIONS = [
    { value: '', label: '선택 안함', prompt: '', gender: 'unisex' as GenderTag },
    // 바지
    { value: 'blue-jeans', label: '청바지', prompt: 'blue jeans', gender: 'unisex' as GenderTag },
    { value: 'black-jeans', label: '검은 청바지', prompt: 'black jeans', gender: 'unisex' as GenderTag },
    { value: 'skinny-jeans', label: '스키니진', prompt: 'skinny jeans', gender: 'unisex' as GenderTag },
    { value: 'baggy-jeans', label: '배기진', prompt: 'baggy loose jeans', gender: 'unisex' as GenderTag },
    { value: 'chinos', label: '치노 팬츠', prompt: 'casual chino pants', gender: 'unisex' as GenderTag },
    { value: 'dress-pants', label: '드레스 팬츠', prompt: 'tailored dress pants', gender: 'unisex' as GenderTag },
    { value: 'cargo-pants', label: '카고 팬츠', prompt: 'utility cargo pants', gender: 'unisex' as GenderTag },
    { value: 'joggers', label: '조거 팬츠', prompt: 'comfortable jogger pants', gender: 'unisex' as GenderTag },
    { value: 'yoga-pants', label: '요가 팬츠', prompt: 'stretchy yoga pants', gender: 'female' as GenderTag },
    { value: 'shorts', label: '반바지', prompt: 'casual shorts', gender: 'unisex' as GenderTag },
    // 스커트
    { value: 'mini-skirt', label: '미니 스커트', prompt: 'mini skirt', gender: 'female' as GenderTag },
    { value: 'midi-skirt', label: '미디 스커트', prompt: 'midi skirt', gender: 'female' as GenderTag },
    { value: 'maxi-skirt', label: '맥시 스커트', prompt: 'flowing maxi skirt', gender: 'female' as GenderTag },
    { value: 'pleated-skirt', label: '플리츠 스커트', prompt: 'pleated skirt', gender: 'female' as GenderTag },
    { value: 'pencil-skirt', label: '펜슬 스커트', prompt: 'fitted pencil skirt', gender: 'female' as GenderTag },
    // 전통
    { value: 'hanbok-chima', label: '한복 치마', prompt: 'traditional Korean hanbok chima skirt', gender: 'female' as GenderTag },
    // 기타
    { value: 'leggings', label: '레깅스', prompt: 'tight leggings', gender: 'female' as GenderTag },
    { value: 'tuxedo-pants', label: '턱시도 팬츠', prompt: 'black tuxedo pants', gender: 'male' as GenderTag },
] as const;

// ===== 신발 (Footwear) =====
export const FOOTWEAR_OPTIONS = [
    { value: '', label: '선택 안함', prompt: '', gender: 'unisex' as GenderTag },
    // 스니커즈
    { value: 'white-sneakers', label: '흰 스니커즈', prompt: 'white sneakers', gender: 'unisex' as GenderTag },
    { value: 'black-sneakers', label: '검은 스니커즈', prompt: 'black sneakers', gender: 'unisex' as GenderTag },
    { value: 'high-tops', label: '하이탑', prompt: 'high-top sneakers', gender: 'unisex' as GenderTag },
    { value: 'running-shoes', label: '러닝화', prompt: 'running shoes', gender: 'unisex' as GenderTag },
    // 드레스 슈즈
    { value: 'loafers', label: '로퍼', prompt: 'leather loafers', gender: 'unisex' as GenderTag },
    { value: 'oxford-shoes', label: '옥스포드', prompt: 'oxford dress shoes', gender: 'male' as GenderTag },
    { value: 'leather-shoes', label: '가죽 구두', prompt: 'polished leather dress shoes', gender: 'male' as GenderTag },
    { value: 'patent-leather', label: '에나멜 구두', prompt: 'patent leather shoes', gender: 'male' as GenderTag },
    // 힐
    { value: 'stiletto-heels', label: '스틸레토 힐', prompt: 'stiletto high heels', gender: 'female' as GenderTag },
    { value: 'pumps', label: '펌프스', prompt: 'classic pumps', gender: 'female' as GenderTag },
    { value: 'wedge-heels', label: '웨지힐', prompt: 'wedge heels', gender: 'female' as GenderTag },
    { value: 'white-heels', label: '흰 힐', prompt: 'white high heels', gender: 'female' as GenderTag },
    // 부츠
    { value: 'ankle-boots', label: '앵클 부츠', prompt: 'ankle boots', gender: 'unisex' as GenderTag },
    { value: 'combat-boots', label: '컴뱃 부츠', prompt: 'combat boots', gender: 'unisex' as GenderTag },
    { value: 'knee-boots', label: '니하이 부츠', prompt: 'knee-high boots', gender: 'female' as GenderTag },
    { value: 'chelsea-boots', label: '첼시 부츠', prompt: 'chelsea boots', gender: 'unisex' as GenderTag },
    // 샌들/슬리퍼
    { value: 'sandals', label: '샌들', prompt: 'casual sandals', gender: 'unisex' as GenderTag },
    { value: 'flip-flops', label: '플립플롭', prompt: 'flip flops', gender: 'unisex' as GenderTag },
    { value: 'slippers', label: '슬리퍼', prompt: 'comfortable slippers', gender: 'unisex' as GenderTag },
    // 전통
    { value: 'gomusin', label: '고무신', prompt: 'traditional Korean gomusin', gender: 'unisex' as GenderTag },
    // 특수
    { value: 'mary-janes', label: '메리 제인', prompt: 'mary jane shoes', gender: 'female' as GenderTag },
    { value: 'platform-shoes', label: '플랫폼 슈즈', prompt: 'platform shoes', gender: 'female' as GenderTag },
    { value: 'barefoot', label: '맨발', prompt: 'barefoot', gender: 'unisex' as GenderTag },
] as const;

// ===== 악세서리1 (얼굴/머리 - 상호 배타) =====
export const ACCESSORY1_OPTIONS = [
    { value: '', label: '선택 안함', prompt: '', gender: 'unisex' as GenderTag },
    // 헤드웨어
    { value: 'baseball-cap', label: '야구 모자', prompt: 'baseball cap', gender: 'unisex' as GenderTag },
    { value: 'beanie', label: '비니', prompt: 'knit beanie', gender: 'unisex' as GenderTag },
    { value: 'fedora', label: '페도라', prompt: 'fedora hat', gender: 'unisex' as GenderTag },
    { value: 'straw-hat', label: '밀짚모자', prompt: 'straw sun hat', gender: 'unisex' as GenderTag },
    { value: 'beret', label: '베레모', prompt: 'beret', gender: 'unisex' as GenderTag },
    // 아이웨어 (선글라스 vs 안경 - 한 가지만)
    { value: 'sunglasses', label: '선글라스', prompt: 'stylish sunglasses', gender: 'unisex' as GenderTag },
    { value: 'glasses', label: '안경', prompt: 'eyeglasses', gender: 'unisex' as GenderTag },
    // 전통/웨딩
    { value: 'binyeo', label: '비녀', prompt: 'traditional Korean binyeo hairpin', gender: 'female' as GenderTag },
    { value: 'veil', label: '베일', prompt: 'wedding veil', gender: 'female' as GenderTag },
    { value: 'tiara', label: '티아라', prompt: 'sparkling tiara', gender: 'female' as GenderTag },
] as const;

// ===== 악세서리2 (장신구/기타 - 중복 가능) =====
export const ACCESSORY2_OPTIONS = [
    { value: '', label: '선택 안함', prompt: '', gender: 'unisex' as GenderTag },
    // 목걸이
    { value: 'gold-chain', label: '골드 체인', prompt: 'gold chain necklace', gender: 'unisex' as GenderTag },
    { value: 'pearl-necklace', label: '진주 목걸이', prompt: 'pearl necklace', gender: 'female' as GenderTag },
    { value: 'choker', label: '초커', prompt: 'choker necklace', gender: 'female' as GenderTag },
    // 귀걸이
    { value: 'earrings', label: '귀걸이', prompt: 'elegant earrings', gender: 'female' as GenderTag },
    { value: 'hoop-earrings', label: '후프 귀걸이', prompt: 'hoop earrings', gender: 'female' as GenderTag },
    // 넥웨어
    { value: 'necktie', label: '넥타이', prompt: 'silk necktie', gender: 'male' as GenderTag },
    { value: 'bow-tie', label: '보타이', prompt: 'bow tie', gender: 'male' as GenderTag },
    { value: 'scarf', label: '스카프', prompt: 'silk scarf', gender: 'unisex' as GenderTag },
    // 팔/손목
    { value: 'watch', label: '시계', prompt: 'luxury wristwatch', gender: 'unisex' as GenderTag },
    { value: 'bracelet', label: '팔찌', prompt: 'bracelet', gender: 'unisex' as GenderTag },
    // 기타
    { value: 'belt', label: '벨트', prompt: 'leather belt', gender: 'unisex' as GenderTag },
    { value: 'bag', label: '가방', prompt: 'designer handbag', gender: 'female' as GenderTag },
] as const;

// 하위 호환용 (기존 코드가 참조할 경우)
export const ACCESSORY_OPTIONS = ACCESSORY1_OPTIONS;

// 타입 추출
export type TopWearValue = typeof TOP_WEAR_OPTIONS[number]['value'];
export type BottomWearValue = typeof BOTTOM_WEAR_OPTIONS[number]['value'];
export type FootwearValue = typeof FOOTWEAR_OPTIONS[number]['value'];
export type Accessory1Value = typeof ACCESSORY1_OPTIONS[number]['value'];
export type Accessory2Value = typeof ACCESSORY2_OPTIONS[number]['value'];
export type AccessoryValue = Accessory1Value; // 하위 호환

// ===== 그룹화된 상의 옵션 =====
export const TOP_WEAR_GROUPS = [
    {
        label: '캐주얼',
        options: [
            { value: 'white-tshirt', label: '흰 티셔츠', icon: TShirtIcon },
            { value: 'black-tshirt', label: '검은 티셔츠', icon: TShirtIcon },
            { value: 'graphic-tee', label: '그래픽 티', icon: TShirtIcon },
            { value: 'hoodie', label: '후디', icon: HoodieIcon },
            { value: 'sweater', label: '스웨터', icon: LongSleeveShirtIcon },
            { value: 'cardigan', label: '가디건', icon: LongSleeveShirtIcon },
        ],
    },
    {
        label: '포멀',
        options: [
            { value: 'dress-shirt', label: '드레스 셔츠', icon: Shirt01Icon },
            { value: 'suit-jacket', label: '수트 재킷', icon: Shirt01Icon },
            { value: 'blazer', label: '블레이저', icon: Shirt01Icon },
            { value: 'tuxedo', label: '턱시도', icon: Shirt01Icon },
        ],
    },
    {
        label: '드레스',
        options: [
            { value: 'casual-dress', label: '캐주얼 드레스', icon: Dress01Icon },
            { value: 'cocktail-dress', label: '칵테일 드레스', icon: Dress03Icon },
            { value: 'evening-gown', label: '이브닝 가운', icon: Dress01Icon },
            { value: 'wedding-dress', label: '웨딩 드레스', icon: Dress01Icon },
        ],
    },
    {
        label: '아웃웨어',
        options: [
            { value: 'leather-jacket', label: '가죽 재킷', icon: LongSleeveShirtIcon },
            { value: 'denim-jacket', label: '데님 재킷', icon: LongSleeveShirtIcon },
            { value: 'trench-coat', label: '트렌치 코트', icon: LongSleeveShirtIcon },
            { value: 'wool-coat', label: '울 코트', icon: LongSleeveShirtIcon },
            { value: 'puffer-jacket', label: '패딩 재킷', icon: VestIcon },
        ],
    },
    {
        label: '기타',
        options: [
            { value: 'tank-top', label: '탱크탑', icon: SleevelessIcon },
            { value: 'crop-top', label: '크롭탑', icon: SleevelessIcon },
            { value: 'polo-shirt', label: '폴로셔츠', icon: TShirtIcon },
            { value: 'turtleneck', label: '터틀넥', icon: LongSleeveShirtIcon },
            { value: 'blouse', label: '블라우스', icon: Shirt01Icon },
            { value: 'hanbok-jeogori', label: '한복 저고리', icon: LongSleeveShirtIcon },
        ],
    },
] as const;

// ===== 그룹화된 하의 옵션 =====
export const BOTTOM_WEAR_GROUPS = [
    {
        label: '팬츠',
        options: [
            { value: 'blue-jeans', label: '청바지', icon: JoggerPantsIcon },
            { value: 'black-jeans', label: '검은 청바지', icon: JoggerPantsIcon },
            { value: 'skinny-jeans', label: '스키니진', icon: JoggerPantsIcon },
            { value: 'baggy-jeans', label: '배기진', icon: JoggerPantsIcon },
            { value: 'chinos', label: '치노 팬츠', icon: JoggerPantsIcon },
            { value: 'dress-pants', label: '드레스 팬츠', icon: JoggerPantsIcon },
            { value: 'cargo-pants', label: '카고 팬츠', icon: JoggerPantsIcon },
            { value: 'tuxedo-pants', label: '턱시도 팬츠', icon: JoggerPantsIcon },
        ],
    },
    {
        label: '스포츠/캐주얼',
        options: [
            { value: 'joggers', label: '조거 팬츠', icon: JoggerPantsIcon },
            { value: 'yoga-pants', label: '요가 팬츠', icon: JoggerPantsIcon },
            { value: 'shorts', label: '반바지', icon: ShortsPantsIcon },
            { value: 'leggings', label: '레깅스', icon: JoggerPantsIcon },
        ],
    },
    {
        label: '스커트',
        options: [
            { value: 'mini-skirt', label: '미니 스커트', icon: Dress01Icon },
            { value: 'midi-skirt', label: '미디 스커트', icon: Dress01Icon },
            { value: 'maxi-skirt', label: '맥시 스커트', icon: Dress01Icon },
            { value: 'pleated-skirt', label: '플리츠 스커트', icon: Dress01Icon },
            { value: 'pencil-skirt', label: '펜슬 스커트', icon: Dress01Icon },
        ],
    },
    {
        label: '기타',
        options: [
            { value: 'hanbok-chima', label: '한복 치마', icon: Dress01Icon },
        ],
    },
] as const;

// ===== 그룹화된 신발 옵션 =====
export const FOOTWEAR_GROUPS = [
    {
        label: '스니커즈',
        options: [
            { value: 'white-sneakers', label: '흰 스니커즈' },
            { value: 'black-sneakers', label: '검은 스니커즈' },
            { value: 'high-tops', label: '하이탑' },
            { value: 'running-shoes', label: '러닝화' },
        ],
    },
    {
        label: '드레스 슈즈',
        options: [
            { value: 'loafers', label: '로퍼' },
            { value: 'oxford-shoes', label: '옥스포드' },
            { value: 'leather-shoes', label: '가죽 구두' },
            { value: 'patent-leather', label: '에나멜 구두' },
        ],
    },
    {
        label: '힐',
        options: [
            { value: 'stiletto-heels', label: '스틸레토 힐' },
            { value: 'pumps', label: '펌프스' },
            { value: 'wedge-heels', label: '웨지힐' },
            { value: 'white-heels', label: '흰 힐' },
        ],
    },
    {
        label: '부츠',
        options: [
            { value: 'ankle-boots', label: '앵클 부츠' },
            { value: 'combat-boots', label: '컴뱃 부츠' },
            { value: 'knee-boots', label: '니하이 부츠' },
            { value: 'chelsea-boots', label: '첼시 부츠' },
        ],
    },
    {
        label: '기타',
        options: [
            { value: 'sandals', label: '샌들' },
            { value: 'flip-flops', label: '플립플롭' },
            { value: 'slippers', label: '슬리퍼' },
            { value: 'mary-janes', label: '메리 제인' },
            { value: 'platform-shoes', label: '플랫폼 슈즈' },
            { value: 'gomusin', label: '고무신' },
            { value: 'barefoot', label: '맨발' },
        ],
    },
] as const;

// ===== 그룹화된 악세서리1 옵션 =====
export const ACCESSORY1_GROUPS = [
    {
        label: '헤드웨어',
        options: [
            { value: 'baseball-cap', label: '야구 모자' },
            { value: 'beanie', label: '비니' },
            { value: 'fedora', label: '페도라' },
            { value: 'straw-hat', label: '밀짚모자' },
            { value: 'beret', label: '베레모' },
        ],
    },
    {
        label: '아이웨어',
        options: [
            { value: 'sunglasses', label: '선글라스' },
            { value: 'glasses', label: '안경' },
        ],
    },
    {
        label: '전통/웨딩',
        options: [
            { value: 'binyeo', label: '비녀' },
            { value: 'veil', label: '베일' },
            { value: 'tiara', label: '티아라' },
        ],
    },
] as const;

// ===== 그룹화된 악세서리2 옵션 =====
export const ACCESSORY2_GROUPS = [
    {
        label: '목걸이',
        options: [
            { value: 'gold-chain', label: '골드 체인' },
            { value: 'pearl-necklace', label: '진주 목걸이' },
            { value: 'choker', label: '초커' },
        ],
    },
    {
        label: '귀걸이',
        options: [
            { value: 'earrings', label: '귀걸이' },
            { value: 'hoop-earrings', label: '후프 귀걸이' },
        ],
    },
    {
        label: '넥웨어',
        options: [
            { value: 'necktie', label: '넥타이' },
            { value: 'bow-tie', label: '보타이' },
            { value: 'scarf', label: '스카프' },
        ],
    },
    {
        label: '팔/손목',
        options: [
            { value: 'watch', label: '시계' },
            { value: 'bracelet', label: '팔찌' },
        ],
    },
    {
        label: '기타',
        options: [
            { value: 'belt', label: '벨트' },
            { value: 'bag', label: '가방' },
        ],
    },
] as const;

