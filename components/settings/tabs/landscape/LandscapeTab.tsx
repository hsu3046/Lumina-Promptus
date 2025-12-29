'use client';

import * as React from 'react';
import { MapPin, Compass, Sun } from 'lucide-react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Camera02Icon, Sun03Icon } from '@hugeicons/core-free-icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { ComboboxField } from '@/components/ui/combobox-field';
import { useSettingsStore } from '@/store/useSettingsStore';
import { CameraTab } from '@/components/settings/tabs/camera/CameraTab';
import {
    LANDSCAPE_TIME_OPTIONS,
    LANDSCAPE_WEATHER_OPTIONS,
    LANDSCAPE_SEASON_OPTIONS,
    getCompassLabel,
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

export function LandscapeTab() {
    const { settings, updateLandscape } = useSettingsStore();
    const landscape = settings.landscape;

    // 위치 업데이트
    const handleLocationNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateLandscape({
            location: { ...landscape.location, name: e.target.value },
        } as Partial<LandscapeSettings>);
    };

    const handleLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const lat = parseFloat(e.target.value) || 0;
        updateLandscape({
            location: {
                ...landscape.location,
                coordinates: { ...landscape.location.coordinates, lat },
            },
        } as Partial<LandscapeSettings>);
    };

    const handleLngChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const lng = parseFloat(e.target.value) || 0;
        updateLandscape({
            location: {
                ...landscape.location,
                coordinates: { ...landscape.location.coordinates, lng },
            },
        } as Partial<LandscapeSettings>);
    };

    const handleElevationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const elevation = parseFloat(e.target.value) || 0;
        updateLandscape({
            location: { ...landscape.location, elevation },
        } as Partial<LandscapeSettings>);
    };

    // 각도 업데이트
    const handleHeadingChange = (value: number[]) => {
        updateLandscape({
            camera: { ...landscape.camera, heading: value[0] },
        } as Partial<LandscapeSettings>);
    };

    const handlePitchChange = (value: number[]) => {
        updateLandscape({
            camera: { ...landscape.camera, pitch: value[0] },
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

    const compassLabel = getCompassLabel(landscape.camera.heading);

    return (
        <Tabs defaultValue="location" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="location" className="gap-2 data-[state=active]:!text-amber-500">
                    <MapPin className="w-4 h-4" />
                    장소 설정
                </TabsTrigger>
                <TabsTrigger value="environment" className="gap-2 data-[state=active]:!text-amber-500">
                    <HugeiconsIcon icon={Sun03Icon} size={16} />
                    환경 설정
                </TabsTrigger>
                <TabsTrigger value="camera" className="gap-2 data-[state=active]:!text-amber-500">
                    <HugeiconsIcon icon={Camera02Icon} size={16} />
                    카메라 설정
                </TabsTrigger>
            </TabsList>

            {/* 장소 설정 탭 */}
            <TabsContent value="location" className="mt-6 space-y-6">
                {/* 위치 섹션 */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2 text-amber-400">
                        <MapPin className="w-4 h-4" />
                        <h3 className="text-sm font-medium">위치</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                            <Label className="text-[10px] text-zinc-500 block mb-1">장소명</Label>
                            <Input
                                value={landscape.location.name}
                                onChange={handleLocationNameChange}
                                placeholder="예: 서울 남산타워"
                                className="h-8 bg-zinc-950 border-zinc-800 text-xs"
                            />
                        </div>

                        <div>
                            <Label className="text-[10px] text-zinc-500 block mb-1">위도 (Lat)</Label>
                            <Input
                                type="number"
                                step="0.0001"
                                value={landscape.location.coordinates.lat}
                                onChange={handleLatChange}
                                className="h-8 bg-zinc-950 border-zinc-800 text-xs"
                            />
                        </div>

                        <div>
                            <Label className="text-[10px] text-zinc-500 block mb-1">경도 (Lng)</Label>
                            <Input
                                type="number"
                                step="0.0001"
                                value={landscape.location.coordinates.lng}
                                onChange={handleLngChange}
                                className="h-8 bg-zinc-950 border-zinc-800 text-xs"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <Label className="text-[10px] text-zinc-500 block mb-1">고도 (m)</Label>
                            <Input
                                type="number"
                                value={landscape.location.elevation}
                                onChange={handleElevationChange}
                                className="h-8 bg-zinc-950 border-zinc-800 text-xs"
                            />
                        </div>
                    </div>
                </section>

                <hr className="border-zinc-700/50" />

                {/* 카메라 각도 섹션 */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2 text-amber-400">
                        <Compass className="w-4 h-4" />
                        <h3 className="text-sm font-medium">카메라 각도</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <Label className="text-[10px] text-zinc-500">방향 (Heading)</Label>
                                <span className="text-xs text-amber-400">{landscape.camera.heading}° • {compassLabel}</span>
                            </div>
                            <Slider
                                value={[landscape.camera.heading]}
                                onValueChange={handleHeadingChange}
                                min={0}
                                max={360}
                                step={1}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <Label className="text-[10px] text-zinc-500">기울기 (Pitch)</Label>
                                <span className="text-xs text-amber-400">{landscape.camera.pitch}°</span>
                            </div>
                            <Slider
                                value={[landscape.camera.pitch]}
                                onValueChange={handlePitchChange}
                                min={-90}
                                max={90}
                                step={1}
                                className="w-full"
                            />
                        </div>
                    </div>
                </section>
            </TabsContent>

            {/* 환경 설정 탭 */}
            <TabsContent value="environment" className="mt-6 space-y-6">
                <section className="space-y-3">
                    <div className="flex items-center gap-2 text-amber-400">
                        <Sun className="w-4 h-4" />
                        <h3 className="text-sm font-medium">시간대</h3>
                    </div>
                    <ComboboxField
                        label=""
                        options={TIME_OPTIONS}
                        value={landscape.environment.time}
                        onSelect={handleTimeChange}
                    />
                    <p className="text-[10px] text-zinc-500">
                        {LANDSCAPE_TIME_OPTIONS.find(t => t.value === landscape.environment.time)?.desc}
                    </p>
                </section>

                <hr className="border-zinc-700/50" />

                <section className="space-y-3">
                    <div className="flex items-center gap-2 text-amber-400">
                        <Sun className="w-4 h-4" />
                        <h3 className="text-sm font-medium">날씨</h3>
                    </div>
                    <ComboboxField
                        label=""
                        options={WEATHER_OPTIONS}
                        value={landscape.environment.weather}
                        onSelect={handleWeatherChange}
                    />
                    <p className="text-[10px] text-zinc-500">
                        {LANDSCAPE_WEATHER_OPTIONS.find(w => w.value === landscape.environment.weather)?.desc}
                    </p>
                </section>

                <hr className="border-zinc-700/50" />

                <section className="space-y-3">
                    <div className="flex items-center gap-2 text-amber-400">
                        <Sun className="w-4 h-4" />
                        <h3 className="text-sm font-medium">계절</h3>
                    </div>
                    <ComboboxField
                        label=""
                        options={SEASON_OPTIONS}
                        value={landscape.environment.season}
                        onSelect={handleSeasonChange}
                    />
                    <p className="text-[10px] text-zinc-500">
                        {LANDSCAPE_SEASON_OPTIONS.find(s => s.value === landscape.environment.season)?.desc}
                    </p>
                </section>
            </TabsContent>

            {/* 카메라 설정 탭 - 스튜디오와 동일 */}
            <TabsContent value="camera" className="mt-6">
                <CameraTab />
            </TabsContent>
        </Tabs>
    );
}
