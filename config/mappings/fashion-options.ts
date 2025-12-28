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
    // 특수
    { value: 'bikini-top', label: '비키니 탑', prompt: 'bikini top' },
    { value: 'corset', label: '코르셋', prompt: 'fitted corset' },
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
    // 특수
    { value: 'bikini-bottom', label: '비키니 하의', prompt: 'bikini bottom' },
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

// ===== 악세서리 (Accessory) =====
export const ACCESSORY_OPTIONS = [
    { value: '', label: '선택 안함', prompt: '' },
    // 헤드웨어
    { value: 'baseball-cap', label: '야구 모자', prompt: 'baseball cap' },
    { value: 'beanie', label: '비니', prompt: 'knit beanie' },
    { value: 'fedora', label: '페도라', prompt: 'fedora hat' },
    { value: 'straw-hat', label: '밀짚모자', prompt: 'straw sun hat' },
    { value: 'beret', label: '베레모', prompt: 'beret' },
    // 아이웨어
    { value: 'sunglasses', label: '선글라스', prompt: 'stylish sunglasses' },
    { value: 'glasses', label: '안경', prompt: 'eyeglasses' },
    // 목걸이/귀걸이
    { value: 'gold-chain', label: '골드 체인', prompt: 'gold chain necklace' },
    { value: 'pearl-necklace', label: '진주 목걸이', prompt: 'pearl necklace' },
    { value: 'choker', label: '초커', prompt: 'choker necklace' },
    { value: 'earrings', label: '귀걸이', prompt: 'elegant earrings' },
    { value: 'hoop-earrings', label: '후프 귀걸이', prompt: 'hoop earrings' },
    // 넥웨어
    { value: 'necktie', label: '넥타이', prompt: 'silk necktie' },
    { value: 'bow-tie', label: '보타이', prompt: 'bow tie' },
    { value: 'scarf', label: '스카프', prompt: 'silk scarf' },
    // 기타
    { value: 'watch', label: '시계', prompt: 'luxury wristwatch' },
    { value: 'bracelet', label: '팔찌', prompt: 'bracelet' },
    { value: 'belt', label: '벨트', prompt: 'leather belt' },
    { value: 'bag', label: '가방', prompt: 'designer handbag' },
    // 전통
    { value: 'binyeo', label: '비녀', prompt: 'traditional Korean binyeo hairpin' },
    // 웨딩
    { value: 'veil', label: '베일', prompt: 'wedding veil' },
    { value: 'tiara', label: '티아라', prompt: 'sparkling tiara' },
] as const;

// 타입 추출
export type TopWearValue = typeof TOP_WEAR_OPTIONS[number]['value'];
export type BottomWearValue = typeof BOTTOM_WEAR_OPTIONS[number]['value'];
export type FootwearValue = typeof FOOTWEAR_OPTIONS[number]['value'];
export type AccessoryValue = typeof ACCESSORY_OPTIONS[number]['value'];
