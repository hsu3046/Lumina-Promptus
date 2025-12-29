'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Eye, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/store/useSettingsStore';
import { generate14ReferenceImages } from '@/lib/landscape/reference-image-generator';
import { getCompassLabel } from '@/config/mappings/landscape-environment';
import type { LandscapeReferenceImage } from '@/types/landscape.types';

export function StreetViewPreview() {
    const { settings } = useSettingsStore();
    const { landscape } = settings;
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [previewError, setPreviewError] = useState(false);

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const hasApiKey = apiKey && apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE';

    // Street View URL 생성
    const getPreviewUrl = () => {
        const { lat, lng } = landscape.location.coordinates;
        const { heading, pitch } = landscape.camera;

        if (!hasApiKey) {
            // Placeholder 이미지 (API 키 없을 때)
            return `https://via.placeholder.com/600x400/1a1a1a/888888?text=API+Key+Required`;
        }

        return `https://maps.googleapis.com/maps/api/streetview?` +
            `size=600x400` +
            `&location=${lat},${lng}` +
            `&heading=${heading}` +
            `&pitch=${pitch}` +
            `&fov=90` +
            `&key=${apiKey}`;
    };

    // 14장 참조 이미지 ZIP 다운로드
    const handleDownload = async () => {
        if (!hasApiKey) {
            alert('Google Maps API 키를 .env.local에 설정해주세요.');
            return;
        }

        setIsDownloading(true);

        try {
            const images = generate14ReferenceImages(
                [landscape.location.coordinates.lat, landscape.location.coordinates.lng],
                landscape.camera.heading,
                landscape.camera.pitch,
                { googleApiKey: apiKey }
            );

            // 동적으로 JSZip 로드
            const JSZip = (await import('jszip')).default;
            const { saveAs } = await import('file-saver');

            const zip = new JSZip();

            // 이미지 다운로드 및 ZIP에 추가
            const fetchPromises = images.map(async (img: LandscapeReferenceImage, idx: number) => {
                try {
                    const response = await fetch(img.url);
                    if (!response.ok) throw new Error(`Failed to fetch ${img.label}`);
                    const blob = await response.blob();
                    const filename = `${String(idx + 1).padStart(2, '0')}_${img.label}.jpg`;
                    zip.file(filename, blob);
                } catch (error) {
                    console.error(`Failed to download ${img.label}:`, error);
                }
            });

            await Promise.all(fetchPromises);

            // ZIP 파일 생성 및 다운로드
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const locationName = landscape.location.name || 'landscape';
            const safeName = locationName.replace(/[^a-zA-Z0-9가-힣]/g, '_');
            saveAs(zipBlob, `reference_images_${safeName}.zip`);
        } catch (error) {
            console.error('Download failed:', error);
            alert('이미지 다운로드에 실패했습니다.');
        } finally {
            setIsDownloading(false);
        }
    };

    const previewUrl = getPreviewUrl();
    const compassLabel = getCompassLabel(landscape.camera.heading);

    return (
        <section className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400">
                    <Eye className="w-4 h-4" />
                    <h3 className="text-sm font-medium">Street View 미리보기</h3>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    disabled={!hasApiKey || isDownloading}
                    className="h-7 text-xs gap-1"
                >
                    {isDownloading ? (
                        <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            다운로드 중...
                        </>
                    ) : (
                        <>
                            <Download className="w-3 h-3" />
                            참조 이미지 (14장)
                        </>
                    )}
                </Button>
            </div>

            {/* 미리보기 이미지 */}
            <div className="relative rounded-lg overflow-hidden border border-zinc-700 bg-zinc-900">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/80 z-10">
                        <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                    </div>
                )}
                <img
                    src={previewUrl}
                    alt="Street View Preview"
                    className="w-full h-auto aspect-[3/2] object-cover"
                    onLoad={() => {
                        setIsLoading(false);
                        setPreviewError(false);
                    }}
                    onError={() => {
                        setIsLoading(false);
                        setPreviewError(true);
                    }}
                />
                {previewError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/90">
                        <p className="text-xs text-zinc-500">이미지를 불러올 수 없습니다</p>
                    </div>
                )}
            </div>

            {/* 메타 정보 */}
            <div className="flex justify-between text-[10px] text-zinc-500">
                <span>
                    {landscape.location.coordinates.lat.toFixed(4)}, {landscape.location.coordinates.lng.toFixed(4)}
                </span>
                <span>{compassLabel} • {landscape.camera.heading}° • Pitch {landscape.camera.pitch}°</span>
            </div>

            {!hasApiKey && (
                <p className="text-[10px] text-amber-500/70 text-center">
                    ⚠️ .env.local에 NEXT_PUBLIC_GOOGLE_MAPS_API_KEY를 설정하세요
                </p>
            )}
        </section>
    );
}
