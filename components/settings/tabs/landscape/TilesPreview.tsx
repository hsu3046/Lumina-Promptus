'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Loader2, Camera, Building2, Mountain, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useSettingsStore } from '@/store/useSettingsStore';

/** CesiumJS 타입 (동적 임포트용) */
type CesiumType = typeof import('cesium');
type ViewerType = InstanceType<CesiumType['Viewer']>;

/**
 * Google Photorealistic 3D Tiles 미리보기 컴포넌트
 * - clampToHeightMostDetailed로 지형 높이 자동 감지
 * - 높이 오프셋 슬라이더
 * - 확대된 미리보기 크기
 */
export function TilesPreview() {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<ViewerType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cesiumModule, setCesiumModule] = useState<CesiumType | null>(null);
    const [isDetectingTerrain, setIsDetectingTerrain] = useState(false);

    const { settings, updateLandscape } = useSettingsStore();
    const { location, camera: cameraSettings } = settings.landscape;

    const heightOffset = cameraSettings.heightOffset ?? 2;
    const detectedTerrainHeight = cameraSettings.detectedTerrainHeight;

    // CesiumJS 동적 로드
    const loadCesium = useCallback(async () => {
        if (cesiumModule) return cesiumModule;

        setIsLoading(true);
        setError(null);

        try {
            // Cesium CSS 로드
            if (!document.querySelector('link[href*="cesium"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://cesium.com/downloads/cesiumjs/releases/1.123/Build/Cesium/Widgets/widgets.css';
                document.head.appendChild(link);
            }

            const Cesium = await import('cesium');

            const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
            if (!apiKey) {
                throw new Error('Google Maps API key not configured');
            }

            (window as unknown as { CESIUM_BASE_URL: string }).CESIUM_BASE_URL =
                'https://cesium.com/downloads/cesiumjs/releases/1.123/Build/Cesium/';

            setCesiumModule(Cesium);
            return Cesium;
        } catch (err) {
            console.error('[TilesPreview] Failed to load Cesium:', err);
            setError(err instanceof Error ? err.message : 'Failed to load 3D viewer');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [cesiumModule]);

    // 지형 높이 감지 (clampToHeightMostDetailed)
    const detectTerrainHeight = useCallback(async () => {
        if (!viewerRef.current || !cesiumModule) return;

        setIsDetectingTerrain(true);

        try {
            const lat = location?.coordinates?.lat ?? 37.5665;
            const lng = location?.coordinates?.lng ?? 126.9780;

            // 현재 위치의 Cartesian3 생성
            const position = cesiumModule.Cartesian3.fromDegrees(lng, lat, 0);

            // 3D Tiles 표면 높이 샘플링
            const clampedPositions = await viewerRef.current.scene.clampToHeightMostDetailed([position]);

            if (clampedPositions && clampedPositions[0]) {
                const cartographic = cesiumModule.Cartographic.fromCartesian(clampedPositions[0]);
                const terrainHeight = Math.round(cartographic.height);

                console.log(`[TilesPreview] Detected terrain height: ${terrainHeight}m`);

                updateLandscape({
                    camera: {
                        ...cameraSettings,
                        detectedTerrainHeight: terrainHeight,
                    },
                });

                // 카메라 위치 업데이트
                updateCameraWithTerrainHeight(cesiumModule, viewerRef.current, terrainHeight);
            }
        } catch (err) {
            console.warn('[TilesPreview] Terrain detection failed:', err);
        } finally {
            setIsDetectingTerrain(false);
        }
    }, [cesiumModule, location, cameraSettings, updateLandscape]);

    // 카메라 위치 업데이트 (지형 높이 + 오프셋)
    const updateCameraWithTerrainHeight = useCallback((
        Cesium: CesiumType,
        viewer: ViewerType,
        terrainHeight?: number
    ) => {
        const lat = location?.coordinates?.lat ?? 37.5665;
        const lng = location?.coordinates?.lng ?? 126.9780;
        const heading = cameraSettings?.heading ?? 0;
        const pitch = cameraSettings?.pitch ?? -15;
        const offset = cameraSettings?.heightOffset ?? 2;

        // 지형 높이 + 사용자 오프셋
        const baseHeight = terrainHeight ?? cameraSettings.detectedTerrainHeight ?? 50;
        const cameraHeight = baseHeight + offset;

        viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(lng, lat, cameraHeight),
            orientation: {
                heading: Cesium.Math.toRadians(heading),
                pitch: Cesium.Math.toRadians(pitch),
                roll: 0,
            },
        });
    }, [location, cameraSettings]);

    // 뷰어 초기화
    const initializeViewer = useCallback(async () => {
        if (!containerRef.current) return;

        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
            setError('WebGL을 지원하지 않는 브라우저입니다.');
            return;
        }

        const Cesium = await loadCesium();
        if (!Cesium) return;

        // 기존 뷰어 정리
        if (viewerRef.current) {
            try {
                viewerRef.current.destroy();
            } catch (e) {
                console.warn('[TilesPreview] Viewer destroy error:', e);
            }
            viewerRef.current = null;
        }

        setIsLoading(true);
        setError(null);

        try {
            const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

            const viewer = new Cesium.Viewer(containerRef.current, {
                timeline: false,
                animation: false,
                sceneModePicker: false,
                baseLayerPicker: false,
                fullscreenButton: false,
                vrButton: false,
                homeButton: false,
                navigationHelpButton: false,
                infoBox: false,
                selectionIndicator: false,
                geocoder: false,
                globe: false,
                skyBox: false,
                skyAtmosphere: false,
            });

            // 3D Tiles 로드
            try {
                const tileset = await Cesium.Cesium3DTileset.fromUrl(
                    `https://tile.googleapis.com/v1/3dtiles/root.json?key=${apiKey}`,
                    { showCreditsOnScreen: true, maximumScreenSpaceError: 8 }
                );
                viewer.scene.primitives.add(tileset);
            } catch (e) {
                console.error('[TilesPreview] Failed to load 3D Tiles:', e);
                setError('3D Tiles 로드 실패. API 키를 확인하세요.');
            }

            // 하늘 효과
            try {
                viewer.scene.skyAtmosphere = new Cesium.SkyAtmosphere();
                viewer.scene.skyAtmosphere.show = true;
            } catch (e) {
                console.warn('[TilesPreview] Sky atmosphere error:', e);
            }

            viewerRef.current = viewer;
            setIsReady(true);
            setError(null);

            // 초기 카메라 위치 설정
            updateCameraWithTerrainHeight(Cesium, viewer, cameraSettings.detectedTerrainHeight);

            // 자동 지형 높이 감지 (1초 후 - 타일 로딩 대기)
            setTimeout(() => {
                detectTerrainHeight();
            }, 2000);

        } catch (err) {
            console.error('[TilesPreview] Viewer initialization error:', err);
            setError('3D 뷰어 초기화에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    }, [loadCesium, cameraSettings, updateCameraWithTerrainHeight, detectTerrainHeight]);

    // 높이 오프셋 변경 핸들러
    const handleHeightOffsetChange = useCallback((value: number[]) => {
        updateLandscape({
            camera: {
                ...cameraSettings,
                heightOffset: value[0],
            },
        });
    }, [cameraSettings, updateLandscape]);

    // 오프셋 변경 시 카메라 업데이트
    useEffect(() => {
        if (viewerRef.current && cesiumModule) {
            updateCameraWithTerrainHeight(cesiumModule, viewerRef.current, cameraSettings.detectedTerrainHeight);
        }
    }, [heightOffset, cesiumModule, cameraSettings.detectedTerrainHeight, updateCameraWithTerrainHeight]);

    // 위치 변경 시 지형 높이 초기화 및 재감지
    useEffect(() => {
        if (isReady && cesiumModule && viewerRef.current) {
            // 위치 변경 시 지형 높이 초기화
            updateLandscape({
                camera: {
                    ...cameraSettings,
                    detectedTerrainHeight: undefined,
                },
            });

            // 카메라 이동 후 지형 높이 재감지
            updateCameraWithTerrainHeight(cesiumModule, viewerRef.current, 50); // 임시 높이
            setTimeout(detectTerrainHeight, 2000);
        }
    }, [location?.coordinates?.lat, location?.coordinates?.lng]);

    // 컴포넌트 언마운트 시 정리
    useEffect(() => {
        return () => {
            if (viewerRef.current) {
                viewerRef.current.destroy();
                viewerRef.current = null;
            }
        };
    }, []);

    // 스크린샷 캡처
    const captureScreenshot = useCallback(() => {
        if (!viewerRef.current) return;
        viewerRef.current.render();
        const dataUrl = viewerRef.current.canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `3d-view-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
    }, []);

    const totalCameraHeight = (detectedTerrainHeight ?? 0) + heightOffset;

    return (
        <section className="space-y-3">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400">
                    <Building2 className="w-4 h-4" />
                    <h3 className="text-sm font-medium">3D 공간 미리보기</h3>
                </div>

                <div className="flex items-center gap-2">
                    {isReady && (
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={detectTerrainHeight}
                            disabled={isDetectingTerrain}
                            className="text-xs"
                        >
                            <Mountain className="w-3 h-3 mr-1" />
                            {isDetectingTerrain ? '감지 중...' : '지형 감지'}
                        </Button>
                    )}

                    {!isReady && !isLoading && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={initializeViewer}
                            className="text-xs"
                        >
                            3D 뷰 로드
                        </Button>
                    )}

                    {isReady && (
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={captureScreenshot}
                            className="text-xs"
                        >
                            <Camera className="w-3 h-3 mr-1" />
                            캡처
                        </Button>
                    )}
                </div>
            </div>

            {/* 미리보기 컨테이너 (확대) */}
            <div
                ref={containerRef}
                className="relative rounded-lg overflow-hidden bg-zinc-900"
                style={{ width: '100%', height: '400px' }}
            >
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/80 z-10">
                        <div className="text-center">
                            <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto mb-2" />
                            <p className="text-xs text-zinc-400">3D 타일 로딩 중...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/90 z-10">
                        <div className="text-center p-4">
                            <p className="text-xs text-red-400 mb-2">{error}</p>
                            <Button size="sm" variant="outline" onClick={initializeViewer} className="text-xs">
                                다시 시도
                            </Button>
                        </div>
                    </div>
                )}

                {!isReady && !isLoading && !error && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <Building2 className="w-12 h-12 text-zinc-700 mx-auto mb-2" />
                            <p className="text-xs text-zinc-500">"3D 뷰 로드" 버튼을 클릭하세요</p>
                        </div>
                    </div>
                )}
            </div>

            {/* 높이 오프셋 조절 */}
            {isReady && (
                <div className="space-y-3 p-3 bg-zinc-800/50 rounded-lg">
                    {/* 높이 슬라이더 */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-zinc-400">
                                <ArrowUp className="w-4 h-4" />
                                <span className="text-xs">카메라 높이</span>
                            </div>
                            <span className="text-xs text-amber-400 font-mono">+{heightOffset}m</span>
                        </div>

                        <Slider
                            value={[heightOffset]}
                            onValueChange={handleHeightOffsetChange}
                            min={0}
                            max={500}
                            step={5}
                            className="w-full"
                        />
                        <div className="flex justify-between text-[10px] text-zinc-600">
                            <span>0m (지면)</span>
                            <span>500m (Bird&apos;s eye)</span>
                        </div>
                    </div>

                    {/* 앵글(Pitch) 슬라이더 */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-zinc-400">
                                <span className="text-xs">📐 카메라 앵글</span>
                            </div>
                            <span className="text-xs text-amber-400 font-mono">{cameraSettings.pitch}°</span>
                        </div>

                        <Slider
                            value={[cameraSettings.pitch]}
                            onValueChange={(value) => {
                                updateLandscape({
                                    camera: { ...cameraSettings, pitch: value[0] },
                                });
                            }}
                            min={-90}
                            max={90}
                            step={5}
                            className="w-full"
                        />
                        <div className="flex justify-between text-[10px] text-zinc-600">
                            <span>-90° (직하방)</span>
                            <span>0° (수평)</span>
                            <span>+90° (상방)</span>
                        </div>
                    </div>

                    {/* 지형 높이 정보 */}
                    <div className="flex justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-700/50">
                        <span>
                            {detectedTerrainHeight !== undefined
                                ? `🏔️ 지형: ${detectedTerrainHeight}m`
                                : '⏳ 미감지'}
                        </span>
                        <span>📷 총 고도: {totalCameraHeight}m</span>
                    </div>
                </div>
            )}

            {isReady && (
                <p className="text-[10px] text-zinc-500">
                    마우스로 드래그하여 회전, 스크롤하여 확대/축소
                </p>
            )}
        </section>
    );
}
