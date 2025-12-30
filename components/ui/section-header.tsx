'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
    icon?: LucideIcon;
    title: string;
    className?: string;
    children?: React.ReactNode;  // 오른쪽에 추가 요소 (버튼 등)
}

/**
 * 섹션 헤더 컴포넌트
 * 아이콘 + 제목 + 선택적 오른쪽 요소
 */
export function SectionHeader({ icon: Icon, title, className, children }: SectionHeaderProps) {
    return (
        <div className={cn("flex items-center justify-between", className)}>
            <div className="lp-section-header">
                {Icon && <Icon className="w-4 h-4" />}
                <h3 className="lp-section-title">{title}</h3>
            </div>
            {children}
        </div>
    );
}
