'use client';

import { useState } from 'react';
import { Camera, Lightbulb, Palette, Sparkles, Image as ImageIcon, Copy, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useSettingsStore } from '@/store/useSettingsStore';
import { usePromptStore } from '@/store/usePromptStore';
import { CAMERA_BODIES, CAMERA_BODIES_BY_BRAND, getCameraById } from '@/config/mappings/cameras';
import { LENSES, getLensesByBodyId, getLensesByMount, getLensById } from '@/config/mappings/lenses';
import { LIGHTING_PATTERNS, TIME_OF_DAY_PRESETS, LIGHT_QUALITIES } from '@/config/mappings/lighting-patterns';
import { PromptBuilderV2 } from '@/lib/prompt-builder/PromptBuilderV2';
import { NanoBananaProExporter } from '@/lib/exporters/NanoBananaProExporter';

// 브랜드 목록 추출
const CAMERA_BRANDS = Object.keys(CAMERA_BODIES_BY_BRAND).sort();

export default function Home() {
  const { settings, updateCamera, updateLighting, updateQuality, updateUserInput } = useSettingsStore();
  const { ir, setIR, isGenerating, setIsGenerating } = usePromptStore();
  const [generatedPrompt, setGeneratedPrompt] = useState<{ positive: string; negative: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');

  // 브랜드 필터링된 카메라 목록
  const filteredCameras = selectedBrand === 'all'
    ? CAMERA_BODIES
    : CAMERA_BODIES_BY_BRAND[selectedBrand] || [];

  // 현재 선택된 카메라/렌즈의 스펙 가져오기
  const selectedCamera = getCameraById(settings.camera.bodyId);
  const selectedLens = getLensById(settings.camera.lensId);

  // 호환 가능한 렌즈 필터링 (마운트 기반)
  const compatibleLenses = selectedCamera
    ? getLensesByMount(selectedCamera.mount)
    : LENSES;

  // 스펙 기반 stops 배열
  const apertureStops = selectedLens?.apertureSpec.stops ?? ['f/2.8'];
  const isoStops = selectedCamera?.isoSpec.stops ?? [100];
  const shutterStops = selectedCamera?.shutterSpeedSpec.stops ?? ['1/200'];

  // 브랜드 변경 핸들러 - 첫 번째 카메라/렌즈 자동 선택 및 기본값 적용
  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);

    // "All" 선택 시에는 자동 선택 안함
    if (brand === 'all') return;

    // 해당 브랜드의 첫 번째 카메라 가져오기
    const brandCameras = CAMERA_BODIES_BY_BRAND[brand];
    if (!brandCameras || brandCameras.length === 0) return;

    const firstCamera = brandCameras[0];

    // 해당 카메라와 호환되는 렌즈 중 첫 번째 렌즈 가져오기 (마운트 기반)
    const compatibleLensesForCamera = getLensesByMount(firstCamera.mount);
    const firstLens = compatibleLensesForCamera.length > 0
      ? compatibleLensesForCamera[0]
      : LENSES[0]; // 호환 렌즈가 없으면 전체 렌즈 중 첫 번째

    // 카메라 설정 업데이트 (바디, 렌즈, 기본값들)
    updateCamera({
      bodyId: firstCamera.id,
      lensId: firstLens.id,
      aperture: firstLens.apertureSpec.defaultValue,
      iso: firstCamera.isoSpec.defaultValue,
      shutterSpeed: firstCamera.shutterSpeedSpec.defaultValue
    });
  };

  // 프롬프트 생성
  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const builder = new PromptBuilderV2(settings);
      const newIR = await builder.buildIR();
      setIR(newIR);

      const exporter = new NanoBananaProExporter(newIR);
      const result = exporter.export();
      setGeneratedPrompt(result);
    } catch (error) {
      console.error('Prompt generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // 클립보드 복사
  const handleCopy = async () => {
    if (!generatedPrompt) return;
    await navigator.clipboard.writeText(generatedPrompt.positive);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            v0.1.0 PoC
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 설정 패널 (왼쪽 2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="camera" className="w-full">
              <TabsList className="w-full grid grid-cols-4 bg-zinc-900/50 border border-zinc-800/50">
                <TabsTrigger value="camera" className="data-[state=active]:bg-zinc-800 gap-2">
                  <Camera className="w-4 h-4" /> 카메라
                </TabsTrigger>
                <TabsTrigger value="lighting" className="data-[state=active]:bg-zinc-800 gap-2">
                  <Lightbulb className="w-4 h-4" /> 조명
                </TabsTrigger>
                <TabsTrigger value="style" className="data-[state=active]:bg-zinc-800 gap-2">
                  <Palette className="w-4 h-4" /> 스타일
                </TabsTrigger>
                <TabsTrigger value="subject" className="data-[state=active]:bg-zinc-800 gap-2">
                  <ImageIcon className="w-4 h-4" /> 피사체
                </TabsTrigger>
              </TabsList>

              {/* 카메라 탭 */}
              <TabsContent value="camera" className="mt-6">
                <Card className="bg-zinc-900/50 border-zinc-800/50">
                  <CardHeader>
                    <CardTitle className="text-lg">카메라 & 광학</CardTitle>
                    <CardDescription>카메라 바디와 렌즈를 선택하세요</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* 브랜드 필터 */}
                    <div className="space-y-2">
                      <Label>브랜드</Label>
                      <Select
                        value={selectedBrand}
                        onValueChange={handleBrandChange}
                      >
                        <SelectTrigger className="bg-zinc-950 border-zinc-800">
                          <SelectValue placeholder="브랜드 선택" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                          <SelectItem value="all">
                            <span className="text-amber-400">All Brands</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {CAMERA_BODIES.length}
                            </Badge>
                          </SelectItem>
                          {CAMERA_BRANDS.map((brand) => (
                            <SelectItem key={brand} value={brand}>
                              <div className="flex items-center gap-2">
                                <span>{brand}</span>
                                <Badge variant="outline" className="text-xs">
                                  {CAMERA_BODIES_BY_BRAND[brand].length}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 카메라 바디 */}
                    <div className="space-y-2">
                      <Label>카메라 바디</Label>
                      <Select
                        value={settings.camera.bodyId}
                        onValueChange={(value) => updateCamera({ bodyId: value })}
                      >
                        <SelectTrigger className="bg-zinc-950 border-zinc-800">
                          <SelectValue placeholder="카메라 선택" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                          {filteredCameras.map((camera) => (
                            <SelectItem key={camera.id} value={camera.id}>
                              <div className="flex items-center gap-2">
                                <span className="text-zinc-400">{camera.brand}</span>
                                <span>{camera.model}</span>
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {camera.megapixel}MP
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 렌즈 */}
                    <div className="space-y-2">
                      <Label>렌즈</Label>
                      <Select
                        value={settings.camera.lensId}
                        onValueChange={(value) => updateCamera({ lensId: value })}
                      >
                        <SelectTrigger className="bg-zinc-950 border-zinc-800">
                          <SelectValue placeholder="렌즈 선택" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                          {compatibleLenses.map((lens) => (
                            <SelectItem key={lens.id} value={lens.id}>
                              <div className="flex items-center gap-2">
                                <span>{lens.model}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {lens.maxAperture}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator className="bg-zinc-800" />

                    {/* 조리개 (스냅 슬라이더) */}
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Label>조리개</Label>
                        <span className="text-sm text-amber-400 font-mono">{settings.camera.aperture}</span>
                      </div>
                      <Slider
                        value={[Math.max(0, apertureStops.indexOf(settings.camera.aperture))]}
                        min={0}
                        max={apertureStops.length - 1}
                        step={1}
                        onValueChange={([idx]) => updateCamera({ aperture: apertureStops[idx] })}
                        className="py-2"
                      />
                      <div className="flex justify-between text-xs text-zinc-500">
                        <span>{apertureStops[0]} (얕은 DOF)</span>
                        <span>{apertureStops[apertureStops.length - 1]} (깊은 DOF)</span>
                      </div>
                    </div>

                    {/* ISO (스냅 슬라이더) */}
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Label>ISO</Label>
                        <span className="text-sm text-amber-400 font-mono">{settings.camera.iso}</span>
                      </div>
                      <Slider
                        value={[Math.max(0, isoStops.indexOf(settings.camera.iso))]}
                        min={0}
                        max={isoStops.length - 1}
                        step={1}
                        onValueChange={([idx]) => updateCamera({ iso: isoStops[idx] })}
                        className="py-2"
                      />
                      <div className="flex justify-between text-xs text-zinc-500">
                        <span>{isoStops[0]} (저노이즈)</span>
                        <span>{isoStops[isoStops.length - 1]} (고감도)</span>
                      </div>
                    </div>

                    {/* 셔터 스피드 (스냅 슬라이더) */}
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Label>셔터 스피드</Label>
                        <span className="text-sm text-amber-400 font-mono">{settings.camera.shutterSpeed}</span>
                      </div>
                      <Slider
                        value={[Math.max(0, shutterStops.indexOf(settings.camera.shutterSpeed))]}
                        min={0}
                        max={shutterStops.length - 1}
                        step={1}
                        onValueChange={([idx]) => updateCamera({ shutterSpeed: shutterStops[idx] })}
                        className="py-2"
                      />
                      <div className="flex justify-between text-xs text-zinc-500">
                        <span>{shutterStops[0]}s (모션블러)</span>
                        <span>{shutterStops[shutterStops.length - 1]} (동결)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 조명 탭 */}
              <TabsContent value="lighting" className="mt-6">
                <Card className="bg-zinc-900/50 border-zinc-800/50">
                  <CardHeader>
                    <CardTitle className="text-lg">조명 설정</CardTitle>
                    <CardDescription>조명 패턴과 분위기를 설정하세요</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* 조명 패턴 */}
                    <div className="space-y-2">
                      <Label>조명 패턴</Label>
                      <Select
                        value={settings.lighting.patternId}
                        onValueChange={(value) => updateLighting({ patternId: value })}
                      >
                        <SelectTrigger className="bg-zinc-950 border-zinc-800">
                          <SelectValue placeholder="패턴 선택" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                          {LIGHTING_PATTERNS.map((pattern) => (
                            <SelectItem key={pattern.id} value={pattern.id}>
                              <div>
                                <div>{pattern.name}</div>
                                <div className="text-xs text-zinc-500">{pattern.description.slice(0, 50)}...</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 광질 */}
                    <div className="space-y-2">
                      <Label>광질</Label>
                      <Select
                        value={settings.lighting.quality}
                        onValueChange={(value: 'hard' | 'soft') => updateLighting({ quality: value })}
                      >
                        <SelectTrigger className="bg-zinc-950 border-zinc-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                          {LIGHT_QUALITIES.map((quality) => (
                            <SelectItem key={quality.id} value={quality.id}>
                              <div>
                                <div>{quality.name}</div>
                                <div className="text-xs text-zinc-500">{quality.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 시간대 */}
                    <div className="space-y-2">
                      <Label>시간대 / 색온도</Label>
                      <Select
                        value={settings.lighting.timeOfDay}
                        onValueChange={(value) => updateLighting({ timeOfDay: value })}
                      >
                        <SelectTrigger className="bg-zinc-950 border-zinc-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                          {TIME_OF_DAY_PRESETS.map((time) => (
                            <SelectItem key={time.id} value={time.id}>
                              <div className="flex items-center gap-2">
                                <span>{time.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {time.colorTemp}K
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 스타일 탭 */}
              <TabsContent value="style" className="mt-6">
                <Card className="bg-zinc-900/50 border-zinc-800/50">
                  <CardHeader>
                    <CardTitle className="text-lg">스타일 & 품질</CardTitle>
                    <CardDescription>품질 레벨과 스타일을 선택하세요</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>품질 레벨</Label>
                      <Select
                        value={settings.quality.level}
                        onValueChange={(value: 'standard' | 'high' | 'premium') => updateQuality({ level: value })}
                      >
                        <SelectTrigger className="bg-zinc-950 border-zinc-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                          <SelectItem value="standard">Standard - 기본 품질</SelectItem>
                          <SelectItem value="high">High - 고품질</SelectItem>
                          <SelectItem value="premium">Premium - 최고 품질</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 피사체 탭 */}
              <TabsContent value="subject" className="mt-6">
                <Card className="bg-zinc-900/50 border-zinc-800/50">
                  <CardHeader>
                    <CardTitle className="text-lg">피사체 & 분위기</CardTitle>
                    <CardDescription>촬영하고자 하는 대상과 분위기를 설명하세요</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>피사체 설명</Label>
                      <Textarea
                        placeholder="예: 30대 여성의 자연스러운 클로즈업 인물 사진, 약간 미소짓는 표정"
                        value={settings.userInput.subjectDescription}
                        onChange={(e) => updateUserInput({ subjectDescription: e.target.value })}
                        className="min-h-[100px] bg-zinc-950 border-zinc-800 resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>분위기 / 무드</Label>
                      <Textarea
                        placeholder="예: 따뜻하고 자연스러운 분위기, 부드러운 햇살"
                        value={settings.userInput.moodDescription}
                        onChange={(e) => updateUserInput({ moodDescription: e.target.value })}
                        className="min-h-[80px] bg-zinc-950 border-zinc-800 resize-none"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* 프롬프트 미리보기 (오른쪽 1/3) */}
          <div className="space-y-6">
            <Card className="bg-zinc-900/50 border-zinc-800/50 sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>프롬프트 미리보기</span>
                  {ir?.metadata.conflicts.length ? (
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {ir.metadata.conflicts.length}
                    </Badge>
                  ) : null}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 생성 버튼 */}
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !settings.userInput.subjectDescription.trim()}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                >
                  {isGenerating ? '생성 중...' : '프롬프트 생성'}
                </Button>

                {/* 충돌 경고 */}
                {ir?.metadata.conflicts.length ? (
                  <Alert variant="destructive" className="bg-red-950/30 border-red-900/50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>충돌 감지</AlertTitle>
                    <AlertDescription>
                      {ir.metadata.conflicts[0].message}
                    </AlertDescription>
                  </Alert>
                ) : null}

                {/* 생성된 프롬프트 */}
                {generatedPrompt && (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-zinc-400">Positive Prompt</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopy}
                          className="h-8 gap-1"
                        >
                          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          {copied ? '복사됨' : '복사'}
                        </Button>
                      </div>
                      <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 text-sm text-zinc-300 font-mono leading-relaxed max-h-[300px] overflow-y-auto">
                        {generatedPrompt.positive}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-zinc-400">Negative Prompt</Label>
                      <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 text-sm text-red-400/80 font-mono leading-relaxed max-h-[150px] overflow-y-auto">
                        {generatedPrompt.negative || '(없음)'}
                      </div>
                    </div>
                  </>
                )}

                {/* Placeholder */}
                {!generatedPrompt && (
                  <div className="p-8 border border-dashed border-zinc-800 rounded-lg text-center text-zinc-500">
                    <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">피사체를 입력하고<br />프롬프트를 생성하세요</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
