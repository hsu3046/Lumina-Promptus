'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, MapPin, Navigation, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSettingsStore } from '@/store/useSettingsStore';

interface Prediction {
    placeId: string;
    mainText: string;
    secondaryText: string;
}

// 좌표 감지 정규식: 48.8584, 2.2945 형식
const COORDINATE_REGEX = /^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/;

// 간단한 세션 토큰 생성
function generateSessionToken(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

export function LocationSearch() {
    const { settings, updateLandscape } = useSettingsStore();
    const [query, setQuery] = useState('');
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [coordinateMatch, setCoordinateMatch] = useState<{ lat: number; lng: number } | null>(null);

    // 세션 토큰 (비용 최적화)
    const sessionTokenRef = useRef<string>(generateSessionToken());
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // 새 세션 시작 (검색 완료 후)
    const resetSessionToken = useCallback(() => {
        sessionTokenRef.current = generateSessionToken();
        console.log('[LocationSearch] New session token:', sessionTokenRef.current);
    }, []);

    // 좌표 적용 함수 (LandscapeLocation 타입에 맞게 coordinates 사용)
    const applyCoordinate = useCallback((lat: number, lng: number) => {
        console.log('[LocationSearch] Applying coordinate:', lat, lng);
        updateLandscape({
            location: {
                ...settings.landscape.location,
                coordinates: {
                    lat,
                    lng,
                },
            },
        });
        setQuery(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        setIsOpen(false);
        setCoordinateMatch(null);
        setPredictions([]);
    }, [settings.landscape.location, updateLandscape]);

    // 1단계: 정규식으로 좌표 감지
    const detectCoordinate = useCallback((input: string): { lat: number; lng: number } | null => {
        const match = input.match(COORDINATE_REGEX);
        if (match) {
            const lat = parseFloat(match[1]);
            const lng = parseFloat(match[2]);
            // 유효한 범위 체크 (위도: -90~90, 경도: -180~180)
            if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
                return { lat, lng };
            }
        }
        return null;
    }, []);

    // 2단계: Places Autocomplete 호출 (세션 토큰 포함)
    const fetchAutocomplete = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim() || searchQuery.length < 2) {
            setPredictions([]);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                query: searchQuery,
                sessionToken: sessionTokenRef.current,
            });

            console.log('[LocationSearch] Fetching autocomplete for:', searchQuery);
            const response = await fetch(`/api/places/autocomplete?${params}`);
            const data = await response.json();

            if (data.predictions && data.predictions.length > 0) {
                setPredictions(data.predictions);
                setIsOpen(true);
                console.log('[LocationSearch] Predictions received:', data.predictions.length);
            } else {
                setPredictions([]);
                setIsOpen(false);
                console.log('[LocationSearch] No predictions found');
            }
        } catch (error) {
            console.error('[LocationSearch] Autocomplete error:', error);
            setPredictions([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 입력 처리 (디바운싱 + 좌표 우선 감지)
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        // 기존 디바운스 취소
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (!value.trim()) {
            setPredictions([]);
            setIsOpen(false);
            setCoordinateMatch(null);
            return;
        }

        // 1단계: 좌표 감지 (즉시, API 호출 없음)
        const coord = detectCoordinate(value);
        if (coord) {
            setCoordinateMatch(coord);
            setPredictions([]);
            setIsOpen(true);
            console.log('[LocationSearch] Coordinate detected:', coord);
            return;
        } else {
            setCoordinateMatch(null);
        }

        // 2단계: Places Autocomplete (디바운싱)
        debounceRef.current = setTimeout(() => {
            fetchAutocomplete(value);
        }, 300);
    }, [detectCoordinate, fetchAutocomplete]);

    // Enter 키 처리 (좌표일 경우 즉시 적용)
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && coordinateMatch) {
            e.preventDefault();
            applyCoordinate(coordinateMatch.lat, coordinateMatch.lng);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    }, [coordinateMatch, applyCoordinate]);

    // 3단계: 장소 선택 시 Place Details 호출 (필드 마스킹 적용)
    const handlePlaceSelect = useCallback(async (prediction: Prediction) => {
        console.log('[LocationSearch] Place selected:', prediction.mainText);
        setIsLoading(true);
        setIsOpen(false);

        try {
            const params = new URLSearchParams({
                placeId: prediction.placeId,
                sessionToken: sessionTokenRef.current,
            });

            const response = await fetch(`/api/places/details?${params}`);
            const data = await response.json();

            if (data.location) {
                updateLandscape({
                    location: {
                        ...settings.landscape.location,
                        coordinates: {
                            lat: data.location.lat,
                            lng: data.location.lng,
                        },
                    },
                });
                setQuery(data.formattedAddress || prediction.mainText);
                console.log('[LocationSearch] Location updated:', data.location);
            }
        } catch (error) {
            console.error('[LocationSearch] Place details error:', error);
        } finally {
            setIsLoading(false);
            // 세션 완료 후 새 토큰 생성
            resetSessionToken();
            setPredictions([]);
        }
    }, [settings.landscape.location, updateLandscape, resetSessionToken]);

    // 외부 클릭 시 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 현재 위치 표시 (null safety, coordinates 구조 사용)
    const lat = settings.landscape?.location?.coordinates?.lat ?? 0;
    const lng = settings.landscape?.location?.coordinates?.lng ?? 0;
    const currentLocation = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

    return (
        <div ref={containerRef} className="relative">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder="장소명 또는 좌표 입력 (예: 48.8584, 2.2945)"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        if (predictions.length > 0 || coordinateMatch) {
                            setIsOpen(true);
                        }
                    }}
                    className="pl-10 pr-10 bg-secondary/50 border-secondary"
                />
                {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
                )}
            </div>

            {/* 현재 좌표 표시 */}
            <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                <Navigation className="w-3 h-3" />
                위도: {lat.toFixed(4)}, 경도: {lng.toFixed(4)}
            </p>

            {/* 드롭다운 메뉴 */}
            {isOpen && (coordinateMatch || predictions.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
                    {/* 좌표 매칭 결과 (API 호출 없이) */}
                    {coordinateMatch && (
                        <button
                            type="button"
                            onClick={() => applyCoordinate(coordinateMatch.lat, coordinateMatch.lng)}
                            className="w-full px-3 py-2 text-left hover:bg-accent/50 transition-colors flex items-center gap-2 border-b border-border"
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

                    {/* Places Autocomplete 결과 */}
                    {predictions.map((prediction) => (
                        <button
                            key={prediction.placeId}
                            type="button"
                            onClick={() => handlePlaceSelect(prediction)}
                            className="w-full px-3 py-2 text-left hover:bg-accent/50 transition-colors flex items-center gap-2"
                        >
                            <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                            <div className="min-w-0">
                                <p className="text-sm font-medium truncate">
                                    {prediction.mainText}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {prediction.secondaryText}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
