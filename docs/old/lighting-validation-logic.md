# Lumina Promptus - Lighting Validation Logic

조명 설정의 물리적 충돌을 방지하는 검증 시스템

---

## 📁 파일 구조

```
src/
├── types/
│   └── lighting.types.ts          # 타입 정의
├── config/
│   └── lighting-rules.ts          # 충돌 규칙 및 권장 조합
├── utils/
│   └── lighting-validator.ts      # 검증 로직
└── __tests__/
    └── lighting-validator.test.ts # 테스트
```

---

## 1️⃣ 타입 정의 (types/lighting.types.ts)

```typescript
// types/lighting.types.ts

export type LightingPattern = 
  | 'rembrandt'
  | 'butterfly'
  | 'loop'
  | 'split';

export type LightingKey = 
  | 'high-key'
  | 'mid-key'
  | 'low-key';

export type LightingRatio = 
  | '2:1'
  | '3:1'
  | '4:1'
  | '8:1'
  | '16:1';

export type LightQuality = 
  | 'soft'
  | 'hard';

export type ColorTemperature = 
  | 'tungsten'      // 3200K
  | 'warm-golden'   // 2800K
  | 'daylight'      // 5600K
  | 'cloudy'        // 6500K
  | 'shade'         // 7500K
  | 'cool-blue';    // 8000K+

export type SpecialLighting = 
  | 'rim-light'
  | 'hair-light'
  | 'background-light'
  | 'chiaroscuro'
  | 'clamshell'
  | 'broad-lighting'
  | 'short-lighting'
  | 'edge-lighting';

export type LightingMood = 
  | 'dramatic'
  | 'natural'
  | 'glamorous'
  | 'mysterious'
  | 'editorial'
  | 'cinematic';

export type TimeLighting = 
  | 'golden-hour'
  | 'blue-hour'
  | 'midday-sun'
  | 'overcast'
  | 'window-light';

export interface LightingConfig {
  pattern: LightingPattern;
  key: LightingKey;
  ratio?: LightingRatio;
  quality?: LightQuality;
  colorTemp?: ColorTemperature;
  special?: SpecialLighting[];
  mood?: LightingMood;
  timeBase?: TimeLighting;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}
```

---

## 2️⃣ 충돌 규칙 (config/lighting-rules.ts)

```typescript
// config/lighting-rules.ts

export const LIGHTING_CONFLICTS = {
  
  // Pattern + Key 충돌
  patternKeyConflicts: [
    {
      pattern: 'split',
      key: 'high-key',
      reason: 'Split lighting requires shadow contrast, incompatible with high-key brightness',
      suggestion: 'Use mid-key or low-key for split lighting'
    },
    {
      pattern: 'rembrandt',
      key: 'high-key',
      reason: 'Rembrandt triangle requires visible shadow, lost in high-key',
      suggestion: 'Use mid-key for classic Rembrandt look'
    }
  ],
  
  // Key + Ratio 충돌
  keyRatioConflicts: [
    {
      key: 'high-key',
      ratios: ['8:1', '16:1'],
      reason: 'High-key requires low contrast (2:1 or 3:1)',
      suggestion: 'Use 2:1 or 3:1 ratio for high-key'
    },
    {
      key: 'low-key',
      ratios: ['2:1', '3:1'],
      reason: 'Low-key requires high contrast (8:1 or 16:1)',
      suggestion: 'Use 8:1 or 16:1 ratio for low-key'
    }
  ],
  
  // Pattern + Ratio 충돌
  patternRatioConflicts: [
    {
      pattern: 'butterfly',
      ratios: ['8:1', '16:1'],
      reason: 'Butterfly lighting typically uses softer ratios',
      suggestion: 'Use 2:1 or 3:1 for beauty/glamour look'
    },
    {
      pattern: 'split',
      ratios: ['2:1', '3:1'],
      reason: 'Split lighting requires strong contrast',
      suggestion: 'Use 8:1 or 16:1 for dramatic split'
    }
  ],
  
  // Special Lighting 충돌
  specialConflicts: [
    {
      key: 'low-key',
      specials: ['clamshell'],
      reason: 'Clamshell (beauty lighting) incompatible with low-key drama',
      suggestion: 'Use high-key or mid-key for clamshell'
    },
    {
      pattern: 'split',
      specials: ['clamshell'],
      reason: 'Clamshell requires even frontal lighting, not side split',
      suggestion: 'Use butterfly pattern for clamshell'
    }
  ],
  
  // Quality + Pattern 충돌
  qualityConflicts: [
    {
      quality: 'hard',
      patterns: ['butterfly'],
      reason: 'Butterfly/beauty lighting requires soft quality',
      suggestion: 'Use soft diffused light for butterfly'
    }
  ],
  
  // ColorTemp + Mood 충돌
  colorMoodConflicts: [
    {
      colorTemp: 'tungsten',
      moods: ['mysterious'],
      reason: 'Warm tungsten contradicts cool/mysterious mood',
      suggestion: 'Use cool-blue or daylight for mysterious mood'
    }
  ],
  
  // TimeBase + Pattern 충돌
  timeConflicts: [
    {
      timeBase: 'window-light',
      patterns: ['split', 'rembrandt'],
      reason: 'Natural window light rarely creates precise studio patterns',
      suggestion: 'Use studio setup or choose natural/soft patterns'
    }
  ]
};

// 권장 조합
export const RECOMMENDED_COMBINATIONS = {
  'rembrandt': {
    key: 'mid-key',
    ratio: '4:1',
    quality: 'soft',
    colorTemp: 'daylight',
    mood: 'natural'
  },
  'butterfly': {
    key: 'high-key',
    ratio: '2:1',
    quality: 'soft',
    colorTemp: 'daylight',
    mood: 'glamorous',
    special: ['clamshell']
  },
  'loop': {
    key: 'mid-key',
    ratio: '3:1',
    quality: 'soft',
    colorTemp: 'daylight',
    mood: 'natural'
  },
  'split': {
    key: 'low-key',
    ratio: '8:1',
    quality: 'hard',
    colorTemp: 'cool-blue',
    mood: 'dramatic',
    special: ['rim-light']
  }
} as const;
```

---

## 3️⃣ 검증 로직 (utils/lighting-validator.ts)

```typescript
// utils/lighting-validator.ts

import { 
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
    
    // 4. Special Lighting 충돌 체크
    this.checkSpecialConflict(config, result);
    
    // 5. Quality 충돌 체크
    this.checkQualityConflict(config, result);
    
    // 6. ColorTemp + Mood 충돌 체크
    this.checkColorMoodConflict(config, result);
    
    // 7. TimeBase 충돌 체크
    this.checkTimeConflict(config, result);
    
    // 8. 권장 조합과 비교
    this.addRecommendations(config, result);
    
    // 에러가 있으면 invalid
    result.isValid = result.errors.length === 0;
    
    return result;
  }
  
  /**
   * Pattern + Key 충돌 체크
   */
  private static checkPatternKeyConflict(
    config: LightingConfig, 
    result: ValidationResult
  ): void {
    const conflicts = LIGHTING_CONFLICTS.patternKeyConflicts;
    
    const conflict = conflicts.find(
      c => c.pattern === config.pattern && c.key === config.key
    );
    
    if (conflict) {
      result.errors.push(
        `❌ ${config.pattern} + ${config.key}: ${conflict.reason}`
      );
      result.suggestions.push(conflict.suggestion);
    }
  }
  
  /**
   * Key + Ratio 충돌 체크
   */
  private static checkKeyRatioConflict(
    config: LightingConfig, 
    result: ValidationResult
  ): void {
    if (!config.ratio) return;
    
    const conflicts = LIGHTING_CONFLICTS.keyRatioConflicts;
    
    const conflict = conflicts.find(
      c => c.key === config.key && c.ratios.includes(config.ratio!)
    );
    
    if (conflict) {
      result.errors.push(
        `❌ ${config.key} + ${config.ratio}: ${conflict.reason}`
      );
      result.suggestions.push(conflict.suggestion);
    }
  }
  
  /**
   * Pattern + Ratio 충돌 체크
   */
  private static checkPatternRatioConflict(
    config: LightingConfig, 
    result: ValidationResult
  ): void {
    if (!config.ratio) return;
    
    const conflicts = LIGHTING_CONFLICTS.patternRatioConflicts;
    
    const conflict = conflicts.find(
      c => c.pattern === config.pattern && c.ratios.includes(config.ratio!)
    );
    
    if (conflict) {
      result.warnings.push(
        `⚠️ ${config.pattern} + ${config.ratio}: ${conflict.reason}`
      );
      result.suggestions.push(conflict.suggestion);
    }
  }
  
  /**
   * Special Lighting 충돌 체크
   */
  private static checkSpecialConflict(
    config: LightingConfig, 
    result: ValidationResult
  ): void {
    if (!config.special || config.special.length === 0) return;
    
    const conflicts = LIGHTING_CONFLICTS.specialConflicts;
    
    config.special.forEach(special => {
      // Key 충돌
      const keyConflict = conflicts.find(
        c => c.key === config.key && c.specials?.includes(special)
      );
      
      if (keyConflict) {
        result.errors.push(
          `❌ ${config.key} + ${special}: ${keyConflict.reason}`
        );
        result.suggestions.push(keyConflict.suggestion);
      }
      
      // Pattern 충돌
      const patternConflict = conflicts.find(
        c => c.pattern === config.pattern && c.specials?.includes(special)
      );
      
      if (patternConflict) {
        result.errors.push(
          `❌ ${config.pattern} + ${special}: ${patternConflict.reason}`
        );
        result.suggestions.push(patternConflict.suggestion);
      }
    });
  }
  
  /**
   * Quality 충돌 체크
   */
  private static checkQualityConflict(
    config: LightingConfig, 
    result: ValidationResult
  ): void {
    if (!config.quality) return;
    
    const conflicts = LIGHTING_CONFLICTS.qualityConflicts;
    
    const conflict = conflicts.find(
      c => c.quality === config.quality && c.patterns?.includes(config.pattern)
    );
    
    if (conflict) {
      result.warnings.push(
        `⚠️ ${config.quality} + ${config.pattern}: ${conflict.reason}`
      );
      result.suggestions.push(conflict.suggestion);
    }
  }
  
  /**
   * ColorTemp + Mood 충돌 체크
   */
  private static checkColorMoodConflict(
    config: LightingConfig, 
    result: ValidationResult
  ): void {
    if (!config.colorTemp || !config.mood) return;
    
    const conflicts = LIGHTING_CONFLICTS.colorMoodConflicts;
    
    const conflict = conflicts.find(
      c => c.colorTemp === config.colorTemp && c.moods?.includes(config.mood!)
    );
    
    if (conflict) {
      result.warnings.push(
        `⚠️ ${config.colorTemp} + ${config.mood}: ${conflict.reason}`
      );
      result.suggestions.push(conflict.suggestion);
    }
  }
  
  /**
   * TimeBase 충돌 체크
   */
  private static checkTimeConflict(
    config: LightingConfig, 
    result: ValidationResult
  ): void {
    if (!config.timeBase) return;
    
    const conflicts = LIGHTING_CONFLICTS.timeConflicts;
    
    const conflict = conflicts.find(
      c => c.timeBase === config.timeBase && c.patterns?.includes(config.pattern)
    );
    
    if (conflict) {
      result.warnings.push(
        `⚠️ ${config.timeBase} + ${config.pattern}: ${conflict.reason}`
      );
      result.suggestions.push(conflict.suggestion);
    }
  }
  
  /**
   * 권장 조합 제안
   */
  private static addRecommendations(
    config: LightingConfig, 
    result: ValidationResult
  ): void {
    const recommended = RECOMMENDED_COMBINATIONS[config.pattern];
    
    if (!recommended) return;
    
    // Key 체크
    if (config.key !== recommended.key) {
      result.suggestions.push(
        `💡 For ${config.pattern}, consider using ${recommended.key} key`
      );
    }
    
    // Ratio 체크
    if (config.ratio && config.ratio !== recommended.ratio) {
      result.suggestions.push(
        `💡 Typical ${config.pattern} uses ${recommended.ratio} ratio`
      );
    }
    
    // Quality 체크
    if (config.quality && config.quality !== recommended.quality) {
      result.suggestions.push(
        `💡 ${config.pattern} works best with ${recommended.quality} light`
      );
    }
  }
  
  /**
   * 유효한 Ratio 옵션 반환
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
   * 유효한 Special Lighting 옵션 반환
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
```

---

## 4️⃣ 테스트 (\_\_tests\_\_/lighting-validator.test.ts)

```typescript
// __tests__/lighting-validator.test.ts

import { LightingValidator } from '@/utils/lighting-validator';
import { LightingConfig } from '@/types/lighting.types';

describe('LightingValidator', () => {
  
  describe('Pattern + Key Conflicts', () => {
    test('❌ Split + High-Key should fail', () => {
      const config: LightingConfig = {
        pattern: 'split',
        key: 'high-key'
      };
      
      const result = LightingValidator.validate(config);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Split lighting requires shadow contrast');
    });
    
    test('❌ Rembrandt + High-Key should fail', () => {
      const config: LightingConfig = {
        pattern: 'rembrandt',
        key: 'high-key'
      };
      
      const result = LightingValidator.validate(config);
      
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('Rembrandt triangle requires visible shadow');
    });
    
    test('✅ Rembrandt + Mid-Key should pass', () => {
      const config: LightingConfig = {
        pattern: 'rembrandt',
        key: 'mid-key'
      };
      
      const result = LightingValidator.validate(config);
      
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });
  });
  
  describe('Key + Ratio Conflicts', () => {
    test('❌ High-Key + 8:1 should fail', () => {
      const config: LightingConfig = {
        pattern: 'rembrandt',
        key: 'high-key',
        ratio: '8:1'
      };
      
      const result = LightingValidator.validate(config);
      
      expect(result.isValid).toBe(false);
    });
    
    test('❌ Low-Key + 2:1 should fail', () => {
      const config: LightingConfig = {
        pattern: 'split',
        key: 'low-key',
        ratio: '2:1'
      };
      
      const result = LightingValidator.validate(config);
      
      expect(result.isValid).toBe(false);
    });
    
    test('✅ Mid-Key + 4:1 should pass', () => {
      const config: LightingConfig = {
        pattern: 'rembrandt',
        key: 'mid-key',
        ratio: '4:1'
      };
      
      const result = LightingValidator.validate(config);
      
      expect(result.isValid).toBe(true);
    });
  });
  
  describe('Special Lighting Conflicts', () => {
    test('❌ Low-Key + Clamshell should fail', () => {
      const config: LightingConfig = {
        pattern: 'butterfly',
        key: 'low-key',
        special: ['clamshell']
      };
      
      const result = LightingValidator.validate(config);
      
      expect(result.isValid).toBe(false);
    });
    
    test('❌ Split + Clamshell should fail', () => {
      const config: LightingConfig = {
        pattern: 'split',
        key: 'mid-key',
        special: ['clamshell']
      };
      
      const result = LightingValidator.validate(config);
      
      expect(result.isValid).toBe(false);
    });
    
    test('✅ Butterfly + Clamshell should pass', () => {
      const config: LightingConfig = {
        pattern: 'butterfly',
        key: 'high-key',
        special: ['clamshell']
      };
      
      const result = LightingValidator.validate(config);
      
      expect(result.isValid).toBe(true);
    });
  });
  
  describe('Dynamic Filtering', () => {
    test('Should return valid ratios for Split + Low-Key', () => {
      const validRatios = LightingValidator.getValidRatios('split', 'low-key');
      
      expect(validRatios).toContain('8:1');
      expect(validRatios).toContain('16:1');
      expect(validRatios).not.toContain('2:1');
      expect(validRatios).not.toContain('3:1');
    });
    
    test('Should return valid ratios for Butterfly + High-Key', () => {
      const validRatios = LightingValidator.getValidRatios('butterfly', 'high-key');
      
      expect(validRatios).toContain('2:1');
      expect(validRatios).toContain('3:1');
      expect(validRatios).not.toContain('8:1');
      expect(validRatios).not.toContain('16:1');
    });
    
    test('Should return valid specials for Butterfly + High-Key', () => {
      const validSpecials = LightingValidator.getValidSpecials('butterfly', 'high-key');
      
      expect(validSpecials).toContain('clamshell');
      expect(validSpecials).toContain('hair-light');
    });
    
    test('Should filter out invalid specials for Split + Low-Key', () => {
      const validSpecials = LightingValidator.getValidSpecials('split', 'low-key');
      
      expect(validSpecials).not.toContain('clamshell');
      expect(validSpecials).toContain('rim-light');
    });
  });
  
  describe('Quality Conflicts', () => {
    test('⚠️ Butterfly + Hard should warn', () => {
      const config: LightingConfig = {
        pattern: 'butterfly',
        key: 'high-key',
        quality: 'hard'
      };
      
      const result = LightingValidator.validate(config);
      
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('Butterfly/beauty lighting requires soft quality');
    });
  });
  
  describe('Recommendations', () => {
    test('Should suggest better key for Rembrandt', () => {
      const config: LightingConfig = {
        pattern: 'rembrandt',
        key: 'low-key'
      };
      
      const result = LightingValidator.validate(config);
      
      expect(result.suggestions.length).toBeGreaterThan(0);
      expect(result.suggestions.some(s => s.includes('mid-key'))).toBe(true);
    });
  });
});
```

---

## 📊 충돌 매트릭스

| Pattern | Compatible Keys | Recommended Ratio | Incompatible Ratios | Incompatible Specials |
|---------|----------------|-------------------|---------------------|----------------------|
| **Rembrandt** | mid-key, low-key | 4:1 | - | clamshell |
| **Butterfly** | high-key, mid-key | 2:1, 3:1 | 8:1, 16:1 | - |
| **Loop** | all | 3:1 | - | - |
| **Split** | mid-key, low-key | 8:1, 16:1 | 2:1, 3:1 | clamshell |

---

## 🎯 사용 예시

```typescript
import { LightingValidator } from '@/utils/lighting-validator';

// 1. 기본 검증
const config = {
  pattern: 'rembrandt',
  key: 'mid-key',
  ratio: '4:1'
};

const result = LightingValidator.validate(config);

if (!result.isValid) {
  console.log('Errors:', result.errors);
  console.log('Suggestions:', result.suggestions);
}

// 2. 동적 옵션 가져오기
const validRatios = LightingValidator.getValidRatios('split', 'low-key');
// Returns: ['4:1', '8:1', '16:1']

const validSpecials = LightingValidator.getValidSpecials('butterfly', 'high-key');
// Returns: ['rim-light', 'hair-light', 'clamshell', ...]
```

---

## ✅ 테스트 실행

```bash
# Jest 테스트 실행
npm test lighting-validator

# 커버리지 확인
npm test -- --coverage
```

---

**이 검증 시스템으로 물리적으로 불가능한 조명 조합을 코드 레벨에서 방지할 수 있습니다! 🎯**




# Lumina Promptus - Lighting UI 항목 정리

조명 설정 UI의 모든 선택 항목과 옵션 요약

---

## 📋 **UI 구조 개요**

```
┌─────────────────────────────────────────────────────┐
│          Lighting Configuration                     │
├──────────────────┬──────────────────────────────────┤
│  필수 설정       │  추가 설정                        │
│  (왼쪽 컬럼)     │  (오른쪽 컬럼)                    │
└──────────────────┴──────────────────────────────────┘
│                                                      │
│  Special Lighting (전체 너비)                        │
└──────────────────────────────────────────────────────┘
│                                                      │
│  검증 결과 (에러/경고/제안)                           │
└──────────────────────────────────────────────────────┘
│                                                      │
│  Generated Prompt (미리보기)                         │
└──────────────────────────────────────────────────────┘
```

---

## 1️⃣ **필수 설정 (왼쪽 컬럼)**

### **A. Lighting Pattern** ⭐ 필수
**설명**: 얼굴에 나타나는 기본 그림자 패턴

| 옵션 | 값 | 설명 |
|------|-----|------|
| Rembrandt | `rembrandt` | 45° triangle (삼각형 하이라이트) |
| Butterfly | `butterfly` | Frontal beauty (정면 뷰티) |
| Loop | `loop` | 30° natural (자연스러운) |
| Split | `split` | 90° dramatic (극적인 반반) |

**UI 타입**: 드롭다운 (Select)

---

### **B. Lighting Key** ⭐ 필수
**설명**: 전체적인 밝기와 분위기

| 옵션 | 값 | 설명 |
|------|-----|------|
| High-Key | `high-key` | Bright & airy (밝고 환함) |
| Mid-Key | `mid-key` | Balanced (균형잡힌) |
| Low-Key | `low-key` | Dark & dramatic (어둡고 극적) |

**UI 타입**: 드롭다운 (Select)

---

### **C. Lighting Ratio** ⚙️ 선택 (동적 필터링)
**설명**: 키 라이트와 필 라이트의 대비 비율

| 옵션 | 값 | 설명 | 호환성 |
|------|-----|------|--------|
| 2:1 (soft) | `2:1` | 부드러운 | High-Key, Butterfly |
| 3:1 (natural) | `3:1` | 자연스러운 | 대부분 호환 |
| 4:1 (medium) | `4:1` | 중간 | Rembrandt 권장 |
| 8:1 (strong) | `8:1` | 강한 | Split, Low-Key |
| 16:1 (dramatic) | `16:1` | 극적인 | Split, Low-Key |

**UI 타입**: 드롭다운 (Select) - 비활성 옵션은 표시 안됨  
**동적 동작**: Pattern과 Key 선택에 따라 유효한 옵션만 표시

---

### **D. Light Quality** ⚙️ 선택
**설명**: 빛의 특성 (그림자 경계)

| 옵션 | 값 | 설명 |
|------|-----|------|
| Soft | `soft` | Diffused, gentle shadows (부드러운 그림자) |
| Hard | `hard` | Sharp, defined shadows (선명한 그림자) |

**UI 타입**: 드롭다운 (Select)

---

## 2️⃣ **추가 설정 (오른쪽 컬럼)**

### **E. Color Temperature** ⚙️ 선택
**설명**: 조명의 색온도

| 옵션 | 값 | 켈빈 | 설명 |
|------|-----|------|------|
| Warm Golden | `warm-golden` | 2800K | 따뜻한 황금빛 |
| Tungsten | `tungsten` | 3200K | 텅스텐 전구 |
| Daylight | `daylight` | 5600K | 주간 자연광 |
| Cloudy | `cloudy` | 6500K | 흐린 날 |
| Shade | `shade` | 7500K | 그늘 |
| Cool Blue | `cool-blue` | 8000K+ | 차가운 청색 |

**UI 타입**: 드롭다운 (Select)

---

### **F. Lighting Mood** ⚙️ 선택
**설명**: 조명이 만드는 전체적인 분위기

| 옵션 | 값 | 설명 |
|------|-----|------|
| Dramatic | `dramatic` | 극적인 |
| Natural | `natural` | 자연스러운 |
| Glamorous | `glamorous` | 화려한 |
| Mysterious | `mysterious` | 신비로운 |
| Editorial | `editorial` | 에디토리얼 |
| Cinematic | `cinematic` | 영화적인 |

**UI 타입**: 드롭다운 (Select)

---

### **G. Time-Based Lighting** ⚙️ 선택
**설명**: 시간대별 자연광 느낌

| 옵션 | 값 | 설명 |
|------|-----|------|
| Golden Hour | `golden-hour` | 황금 시간대 |
| Blue Hour | `blue-hour` | 블루 아워 |
| Midday Sun | `midday-sun` | 한낮 햇빛 |
| Overcast | `overcast` | 흐린 날 |
| Window Light | `window-light` | 창문 빛 |

**UI 타입**: 드롭다운 (Select)

---

## 3️⃣ **Special Lighting (전체 너비)**

### **H. Special Lighting Techniques** ⚙️ 다중 선택 (동적 필터링)
**설명**: 추가 조명 기법 (복수 선택 가능)

| 옵션 | 값 | 설명 | 주의사항 |
|------|-----|------|----------|
| Rim Light | `rim-light` | 가장자리 빛 | - |
| Hair Light | `hair-light` | 헤어 라이트 | - |
| Background Light | `background-light` | 배경 조명 | - |
| Chiaroscuro | `chiaroscuro` | 명암 대비 | Low-Key 추천 |
| Clamshell | `clamshell` | 클램쉘 (뷰티) | Butterfly + High-Key만 |
| Broad Lighting | `broad-lighting` | 넓은 면 조명 | - |
| Short Lighting | `short-lighting` | 좁은 면 조명 | - |
| Edge Lighting | `edge-lighting` | 윤곽 조명 | - |

**UI 타입**: 체크박스 그리드 (2x4 또는 4x2)  
**동적 동작**: Pattern과 Key에 따라 호환되지 않는 옵션은 표시 안됨

---

## 4️⃣ **검증 결과 표시**

### **검증 상태 3단계**

| 상태 | 색상 | 아이콘 | 의미 |
|------|------|--------|------|
| ✅ Valid | 녹색 | 체크 | 물리적으로 올바른 조합 |
| ❌ Error | 빨강 | 경고 | 물리적으로 불가능 (선택 불가) |
| ⚠️ Warning | 노랑 | 주의 | 권장하지 않음 (가능하지만 비효율) |
| 💡 Suggestion | 파랑 | 전구 | 개선 제안 |

**표시 내용**:
- 충돌 이유 (예: "Split lighting requires shadow contrast")
- 해결 방법 (예: "Use mid-key or low-key for split lighting")
- 권장 조합 (예: "For rembrandt, consider using mid-key")

---

## 5️⃣ **Generated Prompt (미리보기)**

### **출력 형식**
```
rembrandt lighting with 4:1 ratio, soft diffused quality, 
daylight color temperature, mid-key overall mood, 
natural atmosphere
```

### **기능**
- **Copy 버튼**: 클립보드 복사 (유효한 설정만)
- **Configuration Summary**: 4개 카드로 주요 설정 요약
  - Pattern
  - Key
  - Ratio
  - Quality

---

## 📊 **선택지 개수 요약**

| 항목 | 필수/선택 | 선택지 개수 | UI 타입 | 동적 필터링 |
|------|-----------|-------------|---------|-------------|
| Lighting Pattern | ⭐ 필수 | 4개 | Select | ❌ |
| Lighting Key | ⭐ 필수 | 3개 | Select | ❌ |
| Lighting Ratio | ⚙️ 선택 | 5개 | Select | ✅ |
| Light Quality | ⚙️ 선택 | 2개 | Select | ❌ |
| Color Temperature | ⚙️ 선택 | 6개 | Select | ❌ |
| Lighting Mood | ⚙️ 선택 | 6개 | Select | ❌ |
| Time-Based | ⚙️ 선택 | 5개 | Select | ❌ |
| Special Lighting | ⚙️ 다중 | 8개 | Checkbox | ✅ |

**총 조합 가능 개수**: 4 × 3 × 5 × 2 × 6 × 6 × 5 × 2^8 = **약 1,105,920가지**  
**실제 유효 조합**: **약 40~60가지** (충돌 규칙 적용 후)

---

## 🎯 **핵심 UX 특징**

### 1️⃣ **동적 필터링**
```
사용자가 Split + High-Key 선택
    ↓
Ratio 드롭다운에서 2:1, 3:1 옵션 사라짐
    ↓
8:1, 16:1만 선택 가능
```

### 2️⃣ **자동 정리**
```
사용자가 Rembrandt + Mid-Key + 4:1 선택
    ↓
Special에 Clamshell 체크
    ↓
Pattern을 Split으로 변경
    ↓
Clamshell 자동으로 체크 해제 (충돌)
```

### 3️⃣ **실시간 피드백**
```
선택 변경 즉시
    ↓
검증 실행 (< 100ms)
    ↓
에러/경고/제안 표시
    ↓
프롬프트 실시간 업데이트
```

### 4️⃣ **학습 지원**
- 각 옵션에 설명 텍스트
- 호환성 정보 즉시 표시
- 왜 안 되는지 이유 설명
- 대안 제시

---

## 🔄 **사용자 플로우 예시**

```
1. 페이지 진입
   ├─ Pattern: Rembrandt (기본값)
   └─ Key: Mid-Key (기본값)

2. 사용자가 Pattern을 "Split"으로 변경
   ├─ Ratio 옵션 자동 업데이트 (2:1, 3:1 제거)
   ├─ Special 옵션 자동 업데이트 (Clamshell 제거)
   └─ 제안: "Use 8:1 or 16:1 for dramatic split"

3. 사용자가 Key를 "High-Key"로 변경
   ├─ ❌ 에러 발생!
   ├─ 빨간 박스: "Split + High-Key는 물리적으로 불가능"
   ├─ 제안: "Use mid-key or low-key"
   └─ Copy 버튼 비활성화

4. 사용자가 Key를 "Low-Key"로 수정
   ├─ ✅ 검증 통과
   ├─ Ratio 자동 추천: 8:1
   └─ Copy 버튼 활성화

5. 프롬프트 복사
   └─ "split lighting with 8:1 ratio, low-key overall mood"
```

---

## 📱 **반응형 동작**

### **Desktop (≥768px)**
- 2컬럼 레이아웃
- Special Lighting: 4열 그리드
- Configuration Summary: 4열 그리드

### **Mobile (<768px)**
- 1컬럼 레이아웃
- Special Lighting: 2열 그리드
- Configuration Summary: 2열 그리드

---

**이 UI로 사용자는 8개 항목 × 41개 선택지를 직관적으로 조작하며, 물리적으로 올바른 조명만 선택할 수 있습니다! 🎯**