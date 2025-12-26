// store/useHistoryStore.ts
// 프롬프트 히스토리 관리 - Zustand + LocalStorage

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PromptHistoryItem, PromptIR, UserSettings } from '@/types';

interface HistoryStore {
    // 히스토리 목록 (최대 50개)
    history: PromptHistoryItem[];
    // 현재 선택된 히스토리 인덱스
    currentIndex: number | null;

    // Actions
    addToHistory: (ir: PromptIR, settings: UserSettings, description: string) => void;
    selectHistoryItem: (index: number) => PromptHistoryItem | null;
    clearHistory: () => void;
    removeHistoryItem: (id: string) => void;
}

const MAX_HISTORY = 50;

export const useHistoryStore = create<HistoryStore>()(
    persist(
        (set, get) => ({
            history: [],
            currentIndex: null,

            addToHistory: (ir, settings, description) =>
                set((state) => {
                    const newItem: PromptHistoryItem = {
                        id: crypto.randomUUID(),
                        timestamp: Date.now(),
                        ir,
                        settings,
                        changeDescription: description,
                    };

                    // 최신 순으로 추가, 최대 개수 유지
                    const newHistory = [newItem, ...state.history].slice(0, MAX_HISTORY);

                    return {
                        history: newHistory,
                        currentIndex: 0, // 가장 최근 항목 선택
                    };
                }),

            selectHistoryItem: (index) => {
                const state = get();
                if (index >= 0 && index < state.history.length) {
                    set({ currentIndex: index });
                    return state.history[index];
                }
                return null;
            },

            clearHistory: () => set({ history: [], currentIndex: null }),

            removeHistoryItem: (id) =>
                set((state) => ({
                    history: state.history.filter((item) => item.id !== id),
                    currentIndex: null,
                })),
        }),
        {
            name: 'lumina-promptus-history',
        }
    )
);
