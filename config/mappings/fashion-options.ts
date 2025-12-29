// config/mappings/fashion-options.ts
// 패션 드롭다운 옵션 매핑

// ===== 상의 (Top Wear) =====
export const TOP_WEAR_OPTIONS = [
    { value: '', label: '선택 안함', prompt: '' },
    // 캐주얼
    { value: 'white-tshirt', label: '흰 티셔츠', prompt: 'white t-shirt' },
    { value: 'black-tshirt', label: '검은 티셔츠', prompt: 'black t-shirt' },
    { value: 'graphic-tee', label: '그래픽 티', prompt: 'graphic printed t-shirt' },
    { value: 'hoodie', label: '후디', prompt: 'casual hoodie' },
    { value: 'sweater', label: '스웨터', prompt: 'cozy knit sweater' },
    { value: 'cardigan', label: '가디건', prompt: 'soft cardigan' },
    // 정장/포멀
    { value: 'dress-shirt', label: '드레스 셔츠', prompt: 'crisp dress shirt' },
    { value: 'suit-jacket', label: '수트 재킷', prompt: 'tailored suit jacket' },
    { value: 'blazer', label: '블레이저', prompt: 'smart blazer' },
    { value: 'tuxedo', label: '턱시도', prompt: 'black tuxedo jacket' },
    // 드레스
    { value: 'casual-dress', label: '캐주얼 드레스', prompt: 'casual everyday dress' },
    { value: 'cocktail-dress', label: '칵테일 드레스', prompt: 'elegant cocktail dress' },
    { value: 'evening-gown', label: '이브닝 가운', prompt: 'luxurious evening gown' },
    { value: 'wedding-dress', label: '웨딩 드레스', prompt: 'white wedding gown with lace details' },
    // 아웃웨어
    { value: 'leather-jacket', label: '가죽 재킷', prompt: 'leather jacket' },
    { value: 'denim-jacket', label: '데님 재킷', prompt: 'denim jacket' },
    { value: 'trench-coat', label: '트렌치 코트', prompt: 'classic trench coat' },
    { value: 'wool-coat', label: '울 코트', prompt: 'warm wool coat' },
    { value: 'puffer-jacket', label: '패딩 재킷', prompt: 'puffer down jacket' },
    // 스포츠/캐주얼
    { value: 'tank-top', label: '탱크탑', prompt: 'athletic tank top' },
    { value: 'crop-top', label: '크롭탑', prompt: 'trendy crop top' },
    { value: 'polo-shirt', label: '폴로셔츠', prompt: 'polo shirt' },
    // 전통
    { value: 'hanbok-jeogori', label: '한복 저고리', prompt: 'traditional Korean hanbok jeogori' },
    // 기타
    { value: 'turtleneck', label: '터틀넥', prompt: 'slim turtleneck' },
    { value: 'blouse', label: '블라우스', prompt: 'elegant blouse' },
] as const;

// ===== 하의 (Bottom Wear) =====
export const BOTTOM_WEAR_OPTIONS = [
    { value: '', label: '선택 안함', prompt: '' },
    // 바지
    { value: 'blue-jeans', label: '청바지', prompt: 'blue jeans' },
    { value: 'black-jeans', label: '검은 청바지', prompt: 'black jeans' },
    { value: 'skinny-jeans', label: '스키니진', prompt: 'skinny jeans' },
    { value: 'baggy-jeans', label: '배기진', prompt: 'baggy loose jeans' },
    { value: 'chinos', label: '치노 팬츠', prompt: 'casual chino pants' },
    { value: 'dress-pants', label: '드레스 팬츠', prompt: 'tailored dress pants' },
    { value: 'cargo-pants', label: '카고 팬츠', prompt: 'utility cargo pants' },
    { value: 'joggers', label: '조거 팬츠', prompt: 'comfortable jogger pants' },
    { value: 'yoga-pants', label: '요가 팬츠', prompt: 'stretchy yoga pants' },
    { value: 'shorts', label: '반바지', prompt: 'casual shorts' },
    // 스커트
    { value: 'mini-skirt', label: '미니 스커트', prompt: 'mini skirt' },
    { value: 'midi-skirt', label: '미디 스커트', prompt: 'midi skirt' },
    { value: 'maxi-skirt', label: '맥시 스커트', prompt: 'flowing maxi skirt' },
    { value: 'pleated-skirt', label: '플리츠 스커트', prompt: 'pleated skirt' },
    { value: 'pencil-skirt', label: '펜슬 스커트', prompt: 'fitted pencil skirt' },
    // 전통
    { value: 'hanbok-chima', label: '한복 치마', prompt: 'traditional Korean hanbok chima skirt' },
    // 기타
    { value: 'leggings', label: '레깅스', prompt: 'tight leggings' },
    { value: 'tuxedo-pants', label: '턱시도 팬츠', prompt: 'black tuxedo pants' },
] as const;

// ===== 신발 (Footwear) =====
export const FOOTWEAR_OPTIONS = [
    { value: '', label: '선택 안함', prompt: '' },
    // 스니커즈
    { value: 'white-sneakers', label: '흰 스니커즈', prompt: 'white sneakers' },
    { value: 'black-sneakers', label: '검은 스니커즈', prompt: 'black sneakers' },
    { value: 'high-tops', label: '하이탑', prompt: 'high-top sneakers' },
    { value: 'running-shoes', label: '러닝화', prompt: 'running shoes' },
    // 드레스 슈즈
    { value: 'loafers', label: '로퍼', prompt: 'leather loafers' },
    { value: 'oxford-shoes', label: '옥스포드', prompt: 'oxford dress shoes' },
    { value: 'leather-shoes', label: '가죽 구두', prompt: 'polished leather dress shoes' },
    { value: 'patent-leather', label: '에나멜 구두', prompt: 'patent leather shoes' },
    // 힐
    { value: 'stiletto-heels', label: '스틸레토 힐', prompt: 'stiletto high heels' },
    { value: 'pumps', label: '펌프스', prompt: 'classic pumps' },
    { value: 'wedge-heels', label: '웨지힐', prompt: 'wedge heels' },
    { value: 'white-heels', label: '흰 힐', prompt: 'white high heels' },
    // 부츠
    { value: 'ankle-boots', label: '앵클 부츠', prompt: 'ankle boots' },
    { value: 'combat-boots', label: '컴뱃 부츠', prompt: 'combat boots' },
    { value: 'knee-boots', label: '니하이 부츠', prompt: 'knee-high boots' },
    { value: 'chelsea-boots', label: '첼시 부츠', prompt: 'chelsea boots' },
    // 샌들/슬리퍼
    { value: 'sandals', label: '샌들', prompt: 'casual sandals' },
    { value: 'flip-flops', label: '플립플롭', prompt: 'flip flops' },
    { value: 'slippers', label: '슬리퍼', prompt: 'comfortable slippers' },
    // 전통
    { value: 'gomusin', label: '고무신', prompt: 'traditional Korean gomusin' },
    // 특수
    { value: 'mary-janes', label: '메리 제인', prompt: 'mary jane shoes' },
    { value: 'platform-shoes', label: '플랫폼 슈즈', prompt: 'platform shoes' },
    { value: 'barefoot', label: '맨발', prompt: 'barefoot' },
] as const;

// ===== 악세서리1 (얼굴/머리 - 상호 배타) =====
export const ACCESSORY1_OPTIONS = [
    { value: '', label: '선택 안함', prompt: '' },
    // 헤드웨어
    { value: 'baseball-cap', label: '야구 모자', prompt: 'baseball cap' },
    { value: 'beanie', label: '비니', prompt: 'knit beanie' },
    { value: 'fedora', label: '페도라', prompt: 'fedora hat' },
    { value: 'straw-hat', label: '밀짚모자', prompt: 'straw sun hat' },
    { value: 'beret', label: '베레모', prompt: 'beret' },
    // 아이웨어 (선글라스 vs 안경 - 한 가지만)
    { value: 'sunglasses', label: '선글라스', prompt: 'stylish sunglasses' },
    { value: 'glasses', label: '안경', prompt: 'eyeglasses' },
    // 전통/웨딩
    { value: 'binyeo', label: '비녀', prompt: 'traditional Korean binyeo hairpin' },
    { value: 'veil', label: '베일', prompt: 'wedding veil' },
    { value: 'tiara', label: '티아라', prompt: 'sparkling tiara' },
] as const;

// ===== 악세서리2 (장신구/기타 - 중복 가능) =====
export const ACCESSORY2_OPTIONS = [
    { value: '', label: '선택 안함', prompt: '' },
    // 목걸이
    { value: 'gold-chain', label: '골드 체인', prompt: 'gold chain necklace' },
    { value: 'pearl-necklace', label: '진주 목걸이', prompt: 'pearl necklace' },
    { value: 'choker', label: '초커', prompt: 'choker necklace' },
    // 귀걸이
    { value: 'earrings', label: '귀걸이', prompt: 'elegant earrings' },
    { value: 'hoop-earrings', label: '후프 귀걸이', prompt: 'hoop earrings' },
    // 넥웨어
    { value: 'necktie', label: '넥타이', prompt: 'silk necktie' },
    { value: 'bow-tie', label: '보타이', prompt: 'bow tie' },
    { value: 'scarf', label: '스카프', prompt: 'silk scarf' },
    // 팔/손목
    { value: 'watch', label: '시계', prompt: 'luxury wristwatch' },
    { value: 'bracelet', label: '팔찌', prompt: 'bracelet' },
    // 기타
    { value: 'belt', label: '벨트', prompt: 'leather belt' },
    { value: 'bag', label: '가방', prompt: 'designer handbag' },
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
            { value: 'white-tshirt', label: '흰 티셔츠' },
            { value: 'black-tshirt', label: '검은 티셔츠' },
            { value: 'graphic-tee', label: '그래픽 티' },
            { value: 'hoodie', label: '후디' },
            { value: 'sweater', label: '스웨터' },
            { value: 'cardigan', label: '가디건' },
        ],
    },
    {
        label: '포멀',
        options: [
            { value: 'dress-shirt', label: '드레스 셔츠' },
            { value: 'suit-jacket', label: '수트 재킷' },
            { value: 'blazer', label: '블레이저' },
            { value: 'tuxedo', label: '턱시도' },
        ],
    },
    {
        label: '드레스',
        options: [
            { value: 'casual-dress', label: '캐주얼 드레스' },
            { value: 'cocktail-dress', label: '칵테일 드레스' },
            { value: 'evening-gown', label: '이브닝 가운' },
            { value: 'wedding-dress', label: '웨딩 드레스' },
        ],
    },
    {
        label: '아웃웨어',
        options: [
            { value: 'leather-jacket', label: '가죽 재킷' },
            { value: 'denim-jacket', label: '데님 재킷' },
            { value: 'trench-coat', label: '트렌치 코트' },
            { value: 'wool-coat', label: '울 코트' },
            { value: 'puffer-jacket', label: '패딩 재킷' },
        ],
    },
    {
        label: '기타',
        options: [
            { value: 'tank-top', label: '탱크탑' },
            { value: 'crop-top', label: '크롭탑' },
            { value: 'polo-shirt', label: '폴로셔츠' },
            { value: 'turtleneck', label: '터틀넥' },
            { value: 'blouse', label: '블라우스' },
            { value: 'hanbok-jeogori', label: '한복 저고리' },
        ],
    },
] as const;

// ===== 그룹화된 하의 옵션 =====
export const BOTTOM_WEAR_GROUPS = [
    {
        label: '팬츠',
        options: [
            { value: 'blue-jeans', label: '청바지' },
            { value: 'black-jeans', label: '검은 청바지' },
            { value: 'skinny-jeans', label: '스키니진' },
            { value: 'baggy-jeans', label: '배기진' },
            { value: 'chinos', label: '치노 팬츠' },
            { value: 'dress-pants', label: '드레스 팬츠' },
            { value: 'cargo-pants', label: '카고 팬츠' },
            { value: 'tuxedo-pants', label: '턱시도 팬츠' },
        ],
    },
    {
        label: '스포츠/캐주얼',
        options: [
            { value: 'joggers', label: '조거 팬츠' },
            { value: 'yoga-pants', label: '요가 팬츠' },
            { value: 'shorts', label: '반바지' },
            { value: 'leggings', label: '레깅스' },
        ],
    },
    {
        label: '스커트',
        options: [
            { value: 'mini-skirt', label: '미니 스커트' },
            { value: 'midi-skirt', label: '미디 스커트' },
            { value: 'maxi-skirt', label: '맥시 스커트' },
            { value: 'pleated-skirt', label: '플리츠 스커트' },
            { value: 'pencil-skirt', label: '펜슬 스커트' },
        ],
    },
    {
        label: '기타',
        options: [
            { value: 'hanbok-chima', label: '한복 치마' },
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

