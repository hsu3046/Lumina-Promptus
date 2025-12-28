'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/store/useSettingsStore';
import { PersonForm } from './PersonForm';
import { FRAMING_OPTIONS, FRAMING_ANGLE_CONFLICTS, type FramingAngleConflictLevel } from '@/config/mappings/portrait-composition';
import type { StudioSubject, UserInputSettings, PortraitFraming } from '@/types';

const DEFAULT_SUBJECT: StudioSubject = {
    autoMode: true,

    // A: 외모
    skinTone: 'light',
    hairColor: 'black',
    eyeColor: 'brown',
    faceShape: 'oval',

    // B: 스타일
    gender: 'female',
    ageGroup: '20s',
    hairStyle: 'long',
    bodyType: 'average',

    // C: 패션
    topWear: '',
    bottomWear: '',
    footwear: '',
    accessory: '',

    // D: 포즈
    bodyPose: 'contrapposto',
    handPose: 'natural-relaxed',
    expression: 'natural-smile',
    gazeDirection: 'direct-eye-contact',
};

const COUNT_OPTIONS = [
    { value: 1, label: '1명' },
    { value: 2, label: '2명' },
    { value: 3, label: '3명' },
] as const;

const BACKGROUND_OPTIONS = [
    { value: 'seamless_white', label: '화이트' },
    { value: 'seamless_gray', label: '그레이' },
    { value: 'seamless_blue', label: '블루' },
    { value: 'textured', label: '텍스처' },
] as const;

// 구도 옵션 - portrait-composition.ts에서 가져옴 (전체)
const ALL_COMPOSITION_OPTIONS = FRAMING_OPTIONS.map(opt => ({
    value: opt.value,
    label: opt.label,
}));

// 카메라 앵글 옵션
const CAMERA_ANGLE_OPTIONS = [
    { value: 'eye_level', label: '아이레벨' },
    { value: 'high_angle', label: '하이앵글' },
    { value: 'low_angle', label: '로우앵글' },
    { value: 'birds_eye', label: '버즈아이' },
    { value: 'worms_eye', label: '웜즈아이' },
    { value: 'drone', label: '드론' },
] as const;

// 구성 규칙 옵션
const COMPOSITION_RULE_OPTIONS = [
    { value: 'rule_of_thirds', label: '삼분법' },
    { value: 'golden_ratio', label: '황금비' },
    { value: 'center', label: '중앙' },
    { value: 'leading_lines', label: '시선유도' },
    { value: 'symmetry', label: '대칭' },
] as const;

// 캐러셀 스타일 피커 컴포넌트
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
        <div className="flex-1 min-w-0">
            <Label className="text-[10px] text-zinc-500 block text-center mb-0.5">{label}</Label>
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

export function StudioSubjectForm() {
    const { settings, updateUserInput, updateArtDirection } = useSettingsStore();
    const { studioSubjectCount, studioComposition, studioBackgroundType, studioSubjects } = settings.userInput;
    const { cameraAngle, compositionRule } = settings.artDirection;

    // 인원수 ≥ 2 → 익스트림 클로즈업 숨김 (disabled)
    const compositionOptions = studioSubjectCount >= 2
        ? ALL_COMPOSITION_OPTIONS.filter(opt => opt.value !== 'extreme-close-up')
        : ALL_COMPOSITION_OPTIONS;

    // 구도 기반 앵글 옵션 필터링 (disabled 숨김)
    const angleOptions = CAMERA_ANGLE_OPTIONS.filter(opt => {
        const matrix = FRAMING_ANGLE_CONFLICTS[studioComposition as keyof typeof FRAMING_ANGLE_CONFLICTS];
        if (!matrix) return true;
        return matrix[opt.value] !== 'disabled';
    });

    const handleCountChange = (count: 1 | 2 | 3) => {
        let newSubjects = [...studioSubjects];
        while (newSubjects.length < count) {
            newSubjects.push({ ...DEFAULT_SUBJECT });
        }
        newSubjects = newSubjects.slice(0, count);
        // 인원수 증가 시 현재 구도가 숨겨지면 자동 변경
        const newComposition = count >= 2 && studioComposition === 'extreme-close-up'
            ? 'close-up'
            : studioComposition;
        updateUserInput({ studioSubjectCount: count, studioSubjects: newSubjects, studioComposition: newComposition as UserInputSettings['studioComposition'] });

        // 새로운 구도에서 현재 앵글이 disabled면 eye_level로 변경
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

    return (
        <>
            {/* 인원수 + 배경 + 구도 + 앵글 (캐러셀 피커) */}
            <div className="flex justify-between gap-2">
                <CarouselPicker
                    label="인원수"
                    options={COUNT_OPTIONS}
                    value={studioSubjectCount}
                    onChange={handleCountChange}
                />
                <CarouselPicker
                    label="배경"
                    options={BACKGROUND_OPTIONS}
                    value={studioBackgroundType}
                    onChange={(value) => updateUserInput({ studioBackgroundType: value as UserInputSettings['studioBackgroundType'] })}
                />
                <CarouselPicker
                    label="구도"
                    options={compositionOptions}
                    value={studioComposition}
                    onChange={(value) => {
                        const newComposition = value as UserInputSettings['studioComposition'];
                        updateUserInput({ studioComposition: newComposition });
                        // 새로운 구도에서 현재 앵글이 disabled면 eye_level로 변경
                        const matrix = FRAMING_ANGLE_CONFLICTS[newComposition as keyof typeof FRAMING_ANGLE_CONFLICTS];
                        if (matrix && matrix[cameraAngle] === 'disabled') {
                            updateArtDirection({ cameraAngle: 'eye_level' });
                        }
                    }}
                />
                <CarouselPicker
                    label="앵글"
                    options={angleOptions}
                    value={cameraAngle}
                    onChange={(value) => updateArtDirection({ cameraAngle: value })}
                />
                <CarouselPicker
                    label="구성"
                    options={COMPOSITION_RULE_OPTIONS}
                    value={compositionRule}
                    onChange={(value) => updateArtDirection({ compositionRule: value })}
                />
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
