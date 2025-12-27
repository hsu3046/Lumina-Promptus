'use client';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSettingsStore } from '@/store/useSettingsStore';
import { PersonForm } from './PersonForm';
import type { StudioSubject } from '@/types';

const DEFAULT_SUBJECT: StudioSubject = {
    autoMode: true,
    gender: 'female',
    ageGroup: '20s',
    ethnicity: 'asian',
    hairColor: 'black',
    hairStyle: 'long',
    eyeColor: 'brown',
    skinTexture: 'natural',
    otherFeatures: '',
    fashion: '',
};

export function StudioSubjectForm() {
    const { settings, updateUserInput } = useSettingsStore();
    const { studioSubjectCount, studioComposition, studioSubjects } = settings.userInput;

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
            {/* Row 1: 인원수 + 구도 */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>인원수</Label>
                    <div className="flex gap-2">
                        {([1, 2, 3] as const).map((count) => (
                            <button
                                key={count}
                                onClick={() => handleCountChange(count)}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${studioSubjectCount === count
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                    }`}
                            >
                                {count}명
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>구도</Label>
                    <Select
                        value={studioComposition}
                        onValueChange={(v) => updateUserInput({ studioComposition: v as 'closeup' | 'bust' | 'waist' | 'full' | 'extreme_closeup' })}
                    >
                        <SelectTrigger className="bg-zinc-950 border-zinc-800">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            <SelectItem value="extreme_closeup">익스트림 클로즈업</SelectItem>
                            <SelectItem value="closeup">클로즈업</SelectItem>
                            <SelectItem value="bust">바스트샷</SelectItem>
                            <SelectItem value="waist">웨이스트샷</SelectItem>
                            <SelectItem value="full">풀샷</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* 인원별 상세 정보 */}
            {studioSubjects.slice(0, studioSubjectCount).map((subject, idx) => (
                <PersonForm
                    key={idx}
                    index={idx}
                    subject={subject}
                    onUpdate={(updates) => handleSubjectUpdate(idx, updates)}
                />
            ))}
        </>
    );
}
