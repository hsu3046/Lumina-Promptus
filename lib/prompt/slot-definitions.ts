// config/slots/slot-definitions.ts
// Slot System - 프롬프트를 구성하는 각 슬롯의 목적과 제약 정의

import type { PromptSlot } from '@/types';

export const PROMPT_SLOTS: PromptSlot[] = [
    {
        id: 'meta_tokens',
        name: 'Meta Tokens',
        purpose: '카메라 메타데이터 (EXIF 시뮬레이션)',
        priority: 10,
        maxTokens: 50,
        conflicts: [],
        dependencies: [],
        mergeStrategy: 'replace'
    },
    {
        id: 'camera_body',
        name: 'Camera Body',
        purpose: '카메라 바디 및 센서 특성',
        priority: 9,
        maxTokens: 100,
        conflicts: [],
        dependencies: ['meta_tokens'],
        mergeStrategy: 'replace'
    },
    {
        id: 'lens',
        name: 'Lens',
        purpose: '렌즈 및 화각 특성',
        priority: 9,
        maxTokens: 80,
        conflicts: [],
        dependencies: ['camera_body'],
        mergeStrategy: 'replace'
    },
    {
        id: 'camera_settings',
        name: 'Camera Settings',
        purpose: 'ISO, 조리개, 셔터스피드, 화이트밸런스',
        priority: 8,
        maxTokens: 120,
        conflicts: [],
        dependencies: [],
        mergeStrategy: 'replace'
    },
    {
        id: 'lighting',
        name: 'Lighting Setup',
        purpose: '조명 패턴 및 광질',
        priority: 8,
        maxTokens: 150,
        conflicts: [],
        dependencies: [],
        mergeStrategy: 'append'
    },
    {
        id: 'subject',
        name: 'Subject Description',
        purpose: '피사체 묘사',
        priority: 9,
        maxTokens: 200,
        conflicts: [],
        dependencies: [],
        mergeStrategy: 'replace'
    },
    {
        id: 'composition',
        name: 'Composition',
        purpose: '구도 및 앵글',
        priority: 5,
        maxTokens: 80,
        conflicts: [],
        dependencies: [],
        mergeStrategy: 'append'
    },
    {
        id: 'color_grading',
        name: 'Color Grading',
        purpose: '색감 및 필름 스톡',
        priority: 6,
        maxTokens: 100,
        conflicts: ['photographer_style'], // 흑백 스타일 vs 컬러 필름 충돌 가능
        dependencies: [],
        mergeStrategy: 'replace'
    },
    {
        id: 'style',
        name: 'Style/Mood',
        purpose: '분위기 및 스타일',
        priority: 6,
        maxTokens: 100,
        conflicts: [],
        dependencies: [],
        mergeStrategy: 'append'
    },
    {
        id: 'quality',
        name: 'Quality Keywords',
        purpose: '품질 향상 키워드',
        priority: 4,
        maxTokens: 100,
        conflicts: [],
        dependencies: [],
        mergeStrategy: 'append'
    },
    {
        id: 'location',
        name: 'Location/Background',
        purpose: '배경 및 장소',
        priority: 7,
        maxTokens: 100,
        conflicts: [],
        dependencies: [],
        mergeStrategy: 'replace'
    },
    {
        id: 'fashion',
        name: 'Fashion',
        purpose: '패션 및 의상',
        priority: 7,
        maxTokens: 150,
        conflicts: [],
        dependencies: ['subject'],
        mergeStrategy: 'replace'
    },
    {
        id: 'expression_pose',
        name: 'Expression/Pose',
        purpose: '표정, 포즈, 시선',
        priority: 7,
        maxTokens: 150,
        conflicts: [],
        dependencies: ['subject'],
        mergeStrategy: 'replace'
    },
    {
        id: 'tech_specs',
        name: 'Tech Specs',
        purpose: '카메라/렌즈 상세 스펙',
        priority: 6,
        maxTokens: 200,
        conflicts: [],
        dependencies: ['camera_body', 'lens'],
        mergeStrategy: 'replace'
    },
    {
        id: 'landscape_instruction',
        name: 'Landscape Instruction',
        purpose: '풍경 촬영 지시문',
        priority: 10,
        maxTokens: 100,
        conflicts: [],
        dependencies: [],
        mergeStrategy: 'replace'
    },
    {
        id: 'landscape_subject',
        name: 'Landscape Subject',
        purpose: '풍경 피사체/장소',
        priority: 9,
        maxTokens: 150,
        conflicts: [],
        dependencies: [],
        mergeStrategy: 'replace'
    },
    {
        id: 'landscape_composition',
        name: 'Landscape Composition',
        purpose: '풍경 구도/공간 배치',
        priority: 8,
        maxTokens: 200,
        conflicts: [],
        dependencies: [],
        mergeStrategy: 'replace'
    },
    {
        id: 'landscape_environment',
        name: 'Landscape Environment',
        purpose: '환경/날씨/분위기',
        priority: 7,
        maxTokens: 150,
        conflicts: [],
        dependencies: [],
        mergeStrategy: 'replace'
    },
    {
        id: 'landscape_camera',
        name: 'Landscape Camera',
        purpose: '풍경용 카메라 스펙',
        priority: 6,
        maxTokens: 100,
        conflicts: [],
        dependencies: [],
        mergeStrategy: 'replace'
    },
    {
        id: 'negative',
        name: 'Negative Prompt',
        purpose: '네거티브 프롬프트',
        priority: 10,
        maxTokens: 300,
        conflicts: [],
        dependencies: [],
        mergeStrategy: 'append'
    }
];

// 슬롯 조회 헬퍼
export function getSlotById(id: string): PromptSlot | undefined {
    return PROMPT_SLOTS.find(slot => slot.id === id);
}

// 우선순위로 정렬된 슬롯 ID 목록
export const SLOT_ORDER_BY_PRIORITY = PROMPT_SLOTS
    .filter(slot => slot.id !== 'negative') // negative는 별도 처리
    .sort((a, b) => b.priority - a.priority)
    .map(slot => slot.id);

// Nano Banana Pro용 프롬프트 조합 순서
// 스펙: [피사체] + [라이팅] + [카메라/렌즈]
export const NANO_BANANA_PRO_SLOT_ORDER = [
    'subject',          // 1. 피사체
    'composition',      // 1-1. 구도 (피사체의 일부)
    'aspect_ratio',     // 1-2. 사진 비율
    'lighting',         // 2. 라이팅
    'meta_tokens',      // 3. 카메라 metaToken
    'camera_body',      // 3-1. 카메라 바디
    'lens',             // 3-2. 렌즈
    'camera_settings',  // 3-3. 카메라 설정 (라이팅 OFF일 때만)
    'color_grading',
    'style',
    'quality'
];
