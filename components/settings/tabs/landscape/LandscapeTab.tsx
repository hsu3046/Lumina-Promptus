'use client';

import * as React from 'react';
import { useMemo } from 'react';
import { MapPin, Sun, Camera, Compass, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { SectionHeader } from '@/components/ui/section-header';

import { ComboboxField } from '@/components/ui/combobox-field';
import { useSettingsStore } from '@/store/useSettingsStore';
import { CameraTab } from '@/components/settings/tabs/camera/CameraTab';
import { LandmarkInput } from './LandmarkInput';
import { LocationSearch } from './LocationSearch';
import { PlaceDetails } from './PlaceDetails';
import {
    LANDSCAPE_TIME_OPTIONS,
    LANDSCAPE_WEATHER_OPTIONS,
    LANDSCAPE_SEASON_OPTIONS,
} from '@/config/mappings/landscape-environment';
import type { LandscapeSettings } from '@/types/landscape.types';
import { validateEnvironment } from '@/lib/landscape/environment-validator';

// 시간/날씨/계절 옵션 변환
const TIME_OPTIONS = LANDSCAPE_TIME_OPTIONS.map(t => ({
    value: t.value,
    label: t.label,
}));

const WEATHER_OPTIONS = LANDSCAPE_WEATHER_OPTIONS.map(w => ({
    value: w.value,
    label: w.label,
}));

const SEASON_OPTIONS = LANDSCAPE_SEASON_OPTIONS.map(s => ({
    value: s.value,
    label: s.label,
}));

// 분위기 옵션
const LANDSCAPE_ATMOSPHERE_OPTIONS = [
    { value: 'mist', label: '은은한 박무' },
    { value: 'haze', label: '시네마틱 연무' },
    { value: 'clear', label: '투명한 공기' },
    { value: 'grain', label: '아날로그 입자감' },
    { value: 'rays', label: '웅장한 빛내림' },
];

const ATMOSPHERE_OPTIONS = LANDSCAPE_ATMOSPHERE_OPTIONS.map(a => ({
    value: a.value,
    label: a.label,
}));

// 환경 충돌 경고 컴포넌트
function EnvironmentConflictWarning({ season, weather }: { season: string; weather: string }) {
    const conflicts = useMemo(() => {
        return validateEnvironment(
            season as LandscapeSettings['environment']['season'],
            weather as LandscapeSettings['environment']['weather']
        );
    }, [season, weather]);

    if (conflicts.length === 0) return null;

    return (
        <div className="mt-4 p-3 bg-amber-900/30 border border-amber-500/50 rounded-lg">
            <div className="flex items-center gap-2 text-amber-400 text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">설정 조합 주의</span>
            </div>
            <ul className="mt-1 space-y-1">
                {conflicts.map((conflict, i) => (
                    <li key={i} className="text-xs text-amber-300/80 ml-6">
                        • {conflict.message}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function LandscapeTab() {
    const { settings, updateLandscape } = useSettingsStore();
    const landscape = settings.landscape;

    // 고도 업데이트 (카메라 각도와 연관)
    const handleElevationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const elevation = parseFloat(e.target.value) || 0;
        updateLandscape({
            location: { ...landscape.location, elevation },
        } as Partial<LandscapeSettings>);
    };



    // 환경 업데이트
    const handleTimeChange = (value: string) => {
        updateLandscape({
            environment: { ...landscape.environment, time: value as LandscapeSettings['environment']['time'] },
        } as Partial<LandscapeSettings>);
    };

    const handleWeatherChange = (value: string) => {
        updateLandscape({
            environment: { ...landscape.environment, weather: value as LandscapeSettings['environment']['weather'] },
        } as Partial<LandscapeSettings>);
    };

    const handleSeasonChange = (value: string) => {
        updateLandscape({
            environment: { ...landscape.environment, season: value as LandscapeSettings['environment']['season'] },
        } as Partial<LandscapeSettings>);
    };

    const handleAtmosphereChange = (value: string) => {
        updateLandscape({
            environment: { ...landscape.environment, atmosphere: value as LandscapeSettings['environment']['atmosphere'] },
        } as Partial<LandscapeSettings>);
    };

    return (
        <Tabs defaultValue="location" className="w-full">
            {/* Underline 스타일 탭 */}
            <TabsList className="w-full border-b border-zinc-800 p-0 h-auto">
                <TabsTrigger value="location" className="lp-tab-trigger">
                    <MapPin className="w-4 h-4" />
                    장소 설정
                </TabsTrigger>
                <TabsTrigger value="environment" className="lp-tab-trigger">
                    <Sun className="w-4 h-4" />
                    환경 설정
                </TabsTrigger>
                <TabsTrigger value="camera" className="lp-tab-trigger">
                    <Camera className="w-4 h-4" />
                    카메라 설정
                </TabsTrigger>
            </TabsList>

            {/* 장소 설정 탭 */}
            <TabsContent value="location" className="mt-6 space-y-6">
                {/* 위치 검색 섹션 */}
                <section className="space-y-3">
                    <SectionHeader icon={MapPin} title="풍경 검색" />
                    <LocationSearch />
                </section>

                {/* 피사체 + 주변 정보 통합 카드 (장소가 있을 때만 표시) */}
                {landscape.location.name && (
                    <section className="p-4 bg-zinc-800/50 rounded-lg space-y-4 border-2 border-amber-500/70">
                        <PlaceDetails />
                        <hr className="lp-divider" />
                        <LandmarkInput />
                    </section>
                )}

                <hr className="lp-divider" />

                {/* 위치 설정 섹션 */}
                <section className="space-y-5">
                    <SectionHeader icon={Compass} title="촬영 위치" />

                    {/* 촬영 거리 */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label className="text-[10px] text-zinc-500">촬영 거리</Label>
                            <span className="text-xs text-amber-400">
                                {['가까이', '보통', '멀리'][landscape.camera.distance ?? 1]}
                            </span>
                        </div>
                        <Slider
                            value={[landscape.camera.distance ?? 1]}
                            onValueChange={(v) => updateLandscape({
                                camera: { ...landscape.camera, distance: v[0] }
                            })}
                            min={0}
                            max={2}
                            step={1}
                            className="w-full"
                        />
                        <div className="flex justify-between text-[9px] text-zinc-600">
                            <span>가까이</span>
                            <span>보통</span>
                            <span>멀리</span>
                        </div>
                    </div>

                    {/* 촬영 높이 */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label className="text-[10px] text-zinc-500">촬영 높이</Label>
                            <span className="text-xs text-amber-400">
                                {['지면', '고지대', '드론'][landscape.camera.height ?? 0]}
                            </span>
                        </div>
                        <Slider
                            value={[landscape.camera.height ?? 0]}
                            onValueChange={(v) => updateLandscape({
                                camera: { ...landscape.camera, height: v[0] }
                            })}
                            min={0}
                            max={2}
                            step={1}
                            className="w-full"
                        />
                        <div className="flex justify-between text-[9px] text-zinc-600">
                            <span>지면</span>
                            <span>고지대</span>
                            <span>드론</span>
                        </div>
                    </div>

                    {/* 촬영 방향 */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label className="text-[10px] text-zinc-500">촬영 방향</Label>
                            <span className="text-xs text-amber-400">
                                {['좌', '중앙', '우'][landscape.camera.horizontalOffset ?? 1]}
                            </span>
                        </div>
                        <Slider
                            value={[landscape.camera.horizontalOffset ?? 1]}
                            onValueChange={(v) => updateLandscape({
                                camera: { ...landscape.camera, horizontalOffset: v[0] }
                            })}
                            min={0}
                            max={2}
                            step={1}
                            className="w-full"
                        />
                        <div className="flex justify-between text-[9px] text-zinc-600">
                            <span>좌</span>
                            <span>중앙</span>
                            <span>우</span>
                        </div>
                    </div>
                </section>
            </TabsContent>

            {/* 환경 설정 탭 */}
            <TabsContent value="environment" className="mt-6 space-y-4">
                {/* 2열 그리드: 날씨 → 계절 → 시간대 → 분위기 */}
                <div className="grid grid-cols-2 gap-4">
                    {/* 날씨 */}
                    <section className="space-y-2">
                        <Label className="text-xs text-zinc-400">날씨</Label>
                        <ComboboxField
                            label=""
                            options={WEATHER_OPTIONS}
                            value={landscape.environment.weather}
                            onSelect={handleWeatherChange}
                        />
                    </section>

                    {/* 계절 */}
                    <section className="space-y-2">
                        <Label className="text-xs text-zinc-400">계절</Label>
                        <ComboboxField
                            label=""
                            options={SEASON_OPTIONS}
                            value={landscape.environment.season}
                            onSelect={handleSeasonChange}
                        />
                    </section>

                    {/* 시간대 */}
                    <section className="space-y-2">
                        <Label className="text-xs text-zinc-400">시간대</Label>
                        <ComboboxField
                            label=""
                            options={TIME_OPTIONS}
                            value={landscape.environment.time}
                            onSelect={handleTimeChange}
                        />
                    </section>

                    {/* 분위기 */}
                    <section className="space-y-2">
                        <Label className="text-xs text-zinc-400">분위기</Label>
                        <ComboboxField
                            label=""
                            options={ATMOSPHERE_OPTIONS}
                            value={landscape.environment.atmosphere}
                            onSelect={handleAtmosphereChange}
                        />
                    </section>
                </div>

                {/* 환경 설정 충돌 경고 */}
                <EnvironmentConflictWarning season={landscape.environment.season} weather={landscape.environment.weather} />
            </TabsContent>

            {/* 카메라 설정 탭 - 스튜디오와 동일 */}
            <TabsContent value="camera" className="mt-6">
                <CameraTab />
            </TabsContent>
        </Tabs>
    );
}
