// store/useApiKeyStore.ts
// API Key 관리 - localStorage 전용, 서버 전송 없음

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ImageProvider = 'gemini' | 'openai' | 'seedream';

export interface ProviderConfig {
    label: string;
    description: string;
    pricing: string;
    modelId: string;
}

export const PROVIDER_CONFIGS: Record<ImageProvider, ProviderConfig> = {
    gemini: {
        label: 'Google Gemini 3 Pro',
        description: '최대 4K · 사진 리얼리즘 최고',
        pricing: '~$0.13/장',
        modelId: 'gemini-3-pro-image-preview',
    },
    openai: {
        label: 'OpenAI GPT Image 1.5',
        description: '품질별 가격 선택 가능',
        pricing: '$0.01~0.20/장',
        modelId: 'gpt-image-1.5',
    },
    seedream: {
        label: 'ByteDance SeedDream 4.5',
        description: 'BytePlus ModelArk Key · 인물 자유도',
        pricing: '~$0.04/장',
        modelId: 'bytedance/seedream-4-5',
    },
};

interface ApiKeyState {
    // 선택된 provider
    selectedProvider: ImageProvider;
    // provider별 API Key 저장
    apiKeys: Partial<Record<ImageProvider, string>>;

    // Actions
    setSelectedProvider: (provider: ImageProvider) => void;
    setApiKey: (provider: ImageProvider, key: string) => void;
    removeApiKey: (provider: ImageProvider) => void;
    getActiveApiKey: () => string | undefined;
    hasActiveApiKey: () => boolean;
}

export const useApiKeyStore = create<ApiKeyState>()(
    persist(
        (set, get) => ({
            selectedProvider: 'gemini',
            apiKeys: {},

            setSelectedProvider: (provider) => set({ selectedProvider: provider }),

            setApiKey: (provider, key) =>
                set((state) => ({
                    apiKeys: { ...state.apiKeys, [provider]: key },
                })),

            removeApiKey: (provider) =>
                set((state) => {
                    const newKeys = { ...state.apiKeys };
                    delete newKeys[provider];
                    return { apiKeys: newKeys };
                }),

            getActiveApiKey: () => {
                const state = get();
                return state.apiKeys[state.selectedProvider];
            },

            hasActiveApiKey: () => {
                const state = get();
                const key = state.apiKeys[state.selectedProvider];
                return !!key && key.trim().length > 0;
            },
        }),
        {
            name: 'lumina-api-keys', // localStorage key
        }
    )
);

/**
 * API Key 마스킹 유틸리티
 * 예: "sk-abc123xyz789" → "sk-abc...789"
 */
export function maskApiKey(key: string): string {
    if (key.length <= 8) return '****';
    return `${key.slice(0, 6)}...${key.slice(-4)}`;
}
