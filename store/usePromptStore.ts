// store/usePromptStore.ts
// 프롬프트 상태 관리 - Zustand (Refine 기능 제거됨)

import { create } from 'zustand';
import type { PromptIR, GeneratedPrompt } from '@/types';

// AI 이미지 생성 모델 타입
export type TargetModel = 'nanoBanana' | 'chatgpt' | 'midjourney';

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
    // 현재 선택된 모델
    activeModel: TargetModel;

    // Actions
    setIR: (ir: PromptIR) => void;
    setRendered: (rendered: GeneratedPrompt['rendered']) => void;
    setIsGenerating: (isGenerating: boolean) => void;
    setError: (error: string | null) => void;
    setActiveModel: (model: TargetModel) => void;
    clearPrompt: () => void;
}

export const usePromptStore = create<PromptStore>((set) => ({
    ir: null,
    previousIr: null,
    rendered: null,
    isGenerating: false,
    error: null,
    activeModel: 'nanoBanana',

    setIR: (ir) =>
        set((state) => ({
            previousIr: state.ir,
            ir,
        })),

    setRendered: (rendered) => set({ rendered }),

    setIsGenerating: (isGenerating) => set({ isGenerating }),

    setError: (error) => set({ error }),

    setActiveModel: (model) => set({ activeModel: model }),

    clearPrompt: () =>
        set({
            ir: null,
            previousIr: null,
            rendered: null,
            error: null,
        }),
}));
