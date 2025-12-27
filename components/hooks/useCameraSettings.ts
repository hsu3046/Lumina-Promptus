'use client';

import { useMemo } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import {
    TARGET_EV_BY_CHARACTERISTIC,
    calculateEV,
    getEVDifference,
    getExposureStatus,
    calculateAutoAperture,
    calculateAutoShutterSpeed,
    calculateAutoISO,
} from '@/lib/exposure-calculator';
import { getCameraById } from '@/config/mappings/cameras';
import { getLensById } from '@/config/mappings/lenses';

// 조리개, 셔터스피드, ISO 스톱 배열
const APERTURE_STOPS = [
    'f/1.2', 'f/1.4', 'f/1.8', 'f/2', 'f/2.8', 'f/4', 'f/5.6', 'f/8', 'f/11', 'f/16', 'f/22',
];

const SHUTTER_STOPS = [
    '30', '15', '8', '4', '2', '1', '1/2', '1/4', '1/8', '1/15', '1/30', '1/60',
    '1/125', '1/250', '1/500', '1/1000', '1/2000', '1/4000', '1/8000',
];

const ISO_STOPS = [50, 100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600];

export interface ExposureInfo {
    currentEV: number;
    targetEV: number;
    difference: number;
    status: 'overexposed' | 'underexposed' | 'normal';
}

export function useCameraSettings() {
    const { settings, updateCamera } = useSettingsStore();
    const { camera, artDirection } = settings;

    // 현재 선택된 카메라/렌즈 정보
    const selectedCamera = useMemo(() => getCameraById(camera.bodyId), [camera.bodyId]);
    const selectedLens = useMemo(() => getLensById(camera.lensId), [camera.lensId]);

    // 렌즈에 따른 조리개 범위 필터링
    const apertureStops = useMemo(() => {
        if (!selectedLens) return APERTURE_STOPS;
        const maxIdx = APERTURE_STOPS.indexOf(selectedLens.maxAperture);
        return maxIdx >= 0 ? APERTURE_STOPS.slice(maxIdx) : APERTURE_STOPS;
    }, [selectedLens]);

    // 노출 계산
    const exposureInfo: ExposureInfo = useMemo(() => {
        const currentEV = calculateEV(camera.aperture, camera.shutterSpeed, camera.iso);
        const targetEV = TARGET_EV_BY_CHARACTERISTIC[artDirection.lensCharacteristicType] || 12;
        const difference = getEVDifference(camera.aperture, camera.shutterSpeed, camera.iso, targetEV);
        const status = getExposureStatus(difference);
        return { currentEV, targetEV, difference, status };
    }, [camera.aperture, camera.shutterSpeed, camera.iso, artDirection.lensCharacteristicType]);

    // Auto 토글 핸들러
    const handleAutoToggle = (type: 'aperture' | 'shutter' | 'iso') => {
        const { aperture, shutterSpeed, iso, apertureAuto, shutterSpeedAuto, isoAuto } = camera;
        const targetEV = TARGET_EV_BY_CHARACTERISTIC[artDirection.lensCharacteristicType] || 12;

        switch (type) {
            case 'aperture':
                if (!apertureAuto) {
                    // calculateAutoAperture(targetEV, shutterSpeed, iso, apertureStops)
                    const autoAperture = calculateAutoAperture(targetEV, shutterSpeed, iso, apertureStops);
                    updateCamera({ apertureAuto: true, aperture: autoAperture });
                } else {
                    updateCamera({ apertureAuto: false });
                }
                break;
            case 'shutter':
                if (!shutterSpeedAuto) {
                    // calculateAutoShutterSpeed(targetEV, aperture, iso, shutterStops)
                    const autoShutter = calculateAutoShutterSpeed(targetEV, aperture, iso, SHUTTER_STOPS);
                    updateCamera({ shutterSpeedAuto: true, shutterSpeed: autoShutter });
                } else {
                    updateCamera({ shutterSpeedAuto: false });
                }
                break;
            case 'iso':
                if (!isoAuto) {
                    // calculateAutoISO(targetEV, aperture, shutterSpeed, isoStops)
                    const autoISO = calculateAutoISO(targetEV, aperture, shutterSpeed, ISO_STOPS);
                    updateCamera({ isoAuto: true, iso: autoISO });
                } else {
                    updateCamera({ isoAuto: false });
                }
                break;
        }
    };

    // 수동 값 변경 핸들러
    const handleManualChange = (type: 'aperture' | 'shutter' | 'iso', value: string | number) => {
        const { apertureAuto, shutterSpeedAuto, isoAuto } = camera;
        const targetEV = TARGET_EV_BY_CHARACTERISTIC[artDirection.lensCharacteristicType] || 12;

        switch (type) {
            case 'aperture':
                updateCamera({ aperture: value as string });
                if (shutterSpeedAuto) {
                    const autoShutter = calculateAutoShutterSpeed(targetEV, value as string, camera.iso, SHUTTER_STOPS);
                    updateCamera({ shutterSpeed: autoShutter });
                } else if (isoAuto) {
                    const autoISO = calculateAutoISO(targetEV, value as string, camera.shutterSpeed, ISO_STOPS);
                    updateCamera({ iso: autoISO });
                }
                break;
            case 'shutter':
                updateCamera({ shutterSpeed: value as string });
                if (apertureAuto) {
                    const autoAperture = calculateAutoAperture(targetEV, value as string, camera.iso, apertureStops);
                    updateCamera({ aperture: autoAperture });
                } else if (isoAuto) {
                    const autoISO = calculateAutoISO(targetEV, camera.aperture, value as string, ISO_STOPS);
                    updateCamera({ iso: autoISO });
                }
                break;
            case 'iso':
                updateCamera({ iso: value as number });
                if (apertureAuto) {
                    const autoAperture = calculateAutoAperture(targetEV, camera.shutterSpeed, value as number, apertureStops);
                    updateCamera({ aperture: autoAperture });
                } else if (shutterSpeedAuto) {
                    const autoShutter = calculateAutoShutterSpeed(targetEV, camera.aperture, value as number, SHUTTER_STOPS);
                    updateCamera({ shutterSpeed: autoShutter });
                }
                break;
        }
    };

    return {
        camera,
        settings,
        selectedCamera,
        selectedLens,
        apertureStops,
        shutterStops: SHUTTER_STOPS,
        isoStops: ISO_STOPS,
        exposureInfo,
        handleAutoToggle,
        handleManualChange,
        updateCamera,
    };
}
