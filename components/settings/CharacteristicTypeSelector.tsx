'use client';

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

    const handleChange = (type: CharacteristicType) => {
        updateArtDirection({ lensCharacteristicType: type });
        onTypeChange?.(type);
    };

    return (
        <div className="grid grid-cols-5 gap-2">
            {CHARACTERISTIC_TYPES.map((option) => (
                <button
                    key={option.value}
                    onClick={() => handleChange(option.value)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${currentType === option.value
                            ? 'bg-violet-600 text-white'
                            : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300 border border-zinc-700/50'
                        }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}
