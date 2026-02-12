/**
 * 범용 Dictionary 타입 정의
 * 모든 프롬프트 생성에 사용되는 공통 구조
 */

// ===== 컨텍스트 타입 =====

// 구도 기반 컨텍스트 (3단계)
// TIGHT: close-up, bust-shot (얼굴~가슴)
// MEDIUM: waist-shot, half-shot (허리~무릎)
// WIDE: three-quarter-shot, full-shot (무릎~전신)
export type FramingContext = 'TIGHT' | 'MEDIUM' | 'WIDE';

// 모드 기반 컨텍스트
export type ModeContext = 'STUDIO' | 'LANDSCAPE' | 'SNAP';

// AI 모델 기반 컨텍스트
export type ExporterContext = 'NANOBANANA' | 'MIDJOURNEY' | 'CHATGPT';

// ===== 범용 Dictionary Entry =====

export interface DictionaryEntry {
    id: string;
    label: string;

    // 프롬프트 변형 (컨텍스트별)
    prompts: {
        base: string;                    // 기본 프롬프트

        // 구도 기반 변형 (3단계)
        TIGHT?: string;                  // close-up, bust-shot
        MEDIUM?: string;                 // waist-shot, half-shot
        WIDE?: string;                   // three-quarter-shot, full-shot

        // 모드 기반 변형 (필요시)
        STUDIO?: string;
        LANDSCAPE?: string;
        SNAP?: string;

        // 커스텀 변형 (확장성)
        [key: string]: string | undefined;
    };

    // 프롬프트 역변환용 키워드
    detectionKeywords: string[];

    // 메타데이터 (옵션)
    meta?: {
        category?: string;               // 분류 (예: 'seated', 'standing')
        intensity?: 'subtle' | 'moderate' | 'dramatic';
        tags?: string[];
    };
}

// Dictionary 타입
export type Dictionary = Record<string, DictionaryEntry>;

// ===== 컨텍스트 판별 함수 =====

const TIGHT_FRAMINGS = ['close-up', 'extreme-close-up', 'bust-shot'];
const MEDIUM_FRAMINGS = ['waist-shot', 'half-shot'];

export function getFramingContext(framing: string): FramingContext {
    if (TIGHT_FRAMINGS.includes(framing)) return 'TIGHT';
    if (MEDIUM_FRAMINGS.includes(framing)) return 'MEDIUM';
    return 'WIDE';
}

// ===== 프롬프트 조회 함수 =====

interface GetPromptOptions {
    framing?: string;       // 구도 (WIDE/TIGHT 판별용)
    mode?: ModeContext;     // 모드
    exporter?: ExporterContext;  // AI 모델
    customContext?: string; // 커스텀 컨텍스트
}

/**
 * Dictionary에서 컨텍스트에 맞는 프롬프트 조회
 * 우선순위: customContext > framing(직접) > framing(그룹) > mode > base
 */
export function getPrompt(
    dictionary: Dictionary,
    entryId: string,
    options: GetPromptOptions = {}
): string {
    const entry = dictionary[entryId];
    if (!entry) return entryId; // fallback to raw id

    const { framing, mode, customContext } = options;

    // 우선순위 기반 조회
    if (customContext && customContext in entry.prompts) {
        return entry.prompts[customContext]!;
    }

    // framing 직접 조회 (예: 'close-up', 'bust-shot')
    if (framing && framing in entry.prompts) {
        return entry.prompts[framing]!;
    }

    // framing 그룹 조회 (예: 'TIGHT', 'MEDIUM', 'WIDE')
    if (framing) {
        const framingContext = getFramingContext(framing);
        if (entry.prompts[framingContext]) {
            return entry.prompts[framingContext]!;
        }
    }

    if (mode && entry.prompts[mode]) {
        return entry.prompts[mode]!;
    }

    return entry.prompts.base;
}

// ===== 역변환 함수 (프롬프트 → ID) =====

/**
 * 프롬프트 텍스트에서 해당 Dictionary entry ID 찾기
 */
export function detectEntryFromPrompt(
    dictionary: Dictionary,
    promptText: string
): string | null {
    const lowerPrompt = promptText.toLowerCase();

    for (const [id, entry] of Object.entries(dictionary)) {
        for (const keyword of entry.detectionKeywords) {
            if (lowerPrompt.includes(keyword.toLowerCase())) {
                return id;
            }
        }
    }

    return null;
}
