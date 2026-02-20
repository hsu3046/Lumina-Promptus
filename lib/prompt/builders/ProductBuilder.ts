// lib/prompt/builders/ProductBuilder.ts
// 제품 촬영 모드 전용 IR Builder
// StudioBuilder 패턴을 기반으로, 피사체를 물건으로 특화

import type { PromptIR, UserSettings } from '@/types';
import type { ProductSettings } from '@/types/product.types';
import { getCameraById, getCameraTypeLabel } from '@/config/mappings/cameras';
import { getLensById } from '@/config/mappings/lenses';
import { buildLightingPrompt } from '@/config/mappings/lighting-patterns';
import { detectConflicts } from '@/lib/rules/conflict-resolver';
import {
    SURFACE_PROMPT_MAP,
    MATERIAL_PROMPT_MAP,
    SHOT_TYPE_PROMPT_MAP,
    CATEGORY_PROMPT_MAP,
} from '@/config/mappings/product-options';


export class ProductBuilder {
    private ir: PromptIR;
    private settings: UserSettings;
    private product: ProductSettings;

    constructor(settings: UserSettings) {
        this.settings = settings;
        this.product = settings.product!;
        this.ir = {
            slots: {},
            metadata: {
                conflicts: [],
                warnings: [],
                suggestions: []
            },
            version: '2.0',
            timestamp: Date.now()
        };
    }

    /**
     * IR 생성 (메인 진입점)
     */
    async buildIR(): Promise<PromptIR> {
        this.fillSlots();
        this.ir.metadata.conflicts = detectConflicts(this.ir);
        return this.ir;
    }

    // ===== 슬롯 채우기 =====

    private fillSlots(): void {
        // 카메라 메타 토큰
        this.setSlot('meta_tokens', this.getMetaTokens(), {
            priority: 10,
            source: 'deterministic',
            locked: true
        });

        // 카메라 바디
        this.setSlot('camera_body', this.getCameraBody(), {
            priority: 9,
            source: 'deterministic',
            locked: true
        });

        // 렌즈
        this.setSlot('lens', this.getLens(), {
            priority: 9,
            source: 'deterministic',
            locked: true
        });

        // 카메라 설정 (ISO, WB, 셔터)
        this.setSlot('camera_settings', this.getCameraSettings(), {
            priority: 8,
            source: 'deterministic',
            locked: false
        });

        // 비율
        this.setSlot('aspect_ratio', this.getAspectRatio(), {
            priority: 7,
            source: 'deterministic',
            locked: false
        });

        // 라이팅
        this.setSlot('lighting', this.getLighting(), {
            priority: 8,
            source: 'deterministic',
            locked: false
        });

        // 제품 피사체
        this.setSlot('subject', this.buildProductSubject(), {
            priority: 9,
            source: 'deterministic',
            locked: false
        });

        // 제품 구도
        this.setSlot('composition', this.buildComposition(), {
            priority: 7,
            source: 'deterministic',
            locked: false
        });

        // 배경/서페이스
        this.setSlot('location', this.buildSurface(), {
            priority: 7,
            source: 'deterministic',
            locked: false
        });

        // 스타일/소품
        this.setSlot('style', this.buildStyle(), {
            priority: 6,
            source: 'deterministic',
            locked: false
        });
    }

    // ===== 제품 전용 슬롯 =====

    /**
     * 제품 피사체 설명 빌드
     */
    private buildProductSubject(): string {
        const parts: string[] = [];

        parts.push('Commercial product photograph');

        // 카테고리 힌트
        const categoryHint = CATEGORY_PROMPT_MAP[this.product.category];
        if (categoryHint) parts.push(categoryHint);

        // 제품명
        if (this.product.productName) {
            parts.push(`of a ${this.product.productName}`);
        }

        // 재질
        const materialDesc = MATERIAL_PROMPT_MAP[this.product.material];
        if (materialDesc) parts.push(materialDesc);

        return parts.filter(Boolean).join(', ');
    }

    /**
     * 제품 구도 빌드
     */
    private buildComposition(): string {
        const shotDesc = SHOT_TYPE_PROMPT_MAP[this.product.shotType];
        return shotDesc || '';
    }

    /**
     * 서페이스/배경 빌드
     */
    private buildSurface(): string {
        const surfaceDesc = SURFACE_PROMPT_MAP[this.product.surface];
        return surfaceDesc || '';
    }

    /**
     * 스타일/소품 빌드
     */
    private buildStyle(): string {
        const parts: string[] = [];

        // 소품 (사용자 입력)
        if (this.product.props) {
            parts.push(`styled with ${this.product.props}`);
        }

        // 제품 사진 공통 지시문
        parts.push('professional commercial lighting, high-end product photography, sharp focus on product');

        // Photo Style 프리셋 (스튜디오와 공유)
        const photoStyleId = this.settings.artDirection?.photoStyleId;
        if (photoStyleId) {
            const { getStyleById } = require('@/config/mappings/photo-styles');
            const photoStyle = getStyleById(photoStyleId);
            if (photoStyle) {
                parts.push(photoStyle.promptTokens);
            }
        }

        return parts.join(', ');
    }

    // ===== 공통 슬롯 (카메라/렌즈 — StudioBuilder와 동일) =====

    private getMetaTokens(): string {
        const camera = getCameraById(this.settings.camera.bodyId);
        return camera?.metaToken || '';
    }

    private getCameraBody(): string {
        const camera = getCameraById(this.settings.camera.bodyId);
        return camera?.metaToken || '';
    }

    private getLens(): string {
        const lens = getLensById(this.settings.camera.lensId);
        if (!lens) return '';

        const parts: string[] = [];
        const categoryMap: Record<string, string> = {
            ultra_wide: 'ultra wide',
            wide: 'wide',
            standard: 'standard',
            medium_telephoto: 'medium telephoto',
            telephoto: 'telephoto',
            macro: 'macro'
        };
        if (lens.focalLength && lens.category && categoryMap[lens.category]) {
            parts.push(`${lens.focalLength} ${categoryMap[lens.category]} lens`);
        } else if (lens.focalLength) {
            parts.push(`${lens.focalLength} lens`);
        }

        // 제품 사진에서는 선명도 우선
        const charKeywords = lens.characteristic;
        if (charKeywords) parts.push(charKeywords);

        return parts.join(', ');
    }

    private getLighting(): string {
        if (!this.settings.lighting.enabled) return '';
        return buildLightingPrompt(this.settings.lighting);
    }

    private getCameraSettings(): string {
        const { iso, shutterSpeed, whiteBalance, isoAuto, shutterSpeedAuto } = this.settings.camera;
        const parts: string[] = [];

        if (!isoAuto && iso) {
            if (iso <= 200) parts.push('clean, noise-free image');
            else if (iso <= 800) parts.push('subtle film grain');
            else parts.push('visible grain');
        }

        if (whiteBalance) {
            if (whiteBalance <= 3500) parts.push('warm golden tones');
            else if (whiteBalance <= 5000) parts.push('neutral balanced colors');
            else if (whiteBalance <= 6500) parts.push('daylight white balance');
            else parts.push('cool blue tint');
        }

        if (!shutterSpeedAuto && shutterSpeed) {
            const shutterNum = this.parseShutterSpeed(shutterSpeed);
            if (shutterNum <= 1 / 15) parts.push('motion blur, long exposure');
            else if (shutterNum >= 1 / 250) parts.push('frozen motion, sharp');
        }

        return parts.join(', ');
    }

    private getAspectRatio(): string {
        const { aspectRatio } = this.settings.camera;
        if (!aspectRatio) return '';

        const camera = getCameraById(this.settings.camera.bodyId);
        const cameraType = camera ? getCameraTypeLabel(camera.mount) : 'DSLR';

        const ratioPrompts: Record<string, string> = {
            '2:3': `A 2:3 ratio ${cameraType} portrait`,
            '3:4': 'A 3:4 ratio portrait',
            '9:16': 'A 9:16 smartphone portrait',
            '4:5': 'A 4:5 ratio large format portrait',
            '3:2': `A 3:2 ratio ${cameraType} photograph, landscape orientation`,
            '4:3': 'A 4:3 ratio photograph, landscape orientation',
            '16:9': 'A 16:9 cinematic widescreen photograph, landscape orientation',
            '5:4': 'A 5:4 ratio large format photograph, landscape orientation',
            '1:1': 'A 1:1 square format photograph',
        };

        return ratioPrompts[aspectRatio] || `A ${aspectRatio} format`;
    }

    // ===== 유틸리티 =====

    private parseShutterSpeed(shutter: string): number {
        if (shutter.startsWith('1/')) return 1 / parseInt(shutter.replace('1/', ''));
        return parseFloat(shutter);
    }

    private setSlot(id: string, content: string, options: {
        priority: number;
        source: string;
        locked: boolean;
    }): void {
        if (!content) return;
        this.ir.slots[id] = {
            slotId: id,
            content,
            priority: options.priority,
            tokens: content.split(/\s+/).length,
            source: options.source as 'deterministic' | 'ai_refined' | 'user_direct',
            locked: options.locked,
        };
    }
}
