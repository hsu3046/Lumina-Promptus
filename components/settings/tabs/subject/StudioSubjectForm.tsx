'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, Shuffle, Grid2x2, RectangleHorizontal, RectangleVertical, Square } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ComboboxField, GroupedComboboxField, type ConflictLevel } from '@/components/ui/combobox-field';
import { useSettingsStore } from '@/store/useSettingsStore';
import { PersonForm } from './PersonForm';
import {
    FRAMING_OPTIONS,
    FRAMING_ANGLE_CONFLICTS,
    FRAMING_BODY_POSE_CONFLICTS,
    FRAMING_HAND_POSE_CONFLICTS,
    type FramingAngleConflictLevel
} from '@/config/mappings/portrait-composition';
import {
    APPEARANCE_PRESETS,
    STYLE_PRESETS,
    FASHION_PRESETS,
    POSE_PRESETS,
} from '@/config/presets/subject-presets';
import {
    selectConflictAwarePose,
    getFashionVisibility,
} from '@/lib/conflict-aware-random';
import type { StudioSubject, UserInputSettings, PortraitFraming, PortraitExpression } from '@/types';

const DEFAULT_SUBJECT: StudioSubject = {
    autoMode: true,
    // 외모 (한국인 프리셋 기본값)
    appearancePresetId: 'korean',
    skinTone: 'light',
    hairColor: 'black',
    eyeColor: 'brown',
    faceShape: 'oval',
    gender: 'female',
    ageGroup: 'early-20s',
    hairStyle: 'long-straight',
    bodyType: 'average',
    topWear: '',
    bottomWear: '',
    footwear: '',
    accessory: '',
    accessory2: '',
    bodyPose: 'straight',
    handPose: 'natural-relaxed',
    expression: 'natural-smile',
    gazeDirection: 'direct-eye-contact',
    position: 'center',
    margin: 'normal',
};

const COUNT_OPTIONS = [
    { value: 1, label: '1명' },
    { value: 2, label: '2명' },
    { value: 3, label: '3명' },
] as const;

const BACKGROUND_OPTIONS = [
    { value: 'seamless_white', label: '화이트', color: '#FFFFFF' },
    { value: 'seamless_gray', label: '그레이', color: '#9CA3AF' },
    { value: 'seamless_black', label: '블랙', color: '#1F2937' },
    { value: 'seamless_red', label: '레드', color: '#991B1B' },
    { value: 'seamless_beige', label: '베이지', color: '#D4B896' },
    { value: 'seamless_blue', label: '크로마키 - 블루', color: '#0066FF' },
    { value: 'seamless_green', label: '크로마키 - 그린', color: '#00FF00' },
    { value: 'textured', label: '텍스처', icon: Grid2x2 },
] as const;

// 구도 옵션 (익스트림 클로즈업, 롱샷 제외)
const ALL_COMPOSITION_OPTIONS = FRAMING_OPTIONS
    .filter(opt => opt.value !== 'extreme-close-up' && opt.value !== 'long-shot')
    .map(opt => ({
        value: opt.value,
        label: opt.label,
    }));

// 앵글 옵션 (드론 제외)
const CAMERA_ANGLE_OPTIONS = [
    { value: 'eye_level', label: '아이레벨' },
    { value: 'high_angle', label: '하이앵글' },
    { value: 'low_angle', label: '로우앵글' },
    { value: 'birds_eye', label: '버즈아이' },
    { value: 'worms_eye', label: '웜즈아이' },
] as const;

// 사진 비율 그룹 옵션 (단순하게: value = label = 저장값)
const ASPECT_RATIO_GROUPS = [
    {
        label: '',
        options: [
            { value: '3:2', label: '3:2', icon: RectangleHorizontal },
            { value: '4:3', label: '4:3', icon: RectangleHorizontal },
            { value: '16:9', label: '16:9', icon: RectangleHorizontal },
            { value: '5:4', label: '5:4', icon: RectangleHorizontal },
            { value: '1:1', label: '1:1', icon: Square },
        ],
    },
    {
        label: '',
        options: [
            { value: '2:3', label: '2:3', icon: RectangleVertical },
            { value: '3:4', label: '3:4', icon: RectangleVertical },
            { value: '9:16', label: '9:16', icon: RectangleVertical },
            { value: '4:5', label: '4:5', icon: RectangleVertical },
        ],
    },
] as const;

// 랜덤 옵션 데이터 (실제 타입에 맞춤)
const RANDOM_OPTIONS = {
    skinTone: ['light', 'medium', 'tan', 'dark'] as const,
    hairColor: ['black', 'brown', 'blonde', 'red', 'gray'] as const,
    eyeColor: ['brown', 'blue', 'green', 'hazel'] as const,
    faceShape: ['oval', 'round', 'square', 'heart'] as const,
    gender: ['male', 'female'] as const,
    ageGroup: ['early-20s', 'late-20s', '30s', '40s-50s', '60s-70s'] as const,
    hairStyle: ['short', 'medium', 'long', 'curly', 'bald'] as const,
    bodyType: ['slim', 'average', 'athletic', 'muscular', 'curvy'] as const,
    bodyPose: ['straight', 'contrapposto', 's-curve', 'three-quarter-turn', 'sitting', 'reclining'] as const,
    handPose: ['natural-relaxed', 'editorial-hands', 'pocket-hands', 'crossed-arms', 'framing-face', 'hair-touch'] as const,
    expression: ['natural-smile', 'bright-smile', 'subtle-smile', 'neutral', 'serious', 'pensive', 'playful', 'sensual'] as PortraitExpression[],
    gazeDirection: ['direct-eye-contact', 'off-camera', 'looking-up', 'looking-down', 'side-gaze', 'over-shoulder'] as const,
};

const pickRandom = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];

// 캐러셀 스타일 피커 (인원수용)
interface CarouselPickerProps<T extends string | number> {
    label: string;
    options: readonly { value: T; label: string }[];
    value: T;
    onChange: (value: T) => void;
}

function CarouselPicker<T extends string | number>({ label, options, value, onChange }: CarouselPickerProps<T>) {
    const currentIndex = options.findIndex(opt => opt.value === value);
    const currentLabel = options[currentIndex]?.label || '';

    const handlePrev = () => {
        const newIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1;
        onChange(options[newIndex].value);
    };

    const handleNext = () => {
        const newIndex = currentIndex >= options.length - 1 ? 0 : currentIndex + 1;
        onChange(options[newIndex].value);
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex items-center justify-center">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrev}
                    className="h-6 w-6 text-zinc-500 hover:text-white hover:bg-transparent p-0"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="min-w-[3.5rem] text-center text-sm font-medium text-amber-400 truncate">
                    {currentLabel}
                </span>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNext}
                    className="h-6 w-6 text-zinc-500 hover:text-white hover:bg-transparent p-0"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

// Combobox Row (그리드 컨테이너)
function ComboboxRow({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {children}
        </div>
    );
}


export function StudioSubjectForm() {
    const { settings, updateUserInput, updateArtDirection, updateCamera } = useSettingsStore();
    const { studioSubjectCount, studioComposition, studioBackgroundType, studioSubjects } = settings.userInput;
    const { cameraAngle } = settings.artDirection;

    // 인원수 ≥ 2 → 익스트림 클로즈업 숨김
    const compositionOptions = studioSubjectCount >= 2
        ? ALL_COMPOSITION_OPTIONS.filter(opt => opt.value !== 'extreme-close-up')
        : ALL_COMPOSITION_OPTIONS;

    // 구도 기반 앵글 충돌 정보
    const getAngleConflictLevel = (angleValue: string): FramingAngleConflictLevel => {
        const framingMatrix = FRAMING_ANGLE_CONFLICTS[studioComposition as keyof typeof FRAMING_ANGLE_CONFLICTS];
        return framingMatrix?.[angleValue] ?? 'ok';
    };

    const handleCountChange = (count: 1 | 2 | 3) => {
        let newSubjects = [...studioSubjects];
        while (newSubjects.length < count) {
            newSubjects.push({ ...DEFAULT_SUBJECT });
        }
        newSubjects = newSubjects.slice(0, count);
        const newComposition = count >= 2 && studioComposition === 'extreme-close-up'
            ? 'close-up'
            : studioComposition;
        updateUserInput({ studioSubjectCount: count, studioSubjects: newSubjects, studioComposition: newComposition as UserInputSettings['studioComposition'] });

        const newMatrix = FRAMING_ANGLE_CONFLICTS[newComposition as keyof typeof FRAMING_ANGLE_CONFLICTS];
        if (newMatrix && newMatrix[cameraAngle] === 'disabled') {
            updateArtDirection({ cameraAngle: 'eye_level' });
        }
    };

    const handleSubjectUpdate = (index: number, updates: Partial<StudioSubject>) => {
        const newSubjects = [...studioSubjects];
        newSubjects[index] = { ...newSubjects[index], ...updates };
        updateUserInput({ studioSubjects: newSubjects });
    };

    // 랜덤 인물 생성 (프리셋 기반 + 충돌 회피)
    const handleRandomize = () => {
        const newSubjects: StudioSubject[] = [];

        // 현재 구도와 앵글 가져오기
        const currentFraming = studioComposition as PortraitFraming;
        const currentAngle = settings.artDirection.cameraAngle;

        // 구도에 따른 패션 가시성 체크
        const fashionVisibility = getFashionVisibility(currentFraming);

        for (let i = 0; i < studioSubjectCount; i++) {
            // A: 외모는 제한 없이 랜덤
            const randomAppearance = pickRandom(APPEARANCE_PRESETS);

            // B: 스타일 먼저 선택
            const randomStyle = pickRandom(STYLE_PRESETS);

            // C: 스타일 태그와 호환되는 패션만 필터링
            const compatibleFashions = FASHION_PRESETS.filter(fashion => {
                // 성별 체크: unisex는 모두 호환, 그 외는 매칭
                const genderMatch = fashion.tags.includes('unisex') ||
                    (randomStyle.tags.includes('male') && fashion.tags.includes('male')) ||
                    (randomStyle.tags.includes('female') && fashion.tags.includes('female'));

                // 연령대 체크: 최소 하나가 매칭되면 통과
                const ageMatch = randomStyle.tags.some(tag =>
                    ['child', 'teen', 'adult', 'senior'].includes(tag) && fashion.tags.includes(tag as 'child' | 'teen' | 'adult' | 'senior')
                );

                return genderMatch && ageMatch;
            });

            const randomFashion = compatibleFashions.length > 0
                ? pickRandom(compatibleFashions)
                : FASHION_PRESETS[0];

            // D: 구도/앵글에 호환되는 포즈 순차 선택 (충돌 회피)
            const { bodyPose, handPose, expression, gaze } = selectConflictAwarePose({
                framing: currentFraming,
                angle: currentAngle,
            });

            // 패션 아이템 가시성에 따라 처리
            // 보이지 않으면 빈값으로 (프롬프트에 포함되지 않도록)
            const bottomWear = fashionVisibility.bottomWear ? randomFashion.values.bottomWear : '';
            const footwear = fashionVisibility.footwear ? randomFashion.values.footwear : '';
            const accessory = fashionVisibility.accessoryOk(randomFashion.values.accessory)
                ? randomFashion.values.accessory
                : '';

            newSubjects.push({
                autoMode: studioSubjects[i]?.autoMode ?? true,
                // 외모 (APPEARANCE_PRESETS)
                appearancePresetId: randomAppearance.id,
                ...randomAppearance.values,
                // 스타일 (STYLE_PRESETS)
                ...randomStyle.values,
                // 패션 (가시성 필터링 적용)
                topWear: randomFashion.values.topWear,
                bottomWear,
                footwear,
                accessory,
                accessory2: '',  // 기본값
                // 포즈 (충돌 회피 적용)
                bodyPose,
                handPose,
                expression,
                gazeDirection: gaze,
                // 위치/여백 기본값
                position: 'center',
                margin: 'normal',
            });
        }
        updateUserInput({ studioSubjects: newSubjects });
    };

    return (
        <>
            {/* 배경/구도/앵글/구성: PC 4열, 모바일 2열 */}
            <ComboboxRow>
                {/* 배경 */}
                <ComboboxField
                    label="배경"
                    options={BACKGROUND_OPTIONS}
                    value={studioBackgroundType}
                    onSelect={(value) => updateUserInput({ studioBackgroundType: value as UserInputSettings['studioBackgroundType'] })}
                />

                {/* 구도 */}
                <ComboboxField
                    label="구도"
                    options={compositionOptions}
                    value={studioComposition}
                    onSelect={(value) => {
                        const newComposition = value as UserInputSettings['studioComposition'];
                        const newFraming = newComposition as PortraitFraming;

                        // 구도에 따라 disabled되는 패션 아이템을 미리 초기화
                        const bottomDisabled = ['extreme-close-up', 'close-up', 'bust-shot', 'waist-shot'].includes(newComposition);
                        const footwearDisabled = ['extreme-close-up', 'close-up', 'bust-shot', 'waist-shot', 'half-shot', 'three-quarter-shot'].includes(newComposition);

                        // 새 구도에서의 포즈 충돌 맵
                        const bodyPoseConflicts = FRAMING_BODY_POSE_CONFLICTS[newFraming] || {};
                        const handPoseConflicts = FRAMING_HAND_POSE_CONFLICTS[newFraming] || {};

                        // 모든 피사체의 disabled된 패션 및 critical conflict 포즈 초기화
                        const updatedSubjects = studioSubjects.map(subject => ({
                            ...subject,
                            bottomWear: bottomDisabled ? '' : subject.bottomWear,
                            footwear: footwearDisabled ? '' : subject.footwear,
                            // Critical conflict 포즈 → 기본값으로 초기화
                            bodyPose: bodyPoseConflicts[subject.bodyPose] === 'critical' ? 'straight' : subject.bodyPose,
                            handPose: handPoseConflicts[subject.handPose] === 'critical' ? 'natural-relaxed' : subject.handPose,
                        }));

                        updateUserInput({
                            studioComposition: newComposition,
                            studioSubjects: updatedSubjects,
                        });

                        const matrix = FRAMING_ANGLE_CONFLICTS[newComposition as keyof typeof FRAMING_ANGLE_CONFLICTS];
                        if (matrix && matrix[cameraAngle] === 'disabled') {
                            updateArtDirection({ cameraAngle: 'eye_level' });
                        }
                    }}
                />

                {/* 앵글 */}
                <ComboboxField
                    label="앵글"
                    options={CAMERA_ANGLE_OPTIONS.filter(opt => getAngleConflictLevel(opt.value) !== 'disabled')}
                    value={cameraAngle}
                    onSelect={(value) => updateArtDirection({ cameraAngle: value })}
                    getConflictLevel={(value) => getAngleConflictLevel(value) as ConflictLevel}
                />

                {/* 사진비율 */}
                <GroupedComboboxField
                    label="비율"
                    groups={ASPECT_RATIO_GROUPS}
                    value={settings.camera.aspectRatio}
                    onSelect={(value) => updateCamera({ aspectRatio: value })}
                />
            </ComboboxRow>

            {/* 섹션 구분선 */}
            <hr className="lp-divider my-4" />

            {/* 인원수 (중앙) + 랜덤 버튼 (우측) */}
            <div className="relative flex items-center justify-center mb-3">
                <CarouselPicker
                    label="인원수"
                    options={COUNT_OPTIONS}
                    value={studioSubjectCount}
                    onChange={handleCountChange}
                />
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRandomize}
                    className="absolute right-0 h-6 w-6 text-zinc-500 hover:text-amber-400 hover:bg-zinc-800"
                    title="랜덤 인물 설정"
                >
                    <Shuffle className="w-4 h-4" />
                </Button>
            </div>

            {/* 인원별 상세 정보 */}
            {studioSubjects.slice(0, studioSubjectCount).map((subject, idx) => (
                <div key={idx}>
                    {idx > 0 && <hr className="border-zinc-700/50 my-4" />}
                    <PersonForm
                        index={idx}
                        subject={subject}
                        onUpdate={(updates) => handleSubjectUpdate(idx, updates)}
                    />
                </div>
            ))}
        </>
    );
}
