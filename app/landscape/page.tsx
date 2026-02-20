'use client';

import { useRef, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { SparklesIcon, ArrowDown01Icon } from '@hugeicons/core-free-icons';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PromptPreview } from '@/components/settings';
import { LandscapeTab } from '@/components/settings/tabs';
import { HelpDialog } from '@/components/ui/help-dialog';
import { Footer } from '@/components/ui/footer';
import { useRouter } from 'next/navigation';
import { useSettingsStore } from '@/store/useSettingsStore';

// 모드 정의
const MODES = [
    { value: 'studio', label: '스튜디오', href: '/studio', disabled: false },
    { value: 'landscape', label: '풍경', href: '/landscape', disabled: false },
    { value: 'snap', label: '스냅', href: '/snap', disabled: false },
    { value: 'product', label: '제품', href: '/product', disabled: false },
] as const;

export default function LandscapePage() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { updateArtDirection } = useSettingsStore();

    // 페이지 마운트 시 lensCharacteristicType을 'landscape'로 설정
    useEffect(() => {
        updateArtDirection({ lensCharacteristicType: 'landscape' });
    }, [updateArtDirection]);

    const currentModeInfo = MODES.find(m => m.value === 'landscape')!;

    // 모드 변경 핸들러
    const handleModeChange = (href: string, disabled: boolean) => {
        if (!disabled) {
            router.push(href);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-900">
            {/* 헤더 */}
            <header className="sticky top-0 z-50 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        {/* 로고 + 모드 드롭다운 */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src="/logo.png" alt="Lumina Promptus" className="w-10 h-10 rounded-xl" />
                                    <div className="text-left">
                                        <div className="flex items-center gap-1">
                                            <h1 className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                                                LUMINA PROMPTUS
                                            </h1>
                                        </div>
                                        <p className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                                            {currentModeInfo.label} 모드
                                            <HugeiconsIcon icon={ArrowDown01Icon} size={12} className="text-amber-400" />
                                        </p>
                                    </div>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-48 bg-zinc-900 border-zinc-800">
                                {MODES.map((mode) => (
                                    <DropdownMenuItem
                                        key={mode.value}
                                        onClick={() => handleModeChange(mode.href, mode.disabled)}
                                        disabled={mode.disabled}
                                        className={`${mode.value === 'landscape' ? 'bg-amber-500/20 text-amber-400 font-semibold' : ''} ${mode.disabled ? 'opacity-50' : 'cursor-pointer'}`}
                                    >
                                        <span>{mode.label}</span>
                                        {mode.disabled && <span className="text-[10px] text-zinc-500 ml-auto">준비중</span>}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* 도움말 */}
                        <HelpDialog />
                    </div>
                </div>
            </header>

            {/* 메인 콘텐츠 - 반응형 2열 레이아웃 */}
            <main className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] lg:items-start gap-8">
                    {/* 왼쪽: 설정 패널 */}
                    <div ref={scrollContainerRef} className="space-y-6">
                        <LandscapeTab />
                    </div>

                    {/* 오른쪽: 프롬프트 (PC에서는 사이드, 모바일에서는 아래) */}
                    <div className="lg:sticky lg:top-24 lg:self-start">
                        <PromptPreview />
                    </div>
                </div>
            </main>

            {/* 푸터 */}
            <Footer />
        </div>
    );
}
