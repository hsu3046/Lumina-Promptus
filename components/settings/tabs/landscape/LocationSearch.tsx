'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, MapPin, Navigation, Loader2, Trees, Landmark, Palette, Camera, Church, Building, Mountain, Waves } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSettingsStore } from '@/store/useSettingsStore';

interface SearchResult {
    placeId: string;
    name: string;
    lat: number;
    lng: number;
    types: string[];
    address: string | null;
}

// 좌표 감지 정규식: 48.8584, 2.2945 형식
const COORDINATE_REGEX = /^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/;

export function LocationSearch() {
    const { settings, updateLandscape } = useSettingsStore();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [coordinateMatch, setCoordinateMatch] = useState<{ lat: number; lng: number } | null>(null);
    const [selectedIndex, setSelectedIndex] = useState(-1); // 키보드 선택 인덱스

    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // 장소 적용 함수 (types, address 포함, 영어 이름 + Knowledge Graph)
    const applyPlace = useCallback(async (place: { lat: number; lng: number; name?: string; placeId?: string; types?: string[]; address?: string | null }) => {
        console.log('[LocationSearch] Applying place:', place.name || 'coordinates');

        // UI 상태 먼저 정리
        setQuery(place.name || `${place.lat.toFixed(6)}, ${place.lng.toFixed(6)}`);
        setIsOpen(false);
        setCoordinateMatch(null);
        setResults([]);
        setSelectedIndex(-1);

        // placeId가 있으면 Knowledge Graph까지 가져온 후 한 번에 업데이트
        if (place.placeId && place.name) {
            try {
                // 1. 영어 이름/주소 가져오기
                const detailsRes = await fetch(`/api/places/details?placeId=${place.placeId}&lang=en`);
                const detailsData = await detailsRes.json();

                // 2. 영어 이름으로 Knowledge Graph 검색
                const searchName = detailsData.name || place.name;
                console.log('[LocationSearch] Querying Knowledge Graph with:', searchName);

                const knowledgeRes = await fetch(`/api/knowledge-graph?query=${encodeURIComponent(searchName)}`);
                const knowledgeData = await knowledgeRes.json();

                console.log('[LocationSearch] Knowledge Graph score:', knowledgeData.score);

                // 모든 정보를 한 번에 업데이트 (깜빡임 방지)
                updateLandscape({
                    location: {
                        ...settings.landscape.location,
                        name: place.name || `${place.lat.toFixed(4)}, ${place.lng.toFixed(4)}`,
                        nameEn: detailsData.name || undefined,
                        coordinates: { lat: place.lat, lng: place.lng },
                        types: place.types || [],
                        address: detailsData.formattedAddress || place.address || null,
                        // Knowledge Graph 정보 (명시적 초기화 - 이전 데이터 잔여 방지)
                        knowledgeScore: knowledgeData.score || 0,
                        knowledgeDescription: knowledgeData.description || undefined,
                        knowledgeContext: knowledgeData.detailedDescription || undefined,
                        knowledgeImageUrl: knowledgeData.imageUrl || undefined,
                    },
                    landmarks: [],  // 이전 장소의 랜드마크 삭제
                });
            } catch (error) {
                console.error('[LocationSearch] Failed to fetch additional data:', error);
                // 에러 시 기본 정보만 업데이트 (이전 Knowledge 데이터 정리)
                updateLandscape({
                    location: {
                        ...settings.landscape.location,
                        name: place.name || `${place.lat.toFixed(4)}, ${place.lng.toFixed(4)}`,
                        coordinates: { lat: place.lat, lng: place.lng },
                        types: place.types || [],
                        address: place.address || null,
                        knowledgeScore: 0,
                        knowledgeDescription: undefined,
                        knowledgeContext: undefined,
                        knowledgeImageUrl: undefined,
                    },
                    landmarks: [],
                });
            }
        } else {
            // placeId 없는 경우 (좌표 직접 입력 등) - 이전 Knowledge 데이터 정리
            updateLandscape({
                location: {
                    ...settings.landscape.location,
                    name: place.name || `${place.lat.toFixed(4)}, ${place.lng.toFixed(4)}`,
                    nameEn: undefined,
                    coordinates: { lat: place.lat, lng: place.lng },
                    types: place.types || [],
                    address: place.address || null,
                    knowledgeScore: 0,
                    knowledgeDescription: undefined,
                    knowledgeContext: undefined,
                    knowledgeImageUrl: undefined,
                },
                landmarks: [],
            });
        }
    }, [settings.landscape.location, updateLandscape]);

    // 좌표 감지
    const detectCoordinate = useCallback((input: string): { lat: number; lng: number } | null => {
        const match = input.match(COORDINATE_REGEX);
        if (match) {
            const lat = parseFloat(match[1]);
            const lng = parseFloat(match[2]);
            if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
                return { lat, lng };
            }
        }
        return null;
    }, []);

    // Text Search API 호출 (사진 명소 필터링)
    const fetchTextSearch = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim() || searchQuery.length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        try {
            console.log('[LocationSearch] Text Search for:', searchQuery);

            const response = await fetch('/api/places/textsearch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: searchQuery }),
            });

            const data = await response.json();

            if (data.places && data.places.length > 0) {
                setResults(data.places);
                setIsOpen(true);
                setSelectedIndex(-1);
                console.log('[LocationSearch] Results:', data.places.length);
            } else {
                setResults([]);
                setIsOpen(false);
                console.log('[LocationSearch] No results found');
            }
        } catch (error) {
            console.error('[LocationSearch] Search error:', error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 입력 처리 (디바운싱 + 좌표 우선 감지)
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        setSelectedIndex(-1);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (!value.trim()) {
            setResults([]);
            setIsOpen(false);
            setCoordinateMatch(null);
            return;
        }

        // 좌표 감지 (즉시, API 호출 없음)
        const coord = detectCoordinate(value);
        if (coord) {
            setCoordinateMatch(coord);
            setResults([]);
            setIsOpen(true);
            return;
        } else {
            setCoordinateMatch(null);
        }

        // Text Search (디바운싱)
        debounceRef.current = setTimeout(() => {
            fetchTextSearch(value);
        }, 400);
    }, [detectCoordinate, fetchTextSearch]);

    // 전체 아이템 수 (좌표 + 검색 결과)
    const totalItems = (coordinateMatch ? 1 : 0) + results.length;

    // 키보드 네비게이션
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen || totalItems === 0) {
            if (e.key === 'Enter' && query.trim()) {
                e.preventDefault();
                fetchTextSearch(query);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => Math.min(prev + 1, totalItems - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => Math.max(prev - 1, -1));
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex === -1) {
                    // 선택된 항목 없으면 첫 번째 선택
                    if (coordinateMatch) {
                        applyPlace({ lat: coordinateMatch.lat, lng: coordinateMatch.lng });
                    } else if (results.length > 0) {
                        applyPlace(results[0]);
                    }
                } else if (coordinateMatch && selectedIndex === 0) {
                    applyPlace({ lat: coordinateMatch.lat, lng: coordinateMatch.lng });
                } else {
                    const resultIndex = coordinateMatch ? selectedIndex - 1 : selectedIndex;
                    if (results[resultIndex]) {
                        applyPlace(results[resultIndex]);
                    }
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setSelectedIndex(-1);
                break;
        }
    }, [isOpen, totalItems, selectedIndex, coordinateMatch, results, query, fetchTextSearch, applyPlace]);

    // 선택된 항목 스크롤
    useEffect(() => {
        if (selectedIndex >= 0 && listRef.current) {
            const items = listRef.current.querySelectorAll('[data-item]');
            const selectedItem = items[selectedIndex] as HTMLElement;
            if (selectedItem) {
                selectedItem.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [selectedIndex]);

    // 장소 선택
    const handlePlaceSelect = useCallback((place: SearchResult) => {
        console.log('[LocationSearch] Place selected:', place.name);
        applyPlace(place);
    }, [applyPlace]);

    // 외부 클릭 시 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSelectedIndex(-1);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const lat = settings.landscape?.location?.coordinates?.lat ?? 0;
    const lng = settings.landscape?.location?.coordinates?.lng ?? 0;

    return (
        <div ref={containerRef} className="relative">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder="사진 명소 검색 또는 좌표 입력"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        if (results.length > 0 || coordinateMatch) {
                            setIsOpen(true);
                        }
                    }}
                    className="pl-10 pr-10 bg-secondary/50 border-secondary"
                />
                {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
                )}
            </div>

            {/* 좌표 표시 */}
            <div className="flex items-center justify-end mt-2">
                <span className="text-[10px] text-zinc-600 flex items-center gap-1">
                    <Navigation className="w-3 h-3" />
                    {lat.toFixed(4)}, {lng.toFixed(4)}
                </span>
            </div>

            {/* 드롭다운 메뉴 */}
            {isOpen && (coordinateMatch || results.length > 0) && (
                <div ref={listRef} className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
                    {/* 좌표 매칭 결과 */}
                    {coordinateMatch && (
                        <button
                            type="button"
                            data-item
                            onClick={() => applyPlace({ lat: coordinateMatch.lat, lng: coordinateMatch.lng })}
                            className={`w-full px-3 py-2 text-left transition-colors flex items-center gap-2 border-b border-border ${selectedIndex === 0 ? 'bg-accent' : 'hover:bg-accent/50'
                                }`}
                        >
                            <Navigation className="w-4 h-4 text-amber-500 shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-amber-500">
                                    좌표로 이동
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {coordinateMatch.lat.toFixed(6)}, {coordinateMatch.lng.toFixed(6)}
                                </p>
                            </div>
                        </button>
                    )}

                    {/* Text Search 결과 */}
                    {results.map((place, index) => {
                        const itemIndex = coordinateMatch ? index + 1 : index;

                        // Google Places API 타입에 따른 Lucide 아이콘
                        const getTypeIcon = (types: string[]) => {
                            // 자연/공원
                            if (types.some(t => ['park', 'national_park', 'state_park', 'garden', 'botanical_garden', 'dog_park', 'hiking_area', 'wildlife_park', 'wildlife_refuge'].includes(t))) {
                                return <Trees className="w-4 h-4 text-green-500" />;
                            }
                            // 해변
                            if (types.includes('beach')) {
                                return <Waves className="w-4 h-4 text-cyan-500" />;
                            }
                            // 산/자연 지형
                            if (types.some(t => ['natural_feature', 'mountain', 'campground'].includes(t))) {
                                return <Mountain className="w-4 h-4 text-emerald-500" />;
                            }
                            // 문화재/기념비
                            if (types.some(t => ['monument', 'cultural_landmark', 'historical_landmark', 'historical_place', 'sculpture'].includes(t))) {
                                return <Landmark className="w-4 h-4 text-amber-500" />;
                            }
                            // 박물관/미술관
                            if (types.some(t => ['museum', 'art_gallery', 'art_studio'].includes(t))) {
                                return <Palette className="w-4 h-4 text-purple-500" />;
                            }
                            // 종교 시설
                            if (types.some(t => ['church', 'mosque', 'hindu_temple', 'synagogue', 'place_of_worship'].includes(t))) {
                                return <Church className="w-4 h-4 text-indigo-500" />;
                            }
                            // 관광 명소
                            if (types.includes('tourist_attraction')) {
                                return <Camera className="w-4 h-4 text-rose-500" />;
                            }
                            // 건물/시설
                            if (types.some(t => ['building', 'stadium', 'auditorium', 'observation_deck', 'aquarium', 'zoo'].includes(t))) {
                                return <Building className="w-4 h-4 text-zinc-500" />;
                            }
                            // 기본
                            return <MapPin className="w-4 h-4 text-zinc-400" />;
                        };

                        return (
                            <button
                                key={place.placeId}
                                type="button"
                                data-item
                                onClick={() => handlePlaceSelect(place)}
                                className={`w-full px-3 py-2 text-left transition-colors flex items-center gap-2 ${selectedIndex === itemIndex ? 'bg-accent' : 'hover:bg-accent/50'
                                    }`}
                            >
                                <span className="shrink-0">{getTypeIcon(place.types)}</span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium truncate">
                                        {place.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {place.address || `${place.lat.toFixed(4)}, ${place.lng.toFixed(4)}`}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
