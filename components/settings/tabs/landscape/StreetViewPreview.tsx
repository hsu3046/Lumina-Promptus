'use client';

import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Eye, Loader2, Navigation, AlertCircle } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { getCompassLabel } from '@/config/mappings/landscape-environment';

// Google Maps API 콜백을 위한 전역 선언
declare global {
    interface Window {
        initStreetViewCallback?: () => void;
        googleMapsApiLoaded?: boolean;
    }
}

/**
 * 인터랙티브 Street View 미리보기 컴포넌트
 * Google Maps JavaScript API의 StreetViewPanorama 사용
 * 이동 화살표, 드래그 회전, 줌 기능 내장
 */
export function StreetViewPreview() {
    const { settings, updateLandscape } = useSettingsStore();
    const { landscape } = settings;

    const containerRef = useRef<HTMLDivElement>(null);
    const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);
    const lastCoordsRef = useRef({ lat: 0, lng: 0 });
    const apiCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isApiLoaded, setIsApiLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const hasApiKey = apiKey && apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE';

    // interval 정리 헬퍼 함수
    const clearApiCheckInterval = useCallback(() => {
        if (apiCheckIntervalRef.current) {
            clearInterval(apiCheckIntervalRef.current);
            apiCheckIntervalRef.current = null;
        }
    }, []);

    // Google Maps API 동적 로드 (싱글톤 패턴)
    const loadGoogleMapsApi = useCallback(() => {
        // 이미 로드 완료된 경우
        if (window.google?.maps) {
            setIsApiLoaded(true);
            window.googleMapsApiLoaded = true;
            return;
        }

        // 이미 로드 중이거나 스크립트가 존재하는 경우 - 대기
        if (window.googleMapsApiLoaded === false || document.querySelector('script[src*="maps.googleapis.com"]')) {
            clearApiCheckInterval();
            apiCheckIntervalRef.current = setInterval(() => {
                if (window.google?.maps) {
                    clearApiCheckInterval();
                    setIsApiLoaded(true);
                    window.googleMapsApiLoaded = true;
                }
            }, 100);
            return;
        }

        // 새로 로드 시작
        window.googleMapsApiLoaded = false;

        window.initStreetViewCallback = () => {
            clearApiCheckInterval();
            setIsApiLoaded(true);
            window.googleMapsApiLoaded = true;
        };

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initStreetViewCallback&libraries=streetView`;
        script.async = true;
        script.defer = true;
        script.onerror = () => {
            setError('Google Maps API 로드 실패');
            setIsLoading(false);
        };
        document.head.appendChild(script);
    }, [apiKey, clearApiCheckInterval]);

    // API 로드 + 컴포넌트 언마운트 시 interval 정리
    useEffect(() => {
        if (hasApiKey && !isApiLoaded) {
            loadGoogleMapsApi();
        }

        // Cleanup: interval 정리
        return () => {
            clearApiCheckInterval();
        };
    }, [hasApiKey, loadGoogleMapsApi, isApiLoaded, clearApiCheckInterval]);

    // StreetViewPanorama 초기화 및 정리
    useEffect(() => {
        if (!isApiLoaded || !containerRef.current || !window.google?.maps) return;

        const { lat, lng } = landscape.location.coordinates;
        const { heading, pitch } = landscape.camera;

        // 기존 panorama 정리 (재초기화 지원)
        if (panoramaRef.current) {
            try {
                // 이벤트 리스너 제거
                window.google.maps.event.clearInstanceListeners(panoramaRef.current);
                // DOM에서 제거 (WebGL 컨텍스트 해제)
                panoramaRef.current.setVisible(false);
            } catch (e) {
                console.warn('[StreetViewPreview] Cleanup warning:', e);
            }
            panoramaRef.current = null;
        }

        lastCoordsRef.current = { lat, lng };
        setIsLoading(true);
        setError(null);

        try {
            const panorama = new window.google.maps.StreetViewPanorama(
                containerRef.current,
                {
                    position: { lat, lng },
                    pov: { heading, pitch },
                    zoom: 1,
                    controlSize: 32,
                    addressControl: false,
                    showRoadLabels: true,
                    zoomControl: true,
                    panControl: true,
                    linksControl: true,
                    clickToGo: true,
                    fullscreenControl: true,
                    motionTracking: false,
                    motionTrackingControl: false,
                    keyboardShortcuts: false,
                } as google.maps.StreetViewPanoramaOptions
            );

            // 위치 변경 이벤트 - Store 업데이트
            panorama.addListener('position_changed', () => {
                const position = panorama.getPosition();
                if (position) {
                    const newLat = position.lat();
                    const newLng = position.lng();

                    if (
                        Math.abs(newLat - lastCoordsRef.current.lat) > 0.00001 ||
                        Math.abs(newLng - lastCoordsRef.current.lng) > 0.00001
                    ) {
                        lastCoordsRef.current = { lat: newLat, lng: newLng };
                        updateLandscape({
                            location: {
                                ...landscape.location,
                                coordinates: { lat: newLat, lng: newLng },
                            },
                        });
                    }
                }
            });

            // POV 변경 이벤트 - 카메라 방향 업데이트
            panorama.addListener('pov_changed', () => {
                const pov = panorama.getPov();
                if (pov) {
                    const newHeading = Math.round(pov.heading);
                    const newPitch = Math.round(pov.pitch);

                    if (
                        newHeading !== landscape.camera.heading ||
                        newPitch !== landscape.camera.pitch
                    ) {
                        updateLandscape({
                            camera: {
                                ...landscape.camera,
                                heading: newHeading,
                                pitch: newPitch,
                            },
                        });
                    }
                }
            });

            // Pano ID 변경 이벤트 - 캡처 시 동기화용
            panorama.addListener('pano_changed', () => {
                const panoId = panorama.getPano();
                if (panoId && panoId !== landscape.currentPanoId) {
                    updateLandscape({ currentPanoId: panoId });
                }
            });

            // 초기 Pano ID 저장
            const initialPanoId = panorama.getPano();
            if (initialPanoId) {
                updateLandscape({ currentPanoId: initialPanoId });
            }

            panoramaRef.current = panorama;
            setIsLoading(false);
            setError(null);

        } catch (err) {
            console.error('[StreetViewPreview] Error:', err);
            setError('Street View를 로드할 수 없습니다.');
            setIsLoading(false);
        }

        // Cleanup 함수 - 컴포넌트 언마운트 또는 재초기화 시 실행
        return () => {
            if (panoramaRef.current) {
                try {
                    window.google?.maps?.event.clearInstanceListeners(panoramaRef.current);
                    panoramaRef.current.setVisible(false);
                } catch (e) {
                    console.warn('[StreetViewPreview] Unmount cleanup warning:', e);
                }
                panoramaRef.current = null;
            }
        };
    }, [isApiLoaded]); // isApiLoaded 변경 시에만 재실행

    // 외부에서 좌표 변경 시 파노라마 위치 업데이트
    useEffect(() => {
        if (!panoramaRef.current) return;

        const { lat, lng } = landscape.location.coordinates;

        // 현재 파노라마 위치와 비교
        if (
            Math.abs(lat - lastCoordsRef.current.lat) > 0.00001 ||
            Math.abs(lng - lastCoordsRef.current.lng) > 0.00001
        ) {
            lastCoordsRef.current = { lat, lng };
            panoramaRef.current.setPosition({ lat, lng });
        }
    }, [landscape.location.coordinates.lat, landscape.location.coordinates.lng]);

    // 외부에서 heading/pitch 변경 시 파노라마 업데이트
    useEffect(() => {
        if (panoramaRef.current) {
            const currentPov = panoramaRef.current.getPov();
            if (
                currentPov &&
                (Math.round(currentPov.heading) !== landscape.camera.heading ||
                    Math.round(currentPov.pitch) !== landscape.camera.pitch)
            ) {
                panoramaRef.current.setPov({
                    heading: landscape.camera.heading,
                    pitch: landscape.camera.pitch,
                });
            }
        }
    }, [landscape.camera.heading, landscape.camera.pitch]);

    const compassLabel = getCompassLabel(landscape.camera.heading);

    return (
        <section className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400">
                    <Eye className="w-4 h-4" />
                    <h3 className="text-sm font-medium">Street View 미리보기</h3>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                    <Navigation className="w-3 h-3" />
                    <span>클릭으로 이동 가능</span>
                </div>
            </div>

            {/* 인터랙티브 파노라마 */}
            <div
                className="relative rounded-lg overflow-hidden border border-zinc-700 bg-zinc-900"
                style={{ ['--hide-keyboard' as string]: 'none' }}
            >
                {/* 키보드 쇼트컷 버튼 숨기기 CSS */}
                <style>{`
                    .gm-iv-container .gm-keyboard-shortcuts,
                    .gm-iv-container a[href*="keyboard-shortcuts"] {
                        display: none !important;
                    }
                `}</style>
                {(isLoading || !isApiLoaded) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 z-10">
                        <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/90 z-10 gap-2">
                        <AlertCircle className="w-6 h-6 text-red-400" />
                        <p className="text-xs text-red-400">{error}</p>
                        <p className="text-[10px] text-zinc-500">잠시 후 다시 시도해주세요</p>
                    </div>
                )}

                <div
                    ref={containerRef}
                    className="w-full aspect-[3/2]"
                    style={{ minHeight: '250px' }}
                />
            </div>

            {/* 메타 정보 */}
            <div className="flex justify-between text-[10px] text-zinc-500">
                <span>
                    위도: {landscape.location.coordinates.lat.toFixed(4)}, 경도: {landscape.location.coordinates.lng.toFixed(4)}
                </span>
                <span>방향: {landscape.camera.heading}° ({compassLabel}) • 기울기: {landscape.camera.pitch}°</span>
            </div>

            {!hasApiKey && (
                <p className="text-[10px] text-amber-500/70 text-center">
                    ⚠️ .env.local에 NEXT_PUBLIC_GOOGLE_MAPS_API_KEY를 설정하세요
                </p>
            )}
        </section>
    );
}
