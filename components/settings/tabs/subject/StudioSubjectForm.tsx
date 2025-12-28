'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/store/useSettingsStore';
import { PersonForm } from './PersonForm';
import type { StudioSubject, UserInputSettings } from '@/types';

const DEFAULT_SUBJECT: StudioSubject = {
    autoMode: true,
    gender: 'female',
    ageGroup: '20s',
    ethnicity: 'asian',
    bodyType: 'average',
    skinTexture: 'natural',
    hairColor: 'black',
    hairStyle: 'long',
    gazeDirection: 'camera',
    pose: 'contrapposto',
    accessory: 'none',
    fashion: '',
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

const COMPOSITION_OPTIONS = [
    { value: 'closeup', label: '클로즈업' },
    { value: 'bust', label: '바스트' },
    { value: 'waist', label: '웨이스트' },
    { value: 'full', label: '풀샷' },
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
    const { settings, updateUserInput } = useSettingsStore();
    const { studioSubjectCount, studioComposition, studioBackgroundType, studioSubjects } = settings.userInput;

    const handleCountChange = (count: 1 | 2 | 3) => {
        let newSubjects = [...studioSubjects];
        while (newSubjects.length < count) {
            newSubjects.push({ ...DEFAULT_SUBJECT });
        }
        newSubjects = newSubjects.slice(0, count);
        updateUserInput({ studioSubjectCount: count, studioSubjects: newSubjects });
    };

    const handleSubjectUpdate = (index: number, updates: Partial<StudioSubject>) => {
        const newSubjects = [...studioSubjects];
        newSubjects[index] = { ...newSubjects[index], ...updates };
        updateUserInput({ studioSubjects: newSubjects });
    };

    return (
        <>
            {/* 인원수 + 배경 + 구도 (캐러셀 피커) */}
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
                    options={COMPOSITION_OPTIONS}
                    value={studioComposition}
                    onChange={(value) => updateUserInput({ studioComposition: value as UserInputSettings['studioComposition'] })}
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
