'use client';

import { Label } from '@/components/ui/label';
import { useSettingsStore } from '@/store/useSettingsStore';
import type { LightingSettings } from '@/types';
import type { ReactNode } from 'react';

const LIGHTING_SETUP_OPTIONS = [
    { value: '1point', label: '1점 조명', desc: '드라마틱 명암' },
    { value: '2point', label: '2점 조명', desc: '부드러운 입체감' },
    { value: '3point', label: '3점 조명', desc: '인물 분리' },
    { value: 'backlight', label: '백라이트', desc: '실루엣 효과' },
] as const;

const LIGHTING_TOOL_OPTIONS: { value: string; label: ReactNode; desc: string }[] = [
    { value: 'softbox', label: <>소프트<br className="md:hidden" />박스</>, desc: '부드러운 피부' },
    { value: 'beautydish', label: '뷰티 디쉬', desc: '선명한 윤곽' },
    { value: 'spotlight', label: <>스포트<br className="md:hidden" />라이트</>, desc: '집중 조명' },
    { value: 'umbrella', label: '엄브렐러', desc: '넓은 확산' },
];

const BACKGROUND_DETAIL_OPTIONS: { value: string; label: ReactNode; desc: string }[] = [
    { value: 'circular', label: <>원형 캐치<br className="md:hidden" />라이트</>, desc: '생기 있는 눈' },
    { value: 'window', label: <>창문 캐치<br className="md:hidden" />라이트</>, desc: '자연스러운 반사' },
    { value: 'halo', label: '광륜', desc: '배경 그라데이션' },
    { value: 'blackout', label: '배경 암전', desc: '인물만 부각' },
];

const COLOR_TEMP_OPTIONS: { value: string; label: ReactNode; desc: string }[] = [
    { value: '5600k', label: <>표준<br className="md:hidden" />화이트</>, desc: '5600K 정확한 색상' },
    { value: '3200k', label: <>따뜻한<br className="md:hidden" />텅스텐</>, desc: '3200K 온기' },
    { value: '7500k', label: <>차가운<br className="md:hidden" />시네마틱</>, desc: '7500K 모던' },
    { value: 'colorgel', label: '컬러 젤', desc: '창의적 색상' },
];

interface OptionButtonProps {
    option: { value: string; label: ReactNode; desc: string };
    isSelected: boolean;
    isDisabled?: boolean;
    onClick: () => void;
}

function OptionButton({ option, isSelected, isDisabled, onClick }: OptionButtonProps) {
    // 라이팅 OFF일 때는 선택 상태도 회색으로 표시
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
                    {LIGHTING_SETUP_OPTIONS.map((option) => (
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
                    {LIGHTING_TOOL_OPTIONS.map((option) => (
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
                    {BACKGROUND_DETAIL_OPTIONS.map((option) => (
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
                    {COLOR_TEMP_OPTIONS.map((option) => (
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
