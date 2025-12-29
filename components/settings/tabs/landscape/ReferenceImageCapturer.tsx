'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Download, Camera, Loader2, CheckCircle, AlertCircle, X, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useSettingsStore } from '@/store/useSettingsStore';
import {
    generateHybrid14Slots,
    generateStreetViewUrl,
    generateCaptureMetadata,
    createInitialProgress,
    type CaptureProgress,
    type CaptureSlot,
    type Hybrid14Config,
} from '@/lib/landscape/hybrid14-capturer';
import {
    getTilesCaptureService,
    destroyTilesCaptureService,
} from '@/lib/landscape/tiles-capture-service';

/**
 * Hybrid 14 참조 이미지 캡처 컴포넌트
 * 3D Tiles 6장 + Street View 8장 자동 캡처
 */
export function ReferenceImageCapturer() {
    const { settings } = useSettingsStore();
    const { location, camera } = settings.landscape;

    const [progress, setProgress] = useState<CaptureProgress>(createInitialProgress());
    const [isCapturing, setIsCapturing] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [tiles3DEnabled, setTiles3DEnabled] = useState(true);
    const abortRef = useRef(false);
    const hiddenContainerRef = useRef<HTMLDivElement>(null);

    // 컴포넌트 언마운트 시 정리
    useEffect(() => {
        return () => {
            destroyTilesCaptureService();
        };
    }, []);

    // 캡처 시작
    const startCapture = useCallback(async () => {
        const lat = location?.coordinates?.lat ?? 0;
        const lng = location?.coordinates?.lng ?? 0;

        if (lat === 0 && lng === 0) {
            setProgress(prev => ({
                ...prev,
                phase: 'error',
                error: '먼저 위치를 설정해주세요.',
            }));
            return;
        }

        abortRef.current = false;
        setIsCapturing(true);

        const config: Hybrid14Config = {
            lat,
            lng,
            userHeading: camera?.heading ?? 0,
            userPitch: camera?.pitch ?? 0,
            elevation: location?.elevation ?? 0,
        };

        const slots = generateHybrid14Slots(config);
        const capturedImages: string[] = new Array(14).fill('');

        setProgress({
            currentSlot: 0,
            totalSlots: 14,
            currentType: null,
            currentDescription: '캡처 준비 중...',
            phase: 'preparing',
            percentage: 0,
            capturedImages: [],
        });

        // === Phase 1: 3D Tiles 캡처 (슬롯 1-6) ===
        if (tiles3DEnabled && hiddenContainerRef.current) {
            setProgress(prev => ({
                ...prev,
                currentDescription: '3D Tiles 초기화 중...',
                phase: 'rendering',
            }));

            const captureService = getTilesCaptureService();
            const initialized = await captureService.initialize(hiddenContainerRef.current);

            if (initialized) {
                for (let i = 0; i < 6; i++) {
                    if (abortRef.current) break;

                    const slot = slots[i];
                    setProgress(prev => ({
                        ...prev,
                        currentSlot: slot.slot,
                        currentType: slot.type,
                        currentDescription: `${slot.description} (고해상도 타일 대기)`,
                        phase: 'rendering',
                        percentage: Math.round((i / 14) * 100),
                    }));

                    const image = await captureService.captureSlot(slot, lat, lng);
                    capturedImages[i] = image;
                }

                // 3D 캡처 완료 후 리소스 정리
                destroyTilesCaptureService();
            } else {
                console.warn('[ReferenceImageCapturer] 3D Tiles initialization failed, skipping 3D capture');
            }
        }

        // === Phase 2: Street View 캡처 (슬롯 7-14) ===
        for (let i = 6; i < slots.length; i++) {
            if (abortRef.current) break;

            const slot = slots[i];

            setProgress(prev => ({
                ...prev,
                currentSlot: slot.slot,
                currentType: slot.type,
                currentDescription: slot.description,
                phase: 'capturing',
                percentage: Math.round((i / slots.length) * 100),
            }));

            try {
                const url = generateStreetViewUrl(
                    lat, lng,
                    slot.heading,
                    slot.pitch,
                    slot.fov
                );

                if (url) {
                    await new Promise<void>((resolve) => {
                        const img = new Image();
                        img.crossOrigin = 'anonymous';
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            canvas.width = img.width;
                            canvas.height = img.height;
                            const ctx = canvas.getContext('2d');
                            if (ctx) {
                                ctx.drawImage(img, 0, 0);
                                capturedImages[i] = canvas.toDataURL('image/jpeg', 0.9);
                            }
                            resolve();
                        };
                        img.onerror = () => resolve();
                        img.src = url;
                    });
                }

                await new Promise(resolve => setTimeout(resolve, 150));

            } catch (err) {
                console.error(`Slot ${slot.slot} capture error:`, err);
            }
        }

        // 캡처 완료
        const successCount = capturedImages.filter(img => img).length;
        setProgress(prev => ({
            ...prev,
            currentSlot: 14,
            phase: abortRef.current ? 'error' : 'complete',
            percentage: 100,
            currentDescription: abortRef.current ? '캡처가 취소되었습니다.' : `캡처 완료! (${successCount}장)`,
            capturedImages,
            error: abortRef.current ? '사용자에 의해 취소됨' : undefined,
        }));

        setIsCapturing(false);
        setShowPreview(true);

    }, [location, camera, tiles3DEnabled]);

    // 캡처 취소
    const cancelCapture = useCallback(() => {
        abortRef.current = true;
        destroyTilesCaptureService();
    }, []);

    // ZIP 다운로드
    const downloadZip = useCallback(async () => {
        if (progress.capturedImages.length === 0) return;

        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();

        const config: Hybrid14Config = {
            lat: location?.coordinates?.lat ?? 0,
            lng: location?.coordinates?.lng ?? 0,
            userHeading: camera?.heading ?? 0,
            userPitch: camera?.pitch ?? 0,
            elevation: location?.elevation ?? 0,
        };

        const slots = generateHybrid14Slots(config);
        const metadata = generateCaptureMetadata(config, slots);

        zip.file('metadata.json', JSON.stringify(metadata, null, 2));

        progress.capturedImages.forEach((dataUrl, index) => {
            if (dataUrl) {
                const base64 = dataUrl.split(',')[1];
                if (base64) {
                    const slot = slots[index];
                    const filename = `slot${String(slot.slot).padStart(2, '0')}_${slot.type}_h${slot.heading}.jpg`;
                    zip.file(filename, base64, { base64: true });
                }
            }
        });

        const blob = await zip.generateAsync({
            type: 'blob',
            mimeType: 'application/zip'
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const now = new Date();
        const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
        link.download = `reference_images_${timestamp}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

    }, [progress.capturedImages, location, camera]);

    // 진행률 색상
    const getPhaseColor = () => {
        switch (progress.phase) {
            case 'complete': return 'text-green-400';
            case 'error': return 'text-red-400';
            case 'rendering': return 'text-blue-400';
            case 'capturing': return 'text-amber-400';
            default: return 'text-zinc-400';
        }
    };

    // 슬롯 타입 한글
    const getTypeLabel = (type: CaptureSlot['type'] | null) => {
        switch (type) {
            case '3d_birdseye': return '🛰️ 버드아이 뷰';
            case '3d_target': return '📐 24mm 타겟';
            case 'streetview': return '📷 스트리트 뷰';
            default: return '⏳ 준비 중';
        }
    };

    return (
        <section className="space-y-3">
            {/* 숨겨진 3D 렌더링 컨테이너 */}
            <div
                ref={hiddenContainerRef}
                style={{
                    position: 'absolute',
                    left: '-9999px',
                    top: 0,
                    width: '640px',
                    height: '640px',
                    visibility: 'hidden',
                }}
            />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400">
                    <Camera className="w-4 h-4" />
                    <h3 className="text-sm font-medium">참조 이미지 캡처</h3>
                </div>

                {!isCapturing && progress.phase !== 'complete' && (
                    <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1 text-[10px] text-zinc-500">
                            <input
                                type="checkbox"
                                checked={tiles3DEnabled}
                                onChange={(e) => setTiles3DEnabled(e.target.checked)}
                                className="w-3 h-3"
                            />
                            <Building2 className="w-3 h-3" />
                            3D
                        </label>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={startCapture}
                            className="text-xs"
                        >
                            <Camera className="w-3 h-3 mr-1" />
                            14장 캡처 시작
                        </Button>
                    </div>
                )}

                {progress.phase === 'complete' && (
                    <Button
                        size="sm"
                        variant="default"
                        onClick={downloadZip}
                        className="text-xs bg-amber-500 hover:bg-amber-600"
                    >
                        <Download className="w-3 h-3 mr-1" />
                        ZIP 다운로드
                    </Button>
                )}
            </div>

            {/* 캡처 진행 상태 */}
            {isCapturing && (
                <div className="bg-zinc-900/80 rounded-lg p-4 space-y-3 border border-zinc-800">
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                            <span className="text-zinc-400">
                                슬롯 {progress.currentSlot} / {progress.totalSlots}
                            </span>
                            <span className={getPhaseColor()}>
                                {progress.percentage}%
                            </span>
                        </div>
                        <Progress value={progress.percentage} className="h-2" />
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[8px] font-bold text-amber-400">
                                    {progress.currentSlot}
                                </span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-zinc-200">
                                {getTypeLabel(progress.currentType)}
                            </p>
                            <p className="text-[10px] text-zinc-500">
                                {progress.currentDescription}
                            </p>
                        </div>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={cancelCapture}
                            className="h-8 w-8"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="flex gap-1">
                        {Array.from({ length: 14 }, (_, i) => {
                            const slotNum = i + 1;
                            const isCurrent = slotNum === progress.currentSlot;
                            const isDone = slotNum < progress.currentSlot;
                            const is3D = slotNum <= 6;

                            return (
                                <div
                                    key={i}
                                    className={`
                                        w-6 h-6 rounded text-[8px] flex items-center justify-center
                                        ${isCurrent ? 'bg-amber-500 text-black' : ''}
                                        ${isDone ? (is3D ? 'bg-blue-500/50' : 'bg-green-500/50') : ''}
                                        ${!isCurrent && !isDone ? 'bg-zinc-800 text-zinc-600' : ''}
                                    `}
                                >
                                    {slotNum}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* 완료 상태 */}
            {progress.phase === 'complete' && !isCapturing && (
                <div className="bg-green-900/20 rounded-lg p-3 border border-green-800/50">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <div className="flex-1">
                            <p className="text-sm text-green-300">캡처 완료!</p>
                            <p className="text-[10px] text-green-500">
                                {progress.capturedImages.filter(img => img).length}장 이미지 준비됨
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* 오류 상태 */}
            {progress.phase === 'error' && !isCapturing && (
                <div className="bg-red-900/20 rounded-lg p-3 border border-red-800/50">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        <div className="flex-1">
                            <p className="text-sm text-red-300">{progress.error}</p>
                        </div>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={startCapture}
                            className="text-xs"
                        >
                            다시 시도
                        </Button>
                    </div>
                </div>
            )}

            {/* 미리보기 그리드 */}
            {showPreview && progress.capturedImages.length > 0 && (
                <div className="grid grid-cols-7 gap-1">
                    {progress.capturedImages.map((img, i) => (
                        <div
                            key={i}
                            className={`aspect-square rounded overflow-hidden ${i < 6 ? 'bg-blue-900/30 border border-blue-800/50' : 'bg-zinc-800'
                                }`}
                        >
                            {img ? (
                                <img
                                    src={img}
                                    alt={`Slot ${i + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[8px] text-zinc-600">
                                    {i < 6 ? '3D' : i + 1}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* 설명 */}
            {!isCapturing && progress.phase === 'preparing' && (
                <p className="text-[10px] text-zinc-500">
                    3D 뷰 6장 + Street View 8장을 자동으로 캡처하여 AI 참조 이미지로 활용합니다.
                </p>
            )}
        </section>
    );
}
