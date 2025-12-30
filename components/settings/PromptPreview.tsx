'use client';

import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useSettingsStore } from '@/store/useSettingsStore';
import { PromptBuilderV2 } from '@/lib/prompt-builder/PromptBuilderV2';
import { NanoBananaProExporter } from '@/lib/exporters/NanoBananaProExporter';
import { ChatGPTExporter } from '@/lib/exporters/ChatGPTExporter';
import { MidjourneyExporter } from '@/lib/exporters/MidjourneyExporter';
import { LightingValidator } from '@/lib/lighting-validator';
import { generate14ReferenceImages } from '@/lib/landscape/reference-image-generator';
import { buildLandscapePromptConfig, generateLandscapePrompt, generateSimpleLandscapePrompt } from '@/lib/landscape/prompt-generator';
import type { LightingConfig, LightingPattern, LightingKey, LightingRatio, LightQuality, ColorTemperature, LightingMood, SpecialLighting } from '@/types/lighting.types';

type AITarget = 'nanobanana' | 'chatgpt' | 'midjourney';

const AI_TARGET_OPTIONS: { value: AITarget; label: string; desc: string }[] = [
    { value: 'nanobanana', label: '나노 바나나', desc: 'Nano Banana Pro 최적화' },
    { value: 'chatgpt', label: '챗GPT', desc: 'ChatGPT/DALL-E 최적화' },
    { value: 'midjourney', label: '미드저니', desc: 'Midjourney 파라미터 포함' },
];

export function PromptPreview() {
    const { settings } = useSettingsStore();
    const [copied, setCopied] = useState(false);
    const [aiTarget, setAiTarget] = useState<AITarget>('nanobanana');
    const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
    const [hasConflict, setHasConflict] = useState(false);

    // 실시간 프롬프트 생성 - settings 또는 aiTarget 변경 시 자동 실행
    useEffect(() => {
        const generatePrompt = async () => {
            try {
                // 풍경 모드인 경우 별도 처리
                if (settings.artDirection.lensCharacteristicType === 'landscape') {
                    const landscape = settings.landscape;
                    const location: [number, number] = [
                        landscape.location.coordinates.lat,
                        landscape.location.coordinates.lng,
                    ];

                    // 참조 이미지 URL 생성
                    const referenceImages = generate14ReferenceImages(
                        location,
                        landscape.camera.heading,
                        landscape.camera.pitch
                    );

                    // 프롬프트 설정 빌드
                    const config = buildLandscapePromptConfig(landscape, referenceImages);

                    // AI 타겟에 따른 프롬프트 생성
                    let result: string;
                    if (aiTarget === 'midjourney') {
                        // Midjourney: 간결한 키워드 형식
                        result = generateSimpleLandscapePrompt(config) + ' --ar 16:9 --style raw --s 0';
                    } else {
                        // ChatGPT/NanoBanana: 상세 프롬프트
                        result = generateLandscapePrompt(config);
                    }

                    setHasConflict(false);
                    setGeneratedPrompt(result);
                    return;
                }

                // 스튜디오 모드 기존 로직
                // Step 1: IR 생성
                const builder = new PromptBuilderV2(settings);
                const newIR = await builder.buildIR();

                // Step 2: 충돌 체크 (라이팅 + IR)
                let conflictDetected = false;

                // IR 충돌
                if (newIR.metadata.conflicts && newIR.metadata.conflicts.length > 0) {
                    conflictDetected = true;
                }

                // 라이팅 충돌
                if (settings.lighting.enabled) {
                    const lightingConfig: LightingConfig = {
                        pattern: settings.lighting.pattern as LightingPattern,
                        key: settings.lighting.key as LightingKey,
                        ratio: settings.lighting.ratio as LightingRatio | undefined,
                        quality: settings.lighting.quality as LightQuality | undefined,
                        colorTemp: settings.lighting.colorTemp as ColorTemperature | undefined,
                        mood: settings.lighting.mood as LightingMood | undefined,
                        special: settings.lighting.special as SpecialLighting[] | undefined,
                    };
                    const validation = LightingValidator.validate(lightingConfig);
                    if (validation.errors.length > 0 || validation.warnings.length > 0) {
                        conflictDetected = true;
                    }
                }

                setHasConflict(conflictDetected);

                // Step 3: 선택된 모델에 따라 Exporter 호출
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

                setGeneratedPrompt(result);
            } catch (error) {
                console.error('Prompt generation failed:', error);
            }
        };

        generatePrompt();
    }, [settings, aiTarget]);

    const handleCopy = async () => {
        if (!generatedPrompt) return;
        await navigator.clipboard.writeText(generatedPrompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div>
            <Card className="bg-zinc-900/50 border-zinc-800/50 py-0 gap-0 overflow-hidden">
                {/* 프롬프트 타이틀 */}
                <div className="bg-amber-500 px-4 py-2 flex items-center justify-center relative">
                    <h2 className="text-white text-sm font-semibold text-center">프롬프트</h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                        className="h-6 gap-1 text-white hover:bg-amber-600 absolute right-2 text-xs px-2"
                        disabled={!generatedPrompt}
                    >
                        {copied ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                        {copied ? '복사됨' : '복사'}
                    </Button>
                </div>

                <CardContent className="pt-4 space-y-3">
                    {/* AI 타겟 선택 Radio Group (항상 표시) */}
                    <div className="space-y-2">
                        <RadioGroup
                            value={aiTarget}
                            onValueChange={(value) => setAiTarget(value as AITarget)}
                            className="flex justify-center gap-6"
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

                    {/* 프롬프트 전체 표시 (접기 기능 제거) */}
                    <div className="space-y-2">
                        <span className="text-xs text-zinc-500">{generatedPrompt.length}자</span>
                        <ScrollArea className="h-[350px] rounded-lg border border-zinc-800 bg-zinc-950">
                            <div className="p-4 text-sm text-zinc-300 font-mono leading-relaxed whitespace-pre-wrap">
                                {generatedPrompt || <span className="text-zinc-600">설정을 변경하면 프롬프트가 자동으로 생성됩니다...</span>}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* 충돌 경고 */}
                    {hasConflict && (
                        <p className="text-xs text-red-400 text-center">
                            ⚠️ 서로 모순되는 설정이 있어서 이미지 생성 시 AI가 제대로 표현하지 못할 가능성이 있습니다.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

