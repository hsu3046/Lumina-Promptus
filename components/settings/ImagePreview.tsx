'use client';

// components/settings/ImagePreview.tsx
// 생성된 이미지 프리뷰 컴포넌트 (로딩/완료/에러 상태)

import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Download04Icon, ArrowReloadHorizontalIcon, Image01Icon, AlertCircleIcon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export type ImageGenStatus = 'idle' | 'generating' | 'done' | 'error';

interface ImagePreviewProps {
    status: ImageGenStatus;
    imageUrl?: string;
    error?: string;
    durationMs?: number;
    onRetry?: () => void;
}

export function ImagePreview({ status, imageUrl, error, durationMs, onRetry }: ImagePreviewProps) {
    const handleDownload = async () => {
        if (!imageUrl) return;

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const filename = `lumina_${timestamp}.png`;

        try {
            // 이미지를 blob으로 변환
            let blob: Blob;
            if (imageUrl.startsWith('data:')) {
                const res = await fetch(imageUrl);
                blob = await res.blob();
            } else {
                // 외부 URL → 서버 프록시로 다운로드
                const proxyRes = await fetch('/api/image-proxy/download', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: imageUrl }),
                });
                if (!proxyRes.ok) throw new Error('Proxy download failed');
                blob = await proxyRes.blob();
            }

            // 방법 1: File System Access API (Chrome 86+)
            if ('showSaveFilePicker' in window) {
                try {
                    const handle = await (window as unknown as { showSaveFilePicker: (opts: unknown) => Promise<FileSystemFileHandle> }).showSaveFilePicker({
                        suggestedName: filename,
                        types: [{
                            description: 'PNG image',
                            accept: { 'image/png': ['.png'] },
                        }],
                    });
                    const writable = await handle.createWritable();
                    await writable.write(blob);
                    await writable.close();
                    return;
                } catch (e) {
                    // 사용자가 취소한 경우 — fallback으로 진행
                    if (e instanceof Error && e.name === 'AbortError') return;
                }
            }

            // 방법 2: Fallback — blob URL + anchor
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);
            }, 100);
        } catch {
            // 최종 fallback: 새 탭에서 열기
            window.open(imageUrl, '_blank');
        }
    };

    // 미생성 상태
    if (status === 'idle') {
        return (
            <div className="h-[350px] rounded-lg border border-zinc-800 bg-zinc-950 flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center">
                    <HugeiconsIcon icon={Image01Icon} size={28} className="text-zinc-600" />
                </div>
                <p className="text-sm text-zinc-600 text-center px-4">
                    우측 상단 <span className="text-amber-400/80">[생성]</span> 버튼으로<br />
                    이미지를 만들어 보세요
                </p>
            </div>
        );
    }

    // 생성 중
    if (status === 'generating') {
        return (
            <div className="h-[350px] rounded-lg border border-zinc-800 bg-zinc-950 flex flex-col items-center justify-center gap-4">
                {/* 물결 애니메이션 */}
                <div className="flex gap-1.5">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="w-2 h-8 bg-amber-500/60 rounded-full animate-pulse"
                            style={{
                                animationDelay: `${i * 150}ms`,
                                animationDuration: '1s',
                            }}
                        />
                    ))}
                </div>
                <p className="text-sm text-zinc-400">이미지 생성 중...</p>
            </div>
        );
    }

    // 에러
    if (status === 'error') {
        return (
            <div className="h-[350px] rounded-lg border border-red-900/30 bg-zinc-950 flex flex-col items-center justify-center gap-3 px-6">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                    <HugeiconsIcon icon={AlertCircleIcon} size={20} className="text-red-400" />
                </div>
                <p className="text-sm text-red-400 text-center whitespace-pre-line">{error || '이미지 생성에 실패했습니다.'}</p>
                {onRetry && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRetry}
                        className="h-7 text-xs px-3 border-red-800 text-red-400 hover:bg-red-500/10"
                    >
                        <HugeiconsIcon icon={ArrowReloadHorizontalIcon} size={12} className="mr-1" />
                        재시도
                    </Button>
                )}
            </div>
        );
    }

    // 라이트박스 상태
    const [lightboxOpen, setLightboxOpen] = useState(false);

    // 완료 — 이미지 표시
    return (
        <>
            <div className="relative rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden">
                <div
                    className="h-[350px] flex items-center justify-center p-2 cursor-pointer"
                    onClick={() => setLightboxOpen(true)}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={imageUrl}
                        alt="AI 생성 이미지"
                        className="max-h-full max-w-full object-contain rounded"
                    />
                </div>

                {/* 하단 오버레이: 다운로드 + 소요 시간 */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-400">
                        {durationMs ? `${(durationMs / 1000).toFixed(1)}초` : ''}
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDownload}
                        className="h-6 text-xs px-2 text-zinc-300 hover:text-white hover:bg-white/10"
                    >
                        <HugeiconsIcon icon={Download04Icon} size={12} className="mr-1" />
                        저장
                    </Button>
                </div>
            </div>

            {/* 전체화면 라이트박스 */}
            <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
                <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto p-0 border-none bg-black/95 flex items-center justify-center [&>button]:text-white [&>button]:hover:bg-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={imageUrl}
                        alt="AI 생성 이미지 (전체화면)"
                        className="max-w-[90vw] max-h-[90vh] object-contain rounded"
                        onClick={() => setLightboxOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}
