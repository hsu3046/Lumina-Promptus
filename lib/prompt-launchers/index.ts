// lib/prompt-launchers/index.ts
// AI 앱/사이트로 프롬프트를 직접 전송하는 런처

export type LauncherTarget = 'nanobanana' | 'chatgpt' | 'midjourney';

export interface LaunchResult {
    success: boolean;
    method: 'app' | 'web' | 'clipboard';
    message: string;
}

/**
 * AI 타겟별 URL 스킴 및 웹 URL 정의
 */
const LAUNCHER_CONFIG: Record<LauncherTarget, {
    appScheme?: string;    // 앱 URL 스킴 (설치된 경우 앱으로 열림)
    webUrl: string;        // 웹 폴백 URL
    supportsPrompt: boolean; // URL에 프롬프트 포함 가능 여부
}> = {
    chatgpt: {
        // ChatGPT 앱 URL 스킴 (iOS/Android)
        appScheme: 'chatgpt://',
        webUrl: 'https://chat.openai.com/',
        supportsPrompt: true,
    },
    midjourney: {
        // Discord 앱 URL 스킴
        appScheme: 'discord://',
        webUrl: 'https://discord.com/channels/@me',
        supportsPrompt: false, // Discord는 프롬프트 직접 전송 불가
    },
    nanobanana: {
        // NanoBanana Pro는 현재 웹 전용
        webUrl: 'https://nanobanana.pro/',
        supportsPrompt: false,
    },
};

/**
 * 프롬프트를 클립보드에 복사
 * - navigator.clipboard가 없는 환경(모바일 등)에서는 execCommand 폴백 사용
 */
async function copyToClipboard(prompt: string): Promise<boolean> {
    try {
        // 현대 브라우저: Clipboard API 사용
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(prompt);
            return true;
        }

        // 폴백: execCommand 사용 (구형 브라우저/모바일)
        const textArea = document.createElement('textarea');
        textArea.value = prompt;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return success;
    } catch {
        return false;
    }
}

/**
 * ChatGPT 런처
 * - ChatGPT 공식 딥링크 사용
 */
export function launchChatGPT(prompt: string): LaunchResult {
    const encodedPrompt = encodeURIComponent(prompt);

    // ChatGPT 공식 딥링크
    const url = `https://chat.openai.com/?q=${encodedPrompt}`;

    window.open(url, '_blank');

    return {
        success: true,
        method: 'web',
        message: 'ChatGPT가 새 탭에서 열렸습니다.',
    };
}

/**
 * Midjourney 런처 (Discord 경유)
 * - Discord 딥링크로 앱 열기 + 프롬프트 클립보드 복사
 * 참고: discord://-/channels/@me 형식이 공식 딥링크
 */
export async function launchMidjourney(prompt: string): Promise<LaunchResult> {
    // 프롬프트를 Midjourney 형식으로 변환
    const mjPrompt = `/imagine prompt: ${prompt}`;

    // 1. 프롬프트를 클립보드에 복사
    const copied = await copyToClipboard(mjPrompt);

    // 2. Discord 딥링크로 열기 (DM 목록)
    // discord://-/channels/@me 형식이 데스크탑 앱을 여는 공식 방식
    const appUrl = 'discord://-/channels/@me';
    const webUrl = 'https://discord.com/channels/@me';

    // 앱 딥링크 시도
    window.location.href = appUrl;

    // 앱이 안 열리면 웹으로 폴백
    setTimeout(() => {
        window.open(webUrl, '_blank');
    }, 500);

    return {
        success: copied,
        method: 'clipboard',
        message: copied
            ? 'Discord가 열렸습니다. Midjourney Bot DM에서 붙여넣기하세요.'
            : '클립보드 복사에 실패했습니다.',
    };
}

/**
 * NanoBanana Pro 런처 (Gemini)
 * - 클립보드 복사 후 Gemini 웹사이트 열기
 */
export async function launchNanoBanana(prompt: string): Promise<LaunchResult> {
    // 클립보드에 복사
    const copied = await copyToClipboard(prompt);

    // Gemini 웹사이트 열기
    window.open('https://gemini.google.com/', '_blank');

    return {
        success: copied,
        method: 'clipboard',
        message: copied
            ? 'Gemini가 열렸습니다. 프롬프트를 붙여넣기하세요.'
            : '클립보드 복사에 실패했습니다.',
    };
}

/**
 * 메인 런처 함수, target에 따라 적절한 런처 호출
 */
export async function launchPrompt(
    target: LauncherTarget,
    prompt: string
): Promise<LaunchResult> {
    if (!prompt || prompt.trim() === '') {
        return {
            success: false,
            method: 'clipboard',
            message: '프롬프트가 비어있습니다.',
        };
    }

    switch (target) {
        case 'chatgpt':
            return launchChatGPT(prompt);
        case 'midjourney':
            return launchMidjourney(prompt);
        case 'nanobanana':
            return launchNanoBanana(prompt);
        default:
            return {
                success: false,
                method: 'clipboard',
                message: '지원하지 않는 AI 타겟입니다.',
            };
    }
}
