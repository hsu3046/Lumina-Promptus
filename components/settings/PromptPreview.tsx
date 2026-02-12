'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Copy01Icon, CheckmarkCircle01Icon, Share05Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useSettingsStore } from '@/store/useSettingsStore';
import { PromptBuilderV2 } from '@/lib/prompt/builders/StudioBuilder';
import { SnapBuilder } from '@/lib/prompt/builders/SnapBuilder';
import { NanoBananaProExporter } from '@/lib/prompt/exporters/NanoBananaExporter';
import { ChatGPTExporter } from '@/lib/prompt/exporters/ChatGPTExporter';
import { MidjourneyExporter } from '@/lib/prompt/exporters/MidjourneyExporter';
import { launchPrompt, type LauncherTarget } from '@/lib/prompt/launchers';
import { buildLandscapePromptConfig, generateLandscapePrompt, generateSimpleLandscapePrompt } from '@/lib/prompt/builders/LandscapeBuilder';

type AITarget = 'nanobanana' | 'chatgpt' | 'midjourney';

const AI_TARGET_OPTIONS: { value: AITarget; label: string; desc: string }[] = [
    { value: 'nanobanana', label: '나노 바나나', desc: 'Nano Banana Pro 최적화' },
    { value: 'chatgpt', label: '챗GPT', desc: 'ChatGPT/DALL-E 최적화' },
    { value: 'midjourney', label: '미드저니', desc: 'Midjourney 파라미터 포함' },
];

export function PromptPreview() {
    const { settings } = useSettingsStore();
    const [copied, setCopied] = useState(false);
    const [launching, setLaunching] = useState(false);
    const [aiTarget, setAiTarget] = useState<AITarget>('nanobanana');
    const [showQR, setShowQR] = useState(false);

    // 모드별 프롬프트 분리 저장
    const [studioPrompt, setStudioPrompt] = useState<string>('');
    const [landscapePrompt, setLandscapePrompt] = useState<string>('');
    const [snapPrompt, setSnapPrompt] = useState<string>('');


    // 현재 모드
    const currentMode = settings.artDirection.lensCharacteristicType;
    const generatedPrompt = currentMode === 'landscape'
        ? landscapePrompt
        : currentMode === 'street'
            ? snapPrompt
            : studioPrompt;

    // 실시간 프롬프트 생성 - settings 또는 aiTarget 변경 시 자동 실행
    useEffect(() => {
        const generatePrompt = async () => {
            try {
                // 풍경 모드인 경우 별도 처리
                if (settings.artDirection.lensCharacteristicType === 'landscape') {
                    const landscape = settings.landscape;

                    // 장소가 선택되지 않았으면 프롬프트 비움
                    if (!landscape.location.name) {
                        setLandscapePrompt('');
                        return;
                    }

                    // 프롬프트 설정 빌드
                    const config = buildLandscapePromptConfig(landscape);

                    // AI 타겟에 따른 프롬프트 생성
                    let result: string;
                    if (aiTarget === 'midjourney') {
                        // Midjourney: 간결한 키워드 형식
                        result = generateSimpleLandscapePrompt(config) + ' --ar 16:9 --style raw --s 0';
                    } else {
                        // ChatGPT/NanoBanana: 상세 프롬프트
                        result = generateLandscapePrompt(config);
                    }

                    setLandscapePrompt(result);
                    return;
                }

                // Snap(Street) 모드: SnapBuilder 사용
                if (settings.artDirection.lensCharacteristicType === 'street' && settings.snap) {
                    const builder = new SnapBuilder(settings);
                    const newIR = await builder.buildIR();

                    let result: string;
                    switch (aiTarget) {
                        case 'chatgpt': {
                            const exporter = new ChatGPTExporter(newIR, settings);
                            result = exporter.export();
                            break;
                        }
                        case 'midjourney': {
                            const exporter = new MidjourneyExporter(newIR, settings);
                            result = exporter.export();
                            break;
                        }
                        case 'nanobanana':
                        default: {
                            const exporter = new NanoBananaProExporter(newIR, settings);
                            result = exporter.export();
                            break;
                        }
                    }

                    setSnapPrompt(result);
                    return;
                }

                // 스튜디오 모드 기존 로직
                // Step 1: IR 생성
                const builder = new PromptBuilderV2(settings);
                const newIR = await builder.buildIR();

                // Step 2: 선택된 모델에 따라 Exporter 호출
                let result: string;

                switch (aiTarget) {
                    case 'chatgpt': {
                        const exporter = new ChatGPTExporter(newIR, settings);
                        result = exporter.export();
                        break;
                    }
                    case 'midjourney': {
                        const exporter = new MidjourneyExporter(newIR, settings);
                        result = exporter.export();
                        break;
                    }
                    case 'nanobanana':
                    default: {
                        const exporter = new NanoBananaProExporter(newIR, settings);
                        result = exporter.export();
                        break;
                    }
                }

                setStudioPrompt(result);
            } catch (error) {
                console.error('Prompt generation failed:', error);
            }
        };

        generatePrompt();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings, aiTarget, settings.artDirection.lensCharacteristicType]);

    const handleCopy = async () => {
        if (!generatedPrompt) return;
        await navigator.clipboard.writeText(generatedPrompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLaunch = async () => {
        if (!generatedPrompt || launching) return;
        setLaunching(true);
        try {
            await launchPrompt(aiTarget as LauncherTarget, generatedPrompt);
        } catch (error) {
            console.error('Launch failed:', error);
        } finally {
            setLaunching(false);
        }
    };

    return (
        <div>
            <Card className="bg-zinc-900/50 border-zinc-800/50 py-0 gap-0 overflow-hidden">
                {/* 프롬프트 타이틀 */}
                <div className="bg-amber-500 px-4 py-2 flex items-center justify-between">
                    {/* 왼쪽: 열기 버튼 */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLaunch}
                        className="h-6 gap-1 text-white hover:bg-amber-600 text-xs px-2"
                        disabled={!generatedPrompt || launching}
                    >
                        <HugeiconsIcon icon={Share05Icon} size={10} />
                        {launching ? '여는 중...' : '열기'}
                    </Button>

                    {/* 중앙: 타이틀 */}
                    <h2 className="text-white text-sm font-semibold">프롬프트</h2>

                    {/* 오른쪽: 복사 버튼 */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                        className="h-6 gap-1 text-white hover:bg-amber-600 text-xs px-2"
                        disabled={!generatedPrompt}
                    >
                        {copied ? <HugeiconsIcon icon={CheckmarkCircle01Icon} size={10} /> : <HugeiconsIcon icon={Copy01Icon} size={10} />}
                        {copied ? '복사됨' : '복사'}
                    </Button>
                </div>

                <CardContent className="pt-4 space-y-3">
                    {/* AI 타겟 선택 Radio Group */}
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <RadioGroup
                            value={aiTarget}
                            onValueChange={(value) => setAiTarget(value as AITarget)}
                            className="flex gap-4"
                        >
                            {AI_TARGET_OPTIONS.map((option) => (
                                <div key={option.value} className="flex items-center gap-2">
                                    <RadioGroupItem value={option.value} id={`ai-target-${option.value}`} />
                                    <Label htmlFor={`ai-target-${option.value}`} className="text-sm text-zinc-300 cursor-pointer">
                                        {option.label}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    {/* 프롬프트 또는 QR 코드 표시 */}
                    <div className="space-y-2">
                        {/* QR/텍스트 토글 버튼 (왼쪽) + 글자수 (오른쪽) */}
                        <div className="flex items-center justify-between">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowQR(!showQR)}
                                className="h-6 text-xs px-2 text-zinc-400 hover:text-zinc-200 border-zinc-700"
                            >
                                {showQR ? '텍스트 보기' : 'QR코드 보기'}
                            </Button>
                            <span className="text-xs text-zinc-500">{generatedPrompt.length}자</span>
                        </div>
                        {showQR ? (
                            /* QR 코드 표시 */
                            <div className="h-[350px] rounded-lg border border-zinc-800 bg-zinc-950 flex items-center justify-center">
                                {generatedPrompt ? (
                                    <div className="bg-white p-4 rounded-lg">
                                        <QRCodeSVG
                                            value={generatedPrompt}
                                            size={280}
                                            level="M"
                                        />
                                    </div>
                                ) : (
                                    <span className="text-zinc-600">프롬프트가 없습니다</span>
                                )}
                            </div>
                        ) : (
                            /* 프롬프트 텍스트 표시 */
                            <ScrollArea className="h-[350px] rounded-lg border border-zinc-800 bg-zinc-950">
                                <div className="p-4 text-sm text-zinc-300 font-mono leading-relaxed whitespace-pre-wrap">
                                    {generatedPrompt || <span className="text-zinc-600">설정을 변경하면 프롬프트가 자동으로 생성됩니다...</span>}
                                </div>
                            </ScrollArea>
                        )}
                    </div>


                </CardContent>
            </Card>
        </div>
    );
}

