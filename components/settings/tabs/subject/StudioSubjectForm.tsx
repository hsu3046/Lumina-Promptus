'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { useSettingsStore } from '@/store/useSettingsStore';
import { PersonForm } from './PersonForm';
import type { StudioSubject } from '@/types';

const DEFAULT_SUBJECT: StudioSubject = {
    autoMode: true,
    gender: 'female',
    ageGroup: '20s',
    ethnicity: 'asian',
    bodyType: 'average',
    skinTexture: 'natural',
    hairColor: 'black',
    hairStyle: 'long',
    eyeColor: 'brown',
    gazeDirection: 'camera',
    accessory: 'none',
    fashion: '',
};

const COUNT_OPTIONS = [
    { value: 1, label: '1명' },
    { value: 2, label: '2명' },
    { value: 3, label: '3명' },
    { value: 'group', label: '단체' },
] as const;

const COMPOSITION_OPTIONS = [
    { value: 'closeup', label: '클로즈업' },
    { value: 'bust', label: '바스트샷' },
    { value: 'waist', label: '웨이스트샷' },
    { value: 'full', label: '풀샷' },
] as const;

export function StudioSubjectForm() {
    const { settings, updateUserInput } = useSettingsStore();
    const { studioSubjectCount, studioComposition, studioSubjects } = settings.userInput;

    const handleCountChange = (count: 1 | 2 | 3 | 'group') => {
        // 단체는 아직 미구현
        if (count === 'group') return;

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
            {/* 인원수 + 구도 */}
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div className="space-y-2">
                    <Label>인원수</Label>
                    <ButtonGroup>
                        {COUNT_OPTIONS.map((option) => (
                            <Button
                                key={option.value}
                                variant={studioSubjectCount === option.value ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleCountChange(option.value)}
                                className={`w-16 ${studioSubjectCount === option.value
                                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                    : ''}`}
                            >
                                {option.label}
                            </Button>
                        ))}
                    </ButtonGroup>
                </div>

                <div className="space-y-2 md:text-right">
                    <Label>구도</Label>
                    <ButtonGroup>
                        {COMPOSITION_OPTIONS.map((option) => (
                            <Button
                                key={option.value}
                                variant={studioComposition === option.value ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => updateUserInput({ studioComposition: option.value })}
                                className={`w-20 ${studioComposition === option.value
                                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                    : ''}`}
                            >
                                {option.label}
                            </Button>
                        ))}
                    </ButtonGroup>
                </div>
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
