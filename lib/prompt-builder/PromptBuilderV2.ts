// lib/prompt-builder/PromptBuilderV2.ts
// IR(Intermediate Representation) 기반 프롬프트 빌더

import type { PromptIR, SlotContent, UserSettings, ConflictReport } from '@/types';
import { PROMPT_SLOTS, getSlotById } from '@/config/slots/slot-definitions';
import { getCameraById } from '@/config/mappings/cameras';
import { getLensById } from '@/config/mappings/lenses';
import { getLightingPatternById, getTimeOfDayPresetById, LIGHT_QUALITIES, LIGHTING_RATIO_PRESETS } from '@/config/mappings/lighting-patterns';
import { detectConflicts } from '@/lib/conflict-resolver/rules';

export class PromptBuilderV2 {
    private ir: PromptIR;
    private settings: UserSettings;

    constructor(settings: UserSettings) {
        this.settings = settings;
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
     * Phase 1: IR 생성 (메인 진입점)
     */
    async buildIR(): Promise<PromptIR> {
        // 1. 결정론적 슬롯 채우기
        this.fillDeterministicSlots();

        // 2. 충돌 감지 (AI 정제 전 1차)
        this.ir.metadata.conflicts = detectConflicts(this.ir);

        // 3. 가중치 및 우선순위 적용
        this.applyPriorities();

        return this.ir;
    }

    // ===== 결정론적 슬롯 =====

    private fillDeterministicSlots(): void {
        // 메타 토큰
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

        // 카메라 설정 (ISO, 조리개, 셔터스피드)
        this.setSlot('camera_settings', this.getCameraSettings(), {
            priority: 8,
            source: 'deterministic',
            locked: false
        });

        // 조명
        this.setSlot('lighting', this.getLighting(), {
            priority: 8,
            source: 'deterministic',
            locked: false
        });

        // 구도
        this.setSlot('composition', this.getComposition(), {
            priority: 5,
            source: 'deterministic',
            locked: false
        });

        // 품질 키워드
        this.setSlot('quality', this.getQualityKeywords(), {
            priority: 4,
            source: 'deterministic',
            locked: false
        });

        // 네거티브 프롬프트
        this.setSlot('negative', this.getNegativePrompt(), {
            priority: 10,
            source: 'deterministic',
            locked: false
        });

        // 피사체 (사용자 입력)
        if (this.settings.userInput.subjectDescription) {
            this.setSlot('subject', this.settings.userInput.subjectDescription, {
                priority: 9,
                source: 'user_direct',
                locked: false
            });
        }

        // 스타일/분위기 (사용자 입력)
        if (this.settings.userInput.moodDescription) {
            this.setSlot('style', this.settings.userInput.moodDescription, {
                priority: 6,
                source: 'user_direct',
                locked: false
            });
        }
    }

    // ===== 개별 슬롯 생성 메서드 =====

    private getMetaTokens(): string {
        const camera = getCameraById(this.settings.camera.bodyId);
        return camera?.metaToken || '';
    }

    private getCameraBody(): string {
        const camera = getCameraById(this.settings.camera.bodyId);
        return camera?.promptKeywords || '';
    }

    private getLens(): string {
        const lens = getLensById(this.settings.camera.lensId);
        return lens?.promptKeywords || '';
    }

    private getCameraSettings(): string {
        const { iso, aperture, shutterSpeed, whiteBalance } = this.settings.camera;
        const parts: string[] = [];

        // ISO
        if (iso) {
            parts.push(`ISO ${iso}`);
            if (iso > 800) {
                parts.push('visible grain');
            } else if (iso <= 200) {
                parts.push('clean low noise image');
            }
        }

        // 조리개
        if (aperture) {
            parts.push(`${aperture} aperture`);
            const fNumber = parseFloat(aperture.replace('f/', ''));
            if (fNumber <= 2.0) {
                parts.push('shallow depth of field, beautiful bokeh');
            } else if (fNumber >= 8) {
                parts.push('deep depth of field, everything in focus');
            }
        }

        // 셔터스피드
        if (shutterSpeed) {
            parts.push(`${shutterSpeed}s shutter speed`);
            if (shutterSpeed.includes('/') && parseInt(shutterSpeed.split('/')[1]) < 60) {
                parts.push('motion blur');
            } else if (shutterSpeed.includes('/') && parseInt(shutterSpeed.split('/')[1]) >= 500) {
                parts.push('frozen motion, sharp action');
            }
        }

        // 색온도
        if (whiteBalance) {
            if (whiteBalance < 4000) {
                parts.push(`warm ${whiteBalance}K color temperature`);
            } else if (whiteBalance > 6000) {
                parts.push(`cool ${whiteBalance}K color temperature`);
            } else {
                parts.push(`neutral ${whiteBalance}K daylight white balance`);
            }
        }

        return parts.join(', ');
    }

    private getLighting(): string {
        const parts: string[] = [];

        // 조명 패턴
        const pattern = getLightingPatternById(this.settings.lighting.patternId);
        if (pattern) {
            parts.push(pattern.promptKeywords);
        }

        // 광질
        const quality = LIGHT_QUALITIES.find(q => q.id === this.settings.lighting.quality);
        if (quality) {
            parts.push(quality.promptKeywords);
        }

        // 색온도/시간대
        if (this.settings.lighting.timeOfDay) {
            const timePreset = getTimeOfDayPresetById(this.settings.lighting.timeOfDay);
            if (timePreset) {
                parts.push(timePreset.promptKeywords);
            }
        }

        // Key:Fill:Back 비율
        if (this.settings.lighting.keyFillBackRatio) {
            const ratioPreset = LIGHTING_RATIO_PRESETS.find(
                r => r.ratio === this.settings.lighting.keyFillBackRatio
            );
            if (ratioPreset) {
                parts.push(ratioPreset.promptKeywords);
            }
        }

        return parts.join(', ');
    }

    private getComposition(): string {
        const parts: string[] = [];

        if (this.settings.artDirection.compositionRule) {
            const compositionMap: Record<string, string> = {
                'rule_of_thirds': 'rule of thirds composition',
                'golden_ratio': 'golden ratio composition, fibonacci spiral',
                'center': 'centered composition, symmetrical framing',
                'leading_lines': 'leading lines composition, visual flow',
                'symmetry': 'perfect symmetry, mirror composition'
            };
            parts.push(compositionMap[this.settings.artDirection.compositionRule] || '');
        }

        if (this.settings.artDirection.cameraAngle) {
            const angleMap: Record<string, string> = {
                'eye_level': 'eye level angle, straight-on view',
                'high_angle': 'high angle shot, looking down',
                'low_angle': 'low angle shot, looking up, heroic perspective',
                'birds_eye': 'bird\'s eye view, top-down perspective',
                'worms_eye': 'worm\'s eye view, extreme low angle'
            };
            parts.push(angleMap[this.settings.artDirection.cameraAngle] || '');
        }

        if (this.settings.artDirection.shotType) {
            const shotMap: Record<string, string> = {
                'close_up': 'close-up shot, face detail',
                'medium': 'medium shot, waist up',
                'full_body': 'full body shot, entire figure',
                'wide': 'wide shot, environment context',
                'extreme_close_up': 'extreme close-up, macro detail'
            };
            parts.push(shotMap[this.settings.artDirection.shotType] || '');
        }

        return parts.filter(Boolean).join(', ');
    }

    private getQualityKeywords(): string {
        const levelMap: Record<string, string> = {
            'standard': 'professional photography, high quality',
            'high': 'professional photography, high detail, sharp focus, award-winning photograph, exceptional quality',
            'premium': 'professional photography, ultra high detail, tack sharp focus, award-winning photograph, gallery quality, exceptional resolution'
        };

        return levelMap[this.settings.quality.level] || levelMap['standard'];
    }

    private getNegativePrompt(): string {
        const baseNegatives = [
            'blurry', 'out of focus', 'low quality', 'low resolution',
            'oversaturated', 'overexposed', 'underexposed', 'noise',
            'artifacts', 'distortion', 'watermark', 'text', 'logo'
        ];

        // 사용자 커스텀 네거티브 추가
        const allNegatives = [...baseNegatives, ...this.settings.quality.customNegatives];

        // 중복 제거
        return [...new Set(allNegatives)].join(', ');
    }

    // ===== 우선순위 적용 =====

    private applyPriorities(): void {
        // 총 토큰 수 계산
        const totalTokens = Object.values(this.ir.slots)
            .filter(slot => slot.slotId !== 'negative')
            .reduce((sum, slot) => sum + slot.tokens, 0);

        // 1500 토큰 초과 시 낮은 우선순위 슬롯 트리밍
        if (totalTokens > 1500) {
            this.trimLowPrioritySlots(1500);
        }
    }

    private trimLowPrioritySlots(targetTokens: number): void {
        // 우선순위 낮은 순으로 정렬
        const sortedSlots = Object.values(this.ir.slots)
            .filter(slot => slot.slotId !== 'negative' && !slot.locked)
            .sort((a, b) => a.priority - b.priority);

        let currentTotal = Object.values(this.ir.slots)
            .filter(slot => slot.slotId !== 'negative')
            .reduce((sum, slot) => sum + slot.tokens, 0);

        for (const slot of sortedSlots) {
            if (currentTotal <= targetTokens) break;

            // 슬롯 내용 축소 또는 제거
            this.ir.metadata.warnings.push(
                `토큰 예산 초과로 "${slot.slotId}" 슬롯이 축소될 수 있습니다`
            );
        }
    }

    // ===== 유틸리티 =====

    private setSlot(
        slotId: string,
        content: string,
        options: {
            priority: number;
            source: SlotContent['source'];
            locked: boolean;
        }
    ): void {
        if (!content) return;

        this.ir.slots[slotId] = {
            slotId,
            content,
            priority: options.priority,
            tokens: this.estimateTokens(content),
            source: options.source,
            locked: options.locked
        };
    }

    private estimateTokens(text: string): number {
        // 대략적인 토큰 추정 (단어 수 * 1.3)
        return Math.ceil(text.split(/\s+/).length * 1.3);
    }

    // ===== Getter =====

    getIR(): PromptIR {
        return this.ir;
    }
}
