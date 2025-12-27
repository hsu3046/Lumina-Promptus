'use client';

import { useState, useMemo } from 'react';
import { Lightbulb, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useCameraSettings } from '@/components/hooks/useCameraSettings';
import { CAMERA_BODIES, CAMERA_BODIES_BY_BRAND, getCameraById } from '@/config/mappings/cameras';
import { getLensesByMount } from '@/config/mappings/lenses';

const CAMERA_BRANDS = Object.keys(CAMERA_BODIES_BY_BRAND).sort();

export function CameraTab() {
    const { settings, updateCamera, updateLighting } = useSettingsStore();
    const {
        apertureStops,
        shutterStops,
        isoStops,
        exposureInfo,
        handleAutoToggle,
        handleManualChange,
    } = useCameraSettings();

    const [selectedBrand, setSelectedBrand] = useState<string>('all');

    // 브랜드 필터링된 카메라 목록
    const filteredCameras = useMemo(() => {
        if (selectedBrand === 'all') return CAMERA_BODIES;
        return CAMERA_BODIES_BY_BRAND[selectedBrand] || [];
    }, [selectedBrand]);

    // 현재 카메라 마운트와 호환되는 렌즈
    const compatibleLenses = useMemo(() => {
        const camera = getCameraById(settings.camera.bodyId);
        if (!camera) return [];
        return getLensesByMount(camera.mount);
    }, [settings.camera.bodyId]);

    // 브랜드 변경 핸들러
    const handleBrandChange = (brand: string) => {
        setSelectedBrand(brand);
        if (brand === 'all') return;

        const brandCameras = CAMERA_BODIES_BY_BRAND[brand];
        if (brandCameras && brandCameras.length > 0) {
            const firstCamera = brandCameras[0];
            updateCamera({ bodyId: firstCamera.id });

            const lenses = getLensesByMount(firstCamera.mount);
            if (lenses.length > 0) {
                updateCamera({ lensId: lenses[0].id });
            }
        }
    };

    const lightingEnabled = settings.lighting.enabled;

    return (
        <Card className="bg-zinc-900/50 border-zinc-800/50">
            <CardContent className="pt-6 space-y-6">
                {/* 브랜드 / 카메라 바디 / 렌즈 - 1줄 배치 */}
                <div className="grid grid-cols-3 gap-4">
                    {/* 브랜드 필터 */}
                    <div className="space-y-2">
                        <Label>브랜드</Label>
                        <Select value={selectedBrand} onValueChange={handleBrandChange}>
                            <SelectTrigger className="w-full bg-zinc-950 border-zinc-800">
                                <SelectValue placeholder="브랜드 선택" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                <SelectItem value="all">
                                    <span className="text-amber-400">All Brands</span>
                                    <Badge variant="outline" className="ml-2 text-xs">
                                        {CAMERA_BODIES.length}
                                    </Badge>
                                </SelectItem>
                                {CAMERA_BRANDS.map((brand) => (
                                    <SelectItem key={brand} value={brand}>
                                        <div className="flex items-center gap-2">
                                            <span>{brand}</span>
                                            <Badge variant="outline" className="text-xs">
                                                {CAMERA_BODIES_BY_BRAND[brand].length}
                                            </Badge>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 카메라 바디 */}
                    <div className="space-y-2">
                        <Label>카메라 바디</Label>
                        <Select
                            value={settings.camera.bodyId}
                            onValueChange={(value) => updateCamera({ bodyId: value })}
                        >
                            <SelectTrigger className="w-full bg-zinc-950 border-zinc-800">
                                <SelectValue placeholder="카메라 선택" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                {filteredCameras.map((camera) => (
                                    <SelectItem key={camera.id} value={camera.id}>
                                        <span className="text-zinc-400">{camera.brand}</span>
                                        <span className="ml-1">{camera.model}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 렌즈 */}
                    <div className="space-y-2">
                        <Label>렌즈</Label>
                        <Select
                            value={settings.camera.lensId}
                            onValueChange={(value) => updateCamera({ lensId: value })}
                        >
                            <SelectTrigger className="w-full bg-zinc-950 border-zinc-800">
                                <SelectValue placeholder="렌즈 선택" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                {compatibleLenses.map((lens) => (
                                    <SelectItem key={lens.id} value={lens.id}>
                                        {lens.model}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Separator className="bg-zinc-800" />

                {/* 조리개 (스냅 슬라이더) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Label>조리개</Label>
                            <button
                                onClick={() => handleAutoToggle('aperture')}
                                className={`px-2 py-0.5 text-xs rounded transition-colors ${settings.camera.apertureAuto
                                        ? 'bg-green-600 text-white'
                                        : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600'
                                    }`}
                            >
                                Auto
                            </button>
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
                        className="py-2"
                        disabled={settings.camera.apertureAuto}
                    />
                    <div className="flex justify-between text-xs text-zinc-500">
                        <span>{apertureStops[0]} (얕은 DOF)</span>
                        <span>{apertureStops[apertureStops.length - 1]} (깊은 DOF)</span>
                    </div>
                </div>

                {/* 셔터 스피드 (스냅 슬라이더) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Label>셔터 스피드</Label>
                            {lightingEnabled ? (
                                <span className="px-2 py-0.5 text-xs rounded bg-amber-600 text-white flex items-center gap-1">
                                    <Lightbulb className="w-3 h-3" /> Lighting
                                </span>
                            ) : (
                                <button
                                    onClick={() => handleAutoToggle('shutter')}
                                    className={`px-2 py-0.5 text-xs rounded transition-colors ${settings.camera.shutterSpeedAuto
                                            ? 'bg-green-600 text-white'
                                            : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600'
                                        }`}
                                >
                                    Auto
                                </button>
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
                        className="py-2"
                        disabled={lightingEnabled || settings.camera.shutterSpeedAuto}
                    />
                    <div className="flex justify-between text-xs text-zinc-500">
                        <span>{shutterStops[0]}s (모션블러)</span>
                        <span>{shutterStops[shutterStops.length - 1]} (동결)</span>
                    </div>
                </div>

                {/* ISO (스냅 슬라이더) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Label>ISO</Label>
                            {lightingEnabled ? (
                                <span className="px-2 py-0.5 text-xs rounded bg-amber-600 text-white flex items-center gap-1">
                                    <Lightbulb className="w-3 h-3" /> Lighting
                                </span>
                            ) : (
                                <button
                                    onClick={() => handleAutoToggle('iso')}
                                    className={`px-2 py-0.5 text-xs rounded transition-colors ${settings.camera.isoAuto
                                            ? 'bg-green-600 text-white'
                                            : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600'
                                        }`}
                                >
                                    Auto
                                </button>
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
                        className="py-2"
                        disabled={lightingEnabled || settings.camera.isoAuto}
                    />
                    <div className="flex justify-between text-xs text-zinc-500">
                        <span>{isoStops[0]} (저노이즈)</span>
                        <span>{isoStops[isoStops.length - 1]} (고감도)</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
