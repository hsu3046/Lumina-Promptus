'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface FieldLabelProps {
    children: React.ReactNode;
    size?: 'default' | 'sm';
    className?: string;
}

/**
 * 필드 라벨 컴포넌트
 * 폼 필드 위에 표시되는 일관된 라벨 스타일
 */
export function FieldLabel({ children, size = 'default', className }: FieldLabelProps) {
    return (
        <span
            className={cn(
                size === 'sm' ? 'lp-label-sm' : 'lp-label',
                className
            )}
        >
            {children}
        </span>
    );
}

interface FieldValueProps {
    children: React.ReactNode;
    muted?: boolean;
    className?: string;
}

/**
 * 필드 값 표시 컴포넌트
 * 현재 선택된 값을 표시
 */
export function FieldValue({ children, muted = false, className }: FieldValueProps) {
    return (
        <span
            className={cn(
                muted ? 'lp-value-muted' : 'lp-value',
                className
            )}
        >
            {children}
        </span>
    );
}
