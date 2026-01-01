'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick01Icon, Search01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

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
    const [search, setSearch] = React.useState('');
    const [isSearching, setIsSearching] = React.useState(false);  // 검색 중 상태 추가
    const [highlightedIndex, setHighlightedIndex] = React.useState(0);  // 키보드 네비게이션용
    const inputRef = React.useRef<HTMLInputElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // 선택된 프리셋의 라벨
    const selectedLabel = React.useMemo(() => {
        const selected = options.find(o => o.id === value);
        return selected?.label || '';
    }, [options, value]);

    // 검색 필터 (label만 검색) - 검색어 입력 시에만 표시
    const filteredOptions = React.useMemo(() => {
        if (!isSearching || !search.trim()) return [];  // 검색 중이 아니거나 검색어 없으면 표시 안함
        const searchLower = search.toLowerCase();
        return options.filter(o =>
            o.label.toLowerCase().includes(searchLower)
        ).slice(0, 8);  // 최대 8개만 표시
    }, [options, search, isSearching]);

    // 외부 클릭 감지
    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
                setIsSearching(false);  // 검색 종료
                setSearch('');  // 검색어 초기화
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option: T) => {
        onChange(option);
        setSearch('');
        setIsSearching(false);  // 검색 종료
        setOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSearch('');
        inputRef.current?.focus();
    };

    // 표시할 값: 검색 중이면 search, 아니면 selectedLabel
    const displayValue = isSearching ? search : selectedLabel;

    return (
        <div className="min-w-0" ref={containerRef}>
            <span className="text-[10px] text-zinc-500 block mb-1">{label}</span>
            <div className="relative">
                <div className="flex items-center bg-zinc-800/70 border border-zinc-800 rounded-md h-8 px-3 focus-within:border-zinc-700">
                    <HugeiconsIcon icon={Search01Icon} size={12} className="text-zinc-500 shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        className="flex-1 min-w-0 bg-transparent text-zinc-200 placeholder:text-zinc-500 border-none outline-none px-2 text-[16px] md:text-xs"
                        placeholder={placeholder}
                        value={displayValue}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setIsSearching(true);
                            setOpen(true);  // 타이핑하면 드롭다운 열기
                            setHighlightedIndex(0);  // 입력 시 첫 번째 항목 하이라이트
                        }}
                        onFocus={() => {
                            setOpen(true);
                            // 값이 있으면 그대로 유지, 검색 모드로 진입만 함
                            if (!value) {
                                setIsSearching(true);
                            }
                            setHighlightedIndex(0);
                        }}
                        onKeyDown={(e) => {
                            // 한글 IME 조합 중이면 무시 (Enter가 조합 완료용으로 사용됨)
                            if (e.nativeEvent.isComposing) return;

                            if (e.key === 'ArrowDown') {
                                e.preventDefault();
                                setHighlightedIndex(prev =>
                                    prev < filteredOptions.length - 1 ? prev + 1 : prev
                                );
                            } else if (e.key === 'ArrowUp') {
                                e.preventDefault();
                                setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
                            } else if (e.key === 'Enter' && filteredOptions.length > 0) {
                                e.preventDefault();
                                handleSelect(filteredOptions[highlightedIndex]);
                            } else if (e.key === 'Escape') {
                                setOpen(false);
                                setIsSearching(false);
                                setSearch('');
                            }
                        }}
                    />
                    {/* X 버튼: 값 있을 때 표시, 클릭 시 초기화 + 검색 모드 */}
                    {value && !isSearching && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSearch('');
                                setIsSearching(true);
                                setOpen(true);
                                inputRef.current?.focus();
                            }}
                            className="text-zinc-500 hover:text-zinc-300 p-0.5"
                            title="검색하려면 클릭"
                        >
                            <HugeiconsIcon icon={Cancel01Icon} size={12} />
                        </button>
                    )}
                    {/* 검색 중일 때 X 버튼 - 검색어 지우기 */}
                    {isSearching && search && (
                        <button
                            onClick={handleClear}
                            className="text-zinc-400 hover:text-zinc-200 p-1 shrink-0"
                            title="검색어 지우기"
                        >
                            <HugeiconsIcon icon={Cancel01Icon} size={14} />
                        </button>
                    )}
                </div>

                {/* 후보 드롭다운 */}
                {open && filteredOptions.length > 0 && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-zinc-900 border border-zinc-800 rounded-md shadow-lg max-h-[200px] overflow-y-auto">
                        {filteredOptions.map((option, index) => (
                            <button
                                key={option.id}
                                className={cn(
                                    "w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left transition-colors",
                                    index === highlightedIndex ? "bg-zinc-700" : "hover:bg-zinc-800",
                                    value === option.id && "bg-zinc-800/50"
                                )}
                                onClick={() => handleSelect(option)}
                                onMouseEnter={() => setHighlightedIndex(index)}
                            >
                                <HugeiconsIcon
                                    icon={Tick01Icon}
                                    size={12}
                                    className={cn(
                                        "shrink-0",
                                        value === option.id ? "opacity-100 text-amber-500" : "opacity-0"
                                    )}
                                />
                                <span className="truncate">{option.label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

