'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { UserIcon, Sun01Icon, Camera01Icon, Book01Icon, Building03Icon, DiceIcon } from '@hugeicons/core-free-icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/section-header';
import { ComboboxField } from '@/components/ui/combobox-field';
import { CameraTab } from '@/components/settings/tabs/camera/CameraTab';
import { useSettingsStore } from '@/store/useSettingsStore';
import {
    SNAP_SUBJECT_TYPES,
    SNAP_LOCATIONS,
    SNAP_SPECIFIC_PLACES,
    SNAP_COMPANIONS,
    SNAP_ACTIONS,
    SNAP_MANNERS,
    SNAP_WEATHER,
    SNAP_SEASONS,
    SNAP_TIME_OF_DAY,
    SNAP_ATMOSPHERE,
    SNAP_LIGHTING,
    SNAP_CROWD_DENSITY,
} from '@/config/mappings/snap-options';

export function SnapTab() {
    // Zustand 스토어에서 스냅 상태 가져오기
    const snap = useSettingsStore(state => state.settings.snap);
    const updateSnap = useSettingsStore(state => state.updateSnap);

    // 스토리 미리보기 생성 (조건부 표시)
    const subjectLabel = snap.subject ? SNAP_SUBJECT_TYPES.find(s => s.value === snap.subject)?.label : '';
    const timeLabel = snap.timeOfDay ? SNAP_TIME_OF_DAY.find(t => t.value === snap.timeOfDay)?.label : '';
    const locationLabel = snap.location ? SNAP_LOCATIONS.find(l => l.value === snap.location)?.label : '';
    const companionLabel = snap.companion ? SNAP_COMPANIONS.find(c => c.value === snap.companion)?.label : '';
    const actionLabel = snap.action ? SNAP_ACTIONS.find(a => a.value === snap.action)?.label : '';
    const mannerLabel = snap.manner ? SNAP_MANNERS.find(m => m.value === snap.manner)?.label : '';

    // 스토리 파트 조합
    const storyParts = [
        timeLabel,
        locationLabel ? `${locationLabel}에서` : '',
        companionLabel,
        mannerLabel,
        actionLabel,
        subjectLabel
    ].filter(Boolean);
    const storyPreview = storyParts.join(' ');

    // 랜덤 스토리 생성
    const randomizeStory = () => {
        const pick = <T extends readonly { value: string }[]>(arr: T) =>
            arr[Math.floor(Math.random() * arr.length)].value;
        updateSnap({
            subject: pick(SNAP_SUBJECT_TYPES),
            timeOfDay: pick(SNAP_TIME_OF_DAY),
            location: pick(SNAP_LOCATIONS),
            companion: pick(SNAP_COMPANIONS),
            action: pick(SNAP_ACTIONS),
            manner: pick(SNAP_MANNERS),
        });
    };

    return (
        <Tabs defaultValue="subject" className="w-full">
            {/* Underline 스타일 탭 */}
            <TabsList className="w-full border-b border-zinc-800 p-0 h-auto">
                <TabsTrigger value="subject" className="lp-tab-trigger">
                    <HugeiconsIcon icon={UserIcon} size={16} />
                    피사체 설정
                </TabsTrigger>
                <TabsTrigger value="environment" className="lp-tab-trigger">
                    <HugeiconsIcon icon={Sun01Icon} size={16} />
                    환경 설정
                </TabsTrigger>
                <TabsTrigger value="camera" className="lp-tab-trigger">
                    <HugeiconsIcon icon={Camera01Icon} size={16} />
                    카메라 설정
                </TabsTrigger>
            </TabsList>

            {/* 피사체 설정 탭 */}
            <TabsContent value="subject" className="mt-6 space-y-6">
                {/* 스토리 빌더 - 2열 그리드 */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <SectionHeader icon={UserIcon} title="스토리 빌더" />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={randomizeStory}
                            className="h-7 px-2 text-xs text-zinc-400 hover:text-amber-400 hover:bg-zinc-800"
                        >
                            <HugeiconsIcon icon={DiceIcon} size={14} />
                            랜덤
                        </Button>
                    </div>

                    {/* PC 3열, 모바일 2열 그리드 */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {/* 누가 */}
                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-400">누가</Label>
                            <ComboboxField
                                label=""
                                options={SNAP_SUBJECT_TYPES.map(s => ({ value: s.value, label: s.label }))}
                                value={snap.subject}
                                onSelect={(v) => updateSnap({ subject: v })}
                                clearable
                            />
                        </div>

                        {/* 언제 */}
                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-400">언제</Label>
                            <ComboboxField
                                label=""
                                options={SNAP_TIME_OF_DAY.map(t => ({ value: t.value, label: t.label }))}
                                value={snap.timeOfDay}
                                onSelect={(v) => updateSnap({ timeOfDay: v })}
                                clearable
                            />
                        </div>

                        {/* 어디서 */}
                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-400">어디서</Label>
                            <ComboboxField
                                label=""
                                options={SNAP_LOCATIONS.map(l => ({ value: l.value, label: l.label }))}
                                value={snap.location}
                                onSelect={(v) => updateSnap({ location: v })}
                                clearable
                            />
                        </div>

                        {/* 누구와 */}
                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-400">누구와</Label>
                            <ComboboxField
                                label=""
                                options={SNAP_COMPANIONS.map(c => ({ value: c.value, label: c.label }))}
                                value={snap.companion}
                                onSelect={(v) => updateSnap({ companion: v })}
                                clearable
                            />
                        </div>

                        {/* 무엇을 */}
                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-400">무엇을</Label>
                            <ComboboxField
                                label=""
                                options={SNAP_ACTIONS.map(a => ({ value: a.value, label: a.label }))}
                                value={snap.action}
                                onSelect={(v) => updateSnap({ action: v })}
                                clearable
                            />
                        </div>

                        {/* 어떻게 */}
                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-400">어떻게</Label>
                            <ComboboxField
                                label=""
                                options={SNAP_MANNERS.map(m => ({ value: m.value, label: m.label }))}
                                value={snap.manner}
                                onSelect={(v) => updateSnap({ manner: v })}
                                clearable
                            />
                        </div>
                    </div>
                </section>

                {/* 스토리 미리보기 - 값이 있을 때만 표시 */}
                {storyPreview && (
                    <>
                        <hr className="lp-divider" />
                        <SectionHeader icon={Book01Icon} title="스토리 미리보기" />
                        <p className="text-zinc-300 text-sm italic leading-relaxed">
                            &quot;{storyPreview}&quot;
                        </p>
                    </>
                )}
            </TabsContent>

            {/* 환경 설정 탭 */}
            <TabsContent value="environment" className="mt-6 space-y-4">
                {/* 순서: 구체적인 장소/날씨/계절/분위기/조명/군중밀도 - PC 3열, 모바일 2열 */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {/* 구체적인 장소 */}
                    <section className="space-y-2">
                        <Label className="text-xs text-zinc-400">구체적인 장소</Label>
                        <ComboboxField
                            label=""
                            options={SNAP_SPECIFIC_PLACES.map(p => ({ value: p.value, label: p.label }))}
                            value={snap.specificPlace}
                            onSelect={(v) => updateSnap({ specificPlace: v })}
                            clearable
                        />
                    </section>

                    {/* 날씨 */}
                    <section className="space-y-2">
                        <Label className="text-xs text-zinc-400">날씨</Label>
                        <ComboboxField
                            label=""
                            options={SNAP_WEATHER.map(w => ({ value: w.value, label: w.label }))}
                            value={snap.weather}
                            onSelect={(v) => updateSnap({ weather: v })}
                            clearable
                        />
                    </section>

                    {/* 계절 */}
                    <section className="space-y-2">
                        <Label className="text-xs text-zinc-400">계절</Label>
                        <ComboboxField
                            label=""
                            options={SNAP_SEASONS.map(s => ({ value: s.value, label: s.label }))}
                            value={snap.season}
                            onSelect={(v) => updateSnap({ season: v })}
                            clearable
                        />
                    </section>

                    {/* 분위기/효과 */}
                    <section className="space-y-2">
                        <Label className="text-xs text-zinc-400">분위기/효과</Label>
                        <ComboboxField
                            label=""
                            options={SNAP_ATMOSPHERE.map(a => ({ value: a.value, label: a.label }))}
                            value={snap.atmosphere}
                            onSelect={(v) => updateSnap({ atmosphere: v })}
                            clearable
                        />
                    </section>

                    {/* 조명 */}
                    <section className="space-y-2">
                        <Label className="text-xs text-zinc-400">조명</Label>
                        <ComboboxField
                            label=""
                            options={SNAP_LIGHTING.map(l => ({ value: l.value, label: l.label }))}
                            value={snap.lighting}
                            onSelect={(v) => updateSnap({ lighting: v })}
                            clearable
                        />
                    </section>

                    {/* 군중 밀도 */}
                    <section className="space-y-2">
                        <Label className="text-xs text-zinc-400">군중 밀도</Label>
                        <ComboboxField
                            label=""
                            options={SNAP_CROWD_DENSITY.map(c => ({ value: c.value, label: c.label }))}
                            value={snap.crowdDensity}
                            onSelect={(v) => updateSnap({ crowdDensity: v })}
                            clearable
                        />
                    </section>
                </div>


            </TabsContent>

            {/* 카메라 설정 탭 */}
            <TabsContent value="camera" className="mt-6">
                <CameraTab />
            </TabsContent>
        </Tabs>
    );
}
