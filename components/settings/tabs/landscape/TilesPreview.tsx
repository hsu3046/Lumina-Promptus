'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Loader2, Camera, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/store/useSettingsStore';

/** CesiumJS 타입 (동적 임포트용) */
type CesiumType = typeof import('cesium');
type ViewerType = InstanceType<CesiumType['Viewer']>;

interface TilesPreviewProps {
    width?: number;
    height?: number;
    className?: string;
}

/**
 * Google Photorealistic 3D Tiles 미리보기 컴포넌트
 * CesiumJS를 동적으로 로드하여 번들 크기 최적화
 */
export function TilesPreview({
    width = 400,
    height = 300,
    className = ''
}: TilesPreviewProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<ViewerType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cesiumModule, setCesiumModule] = useState<CesiumType | null>(null);

    const { settings } = useSettingsStore();
    const { location, camera: cameraSettings } = settings.landscape;

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

            // Cesium JS 동적 임포트
            const Cesium = await import('cesium');

            // Google Maps API 키 설정
            const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
            if (!apiKey) {
                throw new Error('Google Maps API key not configured');
            }

            // Cesium 경로 설정 (Assets)
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

    // 뷰어 초기화
    const initializeViewer = useCallback(async () => {
        if (!containerRef.current) return;

        // WebGL 지원 확인
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
            setError('WebGL을 지원하지 않는 브라우저입니다.');
            return;
        }

        // WebGL 컨텍스트 제한 확인 (너무 많은 탭이 열려있는 경우)
        const maxContexts = 16; // 대부분의 브라우저 한계
        const existingCanvases = document.querySelectorAll('canvas');
        if (existingCanvases.length > maxContexts - 2) {
            setError('브라우저 WebGL 컨텍스트 제한에 도달했습니다. 다른 탭을 닫아주세요.');
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

            // Cesium Viewer 생성 (WebGL 오류 핸들링 추가)
            let viewer: ViewerType;
            try {
                viewer = new Cesium.Viewer(containerRef.current, {
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
                    // 기본 지구본 비활성화 (3D Tiles가 지형 포함)
                    globe: false,
                    skyBox: false,
                    skyAtmosphere: false,
                });
            } catch (viewerError) {
                console.error('[TilesPreview] Viewer creation failed:', viewerError);
                const errorMsg = viewerError instanceof Error ? viewerError.message : '';
                if (errorMsg.includes('WebGL')) {
                    setError('WebGL 초기화 실패. 다른 브라우저 탭을 닫고 다시 시도하세요.');
                } else {
                    setError('3D 뷰어 생성 실패. 브라우저를 새로고침해보세요.');
                }
                setIsLoading(false);
                return;
            }

            // 화면 크기 조절
            viewer.canvas.style.width = `${width}px`;
            viewer.canvas.style.height = `${height}px`;

            // Google Photorealistic 3D Tiles 로드
            try {
                const tileset = await Cesium.Cesium3DTileset.fromUrl(
                    `https://tile.googleapis.com/v1/3dtiles/root.json?key=${apiKey}`,
                    {
                        showCreditsOnScreen: true,
                    }
                );
                viewer.scene.primitives.add(tileset);
                console.log('[TilesPreview] 3D Tiles loaded successfully');
            } catch (tileError) {
                console.error('[TilesPreview] Failed to load 3D Tiles:', tileError);
                // 3D Tiles 로드 실패해도 뷰어는 유지
                setError('3D Tiles 로드 실패. API 키를 확인하세요.');
            }

            // 하늘 표시
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
            updateCameraPosition(Cesium, viewer);

        } catch (err) {
            console.error('[TilesPreview] Viewer initialization error:', err);
            setError('3D 뷰어 초기화에 실패했습니다. 페이지를 새로고침해보세요.');
        } finally {
            setIsLoading(false);
        }
    }, [loadCesium, width, height, location, cameraSettings]);

    // 카메라 위치 업데이트
    const updateCameraPosition = useCallback((
        Cesium: CesiumType,
        viewer: ViewerType
    ) => {
        const lat = location?.coordinates?.lat ?? 37.5665;
        const lng = location?.coordinates?.lng ?? 126.9780;
        const elevation = location?.elevation ?? 100;
        const heading = cameraSettings?.heading ?? 0;
        const pitch = cameraSettings?.pitch ?? -15;

        viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(lng, lat, elevation + 50),
            orientation: {
                heading: Cesium.Math.toRadians(heading),
                pitch: Cesium.Math.toRadians(pitch),
                roll: 0,
            },
        });
    }, [location, cameraSettings]);

    // 위치/카메라 변경 시 업데이트
    useEffect(() => {
        if (viewerRef.current && cesiumModule) {
            updateCameraPosition(cesiumModule, viewerRef.current);
        }
    }, [location, cameraSettings, cesiumModule, updateCameraPosition]);

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
        const canvas = viewerRef.current.canvas;
        const dataUrl = canvas.toDataURL('image/png');

        // 다운로드
        const link = document.createElement('a');
        link.download = `3d-view-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
    }, []);

    return (
        <section className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400">
                    <Building2 className="w-4 h-4" />
                    <h3 className="text-sm font-medium">3D 공간 미리보기</h3>
                </div>

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

            <div
                ref={containerRef}
                className={`relative rounded-lg overflow-hidden bg-zinc-900 ${className}`}
                style={{ width, height }}
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
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={initializeViewer}
                                className="text-xs"
                            >
                                다시 시도
                            </Button>
                        </div>
                    </div>
                )}

                {!isReady && !isLoading && !error && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <Building2 className="w-12 h-12 text-zinc-700 mx-auto mb-2" />
                            <p className="text-xs text-zinc-500">
                                "3D 뷰 로드" 버튼을 클릭하세요
                            </p>
                            <p className="text-[10px] text-zinc-600 mt-1">
                                Google Photorealistic 3D Tiles
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {isReady && (
                <p className="text-[10px] text-zinc-500">
                    마우스로 드래그하여 회전, 스크롤하여 확대/축소
                </p>
            )}
        </section>
    );
}
