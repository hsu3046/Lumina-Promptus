// config/mappings/photo-styles.ts
// 포토 스타일 프리셋 데이터 (필름 스톡 + 작가 스타일)
// v1.0 — 10종 초기 프리셋

// ===== 타입 정의 =====

export interface PhotoStyleParams {
    colorMode: 'color' | 'bw' | 'monochrome' | 'sepia';
    grain: 'none' | 'fine' | 'medium' | 'heavy';
    contrast: 'low' | 'medium' | 'high' | 'very-high';
    saturation: 'desaturated' | 'natural' | 'vivid' | 'hyper';
    tonality: string;
    texture: string;
    mood: string;
    processing: string;
}

export interface PhotoStyle {
    id: string;
    category: 'film' | 'photographer';
    name: string;           // UI 표시명 (한글)
    nameEn: string;         // 영어 이름
    description: string;    // UI 설명 (한글)
    params: PhotoStyleParams;
    promptTokens: string;   // Exporter에서 사용되는 영어 프롬프트 토큰
}

// ===== 필름 스톡 프리셋 (5종) =====

const FILM_STYLES: PhotoStyle[] = [
    {
        id: 'kodak-trix-400',
        category: 'film',
        name: 'Kodak Tri-X 400',
        nameEn: 'Kodak Tri-X 400',
        description: '클래식 흑백 필름. 풍부한 그레인과 높은 콘트라스트.',
        params: {
            colorMode: 'bw',
            grain: 'heavy',
            contrast: 'high',
            saturation: 'desaturated',
            tonality: 'deep blacks with luminous highlights',
            texture: 'pronounced film grain texture',
            mood: 'classic documentary',
            processing: 'traditional darkroom print',
        },
        promptTokens: 'black and white photograph, high contrast, rich film grain, deep blacks with luminous highlights, classic documentary feel',
    },
    {
        id: 'kodak-portra-400',
        category: 'film',
        name: 'Kodak Portra 400',
        nameEn: 'Kodak Portra 400',
        description: '따뜻한 스킨톤과 부드러운 파스텔 색감의 포트레이트 필름.',
        params: {
            colorMode: 'color',
            grain: 'fine',
            contrast: 'low',
            saturation: 'natural',
            tonality: 'warm shadows, soft pastel highlights',
            texture: 'smooth natural skin rendering',
            mood: 'warm and intimate',
            processing: 'matte film finish',
        },
        promptTokens: 'warm pastel tones, soft color palette, natural skin rendering, gentle highlight roll-off, matte film finish',
    },
    {
        id: 'fuji-velvia-50',
        category: 'film',
        name: 'Fuji Velvia 50',
        nameEn: 'Fuji Velvia 50',
        description: '초비비드 컬러 슬라이드 필름. 풍경/자연에 최적.',
        params: {
            colorMode: 'color',
            grain: 'fine',
            contrast: 'very-high',
            saturation: 'hyper',
            tonality: 'deep saturated greens and blues',
            texture: 'ultra-fine grain',
            mood: 'vivid and punchy',
            processing: 'slide film transparency',
        },
        promptTokens: 'hyper-vivid colors, deep saturated greens and blues, ultra-fine grain, high contrast, punchy color rendering',
    },
    {
        id: 'ilford-hp5-400',
        category: 'film',
        name: 'Ilford HP5 Plus 400',
        nameEn: 'Ilford HP5 Plus 400',
        description: '부드러운 톤의 클래식 흑백 필름. 부드러운 그레인.',
        params: {
            colorMode: 'bw',
            grain: 'medium',
            contrast: 'medium',
            saturation: 'desaturated',
            tonality: 'smooth tonal gradation with gentle shadow detail',
            texture: 'soft grain texture',
            mood: 'gentle and contemplative',
            processing: 'fine art darkroom print',
        },
        promptTokens: 'black and white photograph, medium contrast, smooth tonal gradation, soft grain texture, gentle shadow detail',
    },
    {
        id: 'cinestill-800t',
        category: 'film',
        name: 'CineStill 800T',
        nameEn: 'CineStill 800T',
        description: '시네마틱 텅스텐 필름. 야간 촬영과 인공조명에 최적.',
        params: {
            colorMode: 'color',
            grain: 'medium',
            contrast: 'medium',
            saturation: 'vivid',
            tonality: 'warm orange highlights, cool blue shadows',
            texture: 'cinematic grain with halation',
            mood: 'nocturnal and cinematic',
            processing: 'tungsten-balanced film stock',
        },
        promptTokens: 'cinematic tungsten color cast, warm orange highlights, cool blue shadows, halation glow around lights, night film aesthetic',
    },
];

// ===== 작가 스타일 프리셋 (5종) =====
// 주의: 작가명은 UI에만 표시. promptTokens에는 기술 파라미터만 사용 (법적 리스크 회피)

const PHOTOGRAPHER_STYLES: PhotoStyle[] = [
    {
        id: 'style-lindbergh',
        category: 'photographer',
        name: 'Peter Lindbergh 풍',
        nameEn: 'Peter Lindbergh Style',
        description: '자연스러운 흑백 포트레이트. 미니멀하고 진솔한 아름다움.',
        params: {
            colorMode: 'bw',
            grain: 'fine',
            contrast: 'low',
            saturation: 'desaturated',
            tonality: 'soft directional light, gentle tonal range',
            texture: 'smooth skin, raw authentic beauty',
            mood: 'intimate and honest',
            processing: 'matte finish, minimal retouching feel',
        },
        promptTokens: 'black and white photograph, natural soft directional light, minimal background, raw authentic beauty, low contrast, matte finish, intimate and honest mood',
    },
    {
        id: 'style-leibovitz',
        category: 'photographer',
        name: 'Annie Leibovitz 풍',
        nameEn: 'Annie Leibovitz Style',
        description: '드라마틱한 라이팅과 시네마틱 컬러. 연출된 환경 포트레이트.',
        params: {
            colorMode: 'color',
            grain: 'none',
            contrast: 'high',
            saturation: 'vivid',
            tonality: 'rich saturated colors, theatrical light',
            texture: 'sharp precise detail',
            mood: 'dramatic and theatrical',
            processing: 'elaborate environmental portrait',
        },
        promptTokens: 'dramatic cinematic lighting, rich saturated colors, theatrical composition, elaborate environmental portrait, bold color palette',
    },
    {
        id: 'style-avedon',
        category: 'photographer',
        name: 'Richard Avedon 풍',
        nameEn: 'Richard Avedon Style',
        description: '하이키 흑백. 순백 배경, 그래픽한 콘트라스트.',
        params: {
            colorMode: 'bw',
            grain: 'none',
            contrast: 'very-high',
            saturation: 'desaturated',
            tonality: 'stark white, graphic black',
            texture: 'sharp precise focus, clean edges',
            mood: 'confrontational and direct',
            processing: 'high-key studio lighting',
        },
        promptTokens: 'high-key black and white, stark white background, sharp precise focus, graphic contrast, minimalist composition, confrontational directness',
    },
    {
        id: 'style-eggleston',
        category: 'photographer',
        name: 'William Eggleston 풍',
        nameEn: 'William Eggleston Style',
        description: '일상의 컬러를 예술로. Dye Transfer 프린트 느낌.',
        params: {
            colorMode: 'color',
            grain: 'fine',
            contrast: 'medium',
            saturation: 'vivid',
            tonality: 'warm southern palette, elevated mundane colors',
            texture: 'dye-transfer print richness',
            mood: 'contemplative everyday beauty',
            processing: 'dye-transfer print aesthetic',
        },
        promptTokens: 'saturated everyday colors, dye-transfer print aesthetic, mundane subjects elevated, warm southern palette, democratic composition',
    },
    {
        id: 'style-fan-ho',
        category: 'photographer',
        name: 'Fan Ho 풍',
        nameEn: 'Fan Ho Style',
        description: '빛과 그림자의 시적 구성. 기하학적 미니멀리즘.',
        params: {
            colorMode: 'monochrome',
            grain: 'fine',
            contrast: 'very-high',
            saturation: 'desaturated',
            tonality: 'dramatic light shafts, deep ink-black shadows',
            texture: 'fine grain with sharp silhouettes',
            mood: 'poetic and contemplative',
            processing: 'high contrast monochrome, atmospheric haze',
        },
        promptTokens: 'dramatic light and shadow interplay, geometric composition, silhouette figures, high contrast monochrome, architectural framing, poetic minimalism',
    },
];

// ===== Export =====

export const PHOTO_STYLES: PhotoStyle[] = [...FILM_STYLES, ...PHOTOGRAPHER_STYLES];

export function getStyleById(id: string): PhotoStyle | undefined {
    return PHOTO_STYLES.find(style => style.id === id);
}

export function getStylesByCategory(category: 'film' | 'photographer'): PhotoStyle[] {
    return PHOTO_STYLES.filter(style => style.category === category);
}
