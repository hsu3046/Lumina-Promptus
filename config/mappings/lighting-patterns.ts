// config/mappings/lighting-patterns.ts
// 스튜디오 라이팅 데이터 매핑 - 단일 소스 (UI + 프롬프트)

// ===== 공통 타입 =====

export interface StudioLightingOption {
    value: string;
    label: string;
    desc: string;
    promptKeywords: string;
}

// ===== 스튜디오 라이팅 데이터 =====

export const STUDIO_LIGHTING_SETUPS: StudioLightingOption[] = [
    { value: '1point', label: '1점 조명', desc: '드라마틱 명암', promptKeywords: 'single key light, dramatic chiaroscuro' },
    { value: '2point', label: '2점 조명', desc: '부드러운 입체감', promptKeywords: 'key and fill lighting, balanced shadows' },
    { value: '3point', label: '3점 조명', desc: '인물 분리', promptKeywords: 'professional 3-point lighting, rim light separation' },
    { value: 'backlight', label: '백라이트', desc: '실루엣 효과', promptKeywords: 'strong backlighting, silhouette effect' },
];

export const STUDIO_LIGHTING_TOOLS: StudioLightingOption[] = [
    { value: 'softbox', label: '소프트박스', desc: '부드러운 피부', promptKeywords: 'soft diffused light, smooth skin transitions' },
    { value: 'beautydish', label: '뷰티 디쉬', desc: '선명한 윤곽', promptKeywords: 'high micro-contrast, crisp specular highlights, defined contours' },
    { value: 'spotlight', label: '스포트라이트', desc: '집중 조명', promptKeywords: 'narrow focused beam, dramatic light falloff, cinematic shadows' },
    { value: 'umbrella', label: '엄브렐러', desc: '넓은 확산', promptKeywords: 'wide diffused bounce, even global illumination, open shadows' },
];

export const STUDIO_BACKGROUNDS: StudioLightingOption[] = [
    { value: 'circular', label: '원형 캐치라이트', desc: '생기 있는 눈', promptKeywords: 'circular catchlights in eyes' },
    { value: 'window', label: '창문 캐치라이트', desc: '자연스러운 반사', promptKeywords: 'rectangular window catchlights' },
    { value: 'halo', label: '광륜', desc: '배경 그라데이션', promptKeywords: 'halo backdrop glow' },
    { value: 'blackout', label: '배경 암전', desc: '인물만 부각', promptKeywords: 'pure black background, subject isolation' },
];

export const STUDIO_COLOR_TEMPS: StudioLightingOption[] = [
    { value: '5600k', label: '표준 화이트', desc: '5600K 정확한 색상', promptKeywords: 'daylight balanced 5600K' },
    { value: '3200k', label: '따뜻한 텅스텐', desc: '3200K 온기', promptKeywords: 'warm tungsten 3200K, amber glow' },
    { value: '7500k', label: '차가운 시네마틱', desc: '7500K 모던', promptKeywords: 'cool 7500K, clinical modern look' },
    { value: 'colorgel', label: '컬러 젤', desc: '창의적 색상', promptKeywords: 'creative color gels, dual-tone lighting' },
];

// ===== 헬퍼 함수 =====

function findPromptKeywords(options: StudioLightingOption[], value: string): string {
    return options.find(opt => opt.value === value)?.promptKeywords || '';
}

// ===== 스튜디오 라이팅 프롬프트 빌더 =====

interface StudioLightingSettings {
    studioLightingSetup: string;
    studioLightingTool: string;
    studioBackgroundDetail: string;
    studioColorTemp: string;
}

/**
 * 스튜디오 모드 라이팅 프롬프트 생성
 */
export function buildLightingPrompt(settings: StudioLightingSettings): string {
    const parts: string[] = [];

    const setup = findPromptKeywords(STUDIO_LIGHTING_SETUPS, settings.studioLightingSetup);
    if (setup) parts.push(setup);

    const tool = findPromptKeywords(STUDIO_LIGHTING_TOOLS, settings.studioLightingTool);
    if (tool) parts.push(tool);

    const background = findPromptKeywords(STUDIO_BACKGROUNDS, settings.studioBackgroundDetail);
    if (background) parts.push(background);

    const colorTemp = findPromptKeywords(STUDIO_COLOR_TEMPS, settings.studioColorTemp);
    if (colorTemp) parts.push(colorTemp);

    return parts.join(', ');
}