'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSettingsStore } from '@/store/useSettingsStore';

const CHARACTERISTIC_TYPES = [
    { value: 'studio', label: '스튜디오' },
    { value: 'landscape', label: '풍경' },
    { value: 'architecture', label: '건축물' },
    { value: 'product', label: '제품' },
    { value: 'street', label: '스냅' },
] as const;

type CharacteristicType = typeof CHARACTERISTIC_TYPES[number]['value'];

interface CharacteristicTypeSelectorProps {
    onTypeChange?: (type: CharacteristicType) => void;
}

export function CharacteristicTypeSelector({ onTypeChange }: CharacteristicTypeSelectorProps) {
    const { settings, updateArtDirection } = useSettingsStore();
    const currentType = settings.artDirection.lensCharacteristicType;

    const handleChange = (type: string) => {
        updateArtDirection({ lensCharacteristicType: type as CharacteristicType });
        onTypeChange?.(type as CharacteristicType);
    };

    return (
        <Tabs value={currentType} onValueChange={handleChange}>
            <TabsList className="w-full h-auto p-0 bg-transparent border-b border-zinc-700/50 rounded-none">
                {CHARACTERISTIC_TYPES.map((option) => (
                    <TabsTrigger
                        key={option.value}
                        value={option.value}
                        className="flex-1 rounded-none border-0 border-b-2 border-b-transparent data-[state=active]:!border-0 data-[state=active]:!border-b-2 data-[state=active]:!border-b-amber-500 data-[state=active]:!bg-transparent data-[state=active]:!text-amber-400 data-[state=active]:!shadow-none px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-300 transition-colors"
                    >
                        {option.label}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );
}
