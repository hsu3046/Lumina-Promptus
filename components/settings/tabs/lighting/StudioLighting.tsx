'use client';

import { Label } from '@/components/ui/label';
import { useSettingsStore } from '@/store/useSettingsStore';
import type { LightingSettings } from '@/types';
import {
    STUDIO_LIGHTING_SETUPS,
    STUDIO_LIGHTING_TOOLS,
    STUDIO_BACKGROUNDS,
    STUDIO_COLOR_TEMPS,
    type StudioLightingOption,
} from '@/config/mappings/lighting-patterns';

interface OptionButtonProps {
    option: StudioLightingOption;
    isSelected: boolean;
    isDisabled?: boolean;
    onClick: () => void;
}

function OptionButton({ option, isSelected, isDisabled, onClick }: OptionButtonProps) {
    const showActive = isSelected && !isDisabled;
    return (
        <button
            onClick={onClick}
            disabled={isDisabled}
            className={`px-3 py-2 rounded-md text-xs font-medium transition-colors flex flex-col items-center justify-center ${showActive
                ? 'bg-amber-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <span>{option.label}</span>
            <span className="text-[10px] opacity-70 hidden md:block">{option.desc}</span>
        </button>
    );
}

export function StudioLighting() {
    const { settings, updateLighting } = useSettingsStore();
    const isDisabled = !settings.lighting.enabled;

    return (
        <div className="space-y-6">
            {/* 1. 조명 구조 */}
            <div className="space-y-3">
                <Label>조명 구조</Label>
                <div className="grid grid-cols-4 gap-2">
                    {STUDIO_LIGHTING_SETUPS.map((option) => (
                        <OptionButton
                            key={option.value}
                            option={option}
                            isSelected={settings.lighting.studioLightingSetup === option.value}
                            isDisabled={isDisabled}
                            onClick={() => updateLighting({ studioLightingSetup: option.value as LightingSettings['studioLightingSetup'] })}
                        />
                    ))}
                </div>
            </div>

            {/* 2. 광질 및 도구 */}
            <div className="space-y-3">
                <Label>광질 및 도구</Label>
                <div className="grid grid-cols-4 gap-2">
                    {STUDIO_LIGHTING_TOOLS.map((option) => (
                        <OptionButton
                            key={option.value}
                            option={option}
                            isSelected={settings.lighting.studioLightingTool === option.value}
                            isDisabled={isDisabled}
                            onClick={() => updateLighting({ studioLightingTool: option.value as LightingSettings['studioLightingTool'] })}
                        />
                    ))}
                </div>
            </div>

            {/* 3. 디테일 및 배경 */}
            <div className="space-y-3">
                <Label>캐치라이트 / 배경</Label>
                <div className="grid grid-cols-4 gap-2">
                    {STUDIO_BACKGROUNDS.map((option) => (
                        <OptionButton
                            key={option.value}
                            option={option}
                            isSelected={settings.lighting.studioBackgroundDetail === option.value}
                            isDisabled={isDisabled}
                            onClick={() => updateLighting({ studioBackgroundDetail: option.value as LightingSettings['studioBackgroundDetail'] })}
                        />
                    ))}
                </div>
            </div>

            {/* 4. 스튜디오 색온도 */}
            <div className="space-y-3">
                <Label>색온도</Label>
                <div className="grid grid-cols-4 gap-2">
                    {STUDIO_COLOR_TEMPS.map((option) => (
                        <OptionButton
                            key={option.value}
                            option={option}
                            isSelected={settings.lighting.studioColorTemp === option.value}
                            isDisabled={isDisabled}
                            onClick={() => updateLighting({ studioColorTemp: option.value as LightingSettings['studioColorTemp'] })}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
