'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PresetOption {
    id: string;
    label: string;
    keywords: string[];
    description?: string; // 대략적인 검색을 위한 설명
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
    const [query, setQuery] = React.useState('');
    const [isOpen, setIsOpen] = React.useState(false);
    const [highlightedIndex, setHighlightedIndex] = React.useState(0);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // 선택된 프리셋의 라벨 표시
    const selectedLabel = React.useMemo(() => {
        const selected = options.find(o => o.id === value);
        return selected?.label || '';
    }, [options, value]);

    // 검색 필터링 - label, keywords, description 모두에서 부분 매칭
    const filteredOptions = React.useMemo(() => {
        if (!query.trim()) return [];

        const searchLower = query.toLowerCase().trim();
        return options.filter(opt => {
            // label에서 부분 매칭
            if (opt.label.toLowerCase().includes(searchLower)) return true;
            // keywords에서 부분 매칭
            if (opt.keywords.some(k => k.toLowerCase().includes(searchLower))) return true;
            // description에서 부분 매칭
            if (opt.description?.toLowerCase().includes(searchLower)) return true;
            return false;
        });
    }, [options, query]);

    // 외부 클릭 시 닫기
    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 키보드 네비게이션
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex(prev =>
                prev < filteredOptions.length - 1 ? prev + 1 : 0
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex(prev =>
                prev > 0 ? prev - 1 : filteredOptions.length - 1
            );
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredOptions.length > 0 && highlightedIndex < filteredOptions.length) {
                const selected = filteredOptions[highlightedIndex];
                onChange(selected);
                setQuery(selected.label);
                setIsOpen(false);
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    const handleSelect = (option: T) => {
        onChange(option);
        setQuery(option.label);
        setIsOpen(false);
    };

    const handleClear = () => {
        setQuery('');
        inputRef.current?.focus();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setIsOpen(true);
        setHighlightedIndex(0);
    };

    return (
        <div ref={containerRef} className="relative space-y-1">
            <span className="text-[10px] text-zinc-500">{label}</span>

            <div className="relative flex items-center">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query && setIsOpen(true)}
                    placeholder={selectedLabel || placeholder}
                    className="w-full h-8 pl-2 pr-14 text-xs bg-zinc-950 border border-zinc-800 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500/50 placeholder:text-zinc-600"
                />

                {/* 검색/클리어 아이콘 */}
                <div className="absolute right-1 flex items-center gap-0.5">
                    {query && (
                        <button
                            onClick={handleClear}
                            className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    )}
                    <button
                        onClick={() => inputRef.current?.focus()}
                        className="p-1 text-zinc-500 hover:text-amber-400 transition-colors"
                    >
                        <Search className="h-3 w-3" />
                    </button>
                </div>
            </div>

            {/* 검색 결과 드롭다운 */}
            {isOpen && filteredOptions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-zinc-800 rounded-md max-h-48 overflow-y-auto z-50 shadow-lg">
                    {filteredOptions.map((option, index) => (
                        <button
                            key={option.id}
                            onClick={() => handleSelect(option)}
                            className={cn(
                                'w-full text-left px-2 py-1.5 text-xs transition-colors',
                                index === highlightedIndex
                                    ? 'bg-amber-500/20 text-amber-300'
                                    : 'hover:bg-zinc-800 text-zinc-300'
                            )}
                        >
                            <div className="font-medium">{option.label}</div>
                            {option.description && (
                                <div className="text-[10px] text-zinc-500 truncate">{option.description}</div>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* 검색 결과 없음 */}
            {isOpen && query && filteredOptions.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-zinc-800 rounded-md p-2 z-50">
                    <div className="text-xs text-zinc-500 text-center">결과 없음</div>
                </div>
            )}
        </div>
    );
}
