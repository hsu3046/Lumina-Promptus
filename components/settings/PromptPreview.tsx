'use client';

import { useState, useEffect, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Copy01Icon,
    CheckmarkCircle01Icon,
    SparklesIcon,
    ArrowReloadHorizontalIcon,
    Loading03Icon,
    PencilEdit01Icon,
    Image01Icon,
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useApiKeyStore, type ImageProvider } from '@/store/useApiKeyStore';
import { PromptBuilderV2 } from '@/lib/prompt/builders/StudioBuilder';
import { SnapBuilder } from '@/lib/prompt/builders/SnapBuilder';
import { NanoBananaProExporter } from '@/lib/prompt/exporters/NanoBananaExporter';
import { ChatGPTExporter } from '@/lib/prompt/exporters/ChatGPTExporter';
import { MidjourneyExporter } from '@/lib/prompt/exporters/MidjourneyExporter';
import { buildLandscapePromptConfig, generateLandscapePrompt, generateSimpleLandscapePrompt } from '@/lib/prompt/builders/LandscapeBuilder';
import { generateImage } from '@/lib/image-gen/client';
import { ApiKeyDialog } from './ApiKeyDialog';
import { ImagePreview, type ImageGenStatus } from './ImagePreview';

type AITarget = 'nanobanana' | 'chatgpt' | 'midjourney';
type PreviewTab = 'prompt' | 'generate';

const AI_TARGET_OPTIONS: { value: AITarget; label: string; desc: string }[] = [
    { value: 'nanobanana', label: '나노 바나나', desc: 'Nano Banana Pro 최적화' },
    { value: 'chatgpt', label: '챗GPT', desc: 'ChatGPT/DALL-E 최적화' },
    { value: 'midjourney', label: '미드저니', desc: 'Midjourney 파라미터 포함' },
];

// AITarget → ImageProvider 매핑
const AI_TARGET_TO_PROVIDER: Record<AITarget, ImageProvider | null> = {
    nanobanana: 'gemini',
    chatgpt: 'openai',
    midjourney: null, // API 미지원
};

// ImageProvider → AITarget 역매핑
const PROVIDER_TO_AI_TARGET: Partial<Record<ImageProvider, AITarget>> = {
    gemini: 'nanobanana',
    openai: 'chatgpt',
};

export function PromptPreview() {
    const { settings } = useSettingsStore();
    const { selectedProvider, apiKeys, getActiveApiKey } = useApiKeyStore();

    const [copied, setCopied] = useState(false);
    const [aiTarget, setAiTarget] = useState<AITarget>('nanobanana');
    const [showQR, setShowQR] = useState(false);
    const [activeTab, setActiveTab] = useState<PreviewTab>('prompt');

    // 사진 출력 탭 전환 시: 설정의 기본 provider에 맞는 aiTarget으로 변경
    useEffect(() => {
        if (activeTab === 'generate') {
            const mappedTarget = PROVIDER_TO_AI_TARGET[selectedProvider];
            if (mappedTarget) {
                setAiTarget(mappedTarget);
            }
        }
    }, [activeTab, selectedProvider]);

    // 라디오 버튼 비활성 여부 (사진 출력 탭에서만)
    const isRadioDisabled = (target: AITarget): boolean => {
        if (activeTab === 'prompt') return false;
        if (target === 'midjourney') return true; // 항상 비활성
        const provider = AI_TARGET_TO_PROVIDER[target];
        if (!provider) return true;
        return !apiKeys[provider] || apiKeys[provider]!.trim() === '';
    };

    // 이미지 생성 상태
    const [imageStatus, setImageStatus] = useState<ImageGenStatus>('idle');
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | undefined>();
    const [imageError, setImageError] = useState<string | undefined>();
    const [imageDuration, setImageDuration] = useState<number | undefined>();

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
                    if (!landscape.location.name) {
                        setLandscapePrompt('');
                        return;
                    }
                    const config = buildLandscapePromptConfig(landscape);
                    let result: string;
                    if (aiTarget === 'midjourney') {
                        result = generateSimpleLandscapePrompt(config) + ' --ar 16:9 --style raw --s 0';
                    } else {
                        result = generateLandscapePrompt(config);
                    }
                    setLandscapePrompt(result);
                    return;
                }

                // Snap(Street) 모드
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

                // 스튜디오 모드
                const builder = new PromptBuilderV2(settings);
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
                setStudioPrompt(result);
            } catch (error) {
                console.error('Prompt generation failed:', error);
            }
        };

        generatePrompt();
    }, [settings, aiTarget, settings.artDirection.lensCharacteristicType]);

    const handleCopy = async () => {
        if (!generatedPrompt) return;
        await navigator.clipboard.writeText(generatedPrompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleGenerate = useCallback(async () => {
        if (!generatedPrompt || imageStatus === 'generating') return;

        // 현재 aiTarget에 매핑된 provider 사용
        const provider = AI_TARGET_TO_PROVIDER[aiTarget];
        if (!provider) {
            setImageError('선택된 엔진은 이미지 생성을 지원하지 않습니다.');
            setImageStatus('error');
            setActiveTab('generate');
            return;
        }

        const apiKey = apiKeys[provider];
        if (!apiKey || apiKey.trim() === '') {
            setImageError('API Key가 설정되지 않았습니다.\n⚙️ 버튼에서 설정해주세요.');
            setImageStatus('error');
            setActiveTab('generate');
            return;
        }

        setImageStatus('generating');
        setGeneratedImageUrl(undefined);
        setImageError(undefined);
        setActiveTab('generate');

        const result = await generateImage(provider, generatedPrompt, apiKey, {
            aspectRatio: settings.camera.aspectRatio,
        });

        if (result.success && result.imageUrl) {
            setGeneratedImageUrl(result.imageUrl);
            setImageDuration(result.durationMs);
            setImageStatus('done');
        } else {
            setImageError(result.error);
            setImageDuration(result.durationMs);
            setImageStatus('error');
        }
    }, [generatedPrompt, imageStatus, aiTarget, apiKeys]);

    // 헤더 우측 버튼 렌더링
    const renderHeaderRightButton = () => {
        if (activeTab === 'prompt') {
            // 프롬프트 탭 → 복사 버튼
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-6 gap-1 text-white hover:bg-amber-600 text-xs px-2"
                    disabled={!generatedPrompt}
                >
                    {copied
                        ? <HugeiconsIcon icon={CheckmarkCircle01Icon} size={10} />
                        : <HugeiconsIcon icon={Copy01Icon} size={10} />}
                    {copied ? '복사됨' : '복사'}
                </Button>
            );
        }

        // 생성 탭 → 상태별 버튼
        if (imageStatus === 'generating') {
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 gap-1 text-white/60 text-xs px-2"
                    disabled
                >
                    <HugeiconsIcon icon={Loading03Icon} size={10} className="animate-spin" />
                    생성 중...
                </Button>
            );
        }

        if (imageStatus === 'done') {
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleGenerate}
                    className="h-6 gap-1 text-white hover:bg-amber-600 text-xs px-2"
                >
                    <HugeiconsIcon icon={ArrowReloadHorizontalIcon} size={10} />
                    재생성
                </Button>
            );
        }

        // idle or error → 생성 버튼
        return (
            <Button
                variant="ghost"
                size="sm"
                onClick={handleGenerate}
                className="h-6 gap-1 text-white hover:bg-amber-600 text-xs px-2"
                disabled={!generatedPrompt}
            >
                <HugeiconsIcon icon={SparklesIcon} size={10} />
                생성
            </Button>
        );
    };

    return (
        <div>
            <Card className="bg-zinc-900/50 border-zinc-800/50 py-0 gap-0 overflow-hidden">
                {/* 프롬프트 타이틀 헤더 */}
                <div className="bg-amber-500 px-4 py-2 flex items-center justify-between">
                    {/* 왼쪽: API Key 설정 */}
                    <ApiKeyDialog />

                    {/* 중앙: 타이틀 (탭에 따라 변경) */}
                    <h2 className="text-white text-sm font-semibold">
                        {activeTab === 'prompt' ? '프롬프트' : '사진 출력'}
                    </h2>

                    {/* 오른쪽: 컨텍스트 버튼 */}
                    {renderHeaderRightButton()}
                </div>

                <CardContent className="pt-4 space-y-3">
                    {/* AI 타겟 선택 Radio Group */}
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <RadioGroup
                            value={aiTarget}
                            onValueChange={(value) => {
                                const target = value as AITarget;
                                if (!isRadioDisabled(target)) {
                                    setAiTarget(target);
                                }
                            }}
                            className="flex gap-4"
                        >
                            {AI_TARGET_OPTIONS.map((option) => {
                                const disabled = isRadioDisabled(option.value);
                                return (
                                    <div key={option.value} className={`flex items-center gap-2 ${disabled ? 'opacity-40' : ''}`}>
                                        <RadioGroupItem
                                            value={option.value}
                                            id={`ai-target-${option.value}`}
                                            disabled={disabled}
                                        />
                                        <Label
                                            htmlFor={`ai-target-${option.value}`}
                                            className={`text-sm cursor-pointer ${disabled ? 'text-zinc-600 cursor-not-allowed' : 'text-zinc-300'}`}
                                        >
                                            {option.label}
                                        </Label>
                                    </div>
                                );
                            })}
                        </RadioGroup>
                    </div>

                    {/* 탭: 프롬프트 / 생성 */}
                    <div className="flex border-b border-zinc-800">
                        <button
                            onClick={() => setActiveTab('prompt')}
                            className={`flex-1 py-2 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${activeTab === 'prompt'
                                ? 'text-amber-400 border-b-2 border-amber-400'
                                : 'text-zinc-500 hover:text-zinc-400'
                                }`}
                        >
                            <HugeiconsIcon icon={PencilEdit01Icon} size={12} />
                            프롬프트
                        </button>
                        <button
                            onClick={() => setActiveTab('generate')}
                            className={`flex-1 py-2 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${activeTab === 'generate'
                                ? 'text-amber-400 border-b-2 border-amber-400'
                                : 'text-zinc-500 hover:text-zinc-400'
                                }`}
                        >
                            <HugeiconsIcon icon={Image01Icon} size={12} />
                            사진 출력
                        </button>
                    </div>

                    {/* 탭 컨텐츠 */}
                    <div>
                        {activeTab === 'prompt' ? (
                            <>
                                {/* QR/텍스트 토글 + 글자수 */}
                                <div className="flex items-center justify-between mb-2">
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
                                    <div className="h-[350px] rounded-lg border border-zinc-800 bg-zinc-950 flex items-center justify-center">
                                        {generatedPrompt ? (
                                            <div className="bg-white p-4 rounded-lg">
                                                <QRCodeSVG value={generatedPrompt} size={280} level="M" />
                                            </div>
                                        ) : (
                                            <span className="text-zinc-600">프롬프트가 없습니다</span>
                                        )}
                                    </div>
                                ) : (
                                    <ScrollArea className="h-[350px] rounded-lg border border-zinc-800 bg-zinc-950">
                                        <div className="p-4 text-sm text-zinc-300 font-mono leading-relaxed whitespace-pre-wrap">
                                            {generatedPrompt || <span className="text-zinc-600">설정을 변경하면 프롬프트가 자동으로 생성됩니다...</span>}
                                        </div>
                                    </ScrollArea>
                                )}
                            </>
                        ) : (
                            /* 생성 탭 */
                            <ImagePreview
                                status={imageStatus}
                                imageUrl={generatedImageUrl}
                                error={imageError}
                                durationMs={imageDuration}
                                onRetry={handleGenerate}
                            />
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
