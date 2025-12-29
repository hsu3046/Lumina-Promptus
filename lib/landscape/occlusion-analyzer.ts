// lib/landscape/occlusion-analyzer.ts
// 카메라-피사체 간 차폐 분석 (Occlusion Analysis)
// 3D 공간에서 장애물 위치와 깊이를 계산하여 AI에 전달

import type { LandscapeLandmark } from '@/types/landscape.types';

/**
 * 차폐 분석 결과
 */
export interface OcclusionAnalysis {
    /** 전경 장애물 (0-50m) */
    foreground: OcclusionObject[];
    /** 중경 물체 (50-500m) */
    middleground: OcclusionObject[];
    /** 배경 (500m+) */
    background: OcclusionObject[];
    /** 주요 피사체까지의 거리 */
    subjectDistance: number | null;
    /** 시야 차폐율 (0-1) */
    occlusionRatio: number;
    /** AI용 공간 설명 */
    spatialDescription: string;
}

/**
 * 장애물/물체 정보
 */
export interface OcclusionObject {
    /** 물체 이름/유형 */
    name: string;
    /** 카메라로부터의 거리 (m) */
    distance: number;
    /** 화면 위치 (left/center/right) */
    screenPosition: 'left' | 'center' | 'right';
    /** 추정 높이 (m) */
    estimatedHeight: number;
    /** 시야 차폐 비율 (0-1) */
    viewBlockage: number;
}

/**
 * 레이어별 거리 범위 (미터)
 */
const LAYER_DISTANCES = {
    foreground: { min: 0, max: 50 },
    middleground: { min: 50, max: 500 },
    background: { min: 500, max: Infinity },
};

/**
 * 랜드마크 목록에서 Occlusion 분석 수행
 * 각 랜드마크를 거리와 방향에 따라 분류
 */
export function analyzeOcclusion(
    landmarks: LandscapeLandmark[],
    cameraHeading: number,
    cameraFov: number = 84  // 24mm 기본 FOV
): OcclusionAnalysis {
    const foreground: OcclusionObject[] = [];
    const middleground: OcclusionObject[] = [];
    const background: OcclusionObject[] = [];

    let totalBlockage = 0;
    let subjectDistance: number | null = null;

    for (const landmark of landmarks) {
        // 화면 위치 계산 (카메라 방향과 랜드마크 방향의 차이)
        const angleDiff = normalizeAngle(landmark.direction - cameraHeading);
        const halfFov = cameraFov / 2;

        // FOV 밖의 물체는 무시
        if (Math.abs(angleDiff) > halfFov) continue;

        // 화면 위치 결정
        let screenPosition: 'left' | 'center' | 'right' = 'center';
        if (angleDiff < -halfFov / 3) screenPosition = 'left';
        else if (angleDiff > halfFov / 3) screenPosition = 'right';

        // 물체 크기에 따른 시야 차폐 추정
        const viewBlockage = estimateViewBlockage(landmark.distance, landmark.layer);

        const occlusionObject: OcclusionObject = {
            name: landmark.name,
            distance: landmark.distance,
            screenPosition,
            estimatedHeight: estimateHeight(landmark.name),
            viewBlockage,
        };

        // 레이어별 분류 (distance 대신 layer 속성 사용)
        switch (landmark.layer) {
            case 'foreground':
                foreground.push(occlusionObject);
                totalBlockage += viewBlockage * 0.3;  // 전경 가중치
                break;
            case 'middleground':
                middleground.push(occlusionObject);
                if (subjectDistance === null) subjectDistance = landmark.distance;
                totalBlockage += viewBlockage * 0.5;  // 중경 가중치 (주요 피사체)
                break;
            case 'background':
                background.push(occlusionObject);
                totalBlockage += viewBlockage * 0.2;  // 배경 가중치
                break;
        }
    }

    // 차폐율을 0-1 범위로 제한
    const occlusionRatio = Math.min(totalBlockage, 1);

    // AI용 공간 설명 생성
    const spatialDescription = generateSpatialDescription(
        foreground,
        middleground,
        background,
        subjectDistance,
        occlusionRatio
    );

    return {
        foreground,
        middleground,
        background,
        subjectDistance,
        occlusionRatio,
        spatialDescription,
    };
}

/**
 * 각도를 -180 ~ 180 범위로 정규화
 */
function normalizeAngle(angle: number): number {
    while (angle > 180) angle -= 360;
    while (angle < -180) angle += 360;
    return angle;
}

/**
 * 물체의 시야 차폐율 추정
 */
function estimateViewBlockage(distance: number, layer: string): number {
    // 가까울수록 더 많은 시야 차폐
    // 레이어가 foreground일수록 더 높은 차폐율
    const distanceFactor = Math.max(0, 1 - distance / 1000);
    const layerFactor = layer === 'foreground' ? 0.8 :
        layer === 'middleground' ? 0.4 : 0.1;
    return distanceFactor * layerFactor;
}

/**
 * 물체 이름으로 높이 추정 (휴리스틱)
 */
function estimateHeight(name: string): number {
    const nameLower = name.toLowerCase();

    // 건물/타워
    if (nameLower.includes('tower') || nameLower.includes('타워')) return 200;
    if (nameLower.includes('building') || nameLower.includes('빌딩')) return 100;
    if (nameLower.includes('skyscraper') || nameLower.includes('마천루')) return 300;

    // 자연물
    if (nameLower.includes('mountain') || nameLower.includes('산')) return 1000;
    if (nameLower.includes('tree') || nameLower.includes('나무')) return 15;
    if (nameLower.includes('hill') || nameLower.includes('언덕')) return 200;

    // 인공 구조물
    if (nameLower.includes('bridge') || nameLower.includes('다리')) return 50;
    if (nameLower.includes('lamp') || nameLower.includes('가로등')) return 8;
    if (nameLower.includes('statue') || nameLower.includes('동상')) return 10;
    if (nameLower.includes('monument') || nameLower.includes('기념비')) return 50;

    // 기본값
    return 20;
}

/**
 * AI용 공간 설명 생성
 */
function generateSpatialDescription(
    foreground: OcclusionObject[],
    middleground: OcclusionObject[],
    background: OcclusionObject[],
    subjectDistance: number | null,
    occlusionRatio: number
): string {
    const lines: string[] = [];

    lines.push('=== SPATIAL CONTEXT (For AI Understanding) ===');
    lines.push('');

    // 전경 설명
    if (foreground.length > 0) {
        lines.push('FOREGROUND (0-50m from camera):');
        for (const obj of foreground) {
            lines.push(`  - ${obj.name}: ${obj.distance}m away, ${obj.screenPosition} side`);
            lines.push(`    Height: ~${obj.estimatedHeight}m, blocks ${(obj.viewBlockage * 100).toFixed(0)}% of view`);
        }
    } else {
        lines.push('FOREGROUND: Clear, no obstructions');
    }
    lines.push('');

    // 중경 설명 (주요 피사체)
    lines.push('MIDDLEGROUND (50-500m, main subjects):');
    if (middleground.length > 0) {
        for (const obj of middleground) {
            lines.push(`  - ${obj.name}: ${obj.distance}m away, ${obj.screenPosition} position`);
            lines.push(`    Estimated height: ${obj.estimatedHeight}m`);
        }
    } else {
        lines.push('  - Open terrain, distant features');
    }
    lines.push('');

    // 배경 설명
    lines.push('BACKGROUND (500m+):');
    if (background.length > 0) {
        for (const obj of background) {
            lines.push(`  - ${obj.name}: ~${(obj.distance / 1000).toFixed(1)}km distant`);
        }
    } else {
        lines.push('  - Horizon, sky, atmospheric haze');
    }
    lines.push('');

    // 차폐 분석 요약
    lines.push('OCCLUSION ANALYSIS:');
    if (occlusionRatio < 0.1) {
        lines.push('  - Clear line of sight to subject');
    } else if (occlusionRatio < 0.3) {
        lines.push('  - Minor foreground elements, mostly unobstructed');
    } else if (occlusionRatio < 0.6) {
        lines.push('  - Moderate foreground obstruction, creates depth');
    } else {
        lines.push('  - Significant foreground framing, shot through elements');
    }

    if (subjectDistance) {
        lines.push(`  - Primary subject at approximately ${subjectDistance}m`);
    }
    lines.push('');

    // AI 지시사항
    lines.push('RENDERING INSTRUCTIONS:');
    lines.push('  1. Maintain correct depth ordering (near objects larger)');
    lines.push('  2. Apply atmospheric perspective for distant objects');
    lines.push('  3. Foreground objects should have sharp focus if in DOF');
    lines.push('  4. Background elements should be slightly hazier');

    return lines.join('\n');
}

/**
 * 간략한 공간 컨텍스트 생성 (프롬프트용)
 */
export function generateCompactSpatialPrompt(analysis: OcclusionAnalysis): string {
    const parts: string[] = [];

    // 전경
    if (analysis.foreground.length > 0) {
        const fgNames = analysis.foreground.map(o => o.name).join(', ');
        parts.push(`Foreground (0-50m): ${fgNames}`);
    }

    // 중경 (주요 피사체)
    if (analysis.middleground.length > 0) {
        const mgItems = analysis.middleground.map(o => `${o.name} at ${o.distance}m`).join(', ');
        parts.push(`Subject Area (50-500m): ${mgItems}`);
    }

    // 배경
    if (analysis.background.length > 0) {
        const bgNames = analysis.background.map(o => o.name).join(', ');
        parts.push(`Background (500m+): ${bgNames}`);
    }

    // 차폐 상태
    if (analysis.occlusionRatio > 0.3) {
        parts.push(`Note: ${(analysis.occlusionRatio * 100).toFixed(0)}% foreground framing`);
    }

    return parts.join('\n');
}
