'use client';

import { useRef } from 'react';
import { Sparkles, HelpCircle, ChevronDown } from 'lucide-react';
import { HugeiconsIcon } from '@hugeicons/react';
import { User02Icon, Sun03Icon, Camera02Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSettingsStore } from '@/store/useSettingsStore';
import { CharacteristicTypeSelector, PromptPreview } from '@/components/settings';
import { CameraTab, LightingTab, SubjectTab, LandscapeTab } from '@/components/settings/tabs';

// 모드 정의
const MODES = [
  { value: 'studio', label: '스튜디오', icon: '📸', disabled: false },
  { value: 'landscape', label: '풍경', icon: '🏞️', disabled: false },
  { value: 'snap', label: '스냅', icon: '📷', disabled: true },
] as const;

export default function Home() {
  const { settings, updateCamera, updateLighting, updateArtDirection } = useSettingsStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 현재 모드
  const currentMode = settings.artDirection.lensCharacteristicType === 'landscape' ? 'landscape' : 'studio';
  const currentModeInfo = MODES.find(m => m.value === currentMode) || MODES[0];

  // 모드 변경 핸들러
  const handleModeChange = (mode: string) => {
    if (mode === 'landscape') {
      updateArtDirection({ lensCharacteristicType: 'landscape' });
    } else if (mode === 'studio') {
      updateArtDirection({ lensCharacteristicType: 'studio' });
      updateCamera({
        bodyId: 'nikon_d850',
        lensId: 'nikon_af_s_85mm_f14g',
        aperture: 'f/8',
        shutterSpeed: '1/125',
        shutterSpeedAuto: true,
        apertureAuto: false,
        isoAuto: false,
        iso: 100,
      });
      updateLighting({
        enabled: true,
        key: 'mid-key',
      });
    }
  };

  // 렌즈 특성 타입 변경 핸들러 - 타입별 기본 카메라 설정 적용
  const handleCharacteristicTypeChange = () => {
    const characteristicType = settings.artDirection.lensCharacteristicType;

    // 스튜디오 기본 설정
    if (characteristicType === 'studio') {
      updateCamera({
        bodyId: 'nikon_d850',
        lensId: 'nikon_af_s_85mm_f14g',
        aperture: 'f/8',
        shutterSpeed: '1/125',
        shutterSpeedAuto: true,
        apertureAuto: false,
        isoAuto: false,
        iso: 100,
      });
      updateLighting({
        enabled: true,
        key: 'mid-key',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-50">
      {/* Header */}
      <header className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="md:container md:mx-auto px-2 sm:px-4 md:px-6 py-4 flex items-center justify-between">
          {/* 로고 + 모드 드롭다운 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
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
                    <ChevronDown className="w-3 h-3" />
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 bg-zinc-900 border-zinc-800">
              {MODES.map((mode) => (
                <DropdownMenuItem
                  key={mode.value}
                  onClick={() => !mode.disabled && handleModeChange(mode.value)}
                  disabled={mode.disabled}
                  className={`${currentMode === mode.value ? 'bg-amber-500/20 text-amber-400 font-semibold' : ''} ${mode.disabled ? 'opacity-50' : 'cursor-pointer'}`}
                >
                  <span>{mode.label}</span>
                  {mode.disabled && <span className="text-[10px] text-zinc-500 ml-auto">준비중</span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 도움말 */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 text-zinc-400 hover:text-amber-400">
                <HelpCircle className="w-4 h-4" />
                <span className="hidden sm:inline">도움말</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-zinc-900 border-zinc-800">
              <DialogHeader>
                <DialogTitle className="text-amber-400">Lumina Promptus 도움말</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  프로페셔널 AI 사진 시뮬레이터 사용 가이드
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm text-zinc-300">
                <section>
                  <h3 className="font-medium text-white mb-1">📸 피사체 설정</h3>
                  <p>인원수, 배경, 구도를 선택하고 상세 옵션으로 인물 특성을 지정합니다.</p>
                </section>
                <section>
                  <h3 className="font-medium text-white mb-1">💡 라이팅 설정</h3>
                  <p>렘브란트, 버터플라이, 루프, 스플릿 중 조명 패턴을 선택합니다. 디테일 레벨이 높을수록 AI가 더 정확한 조명을 생성합니다.</p>
                </section>
                <section>
                  <h3 className="font-medium text-white mb-1">📷 카메라 설정</h3>
                  <p>카메라 바디, 렌즈, 조리개, 셔터스피드, ISO를 실제 장비처럼 설정합니다.</p>
                </section>
                <section>
                  <h3 className="font-medium text-white mb-1">✨ 프롬프트 생성</h3>
                  <p>설정을 완료한 후 &quot;프롬프트 생성&quot; 버튼을 클릭하면 AI 이미지 생성용 프롬프트가 만들어집니다.</p>
                </section>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Main Content */}
      <main className="md:container md:mx-auto px-2 sm:px-4 md:px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 설정 패널 (데스크탑: 왼쪽 2/3, 모바일: 전체) */}
          <div className="lg:col-span-2 space-y-6" ref={scrollContainerRef}>

            {/* 모드별 설정 패널 */}
            {settings.artDirection.lensCharacteristicType === 'landscape' ? (
              /* 풍경 모드 */
              <LandscapeTab />
            ) : (
              /* 스튜디오 모드 */
              <Tabs defaultValue="style" className="w-full">
                {/* Underline 스타일 탭 */}
                <TabsList className="w-full border-b border-zinc-800 p-0 h-auto">
                  <TabsTrigger
                    value="style"
                    className="flex-1 gap-2 py-1.5 border-b-2 border-transparent data-[state=active]:border-amber-500 data-[state=active]:text-amber-500 text-zinc-400 hover:text-zinc-200"
                  >
                    <HugeiconsIcon icon={User02Icon} size={16} />
                    피사체 설정
                  </TabsTrigger>
                  <TabsTrigger
                    value="lighting"
                    className="flex-1 gap-2 py-1.5 border-b-2 border-transparent data-[state=active]:border-amber-500 data-[state=active]:text-amber-500 text-zinc-400 hover:text-zinc-200"
                  >
                    <HugeiconsIcon icon={Sun03Icon} size={16} />
                    라이팅 설정
                  </TabsTrigger>
                  <TabsTrigger
                    value="camera"
                    className="flex-1 gap-2 py-1.5 border-b-2 border-transparent data-[state=active]:border-amber-500 data-[state=active]:text-amber-500 text-zinc-400 hover:text-zinc-200"
                  >
                    <HugeiconsIcon icon={Camera02Icon} size={16} />
                    카메라 설정
                  </TabsTrigger>
                </TabsList>

                {/* 피사체 탭 */}
                <TabsContent value="style" className="mt-6">
                  <SubjectTab />
                </TabsContent>

                {/* 라이팅 탭 */}
                <TabsContent value="lighting" className="mt-6">
                  <LightingTab />
                </TabsContent>

                {/* 카메라 탭 */}
                <TabsContent value="camera" className="mt-6">
                  <CameraTab />
                </TabsContent>
              </Tabs>
            )}
          </div>

          {/* 프롬프트 미리보기 (데스크탑: 오른쪽 1/3, 모바일: 하단) */}
          <div className="lg:col-span-1 order-last">
            <PromptPreview />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 bg-zinc-950/80 mt-8">
        <div className="md:container md:mx-auto px-4 py-4 text-center">
          <p className="text-xs text-zinc-500">
            © 2025 Lumina Promptus. All rights reserved.
          </p>
          <p className="text-[10px] text-zinc-600 mt-1 max-w-2xl mx-auto">
            본 서비스에서 제공하는 프롬프트는 AI 이미지 생성을 위한 참고 자료로만 제공됩니다.
            생성된 프롬프트를 사용하여 만들어진 이미지의 결과, 품질, 저작권 및 법적 문제에 대해
            본 서비스는 어떠한 책임도 지지 않습니다. 사용자는 본인의 책임 하에 프롬프트를 사용해야 합니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
