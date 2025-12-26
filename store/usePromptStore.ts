// store/usePromptStore.ts
// 프롬프트 상태 관리 - Zustand

import { create } from 'zustand';
import type { PromptIR, GeneratedPrompt } from '@/types';

interface PromptStore {
    // 현재 IR
    ir: PromptIR | null;
    // 이전 IR (Diff 비교용)
    previousIr: PromptIR | null;
    // 렌더링된 프롬프트 (모델별)
    rendered: GeneratedPrompt['rendered'] | null;
    // 생성 중 여부
    isGenerating: boolean;
    // 에러 메시지
    error: string | null;

    // Actions
    setIR: (ir: PromptIR) => void;
    setRendered: (rendered: GeneratedPrompt['rendered']) => void;
    setIsGenerating: (isGenerating: boolean) => void;
    setError: (error: string | null) => void;
    clearPrompt: () => void;
}

export const usePromptStore = create<PromptStore>((set, get) => ({
    ir: null,
    previousIr: null,
    rendered: null,
    isGenerating: false,
    error: null,

    setIR: (ir) =>
        set((state) => ({
            previousIr: state.ir, // 현재 IR을 이전으로 이동
            ir,
        })),

    setRendered: (rendered) => set({ rendered }),

    setIsGenerating: (isGenerating) => set({ isGenerating }),

    setError: (error) => set({ error }),

    clearPrompt: () =>
        set({
            ir: null,
            previousIr: null,
            rendered: null,
            error: null,
        }),
}));
