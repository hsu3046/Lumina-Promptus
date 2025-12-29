// lib/landscape/prompt-generator.ts
// 풍경 사진 프롬프트 생성기

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
    getCompassLabel,
} from '@/config/mappings/landscape-environment';
import {
    calculateSunPosition,
    calculateShadowInfo,
    generateLightingPrompt,
} from '@/lib/landscape/sun-calculator';
import {
    analyzeOcclusion,
    generateCompactSpatialPrompt,
} from '@/lib/landscape/occlusion-analyzer';

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
    // 기본값
    return '50mm';
}

/**
 * 풍경 사진용 프롬프트 설정 생성
 */
export function buildLandscapePromptConfig(
    settings: LandscapeSettings,
    referenceImages: LandscapeReferenceImage[]
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

/**
 * 랜드마크 설명 생성 (전경/중경/배경 분류 - layer 속성 사용)
 */
function generateLandmarkDescription(
    landmarks: LandscapeLandmark[],
    heading: number,
    fov: number
): string {
    // layer 속성 기반 분류
    const foreground = landmarks.filter(lm => lm.layer === 'foreground');
    const middleground = landmarks.filter(lm => lm.layer === 'middleground');
    const background = landmarks.filter(lm => lm.layer === 'background');

    const fgNames = foreground.map(lm => lm.name).filter(Boolean).join(', ') || 'Natural terrain';
    const mgNames = middleground.map(lm => lm.name).filter(Boolean).join(', ') || 'Urban landscape';
    const bgNames = background.map(lm => lm.name).filter(Boolean).join(', ') || 'Distant horizon';

    return [
        `Foreground (0-50m): ${fgNames}`,
        `Middleground (50-500m): ${mgNames}`,
        `Background (500m+): ${bgNames}`,
    ].join('\n');
}

/**
 * 풍경 사진 프롬프트 생성
 */
export function generateLandscapePrompt(config: LandscapePromptConfig): string {
    const { location, camera, environment, landmarks, referenceImages } = config;

    const lensSpec = LANDSCAPE_LENS_SPECS[camera.lens];
    const lightingDesc = getLightingDescription(environment.time);
    const weatherDesc = getWeatherDescription(environment.weather);
    const seasonDesc = getSeasonDescription(environment.season);
    const compassLabel = getCompassLabel(camera.heading);

    // 카메라 설정
    const cameraSetup = `
Camera: Nikon D850
Lens: ${camera.lens} ${lensSpec.type}
Aperture: ${camera.aperture}
ISO: ${camera.iso}
Direction: ${compassLabel} (${camera.heading}°)
Tilt: ${camera.pitch > 0 ? 'upward' : camera.pitch < 0 ? 'downward' : 'level'} ${Math.abs(camera.pitch)}°
Field of View: ${camera.fov}°
  `.trim();

    // 참조 이미지 가이드
    const refCount = referenceImages.length;
    const centerCount = referenceImages.filter(r => r.type === 'center').length;
    const surroundCount = referenceImages.filter(r => r.type === 'surrounding').length;
    const satCount = referenceImages.filter(r => r.type === 'satellite').length;

    const referenceInstructions = `
Reference Images Guide (${refCount} total):
- Images 1-${centerCount}: Primary view from exact user-selected angle
  → Maintain precise composition, spatial relationships, and depth
- Images ${centerCount + 1}-${centerCount + surroundCount}: 360° surrounding context (N, NE, E, SE, S, SW, W, NW)
  → Understand landmark positions and spatial layout
- Image ${refCount}: Satellite overhead view
  → Ensure geographic accuracy of terrain, rivers, roads

Critical: Use references to preserve reality, NOT to copy exactly.
Enhance lighting and atmosphere while maintaining spatial truth.
  `.trim();

    // 환경 설정
    const environmentalContext = `
Time: ${environment.time} ${lightingDesc}
Weather: ${environment.weather} ${weatherDesc}
Season: ${environment.season} ${seasonDesc}
Location: ${location.name || 'Unnamed location'} at ${location.elevation}m elevation
Coordinates: ${location.coordinates.lat.toFixed(4)}, ${location.coordinates.lng.toFixed(4)}
    `.trim();

    // 태양/그림자 물리 계산 (현재 시간 기준)
    const lightingPhysics = generateLightingPrompt(
        location.coordinates.lat,
        location.coordinates.lng,
        new Date(),
        50 // 기본 건물 높이 50m
    );

    // 랜드마크 및 Occlusion 분석
    let visibleLandmarks: string;
    let spatialContext: string = '';

    if (landmarks.length > 0) {
        // Occlusion 분석 수행
        const occlusionAnalysis = analyzeOcclusion(landmarks, camera.heading, camera.fov);
        visibleLandmarks = generateLandmarkDescription(landmarks, camera.heading, camera.fov);
        spatialContext = generateCompactSpatialPrompt(occlusionAnalysis);
    } else {
        visibleLandmarks = 'Foreground: Natural terrain\nMiddleground: Urban landscape\nBackground: Distant horizon';
    }

    // 최종 프롬프트
    return `
Create a professional landscape photograph based on ${refCount} reference images.

${cameraSetup}

${referenceInstructions}

${environmentalContext}

Visible Elements:
${visibleLandmarks}

${spatialContext ? `Spatial Depth Analysis:
${spatialContext}
` : ''}
Lighting Physics:
${lightingPhysics}

Photography Style:
- Professional landscape photography
- National Geographic quality
- Photorealistic detail
- Natural color grading with ${environment.time} enhancement
- Sharp focus throughout (${lensSpec.dof})
- Atmospheric perspective with subtle haze
- Balanced exposure: detailed shadows and highlights

Technical Requirements:
- 4K resolution (3840×2160)
- Professional RAW processing aesthetic
- ${lensSpec.characteristic}
- Minimal post-processing feel
- Authentic ${camera.lens} perspective

CRITICAL: This must look like a real photograph taken by a professional 
photographer at this exact location. Maintain geographic accuracy while 
enhancing natural beauty.
  `.trim();
}

/**
 * 간단한 풍경 프롬프트 생성 (Midjourney/Nano Banana용)
 */
export function generateSimpleLandscapePrompt(config: LandscapePromptConfig): string {
    const { location, camera, environment } = config;
    const lensSpec = LANDSCAPE_LENS_SPECS[camera.lens];
    const compassLabel = getCompassLabel(camera.heading);

    const keywords: string[] = [];

    // 위치
    if (location.name) {
        keywords.push(location.name);
    }

    // 환경
    keywords.push(environment.time.replace('-', ' '));
    keywords.push(environment.weather.replace('-', ' ') + ' sky');
    keywords.push(environment.season);

    // 카메라
    keywords.push(`shot on Nikon D850`);
    keywords.push(`${camera.lens} ${lensSpec.type} lens`);
    keywords.push(camera.aperture);
    keywords.push(`${compassLabel} view`);

    // 스타일
    keywords.push('professional landscape photography');
    keywords.push('National Geographic quality');
    keywords.push('photorealistic');
    keywords.push(lensSpec.dof);

    return keywords.filter(Boolean).join(', ');
}
