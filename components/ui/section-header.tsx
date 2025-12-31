'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import type { IconSvgElement } from '@hugeicons/react';

interface SectionHeaderProps {
    icon?: IconSvgElement;
    title: string;
    className?: string;
    children?: React.ReactNode;  // 오른쪽에 추가 요소 (버튼 등)
}

/**
 * 섹션 헤더 컴포넌트
 * 아이콘 + 제목 + 선택적 오른쪽 요소
 */
export function SectionHeader({ icon, title, className, children }: SectionHeaderProps) {
    return (
        <div className={cn("flex items-center justify-between", className)}>
            <div className="lp-section-header">
                {icon && <HugeiconsIcon icon={icon} size={16} />}
                <h3 className="lp-section-title">{title}</h3>
            </div>
            {children}
        </div>
    );
}
