// lib/landscape/prompt-generator.ts
// 풍경 사진 프롬프트 생성기 - 4섹션 구조 (Nano Banana 포맷)

import type {
    LandscapeSettings,
    LandscapePromptConfig,
    LandscapeLensType,
    LandscapeLandmark,
    LandscapeReferenceImage,
} from '@/types/landscape.types';
import {
    LANDSCAPE_LENS_SPECS,
    getLightingDescription,
    getWeatherDescription,
    getSeasonDescription,
    getAtmosphereDescription,
    getCompassLabel,
} from '@/config/mappings/landscape-environment';

/**
 * 렌즈 ID에서 초점거리 추출 (예: 'nikon_af_s_24mm_f14g_ed' -> '24mm')
 */
function extractFocalLength(lensId: string): LandscapeLensType {
    const match = lensId.match(/(\d+)mm/);
    if (match) {
        const focal = match[1] + 'mm';
        if (focal in LANDSCAPE_LENS_SPECS) {
            return focal as LandscapeLensType;
        }
    }
    return '50mm';
}

/**
 * 카메라 높이 설명 생성
 */
function getHeightDescription(height: number): string {
    if (height <= 2) return 'ground level';
    if (height <= 10) return 'elevated position';
    if (height <= 50) return 'high vantage point';
    if (height <= 150) return 'rooftop/tower level';
    return 'aerial/drone altitude';
}

/**
 * 풍경 사진용 프롬프트 설정 생성
 */
export function buildLandscapePromptConfig(
    settings: LandscapeSettings,
    referenceImages: LandscapeReferenceImage[] = []
): LandscapePromptConfig {
    const lensType = extractFocalLength(settings.lensId);
    const lensSpec = LANDSCAPE_LENS_SPECS[lensType];

    return {
        location: settings.location,
        camera: {
            heading: settings.camera.heading,
            pitch: settings.camera.pitch,
            lens: lensType,
            fov: lensSpec.fov,
            aperture: lensSpec.aperture,
            iso: lensSpec.iso,
            characteristic: lensSpec.characteristic,
        },
        environment: settings.environment,
        landmarks: settings.landmarks || [],
        referenceImages,
    };
}

// ===== 주소에서 도시/국가 추출 =====
function extractLocationContext(address: string | null | undefined): string {
    if (!address) return '';

    // 영어 주소에서 마지막 2-3개 요소 추출 (City, Country)
    const parts = address.split(',').map(p => p.trim());
    if (parts.length >= 2) {
        // 마지막 2개 요소 (도시, 국가) 또는 마지막 3개
        const relevantParts = parts.slice(-3).filter(p => !/^\d/.test(p)); // 우편번호 제외
        return relevantParts.join(', ');
    }
    return address;
}

// ===== 섹션 1: 피사체 설명 =====
function generateSubjectSection(config: LandscapePromptConfig): string {
    const { location } = config;

    // 영어 이름 우선, 없으면 한국어 이름 사용
    const displayName = location.nameEn || location.name || 'Unknown Location';
    const locationContext = extractLocationContext(location.address);

    // "Tokyo Tower in Minato City, Tokyo, Japan" 형식
    const fullName = locationContext
        ? `${displayName} in ${locationContext}`
        : displayName;

    const lines = [
        'INSTRUCTION: Use the subject name and coordinates below to search for accurate',
        'real-world information about this landmark. Verify architectural details,',
        'surrounding geography, and typical visual appearance from this location.',
        '',
        `[SUBJECT]`,
        `Name: ${fullName}`,
        `Coordinates: ${location.coordinates.lat.toFixed(4)}°N, ${location.coordinates.lng.toFixed(4)}°E`,
    ];

    return lines.join('\n');
}

// ===== 섹션 2: 구도/공간 배치 =====
function generateCompositionSection(
    config: LandscapePromptConfig,
    settings: LandscapeSettings
): string {
    const { camera } = config;
    const lensSpec = LANDSCAPE_LENS_SPECS[camera.lens];
    const compassDir = getCompassLabel(settings.camera.heading);

    const height = settings.camera.height || 0;
    const heightDesc = getHeightDescription(height);

    // 활성화된 랜드마크만 필터링
    const enabledLandmarks = config.landmarks.filter(lm => lm.enabled !== false);

    const layers: Record<string, LandscapeLandmark[]> = {
        foreground: enabledLandmarks.filter(lm => lm.layer === 'foreground'),
        middleground: enabledLandmarks.filter(lm => lm.layer === 'middleground'),
        background: enabledLandmarks.filter(lm => lm.layer === 'background'),
    };

    // 자연스러운 방향 설명
    const directionPhrase = (dir: string | undefined): string => {
        switch (dir) {
            case 'left': return 'on the left side of the frame';
            case 'right': return 'on the right side of the frame';
            default: return 'in the center of the frame';
        }
    };

    // 레이어별 서술
    const layerDescriptions = {
        foreground: 'In the immediate foreground',
        middleground: 'In the middle distance',
        background: 'In the distant background',
    };

    // 서술형 문장 생성
    const lines = [
        `[COMPOSITION]`,
        `Camera positioned at ${heightDesc}, facing ${compassDir}, using ${camera.lens} ${lensSpec.type} lens.`,
        '',
        'Spatial Arrangement:',
    ];

    // 피사체 이름 가져오기
    const subjectName = config.location.nameEn || config.location.name || 'the subject';

    // 각 레이어별 자연어 서술
    for (const [layer, landmarks] of Object.entries(layers)) {
        if (landmarks.length > 0) {
            const layerIntro = layerDescriptions[layer as keyof typeof layerDescriptions];

            // 방향별로 그룹화
            const byDirection: Record<string, string[]> = { left: [], center: [], right: [] };
            for (const lm of landmarks) {
                const displayName = lm.nameEn || lm.name;
                const dir = lm.relativeDirection || 'center';
                byDirection[dir].push(displayName);
            }

            // 방향별 서술 생성
            const descriptions: string[] = [];
            if (byDirection.left.length > 0) {
                descriptions.push(`${byDirection.left.join(' and ')} ${byDirection.left.length > 1 ? 'are' : 'is'} visible to the left of ${subjectName}`);
            }
            if (byDirection.center.length > 0) {
                descriptions.push(`${byDirection.center.join(' and ')} ${byDirection.center.length > 1 ? 'are' : 'is'} directly behind ${subjectName}`);
            }
            if (byDirection.right.length > 0) {
                descriptions.push(`${byDirection.right.join(' and ')} ${byDirection.right.length > 1 ? 'are' : 'is'} visible to the right of ${subjectName}`);
            }

            if (descriptions.length > 0) {
                lines.push(`${layerIntro}, ${descriptions.join(', and ')}.`);
            }
        }
    }

    // 랜드마크가 없는 경우
    if (enabledLandmarks.length === 0) {
        lines.push(`The scene shows ${subjectName} with natural surroundings extending into the distance.`);
    }

    return lines.join('\n');
}

// ===== 섹션 3: 환경/분위기 =====
function generateEnvironmentSection(config: LandscapePromptConfig): string {
    const { environment } = config;

    const lines = [
        `[ENVIRONMENT]`,
        `Weather: ${getWeatherDescription(environment.weather)}`,
        `Season: ${getSeasonDescription(environment.season)}`,
        `Time: ${getLightingDescription(environment.time)}`,
        `Atmosphere: ${getAtmosphereDescription(environment.atmosphere)}`,
    ];

    return lines.join('\n');
}

// ===== 섹션 4: 카메라 스펙 =====
function generateCameraSection(config: LandscapePromptConfig): string {
    const { camera } = config;

    const lines = [
        `[CAMERA]`,
        `Body: Nikon D850`,
        `Lens: AF-S NIKKOR ${camera.lens}`,
        `Aperture: ${camera.aperture}`,
        `ISO: ${camera.iso}`,
        '',
        'Technical Style:',
        '- Professional landscape photography',
        '- National Geographic quality',
        '- Photorealistic detail with natural color grading',
        '- Sharp focus throughout frame',
        '- Balanced exposure: detailed shadows and highlights',
    ];

    return lines.join('\n');
}

/**
 * 풍경 사진 프롬프트 생성 (4섹션 구조)
 */
export function generateLandscapePrompt(
    config: LandscapePromptConfig,
    settings?: LandscapeSettings
): string {
    // settings가 없으면 config에서 기본값 생성
    const effectiveSettings: LandscapeSettings = settings || {
        location: config.location,
        camera: {
            heading: config.camera.heading,
            pitch: config.camera.pitch,
            heightOffset: 0,
            distance: 100,
            height: 0,
            horizontalOffset: 0,
        },
        lensId: config.camera.lens,
        environment: config.environment,
        landmarks: config.landmarks,
    };

    const sections = [
        generateSubjectSection(config),
        generateCompositionSection(config, effectiveSettings),
        generateEnvironmentSection(config),
        generateCameraSection(config),
    ];

    return sections.join('\n\n');
}

/**
 * 간단한 풍경 프롬프트 생성 (Midjourney/DALL-E용 한 줄 형식)
 */
export function generateSimpleLandscapePrompt(config: LandscapePromptConfig): string {
    const { location, camera, environment, landmarks } = config;
    const lensSpec = LANDSCAPE_LENS_SPECS[camera.lens];
    const compassLabel = getCompassLabel(camera.heading);

    const keywords: string[] = [];

    // 위치
    if (location.name) {
        keywords.push(location.name);
    }

    // 환경
    keywords.push(getLightingDescription(environment.time));
    keywords.push(getWeatherDescription(environment.weather));
    keywords.push(getSeasonDescription(environment.season));
    keywords.push(getAtmosphereDescription(environment.atmosphere));

    // 활성화된 랜드마크
    const enabledLandmarks = landmarks.filter(lm => lm.enabled !== false);
    if (enabledLandmarks.length > 0) {
        const landmarkNames = enabledLandmarks.slice(0, 3).map(lm => lm.name).join(', ');
        keywords.push(`featuring ${landmarkNames}`);
    }

    // 카메라
    keywords.push(`shot from ${compassLabel}`);
    keywords.push(`${camera.lens} ${lensSpec.type} lens`);
    keywords.push(camera.aperture);

    // 스타일
    keywords.push('professional landscape photography');
    keywords.push('National Geographic quality');
    keywords.push('photorealistic');

    return keywords.filter(Boolean).join(', ');
}
