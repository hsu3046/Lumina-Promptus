// store/usePromptStore.ts
// 프롬프트 상태 관리 - Zustand

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

    // ===== 모델별 Refine 캐싱 =====
    // 기본 프롬프트 (Refine 전, 캐시)
    basePrompt: string;
    // 설정 변경 감지용 해시
    settingsHash: string;
    // 모델별 정제된 프롬프트
    refinedPrompts: Partial<Record<TargetModel, string>>;
    // 현재 선택된 모델
    activeModel: TargetModel;
    // Refine API 호출 중
    isRefining: boolean;
    // Refine 에러
    refineError: string | null;

    // Actions
    setIR: (ir: PromptIR) => void;
    setRendered: (rendered: GeneratedPrompt['rendered']) => void;
    setIsGenerating: (isGenerating: boolean) => void;
    setError: (error: string | null) => void;
    clearPrompt: () => void;

    // ===== 모델별 Refine Actions =====
    setBasePrompt: (prompt: string, hash: string) => void;
    setRefinedPrompt: (model: TargetModel, prompt: string) => void;
    setActiveModel: (model: TargetModel) => void;
    setIsRefining: (loading: boolean) => void;
    setRefineError: (error: string | null) => void;
    invalidateRefineCache: () => void;
    isCacheValid: (currentHash: string) => boolean;
    getRefinedPrompt: (model: TargetModel) => string | undefined;
}

export const usePromptStore = create<PromptStore>((set, get) => ({
    ir: null,
    previousIr: null,
    rendered: null,
    isGenerating: false,
    error: null,

    // 모델별 Refine 초기값
    basePrompt: '',
    settingsHash: '',
    refinedPrompts: {},
    activeModel: 'nanoBanana',
    isRefining: false,
    refineError: null,

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
            // Refine 캐시도 초기화
            basePrompt: '',
            settingsHash: '',
            refinedPrompts: {},
            refineError: null,
        }),

    // ===== 모델별 Refine Actions =====
    setBasePrompt: (prompt, hash) => set({
        basePrompt: prompt,
        settingsHash: hash,
        refinedPrompts: {}, // 새 기본 프롬프트 시 정제 결과 초기화
        refineError: null,
    }),

    setRefinedPrompt: (model, prompt) => set((state) => ({
        refinedPrompts: {
            ...state.refinedPrompts,
            [model]: prompt,
        },
        refineError: null,
    })),

    setActiveModel: (model) => set({ activeModel: model }),

    setIsRefining: (loading) => set({ isRefining: loading }),

    setRefineError: (error) => set({ refineError: error }),

    invalidateRefineCache: () => set({
        basePrompt: '',
        settingsHash: '',
        refinedPrompts: {},
        refineError: null,
    }),

    isCacheValid: (currentHash) => {
        const { settingsHash, basePrompt } = get();
        return settingsHash === currentHash && basePrompt !== '';
    },

    getRefinedPrompt: (model) => {
        return get().refinedPrompts[model];
    },
}));

// 설정 해시 생성 유틸리티
export function generateSettingsHash(settings: unknown): string {
    return JSON.stringify(settings);
}

