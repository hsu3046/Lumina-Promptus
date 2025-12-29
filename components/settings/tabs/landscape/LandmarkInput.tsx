'use client';

import * as React from 'react';
import { Plus, X, Mountain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSettingsStore } from '@/store/useSettingsStore';
import type { LandscapeLandmark, LandscapeSettings } from '@/types/landscape.types';

type LandmarkLayer = 'foreground' | 'middleground' | 'background';

const LAYER_CONFIG: Record<LandmarkLayer, { label: string; desc: string; distanceRange: string }> = {
    foreground: { label: '근경', desc: 'Foreground', distanceRange: '0~50m' },
    middleground: { label: '중경', desc: 'Midground', distanceRange: '50~500m' },
    background: { label: '원경', desc: 'Background', distanceRange: '500m+' },
};

const LAYER_ORDER: LandmarkLayer[] = ['foreground', 'middleground', 'background'];

export function LandmarkInput() {
    const { settings, updateLandscape } = useSettingsStore();
    const landmarks = settings.landscape.landmarks || [];

    const getLandmarksByLayer = (layer: LandmarkLayer) =>
        landmarks.filter((lm) => lm.layer === layer);

    const addLandmark = (layer: LandmarkLayer) => {
        const defaultDistance = layer === 'foreground' ? 25 : layer === 'middleground' ? 200 : 1000;
        const newLandmark: LandscapeLandmark = {
            name: '',
            distance: defaultDistance,
            direction: settings.landscape.camera.heading,
            layer,
        };
        updateLandscape({
            landmarks: [...landmarks, newLandmark],
        } as Partial<LandscapeSettings>);
    };

    const updateLandmark = (index: number, updates: Partial<LandscapeLandmark>) => {
        const updated = landmarks.map((lm, i) => (i === index ? { ...lm, ...updates } : lm));
        updateLandscape({ landmarks: updated } as Partial<LandscapeSettings>);
    };

    const removeLandmark = (index: number) => {
        const updated = landmarks.filter((_, i) => i !== index);
        updateLandscape({ landmarks: updated } as Partial<LandscapeSettings>);
    };

    const getGlobalIndex = (layer: LandmarkLayer, localIndex: number) => {
        let count = 0;
        for (let i = 0; i < landmarks.length; i++) {
            if (landmarks[i].layer === layer) {
                if (count === localIndex) return i;
                count++;
            }
        }
        return -1;
    };

    return (
        <section className="space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
                <Mountain className="w-4 h-4" />
                <h3 className="text-sm font-medium">랜드마크</h3>
            </div>

            <div className="space-y-4">
                {LAYER_ORDER.map((layer) => {
                    const layerLandmarks = getLandmarksByLayer(layer);
                    const config = LAYER_CONFIG[layer];

                    return (
                        <div key={layer} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-[10px] text-zinc-500">
                                    {config.label} ({config.desc}) · {config.distanceRange}
                                </Label>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => addLandmark(layer)}
                                    className="h-6 px-2 text-xs text-amber-400 hover:text-amber-300"
                                >
                                    <Plus className="w-3 h-3 mr-1" />
                                    추가
                                </Button>
                            </div>

                            {layerLandmarks.length === 0 ? (
                                <p className="text-[10px] text-zinc-600 italic pl-2">없음</p>
                            ) : (
                                <div className="space-y-1">
                                    {layerLandmarks.map((lm, localIdx) => {
                                        const globalIdx = getGlobalIndex(layer, localIdx);
                                        return (
                                            <div key={globalIdx} className="flex items-center gap-2">
                                                <Input
                                                    value={lm.name}
                                                    onChange={(e) => updateLandmark(globalIdx, { name: e.target.value })}
                                                    placeholder={`예: ${layer === 'foreground' ? '바위, 꽃밭' : layer === 'middleground' ? '소나무 숲' : '산, 도시 스카이라인'}`}
                                                    className="h-7 flex-1 bg-zinc-950 border-zinc-800 text-xs"
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeLandmark(globalIdx)}
                                                    className="h-7 w-7 p-0 text-zinc-500 hover:text-red-400"
                                                >
                                                    <X className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
