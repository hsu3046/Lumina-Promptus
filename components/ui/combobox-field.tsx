'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, CircleAlert, AlertTriangle, Lightbulb, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

// 충돌 레벨 타입 (recommend 포함)
export type ConflictLevel = 'critical' | 'warning' | 'ok' | 'disabled' | 'recommend';

// 기본 옵션 인터페이스
export interface ComboboxOption {
    value: string;
    label: string;
    color?: string;  // 색상 원 표시용
    icon?: LucideIcon;  // 아이콘 표시용
}

// ComboboxField Props
interface ComboboxFieldProps {
    label: string;
    options: readonly ComboboxOption[];
    value: string;
    onSelect: (value: string) => void;
    placeholder?: string;
    emptyMessage?: string;
    className?: string;
    // 충돌 검사 함수 (선택적)
    getConflictLevel?: (value: string) => ConflictLevel;
    // 라벨에 표시할 충돌 아이콘 (선택적)
    showLabelConflict?: ConflictLevel;
    // disabled 상태
    disabled?: boolean;
}

// 충돌 아이콘 컴포넌트
function ConflictIcon({ level }: { level: ConflictLevel }) {
    if (level === 'critical') {
        return <CircleAlert className="h-3 w-3 text-red-500 shrink-0" />;
    }
    if (level === 'warning') {
        return <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0" />;
    }
    if (level === 'recommend') {
        return <Lightbulb className="h-3 w-3 text-blue-500 shrink-0" />;
    }
    return null;
}

export function ComboboxField({
    label,
    options,
    value,
    onSelect,
    placeholder = '선택...',
    emptyMessage = '결과 없음',
    className,
    getConflictLevel,
    showLabelConflict,
    disabled = false,
}: ComboboxFieldProps) {
    const [open, setOpen] = React.useState(false);
    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={cn("min-w-0", className)}>
            <Label className={cn("text-[10px] block mb-1 flex items-center gap-1", disabled ? "text-zinc-600" : "text-zinc-500")}>
                {label}
                {showLabelConflict && <ConflictIcon level={showLabelConflict} />}
            </Label>
            <Popover open={disabled ? false : open} onOpenChange={disabled ? undefined : setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        disabled={disabled}
                        className={cn(
                            "w-full h-8 justify-between bg-zinc-950 border-zinc-800 text-xs",
                            disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-zinc-800"
                        )}
                    >
                        <span className="flex items-center gap-1 truncate">
                            {selectedOption && getConflictLevel && (
                                <ConflictIcon level={getConflictLevel(selectedOption.value)} />
                            )}
                            {selectedOption?.label || placeholder}
                        </span>
                        <span className="flex items-center gap-1">
                            {selectedOption?.color && (
                                <span
                                    className="w-3 h-3 rounded-full border border-zinc-600"
                                    style={{ backgroundColor: selectedOption.color }}
                                />
                            )}
                            {selectedOption?.icon && (
                                <selectedOption.icon className="w-3 h-3 text-zinc-400" />
                            )}
                            <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-50" />
                        </span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-zinc-900 border-zinc-800">
                    <Command className="bg-transparent">
                        <CommandList>
                            <CommandEmpty className="py-2 text-xs text-zinc-500 text-center">
                                {emptyMessage}
                            </CommandEmpty>
                            <CommandGroup>
                                {options.map((opt) => {
                                    const conflict = getConflictLevel?.(opt.value);
                                    const isCritical = conflict === 'critical';
                                    return (
                                        <CommandItem
                                            key={opt.value}
                                            value={opt.label}
                                            onSelect={() => {
                                                if (!isCritical) {
                                                    onSelect(opt.value);
                                                    setOpen(false);
                                                }
                                            }}
                                            className={cn(
                                                "text-xs",
                                                isCritical ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                                            )}
                                            disabled={isCritical}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-3 w-3",
                                                    value === opt.value ? "opacity-100 text-amber-500" : "opacity-0"
                                                )}
                                            />
                                            {conflict && <ConflictIcon level={conflict} />}
                                            <span className="flex-1 ml-1">{opt.label}</span>
                                            {opt.color && (
                                                <span
                                                    className="w-3 h-3 rounded-full border border-zinc-600 shrink-0 ml-auto"
                                                    style={{ backgroundColor: opt.color }}
                                                />
                                            )}
                                            {opt.icon && (
                                                <opt.icon className="w-3 h-3 text-zinc-400 shrink-0 ml-auto" />
                                            )}
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}

// ===== 그룹화된 Combobox Field =====
export interface ComboboxOptionGroup {
    label: string;
    options: readonly ComboboxOption[];
}

interface GroupedComboboxFieldProps {
    label: string;
    groups: readonly ComboboxOptionGroup[];
    value: string;
    onSelect: (value: string) => void;
    placeholder?: string;
    emptyMessage?: string;
    className?: string;
    disabled?: boolean;
}

export function GroupedComboboxField({
    label,
    groups,
    value,
    onSelect,
    placeholder = '선택...',
    emptyMessage = '결과 없음',
    className,
    disabled = false,
}: GroupedComboboxFieldProps) {
    const [open, setOpen] = React.useState(false);

    // 모든 그룹에서 선택된 옵션 찾기
    const selectedOption = groups.flatMap(g => g.options).find(opt => opt.value === value);

    return (
        <div className={cn("min-w-0", className)}>
            <Label className={cn("text-[10px] block mb-1", disabled ? "text-zinc-600" : "text-zinc-500")}>
                {label}
            </Label>
            <Popover open={disabled ? false : open} onOpenChange={disabled ? undefined : setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        disabled={disabled}
                        className={cn(
                            "w-full h-8 justify-between bg-zinc-950 border-zinc-800 text-xs",
                            disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-zinc-800"
                        )}
                    >
                        <span className="truncate">
                            {selectedOption?.label || placeholder}
                        </span>
                        <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-zinc-900 border-zinc-800">
                    <Command className="bg-transparent">
                        <CommandList className="max-h-[250px]">
                            <CommandEmpty className="py-2 text-xs text-zinc-500 text-center">
                                {emptyMessage}
                            </CommandEmpty>
                            {groups.map((group, groupIdx) => (
                                <CommandGroup key={groupIdx} heading={group.label}>
                                    {group.options.map((opt) => (
                                        <CommandItem
                                            key={opt.value}
                                            value={opt.label}
                                            onSelect={() => {
                                                onSelect(opt.value);
                                                setOpen(false);
                                            }}
                                            className="text-xs cursor-pointer"
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-3 w-3",
                                                    value === opt.value ? "opacity-100 text-amber-500" : "opacity-0"
                                                )}
                                            />
                                            <span className="flex-1">{opt.label}</span>
                                            {opt.icon && (
                                                <opt.icon className="w-3 h-3 text-zinc-400 shrink-0 ml-auto" />
                                            )}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            ))}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
