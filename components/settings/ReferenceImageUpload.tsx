'use client';

// components/settings/ReferenceImageUpload.tsx
// 제품 레퍼런스 이미지 드래그&드롭 업로드

import * as React from 'react';
import { useCallback, useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Upload04Icon, Delete02Icon, Image01Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import type { ProductReferenceImage } from '@/types/product.types';

interface ReferenceImageUploadProps {
    image?: ProductReferenceImage;
    onUpload: (image: ProductReferenceImage) => void;
    onRemove: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function ReferenceImageUpload({ image, onUpload, onRemove }: ReferenceImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFile = useCallback((file: File) => {
        if (file.size > MAX_FILE_SIZE) {
            alert('파일 크기는 5MB 이하여야 합니다.');
            return;
        }
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드 가능합니다.');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result as string;
            onUpload({
                id: crypto.randomUUID(),
                base64,
                fileName: file.name,
                fileSize: file.size,
                mimeType: file.type,
            });
        };
        reader.readAsDataURL(file);
    }, [onUpload]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    }, [processFile]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
        // 같은 파일 재선택 가능하게 초기화
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, [processFile]);

    // 이미지가 있으면 프리뷰 표시
    if (image) {
        return (
            <div className="relative rounded-lg border border-zinc-700 bg-zinc-900 overflow-hidden">
                <div className="h-[140px] flex items-center justify-center p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={image.base64}
                        alt="레퍼런스 이미지"
                        className="max-h-full max-w-full object-contain rounded"
                    />
                </div>
                <div className="absolute top-2 right-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onRemove}
                        className="h-7 w-7 p-0 bg-black/60 hover:bg-red-500/60 text-zinc-300 hover:text-white rounded-full"
                    >
                        <HugeiconsIcon icon={Delete02Icon} size={14} />
                    </Button>
                </div>
                <div className="px-3 py-1.5 bg-zinc-800/80 text-[10px] text-zinc-400 truncate">
                    {image.fileName} ({(image.fileSize / 1024).toFixed(0)}KB)
                </div>
            </div>
        );
    }

    // 업로드 영역
    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`
                h-[140px] rounded-lg border-2 border-dashed cursor-pointer
                flex flex-col items-center justify-center gap-2 transition-colors
                ${isDragging
                    ? 'border-amber-400 bg-amber-400/5'
                    : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-900'
                }
            `}
        >
            <HugeiconsIcon
                icon={isDragging ? Image01Icon : Upload04Icon}
                size={24}
                className={isDragging ? 'text-amber-400' : 'text-zinc-500'}
            />
            <p className="text-xs text-zinc-500 text-center px-4">
                {isDragging ? '여기에 놓으세요' : '클릭 또는 드래그하여\n레퍼런스 이미지 업로드'}
            </p>
            <p className="text-[10px] text-zinc-600">PNG, JPG (최대 5MB)</p>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />
        </div>
    );
}
