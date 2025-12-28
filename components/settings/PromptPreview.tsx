'use client';

import { useState } from 'react';
import { Copy, Check, Sparkles, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useSettingsStore } from '@/store/useSettingsStore';
import { PromptBuilderV2 } from '@/lib/prompt-builder/PromptBuilderV2';
import { NanoBananaProExporter } from '@/lib/exporters/NanoBananaProExporter';
import type { PromptIR } from '@/types';

type AITarget = 'default' | 'nanobanana' | 'chatgpt' | 'midjourney';

const AI_TARGET_OPTIONS: { value: AITarget; label: string; desc: string }[] = [
    { value: 'default', label: '기본', desc: 'AI 수정 없음' },
    { value: 'nanobanana', label: '나노 바나나', desc: '차후 구현' },
    { value: 'chatgpt', label: '챗GPT', desc: '차후 구현' },
    { value: 'midjourney', label: '미드저니', desc: '차후 구현' },
];

export function PromptPreview() {
    const { settings } = useSettingsStore();
    const [isGenerating, setIsGenerating] = useState(false);
    const [isRefining, setIsRefining] = useState(false);
    const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
    const [ir, setIR] = useState<PromptIR | null>(null);
    const [copied, setCopied] = useState(false);
    const [aiTarget, setAiTarget] = useState<AITarget>('default');

    const handleGenerate = async () => {
        setIsGenerating(true);
        setIsRefining(false);

        try {
            // Step 1: Draft 생성
            const builder = new PromptBuilderV2(settings);
            const newIR = await builder.buildIR();
            setIR(newIR);

            const exporter = new NanoBananaProExporter(newIR);
            const draftResult = exporter.export();

            // Step 2: AI 타겟에 따라 처리 (현재는 기본만 구현)
            if (aiTarget !== 'default') {
                setIsRefining(true);
                try {
                    const response = await fetch('/api/refine-prompt', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ draftPrompt: draftResult, target: aiTarget }),
                    });

                    if (response.ok) {
                        const { refinedPrompt } = await response.json();
                        setGeneratedPrompt(refinedPrompt);
                    } else {
                        setGeneratedPrompt(draftResult);
                    }
                } catch {
                    console.warn('Refinement failed, using draft');
                    setGeneratedPrompt(draftResult);
                }
            } else {
                // 기본 모드: Draft 바로 사용
                setGeneratedPrompt(draftResult);
            }
        } catch (error) {
            console.error('Prompt generation failed:', error);
        } finally {
            setIsGenerating(false);
            setIsRefining(false);
        }
    };

    const handleCopy = async () => {
        if (!generatedPrompt) return;
        await navigator.clipboard.writeText(generatedPrompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isStudioMode = settings.artDirection.lensCharacteristicType === 'studio';
    const canGenerate = isStudioMode || settings.userInput.subjectDescription?.trim();

    const buttonText = isRefining ? 'AI Refining...' : isGenerating ? '생성 중...' : '프롬프트 생성';

    return (
        <div className="space-y-6">
            <Card className="bg-zinc-900/50 border-zinc-800/50 sticky top-24">
                <CardContent className="pt-4 space-y-4">
                    {/* 생성 버튼 */}
                    <Button
                        onClick={handleGenerate}
                        disabled={isGenerating || !canGenerate}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                    >
                        {(isGenerating || isRefining) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {buttonText}
                    </Button>

                    {/* AI 타겟 선택 Radio Group */}
                    <div className="space-y-2">
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
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-zinc-500">{generatedPrompt.length}자</span>
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
                            <ScrollArea className="h-[400px] rounded-lg border border-zinc-800 bg-zinc-950">
                                <div className="p-4 text-sm text-zinc-300 font-mono leading-relaxed">
                                    {generatedPrompt}
                                </div>
                            </ScrollArea>
                        </div>
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
    );
}
