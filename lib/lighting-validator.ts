// lib/lighting-validator.ts
// 조명 설정 검증 로직

import type {
    LightingConfig,
    ValidationResult,
    LightingPattern,
    LightingKey,
    LightingRatio,
    SpecialLighting
} from '@/types/lighting.types';

import {
    LIGHTING_CONFLICTS,
    RECOMMENDED_COMBINATIONS
} from '@/config/lighting-rules';

export class LightingValidator {
    /**
     * 전체 조명 설정 검증
     */
    static validate(config: LightingConfig): ValidationResult {
        const result: ValidationResult = {
            isValid: true,
            errors: [],
            warnings: [],
            suggestions: []
        };

        // 1. Pattern + Key 충돌 체크
        this.checkPatternKeyConflict(config, result);

        // 2. Key + Ratio 충돌 체크
        this.checkKeyRatioConflict(config, result);

        // 3. Pattern + Ratio 충돌 체크
        this.checkPatternRatioConflict(config, result);

        // 4. Special + Pattern/Key 충돌 체크
        this.checkSpecialConflict(config, result);

        // 5. Special 간 충돌 체크 (NEW)
        this.checkSpecialToSpecialConflict(config, result);

        // 6. Special 개수 제한 체크 (NEW)
        this.checkSpecialCountLimit(config, result);

        // 7. Quality 충돌 체크
        this.checkQualityConflict(config, result);

        // 8. ColorTemp + Mood 충돌 체크
        this.checkColorMoodConflict(config, result);

        // 9. TimeBase 충돌 체크
        this.checkTimeConflict(config, result);

        // 10. ColorTemp + TimeBase 충돌 체크 (NEW)
        this.checkColorTempTimeConflict(config, result);

        // 11. ColorTemp + TimeBase 경고 체크 (NEW)
        this.checkColorTempTimeWarning(config, result);

        // 12. 권장 조합과 비교
        this.addRecommendations(config, result);

        // 에러가 있으면 invalid
        result.isValid = result.errors.length === 0;

        return result;
    }

    private static checkPatternKeyConflict(
        config: LightingConfig,
        result: ValidationResult
    ): void {
        const conflict = LIGHTING_CONFLICTS.patternKeyConflicts.find(
            c => c.pattern === config.pattern && c.key === config.key
        );

        if (conflict) {
            result.errors.push(conflict.reason);
            result.suggestions.push(conflict.suggestion);
        }
    }

    private static checkKeyRatioConflict(
        config: LightingConfig,
        result: ValidationResult
    ): void {
        if (!config.ratio) return;

        const conflict = LIGHTING_CONFLICTS.keyRatioConflicts.find(
            c => c.key === config.key && c.ratios.includes(config.ratio!)
        );

        if (conflict) {
            result.errors.push(conflict.reason);
            result.suggestions.push(conflict.suggestion);
        }
    }

    private static checkPatternRatioConflict(
        config: LightingConfig,
        result: ValidationResult
    ): void {
        if (!config.ratio) return;

        const conflict = LIGHTING_CONFLICTS.patternRatioConflicts.find(
            c => c.pattern === config.pattern && c.ratios.includes(config.ratio!)
        );

        if (conflict) {
            result.warnings.push(conflict.reason);
            result.suggestions.push(conflict.suggestion);
        }
    }

    private static checkSpecialConflict(
        config: LightingConfig,
        result: ValidationResult
    ): void {
        if (!config.special || config.special.length === 0) return;

        config.special.forEach(special => {
            // Key 충돌
            const keyConflict = LIGHTING_CONFLICTS.specialConflicts.find(
                c => c.key === config.key && c.specials?.includes(special)
            );

            if (keyConflict) {
                result.errors.push(keyConflict.reason);
                result.suggestions.push(keyConflict.suggestion);
            }

            // Pattern 충돌
            const patternConflict = LIGHTING_CONFLICTS.specialConflicts.find(
                c => c.pattern === config.pattern && c.specials?.includes(special)
            );

            if (patternConflict) {
                result.errors.push(patternConflict.reason);
                result.suggestions.push(patternConflict.suggestion);
            }
        });
    }

    /**
     * Special 간 충돌 체크 (NEW)
     */
    private static checkSpecialToSpecialConflict(
        config: LightingConfig,
        result: ValidationResult
    ): void {
        if (!config.special || config.special.length < 2) return;

        const conflicts = LIGHTING_CONFLICTS.specialToSpecialConflicts;

        // 모든 조합 체크
        for (let i = 0; i < config.special.length; i++) {
            for (let j = i + 1; j < config.special.length; j++) {
                const s1 = config.special[i];
                const s2 = config.special[j];

                const conflict = conflicts.find(
                    c => (c.special1 === s1 && c.special2 === s2) ||
                        (c.special1 === s2 && c.special2 === s1)
                );

                if (conflict) {
                    if (conflict.severity === 'warning') {
                        result.warnings.push(conflict.reason);
                    } else {
                        result.errors.push(conflict.reason);
                    }
                    result.suggestions.push(conflict.suggestion);
                }
            }
        }
    }

    /**
     * Special 개수 제한 체크 (NEW)
     */
    private static checkSpecialCountLimit(
        config: LightingConfig,
        result: ValidationResult
    ): void {
        if (!config.special) return;

        const limit = LIGHTING_CONFLICTS.specialCountLimit;

        if (config.special.length > limit.max) {
            result.warnings.push(
                `${config.special.length}개의 특수 조명이 선택됨: ${limit.reason}`
            );
            result.suggestions.push(limit.suggestion);
        }
    }

    private static checkQualityConflict(
        config: LightingConfig,
        result: ValidationResult
    ): void {
        if (!config.quality) return;

        const conflict = LIGHTING_CONFLICTS.qualityConflicts.find(
            c => c.quality === config.quality && c.patterns?.includes(config.pattern)
        );

        if (conflict) {
            result.warnings.push(conflict.reason);
            result.suggestions.push(conflict.suggestion);
        }
    }

    private static checkColorMoodConflict(
        config: LightingConfig,
        result: ValidationResult
    ): void {
        if (!config.colorTemp || !config.mood) return;

        const conflict = LIGHTING_CONFLICTS.colorMoodConflicts.find(
            c => c.colorTemp === config.colorTemp && c.moods?.includes(config.mood!)
        );

        if (conflict) {
            result.warnings.push(conflict.reason);
            result.suggestions.push(conflict.suggestion);
        }
    }

    private static checkTimeConflict(
        config: LightingConfig,
        result: ValidationResult
    ): void {
        if (!config.timeBase) return;

        const conflict = LIGHTING_CONFLICTS.timeConflicts.find(
            c => c.timeBase === config.timeBase && c.patterns?.includes(config.pattern)
        );

        if (conflict) {
            result.warnings.push(conflict.reason);
            result.suggestions.push(conflict.suggestion);
        }
    }

    /**
     * ColorTemp + TimeBase 충돌 체크 (Error)
     */
    private static checkColorTempTimeConflict(
        config: LightingConfig,
        result: ValidationResult
    ): void {
        if (!config.colorTemp || !config.timeBase) return;

        const conflicts = LIGHTING_CONFLICTS.colorTempTimeConflicts;

        const conflict = conflicts.find(
            c => c.colorTemp === config.colorTemp &&
                c.timeBases.includes(config.timeBase!)
        );

        if (conflict) {
            result.errors.push(conflict.reason);
            result.suggestions.push(conflict.suggestion);
        }
    }

    /**
     * ColorTemp + TimeBase 경고 체크 (Warning)
     */
    private static checkColorTempTimeWarning(
        config: LightingConfig,
        result: ValidationResult
    ): void {
        if (!config.colorTemp || !config.timeBase) return;

        const warnings = LIGHTING_CONFLICTS.colorTempTimeWarnings;

        const warning = warnings.find(
            c => c.colorTemp === config.colorTemp &&
                c.timeBases.includes(config.timeBase!)
        );

        if (warning) {
            result.warnings.push(warning.reason);
            result.suggestions.push(warning.suggestion);
        }
    }

    private static addRecommendations(
        config: LightingConfig,
        result: ValidationResult
    ): void {
        const recommended = RECOMMENDED_COMBINATIONS[config.pattern];
        if (!recommended) return;

        if (config.key !== recommended.key && result.errors.length === 0) {
            result.suggestions.push(
                `💡 ${config.pattern}에는 ${recommended.key}가 권장됩니다`
            );
        }
    }

    /**
     * 유효한 Ratio 옵션 반환 (동적 필터링)
     */
    static getValidRatios(pattern: LightingPattern, key: LightingKey): LightingRatio[] {
        const allRatios: LightingRatio[] = ['2:1', '3:1', '4:1', '8:1', '16:1'];

        return allRatios.filter(ratio => {
            const testConfig: LightingConfig = { pattern, key, ratio };
            const result = this.validate(testConfig);
            return result.errors.length === 0;
        });
    }

    /**
     * 유효한 Special Lighting 옵션 반환 (동적 필터링)
     */
    static getValidSpecials(
        pattern: LightingPattern,
        key: LightingKey
    ): SpecialLighting[] {
        const allSpecials: SpecialLighting[] = [
            'rim-light', 'hair-light', 'background-light',
            'chiaroscuro', 'clamshell', 'broad-lighting',
            'short-lighting', 'edge-lighting'
        ];

        return allSpecials.filter(special => {
            const testConfig: LightingConfig = { pattern, key, special: [special] };
            const result = this.validate(testConfig);
            return result.errors.length === 0;
        });
    }
}
