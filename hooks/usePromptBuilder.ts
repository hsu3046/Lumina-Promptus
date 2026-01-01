// hooks/usePromptBuilder.ts
// PromptBuilder 훅 - 설정 변경 시 자동으로 IR 생성 및 Diff 계산

'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { usePromptStore } from '@/store/usePromptStore';
import { PromptBuilderV2 } from '@/lib/prompt/builders/StudioBuilder';
import { NanoBananaProExporter } from '@/lib/prompt/exporters/NanoBananaExporter';
import { PromptDiffGenerator } from '@/lib/prompt/prompt-diff-generator';
import type { PromptIR, PromptDiff } from '@/types';

interface UsePromptBuilderReturn {
    ir: PromptIR | null;
    rendered: string | null;
    diff: PromptDiff[];
    conflicts: PromptIR['metadata']['conflicts'];
    warnings: string[];
    isGenerating: boolean;
    error: string | null;
    regenerate: () => Promise<void>;
}

export function usePromptBuilder(): UsePromptBuilderReturn {
    const { settings } = useSettingsStore();
    const {
        ir,
        previousIr,
        rendered,
        isGenerating,
        error,
        setIR,
        setRendered,
        setIsGenerating,
        setError
    } = usePromptStore();

    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // 프롬프트 빌드 함수
    const buildPrompt = useCallback(async () => {
        setIsGenerating(true);
        setError(null);

        try {
            // IR 생성
            const builder = new PromptBuilderV2(settings);
            const newIR = await builder.buildIR();
            setIR(newIR);

            // Nano Banana Pro용 프롬프트 렌더링
            const exporter = new NanoBananaProExporter(newIR);
            const exported = exporter.export();

            setRendered({
                'nano_banana_pro': exported
            });

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsGenerating(false);
        }
    }, [settings, setIR, setRendered, setIsGenerating, setError]);

    // 설정 변경 시 디바운싱된 빌드
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            buildPrompt();
        }, 300);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [settings, buildPrompt]);

    // Diff 계산
    const diff = ir ? PromptDiffGenerator.generateDiff(previousIr, ir) : [];

    return {
        ir,
        rendered: rendered?.['nano_banana_pro'] || null,
        diff,
        conflicts: ir?.metadata.conflicts || [],
        warnings: ir?.metadata.warnings || [],
        isGenerating,
        error,
        regenerate: buildPrompt
    };
}
