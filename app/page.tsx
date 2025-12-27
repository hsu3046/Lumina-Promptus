'use client';

import { Camera, Lightbulb, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSettingsStore } from '@/store/useSettingsStore';
import { CharacteristicTypeSelector, PromptPreview } from '@/components/settings';
import { CameraTab, LightingTab, SubjectTab } from '@/components/settings/tabs';

export default function Home() {
  const { settings, updateCamera, updateLighting } = useSettingsStore();

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
        exposure: 'normal',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-50">
      {/* Header */}
      <header className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Lumina Promptus</h1>
              <p className="text-xs text-zinc-500">디지털 암실 - 광학 시뮬레이터</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border-amber-500/20">
            v0.2.0 Refactored
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* 설정 패널 (왼쪽 2/3) */}
          <div className="col-span-2 space-y-6">
            {/* 렌즈 특성 타입 선택 */}
            <CharacteristicTypeSelector onTypeChange={handleCharacteristicTypeChange} />

            {/* 메인 탭 */}
            <Tabs defaultValue="style" className="w-full">
              <TabsList className="w-full grid grid-cols-3 bg-zinc-900/50 border border-zinc-800/50">
                <TabsTrigger value="style" className="data-[state=active]:bg-zinc-800 gap-2">
                  <ImageIcon className="w-4 h-4" /> 피사체
                </TabsTrigger>
                <TabsTrigger value="lighting" className="data-[state=active]:bg-zinc-800 gap-2">
                  <Lightbulb className="w-4 h-4" /> 라이팅
                </TabsTrigger>
                <TabsTrigger value="camera" className="data-[state=active]:bg-zinc-800 gap-2">
                  <Camera className="w-4 h-4" /> 카메라
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
          </div>

          {/* 프롬프트 미리보기 (오른쪽 1/3) */}
          <PromptPreview />
        </div>
      </main>
    </div>
  );
}
