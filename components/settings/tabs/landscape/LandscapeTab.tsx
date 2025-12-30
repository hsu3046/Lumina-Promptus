'use client';

import * as React from 'react';
import { MapPin, Compass, Sun, Mountain } from 'lucide-react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Camera02Icon, Sun03Icon } from '@hugeicons/core-free-icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { ComboboxField } from '@/components/ui/combobox-field';
import { useSettingsStore } from '@/store/useSettingsStore';
import { CameraTab } from '@/components/settings/tabs/camera/CameraTab';
import { LandmarkInput } from './LandmarkInput';
import { StreetViewPreview } from './StreetViewPreview';
import { LocationSearch } from './LocationSearch';
import { SunPositionInfo } from './SunPositionInfo';
import { TilesPreview } from './TilesPreview';
import { OcclusionInfo } from './OcclusionInfo';
import { ReferenceImageCapturer } from './ReferenceImageCapturer';
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
                {/* 위치 검색 섹션 */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2 text-amber-400">
                        <MapPin className="w-4 h-4" />
                        <h3 className="text-sm font-medium">위치 검색</h3>
                    </div>
                    <LocationSearch />
                </section>

                <hr className="border-zinc-700/50" />

                {/* Street View 미리보기 */}
                <section>
                    <StreetViewPreview />
                </section>

                <hr className="border-zinc-700/50" />

                {/* 3D 공간 미리보기 */}
                <section>
                    <TilesPreview />
                </section>

                <hr className="border-zinc-700/50" />

                {/* 카메라 각도 + 고도 섹션 */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2 text-amber-400">
                        <Compass className="w-4 h-4" />
                        <h3 className="text-sm font-medium">카메라 각도</h3>
                    </div>

                    <div className="space-y-4">
                        {/* 고도 (촬영 위치 높이) */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <Label className="text-[10px] text-zinc-500 flex items-center gap-1">
                                    <Mountain className="w-3 h-3" />
                                    고도 (촬영 높이)
                                </Label>
                                <span className="text-xs text-amber-400">{landscape.location.elevation}m</span>
                            </div>
                            <Input
                                type="number"
                                value={landscape.location.elevation}
                                onChange={handleElevationChange}
                                placeholder="0"
                                className="h-8 bg-zinc-950 border-zinc-800 text-xs"
                            />
                        </div>

                        {/* 현재 방향/기울기 표시 (읽기 전용) */}
                        <div className="flex gap-4 text-[10px] text-zinc-500">
                            <span>방향: <span className="text-amber-400">{landscape.camera.heading}° • {compassLabel}</span></span>
                            <span>기울기: <span className="text-amber-400">{landscape.camera.pitch}°</span></span>
                        </div>
                        <p className="text-[10px] text-zinc-600 italic">
                            💡 Street View에서 마우스 드래그로 조절 가능
                        </p>
                    </div>
                </section>

                <hr className="border-zinc-700/50" />

                {/* 랜드마크 섹션 */}
                <LandmarkInput />

                <hr className="border-zinc-700/50" />

                {/* 공간 분석 (Occlusion) */}
                <OcclusionInfo />

                <hr className="border-zinc-700/50" />

                {/* Hybrid 14 참조 이미지 캐처 */}
                <ReferenceImageCapturer />
            </TabsContent>

            {/* 환경 설정 탭 */}
            <TabsContent value="environment" className="mt-6 space-y-6">
                {/* 실시간 태양 위치 정보 */}
                <SunPositionInfo />

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
