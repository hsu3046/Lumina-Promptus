'use client';

import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useSettingsStore } from '@/store/useSettingsStore';
import { StudioLighting } from './StudioLighting';

const EXPOSURE_OPTIONS = [
    { value: 'low_key', label: '로우키', desc: '그림자 강조' },
    { value: 'normal', label: '적정 노출', desc: '균형 잡힌 밝기' },
    { value: 'high_key', label: '하이키', desc: '밝고 부드러움' },
] as const;

export function LightingTab() {
    const { settings, updateLighting } = useSettingsStore();
    const characteristicType = settings.artDirection.lensCharacteristicType;

    return (
        <Card className="bg-zinc-900/50 border-zinc-800/50">
            <CardContent className="space-y-6 pt-3">
                {/* 라이팅 ON/OFF - Switch With Description */}
                <div className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 p-4">
                    <div className="space-y-0.5">
                        <Label htmlFor="lighting-switch" className="text-base font-medium">스튜디오 라이팅</Label>
                        <p className="text-sm text-zinc-500">
                            {settings.lighting.enabled
                                ? '셔터스피드 1/200, ISO 100 고정'
                                : '자연광/주변광 모드 사용'}
                        </p>
                    </div>
                    <Switch
                        id="lighting-switch"
                        checked={settings.lighting.enabled}
                        onCheckedChange={(checked) => updateLighting({ enabled: checked })}
                    />
                </div>

                {/* 노출 */}
                <div className="space-y-3">
                    <Label>노출</Label>
                    <div className="grid grid-cols-3 gap-2">
                        {EXPOSURE_OPTIONS.map((option) => {
                            const isSelected = settings.lighting.exposure === option.value;
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => updateLighting({ exposure: option.value as 'low_key' | 'normal' | 'high_key' })}
                                    className={`px-3 py-2 rounded-md text-xs font-medium transition-colors flex flex-col items-center ${isSelected
                                        ? 'bg-amber-600 text-white'
                                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300'
                                        }`}
                                >
                                    <span>{option.label}</span>
                                    <span className="text-[10px] opacity-70 hidden md:block">{option.desc}</span>
                                </button>
                            );
                        })}
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
