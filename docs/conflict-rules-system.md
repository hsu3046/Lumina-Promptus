# Lumina Promptus - 충돌 규칙 시스템

## 개요

충돌 규칙은 **두 가지 시스템**이 공존합니다:

| 시스템 | 위치 | 사용처 |
|-------|------|-------|
| **새 시스템** | `config/rules/conflict-rules.ts` | 피사체, 패션 |
| **레거시 시스템** | 각 validator 파일 | 조명, 카메라 |

### 충돌 레벨 정의

| 레벨 | UI 표시 | 의미 |
|-----|--------|------|
| `recommend` | ⭐ 파란 별 | 최적의 조합 |
| `ok` | (없음) | 문제 없음 |
| `none` | ⚠️ 노란 삼각형 | 비추천 (경고만) |
| `disabled` | 🔴 그레이아웃 | 선택 불가 |
| `hide` | (숨김) | 완전 숨김 |

---

## 1. 새 충돌 시스템

### 파일 구조
```
config/rules/
├── conflict-rules.ts     # 규칙 정의 (source of truth)
lib/rules/
├── conflict-evaluator.ts # 규칙 평가 엔진
├── legacy-adapter.ts     # UI 연동 함수
```

### 적용 탭
- ✅ **피사체 탭** (`StudioSubjectForm`, `PersonForm`)
  - 앵글: `getAngleConflict()`
  - 바디 포즈: `getBodyPoseConflict()`
  - 핸드 포즈: `getHandPoseConflict()`
- ✅ **패션 항목** (`PersonForm`)
  - 하의/신발 visibility: `getFashionDisabled()`

### 규칙 구조
```typescript
interface ConflictRule {
    restriction: 'hide' | 'disabled' | 'none';
    source: { field: string; values: string[] };
    target: { field: string; affected: string[] };
}
```

### 새 규칙 추가 방법
1. `config/rules/conflict-rules.ts`에 규칙 추가
2. `lib/rules/legacy-adapter.ts`에 조회 함수 추가 (필요시)
3. UI 컴포넌트에서 함수 호출

---

## 2. 레거시 시스템

### 조명 탭
```
config/lighting-rules.ts          # 충돌 규칙
lib/lighting-validator.ts         # 검증 엔진
```

**특징:**
- `LightingValidator.validate()` - 실시간 검증
- `RECOMMENDED_COMBINATIONS` - 권장 조합 표시
- 동적 필터링 (`getValidRatios`, `getValidSpecials`)

### 카메라 탭
```
lib/lens-composition-validator.ts # 렌즈-구도 충돌 검증
```

**특징:**
- `FRAMING_LENS_MATRIX` - 구도 × 렌즈 카테고리 매트릭스
- `getLensStatusForOption()` - 렌즈별 충돌 상태 조회

### 포트레이트 충돌
```
config/mappings/portrait-composition.ts  # 충돌 매트릭스
lib/portrait-conflict-validator.ts       # 검증 엔진  
```

**8개 충돌 매트릭스 검증:**
1. 구도 ↔ Body Pose
2. 구도 ↔ Hand Pose
3. Body Pose ↔ Expression
4. Hand Pose ↔ Expression
5. Expression ↔ Gaze
6. Body Pose ↔ Gaze
7. Hand Pose ↔ Gaze
8. Angle ↔ Gaze

---

## UI 통합

| 탭 | 사용 함수 | disabled 처리 |
|---|----------|--------------|
| **피사체** | `getAngleConflict()`, `getBodyPoseConflict()` | 그레이아웃 |
| **패션** | `getFashionDisabled()` | 그레이아웃 |
| **조명** | `LightingValidator.getPatternStatusForFraming()` | 숨김 |
| **카메라** | `getLensStatusForOption()` | 숨김 |

---

## 마이그레이션 로드맵 (선택적)

향후 조명/카메라 탭도 새 시스템으로 통합하려면:
1. `conflict-rules.ts`에 규칙 추가
2. `legacy-adapter.ts`에 조회 함수 구현
3. UI에서 새 함수 사용
4. 기존 validator 삭제
