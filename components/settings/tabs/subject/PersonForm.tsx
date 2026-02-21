'use client';

import { useMemo } from 'react';
import { Switch } from '@/components/ui/switch';
import { ComboboxField, GroupedComboboxField, type ConflictLevel as ComboboxConflictLevel } from '@/components/ui/combobox-field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useSettingsStore } from '@/store/useSettingsStore';
import { ReferenceImageUpload } from '@/components/settings/ReferenceImageUpload';
import { getFieldConflictLevel, type PortraitConfig } from './portrait-conflict-validator';
import { getBodyPoseConflict, getHandPoseConflict, getFashionDisabled } from '@/lib/rules/conflict-adapter';
import { PresetSearchPicker } from './PresetSearchPicker';
import {
    APPEARANCE_PRESETS,
    STYLE_PRESETS,
    FASHION_PRESETS,
    POSE_PRESETS,
} from './subject-presets';
import {
    BODY_POSE_OPTIONS,
    HAND_POSE_OPTIONS,
    EXPRESSION_OPTIONS,
    GAZE_OPTIONS,
} from '@/config/mappings/portrait-composition';
import {
    TOP_WEAR_GROUPS,
    BOTTOM_WEAR_GROUPS,
    FOOTWEAR_GROUPS,
    ACCESSORY1_GROUPS,
    ACCESSORY2_GROUPS,
    TOP_WEAR_OPTIONS,
    BOTTOM_WEAR_OPTIONS,
    FOOTWEAR_OPTIONS,
    ACCESSORY1_OPTIONS,
    ACCESSORY2_OPTIONS,
    type GenderTag,
} from '@/config/mappings/fashion-options';
import {
    checkFashionConflicts,
    type FashionConflictResult,
} from '@/lib/rules/conflict-framing-fashion';
import type {
    StudioSubject,
    PortraitFraming,
    PortraitBodyPose,
    PortraitHandPose,
    PortraitExpression,
    PortraitGaze,
    StudioReferenceMode,
} from '@/types';

// === 정적 옵션 데이터 ===
const SKIN_TONE_OPTIONS = [
    { value: 'fair', label: '매우 밝음', color: '#FFE4D0' },
    { value: 'light', label: '밝음', color: '#F5D0B0' },
    { value: 'medium', label: '화사한 중간톤', color: '#D4A574' },
    { value: 'tan', label: '내추럴', color: '#C09060' },
    { value: 'brown', label: '구릿빛', color: '#8D5524' },
    { value: 'dark', label: '매우 어두움', color: '#4A2C2A' },
] as const;

const HAIR_COLOR_OPTIONS = [
    { value: 'black', label: '블랙', color: '#1A1A1A' },
    { value: 'brown', label: '다크 브라운', color: '#4A3020' },
    { value: 'blonde', label: '금발', color: '#E8D590' },
    { value: 'red', label: '적갈색', color: '#8B3A2F' },
    { value: 'gray', label: '실버 그레이', color: '#A0A0A0' },
    { value: 'white', label: '백금발', color: '#F0F0F0' },
] as const;

const EYE_COLOR_OPTIONS = [
    { value: 'black', label: '딥 블랙', color: '#1A1A1A' },
    { value: 'brown', label: '다크 브라운', color: '#4A3020' },
    { value: 'light-brown', label: '라이트 브라운', color: '#87613E' },
    { value: 'hazel', label: '헤이즐', color: '#8E7618' },
    { value: 'blue', label: '블루', color: '#4A90D9' },
    { value: 'green', label: '에메랄드', color: '#50C878' },
    { value: 'gray', label: '그레이', color: '#808080' },
] as const;

const FACE_SHAPE_OPTIONS = [
    { value: 'oval', label: '계란형' },
    { value: 'round', label: '둥근형' },
    { value: 'square', label: '각진형' },
    { value: 'heart', label: '하트형' },
    { value: 'diamond', label: '다이아몬드형' },
    { value: 'oblong', label: '긴 얼굴형' },
] as const;

const GENDER_OPTIONS = [
    { value: 'female', label: '여성' },
    { value: 'male', label: '남성' },
    { value: 'androgynous', label: '중성적' },
] as const;

const AGE_GROUP_OPTIONS = [
    { value: 'early-20s', label: '20대 초반' },
    { value: 'late-20s', label: '20대 후반' },
    { value: '30s', label: '30대' },
    { value: '40s-50s', label: '40~50대' },
    { value: '60s-70s', label: '60~70대' },
    { value: '80plus', label: '80대 이상' },
] as const;

// 헤어 스타일 그룹 옵션
const HAIR_STYLE_GROUPS = [
    {
        label: '스트레이트',
        options: [
            { value: 'short-straight', label: '짧은' },
            { value: 'medium-straight', label: '중간' },
            { value: 'long-straight', label: '긴' },
        ],
    },
    {
        label: '웨이브',
        options: [
            { value: 'short-wavy', label: '짧은 웨이브' },
            { value: 'medium-wavy', label: '중간 웨이브' },
            { value: 'long-wavy', label: '긴 웨이브' },
        ],
    },
    {
        label: '묶음',
        options: [
            { value: 'ponytail', label: '포니테일' },
            { value: 'bun', label: '올림머리' },
            { value: 'braids', label: '땁은머리' },
            { value: 'half-up', label: '반묶음' },
        ],
    },
    {
        label: '특수',
        options: [
            { value: 'curly', label: '곱슬' },
            { value: 'bald', label: '대머리' },
        ],
    },
] as const;

const BODY_TYPE_OPTIONS = [
    { value: 'slim', label: '슬림' },
    { value: 'average', label: '보통' },
    { value: 'athletic', label: '운동선수형' },
    { value: 'muscular', label: '근육질' },
    { value: 'curvy', label: '풍만' },
] as const;

export interface DisabledBlocks {
    appearance: boolean;  // 외모 (피부, 성별, 나이, 체형, 머리 등)
    outfit: boolean;      // 복장 (상의, 하의, 신발, 악세서리)
    compositionPose: boolean; // 구도/포즈 (바디포즈, 핸드포즈, 표정, 시선, 위치, 여백)
}

interface PersonFormProps {
    index: number;
    subject: StudioSubject;
    onUpdate: (updates: Partial<StudioSubject>) => void;
    disabledBlocks?: DisabledBlocks;
}

export function PersonForm({ index, subject, onUpdate, disabledBlocks }: PersonFormProps) {
    const { settings } = useSettingsStore();
    const framing = settings.userInput.studioComposition;

    // 현재 Portrait 설정 (포즈 충돌 감지용)
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

    // 구도에 따른 패션 아이템 disabled 상태 (새 conflict 시스템 사용)
    const fashionDisabled = getFashionDisabled(framing);
    const isBottomDisabled = fashionDisabled.bottomWear;
    const isFootwearDisabled = fashionDisabled.footwear;

    // autoMode: true = 검색창만, false = 모든 드롭다운 표시
    const showDetail = !subject.autoMode;

    // 각 필드별 현재 충돌 레벨 계산 (새 conflict 시스템 사용)
    const getConflict = (field: keyof PortraitConfig) => (value: string): ComboboxConflictLevel => {
        // 바디 포즈와 핸드 포즈는 새 시스템 사용
        if (field === 'bodyPose') {
            return getBodyPoseConflict(framing, value) as ComboboxConflictLevel;
        }
        if (field === 'handPose') {
            return getHandPoseConflict(framing, value) as ComboboxConflictLevel;
        }
        // 나머지는 레거시 시스템 (표정, 시선 등)
        const result = getFieldConflictLevel(currentConfig, field, value);
        return result.level as ComboboxConflictLevel;
    };

    // 성별 변경 시 헤어스타일 및 패션 자동 선택
    const handleGenderChange = (newGender: 'male' | 'female' | 'androgynous') => {
        // 성별별 헤어스타일 기본값
        const hairStyleDefaults: Record<string, string> = {
            male: 'short-straight',
            female: 'long-straight',
            androgynous: 'medium-straight',
        };

        // 구도에 따른 하의/신발 visibility
        const bottomDisabled = ['extreme-close-up', 'close-up', 'bust-shot', 'waist-shot'].includes(framing);
        const footwearDisabled = ['extreme-close-up', 'close-up', 'bust-shot', 'waist-shot', 'half-shot', 'three-quarter-shot'].includes(framing);

        onUpdate({
            gender: newGender,
            hairStyle: hairStyleDefaults[newGender],
            // 패션은 성별에 관계없이 기본 캐주얼
            topWear: 'white-tshirt',
            bottomWear: bottomDisabled ? '' : 'blue-jeans',
            footwear: footwearDisabled ? '' : 'white-sneakers',
            // 악세서리는 항상 빈값
            accessory: '',
            accessory2: '',
        });
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

    const isAppearanceDisabled = disabledBlocks?.appearance ?? false;
    const isOutfitDisabled = disabledBlocks?.outfit ?? false;
    const isPoseDisabled = disabledBlocks?.compositionPose ?? false;

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

            {/* 레퍼런스 사진 섹션 (인물1 바로 아래) */}
            <div className="space-y-2">
                <span className="text-[10px] text-zinc-500">레퍼런스 사진</span>
                <div className="flex items-center gap-4 flex-wrap">
                    <RadioGroup
                        value={settings.userInput.studioReferenceMode}
                        onValueChange={(v) => {
                            const { updateUserInput } = useSettingsStore.getState();
                            if (v === 'none') {
                                updateUserInput({ studioReferenceMode: 'none', studioReferenceImage: undefined });
                            } else {
                                updateUserInput({ studioReferenceMode: v as StudioReferenceMode });
                            }
                        }}
                        className="flex gap-4"
                    >
                        {[
                            { value: 'none', label: '참고 안함' },
                            { value: 'all', label: '전체' },
                            { value: 'appearance', label: '외형만' },
                            { value: 'outfit', label: '복장만' },
                            { value: 'composition', label: '구도만' },
                        ].map((opt) => (
                            <div key={opt.value} className="flex items-center gap-2">
                                <RadioGroupItem
                                    value={opt.value}
                                    id={`ref-mode-${opt.value}`}
                                />
                                <Label htmlFor={`ref-mode-${opt.value}`} className="text-sm text-zinc-300 cursor-pointer">
                                    {opt.label}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
                {settings.userInput.studioReferenceMode !== 'none' && (
                    <ReferenceImageUpload
                        image={settings.userInput.studioReferenceImage}
                        onUpload={(img) => {
                            const { updateUserInput } = useSettingsStore.getState();
                            updateUserInput({ studioReferenceImage: img });
                        }}
                        onRemove={() => {
                            const { updateUserInput } = useSettingsStore.getState();
                            updateUserInput({ studioReferenceImage: undefined });
                        }}
                    />
                )}
            </div>

            {/* 외모 프리셋 + 성별/나이/체형 (항상 표시) */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-2 transition-opacity ${isAppearanceDisabled ? 'opacity-40 pointer-events-none' : ''}`}>
                <PresetSearchPicker
                    label="외모"
                    placeholder="한국인..."
                    options={APPEARANCE_PRESETS}
                    value={subject.appearancePresetId || ''}
                    onChange={(preset) => onUpdate({ appearancePresetId: preset.id, ...preset.values })}
                />
                <ComboboxField
                    label="성별"
                    options={GENDER_OPTIONS}
                    value={subject.gender}
                    onSelect={(v) => handleGenderChange(v as 'male' | 'female' | 'androgynous')}
                    disabled={isAppearanceDisabled}
                />
                <ComboboxField
                    label="나이"
                    options={AGE_GROUP_OPTIONS}
                    value={subject.ageGroup}
                    onSelect={(v) => onUpdate({ ageGroup: v as StudioSubject['ageGroup'] })}
                    disabled={isAppearanceDisabled}
                />
                <ComboboxField
                    label="체형"
                    options={BODY_TYPE_OPTIONS}
                    value={subject.bodyType}
                    onSelect={(v) => onUpdate({ bodyType: v as StudioSubject['bodyType'] })}
                    disabled={isAppearanceDisabled}
                />
            </div>
            {isAppearanceDisabled && (
                <p className="text-[10px] text-amber-500/70 -mt-1">📸 레퍼런스 사진에서 외형을 참고합니다</p>
            )}

            {/* 상세 모드: 개별 드롭다운 */}
            {showDetail && (
                <div className="space-y-4 pt-4">
                    {/* Row 1: 피부톤 - 얼굴형 - 눈색 - 머리색 */}
                    <div className={`grid grid-cols-2 md:grid-cols-4 gap-2 transition-opacity ${isAppearanceDisabled ? 'opacity-40 pointer-events-none' : ''}`}>
                        <ComboboxField
                            label="피부톤"
                            options={SKIN_TONE_OPTIONS}
                            value={subject.skinTone}
                            onSelect={(v) => onUpdate({ skinTone: v as StudioSubject['skinTone'] })}
                            disabled={isAppearanceDisabled}
                        />
                        <ComboboxField
                            label="얼굴형"
                            options={FACE_SHAPE_OPTIONS}
                            value={subject.faceShape}
                            onSelect={(v) => onUpdate({ faceShape: v as StudioSubject['faceShape'] })}
                            disabled={isAppearanceDisabled}
                        />
                        <ComboboxField
                            label="눈색"
                            options={EYE_COLOR_OPTIONS}
                            value={subject.eyeColor}
                            onSelect={(v) => onUpdate({ eyeColor: v as StudioSubject['eyeColor'] })}
                            disabled={isAppearanceDisabled}
                        />
                        <ComboboxField
                            label="머리색"
                            options={HAIR_COLOR_OPTIONS}
                            value={subject.hairColor}
                            onSelect={(v) => onUpdate({ hairColor: v as StudioSubject['hairColor'] })}
                            disabled={isAppearanceDisabled}
                        />
                    </div>

                    {/* Row 2: 헤어스타일 - 상의 - 하의 - 신발 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div className={`transition-opacity ${isAppearanceDisabled ? 'opacity-40 pointer-events-none' : ''}`}>
                            <GroupedComboboxField
                                label="헤어스타일"
                                groups={HAIR_STYLE_GROUPS}
                                value={subject.hairStyle}
                                onSelect={(v) => onUpdate({ hairStyle: v })}
                                disabled={isAppearanceDisabled}
                            />
                        </div>
                        <div className={`transition-opacity ${isOutfitDisabled ? 'opacity-40 pointer-events-none' : ''}`}>
                            <GroupedComboboxField
                                label="상의"
                                groups={TOP_WEAR_GROUPS}
                                value={subject.topWear}
                                onSelect={(v) => onUpdate({ topWear: v })}
                                placeholder="선택 안함"
                                disabled={isOutfitDisabled}
                            />
                        </div>
                        <div className={`transition-opacity ${isOutfitDisabled ? 'opacity-40 pointer-events-none' : ''}`}>
                            <GroupedComboboxField
                                label="하의"
                                groups={BOTTOM_WEAR_GROUPS}
                                value={subject.bottomWear}
                                onSelect={(v) => onUpdate({ bottomWear: v })}
                                placeholder="선택 안함"
                                disabled={isBottomDisabled || isOutfitDisabled}
                            />
                        </div>
                        <div className={`transition-opacity ${isOutfitDisabled ? 'opacity-40 pointer-events-none' : ''}`}>
                            <GroupedComboboxField
                                label="신발"
                                groups={FOOTWEAR_GROUPS}
                                value={subject.footwear}
                                onSelect={(v) => onUpdate({ footwear: v })}
                                placeholder="선택 안함"
                                disabled={isFootwearDisabled || isOutfitDisabled}
                            />
                        </div>
                    </div>
                    {isOutfitDisabled && (
                        <p className="text-[10px] text-amber-500/70 -mt-2">📸 레퍼런스 사진에서 복장을 참고합니다</p>
                    )}

                    {/* Row 3: 악세서리1 - 악세서리2 - 표정 - 시선 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div className={`transition-opacity ${isOutfitDisabled ? 'opacity-40 pointer-events-none' : ''}`}>
                            <GroupedComboboxField
                                label="악세서리1"
                                groups={ACCESSORY1_GROUPS}
                                value={subject.accessory}
                                onSelect={(v) => onUpdate({ accessory: v })}
                                placeholder="선택 안함"
                                disabled={isOutfitDisabled}
                            />
                        </div>
                        <div className={`transition-opacity ${isOutfitDisabled ? 'opacity-40 pointer-events-none' : ''}`}>
                            <GroupedComboboxField
                                label="악세서리2"
                                groups={ACCESSORY2_GROUPS}
                                value={subject.accessory2}
                                onSelect={(v) => onUpdate({ accessory2: v })}
                                placeholder="선택 안함"
                                disabled={isOutfitDisabled}
                            />
                        </div>
                        <div className={`transition-opacity ${isPoseDisabled ? 'opacity-40 pointer-events-none' : ''}`}>
                            <ComboboxField
                                label="표정"
                                options={EXPRESSION_OPTIONS}
                                value={subject.expression}
                                onSelect={(v) => onUpdate({ expression: v as PortraitExpression })}
                                getConflictLevel={getConflict('expression')}
                                disabled={isPoseDisabled}
                            />
                        </div>
                        <div className={`transition-opacity ${isPoseDisabled ? 'opacity-40 pointer-events-none' : ''}`}>
                            <ComboboxField
                                label="시선"
                                options={GAZE_OPTIONS}
                                value={subject.gazeDirection}
                                onSelect={(v) => onUpdate({ gazeDirection: v as PortraitGaze })}
                                getConflictLevel={getConflict('gaze')}
                                disabled={isPoseDisabled}
                            />
                        </div>
                    </div>

                    {/* Row 4: 바디포즈 - 핸드포즈 - 위치 - 여백 */}
                    <div className={`grid grid-cols-2 md:grid-cols-4 gap-2 transition-opacity ${isPoseDisabled ? 'opacity-40 pointer-events-none' : ''}`}>
                        <ComboboxField
                            label="바디 포즈"
                            options={BODY_POSE_OPTIONS}
                            value={subject.bodyPose}
                            onSelect={(v) => onUpdate({ bodyPose: v as PortraitBodyPose })}
                            getConflictLevel={getConflict('bodyPose')}
                            disabled={isPoseDisabled}
                        />
                        <ComboboxField
                            label="핸드 포즈"
                            options={HAND_POSE_OPTIONS}
                            value={subject.handPose}
                            onSelect={(v) => onUpdate({ handPose: v as PortraitHandPose })}
                            getConflictLevel={getConflict('handPose')}
                            disabled={isPoseDisabled}
                        />
                        <ComboboxField
                            label="위치"
                            options={[
                                { value: 'left', label: '왼쪽' },
                                { value: 'center', label: '기본' },
                                { value: 'right', label: '오른쪽' },
                            ]}
                            value={subject.position}
                            onSelect={(v) => onUpdate({ position: v as 'left' | 'center' | 'right' })}
                            disabled={isPoseDisabled}
                        />
                        <ComboboxField
                            label="여백"
                            options={[
                                { value: 'tight', label: '타이트' },
                                { value: 'normal', label: '기본' },
                                { value: 'loose', label: '여유' },
                            ]}
                            value={subject.margin}
                            onSelect={(v) => onUpdate({ margin: v as 'tight' | 'normal' | 'loose' })}
                            disabled={isPoseDisabled}
                        />
                    </div>
                    {isPoseDisabled && (
                        <p className="text-[10px] text-amber-500/70 -mt-2">📸 레퍼런스 사진에서 구도/포즈를 참고합니다</p>
                    )}
                </div>
            )}
        </div>
    );
}
