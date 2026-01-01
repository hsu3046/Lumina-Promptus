'use client';

import { useMemo } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { StarIcon, Alert02Icon, AlertCircleIcon, BulbIcon } from '@hugeicons/core-free-icons';
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
import { useCameraSettings } from './useCameraSettings';
import { CAMERA_BODIES_BY_BRAND, getCameraById, DEFAULT_ASPECT_RATIO_SPEC } from '@/config/mappings/cameras';
import { getLensesByMount, LENS_CATEGORY_LABELS, getLensById } from '@/config/mappings/lenses';
import { getLensStatusForOption, type LensConflictLevel } from './lens-composition-validator';
import type { Lens } from '@/types';
import type { ExposureStatusLevel } from './exposure-calculator';

// 카메라 브랜드 정렬 순서
const BRAND_ORDER = ['Canon', 'Nikon', 'Sony', 'Fujifilm', 'Leica', 'Hasselblad', 'Pentax'];

// 카테고리 정렬 순서
const CATEGORY_ORDER: Lens['category'][] = ['ultra_wide', 'wide', 'standard', 'medium_telephoto', 'telephoto', 'macro'];

// 노출 상태별 스타일 헬퍼
function getExposureStatusStyle(status: ExposureStatusLevel): { color: string; icon: 'critical' | 'warning' | 'none' } {
    if (status.startsWith('critical_')) {
        return { color: 'text-red-500', icon: 'critical' };
    }
    if (status.startsWith('warning_')) {
        return { color: 'text-amber-400', icon: 'warning' };
    }
    // slight와 normal은 경고 표시 없음
    return { color: 'text-amber-400', icon: 'none' };
}

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

    // 충돌 감지용 설정 값
    const framing = settings.userInput.studioComposition;
    const angle = settings.artDirection.cameraAngle;

    // 첫 번째 추천 렌즈 ID (1순위만 아이콘 표시)
    const firstRecommendedLensId = useMemo(() => {
        for (const category of CATEGORY_ORDER) {
            const lenses = compatibleLensesByCategory[category];
            if (!lenses) continue;
            for (const lens of lenses) {
                const status = getLensStatusForOption(framing, angle, lens.id);
                if (status.level === 'recommend') {
                    return lens.id;
                }
            }
        }
        return null;
    }, [compatibleLensesByCategory, framing, angle]);

    // 카메라 변경 시 호환 렌즈 자동 선택 + 비율 기본값 업데이트
    const handleCameraChange = (cameraId: string) => {
        const camera = getCameraById(cameraId);
        if (camera) {
            // 비율 기본값 가져오기
            const spec = camera.aspectRatioSpec ?? DEFAULT_ASPECT_RATIO_SPEC;
            const defaultAspectRatio = spec.defaultValue;

            // 카메라 ID와 비율을 함께 업데이트
            updateCamera({ bodyId: cameraId, aspectRatio: defaultAspectRatio });

            // 호환 렌즈 자동 선택
            const lenses = getLensesByMount(camera.mount);
            if (lenses.length > 0) {
                handleLensChange(lenses[0].id);
            }
        } else {
            updateCamera({ bodyId: cameraId });
        }
    };

    // 렌즈 변경 시 기본값 설정: 조리개(최대개방), 셔터스피드(화각*2), ISO(100)
    // Auto 상태는 기존 값 유지
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

        // Auto 상태는 유지하고, 수동 값만 업데이트
        updateCamera({
            lensId,
            aperture: maxAperture,
            shutterSpeed: closestShutter,
            iso: 100,
            // apertureAuto, shutterSpeedAuto, isoAuto는 기존 값 유지
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
        <div className="space-y-4">
            {/* 카메라 바디 / 렌즈 - 2줄 배치 */}
            <div className="grid grid-cols-2 gap-4">
                {/* 카메라 바디 (브랜드별 그룹) */}
                <div className="space-y-2">
                    <Label>카메라</Label>
                    <Select
                        value={settings.camera.bodyId}
                        onValueChange={handleCameraChange}
                    >
                        <SelectTrigger className="w-full bg-zinc-800/70 border-zinc-800">
                            <SelectValue placeholder="카메라 선택" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 max-h-80">
                            {sortedBrands.map((brand) => (
                                <SelectGroup key={brand}>
                                    <SelectLabel className="text-amber-400 font-medium">{brand}</SelectLabel>
                                    {CAMERA_BODIES_BY_BRAND[brand].map((camera) => {
                                        const isFilm = camera.id === 'leica_m3_film' || camera.id === 'hasselblad_500cm_film' || camera.id === 'pentax_67_film';
                                        const isMediumFormat = camera.id === 'hasselblad_500cm_film' || camera.id === 'pentax_67_film';
                                        return (
                                            <SelectItem key={camera.id} value={camera.id}>
                                                <div className="flex items-center gap-1.5">
                                                    <span>{camera.model}</span>
                                                    {isFilm && (
                                                        <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-amber-600 text-amber-500">
                                                            필름
                                                        </Badge>
                                                    )}
                                                    {isMediumFormat && (
                                                        <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-purple-600 text-purple-400">
                                                            중형
                                                        </Badge>
                                                    )}
                                                </div>
                                            </SelectItem>
                                        );
                                    })}
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
                        <SelectTrigger className="w-full bg-zinc-800/70 border-zinc-800">
                            <SelectValue placeholder="렌즈 선택" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 max-h-80">
                            {CATEGORY_ORDER.filter(cat => (compatibleLensesByCategory[cat]?.length ?? 0) > 0).map((category) => (
                                <SelectGroup key={category}>
                                    <SelectLabel className="text-amber-400 font-medium">
                                        {LENS_CATEGORY_LABELS[category]}
                                    </SelectLabel>
                                    {compatibleLensesByCategory[category]!.map((lens) => {
                                        const status = getLensStatusForOption(framing, angle, lens.id);
                                        // disabled면 표시하지 않음
                                        if (status.level === 'disabled') return null;
                                        const isCritical = status.level === 'critical';
                                        return (
                                            <SelectItem
                                                key={lens.id}
                                                value={lens.id}
                                                disabled={isCritical}
                                                className={isCritical ? "opacity-50" : ""}
                                            >
                                                <div className="flex items-center justify-between w-full gap-2">
                                                    <span>{lens.model}</span>
                                                    <span className="flex items-center gap-1">
                                                        {lens.id === firstRecommendedLensId && <HugeiconsIcon icon={StarIcon} size={12} className="text-blue-500" />}
                                                        {isCritical && <HugeiconsIcon icon={AlertCircleIcon} size={12} className="text-red-500" />}
                                                        {status.level === 'warning' && <HugeiconsIcon icon={Alert02Icon} size={12} className="text-amber-400" />}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        );
                                    })}
                                </SelectGroup>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* 비율 / 스타일 - 2열 배치 */}
            <div className="grid grid-cols-2 gap-4">
                {/* 비율 */}
                {(() => {
                    const camera = getCameraById(settings.camera.bodyId);
                    const spec = camera?.aspectRatioSpec ?? DEFAULT_ASPECT_RATIO_SPEC;
                    const hasLandscape = spec.landscape.length > 0;
                    const hasPortrait = spec.portrait.length > 0;
                    const hasSquare = spec.square.length > 0;

                    // 현재 선택된 비율이 변경된 spec에 없으면 기본값으로 변경
                    const allRatios = [...spec.landscape, ...spec.portrait, ...spec.square];
                    const currentRatio = settings.camera.aspectRatio;

                    return (
                        <div className="space-y-2">
                            <Label>비율</Label>
                            <Select
                                value={allRatios.includes(currentRatio) ? currentRatio : spec.defaultValue}
                                onValueChange={(value) => updateCamera({ aspectRatio: value })}
                            >
                                <SelectTrigger className="w-full bg-zinc-800/70 border-zinc-800">
                                    <SelectValue placeholder="비율 선택" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                    {hasLandscape && (
                                        <SelectGroup>
                                            <SelectLabel className="text-amber-400 font-medium">가로</SelectLabel>
                                            {spec.landscape.map((ratio) => {
                                                // 비율에 맞는 아이콘 크기 계산 (기준 높이 12px)
                                                const [w, h] = ratio.split(':').map(Number);
                                                const baseHeight = 12;
                                                const width = Math.round((w / h) * baseHeight);
                                                return (
                                                    <SelectItem key={ratio} value={ratio}>
                                                        <span className="flex items-center gap-2">
                                                            <span
                                                                className="border border-zinc-500 rounded-[2px] shrink-0"
                                                                style={{ width: `${width}px`, height: `${baseHeight}px` }}
                                                            />
                                                            <span>{ratio}</span>
                                                        </span>
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectGroup>
                                    )}
                                    {hasPortrait && (
                                        <SelectGroup>
                                            <SelectLabel className="text-amber-400 font-medium">세로</SelectLabel>
                                            {spec.portrait.map((ratio) => {
                                                // 세로 비율: 기준 너비 10px
                                                const [w, h] = ratio.split(':').map(Number);
                                                const baseWidth = 10;
                                                const height = Math.round((h / w) * baseWidth);
                                                return (
                                                    <SelectItem key={ratio} value={ratio}>
                                                        <span className="flex items-center gap-2">
                                                            <span
                                                                className="border border-zinc-500 rounded-[2px] shrink-0"
                                                                style={{ width: `${baseWidth}px`, height: `${height}px` }}
                                                            />
                                                            <span>{ratio}</span>
                                                        </span>
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectGroup>
                                    )}
                                    {hasSquare && (
                                        <SelectGroup>
                                            <SelectLabel className="text-amber-400 font-medium">정방형</SelectLabel>
                                            {spec.square.map((ratio) => (
                                                <SelectItem key={ratio} value={ratio}>
                                                    <span className="flex items-center gap-2">
                                                        <span className="w-3.5 h-3.5 border border-zinc-500 rounded-[2px] shrink-0" />
                                                        <span>{ratio}</span>
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    );
                })()}

                {/* 스타일 (차후 구현) */}
                <div className="space-y-2">
                    <Label>스타일</Label>
                    <Select disabled>
                        <SelectTrigger className="w-full bg-zinc-800/70 border-zinc-800 opacity-50">
                            <SelectValue placeholder="차후 구현" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            <SelectItem value="none">선택 안함</SelectItem>
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
                        {(() => {
                            const style = getExposureStatusStyle(exposureInfo.status);
                            const showIcon = !lightingEnabled && !settings.camera.apertureAuto && style.icon !== 'none';
                            return (
                                <>
                                    {showIcon && style.icon === 'critical' && <HugeiconsIcon icon={AlertCircleIcon} size={16} className={style.color} />}
                                    {showIcon && style.icon === 'warning' && <HugeiconsIcon icon={Alert02Icon} size={16} className={style.color} />}
                                    <span className={`text-sm font-mono ${!settings.camera.apertureAuto && style.icon !== 'none' ? style.color : 'text-amber-400'}`}>
                                        {settings.camera.aperture}
                                    </span>
                                </>
                            );
                        })()}
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
                <div className="flex justify-between text-xs text-zinc-500 -mt-2">
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
                                <HugeiconsIcon icon={BulbIcon} size={12} /> 조명 촬영
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
                        {(() => {
                            const style = getExposureStatusStyle(exposureInfo.status);
                            const showIcon = !lightingEnabled && !settings.camera.shutterSpeedAuto && style.icon !== 'none';
                            return (
                                <>
                                    {showIcon && style.icon === 'critical' && <HugeiconsIcon icon={AlertCircleIcon} size={16} className={style.color} />}
                                    {showIcon && style.icon === 'warning' && <HugeiconsIcon icon={Alert02Icon} size={16} className={style.color} />}
                                    <span className={`text-sm font-mono ${lightingEnabled ? 'text-zinc-500' : (showIcon ? style.color : 'text-amber-400')}`}>
                                        {lightingEnabled ? '1/125' : settings.camera.shutterSpeed}
                                    </span>
                                </>
                            );
                        })()}
                    </div>
                </div>
                <Slider
                    value={[Math.max(0, shutterStops.indexOf(lightingEnabled ? '1/125' : settings.camera.shutterSpeed))]}
                    min={0}
                    max={shutterStops.length - 1}
                    step={1}
                    onValueChange={([idx]) => handleManualChange('shutter', shutterStops[idx])}
                    className="py-1"
                    disabled={lightingEnabled || settings.camera.shutterSpeedAuto}
                />
                <div className="flex justify-between text-xs text-zinc-500 -mt-2">
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
                                <HugeiconsIcon icon={BulbIcon} size={12} /> 조명 촬영
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
                        {(() => {
                            const style = getExposureStatusStyle(exposureInfo.status);
                            const showIcon = !lightingEnabled && !settings.camera.isoAuto && style.icon !== 'none';
                            return (
                                <>
                                    {showIcon && style.icon === 'critical' && <HugeiconsIcon icon={AlertCircleIcon} size={16} className={style.color} />}
                                    {showIcon && style.icon === 'warning' && <HugeiconsIcon icon={Alert02Icon} size={16} className={style.color} />}
                                    <span className={`text-sm font-mono ${lightingEnabled ? 'text-zinc-500' : (showIcon ? style.color : 'text-amber-400')}`}>
                                        {lightingEnabled ? '100' : settings.camera.iso}
                                    </span>
                                </>
                            );
                        })()}
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
                <div className="flex justify-between text-xs text-zinc-500 -mt-2">
                    <span>{isoStops[0]}</span>
                    <span>{isoStops[isoStops.length - 1]}</span>
                </div>
            </div>

            {/* 노출 보정 (EV) */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Label>노출 보정</Label>
                        {lightingEnabled && (
                            <Badge className="bg-amber-600 text-white">
                                <HugeiconsIcon icon={BulbIcon} size={12} /> 조명 촬영
                            </Badge>
                        )}
                    </div>
                    <span className={`text-sm font-mono ${lightingEnabled ? 'text-zinc-500' : 'text-amber-400'}`}>
                        {lightingEnabled ? '0' : (settings.camera.exposureCompensation > 0 ? '+' : '') + settings.camera.exposureCompensation} EV
                    </span>
                </div>
                <Slider
                    value={[lightingEnabled ? 0 : settings.camera.exposureCompensation]}
                    min={-3}
                    max={3}
                    step={0.3}
                    onValueChange={([val]) => updateCamera({ exposureCompensation: Math.round(val * 10) / 10 })}
                    className="py-1"
                    disabled={lightingEnabled}
                />
                <div className="flex justify-between text-xs text-zinc-500 -mt-2">
                    <span>-3 EV</span>
                    <span>0</span>
                    <span>+3 EV</span>
                </div>
            </div>

            {/* 색온도 (White Balance) */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Label>색온도</Label>
                        {lightingEnabled && (
                            <Badge className="bg-amber-600 text-white">
                                <HugeiconsIcon icon={BulbIcon} size={12} /> 조명 촬영
                            </Badge>
                        )}
                    </div>
                    <span className={`text-sm font-mono ${lightingEnabled ? 'text-zinc-500' : 'text-amber-400'}`}>
                        {lightingEnabled ? '5600' : settings.camera.whiteBalance}K
                    </span>
                </div>
                <Slider
                    value={[lightingEnabled ? 5600 : settings.camera.whiteBalance]}
                    min={2500}
                    max={10000}
                    step={100}
                    onValueChange={([val]) => updateCamera({ whiteBalance: val })}
                    className="py-1"
                    disabled={lightingEnabled}
                />
                <div className="flex justify-between text-xs text-zinc-500 -mt-2">
                    <span>2500K</span>
                    <span>10000K</span>
                </div>
            </div>

        </div>
    );
}
