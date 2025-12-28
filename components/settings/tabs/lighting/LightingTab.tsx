'use client';

import { useMemo, useCallback } from 'react';
import { AlertCircle, AlertTriangle, Lightbulb, CircleAlert, RotateCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { useSettingsStore } from '@/store/useSettingsStore';
import { LightingValidator } from '@/lib/lighting-validator';
import {
    PATTERN_OPTIONS,
    PATTERN_PRESETS,
    KEY_OPTIONS,
    RATIO_OPTIONS,
    QUALITY_OPTIONS,
    COLOR_TEMP_OPTIONS,
    MOOD_OPTIONS,
    TIME_BASE_OPTIONS,
    SPECIAL_OPTIONS,
    RECOMMENDED_COMBINATIONS,
} from '@/config/lighting-rules';
import type { LightingSettings } from '@/types';
import type {
    LightingPattern,
    LightingKey,
    LightingRatio,
    LightQuality,
    ColorTemperature,
    LightingMood,
    TimeLighting,
    SpecialLighting,
    LightingConfig
} from '@/types/lighting.types';

// 충돌 상태 타입 (recommended 추가)
type ConflictStatus = 'none' | 'warning' | 'error' | 'recommended';

// 아이템 충돌 상태 계산 결과
interface ItemConflictInfo {
    status: ConflictStatus;
    tooltip?: string;
}

export function LightingTab() {
    const { settings, updateLighting } = useSettingsStore();
    const lighting = settings.lighting;

    // 현재 설정 기반 config 생성
    const currentConfig = useMemo((): LightingConfig => ({
        pattern: lighting.pattern as LightingPattern,
        key: lighting.key as LightingKey,
        ratio: lighting.ratio as LightingRatio | undefined,
        quality: lighting.quality as LightQuality | undefined,
        colorTemp: lighting.colorTemp as ColorTemperature | undefined,
        mood: lighting.mood as LightingMood | undefined,
        timeBase: lighting.timeBase as TimeLighting | undefined,
        special: lighting.special as SpecialLighting[] | undefined,
    }), [lighting]);

    // 특정 필드 변경 시 충돌/권장 상태 계산
    const getConflictStatus = useCallback((
        field: keyof LightingConfig,
        value: string
    ): ItemConflictInfo => {
        const testConfig = { ...currentConfig, [field]: value };
        const result = LightingValidator.validate(testConfig);

        if (result.errors.length > 0) {
            return { status: 'error', tooltip: result.errors[0] };
        }
        if (result.warnings.length > 0) {
            return { status: 'warning', tooltip: result.warnings[0] };
        }

        // 권장 조합 체크
        const recommended = RECOMMENDED_COMBINATIONS[currentConfig.pattern];
        if (recommended) {
            const isRecommended = (
                (field === 'key' && value === recommended.key) ||
                (field === 'ratio' && value === recommended.ratio) ||
                (field === 'quality' && value === recommended.quality) ||
                (field === 'colorTemp' && value === recommended.colorTemp) ||
                (field === 'mood' && value === recommended.mood)
            );
            if (isRecommended) {
                return { status: 'recommended', tooltip: '권장 조합' };
            }
        }

        return { status: 'none' };
    }, [currentConfig]);

    // 유효한 Ratio 옵션 (동적 필터링)
    const validRatios = useMemo(() => {
        return LightingValidator.getValidRatios(
            lighting.pattern as LightingPattern,
            lighting.key as LightingKey
        );
    }, [lighting.pattern, lighting.key]);

    // 유효한 Special 옵션 (동적 필터링)
    const validSpecials = useMemo(() => {
        return LightingValidator.getValidSpecials(
            lighting.pattern as LightingPattern,
            lighting.key as LightingKey
        );
    }, [lighting.pattern, lighting.key]);

    // 검증 결과
    const validation = useMemo(() => {
        return LightingValidator.validate(currentConfig);
    }, [currentConfig]);

    const isDisabled = !lighting.enabled;

    // Special 토글 핸들러
    const handleSpecialToggle = (special: SpecialLighting, checked: boolean) => {
        const current = lighting.special || [];
        if (checked) {
            updateLighting({ special: [...current, special] });
        } else {
            updateLighting({ special: current.filter(s => s !== special) });
        }
    };

    // 충돌/권장 아이콘 렌더러
    const ConflictIcon = ({ status }: { status: ConflictStatus }) => {
        if (status === 'error') {
            return <CircleAlert className="h-4 w-4 text-red-500 shrink-0" />;
        }
        if (status === 'warning') {
            return <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />;
        }
        if (status === 'recommended') {
            return <Lightbulb className="h-4 w-4 text-blue-500 shrink-0" />;
        }
        return null;
    };

    return (
        <Card className="bg-zinc-900/50 border-zinc-800/50 py-4 gap-2">
            <CardContent className="space-y-4">
                {/* 라이팅 ON/OFF */}
                <div className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 p-4">
                    <div className="space-y-0.5">
                        <Label htmlFor="lighting-switch" className="text-base font-medium">스튜디오 라이팅</Label>
                        <p className="text-sm text-zinc-500">
                            {lighting.enabled ? '조명 설정 활성화' : '자연광/주변광 모드'}
                        </p>
                    </div>
                    <Switch
                        id="lighting-switch"
                        checked={lighting.enabled}
                        onCheckedChange={(checked) => updateLighting({ enabled: checked })}
                    />
                </div>

                {/* 조명 패턴 (전체 너비) */}
                <div className={`space-y-1.5 ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="flex items-center justify-between">
                        <Label className="text-xs text-zinc-500">조명 패턴</Label>
                        <button
                            type="button"
                            onClick={() => {
                                const preset = PATTERN_PRESETS.rembrandt;
                                updateLighting({
                                    pattern: 'rembrandt',
                                    key: preset.key,
                                    ratio: preset.ratio,
                                    quality: preset.quality,
                                    colorTemp: preset.colorTemp,
                                    mood: preset.mood,
                                    timeBase: 'none',
                                    special: [],
                                });
                            }}
                            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                            <RotateCcw className="w-3 h-3" />
                            초기화
                        </button>
                    </div>
                    <Select
                        value={lighting.pattern}
                        onValueChange={(v) => {
                            const pattern = v as LightingSettings['pattern'];
                            const preset = PATTERN_PRESETS[pattern];
                            updateLighting({
                                pattern,
                                key: preset.key,
                                ratio: preset.ratio,
                                quality: preset.quality,
                                colorTemp: preset.colorTemp,
                                mood: preset.mood,
                            });
                        }}
                    >
                        <SelectTrigger className="bg-zinc-950 border-zinc-800">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            {PATTERN_OPTIONS.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label} - {opt.desc}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* 나머지 드롭다운 그리드: PC 3열 / Mobile 2열 */}
                <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
                    {/* Key */}
                    <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-500">키 (밝기)</Label>
                        <Select
                            value={lighting.key}
                            onValueChange={(v) => updateLighting({ key: v as LightingSettings['key'] })}
                        >
                            <SelectTrigger className="bg-zinc-950 border-zinc-800 w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                {KEY_OPTIONS.map(opt => {
                                    const conflict = getConflictStatus('key', opt.value);
                                    return (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            <span className="flex items-center gap-2">
                                                <ConflictIcon status={conflict.status} />
                                                <span>{opt.label} - {opt.desc}</span>
                                            </span>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Ratio */}
                    <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-500">대비 비율</Label>
                        <Select
                            value={lighting.ratio || ''}
                            onValueChange={(v) => updateLighting({ ratio: v as LightingSettings['ratio'] })}
                        >
                            <SelectTrigger className="bg-zinc-950 border-zinc-800 w-full">
                                <SelectValue placeholder="선택" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                {RATIO_OPTIONS.filter(opt => validRatios.includes(opt.value)).map(opt => {
                                    const conflict = getConflictStatus('ratio', opt.value);
                                    return (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            <span className="flex items-center gap-2">
                                                <ConflictIcon status={conflict.status} />
                                                <span>{opt.label} - {opt.desc}</span>
                                            </span>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Quality */}
                    <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-500">광질</Label>
                        <Select
                            value={lighting.quality || ''}
                            onValueChange={(v) => updateLighting({ quality: v as LightingSettings['quality'] })}
                        >
                            <SelectTrigger className="bg-zinc-950 border-zinc-800 w-full">
                                <SelectValue placeholder="선택" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                {QUALITY_OPTIONS.map(opt => {
                                    const conflict = getConflictStatus('quality', opt.value);
                                    return (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            <span className="flex items-center gap-2">
                                                <ConflictIcon status={conflict.status} />
                                                <span>{opt.label} - {opt.desc}</span>
                                            </span>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* ColorTemp */}
                    <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-500">색온도</Label>
                        <Select
                            value={lighting.colorTemp || ''}
                            onValueChange={(v) => updateLighting({ colorTemp: v as LightingSettings['colorTemp'] })}
                        >
                            <SelectTrigger className="bg-zinc-950 border-zinc-800 w-full">
                                <SelectValue placeholder="선택" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                {COLOR_TEMP_OPTIONS.map(opt => {
                                    const conflict = getConflictStatus('colorTemp', opt.value);
                                    return (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            <span className="flex items-center gap-2">
                                                <ConflictIcon status={conflict.status} />
                                                <span>{opt.label} ({opt.desc})</span>
                                            </span>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Mood */}
                    <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-500">분위기</Label>
                        <Select
                            value={lighting.mood || ''}
                            onValueChange={(v) => updateLighting({ mood: v as LightingSettings['mood'] })}
                        >
                            <SelectTrigger className="bg-zinc-950 border-zinc-800 w-full">
                                <SelectValue placeholder="선택" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                {MOOD_OPTIONS.map(opt => {
                                    const conflict = getConflictStatus('mood', opt.value);
                                    return (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            <span className="flex items-center gap-2">
                                                <ConflictIcon status={conflict.status} />
                                                <span>{opt.label}</span>
                                            </span>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* TimeBase */}
                    <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-500">시간대 조명</Label>
                        <Select
                            value={lighting.timeBase || ''}
                            onValueChange={(v) => updateLighting({ timeBase: v as LightingSettings['timeBase'] })}
                        >
                            <SelectTrigger className="bg-zinc-950 border-zinc-800 w-full">
                                <SelectValue placeholder="선택" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                {TIME_BASE_OPTIONS.map(opt => {
                                    const conflict = getConflictStatus('timeBase', opt.value);
                                    return (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            <span className="flex items-center gap-2">
                                                <ConflictIcon status={conflict.status} />
                                                <span>{opt.label}</span>
                                            </span>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Special Lighting (전체 너비) */}
                <div className={`space-y-2 ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
                    <Label className="text-xs text-zinc-500">특수 조명</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {SPECIAL_OPTIONS.map(opt => {
                            const isValid = validSpecials.includes(opt.value);
                            const isChecked = lighting.special?.includes(opt.value) || false;

                            return (
                                <label
                                    key={opt.value}
                                    className={`flex items-center gap-2 p-2 rounded-md border transition-colors cursor-pointer
                                        ${isChecked ? 'bg-amber-600/20 border-amber-600' : 'bg-zinc-900 border-zinc-800'}
                                        ${!isValid ? 'opacity-40 cursor-not-allowed' : 'hover:border-zinc-600'}
                                    `}
                                >
                                    <Checkbox
                                        checked={isChecked}
                                        disabled={!isValid}
                                        onCheckedChange={(checked) => handleSpecialToggle(opt.value, checked as boolean)}
                                    />
                                    <span className="text-xs flex items-center gap-1">
                                        {!isValid && <CircleAlert className="h-3 w-3 text-red-500" />}
                                        {opt.label}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* 검증 결과 (shadcn Alert) */}
                {lighting.enabled && (validation.errors.length > 0 || validation.warnings.length > 0 || validation.suggestions.length > 0) && (
                    <div className="space-y-2">
                        {/* 에러 */}
                        {validation.errors.map((error, i) => (
                            <Alert key={`error-${i}`} variant="destructive" className="bg-red-950/50 border-red-800">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="text-sm">{error}</AlertDescription>
                            </Alert>
                        ))}

                        {/* 경고 */}
                        {validation.warnings.map((warning, i) => (
                            <Alert key={`warning-${i}`} className="bg-amber-950/50 border-amber-800">
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                                <AlertDescription className="text-sm text-amber-200">{warning}</AlertDescription>
                            </Alert>
                        ))}

                        {/* 제안 */}
                        {validation.suggestions.map((suggestion, i) => (
                            <Alert key={`suggestion-${i}`} className="bg-blue-950/50 border-blue-800">
                                <Lightbulb className="h-4 w-4 text-blue-500" />
                                <AlertDescription className="text-sm text-blue-200">{suggestion}</AlertDescription>
                            </Alert>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
