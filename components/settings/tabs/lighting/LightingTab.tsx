'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { RefreshIcon } from '@hugeicons/core-free-icons';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { ComboboxField, type ConflictLevel } from '@/components/ui/combobox-field';
import { useSettingsStore } from '@/store/useSettingsStore';
import {
    PATTERN_OPTIONS,
    KEY_OPTIONS,
    RATIO_OPTIONS,
    QUALITY_OPTIONS,
    COLOR_TEMP_OPTIONS,
    MOOD_OPTIONS,
    SPECIAL_OPTIONS,
} from './lighting-rules';
import { LIGHTING_PRESETS } from '@/config/mappings/lighting-patterns';
import {
    getLightingPatternConflict,
    getLightingKeyConflictForPattern,
    getLightingKeyConflictForRatio,
    getLightingRatioConflictForKey,
    getLightingRatioConflictForQuality,
    getLightingQualityConflictForRatio,
    getLightingQualityWarningForPattern,
} from '@/lib/rules/conflict-adapter';
import type { LightingSettings } from '@/types';
import type { SpecialLighting } from '@/types/lighting.types';

// ===== 컴포넌트 =====

export function LightingTab() {
    const { settings, updateLighting } = useSettingsStore();
    const lighting = settings.lighting;
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

    // 첫번째 프리셋 (Standard Portrait)
    const defaultPreset = LIGHTING_PRESETS[0];

    return (
        <div className="space-y-4">

            {/* 라이팅 ON/OFF */}
            <div className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="lighting-switch" className="text-base font-medium">스튜디오 라이팅</Label>
                    <p className="text-sm text-zinc-500">
                        {lighting.enabled ? '조명 설정 활성화' : '자연광/주변광 모드'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* 리셋 버튼 */}
                    <button
                        type="button"
                        onClick={() => {
                            updateLighting({
                                pattern: defaultPreset.params.pattern,
                                key: defaultPreset.params.key,
                                ratio: defaultPreset.params.ratio,
                                quality: defaultPreset.params.quality,
                                colorTemp: defaultPreset.params.colorTemp,
                                mood: defaultPreset.params.mood,
                                special: defaultPreset.params.special || [],
                            });
                        }}
                        className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                        disabled={isDisabled}
                    >
                        <HugeiconsIcon icon={RefreshIcon} size={12} />
                        초기화
                    </button>
                    <Switch
                        id="lighting-switch"
                        checked={lighting.enabled}
                        onCheckedChange={(checked) => {
                            if (checked) {
                                // ON시 첫번째 프리셋 자동 적용
                                updateLighting({
                                    enabled: true,
                                    pattern: defaultPreset.params.pattern,
                                    key: defaultPreset.params.key,
                                    ratio: defaultPreset.params.ratio,
                                    quality: defaultPreset.params.quality,
                                    colorTemp: defaultPreset.params.colorTemp,
                                    mood: defaultPreset.params.mood,
                                    special: defaultPreset.params.special || [],
                                });
                            } else {
                                updateLighting({ enabled: false });
                            }
                        }}
                    />
                </div>
            </div>

            {/* 프리셋 선택 */}
            <div className={`space-y-2 ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <Label className="text-xs text-zinc-500">프리셋</Label>
                <div className="flex flex-wrap gap-2">
                    {LIGHTING_PRESETS.map((preset) => {
                        const isSelected = lighting.enabled &&
                            lighting.pattern === preset.params.pattern &&
                            lighting.key === preset.params.key &&
                            lighting.ratio === preset.params.ratio &&
                            lighting.quality === preset.params.quality &&
                            lighting.colorTemp === preset.params.colorTemp &&
                            lighting.mood === preset.params.mood;
                        return (
                            <button
                                key={preset.id}
                                type="button"
                                onClick={() => {
                                    updateLighting({
                                        pattern: preset.params.pattern,
                                        key: preset.params.key,
                                        ratio: preset.params.ratio,
                                        quality: preset.params.quality,
                                        colorTemp: preset.params.colorTemp,
                                        mood: preset.params.mood,
                                        special: preset.params.special || [],
                                    });
                                }}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
                                    ${isSelected
                                        ? 'bg-amber-500 text-black border-amber-500'
                                        : 'bg-zinc-800/50 text-zinc-300 border-zinc-700 hover:border-amber-500/50'
                                    }`}
                                title={preset.description}
                            >
                                {preset.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 6개 드롭다운 그리드: PC 3열 / Mobile 2열 */}
            <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
                {/* 조명 패턴 */}
                <ComboboxField
                    label="조명 패턴"
                    options={PATTERN_OPTIONS}
                    value={lighting.pattern}
                    onSelect={(value) => {
                        const newPattern = value as LightingSettings['pattern'];
                        // 새 패턴에서 현재 키가 충돌하면 mid-key로 리셋
                        const keyConflict = getLightingPatternConflict(newPattern, lighting.key);
                        const newKey = keyConflict === 'disabled' ? 'mid-key' : lighting.key;
                        updateLighting({ pattern: newPattern, key: newKey });
                    }}
                    getConflictLevel={(value) => getLightingPatternConflict(value, lighting.key)}
                />

                {/* Key (밝기) */}
                <ComboboxField
                    label="키 (밝기)"
                    options={KEY_OPTIONS}
                    value={lighting.key}
                    onSelect={(value) => {
                        const newKey = value as LightingSettings['key'];
                        // 새 키에서 현재 비율이 충돌하면 4:1로 리셋
                        const ratioConflict = getLightingRatioConflictForKey(lighting.ratio || '', newKey);
                        const newRatio = ratioConflict === 'disabled' ? '4:1' : lighting.ratio;
                        updateLighting({ key: newKey, ratio: newRatio });
                    }}
                    getConflictLevel={(value) => {
                        // 패턴과 충돌 또는 비율과 충돌
                        const patternConflict = getLightingKeyConflictForPattern(value, lighting.pattern);
                        if (patternConflict === 'disabled') return 'disabled';
                        const ratioConflict = getLightingKeyConflictForRatio(value, lighting.ratio || '');
                        return ratioConflict;
                    }}
                />

                {/* Ratio (대비 비율) */}
                <ComboboxField
                    label="대비 비율"
                    options={RATIO_OPTIONS}
                    value={lighting.ratio || ''}
                    onSelect={(value) => updateLighting({ ratio: value as LightingSettings['ratio'] })}
                    getConflictLevel={(value) => {
                        const keyConflict = getLightingRatioConflictForKey(value, lighting.key);
                        if (keyConflict === 'disabled') return 'disabled';
                        return getLightingRatioConflictForQuality(value, lighting.quality || '');
                    }}
                />

                {/* Quality (광질) */}
                <ComboboxField
                    label="광질"
                    options={QUALITY_OPTIONS}
                    value={lighting.quality || ''}
                    onSelect={(value) => updateLighting({ quality: value as LightingSettings['quality'] })}
                    getConflictLevel={(value) => {
                        const ratioConflict = getLightingQualityConflictForRatio(value, lighting.ratio || '');
                        if (ratioConflict === 'disabled') return 'disabled';
                        return getLightingQualityWarningForPattern(value, lighting.pattern);
                    }}
                />

                {/* ColorTemp (색온도) */}
                <ComboboxField
                    label="색온도"
                    options={COLOR_TEMP_OPTIONS}
                    value={lighting.colorTemp || ''}
                    onSelect={(value) => updateLighting({ colorTemp: value as LightingSettings['colorTemp'] })}
                />

                {/* Mood (분위기) */}
                <ComboboxField
                    label="분위기"
                    options={MOOD_OPTIONS}
                    value={lighting.mood || ''}
                    onSelect={(value) => updateLighting({ mood: value as LightingSettings['mood'] })}
                />
            </div>

            {/* Special Lighting (전체 너비) */}
            <div className={`space-y-2 ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <Label className="text-xs text-zinc-500">특수 조명</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {SPECIAL_OPTIONS.map(opt => {
                        const isChecked = lighting.special?.includes(opt.value) || false;
                        const isMaxReached = (lighting.special?.length || 0) >= 2 && !isChecked;

                        return (
                            <label
                                key={opt.value}
                                className={`flex items-center gap-2 p-2 rounded-md border transition-colors
                                        ${isChecked ? 'bg-amber-600/20 border-amber-600' : 'bg-zinc-900 border-zinc-800'}
                                        ${isMaxReached ? 'opacity-40 cursor-not-allowed' : 'hover:border-zinc-600 cursor-pointer'}
                                    `}
                            >
                                <Checkbox
                                    checked={isChecked}
                                    disabled={isMaxReached}
                                    onCheckedChange={(checked) => handleSpecialToggle(opt.value, checked as boolean)}
                                />
                                <span className="text-xs">{opt.label}</span>
                            </label>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}
