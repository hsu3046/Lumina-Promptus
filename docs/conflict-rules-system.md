# Lumina Promptus - 충돌 검증 시스템 문서

## 개요

이 문서는 Lumina Promptus의 충돌 검증 시스템을 설명합니다. 시스템은 카메라, 조명, 피사체 설정 간의 호환성을 실시간으로 검증하여 사용자에게 권장/경고/오류를 표시합니다.

---

## 충돌 레벨 정의

모든 검증 시스템에서 통일된 5단계 레벨을 사용합니다:

| 레벨 | UI 표시 | 의미 |
|-----|--------|------|
| `recommend` | 💡 파란 전구 | 최적의 조합 |
| `ok` | (없음) | 문제 없음 |
| `warning` | ⚠️ 노란 삼각형 | 비추천 (의도적 선택 가능) |
| `critical` | 🔴 빨간 원형 | 결과물 심각하게 망가짐 |
| `disabled` | (숨김) | 물리적/논리적 불가 |

---

## 파일 구조

```
lib/
├── lens-composition-validator.ts    # 렌즈 × 구도/앵글 충돌
├── portrait-conflict-validator.ts   # 포즈/표정/시선 충돌
├── lighting-validator.ts            # 조명 설정 충돌
└── exposure-calculator.ts           # 노출 계산

config/
├── lighting-rules.ts                # 조명 충돌 규칙 + 구도×패턴 매트릭스
└── mappings/
    ├── portrait-composition.ts      # 포트레이트 충돌 매트릭스
    ├── cameras.ts                   # 카메라 바디 데이터
    ├── lenses.ts                    # 렌즈 데이터
    ├── lighting-patterns.ts         # 조명 패턴 프롬프트
    └── fashion-options.ts           # 패션 옵션
```

---

## 1. 렌즈 × 구도 충돌

**파일**: `lib/lens-composition-validator.ts`

### 매트릭스

| 구도 | ultra_wide | wide | standard | medium_tele | telephoto | macro |
|-----|-----------|------|----------|-------------|-----------|-------|
| close-up | critical | warning | ok | recommend | ok | ok |
| bust-shot | warning | ok | recommend | recommend | ok | disabled |
| full-shot | recommend | recommend | ok | warning | critical | disabled |

### 주요 함수

- `getLensStatusForOption(framing, angle, compositionRule, lensId)`: 렌즈 상태 반환
- `parseFocalLength(focalLength)`: 초점거리 문자열 → 숫자 변환

---

## 2. 구도 × 앵글 충돌

**파일**: `config/mappings/portrait-composition.ts`

### 매트릭스 (`FRAMING_ANGLE_CONFLICTS`)

| 구도 | eye_level | high | low | birds_eye | worms_eye | drone |
|-----|-----------|------|-----|-----------|-----------|-------|
| close-up | recommend | ok | warning | critical | critical | disabled |
| bust-shot | recommend | ok | ok | warning | warning | disabled |
| full-shot | ok | ok | recommend | recommend | recommend | recommend |

---

## 3. 구도 × 조명 패턴 충돌

**파일**: `config/lighting-rules.ts`

### 매트릭스 (`FRAMING_PATTERN_CONFLICTS`)

| 구도 | rembrandt | butterfly | loop | split |
|-----|-----------|-----------|------|-------|
| close-up | recommend | recommend | ok | warning |
| waist-shot | warning | ok | recommend | critical |
| full-shot | disabled | disabled | warning | disabled |

### 주요 함수

- `LightingValidator.getPatternStatusForFraming(framing, pattern)`: 패턴 상태 반환

---

## 4. 앵글 × 시선 충돌

**파일**: `config/mappings/portrait-composition.ts`

### 매트릭스 (`ANGLE_GAZE_CONFLICTS`)

| 앵글 | direct-eye-contact | looking-up | looking-down |
|-----|-------------------|------------|--------------|
| low_angle | ok | warning | ok |
| birds_eye | warning | critical | ok |
| drone | warning | critical | ok |

---

## 5. 포즈/표정/시선 충돌

**파일**: `lib/portrait-conflict-validator.ts`

8개 충돌 매트릭스를 검증:
1. 구도 ↔ Body Pose
2. 구도 ↔ Hand Pose
3. Body Pose ↔ Expression
4. Hand Pose ↔ Expression
5. Expression ↔ Gaze
6. Body Pose ↔ Gaze
7. Hand Pose ↔ Gaze
8. Angle ↔ Gaze

---

## 6. 조명 충돌

**파일**: `lib/lighting-validator.ts`

12개 검증 단계:
1. Pattern + Key 충돌
2. Key + Ratio 충돌
3. Pattern + Ratio 충돌
4. Special + Pattern/Key 충돌
5. Special 간 충돌
6. Special 개수 제한 (최대 3개)
7. Quality 충돌
8. ColorTemp + Mood 충돌
9. TimeBase 충돌
10. ColorTemp + TimeBase 충돌 (Error)
11. ColorTemp + TimeBase 경고 (Warning)
12. 권장 조합 추천

---

## UI 통합

### CameraTab.tsx
- 렌즈 드롭다운에 `getLensStatusForOption()` 사용
- disabled 렌즈 숨김, recommend/warning/critical 아이콘 표시

### LightingTab.tsx
- 패턴 드롭다운에 `getPatternStatusForFraming()` 사용
- disabled 패턴 숨김

### StudioSubjectForm.tsx
- 앵글 드롭다운에 `FRAMING_ANGLE_CONFLICTS` 사용
- disabled 앵글 숨김, 구도 변경 시 자동 조정

---

## 확장 가이드

### 새 충돌 규칙 추가

1. **매트릭스 기반**: 해당 파일의 `*_CONFLICTS` Record에 추가
2. **규칙 기반**: `CONFLICT_RULES` 배열에 condition 함수 추가

### 새 UI 통합

```typescript
// 예: 새 드롭다운에 충돌 표시
const status = getLensStatusForOption(framing, angle, compositionRule, lensId);
if (status.level === 'disabled') return null;
// 아이콘 렌더링
```
