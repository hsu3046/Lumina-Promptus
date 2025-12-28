# 색온도 ↔ 시간대 조명 충돌 분석

Color Temperature와 Time-Based Lighting 간의 모순 가능성 검토

---

## 🌡️ **Color Temperature 6개**

| 옵션 | 값 | 켈빈 | 색감 |
|------|-----|------|------|
| Warm Golden | `warm-golden` | 2800K | 따뜻한 황금빛 |
| Tungsten | `tungsten` | 3200K | 텅스텐 전구 (주황) |
| Daylight | `daylight` | 5600K | 주간 자연광 (중성) |
| Cloudy | `cloudy` | 6500K | 흐린 날 (약간 차가움) |
| Shade | `shade` | 7500K | 그늘 (차가움) |
| Cool Blue | `cool-blue` | 8000K+ | 차가운 청색 |

---

## 🕐 **Time-Based Lighting 5개**

| 옵션 | 값 | 자연 색온도 | 특징 |
|------|-----|-------------|------|
| Golden Hour | `golden-hour` | **2500-3500K** | 일출/일몰, 따뜻한 황금빛 |
| Blue Hour | `blue-hour` | **8000-12000K** | 해 뜨기 직전/직후, 차가운 청색 |
| Midday Sun | `midday-sun` | **5200-5800K** | 정오, 강한 백색광 |
| Overcast | `overcast` | **6500-7500K** | 구름 낀 날, 부드러운 차가운 빛 |
| Window Light | `window-light` | **5000-7000K** | 창문 빛 (시간/방향 따라 변동) |

---

## ❌ **충돌 분석**

### **1️⃣ Golden Hour ↔ Cool Blue**
```
Golden Hour: 2500-3500K (따뜻한 황금)
Cool Blue: 8000K+ (차가운 청색)

충돌 이유:
- Golden Hour의 핵심은 "따뜻한 색감"
- Cool Blue는 정반대 색감
- 물리적으로 해질녘에 청색 빛은 불가능

판정: ❌ Error (강한 모순)
```

**예외**: 창의적 의도 (후보정, 특수 효과)
- 하지만 일반 사진 프롬프트로는 혼란

---

### **2️⃣ Golden Hour ↔ Shade**
```
Golden Hour: 2500-3500K
Shade: 7500K (그늘, 차가움)

충돌 이유:
- Golden Hour = 직사광선 (따뜻)
- Shade = 그늘 (차가움)
- 개념적 모순

판정: ❌ Error
```

---

### **3️⃣ Golden Hour ↔ Cloudy**
```
Golden Hour: 2500-3500K
Cloudy: 6500K

충돌 이유:
- Golden Hour는 맑은 날 특유의 현상
- Cloudy는 구름이 태양을 가림
- 흐린 날엔 Golden Hour 효과 없음

판정: ❌ Error
```

---

### **4️⃣ Blue Hour ↔ Warm Golden**
```
Blue Hour: 8000-12000K
Warm Golden: 2800K

충돌 이유:
- Blue Hour의 핵심은 "차가운 청색"
- Warm Golden은 정반대
- 물리적으로 불가능

판정: ❌ Error
```

---

### **5️⃣ Blue Hour ↔ Tungsten**
```
Blue Hour: 8000-12000K
Tungsten: 3200K

충돌 이유:
- Blue Hour는 자연광 (차가움)
- Tungsten은 인공광 (따뜻함)
- 색온도 정반대

판정: ❌ Error
```

---

### **6️⃣ Midday Sun ↔ Tungsten**
```
Midday Sun: 5200-5800K
Tungsten: 3200K

충돌 이유:
- Midday Sun은 자연광 (백색)
- Tungsten은 인공광 (주황)
-색감이 다름

판정: ⚠️ Warning (혼합 조명 가능하지만 혼란)
```

---

### **7️⃣ Overcast ↔ Warm Golden**
```
Overcast: 6500-7500K
Warm Golden: 2800K

충돌 이유:
- Overcast는 차가운 빛
- Warm Golden은 따뜻한 빛
- 구름 낀 날은 차가운 색온도가 특징

판정: ❌ Error
```

---

### **8️⃣ Window Light ↔ ?**
```
Window Light: 5000-7000K (변동성 큼)

특성:
- 시간대에 따라 색온도 변동
- 아침: 따뜻 (4000-5000K)
- 정오: 중성 (5500-6000K)
- 오후: 따뜻 (4500-5500K)
- 흐림: 차가움 (6500-7000K)

판정: ⚠️ Warning (극단적 색온도와 충돌 가능)
- Window Light + Cool Blue (8000K): Warning
- Window Light + Warm Golden (2800K): Warning (너무 따뜻)
```

---

## 📊 **완전한 충돌 매트릭스**

### **ColorTemp ↔ Time-Based 충돌표**

|  | Golden Hour | Blue Hour | Midday Sun | Overcast | Window Light |
|--|-------------|-----------|------------|----------|--------------|
| **Warm Golden (2800K)** | ✅ | ❌ | ⚠️ | ❌ | ⚠️ |
| **Tungsten (3200K)** | ✅ | ❌ | ⚠️ | ❌ | ⚠️ |
| **Daylight (5600K)** | ⚠️ | ⚠️ | ✅ | ✅ | ✅ |
| **Cloudy (6500K)** | ❌ | ⚠️ | ✅ | ✅ | ✅ |
| **Shade (7500K)** | ❌ | ✅ | ⚠️ | ✅ | ✅ |
| **Cool Blue (8000K+)** | ❌ | ✅ | ❌ | ⚠️ | ⚠️ |

**범례**:
- ✅ 호환 (자연스러운 조합)
- ❌ Error (물리적/개념적 모순)
- ⚠️ Warning (가능하지만 비자연스러움)

---

## 🔧 **추가해야 할 충돌 규칙**

```typescript
// config/lighting-rules.ts 에 추가

export const LIGHTING_CONFLICTS = {
  // ... 기존 규칙들 ...
  
  // ColorTemp + TimeBase 충돌 (새로 추가)
  colorTempTimeConflicts: [
    // Golden Hour 충돌
    {
      colorTemp: 'cool-blue',
      timeBases: ['golden-hour'],
      reason: 'Golden hour produces warm golden light (2500-3500K), incompatible with cool blue (8000K+)',
      suggestion: 'Use warm-golden or tungsten for golden hour'
    },
    {
      colorTemp: 'shade',
      timeBases: ['golden-hour'],
      reason: 'Golden hour is direct sunlight (warm), shade is cool indirect light (7500K)',
      suggestion: 'Use warm-golden or daylight for golden hour'
    },
    {
      colorTemp: 'cloudy',
      timeBases: ['golden-hour'],
      reason: 'Golden hour requires clear sky, cloudy conditions prevent golden hour effect',
      suggestion: 'Use warm-golden for golden hour, or overcast for cloudy conditions'
    },
    
    // Blue Hour 충돌
    {
      colorTemp: 'warm-golden',
      timeBases: ['blue-hour'],
      reason: 'Blue hour produces cool blue light (8000-12000K), incompatible with warm golden (2800K)',
      suggestion: 'Use cool-blue or shade for blue hour'
    },
    {
      colorTemp: 'tungsten',
      timeBases: ['blue-hour'],
      reason: 'Blue hour is natural cool light, tungsten is warm artificial light (3200K)',
      suggestion: 'Use cool-blue or shade for blue hour'
    },
    
    // Overcast 충돌
    {
      colorTemp: 'warm-golden',
      timeBases: ['overcast'],
      reason: 'Overcast conditions produce cool diffused light (6500-7500K), not warm golden',
      suggestion: 'Use cloudy or shade for overcast conditions'
    },
    {
      colorTemp: 'tungsten',
      timeBases: ['overcast'],
      reason: 'Overcast is natural cool light, tungsten is warm artificial light',
      suggestion: 'Use cloudy or daylight for overcast'
    },
    
    // Midday Sun 충돌
    {
      colorTemp: 'cool-blue',
      timeBases: ['midday-sun'],
      reason: 'Midday sun is neutral white light (5200-5800K), not cool blue (8000K+)',
      suggestion: 'Use daylight for midday sun'
    }
  ],
  
  // ColorTemp + TimeBase 경고 (Warning)
  colorTempTimeWarnings: [
    {
      colorTemp: 'tungsten',
      timeBases: ['midday-sun'],
      reason: 'Mixing artificial tungsten (3200K) with natural midday sun (5600K) creates color cast',
      suggestion: 'Match color temperature - use daylight for natural midday light'
    },
    {
      colorTemp: 'warm-golden',
      timeBases: ['window-light'],
      reason: 'Window light is typically cooler (5000-7000K), warm golden (2800K) may be too warm',
      suggestion: 'Use daylight or cloudy for typical window light'
    },
    {
      colorTemp: 'cool-blue',
      timeBases: ['window-light'],
      reason: 'Window light rarely reaches cool blue (8000K+) unless facing north in shade',
      suggestion: 'Use daylight or cloudy for typical window light'
    },
    {
      colorTemp: 'daylight',
      timeBases: ['golden-hour'],
      reason: 'Daylight (5600K) is cooler than typical golden hour (2500-3500K)',
      suggestion: 'Use warm-golden for authentic golden hour warmth'
    },
    {
      colorTemp: 'daylight',
      timeBases: ['blue-hour'],
      reason: 'Daylight (5600K) is warmer than blue hour (8000-12000K)',
      suggestion: 'Use cool-blue or shade for authentic blue hour coolness'
    }
  ]
};
```

---

## 🎯 **권장 조합**

### ✅ **자연스러운 조합**

| Time-Based | 권장 Color Temp | 이유 |
|------------|----------------|------|
| **Golden Hour** | Warm Golden (2800K) | 실제 황금 시간대와 일치 |
| **Golden Hour** | Tungsten (3200K) | 따뜻한 느낌 유지 |
| **Blue Hour** | Cool Blue (8000K+) | 실제 블루 아워와 일치 |
| **Blue Hour** | Shade (7500K) | 차가운 느낌 |
| **Midday Sun** | Daylight (5600K) | 정확한 매칭 |
| **Overcast** | Cloudy (6500K) | 정확한 매칭 |
| **Overcast** | Shade (7500K) | 부드러운 차가움 |
| **Window Light** | Daylight (5600K) | 일반적인 창문 빛 |
| **Window Light** | Cloudy (6500K) | 북향/흐린 날 창문 빛 |

---

### ❌ **피해야 할 조합**

| 조합 | 이유 | 심각도 |
|------|------|--------|
| Golden Hour + Cool Blue | 물리적 불가능 (따뜻 vs 차가움) | ❌ Error |
| Golden Hour + Shade | 직사광 vs 그늘 (모순) | ❌ Error |
| Golden Hour + Cloudy | 맑음 vs 흐림 (모순) | ❌ Error |
| Blue Hour + Warm Golden | 물리적 불가능 (차가움 vs 따뜻) | ❌ Error |
| Blue Hour + Tungsten | 자연광 vs 인공광 (모순) | ❌ Error |
| Overcast + Warm Golden | 흐림(차가움) vs 따뜻함 | ❌ Error |
| Midday Sun + Cool Blue | 중성 vs 차가움 | ❌ Error |
| Midday Sun + Tungsten | 자연광 vs 인공광 | ⚠️ Warning |

---

## 🔄 **업데이트된 검증 로직**

```typescript
// utils/lighting-validator.ts 에 추가

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
    result.errors.push(
      `❌ ${config.colorTemp} + ${config.timeBase}: ${conflict.reason}`
    );
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
    result.warnings.push(
      `⚠️ ${config.colorTemp} + ${config.timeBase}: ${warning.reason}`
    );
    result.suggestions.push(warning.suggestion);
  }
}
```

---

## 📝 **validate() 메서드 업데이트**

```typescript
static validate(config: LightingConfig): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    suggestions: []
  };
  
  // ... 기존 체크들 ...
  
  // 8. ColorTemp + TimeBase 충돌 체크 (새로 추가)
  this.checkColorTempTimeConflict(config, result);
  
  // 9. ColorTemp + TimeBase 경고 체크 (새로 추가)
  this.checkColorTempTimeWarning(config, result);
  
  result.isValid = result.errors.length === 0;
  
  return result;
}
```

---

## 🧪 **테스트 케이스 추가**

```typescript
// __tests__/lighting-validator.test.ts

describe('ColorTemp + TimeBase Conflicts', () => {
  test('❌ Golden Hour + Cool Blue should fail', () => {
    const config: LightingConfig = {
      pattern: 'rembrandt',
      key: 'mid-key',
      colorTemp: 'cool-blue',
      timeBase: 'golden-hour'
    };
    
    const result = LightingValidator.validate(config);
    
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('Golden hour produces warm golden light');
  });
  
  test('❌ Blue Hour + Tungsten should fail', () => {
    const config: LightingConfig = {
      pattern: 'split',
      key: 'low-key',
      colorTemp: 'tungsten',
      timeBase: 'blue-hour'
    };
    
    const result = LightingValidator.validate(config);
    
    expect(result.isValid).toBe(false);
  });
  
  test('✅ Golden Hour + Warm Golden should pass', () => {
    const config: LightingConfig = {
      pattern: 'loop',
      key: 'mid-key',
      colorTemp: 'warm-golden',
      timeBase: 'golden-hour'
    };
    
    const result = LightingValidator.validate(config);
    
    expect(result.isValid).toBe(true);
    expect(result.errors.length).toBe(0);
  });
  
  test('⚠️ Midday Sun + Tungsten should warn', () => {
    const config: LightingConfig = {
      pattern: 'butterfly',
      key: 'high-key',
      colorTemp: 'tungsten',
      timeBase: 'midday-sun'
    };
    
    const result = LightingValidator.validate(config);
    
    expect(result.isValid).toBe(true); // Warning이므로 valid
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});
```

---

## 📊 **통계 요약**

### **충돌 개수**

| 조합 유형 | Error | Warning | 총계 |
|-----------|-------|---------|------|
| ColorTemp ↔ TimeBase | **9개** | **5개** | **14개** |

### **가장 충돌 많은 항목**

1. **Golden Hour**: 3개 Error (Cool Blue, Shade, Cloudy)
2. **Blue Hour**: 2개 Error (Warm Golden, Tungsten)
3. **Overcast**: 2개 Error (Warm Golden, Tungsten)

---

## 🎯 **결론**

### **현재 문제점**
- ❌ ColorTemp와 TimeBase 조합 검증 없음
- ❌ Golden Hour + Cool Blue 같은 물리적 불가능 조합 허용
- ❌ 사용자가 모순된 조합 선택 가능

### **해결 방안**
1. ✅ colorTempTimeConflicts 규칙 추가 (9개 Error)
2. ✅ colorTempTimeWarnings 규칙 추가 (5개 Warning)
3. ✅ 검증 로직 메서드 2개 추가
4. ✅ 테스트 케이스 추가

### **우선순위**
1. **High**: Golden Hour + Cool/Shade/Cloudy (Error)
2. **High**: Blue Hour + Warm/Tungsten (Error)
3. **Medium**: Midday Sun + Tungsten (Warning)
4. **Medium**: Window Light + 극단 색온도 (Warning)

---

**색온도와 시간대 조명 간에도 14개의 충돌이 존재합니다! 🎯**
