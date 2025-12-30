'use client';

import { useRef, useEffect } from 'react';
import { Sparkles, ChevronDown, User, Sun, Camera } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSettingsStore } from '@/store/useSettingsStore';
import { PromptPreview } from '@/components/settings';
import { CameraTab, LightingTab, SubjectTab } from '@/components/settings/tabs';
import { HelpDialog } from '@/components/ui/help-dialog';
import { Footer } from '@/components/ui/footer';
import { useRouter } from 'next/navigation';

// 모드 정의
const MODES = [
    { value: 'studio', label: '스튜디오', href: '/studio', disabled: false },
    { value: 'landscape', label: '풍경', href: '/landscape', disabled: false },
    { value: 'snap', label: '스냅', href: '/snap', disabled: true },
] as const;

export default function StudioPage() {
    const { settings, updateCamera, updateLighting, updateArtDirection } = useSettingsStore();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // 페이지 마운트 시 lensCharacteristicType을 'studio'로 설정
    useEffect(() => {
        updateArtDirection({ lensCharacteristicType: 'studio' });
    }, [updateArtDirection]);

    const currentModeInfo = MODES.find(m => m.value === 'studio')!;

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
                                <button className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="text-left">
                                        <div className="flex items-center gap-1">
                                            <h1 className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                                                LUMINA PROMPTUS
                                            </h1>
                                        </div>
                                        <p className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                                            {currentModeInfo.label} 모드
                                            <ChevronDown className="w-3 h-3 text-amber-400" />
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
                                        className={`${mode.value === 'studio' ? 'bg-amber-500/20 text-amber-400 font-semibold' : ''} ${mode.disabled ? 'opacity-50' : 'cursor-pointer'}`}
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
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] xl:items-start gap-8">
                    {/* 왼쪽: 설정 패널 */}
                    <div ref={scrollContainerRef} className="space-y-6">
                        {/* 스튜디오 모드 탭 */}
                        <Tabs defaultValue="style" className="w-full">
                            <TabsList className="w-full border-b border-zinc-800 p-0 h-auto">
                                <TabsTrigger value="style" className="lp-tab-trigger">
                                    <User className="w-4 h-4" />
                                    피사체 설정
                                </TabsTrigger>
                                <TabsTrigger value="lighting" className="lp-tab-trigger">
                                    <Sun className="w-4 h-4" />
                                    라이팅 설정
                                </TabsTrigger>
                                <TabsTrigger value="camera" className="lp-tab-trigger">
                                    <Camera className="w-4 h-4" />
                                    카메라 설정
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="style" className="mt-6">
                                <SubjectTab />
                            </TabsContent>

                            <TabsContent value="lighting" className="mt-6">
                                <LightingTab />
                            </TabsContent>

                            <TabsContent value="camera" className="mt-6">
                                <CameraTab />
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* 오른쪽: 프롬프트 (PC에서는 사이드, 모바일에서는 아래) */}
                    <div className="xl:sticky xl:top-24 xl:self-start">
                        <PromptPreview />
                    </div>
                </div>
            </main>

            {/* 푸터 */}
            <Footer />
        </div>
    );
}
