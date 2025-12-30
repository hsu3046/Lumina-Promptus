'use client';

import * as React from 'react';
import { MapPin, Compass, Sun, Mountain } from 'lucide-react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Camera02Icon, Sun03Icon } from '@hugeicons/core-free-icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

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
                <TabsTrigger
                    value="location"
                    className="flex-1 gap-2 py-1.5 border-b-2 border-transparent data-[state=active]:border-amber-500 data-[state=active]:text-amber-500 text-zinc-400 hover:text-zinc-200"
                >
                    <MapPin className="w-4 h-4" />
                    장소 설정
                </TabsTrigger>
                <TabsTrigger
                    value="environment"
                    className="flex-1 gap-2 py-1.5 border-b-2 border-transparent data-[state=active]:border-amber-500 data-[state=active]:text-amber-500 text-zinc-400 hover:text-zinc-200"
                >
                    <HugeiconsIcon icon={Sun03Icon} size={16} />
                    환경 설정
                </TabsTrigger>
                <TabsTrigger
                    value="camera"
                    className="flex-1 gap-2 py-1.5 border-b-2 border-transparent data-[state=active]:border-amber-500 data-[state=active]:text-amber-500 text-zinc-400 hover:text-zinc-200"
                >
                    <HugeiconsIcon icon={Camera02Icon} size={16} />
                    카메라 설정
                </TabsTrigger>
            </TabsList>

            {/* 장소 설정 탭 */}
            <TabsContent value="location" className="mt-6 space-y-6">
                {/* 위치 검색 섹션 */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2 text-amber-400">
                        <MapPin className="w-4 h-4" />
                        <h3 className="text-sm font-medium">풍경 검색</h3>
                    </div>
                    <LocationSearch />
                </section>

                {/* 피사체 + 주변 정보 통합 카드 (장소가 있을 때만 표시) */}
                {landscape.location.name && (
                    <section className="p-4 bg-zinc-800/50 rounded-lg space-y-4 border-2 border-amber-500/70">
                        <PlaceDetails />
                        <hr className="border-zinc-700/50" />
                        <LandmarkInput />
                    </section>
                )}

                <hr className="border-zinc-700/50" />

                {/* 위치 설정 섹션 */}
                <section className="space-y-5">
                    <div className="flex items-center gap-2 text-amber-400">
                        <Compass className="w-4 h-4" />
                        <h3 className="text-sm font-medium">촬영 위치</h3>
                    </div>

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
            </TabsContent>

            {/* 카메라 설정 탭 - 스튜디오와 동일 */}
            <TabsContent value="camera" className="mt-6">
                <CameraTab />
            </TabsContent>
        </Tabs>
    );
}
