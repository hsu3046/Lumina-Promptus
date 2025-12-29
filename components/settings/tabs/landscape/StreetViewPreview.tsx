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
    const isInitializedRef = useRef(false);
    const lastCoordsRef = useRef({ lat: 0, lng: 0 });

    const [isLoading, setIsLoading] = useState(true);
    const [isApiLoaded, setIsApiLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const hasApiKey = apiKey && apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE';

    // Google Maps API 동적 로드 (싱글톤 패턴)
    const loadGoogleMapsApi = useCallback(() => {
        // 이미 로드 완료된 경우
        if (window.google?.maps) {
            setIsApiLoaded(true);
            window.googleMapsApiLoaded = true;
            return;
        }

        // 이미 로드 중인 경우 - 콜백 등록 후 대기
        if (window.googleMapsApiLoaded === false) {
            const checkInterval = setInterval(() => {
                if (window.google?.maps) {
                    clearInterval(checkInterval);
                    setIsApiLoaded(true);
                    window.googleMapsApiLoaded = true;
                }
            }, 100);
            return;
        }

        // 스크립트가 존재하는 경우 - 로드 대기
        if (document.querySelector('script[src*="maps.googleapis.com"]')) {
            const checkInterval = setInterval(() => {
                if (window.google?.maps) {
                    clearInterval(checkInterval);
                    setIsApiLoaded(true);
                    window.googleMapsApiLoaded = true;
                }
            }, 100);
            return;
        }

        // 새로 로드 시작
        window.googleMapsApiLoaded = false;

        window.initStreetViewCallback = () => {
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
    }, [apiKey]);

    // API 로드 (1회만)
    useEffect(() => {
        if (hasApiKey && !isApiLoaded) {
            loadGoogleMapsApi();
        }
    }, [hasApiKey, loadGoogleMapsApi, isApiLoaded]);

    // StreetViewPanorama 초기화 (1회만)
    useEffect(() => {
        if (!isApiLoaded || !containerRef.current || !window.google?.maps || isInitializedRef.current) return;

        const { lat, lng } = landscape.location.coordinates;
        const { heading, pitch } = landscape.camera;

        // 초기화 플래그 설정
        isInitializedRef.current = true;
        lastCoordsRef.current = { lat, lng };

        try {
            const panorama = new window.google.maps.StreetViewPanorama(
                containerRef.current,
                {
                    position: { lat, lng },
                    pov: { heading, pitch },
                    zoom: 1,
                    addressControl: false,
                    showRoadLabels: false,
                    zoomControl: true,
                    panControl: true,
                    linksControl: true,
                    fullscreenControl: false,
                    motionTracking: false,
                    motionTrackingControl: false,
                }
            );

            // 위치 변경 이벤트 - Store 업데이트
            panorama.addListener('position_changed', () => {
                const position = panorama.getPosition();
                if (position) {
                    const newLat = position.lat();
                    const newLng = position.lng();

                    // 중복 업데이트 방지
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

            panoramaRef.current = panorama;
            setIsLoading(false);
            setError(null);

        } catch (err) {
            console.error('[StreetViewPreview] Error:', err);
            setError('Street View를 로드할 수 없습니다.');
            setIsLoading(false);
        }
    }, [isApiLoaded]); // 의존성을 isApiLoaded만으로 제한 - 1회만 실행

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
            <div className="relative rounded-lg overflow-hidden border border-zinc-700 bg-zinc-900">
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
                    {landscape.location.coordinates.lat.toFixed(4)}, {landscape.location.coordinates.lng.toFixed(4)}
                </span>
                <span>{compassLabel} • {landscape.camera.heading}° • Pitch {landscape.camera.pitch}°</span>
            </div>

            {!hasApiKey && (
                <p className="text-[10px] text-amber-500/70 text-center">
                    ⚠️ .env.local에 NEXT_PUBLIC_GOOGLE_MAPS_API_KEY를 설정하세요
                </p>
            )}
        </section>
    );
}
