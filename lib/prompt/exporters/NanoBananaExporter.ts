// lib/exporters/NanoBananaProExporter.ts
// Nano Banana Pro 모델용 8섹션 프롬프트 Exporter

import { BaseExporter } from './BaseExporter';

import type { PromptIR, UserSettings } from '@/types';
import { getLensById } from '@/config/mappings/lenses';
import { buildLightingPrompt } from '@/config/mappings/lighting-patterns';

export class NanoBananaProExporter extends BaseExporter {
    constructor(ir: PromptIR, settings?: UserSettings) {
        super(ir, settings);
    }

    /**
     * IR을 Nano Banana Pro 8섹션 구조 프롬프트로 변환
     * [Subject] → [Fashion] → [Pose] → [Face] → [Composition] → [Lighting] → [Location] → [Tech Specs] → [Style]
     */
    export(): string {
        const sections: string[] = [];
        const subjects = this.settings.userInput?.studioSubjects || [];
        const isMultiple = subjects.length >= 2;
        const isSnap = this.settings.artDirection?.lensCharacteristicType === 'street';

        // 1. [Subject] - 외모 (성별+나이+체형+얼굴형+눈색+피부톤+머리색+헤어스타일)
        const subject = this.getSubjectSection();
        if (subject) sections.push(subject);

        // Snap 모드에서는 Fashion/Expression 생략
        if (!isSnap) {
            // 2. [Fashion] - 패션 (상의+하의+신발+악세서리)
            const fashion = this.getFashionSection();
            if (fashion) sections.push(fashion);
        }

        // 3. [Composition] - 프레이밍, 구도, 앵글
        const composition = this.getCompositionSection();
        if (composition) sections.push(composition);

        // Snap 모드에서는 Expression/Pose 생략
        if (!isSnap) {
            // 4. [Expression/Pose] - 포즈, 표정, 시선 통합
            const expressionPose = this.getExpressionPoseSection();
            if (expressionPose) sections.push(expressionPose);
        }

        // 5. [Location] - 배경
        const location = this.getLocationSection();
        if (location) sections.push(location);

        // 6. [Lighting] - 조명 설정
        const lighting = this.getLightingSection();
        if (lighting) sections.push(lighting);

        // 8. [Tech Specs] - 카메라 바디, 렌즈
        const techSpecs = this.getTechSpecsSection();
        if (techSpecs) sections.push(techSpecs);

        // 9. [Style] - 카메라/렌즈 characteristics + bokeh + vignetting
        const style = this.getStyleSection();
        if (style) sections.push(style);

        // 2명 이상일 때 섹션 사이에 빈 줄 추가
        return sections.filter(Boolean).join(isMultiple ? '\n\n' : ' ');
    }

    /**
     * [Composition] - 프레이밍(구도), 구성 규칙, 앵글
     * 문장 구조: 
     * - A 굳 classic 35mm portrait with a bust-shot framing.
     * - The subject is aligned with the rule of thirds composition.
     * - Shot from a direct eye-level angle.
     */
    private getCompositionSection(): string {
        const sentences: string[] = [];
        const isSnap = this.settings.artDirection?.lensCharacteristicType === 'street';

        // 1. 첫 번째 문장: 비율 + 프레이밍
        const aspectRatio = this.ir.slots.aspect_ratio?.content || '';

        if (isSnap) {
            // Snap 모드: 렌즈 화각 기반 framing
            const lens = getLensById(this.settings.camera.lensId);
            const snapFramingMap: Record<string, string> = {
                'ultra_wide': 'environmental wide shot',
                'wide': 'full body shot',
                'standard': 'three-quarter shot',
                'medium_telephoto': 'medium shot',
                'telephoto': 'tight medium shot',
                'macro': 'extreme close-up',
            };
            const snapFraming = snapFramingMap[lens?.category || ''] || 'medium shot';

            if (aspectRatio) {
                sentences.push(`${aspectRatio} with a ${snapFraming} framing.`);
            } else {
                sentences.push(`A ${snapFraming} framing.`);
            }

            // Snap 모드: Studio의 angle dictionary 대신 관찰자 시점
            sentences.push('shot from a natural, observational perspective');
        } else {
            // Studio 모드: 기존 로직 유지
            const framing = this.settings.userInput?.studioComposition;

            const framingMap: Record<string, string> = {
                'extreme-close-up': 'extreme close-up',
                'close-up': 'close-up',
                'bust-shot': 'bust shot',
                'waist-shot': 'waist shot',
                'half-shot': 'medium shot',
                'three-quarter-shot': 'knee shot',
                'full-shot': 'full body shot',
                'long-shot': 'long shot',
            };
            const framingText = framingMap[framing || ''] || 'standard';

            // 첫 번째 피사체의 여백(margin) 가져오기
            const subjects = this.settings.userInput?.studioSubjects || [];
            const margin = subjects?.[0]?.margin || 'normal';
            const isMultipleSubjects = subjects.length >= 2;

            // 여백에 따른 텍스트 (normal이면 추가 안함)
            const marginText = margin === 'tight' ? 'tight ' : margin === 'loose' ? 'loose ' : '';

            if (aspectRatio) {
                sentences.push(`${aspectRatio} with a ${marginText}${framingText} framing.`);
            } else if (framing) {
                sentences.push(`A ${marginText}${framingText} framing.`);
            }

            // 2. 두 번째 문장: 앵글 (Dictionary 기반 구도별 프롬프트)
            const cameraAngle = this.settings.artDirection?.cameraAngle;
            if (cameraAngle) {
                // eslint-disable-next-line @typescript-eslint/no-require-imports
                const { getPrompt, ANGLE_DICT } = require('@/lib/dictionary');
                const framing = this.settings.userInput?.studioComposition || 'half-shot';
                const anglePrompt = getPrompt(ANGLE_DICT, cameraAngle, { framing });
                if (anglePrompt) {
                    sentences.push(anglePrompt);
                }
            }

            // 3. 위치 정보: 2명 이상일 때 각 인물의 위치 표시
            if (isMultipleSubjects) {
                const positionDescriptions = subjects.map((subject, idx) => {
                    if (!subject.position || subject.position === 'center') return null;
                    const positionText = subject.position === 'left' ? 'left' : 'right';
                    return `Person ${idx + 1} is positioned on the ${positionText} side`;
                }).filter(Boolean);

                if (positionDescriptions.length > 0) {
                    sentences.push(`${positionDescriptions.join(', ')}.`);
                }
            } else if (subjects.length === 1 && subjects[0]?.position && subjects[0]?.position !== 'center') {
                // 1명일 때 기존 로직
                const positionText = subjects[0].position === 'left' ? 'left' : 'right';
                sentences.push(`The subject positioned on the ${positionText} side of the frame.`);
            }
        }

        if (sentences.length === 0) return '';
        return `[Composition] ${sentences.join(' ')}`;
    }

    /**
     * [Subject] - 외모 정보만 추출
     * 성별+나이+체형+얼굴형+눈색+피부톤+머리색+헤어스타일
     */
    private getSubjectSection(): string {
        // Snap(Street) 모드: IR 슬롯의 narrative 직접 사용
        if (this.settings.artDirection?.lensCharacteristicType === 'street') {
            const subjectContent = this.ir.slots.subject?.content || '';
            if (!subjectContent) return '';
            return `[Subject] ${subjectContent}`;
        }

        const subjects = this.settings.userInput?.studioSubjects || [];
        if (subjects.length === 0) {
            // IR에서 subject 슬롯 사용 (fallback)
            const subjectContent = this.ir.slots.subject?.content || '';
            if (!subjectContent) return '';
            return `[Subject & Fashion]\n${subjectContent}`;
        }

        const isMultiple = subjects.length >= 2;
        const descriptions = subjects.map((subject, idx) => {
            const desc = this.buildAppearanceDescription(subject, isMultiple ? idx + 1 : null);
            // 2명 이상일 때 "- Person N:" 형식
            return isMultiple ? `- ${desc}` : desc;
        });

        // 피사체가 2명 이상일 때 통합 사진 지시문 + 줄바꿈 구조
        if (isMultiple) {
            const unifiedInstruction = `Display the following ${subjects.length} people together in a single unified photograph without any dividing lines or frames.`;
            return `${unifiedInstruction}\n\n[Subject]\n${descriptions.join('\n')}`;
        }

        return `[Subject] ${descriptions.join(' ')}`;
    }

    /**
     * [Fashion] - 패션 정보 (IR 슬롯 사용)
     */
    private getFashionSection(): string {
        // IR 슬롯에서 fashion 가져오기 (StudioBuilder에서 생성)
        const fashion = this.ir.slots.fashion?.content;
        if (fashion) {
            const subjects = this.settings.userInput?.studioSubjects || [];
            const isMultiple = subjects.length >= 2;
            if (isMultiple) {
                return `[Fashion]\n${fashion}`;
            }
            return `[Fashion] ${fashion}`;
        }
        return '';
    }

    /**
     * [Expression/Pose] - 포즈, 표정, 시선 통합
     * 예: "in an elegant contrapposto pose with relaxed natural hands, a natural warm smile, and direct eye contact with the camera"
     */
    private getExpressionPoseSection(): string {
        // IR 슬롯에서 expression_pose 가져오기 (StudioBuilder에서 생성)
        const expressionPose = this.ir.slots.expression_pose?.content;
        if (expressionPose) {
            const subjects = this.settings.userInput?.studioSubjects || [];
            const isMultiple = subjects.length >= 2;
            if (isMultiple) {
                return `[Expression/Pose]\n${expressionPose}`;
            }
            return `[Expression/Pose] ${expressionPose}`;
        }
        return '';
    }

    /**
     * [Lighting] - 조명 설정
     */
    private getLightingSection(): string {
        const content = this.ir.slots.lighting?.content || '';
        if (!content) return '';
        return `[Lighting] ${content}`;
    }

    /**
     * [Location] - 배경 (IR 슬롯 사용)
     */
    private getLocationSection(): string {
        // IR 슬롯에서 location 가져오기 (StudioBuilder에서 생성)
        const location = this.ir.slots.location?.content;
        if (location) {
            return `[Location] ${location}`;
        }
        return '';
    }

    /**
     * [Tech Specs] - 카메라 바디, 렌즈, 조리개 (IR 슬롯 사용)
     */
    private getTechSpecsSection(): string {
        // IR 슬롯에서 tech_specs 가져오기 (StudioBuilder에서 생성)
        const techSpecs = this.ir.slots.tech_specs?.content;
        if (techSpecs) {
            return `[Tech Specs] ${techSpecs}`;
        }

        // Fallback: 기존 IR 슬롯 조합
        const cameraBody = this.ir.slots.camera_body?.content || '';
        const lensContent = this.ir.slots.lens?.content || '';
        if (cameraBody || lensContent) {
            return `[Tech Specs] ${[cameraBody, lensContent].filter(Boolean).join(', ')}`;
        }
        return '';
    }

    /**
     * [Style] - ISO, Shutter Speed + Photo Style 프리셋
     */
    private getStyleSection(): string {
        const parts: string[] = [];

        // 1) Photo Style (IR style 슬롯에서 가져옴)
        const styleContent = this.ir.slots.style?.content;
        if (styleContent) {
            parts.push(styleContent);
        }

        // 2) ISO (Auto가 아닌 경우만)
        const iso = this.settings.camera?.iso;
        const isoAuto = this.settings.camera?.isoAuto;
        if (iso && !isoAuto) {
            if (iso <= 400) {
                parts.push(`ISO ${iso} for clean noise-free image`);
            } else if (iso <= 1600) {
                parts.push(`ISO ${iso} for balanced noise and light sensitivity`);
            } else {
                parts.push(`ISO ${iso} for low-light conditions with visible grain`);
            }
        }

        // 3) Shutter Speed (Auto가 아닌 경우만)
        const shutterSpeed = this.settings.camera?.shutterSpeed;
        const shutterSpeedAuto = this.settings.camera?.shutterSpeedAuto;
        if (shutterSpeed && !shutterSpeedAuto) {
            const speedMatch = shutterSpeed.match(/1\/(\d+)/);
            if (speedMatch) {
                const speed = parseInt(speedMatch[1]);
                if (speed >= 500) {
                    parts.push(`${shutterSpeed}s shutter speed freezing all motion`);
                } else if (speed >= 125) {
                    parts.push(`${shutterSpeed}s shutter speed for sharp handheld shots`);
                } else {
                    parts.push(`${shutterSpeed}s shutter speed allowing some motion blur`);
                }
            } else if (shutterSpeed.includes('"')) {
                parts.push(`${shutterSpeed} long exposure for smooth motion effects`);
            }
        }

        if (parts.length === 0) return '';
        return `[Style] ${parts.join('. ')}.`;
    }

    /**
     * 프롬프트 메타데이터 반환
     */
    getMetadata(): {
        totalTokens: number;
        slotBreakdown: Record<string, number>;
        warnings: string[];
    } {
        const slotBreakdown: Record<string, number> = {};
        let totalTokens = 0;

        for (const [slotId, slot] of Object.entries(this.ir.slots)) {
            slotBreakdown[slotId] = slot.tokens;
            totalTokens += slot.tokens;
        }

        const warnings: string[] = [];
        if (totalTokens > 1500) {
            warnings.push(`프롬프트가 권장 길이(1500 토큰)를 초과합니다: ${totalTokens} 토큰`);
        }

        return { totalTokens, slotBreakdown, warnings };
    }
}
