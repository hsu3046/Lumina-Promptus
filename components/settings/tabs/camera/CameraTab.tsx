'use client';

import { useMemo } from 'react';
import { Lightbulb, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
import { getLensesByMount, LENS_CATEGORY_LABELS, getLensById } from '@/config/mappings/lenses';
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
                handleLensChange(lenses[0].id);
            }
        }
    };

    // 렌즈 변경 시 기본값 설정: 조리개(최대개방), 셔터스피드(화각*2), ISO(100)
    const handleLensChange = (lensId: string) => {
        const lens = getLensById(lensId);
        if (!lens) {
            updateCamera({ lensId });
            return;
        }

        // 조리개: 최대 개방
        const maxAperture = lens.maxAperture;

        // 셔터스피드: 화각의 2배 (예: 85mm → 1/170 → 가장 가까운 1/200)
        const focalNum = parseInt(lens.focalLength.replace(/[^\d]/g, ''), 10) || 50;
        const targetShutter = focalNum * 2;
        const shutterStopsOptions = ['1/60', '1/125', '1/200', '1/250', '1/500', '1/1000', '1/2000'];
        const closestShutter = shutterStopsOptions.reduce((prev, curr) => {
            const prevNum = parseShutterSpeed(prev);
            const currNum = parseShutterSpeed(curr);
            return Math.abs(currNum - targetShutter) < Math.abs(prevNum - targetShutter) ? curr : prev;
        });

        updateCamera({
            lensId,
            aperture: maxAperture,
            shutterSpeed: closestShutter,
            iso: 100,
            apertureAuto: false,
            shutterSpeedAuto: false,
            isoAuto: false,
        });
    };

    // 셔터스피드 문자열을 숫자로 변환 (1/200 → 200)
    const parseShutterSpeed = (s: string): number => {
        if (s.startsWith('1/')) return parseInt(s.slice(2), 10);
        return 1 / parseFloat(s);
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
                            onValueChange={handleLensChange}
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

                <Separator className="bg-zinc-800" />

                {/* 사진 비율 */}
                <div className="space-y-3">
                    <Label>사진 비율</Label>
                    <div className="flex items-center gap-6">
                        {/* 가로/세로 Radio Group */}
                        <RadioGroup
                            value={settings.camera.orientation}
                            onValueChange={(v) => updateCamera({ orientation: v as 'landscape' | 'portrait' })}
                            className="flex gap-4"
                        >
                            <div className="flex items-center gap-2">
                                <RadioGroupItem value="landscape" id="landscape" />
                                <Label htmlFor="landscape" className="text-sm font-normal cursor-pointer">가로</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <RadioGroupItem value="portrait" id="portrait" />
                                <Label htmlFor="portrait" className="text-sm font-normal cursor-pointer">세로</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* 비율 선택 버튼 */}
                    <div className="flex gap-2">
                        {(['3:2', '4:3', '16:9', '1:1', '4:5'] as const).map((ratio) => (
                            <button
                                key={ratio}
                                onClick={() => updateCamera({ aspectRatio: ratio })}
                                className={`flex-1 py-2 px-3 text-sm rounded-md border transition-colors ${settings.camera.aspectRatio === ratio
                                    ? 'bg-amber-600 border-amber-500 text-white'
                                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                                    }`}
                            >
                                {settings.camera.orientation === 'landscape'
                                    ? ratio
                                    : ratio.split(':').reverse().join(':')}
                            </button>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
