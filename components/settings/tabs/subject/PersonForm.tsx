'use client';

import { useMemo } from 'react';
import { AlertTriangle, CircleAlert } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/store/useSettingsStore';
import { getFieldConflictLevel, type PortraitConfig } from '@/lib/portrait-conflict-validator';
import { PresetSearchPicker } from './PresetSearchPicker';
import {
    APPEARANCE_PRESETS,
    STYLE_PRESETS,
    FASHION_PRESETS,
    POSE_PRESETS,
} from '@/config/presets/subject-presets';
import {
    BODY_POSE_OPTIONS,
    HAND_POSE_OPTIONS,
    EXPRESSION_OPTIONS,
    GAZE_OPTIONS,
    type ConflictLevel,
} from '@/config/mappings/portrait-composition';
import {
    TOP_WEAR_OPTIONS,
    BOTTOM_WEAR_OPTIONS,
    FOOTWEAR_OPTIONS,
    ACCESSORY_OPTIONS,
} from '@/config/mappings/fashion-options';
import {
    checkFashionConflicts,
    type FashionConflictResult,
} from '@/config/mappings/framing-fashion-conflicts';
import type {
    StudioSubject,
    PortraitFraming,
    PortraitBodyPose,
    PortraitHandPose,
    PortraitExpression,
    PortraitGaze
} from '@/types';

interface PersonFormProps {
    index: number;
    subject: StudioSubject;
    onUpdate: (updates: Partial<StudioSubject>) => void;
}

// 충돌 아이콘 컴포넌트
function ConflictIcon({ level }: { level: ConflictLevel }) {
    if (level === 'critical') {
        return <CircleAlert className="h-3 w-3 text-red-500 shrink-0" />;
    }
    if (level === 'warning') {
        return <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0" />;
    }
    return null;
}



export function PersonForm({ index, subject, onUpdate }: PersonFormProps) {
    const { settings } = useSettingsStore();
    const framing = settings.userInput.studioComposition;



    // 현재 Portrait 설정 (D: 포즈 충돌 감지용)
    const currentConfig = useMemo((): PortraitConfig => ({
        framing: framing as PortraitFraming,
        bodyPose: subject.bodyPose,
        handPose: subject.handPose,
        expression: subject.expression,
        gaze: subject.gazeDirection,
    }), [framing, subject.bodyPose, subject.handPose, subject.expression, subject.gazeDirection]);

    // 패션-구도 충돌 감지
    const fashionConflicts = useMemo((): FashionConflictResult[] => {
        return checkFashionConflicts(
            framing as PortraitFraming,
            subject.bottomWear || '',
            subject.footwear || '',
            subject.accessory || ''
        );
    }, [framing, subject.bottomWear, subject.footwear, subject.accessory]);

    // 특정 필드의 패션 충돌 조회
    const getFashionConflict = (field: 'bottomWear' | 'footwear' | 'accessory'): FashionConflictResult | undefined => {
        return fashionConflicts.find(c => c.field === field);
    };

    // autoMode: true = 검색창만, false = 모든 드롭다운 표시
    const showDetail = !subject.autoMode;

    // 각 필드별 현재 충돌 레벨 계산
    const getConflict = (field: keyof PortraitConfig, value: string) => {
        return getFieldConflictLevel(currentConfig, field, value);
    };

    // 현재 선택된 프리셋 ID 계산
    const findSelectedPresetId = <T extends { id: string; values: Record<string, unknown> }>(
        presets: T[],
        keys: (keyof StudioSubject)[]
    ): string => {
        for (const preset of presets) {
            const matches = keys.every(key => {
                const presetValue = preset.values[key as keyof typeof preset.values];
                return presetValue === subject[key];
            });
            if (matches) return preset.id;
        }
        return '';
    };

    const selectedAppearance = findSelectedPresetId(APPEARANCE_PRESETS, ['skinTone', 'hairColor', 'eyeColor', 'faceShape']);
    const selectedStyle = findSelectedPresetId(STYLE_PRESETS, ['gender', 'ageGroup', 'hairStyle', 'bodyType']);
    const selectedFashion = findSelectedPresetId(FASHION_PRESETS, ['topWear', 'bottomWear', 'footwear', 'accessory']);
    const selectedPose = findSelectedPresetId(POSE_PRESETS, ['bodyPose', 'handPose', 'expression', 'gazeDirection']);

    return (
        <div className="space-y-3 py-3">
            {/* 인물 헤더 + 상세 Switch */}
            <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-amber-400">인물 {index + 1}</div>
                <div className="flex items-center gap-1">
                    <Switch
                        checked={showDetail}
                        onCheckedChange={(checked) => onUpdate({ autoMode: !checked })}
                    />
                    <span className="text-xs text-zinc-500">상세</span>
                </div>
            </div>

            {/* 4개 검색창 (항상 표시) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {/* A: 외모 */}
                <PresetSearchPicker
                    label="외모"
                    placeholder="한국인..."
                    options={APPEARANCE_PRESETS}
                    value={selectedAppearance}
                    onChange={(preset) => onUpdate(preset.values)}
                />

                {/* B: 스타일 */}
                <PresetSearchPicker
                    label="스타일"
                    placeholder="20대 여성..."
                    options={STYLE_PRESETS}
                    value={selectedStyle}
                    onChange={(preset) => onUpdate(preset.values)}
                />

                {/* C: 패션 (텍스트 프리셋) */}
                <PresetSearchPicker
                    label="패션"
                    placeholder="캐주얼..."
                    options={FASHION_PRESETS}
                    value={selectedFashion}
                    onChange={(preset) => onUpdate(preset.values)}
                />

                {/* D: 포즈 */}
                <PresetSearchPicker
                    label="포즈"
                    placeholder="자연스러운..."
                    options={POSE_PRESETS}
                    value={selectedPose}
                    onChange={(preset) => onUpdate(preset.values)}
                />
            </div>

            {/* 상세 모드: 개별 드롭다운 */}
            {showDetail && (
                <div className="space-y-4 pt-4">
                    {/* A: 외모 상세 */}
                    <div className="space-y-2">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div className="space-y-1">
                                <Label className="text-[10px] text-zinc-500">피부톤</Label>
                                <Select value={subject.skinTone} onValueChange={(v) => onUpdate({ skinTone: v as StudioSubject['skinTone'] })}>
                                    <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 h-8 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        <SelectItem value="fair">페어</SelectItem>
                                        <SelectItem value="light">라이트</SelectItem>
                                        <SelectItem value="medium">미디움</SelectItem>
                                        <SelectItem value="tan">탠</SelectItem>
                                        <SelectItem value="brown">브라운</SelectItem>
                                        <SelectItem value="dark">다크</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] text-zinc-500">머리색</Label>
                                <Select value={subject.hairColor} onValueChange={(v) => onUpdate({ hairColor: v as StudioSubject['hairColor'] })}>
                                    <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 h-8 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        <SelectItem value="black">검정</SelectItem>
                                        <SelectItem value="brown">갈색</SelectItem>
                                        <SelectItem value="blonde">금발</SelectItem>
                                        <SelectItem value="red">빨강</SelectItem>
                                        <SelectItem value="gray">회색</SelectItem>
                                        <SelectItem value="white">흰색</SelectItem>
                                        <SelectItem value="pink">핑크</SelectItem>
                                        <SelectItem value="blue">블루</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] text-zinc-500">눈색</Label>
                                <Select value={subject.eyeColor} onValueChange={(v) => onUpdate({ eyeColor: v as StudioSubject['eyeColor'] })}>
                                    <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 h-8 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        <SelectItem value="brown">갈색</SelectItem>
                                        <SelectItem value="black">검정</SelectItem>
                                        <SelectItem value="blue">파랑</SelectItem>
                                        <SelectItem value="green">녹색</SelectItem>
                                        <SelectItem value="hazel">헤이즐</SelectItem>
                                        <SelectItem value="gray">회색</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] text-zinc-500">얼굴형</Label>
                                <Select value={subject.faceShape} onValueChange={(v) => onUpdate({ faceShape: v as StudioSubject['faceShape'] })}>
                                    <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 h-8 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        <SelectItem value="oval">타원형</SelectItem>
                                        <SelectItem value="round">둥근형</SelectItem>
                                        <SelectItem value="square">각진형</SelectItem>
                                        <SelectItem value="heart">하트형</SelectItem>
                                        <SelectItem value="oblong">긴형</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* B: 스타일 상세 */}
                    <div className="space-y-2">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div className="space-y-1">
                                <Label className="text-[10px] text-zinc-500">성별</Label>
                                <Select value={subject.gender} onValueChange={(v) => onUpdate({ gender: v as 'male' | 'female' })}>
                                    <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 h-8 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        <SelectItem value="male">남성</SelectItem>
                                        <SelectItem value="female">여성</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] text-zinc-500">나이</Label>
                                <Select value={subject.ageGroup} onValueChange={(v) => onUpdate({ ageGroup: v as StudioSubject['ageGroup'] })}>
                                    <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 h-8 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        <SelectItem value="child">어린이</SelectItem>
                                        <SelectItem value="teen">10대</SelectItem>
                                        <SelectItem value="20s">20대</SelectItem>
                                        <SelectItem value="30s">30대</SelectItem>
                                        <SelectItem value="40s">40대</SelectItem>
                                        <SelectItem value="50plus">50대+</SelectItem>
                                        <SelectItem value="elderly">노인</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] text-zinc-500">헤어스타일</Label>
                                <Select value={subject.hairStyle} onValueChange={(v) => onUpdate({ hairStyle: v as StudioSubject['hairStyle'] })}>
                                    <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 h-8 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        <SelectItem value="short">짧은</SelectItem>
                                        <SelectItem value="medium">중간</SelectItem>
                                        <SelectItem value="long">긴</SelectItem>
                                        <SelectItem value="wavy">웨이브</SelectItem>
                                        <SelectItem value="curly">곱슬</SelectItem>
                                        <SelectItem value="straight">스트레이트</SelectItem>
                                        <SelectItem value="bald">대머리</SelectItem>
                                        <SelectItem value="ponytail">포니테일</SelectItem>
                                        <SelectItem value="bun">올림머리</SelectItem>
                                        <SelectItem value="braids">땋은머리</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] text-zinc-500">체형</Label>
                                <Select value={subject.bodyType} onValueChange={(v) => onUpdate({ bodyType: v as StudioSubject['bodyType'] })}>
                                    <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 h-8 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        <SelectItem value="slim">슬림</SelectItem>
                                        <SelectItem value="average">보통</SelectItem>
                                        <SelectItem value="athletic">건장</SelectItem>
                                        <SelectItem value="curvy">글래머</SelectItem>
                                        <SelectItem value="plus">플러스</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* C: 패션 상세 */}
                    <div className="space-y-2">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div className="space-y-1">
                                <Label className="text-[10px] text-zinc-500">상의</Label>
                                <Select value={subject.topWear || 'none'} onValueChange={(v) => onUpdate({ topWear: v === 'none' ? '' : v })}>
                                    <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 h-8 text-xs"><SelectValue placeholder="선택 안함" /></SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 max-h-48">
                                        {TOP_WEAR_OPTIONS.map((opt) => (
                                            <SelectItem key={opt.value || 'none'} value={opt.value || 'none'}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] text-zinc-500 flex items-center gap-1">
                                    하의
                                    {getFashionConflict('bottomWear') && <ConflictIcon level={getFashionConflict('bottomWear')!.level} />}
                                </Label>
                                <Select value={subject.bottomWear || 'none'} onValueChange={(v) => onUpdate({ bottomWear: v === 'none' ? '' : v })}>
                                    <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 h-8 text-xs"><SelectValue placeholder="선택 안함" /></SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 max-h-48">
                                        {BOTTOM_WEAR_OPTIONS.map((opt) => (
                                            <SelectItem key={opt.value || 'none'} value={opt.value || 'none'}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] text-zinc-500 flex items-center gap-1">
                                    신발
                                    {getFashionConflict('footwear') && <ConflictIcon level={getFashionConflict('footwear')!.level} />}
                                </Label>
                                <Select value={subject.footwear || 'none'} onValueChange={(v) => onUpdate({ footwear: v === 'none' ? '' : v })}>
                                    <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 h-8 text-xs"><SelectValue placeholder="선택 안함" /></SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 max-h-48">
                                        {FOOTWEAR_OPTIONS.map((opt) => (
                                            <SelectItem key={opt.value || 'none'} value={opt.value || 'none'}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] text-zinc-500 flex items-center gap-1">
                                    악세서리
                                    {getFashionConflict('accessory') && <ConflictIcon level={getFashionConflict('accessory')!.level} />}
                                </Label>
                                <Select value={subject.accessory || 'none'} onValueChange={(v) => onUpdate({ accessory: v === 'none' ? '' : v })}>
                                    <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 h-8 text-xs"><SelectValue placeholder="선택 안함" /></SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 max-h-48">
                                        {ACCESSORY_OPTIONS.map((opt) => (
                                            <SelectItem key={opt.value || 'none'} value={opt.value || 'none'}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* D: 포즈 상세 */}
                    <div className="space-y-2">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div className="space-y-1">
                                <Label className="text-[10px] text-zinc-500">바디 포즈</Label>
                                <Select value={subject.bodyPose} onValueChange={(v) => onUpdate({ bodyPose: v as PortraitBodyPose })}>
                                    <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 h-8 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        {BODY_POSE_OPTIONS.map((opt) => {
                                            const conflict = getConflict('bodyPose', opt.value);
                                            return (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    <div className="flex items-center gap-1">
                                                        <ConflictIcon level={conflict.level} />
                                                        <span>{opt.label}</span>
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] text-zinc-500">핸드 포즈</Label>
                                <Select value={subject.handPose} onValueChange={(v) => onUpdate({ handPose: v as PortraitHandPose })}>
                                    <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 h-8 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        {HAND_POSE_OPTIONS.map((opt) => {
                                            const conflict = getConflict('handPose', opt.value);
                                            return (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    <div className="flex items-center gap-1">
                                                        <ConflictIcon level={conflict.level} />
                                                        <span>{opt.label}</span>
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] text-zinc-500">표정</Label>
                                <Select value={subject.expression} onValueChange={(v) => onUpdate({ expression: v as PortraitExpression })}>
                                    <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 h-8 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        {EXPRESSION_OPTIONS.map((opt) => {
                                            const conflict = getConflict('expression', opt.value);
                                            return (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    <div className="flex items-center gap-1">
                                                        <ConflictIcon level={conflict.level} />
                                                        <span>{opt.label}</span>
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] text-zinc-500">시선</Label>
                                <Select value={subject.gazeDirection} onValueChange={(v) => onUpdate({ gazeDirection: v as PortraitGaze })}>
                                    <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 h-8 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        {GAZE_OPTIONS.map((opt) => {
                                            const conflict = getConflict('gaze', opt.value);
                                            return (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    <div className="flex items-center gap-1">
                                                        <ConflictIcon level={conflict.level} />
                                                        <span>{opt.label}</span>
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
