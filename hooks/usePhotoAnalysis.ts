// hooks/usePhotoAnalysis.ts
// 레퍼런스 사진 분석 → 스튜디오 설정 자동 적용 훅
// Gemini 3.1 Flash API로 분석 후, null 필드는 '__unknown__'으로 변환

import { useState, useCallback } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useApiKeyStore } from '@/store/useApiKeyStore';
import { CAMERA_BODIES } from '@/config/mappings/cameras';
import { LENSES } from '@/config/mappings/lenses';
import type { Lens } from '@/types';

// ===== 분석 불가 특수값 =====
// 평소 드롭다운에 표시되지 않음 (AI 분석 결과로만 조건부 표시)
export const ANALYSIS_UNKNOWN = '__unknown__';

// ===== 분석 상태 타입 =====
export type AnalysisStatus = 'idle' | 'analyzing' | 'done' | 'error';

// ===== 분석 결과 타입 (API 응답) =====
export interface PhotoAnalysisResult {
    // 카메라
    lensCategory: string | null;
    aperture: string | null;
    shutterSpeed: string | null;
    iso: number | null;
    aspectRatio: string | null;
    // 라이팅
    lightingEnabled: boolean | null;
    lightingPattern: string | null;
    lightingKey: string | null;
    lightingRatio: string | null;
    lightingQuality: string | null;
    lightingColorTemp: string | null;
    lightingMood: string | null;
    lightingTimeBase: string | null;
    // 아트디렉션
    compositionRule: string | null;
    cameraAngle: string | null;
    shotType: string | null;
    photoStyleId: string | null;
    // 인물
    gender: string | null;
    ageGroup: string | null;
    skinTone: string | null;
    hairColor: string | null;
    hairStyle: string | null;
    bodyType: string | null;
    // 포즈
    bodyPose: string | null;
    handPose: string | null;
    expression: string | null;
    gazeDirection: string | null;
    // 컬러그레이딩
    grainLevel: number | null;
    vignetting: boolean | null;
    // 배경
    studioBackgroundType: string | null;
}

// ===== 렌즈 카테고리 → 실제 렌즈 ID 매핑 =====
function findBestLensByCategory(category: string): string {
    const categoryMap: Record<string, string[]> = {
        ultra_wide: ['nikon_af_14mm_f28d_ed', 'canon_ef_14mm_f28l_ii', 'sony_gm_14mm_f18'],
        wide: ['nikon_af_s_24mm_f14g_ed', 'canon_rf_24mm_f14', 'sony_gm_24mm_f14'],
        standard: ['nikon_af_s_35mm_f14g', 'canon_rf_35mm_f14l_vcm', 'sony_gm_35mm_f14'],
        medium_telephoto: ['nikon_af_s_85mm_f14g', 'canon_rf_85mm_f12', 'sony_gm_85mm_f14'],
        telephoto: ['nikon_z_135mm_f18s_plena', 'canon_rf_135mm_f18l_is', 'sony_gm_135mm_f18'],
        macro: ['nikon_af_s_105mm_f14e_ed'],
    };

    const candidates = categoryMap[category];
    if (!candidates?.length) return ANALYSIS_UNKNOWN;

    // 현재 선택된 카메라의 마운트에 맞는 렌즈 우선
    const currentBodyId = useSettingsStore.getState().settings.camera.bodyId;
    const currentBody = CAMERA_BODIES.find((b) => b.id === currentBodyId);

    if (currentBody) {
        const mountLens = candidates.find((id) => {
            const lens = LENSES.find((l: Lens) => l.id === id);
            return lens?.mount === currentBody.mount;
        });
        if (mountLens) return mountLens;
    }

    return candidates[0]; // 마운트 매칭 실패 시 첫 번째 후보
}

// ===== null → ANALYSIS_UNKNOWN 변환 헬퍼 =====
function mapValue<T>(value: T | null): T | typeof ANALYSIS_UNKNOWN {
    return value === null ? ANALYSIS_UNKNOWN : value;
}

// ===== 메인 훅 =====
export function usePhotoAnalysis() {
    const [status, setStatus] = useState<AnalysisStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<PhotoAnalysisResult | null>(null);

    const updateCamera = useSettingsStore((s) => s.updateCamera);
    const updateLighting = useSettingsStore((s) => s.updateLighting);
    const updateColorGrading = useSettingsStore((s) => s.updateColorGrading);
    const updateArtDirection = useSettingsStore((s) => s.updateArtDirection);
    const updateUserInput = useSettingsStore((s) => s.updateUserInput);
    const apiKeys = useApiKeyStore((s) => s.apiKeys);

    const analyzePhoto = useCallback(async (imageBase64: string) => {
        const apiKey = apiKeys.gemini;
        if (!apiKey) {
            setError('Gemini API Key가 설정되지 않았습니다.');
            setStatus('error');
            return;
        }

        setStatus('analyzing');
        setError(null);

        try {
            const response = await fetch('/api/analyze-photo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': apiKey,
                },
                body: JSON.stringify({ image: imageBase64 }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `분석 실패 (${response.status})`);
            }

            const { analysis } = await response.json() as { analysis: PhotoAnalysisResult };
            setResult(analysis);

            // ===== Store에 분석 결과 적용 =====

            // 1. 카메라 설정 (바디는 변경하지 않음)
            const cameraUpdate: Record<string, unknown> = {};
            if (analysis.lensCategory !== null) {
                cameraUpdate.lensId = findBestLensByCategory(analysis.lensCategory);
            } else {
                cameraUpdate.lensId = ANALYSIS_UNKNOWN;
            }
            if (analysis.aperture !== null) {
                cameraUpdate.aperture = analysis.aperture;
                cameraUpdate.apertureAuto = false;
            } else {
                cameraUpdate.aperture = ANALYSIS_UNKNOWN;
                cameraUpdate.apertureAuto = false;
            }
            if (analysis.shutterSpeed !== null) {
                cameraUpdate.shutterSpeed = analysis.shutterSpeed;
                cameraUpdate.shutterSpeedAuto = false;
            } else {
                cameraUpdate.shutterSpeed = ANALYSIS_UNKNOWN;
                cameraUpdate.shutterSpeedAuto = false;
            }
            if (analysis.iso !== null) {
                cameraUpdate.iso = analysis.iso;
                cameraUpdate.isoAuto = false;
            } else {
                cameraUpdate.iso = ANALYSIS_UNKNOWN;
                cameraUpdate.isoAuto = false;
            }
            if (analysis.aspectRatio !== null) {
                cameraUpdate.aspectRatio = analysis.aspectRatio;
            } else {
                cameraUpdate.aspectRatio = ANALYSIS_UNKNOWN;
            }
            updateCamera(cameraUpdate);

            // 2. 라이팅 설정
            updateLighting({
                enabled: analysis.lightingEnabled ?? true,
                pattern: mapValue(analysis.lightingPattern) as any,
                key: mapValue(analysis.lightingKey) as any,
                ratio: mapValue(analysis.lightingRatio) as any,
                quality: mapValue(analysis.lightingQuality) as any,
                colorTemp: mapValue(analysis.lightingColorTemp) as any,
                mood: mapValue(analysis.lightingMood) as any,
                timeBase: mapValue(analysis.lightingTimeBase) as any,
            });

            // 3. 아트디렉션
            updateArtDirection({
                compositionRule: mapValue(analysis.compositionRule),
                cameraAngle: mapValue(analysis.cameraAngle),
                shotType: mapValue(analysis.shotType),
                photoStyleId: analysis.photoStyleId ?? undefined,
            });

            // 4. 컬러그레이딩
            updateColorGrading({
                grainLevel: analysis.grainLevel ?? 0,
                vignetting: analysis.vignetting ?? false,
            });

            // 5. 인물 설정 (StudioSubject 업데이트)
            const currentSubjects = useSettingsStore.getState().settings.userInput.studioSubjects;
            if (currentSubjects.length > 0) {
                const updatedSubject = {
                    ...currentSubjects[0],
                    autoMode: false,
                    gender: mapValue(analysis.gender) as any,
                    ageGroup: mapValue(analysis.ageGroup) as any,
                    skinTone: mapValue(analysis.skinTone) as any,
                    hairColor: mapValue(analysis.hairColor) as any,
                    hairStyle: mapValue(analysis.hairStyle) as any,
                    bodyType: mapValue(analysis.bodyType) as any,
                    bodyPose: mapValue(analysis.bodyPose) as any,
                    handPose: mapValue(analysis.handPose) as any,
                    expression: mapValue(analysis.expression) as any,
                    gazeDirection: mapValue(analysis.gazeDirection) as any,
                };

                // shotType → studioComposition 매핑
                // UI에서 제외된 extreme-close-up → close-up, long-shot → full-shot 폴백
                const shotTypeToComposition: Record<string, string> = {
                    'extreme-close-up': 'close-up',
                    'close-up': 'close-up',
                    'bust-shot': 'bust-shot',
                    'waist-shot': 'waist-shot',
                    'half-shot': 'half-shot',
                    'three-quarter-shot': 'three-quarter-shot',
                    'full-shot': 'full-shot',
                    'long-shot': 'full-shot',
                };
                const mappedComposition = analysis.shotType
                    ? shotTypeToComposition[analysis.shotType]
                    : undefined;

                updateUserInput({
                    studioSubjects: [updatedSubject, ...currentSubjects.slice(1)],
                    studioBackgroundType: mapValue(analysis.studioBackgroundType),
                    ...(mappedComposition && { studioComposition: mappedComposition }),
                });
            }

            setStatus('done');
        } catch (err) {
            console.error('사진 분석 에러:', err);
            setError(err instanceof Error ? err.message : '알 수 없는 오류');
            setStatus('error');
        }
    }, [apiKeys, updateCamera, updateLighting, updateColorGrading, updateArtDirection, updateUserInput]);

    const resetAnalysis = useCallback(() => {
        setStatus('idle');
        setError(null);
        setResult(null);
    }, []);

    return {
        status,
        error,
        result,
        analyzePhoto,
        resetAnalysis,
        ANALYSIS_UNKNOWN,
    };
}
