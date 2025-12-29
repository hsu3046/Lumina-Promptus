'use client';

import { useMemo } from 'react';
import { Layers, Eye, EyeOff } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { analyzeOcclusion } from '@/lib/landscape/occlusion-analyzer';
import { LANDSCAPE_LENS_SPECS } from '@/config/mappings/landscape-environment';

/**
 * 랜드마크 기반 Occlusion 분석 결과를 표시하는 컴포넌트
 */
export function OcclusionInfo() {
    const { settings } = useSettingsStore();
    const { landmarks, camera, lensId } = settings.landscape;

    // 렌즈 FOV 추출
    const fov = useMemo(() => {
        const match = lensId.match(/(\d+)mm/);
        if (match) {
            const focal = match[1] + 'mm';
            if (focal in LANDSCAPE_LENS_SPECS) {
                return LANDSCAPE_LENS_SPECS[focal as keyof typeof LANDSCAPE_LENS_SPECS].fov;
            }
        }
        return 84; // 24mm 기본값
    }, [lensId]);

    // Occlusion 분석
    const analysis = useMemo(() => {
        if (!landmarks || landmarks.length === 0) return null;
        return analyzeOcclusion(landmarks, camera.heading, fov);
    }, [landmarks, camera.heading, fov]);

    if (!analysis) {
        return (
            <div className="bg-zinc-900/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-zinc-500">
                    <Layers className="w-4 h-4" />
                    <span className="text-xs">랜드마크를 추가하면 공간 분석이 표시됩니다</span>
                </div>
            </div>
        );
    }

    // 차폐율에 따른 색상
    const getOcclusionColor = () => {
        if (analysis.occlusionRatio < 0.1) return 'text-green-400';
        if (analysis.occlusionRatio < 0.3) return 'text-yellow-400';
        if (analysis.occlusionRatio < 0.6) return 'text-orange-400';
        return 'text-red-400';
    };

    // 차폐 상태 아이콘
    const OcclusionIcon = analysis.occlusionRatio < 0.3 ? Eye : EyeOff;

    return (
        <div className="bg-zinc-900/50 rounded-lg p-3 space-y-3">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400">
                    <Layers className="w-4 h-4" />
                    <span className="text-xs font-medium">공간 분석</span>
                </div>
                <div className={`flex items-center gap-1 ${getOcclusionColor()}`}>
                    <OcclusionIcon className="w-3 h-3" />
                    <span className="text-[10px]">
                        시야 차폐 {(analysis.occlusionRatio * 100).toFixed(0)}%
                    </span>
                </div>
            </div>

            {/* 레이어별 분석 */}
            <div className="space-y-2">
                {/* 전경 */}
                <LayerSection
                    label="전경"
                    range="0-50m"
                    objects={analysis.foreground}
                    color="text-green-400"
                />

                {/* 중경 (주요 피사체) */}
                <LayerSection
                    label="중경 (피사체)"
                    range="50-500m"
                    objects={analysis.middleground}
                    color="text-amber-400"
                    isPrimary
                />

                {/* 배경 */}
                <LayerSection
                    label="배경"
                    range="500m+"
                    objects={analysis.background}
                    color="text-blue-400"
                />
            </div>

            {/* 주요 피사체 거리 */}
            {analysis.subjectDistance && (
                <div className="pt-2 border-t border-zinc-800 text-[10px]">
                    <span className="text-zinc-500">주요 피사체 거리:</span>
                    <span className="text-amber-400 ml-1">{analysis.subjectDistance}m</span>
                </div>
            )}
        </div>
    );
}

/**
 * 레이어별 물체 표시 섹션
 */
function LayerSection({
    label,
    range,
    objects,
    color,
    isPrimary = false,
}: {
    label: string;
    range: string;
    objects: Array<{ name: string; distance: number; screenPosition: string }>;
    color: string;
    isPrimary?: boolean;
}) {
    return (
        <div className={`text-[10px] ${isPrimary ? 'bg-zinc-800/50 rounded p-1.5' : ''}`}>
            <div className="flex items-center justify-between mb-0.5">
                <span className={color}>{label}</span>
                <span className="text-zinc-600">{range}</span>
            </div>
            {objects.length > 0 ? (
                <div className="text-zinc-400 space-y-0.5">
                    {objects.slice(0, 3).map((obj, i) => (
                        <div key={i} className="flex justify-between">
                            <span className="truncate max-w-[120px]">{obj.name}</span>
                            <span className="text-zinc-500">
                                {obj.distance}m · {obj.screenPosition === 'left' ? '좌' : obj.screenPosition === 'right' ? '우' : '중앙'}
                            </span>
                        </div>
                    ))}
                    {objects.length > 3 && (
                        <span className="text-zinc-600">+{objects.length - 3}개 더</span>
                    )}
                </div>
            ) : (
                <span className="text-zinc-600">없음</span>
            )}
        </div>
    );
}
