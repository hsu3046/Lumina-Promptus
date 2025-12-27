'use client';

import { useMemo } from 'react';
import { Lightbulb, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useCameraSettings } from '@/components/hooks/useCameraSettings';
import { CAMERA_BODIES_BY_BRAND, getCameraById } from '@/config/mappings/cameras';
import { getLensesByMount, LENS_CATEGORY_LABELS } from '@/config/mappings/lenses';
import type { Lens } from '@/types';

// 카메라 브랜드 정렬 순서
const BRAND_ORDER = ['Canon', 'Nikon', 'Sony', 'Fujifilm', 'Leica', 'Hasselblad', 'Pentax'];

// 카테고리 정렬 순서
const CATEGORY_ORDER: Lens['category'][] = ['ultra_wide', 'wide', 'standard', 'medium_telephoto', 'telephoto', 'macro'];

export function CameraTab() {
    const { settings, updateCamera } = useSettingsStore();
    const {
        apertureStops,
        shutterStops,
        isoStops,
        exposureInfo,
        handleAutoToggle,
        handleManualChange,
    } = useCameraSettings();

    // 현재 카메라 마운트와 호환되는 렌즈 (카테고리별 그룹화)
    const compatibleLensesByCategory = useMemo((): Partial<Record<Lens['category'], Lens[]>> => {
        const camera = getCameraById(settings.camera.bodyId);
        if (!camera) return {};

        const lenses = getLensesByMount(camera.mount);
        return lenses.reduce((acc, lens) => {
            if (!acc[lens.category]) {
                acc[lens.category] = [];
            }
            acc[lens.category]!.push(lens);
            return acc;
        }, {} as Partial<Record<Lens['category'], Lens[]>>);
    }, [settings.camera.bodyId]);

    // 카메라 변경 시 호환 렌즈 자동 선택
    const handleCameraChange = (cameraId: string) => {
        updateCamera({ bodyId: cameraId });
        const camera = getCameraById(cameraId);
        if (camera) {
            const lenses = getLensesByMount(camera.mount);
            if (lenses.length > 0) {
                updateCamera({ lensId: lenses[0].id });
            }
        }
    };

    const lightingEnabled = settings.lighting.enabled;

    // 정렬된 브랜드 목록
    const sortedBrands = useMemo(() => {
        const brands = Object.keys(CAMERA_BODIES_BY_BRAND);
        return brands.sort((a, b) => {
            const aIdx = BRAND_ORDER.indexOf(a);
            const bIdx = BRAND_ORDER.indexOf(b);
            if (aIdx === -1 && bIdx === -1) return a.localeCompare(b);
            if (aIdx === -1) return 1;
            if (bIdx === -1) return -1;
            return aIdx - bIdx;
        });
    }, []);

    return (
        <Card className="bg-zinc-900/50 border-zinc-800/50">
            <CardContent className="pt-3 space-y-6">
                {/* 카메라 바디 / 렌즈 - 2줄 배치 */}
                <div className="grid grid-cols-2 gap-4">
                    {/* 카메라 바디 (브랜드별 그룹) */}
                    <div className="space-y-2">
                        <Label>카메라</Label>
                        <Select
                            value={settings.camera.bodyId}
                            onValueChange={handleCameraChange}
                        >
                            <SelectTrigger className="w-full bg-zinc-950 border-zinc-800">
                                <SelectValue placeholder="카메라 선택" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 max-h-80">
                                {sortedBrands.map((brand) => (
                                    <SelectGroup key={brand}>
                                        <SelectLabel className="text-amber-400 font-medium">{brand}</SelectLabel>
                                        {CAMERA_BODIES_BY_BRAND[brand].map((camera) => (
                                            <SelectItem key={camera.id} value={camera.id}>
                                                {camera.model}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 렌즈 (카테고리별 그룹) */}
                    <div className="space-y-2">
                        <Label>렌즈</Label>
                        <Select
                            value={settings.camera.lensId}
                            onValueChange={(value) => updateCamera({ lensId: value })}
                        >
                            <SelectTrigger className="w-full bg-zinc-950 border-zinc-800">
                                <SelectValue placeholder="렌즈 선택" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 max-h-80">
                                {CATEGORY_ORDER.filter(cat => (compatibleLensesByCategory[cat]?.length ?? 0) > 0).map((category) => (
                                    <SelectGroup key={category}>
                                        <SelectLabel className="text-amber-400 font-medium">
                                            {LENS_CATEGORY_LABELS[category]}
                                        </SelectLabel>
                                        {compatibleLensesByCategory[category]!.map((lens) => (
                                            <SelectItem key={lens.id} value={lens.id}>
                                                {lens.model}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Separator className="bg-zinc-800" />

                {/* 조리개 (스냅 슬라이더) */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Label>조리개</Label>
                            <div className="flex items-center gap-1">
                                <Switch
                                    checked={settings.camera.apertureAuto}
                                    onCheckedChange={() => handleAutoToggle('aperture')}
                                />
                                <span className="text-xs text-zinc-500">Auto</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            {!settings.camera.apertureAuto && exposureInfo.status !== 'normal' && (
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                            )}
                            <span
                                className={`text-sm font-mono ${!settings.camera.apertureAuto && exposureInfo.status !== 'normal'
                                    ? 'text-red-500'
                                    : 'text-amber-400'
                                    }`}
                            >
                                {settings.camera.aperture}
                            </span>
                        </div>
                    </div>
                    <Slider
                        value={[Math.max(0, apertureStops.indexOf(settings.camera.aperture))]}
                        min={0}
                        max={apertureStops.length - 1}
                        step={1}
                        onValueChange={([idx]) => handleManualChange('aperture', apertureStops[idx])}
                        className="py-1"
                        disabled={settings.camera.apertureAuto}
                    />
                    <div className="flex justify-between text-xs text-zinc-500">
                        <span>{apertureStops[0]}</span>
                        <span>{apertureStops[apertureStops.length - 1]}</span>
                    </div>
                </div>

                {/* 셔터 스피드 (스냅 슬라이더) */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Label>셔터 스피드</Label>
                            {lightingEnabled ? (
                                <Badge className="bg-amber-600 text-white">
                                    <Lightbulb className="w-3 h-3" /> Lights On
                                </Badge>
                            ) : (
                                <div className="flex items-center gap-1">
                                    <Switch
                                        checked={settings.camera.shutterSpeedAuto}
                                        onCheckedChange={() => handleAutoToggle('shutter')}
                                    />
                                    <span className="text-xs text-zinc-500">Auto</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            {!lightingEnabled && !settings.camera.shutterSpeedAuto && exposureInfo.status !== 'normal' && (
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                            )}
                            <span
                                className={`text-sm font-mono ${!lightingEnabled && !settings.camera.shutterSpeedAuto && exposureInfo.status !== 'normal'
                                    ? 'text-red-500'
                                    : 'text-amber-400'
                                    }`}
                            >
                                {lightingEnabled ? '1/200' : settings.camera.shutterSpeed}
                            </span>
                        </div>
                    </div>
                    <Slider
                        value={[Math.max(0, shutterStops.indexOf(lightingEnabled ? '1/200' : settings.camera.shutterSpeed))]}
                        min={0}
                        max={shutterStops.length - 1}
                        step={1}
                        onValueChange={([idx]) => handleManualChange('shutter', shutterStops[idx])}
                        className="py-1"
                        disabled={lightingEnabled || settings.camera.shutterSpeedAuto}
                    />
                    <div className="flex justify-between text-xs text-zinc-500">
                        <span>{shutterStops[0]}s</span>
                        <span>{shutterStops[shutterStops.length - 1]}s</span>
                    </div>
                </div>

                {/* ISO (스냅 슬라이더) */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Label>ISO</Label>
                            {lightingEnabled ? (
                                <Badge className="bg-amber-600 text-white">
                                    <Lightbulb className="w-3 h-3" /> Lights On
                                </Badge>
                            ) : (
                                <div className="flex items-center gap-1">
                                    <Switch
                                        checked={settings.camera.isoAuto}
                                        onCheckedChange={() => handleAutoToggle('iso')}
                                    />
                                    <span className="text-xs text-zinc-500">Auto</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            {!lightingEnabled && !settings.camera.isoAuto && exposureInfo.status !== 'normal' && (
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                            )}
                            <span
                                className={`text-sm font-mono ${!lightingEnabled && !settings.camera.isoAuto && exposureInfo.status !== 'normal'
                                    ? 'text-red-500'
                                    : 'text-amber-400'
                                    }`}
                            >
                                {lightingEnabled ? '100' : settings.camera.iso}
                            </span>
                        </div>
                    </div>
                    <Slider
                        value={[Math.max(0, isoStops.indexOf(lightingEnabled ? 100 : settings.camera.iso))]}
                        min={0}
                        max={isoStops.length - 1}
                        step={1}
                        onValueChange={([idx]) => handleManualChange('iso', isoStops[idx])}
                        className="py-1"
                        disabled={lightingEnabled || settings.camera.isoAuto}
                    />
                    <div className="flex justify-between text-xs text-zinc-500">
                        <span>{isoStops[0]}</span>
                        <span>{isoStops[isoStops.length - 1]}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
