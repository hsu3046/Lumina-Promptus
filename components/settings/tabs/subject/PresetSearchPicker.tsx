'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface PresetOption {
    id: string;
    label: string;
    keywords: string[];
    description?: string;
}

interface PresetSearchPickerProps<T extends PresetOption> {
    label: string;
    placeholder?: string;
    options: T[];
    value: string;
    onChange: (preset: T) => void;
}

export function PresetSearchPicker<T extends PresetOption>({
    label,
    placeholder = '검색...',
    options,
    value,
    onChange,
}: PresetSearchPickerProps<T>) {
    const [open, setOpen] = React.useState(false);

    // 선택된 프리셋의 라벨 표시
    const selectedLabel = React.useMemo(() => {
        const selected = options.find(o => o.id === value);
        return selected?.label || '';
    }, [options, value]);

    return (
        <div className="space-y-1">
            <span className="text-[10px] text-zinc-500">{label}</span>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full h-8 justify-between bg-zinc-950 border-zinc-800 text-xs hover:bg-zinc-900 hover:border-zinc-700"
                    >
                        <span className={cn(
                            "truncate",
                            selectedLabel ? "text-zinc-200 font-semibold" : "text-zinc-500"
                        )}>
                            {selectedLabel || placeholder}
                        </span>
                        <Search className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-zinc-900 border-zinc-800">
                    <Command className="bg-transparent">
                        <CommandInput
                            placeholder={`${label} 검색...`}
                            className="h-8 text-xs"
                        />
                        <CommandList>
                            <CommandEmpty className="py-2 text-xs text-zinc-500 text-center">
                                결과 없음
                            </CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.id}
                                        value={`${option.label} ${option.keywords.join(' ')} ${option.description || ''}`}
                                        onSelect={() => {
                                            onChange(option);
                                            setOpen(false);
                                        }}
                                        className="text-xs cursor-pointer"
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-3 w-3",
                                                value === option.id ? "opacity-100 text-amber-500" : "opacity-0"
                                            )}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium truncate">{option.label}</div>
                                            {option.description && (
                                                <div className="text-[10px] text-zinc-500 truncate">
                                                    {option.description}
                                                </div>
                                            )}
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
