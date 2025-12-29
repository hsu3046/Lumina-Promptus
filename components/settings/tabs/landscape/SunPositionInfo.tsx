'use client';

import { useMemo } from 'react';
import { Sun, Moon, Sunrise, Sunset } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import {
    calculateSunPosition,
    calculateShadowInfo,
    getTimeOfDayLabel,
} from '@/lib/landscape/sun-calculator';

/**
 * 현재 좌표와 시간에 따른 태양/그림자 정보를 표시하는 컴포넌트
 */
export function SunPositionInfo() {
    const { settings } = useSettingsStore();
    const { location } = settings.landscape;

    const sunData = useMemo(() => {
        const lat = location?.coordinates?.lat ?? 0;
        const lng = location?.coordinates?.lng ?? 0;
        const now = new Date();

        const sunPos = calculateSunPosition(lat, lng, now);
        const shadow = calculateShadowInfo(sunPos);
        const timeLabel = getTimeOfDayLabel(lat, lng, now);

        return {
            sunPos,
            shadow,
            timeLabel,
            lat,
            lng,
        };
    }, [location?.coordinates?.lat, location?.coordinates?.lng]);

    // 시간대에 따른 아이콘 선택
    const getTimeIcon = () => {
        switch (sunData.timeLabel) {
            case 'Sunrise':
                return <Sunrise className="w-4 h-4 text-orange-400" />;
            case 'Sunset':
                return <Sunset className="w-4 h-4 text-orange-500" />;
            case 'Night':
            case 'Blue Hour':
                return <Moon className="w-4 h-4 text-blue-400" />;
            default:
                return <Sun className="w-4 h-4 text-yellow-400" />;
        }
    };

    // 태양 고도에 따른 색상
    const getAltitudeColor = () => {
        const alt = sunData.sunPos.altitudeDeg;
        if (alt < 0) return 'text-blue-400';
        if (alt < 10) return 'text-orange-400';
        if (alt < 30) return 'text-yellow-400';
        return 'text-yellow-300';
    };

    // 그림자 방향을 한글로 변환
    const getShadowDirectionKorean = () => {
        const dir = sunData.shadow.direction;
        if (dir >= 337.5 || dir < 22.5) return '북쪽';
        if (dir >= 22.5 && dir < 67.5) return '북동쪽';
        if (dir >= 67.5 && dir < 112.5) return '동쪽';
        if (dir >= 112.5 && dir < 157.5) return '남동쪽';
        if (dir >= 157.5 && dir < 202.5) return '남쪽';
        if (dir >= 202.5 && dir < 247.5) return '남서쪽';
        if (dir >= 247.5 && dir < 292.5) return '서쪽';
        return '북서쪽';
    };

    return (
        <div className="bg-zinc-900/50 rounded-lg p-3 space-y-2">
            {/* 헤더: 시간대 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {getTimeIcon()}
                    <span className="text-xs font-medium text-zinc-300">
                        {sunData.timeLabel}
                    </span>
                </div>
                <span className="text-[10px] text-zinc-500">
                    {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>

            {/* 태양 위치 */}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div>
                    <span className="text-zinc-500">태양 고도</span>
                    <p className={`font-mono ${getAltitudeColor()}`}>
                        {sunData.sunPos.altitudeDeg.toFixed(1)}°
                    </p>
                </div>
                <div>
                    <span className="text-zinc-500">태양 방위</span>
                    <p className="font-mono text-zinc-300">
                        {sunData.sunPos.azimuthDeg.toFixed(1)}°
                    </p>
                </div>
            </div>

            {/* 그림자 정보 (태양이 지평선 위일 때만) */}
            {sunData.shadow.isVisible && (
                <div className="pt-2 border-t border-zinc-800">
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div>
                            <span className="text-zinc-500">그림자 방향</span>
                            <p className="text-zinc-300">
                                {getShadowDirectionKorean()} ({sunData.shadow.direction.toFixed(0)}°)
                            </p>
                        </div>
                        <div>
                            <span className="text-zinc-500">그림자 길이</span>
                            <p className="text-zinc-300">
                                건물 높이의 {sunData.shadow.lengthRatio.toFixed(1)}배
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* 밤일 때 안내 */}
            {!sunData.shadow.isVisible && (
                <p className="text-[10px] text-zinc-500 pt-1">
                    🌙 현재 야간 - 인공 조명이 필요합니다
                </p>
            )}
        </div>
    );
}
