# Studio 모드 Composition 단위 테스트 계획

> 마지막 업데이트: 2026-01-01

## 목표

피사체 설정 중 **구도(Composition)** 관련 옵션 조합을 테스트하여 프롬프트 생성 품질 검증.

---

## 충돌 규칙 Source of Truth

**`lib/rules/conflict-rules.ts`** (`STUDIO_CONFLICT_RULES`)

> ✅ 레거시 규칙 마이그레이션 완료 (2026-01-01)

---

## 테스트 대상 옵션

### 1. Framing (6개)
| value | label | 선택 가능 앵글 |
|-------|-------|---------------|
| `close-up` | 클로즈업 | eye_level만 |
| `bust-shot` | 바스트샷 | eye_level, high_angle, low_angle |
| `waist-shot` | 웨이스트샷 | 모두 |
| `half-shot` | 미디엄샷 | 모두 |
| `three-quarter-shot` | 니샷 | 모두 |
| `full-shot` | 풀샷 | 모두 |

### 2. Angle (5개)
| value | label |
|-------|-------|
| `eye_level` | 아이레벨 |
| `high_angle` | 하이앵글 |
| `low_angle` | 로우앵글 |
| `birds_eye` | 버즈아이 |
| `worms_eye` | 웜즈아이 |

### 3. Body Pose (6개)
| value | label | close-up/bust-shot 제한 |
|-------|-------|--------------|
| `straight` | 자연스럽게 | ✅ |
| `contrapposto` | 컨트라포스토 | ✅ |
| `s-curve` | S커브 | ✅ |
| `three-quarter-turn` | 3/4 턴 | ✅ |
| `sitting` | 시팅 | ❌ disabled |
| `reclining` | 리클라인 | ❌ disabled |

### 4. Hand Pose (6개)
| value | label | close-up/bust-shot 제한 |
|-------|-------|--------------|
| `natural-relaxed` | 자연스럽게 | ✅ |
| `editorial-hands` | 에디토리얼 핸즈 | ✅ |
| `pocket-hands` | 포켓 핸즈 | ❌ disabled |
| `crossed-arms` | 팔짱 | ❌ disabled |
| `framing-face` | 프레이밍 | ✅ |
| `hair-touch` | 헤어 터치 | ✅ |

---

## 실제 유효 조합 (disabled 제외)

### Phase 1: Framing × Angle
| Framing | 유효 앵글 | 조합 수 |
|---------|----------|--------|
| close-up | 1개 (eye_level) | 1 |
| bust-shot | 3개 | 3 |
| waist-shot ~ full-shot (4개) | 5개씩 | 20 |
| **총계** | | **24** |

### Phase 2: Framing × Body Pose
| Framing | 유효 포즈 | 조합 수 |
|---------|----------|--------|
| close-up, bust-shot (2개) | 4개 | 8 |
| waist-shot ~ full-shot (4개) | 6개씩 | 24 |
| **총계** | | **32** |

### Phase 3: Framing × Hand Pose
| Framing | 유효 핸드포즈 | 조합 수 |
|---------|-------------|--------|
| close-up (1개) | 4개 | 4 |
| bust-shot (1개) | 5개 | 5 |
| waist-shot ~ full-shot (4개) | 6개씩 | 24 |
| **총계** | | **33** |

---

## 테스트 결과

| Phase | 조합 수 | 통과 | 실패 |
|-------|---------|------|------|
| 1. Framing × Angle | 24 | - | - |
| 2. Framing × Body Pose | 32 | - | - |
| 3. Framing × Hand Pose | 33 | - | - |

**총 유효 조합: 89개**
