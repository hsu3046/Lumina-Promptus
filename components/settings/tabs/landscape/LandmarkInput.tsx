'use client';

import * as React from 'react';
import { Mountain, Loader2, Trees, Waves, Landmark, Palette, Church, Camera, Building, MapPin } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { SectionHeader } from '@/components/ui/section-header';
import { useSettingsStore } from '@/store/useSettingsStore';
import type { LandscapeLandmark, LandscapeSettings } from '@/types/landscape.types';

type LandmarkLayer = 'foreground' | 'middleground' | 'background';

const LAYER_CONFIG: Record<LandmarkLayer, { label: string; desc: string; distanceRange: string }> = {
    foreground: { label: '근경', desc: 'Foreground', distanceRange: '0~50m' },
    middleground: { label: '중경', desc: 'Midground', distanceRange: '50~500m' },
    background: { label: '원경', desc: 'Background', distanceRange: '500m+' },
};

const LAYER_ORDER: LandmarkLayer[] = ['foreground', 'middleground', 'background'];

interface NearbyPlace {
    placeId: string;
    name: string;
    distance: number;
    bearing: number;
    layer: LandmarkLayer;
    types: string[];
}

// 타입별 아이콘
const getTypeIcon = (types: string[]) => {
    if (types.some(t => ['park', 'natural_feature', 'national_park', 'garden', 'hiking_area'].includes(t))) {
        return <Trees className="w-3.5 h-3.5 text-green-500 shrink-0" />;
    }
    if (types.includes('beach')) {
        return <Waves className="w-3.5 h-3.5 text-cyan-500 shrink-0" />;
    }
    if (types.some(t => ['monument', 'cultural_landmark', 'historical_landmark'].includes(t))) {
        return <Landmark className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
    }
    if (types.some(t => ['museum', 'art_gallery'].includes(t))) {
        return <Palette className="w-3.5 h-3.5 text-purple-500 shrink-0" />;
    }
    if (types.some(t => ['church', 'mosque', 'hindu_temple', 'place_of_worship'].includes(t))) {
        return <Church className="w-3.5 h-3.5 text-indigo-500 shrink-0" />;
    }
    if (types.includes('tourist_attraction')) {
        return <Camera className="w-3.5 h-3.5 text-rose-500 shrink-0" />;
    }
    if (types.some(t => ['building', 'stadium', 'observation_deck'].includes(t))) {
        return <Building className="w-3.5 h-3.5 text-zinc-500 shrink-0" />;
    }
    return <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />;
};

// 카메라 방향 기준 상대 방향 계산
const getRelativeDirection = (bearing: number, cameraHeading: number): 'left' | 'center' | 'right' => {
    let diff = bearing - cameraHeading;
    while (diff > 180) diff -= 360;
    while (diff < -180) diff += 360;

    if (diff < -30) return 'left';
    if (diff > 30) return 'right';
    return 'center';
};

// 촬영 높이별 설정 (0=지면, 1=고지대, 2=드론)
const HEIGHT_CONFIG: Record<number, { radius: number; visibleLayers: LandmarkLayer[] }> = {
    0: { radius: 5000, visibleLayers: ['foreground', 'middleground', 'background'] },
    1: { radius: 10000, visibleLayers: ['middleground', 'background'] }, // 고지대: 근경 제외
    2: { radius: 15000, visibleLayers: ['background'] }, // 드론: 원경만
};

// Nearby Search API가 이미 영어 이름을 반환하므로 별도 fetch 불필요

export function LandmarkInput() {
    const { settings, updateLandscape } = useSettingsStore();
    const landmarks = settings.landscape.landmarks || [];
    const [isSearching, setIsSearching] = React.useState(false);
    const [cachedPlaceName, setCachedPlaceName] = React.useState<string | null>(null);
    // 높이별 캐시: { 0: landmarks[], 1: landmarks[], 2: landmarks[] }
    const [cache, setCache] = React.useState<Record<number, LandscapeLandmark[]>>({});

    const cameraHeading = settings.landscape.camera.heading;
    const cameraHeight = settings.landscape.camera.height ?? 0; // 0=지면, 1=고지대, 2=드론

    const { lat, lng } = settings.landscape.location.coordinates;
    const currentPlaceName = settings.landscape.location.name || '';
    const hasCoordinates = lat !== 0 || lng !== 0;

    // Knowledge Graph 인지도 점수 (유명 장소 판단용)
    // undefined = 아직 로딩 중, 0 = 검색 결과 없음, >0 = 인지도 점수
    const knowledgeScore = settings.landscape.location.knowledgeScore;
    const isWellKnownPlace = (knowledgeScore ?? 0) >= 500;  // 500점 이상이면 유명 장소

    // 높이별 설정 가져오기
    const heightConfig = HEIGHT_CONFIG[cameraHeight] ?? HEIGHT_CONFIG[0];

    // 현재 높이에서 보여줄 레이어만 필터링
    const getLandmarksByLayer = (layer: LandmarkLayer) =>
        heightConfig.visibleLayers.includes(layer)
            ? landmarks.filter((lm) => lm.layer === layer)
            : [];

    // 랜드마크 활성/비활성 토글
    const toggleLandmark = (index: number) => {
        const updated = landmarks.map((lm, i) =>
            i === index ? { ...lm, enabled: !lm.enabled } : lm
        );
        updateLandscape({ landmarks: updated } as Partial<LandscapeSettings>);
    };

    const getGlobalIndex = (layer: LandmarkLayer, localIndex: number) => {
        let count = 0;
        for (let i = 0; i < landmarks.length; i++) {
            if (landmarks[i].layer === layer) {
                if (count === localIndex) return i;
                count++;
            }
        }
        return -1;
    };

    // 주변 검색 API 호출 (높이 기반 반경)
    const searchNearby = React.useCallback(async (height: number) => {
        console.log(`[LandmarkInput] ⚠️ searchNearby CALLED! height=${height}, isWellKnownPlace=${isWellKnownPlace}, score=${knowledgeScore}`);

        if (!hasCoordinates || !currentPlaceName) return;

        // 유명 장소면 Nearby Search 스킵 (AI가 알아서 잘 그림)
        if (isWellKnownPlace) {
            console.log(`[LandmarkInput] Skipping Nearby Search for famous place (score: ${knowledgeScore})`);
            updateLandscape({ landmarks: [] } as Partial<LandscapeSettings>);
            return;
        }

        console.log(`[LandmarkInput] 🚀 ACTUALLY CALLING nearbysearch API!`);

        const config = HEIGHT_CONFIG[height] ?? HEIGHT_CONFIG[0];
        setIsSearching(true);

        try {
            const response = await fetch('/api/places/nearbysearch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lat, lng, radius: config.radius }),
            });

            const data = await response.json();

            if (data.places && data.places.length > 0) {
                const newLandmarks: LandscapeLandmark[] = [];

                for (const layer of LAYER_ORDER) {
                    const layerPlaces = (data.places as NearbyPlace[])
                        .filter((p) => p.layer === layer)
                        .filter((p) => p.name !== currentPlaceName)
                        .filter((p) => p.distance >= 10)
                        .slice(0, 3);

                    for (const place of layerPlaces) {
                        const relativeDir = getRelativeDirection(place.bearing, cameraHeading);
                        newLandmarks.push({
                            name: place.name,  // 영어 이름 (API에서 lang=en으로 반환)
                            nameEn: place.name,  // 프롬프트용 영어 이름 (동일)
                            placeId: place.placeId,
                            distance: place.distance,
                            direction: place.bearing,
                            layer,
                            types: place.types,
                            relativeDirection: relativeDir,
                            enabled: true,
                        });
                    }
                }

                // 캐시에 저장
                setCache(prev => ({ ...prev, [height]: newLandmarks }));

                // 현재 높이와 같으면 바로 적용
                if (height === cameraHeight) {
                    updateLandscape({ landmarks: newLandmarks } as Partial<LandscapeSettings>);
                    // 영어 이름은 Nearby Search에서 이미 반환됨 (추가 API 호출 불필요)
                }
            }
        } catch (error) {
            console.error('[LandmarkInput] Search error:', error);
        } finally {
            setIsSearching(false);
        }
    }, [hasCoordinates, currentPlaceName, lat, lng, cameraHeading, cameraHeight, updateLandscape, isWellKnownPlace, knowledgeScore]);

    // 장소 또는 높이 변경 시 처리 (통합)
    const landmarksLen = landmarks.length; // 의존성 안정화
    React.useEffect(() => {
        if (!currentPlaceName) return;

        // 유명 장소 체크
        const isFamous = (knowledgeScore ?? 0) >= 500;
        if (isFamous) {
            console.log(`[LandmarkInput] Famous place detected (score: ${knowledgeScore}), skipping Nearby Search`);
            // 랜드마크 초기화 (캐시는 건드리지 않음 - 무한루프 방지)
            if (landmarksLen > 0) {
                updateLandscape({ landmarks: [] } as Partial<LandscapeSettings>);
            }
            setCachedPlaceName(currentPlaceName);
            return;
        }

        // Case 1: 탭 전환 - 기존 landmarks 있으면 스킵
        if (landmarksLen > 0 && cachedPlaceName === null) {
            setCachedPlaceName(currentPlaceName);
            return;
        }

        // Case 2: 장소 변경 - 캐시 초기화 후 새로 검색
        if (currentPlaceName !== cachedPlaceName) {
            setCache({});
            setCachedPlaceName(currentPlaceName);
            searchNearby(cameraHeight);
            return;
        }

        // Case 3: 높이 변경 - 캐시 확인 후 필요시 검색
        if (cache[cameraHeight]) {
            updateLandscape({ landmarks: cache[cameraHeight] } as Partial<LandscapeSettings>);
        } else if (landmarksLen === 0) {
            searchNearby(cameraHeight);
        }
    }, [currentPlaceName, cachedPlaceName, cameraHeight, cache, landmarksLen, searchNearby, updateLandscape, knowledgeScore]);

    // Knowledge Graph 정보 (유명 장소 표시용)
    const knowledgeDescription = settings.landscape.location.knowledgeDescription;
    const knowledgeContext = settings.landscape.location.knowledgeContext;
    const knowledgeImageUrl = settings.landscape.location.knowledgeImageUrl;

    return (
        <section className="space-y-3">
            {/* 일반 장소일 때만 헤더 표시 */}
            {!isWellKnownPlace && (
                <SectionHeader icon={Mountain} title="주변 정보">
                    {isSearching && <Loader2 className="w-3 h-3 animate-spin text-zinc-500" />}
                </SectionHeader>
            )}

            {/* 유명 장소: 심플한 Knowledge 카드 */}
            {isWellKnownPlace ? (
                <div className="flex gap-3">
                    {/* 썸네일 이미지 */}
                    {knowledgeImageUrl && (
                        <div className="flex-shrink-0">
                            <img
                                src={knowledgeImageUrl}
                                alt="Place thumbnail"
                                className="w-16 h-16 object-cover rounded-md"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                        </div>
                    )}
                    {/* 설명 */}
                    <div className="flex-1 min-w-0 space-y-1">
                        {knowledgeDescription && (
                            <p className="text-xs text-zinc-300">{knowledgeDescription}</p>
                        )}
                        {knowledgeContext && (
                            <p className="text-[10px] text-zinc-400 line-clamp-3">{knowledgeContext}</p>
                        )}
                    </div>
                </div>
            ) : (
                /* 일반 장소: 기존 랜드마크 표시 */
                <div className="space-y-3">
                    {LAYER_ORDER.map((layer) => {
                        const layerLandmarks = getLandmarksByLayer(layer);
                        const config = LAYER_CONFIG[layer];

                        return (
                            <div key={layer} className="space-y-1.5">
                                <Label className="text-[10px] text-zinc-500">
                                    {config.label} ({config.desc}) · {config.distanceRange}
                                </Label>

                                {layerLandmarks.length === 0 ? (
                                    <p className="text-[10px] text-zinc-600 italic pl-2">없음</p>
                                ) : (
                                    <div className="space-y-1">
                                        {layerLandmarks.map((lm, localIdx) => {
                                            const globalIdx = getGlobalIndex(layer, localIdx);
                                            const dirLabel = lm.relativeDirection === 'left' ? '←'
                                                : lm.relativeDirection === 'right' ? '→' : '';
                                            const isEnabled = lm.enabled !== false;

                                            return (
                                                <div
                                                    key={globalIdx}
                                                    onClick={() => toggleLandmark(globalIdx)}
                                                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors cursor-pointer hover:bg-zinc-700/50 ${isEnabled
                                                        ? 'bg-zinc-800/50'
                                                        : 'bg-zinc-900/30 opacity-50'
                                                        }`}
                                                >
                                                    {lm.types && lm.types.length > 0 ? (
                                                        getTypeIcon(lm.types)
                                                    ) : (
                                                        <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                                    )}
                                                    <span className={`flex-1 text-xs truncate ${isEnabled ? 'text-zinc-200' : 'text-zinc-500'}`}>
                                                        {lm.name}
                                                    </span>
                                                    <span className="text-[10px] text-zinc-500 shrink-0">
                                                        {dirLabel} {lm.distance}m
                                                    </span>
                                                    <Checkbox
                                                        checked={isEnabled}
                                                        onCheckedChange={() => toggleLandmark(globalIdx)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="h-3.5 w-3.5 border-zinc-600"
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
