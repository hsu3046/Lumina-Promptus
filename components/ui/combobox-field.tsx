'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick01Icon, UnfoldMoreIcon, AlertCircleIcon, Alert02Icon, StarIcon, Cancel01Icon } from '@hugeicons/core-free-icons';
import type { IconSvgElement } from '@hugeicons/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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

// 충돌/제한 레벨 타입 (Restriction 기반)
// - disabled: 선택 불가 + 경고 아이콘
// - none: 선택 가능 + 경고 아이콘
// - ok: 정상
// (critical/warning/recommend는 레거시 호환성 유지)
export type ConflictLevel = 'disabled' | 'none' | 'ok' | 'critical' | 'warning' | 'recommend';

// 기본 옵션 인터페이스
export interface ComboboxOption {
    value: string;
    label: string;
    color?: string;  // 색상 원 표시용
    icon?: IconSvgElement;  // 아이콘 표시용 (Huge Icons 타입)
    suffix?: string;  // 오른쪽에 표시할 텍스트 (예: "현재정보")
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
    // Clear 버튼 표시 (선택 해제 가능)
    clearable?: boolean;
    // 선택 해제 시 콜백 (콜백이 없으면 value를 '' 로 설정)
    onClear?: () => void;
}

// 충돌 아이콘 컴포넌트
function ConflictIcon({ level }: { level: ConflictLevel }) {
    if (level === 'critical' || level === 'disabled') {
        return <HugeiconsIcon icon={AlertCircleIcon} size={12} className="text-red-500 shrink-0" />;
    }
    if (level === 'warning' || level === 'none') {
        return <HugeiconsIcon icon={Alert02Icon} size={12} className="text-amber-500 shrink-0" />;
    }
    if (level === 'recommend') {
        return <HugeiconsIcon icon={StarIcon} size={12} className="text-blue-500 shrink-0" />;
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
    clearable = false,
    onClear,
}: ComboboxFieldProps) {
    const [open, setOpen] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState('');
    const [highlightedIndex, setHighlightedIndex] = React.useState(0);
    const selectedOption = options.find(opt => opt.value === value);

    // 필터링된 옵션
    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(searchValue.toLowerCase())
    );

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setSearchValue('');
        if (onClear) {
            onClear();
        } else {
            onSelect('');
        }
    };

    // 키보드 핸들러
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!open) {
            // 팝오버가 닫혀있을 때 Enter/ArrowDown으로 열기
            if (e.key === 'Enter' || e.key === 'ArrowDown') {
                e.preventDefault();
                setOpen(true);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev =>
                    Math.min(prev + 1, filteredOptions.length - 1)
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => Math.max(prev - 1, 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (filteredOptions[highlightedIndex]) {
                    const opt = filteredOptions[highlightedIndex];
                    const conflict = getConflictLevel?.(opt.value);
                    const isDisabled = conflict === 'critical' || conflict === 'disabled';
                    if (!isDisabled) {
                        onSelect(opt.value);
                        setOpen(false);
                        setSearchValue('');
                    }
                }
                break;
            case 'Escape':
                e.preventDefault();
                setOpen(false);
                setSearchValue('');
                break;
            case 'Tab':
                // Tab 키: 닫고 다음 요소로 이동 (기본 동작)
                setOpen(false);
                setSearchValue('');
                break;
        }
    };

    // 표시할 값: 선택된 항목이 있으면 라벨, 없으면 검색어
    const displayValue = selectedOption?.label || searchValue;

    // 검색어 변경 시 하이라이트 인덱스 리셋
    React.useEffect(() => {
        setHighlightedIndex(0);
    }, [searchValue]);

    return (
        <div className={cn("min-w-0", className)}>
            <Label className={cn("text-[10px] block mb-1 flex items-center gap-1", disabled ? "text-zinc-600" : "text-zinc-500")}>
                {label}
                {showLabelConflict && <ConflictIcon level={showLabelConflict} />}
            </Label>
            <Popover open={disabled ? false : open} onOpenChange={(isOpen) => {
                if (!disabled) {
                    setOpen(isOpen);
                    if (!isOpen) {
                        setSearchValue('');
                        setHighlightedIndex(0);
                    }
                }
            }}>
                <PopoverTrigger asChild>
                    <div
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "flex items-center w-full h-8 px-3 rounded-md border bg-zinc-950 border-zinc-800 text-xs",
                            disabled ? "opacity-50 cursor-not-allowed" : "cursor-text",
                            open && "ring-1 ring-amber-500"
                        )}
                    >
                        <input
                            type="text"
                            value={displayValue}
                            onChange={(e) => {
                                setSearchValue(e.target.value);
                                if (value) onSelect('');
                                if (!open) setOpen(true);
                            }}
                            onKeyDown={handleKeyDown}
                            onClick={() => setOpen(true)}
                            placeholder={placeholder}
                            disabled={disabled}
                            className="flex-1 min-w-0 bg-transparent outline-none placeholder:text-zinc-500 text-[16px] md:text-xs"
                        />
                        {/* Clear 버튼 또는 Chevron 아이콘 */}
                        {clearable && (value || searchValue) ? (
                            <span
                                onClick={handleClear}
                                className="p-0.5 rounded hover:bg-zinc-700 transition-colors cursor-pointer"
                                title="선택 해제"
                            >
                                <HugeiconsIcon icon={Cancel01Icon} size={14} className="text-zinc-400 hover:text-zinc-200" />
                            </span>
                        ) : (
                            <HugeiconsIcon icon={UnfoldMoreIcon} size={14} className="shrink-0 opacity-50" />
                        )}
                    </div>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] max-w-[calc(100vw-2rem)] p-0 bg-zinc-900 border-zinc-800 overflow-hidden"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    sideOffset={4}
                    align="start"
                >
                    <Command className="bg-transparent" shouldFilter={false}>
                        <CommandList>
                            <CommandEmpty className="py-2 text-xs text-zinc-500 text-center">
                                {emptyMessage}
                            </CommandEmpty>
                            <CommandGroup>
                                {filteredOptions.map((opt, index) => {
                                    const conflict = getConflictLevel?.(opt.value);
                                    const isDisabled = conflict === 'critical' || conflict === 'disabled';
                                    const isHighlighted = index === highlightedIndex;
                                    return (
                                        <CommandItem
                                            key={opt.value}
                                            value={opt.label}
                                            onSelect={() => {
                                                if (!isDisabled) {
                                                    onSelect(opt.value);
                                                    setOpen(false);
                                                    setSearchValue('');
                                                }
                                            }}
                                            className={cn(
                                                "text-xs",
                                                isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                                                isHighlighted && "bg-zinc-800"
                                            )}
                                            disabled={isDisabled}
                                        >
                                            <HugeiconsIcon
                                                icon={Tick01Icon}
                                                size={12}
                                                className={cn(
                                                    "mr-2",
                                                    value === opt.value ? "opacity-100 text-amber-500" : "opacity-0"
                                                )}
                                            />
                                            <span className="flex-1">{opt.label}</span>
                                            {opt.suffix && (
                                                <span className="text-[9px] text-amber-500/80 shrink-0">
                                                    📍 {opt.suffix}
                                                </span>
                                            )}
                                            {opt.color && (
                                                <span
                                                    className="w-3 h-3 rounded-full shrink-0 ml-1"
                                                    style={{ backgroundColor: opt.color }}
                                                />
                                            )}
                                            {opt.icon && (
                                                <HugeiconsIcon icon={opt.icon} size={12} className="text-zinc-400 shrink-0 ml-1" />
                                            )}
                                            {conflict && <ConflictIcon level={conflict} />}
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
    labelIcon?: IconSvgElement;  // 라벨 옆에 표시할 아이콘
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
    labelIcon,
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
            <Label className={cn("text-[10px] mb-1 flex items-center gap-1", disabled ? "text-zinc-600" : "text-zinc-500")}>
                {labelIcon && <HugeiconsIcon icon={labelIcon} size={12} />}
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
                        <span className="flex items-center gap-1">
                            {selectedOption?.icon && (
                                <HugeiconsIcon icon={selectedOption.icon} size={12} className="text-zinc-400" />
                            )}
                            <HugeiconsIcon icon={UnfoldMoreIcon} size={12} className="shrink-0 opacity-50" />
                        </span>
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
                                            <HugeiconsIcon
                                                icon={Tick01Icon}
                                                size={12}
                                                className={cn(
                                                    "mr-2",
                                                    value === opt.value ? "opacity-100 text-amber-500" : "opacity-0"
                                                )}
                                            />
                                            <span className="flex-1">{opt.label}</span>
                                            {opt.icon && (
                                                <HugeiconsIcon icon={opt.icon} size={12} className="text-zinc-400 shrink-0 ml-auto" />
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
