'use client';

import { useState } from 'react';
import { Copy, Check, Sparkles, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSettingsStore } from '@/store/useSettingsStore';
import { PromptBuilderV2 } from '@/lib/prompt-builder/PromptBuilderV2';
import { NanoBananaProExporter } from '@/lib/exporters/NanoBananaProExporter';
import type { PromptIR } from '@/types';

interface ExportedPrompt {
    positive: string;
    negative: string;
}

export function PromptPreview() {
    const { settings } = useSettingsStore();
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedPrompt, setGeneratedPrompt] = useState<ExportedPrompt | null>(null);
    const [ir, setIR] = useState<PromptIR | null>(null);
    const [copied, setCopied] = useState(false);

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

    const handleCopy = async () => {
        if (!generatedPrompt) return;
        await navigator.clipboard.writeText(generatedPrompt.positive);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // 스튜디오 모드에서는 subjectCount가 있으므로 항상 생성 가능
    const isStudioMode = settings.artDirection.lensCharacteristicType === 'studio';
    const canGenerate = isStudioMode || settings.userInput.subjectDescription?.trim();

    return (
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
                        disabled={isGenerating || !canGenerate}
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
    );
}
