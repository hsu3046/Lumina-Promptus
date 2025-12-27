'use client';

import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useSettingsStore } from '@/store/useSettingsStore';
import { StudioLighting } from './StudioLighting';

const EXPOSURE_OPTIONS = [
    { value: 'low_key', label: '로우키' },
    { value: 'normal', label: '적정 노출' },
    { value: 'high_key', label: '하이키' },
] as const;

export function LightingTab() {
    const { settings, updateLighting } = useSettingsStore();
    const characteristicType = settings.artDirection.lensCharacteristicType;

    return (
        <Card className="bg-zinc-900/50 border-zinc-800/50">
            <CardContent className="space-y-6 pt-6">
                {/* 라이팅 ON/OFF */}
                <div className="flex items-center justify-between">
                    <Label className="text-base">라이팅</Label>
                    <button
                        onClick={() => updateLighting({ enabled: !settings.lighting.enabled })}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${settings.lighting.enabled
                                ? 'bg-green-600 text-white'
                                : 'bg-zinc-700 text-zinc-400'
                            }`}
                    >
                        {settings.lighting.enabled ? 'ON' : 'OFF'}
                    </button>
                </div>

                {/* 노출 */}
                <div className="space-y-3">
                    <Label>노출</Label>
                    <div className="grid grid-cols-3 gap-2">
                        {EXPOSURE_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => updateLighting({ exposure: option.value as 'low_key' | 'normal' | 'high_key' })}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${settings.lighting.exposure === option.value
                                        ? 'bg-amber-600 text-white'
                                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 타입별 라이팅 설정 */}
                {characteristicType === 'studio' && <StudioLighting />}

                {/* 다른 타입 - 준비 중 */}
                {characteristicType !== 'studio' && (
                    <div className="text-center py-8 text-zinc-500">
                        <p>
                            {characteristicType.charAt(0).toUpperCase() + characteristicType.slice(1)} 모드 라이팅 설정은 준비 중입니다.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
