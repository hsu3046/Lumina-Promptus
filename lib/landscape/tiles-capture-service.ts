'use client';

// lib/landscape/tiles-capture-service.ts
// 3D Tiles 캡처 서비스 - 단일 CesiumJS 인스턴스로 다중 뷰 캡처

import type { CaptureSlot } from './hybrid14-capturer';

/** CesiumJS 타입 */
type CesiumType = typeof import('cesium');
type ViewerType = InstanceType<CesiumType['Viewer']>;
type TilesetType = InstanceType<CesiumType['Cesium3DTileset']>;

/**
 * 3D Tiles 캡처 서비스
 * 단일 WebGL 컨텍스트를 재사용하여 다중 뷰 캡처
 */
export class TilesCaptureService {
    private cesium: CesiumType | null = null;
    private viewer: ViewerType | null = null;
    private tileset: TilesetType | null = null;
    private container: HTMLDivElement | null = null;
    private isInitialized = false;

    /**
     * CesiumJS 초기화 (preserveDrawingBuffer 포함)
     */
    async initialize(container: HTMLDivElement): Promise<boolean> {
        if (this.isInitialized) return true;

        try {
            // WebGL 지원 확인
            const testCanvas = document.createElement('canvas');
            const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
            if (!gl) {
                console.error('[TilesCaptureService] WebGL not supported');
                return false;
            }

            // Cesium CSS 로드
            if (!document.querySelector('link[href*="cesium"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://cesium.com/downloads/cesiumjs/releases/1.123/Build/Cesium/Widgets/widgets.css';
                document.head.appendChild(link);
            }

            // Cesium JS 동적 임포트
            this.cesium = await import('cesium');

            // Cesium 경로 설정
            (window as unknown as { CESIUM_BASE_URL: string }).CESIUM_BASE_URL =
                'https://cesium.com/downloads/cesiumjs/releases/1.123/Build/Cesium/';

            const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
            if (!apiKey) {
                console.error('[TilesCaptureService] Google Maps API key not found');
                return false;
            }

            this.container = container;

            // Viewer 생성 (preserveDrawingBuffer: true 필수!)
            this.viewer = new this.cesium.Viewer(container, {
                timeline: false,
                animation: false,
                sceneModePicker: false,
                baseLayerPicker: false,
                fullscreenButton: false,
                vrButton: false,
                homeButton: false,
                navigationHelpButton: false,
                infoBox: false,
                selectionIndicator: false,
                geocoder: false,
                globe: false,
                skyBox: false,
                skyAtmosphere: false,
                // 🔑 핵심: toDataURL() 캡처를 위해 필수
                contextOptions: {
                    webgl: {
                        preserveDrawingBuffer: true,
                        alpha: true,
                    },
                },
            });

            // 화면 크기 설정
            this.viewer.canvas.style.width = '640px';
            this.viewer.canvas.style.height = '640px';

            // 3D Tiles 로드
            try {
                this.tileset = await this.cesium.Cesium3DTileset.fromUrl(
                    `https://tile.googleapis.com/v1/3dtiles/root.json?key=${apiKey}`,
                    {
                        showCreditsOnScreen: true,
                        maximumScreenSpaceError: 4, // 고해상도 타일
                    }
                );
                this.viewer.scene.primitives.add(this.tileset);
                console.log('[TilesCaptureService] 3D Tiles loaded');
            } catch (e) {
                console.error('[TilesCaptureService] Failed to load 3D Tiles:', e);
                return false;
            }

            // 하늘 효과
            try {
                this.viewer.scene.skyAtmosphere = new this.cesium.SkyAtmosphere();
                this.viewer.scene.skyAtmosphere.show = true;
            } catch (e) {
                console.warn('[TilesCaptureService] Sky atmosphere error:', e);
            }

            this.isInitialized = true;
            console.log('[TilesCaptureService] Initialized with preserveDrawingBuffer');
            return true;

        } catch (err) {
            console.error('[TilesCaptureService] Initialization failed:', err);
            return false;
        }
    }

    /**
     * 타일 로딩 완료 대기
     */
    private async waitForTilesLoaded(timeoutMs = 15000): Promise<boolean> {
        if (!this.tileset || !this.viewer) return false;

        const startTime = Date.now();

        return new Promise((resolve) => {
            const check = () => {
                if (Date.now() - startTime > timeoutMs) {
                    console.warn('[TilesCaptureService] Tile loading timeout');
                    resolve(false);
                    return;
                }

                // tilesLoaded 확인
                const pendingRequests = this.tileset?.tilesLoaded ?? false;
                if (pendingRequests) {
                    // 추가 렌더 프레임 대기
                    setTimeout(() => resolve(true), 500);
                } else {
                    requestAnimationFrame(check);
                }
            };
            check();
        });
    }

    /**
     * 단일 슬롯 캡처
     */
    async captureSlot(
        slot: CaptureSlot,
        lat: number,
        lng: number
    ): Promise<string> {
        if (!this.viewer || !this.cesium) {
            console.error('[TilesCaptureService] Not initialized');
            return '';
        }

        try {
            // 카메라 이동
            this.viewer.camera.setView({
                destination: this.cesium.Cartesian3.fromDegrees(
                    lng, lat, slot.altitude
                ),
                orientation: {
                    heading: this.cesium.Math.toRadians(slot.heading),
                    pitch: this.cesium.Math.toRadians(slot.pitch),
                    roll: 0,
                },
            });

            console.log(`[TilesCaptureService] Moving camera: slot ${slot.slot}, alt ${slot.altitude}m`);

            // 렌더링 강제 실행
            this.viewer.scene.render();

            // 타일 로딩 대기 (버드아이 뷰는 더 오래 대기)
            const waitTime = slot.type === '3d_birdseye' ? 8000 : 5000;
            await this.waitForTilesLoaded(waitTime);

            // 최종 렌더링
            this.viewer.scene.render();

            // 스크린샷 캡처
            const dataUrl = this.viewer.canvas.toDataURL('image/jpeg', 0.9);

            // 검은 화면 체크
            if (this.isBlackImage(dataUrl)) {
                console.warn(`[TilesCaptureService] Slot ${slot.slot} captured black image`);
                return '';
            }

            console.log(`[TilesCaptureService] Slot ${slot.slot} captured successfully`);
            return dataUrl;

        } catch (err) {
            console.error(`[TilesCaptureService] Slot ${slot.slot} capture error:`, err);
            return '';
        }
    }

    /**
     * 검은 이미지 감지
     */
    private isBlackImage(dataUrl: string): boolean {
        // 매우 작은 base64는 검은 이미지일 가능성 높음
        const base64 = dataUrl.split(',')[1] || '';
        return base64.length < 1000;
    }

    /**
     * 다중 슬롯 순차 캡처
     */
    async captureMultipleSlots(
        slots: CaptureSlot[],
        lat: number,
        lng: number,
        onProgress?: (slotIndex: number, total: number) => void
    ): Promise<string[]> {
        const results: string[] = [];

        for (let i = 0; i < slots.length; i++) {
            const slot = slots[i];

            // 3D 타입만 처리 (Street View는 별도)
            if (slot.type === 'streetview') {
                results.push(''); // Street View는 별도 처리
                continue;
            }

            onProgress?.(i, slots.length);

            const image = await this.captureSlot(slot, lat, lng);
            results.push(image);

            // 다음 캡처 전 약간의 딜레이
            await new Promise(r => setTimeout(r, 300));
        }

        return results;
    }

    /**
     * 리소스 정리
     */
    destroy(): void {
        if (this.viewer) {
            try {
                this.viewer.destroy();
            } catch (e) {
                console.warn('[TilesCaptureService] Destroy error:', e);
            }
            this.viewer = null;
        }
        this.tileset = null;
        this.cesium = null;
        this.isInitialized = false;
        console.log('[TilesCaptureService] Destroyed');
    }

    /**
     * 초기화 상태 확인
     */
    get initialized(): boolean {
        return this.isInitialized;
    }
}

// 싱글톤 인스턴스
let captureServiceInstance: TilesCaptureService | null = null;

export function getTilesCaptureService(): TilesCaptureService {
    if (!captureServiceInstance) {
        captureServiceInstance = new TilesCaptureService();
    }
    return captureServiceInstance;
}

export function destroyTilesCaptureService(): void {
    if (captureServiceInstance) {
        captureServiceInstance.destroy();
        captureServiceInstance = null;
    }
}
