# Lumina Promptus 코드 리뷰

> **리뷰 일시**: 2026-02-20  
> **대상 버전**: v21.6.6 (Digital Darkroom Architecture)  
> **Tech Stack**: Next.js 16 + React 19 + Tailwind CSS v4 + Zustand 5 + Shadcn UI

---

## 1. 프로젝트 구조 개요

```
app/                  # Next.js App Router (3 모드: studio, landscape, snap)
├── api/              # API Routes (6개: places, weather, knowledge-graph)
components/
├── settings/         # 도메인 컴포넌트 (PromptPreview + 5개 탭 모듈)
├── ui/              # Shadcn 기반 UI 컴포넌트 (26개)
config/mappings/      # 정적 데이터 매핑 (카메라/렌즈/패션/조명 등 7개)
lib/
├── dictionary/       # 범용 Dictionary 시스템 (Pose/Angle 프롬프트 변형)
├── landscape/        # 풍경 분석 모듈 (태양계산/가림분석/환경검증)
├── prompt/           # ⭐ 핵심 엔진 (Builder 3개 + Exporter 3개)
├── rules/            # 충돌 감지/해결 시스템 (5개 파일)
store/               # Zustand 상태관리 (Settings/Prompt/History)
types/               # TypeScript 타입 정의
hooks/               # Custom Hooks (usePromptBuilder)
scripts/             # 테스트 스크립트 (3개)
```

| 카테고리 | 파일 수 | 주요 파일 (LOC) |
|---------|--------|----------------|
| 프롬프트 엔진 | 9 | `StudioBuilder.ts` (분리완료), `SnapBuilder.ts` (분리), `LandscapeBuilder.ts` |
| Exporter | 3 | `NanoBananaExporter.ts`, `ChatGPTExporter.ts`, `MidjourneyExporter.ts` |
| 충돌 규칙 | 5 | `conflict-rules.ts`, `conflict-framing-fashion.ts` |
| UI 컴포넌트 | 26 | `combobox-field.tsx`, `PromptPreview.tsx` |
| 타입 정의 | 3 | `types/index.ts`, `landscape.types.ts`, `lighting.types.ts` |
| 설정/매핑 | 7 | `lenses.ts`, `cameras.ts`, `fashion-options.ts` |

---

## 2. 아키텍처 평가

### ✅ 강점

#### 2.1 IR(Intermediate Representation) 기반 설계 — ⭐ 우수
```
UserSettings → Builder(IR 생성) → Exporter(모델별 변환) → 최종 프롬프트
```
- UI 설정과 프롬프트 출력을 **IR로 완전히 분리**하여, 새 AI 모델 추가 시 Exporter만 작성하면 됨.
- Slot 시스템(`slotId`, `priority`, `locked`)으로 프롬프트 블록 간 우선순위 제어 구현.

#### 2.2 모듈화 및 책임 분산 (최근 개선됨) — 우수
- 기존에 과대했던 `StudioBuilder.ts`에서 **`SnapBuilder.ts`가 성공적으로 분리됨**.
- 도메인 단위로 명확히 역할이 나뉘어졌음 (SRP 준수).

#### 2.3 Dictionary 패턴 및 충돌 감지 — 우수
- 선언적 규칙 기반 충돌 감지(`conflict-rules.ts`). UI 연동 및 Fallback 로직 우수.

---

### ⚠️ 미해결 개선 사항 (Issue Tracking)

#### 2.4 Exporter 코드 중복 — **[우선순위: 매우 높음]**
- 3개 Exporter (`NanoBanana`, `ChatGPT`, `Midjourney`)에서 여전히 **동일 로직이 반복**됨.
- `buildAppearanceDescription`, `getStyleSection`, `getTechSpecsSection`, `addArticle`, `joinWithAnd` 등 다수의 메서드가 정확히 중복됨.
- **제안**: 즉시 `BaseExporter` 추상 클래스를 도입하여 상속 구조로 리팩토링 필요.

#### 2.5 타입 시스템 정합성 — **[우선순위: 높음]**
- `types/index.ts`의 `SettingsStore` 인터페이스와 `store/useSettingsStore.ts`의 `SettingsStore` 인터페이스가 통일되지 않음 (Landscape, Snap 필드 정의 차이).
- `UserSettings` 타입 내의 `landscape` 속성 부재 및 `orientation` (deprecated) 등 타입 간 불일치가 여전히 존재함.

#### 2.6 Error Boundary 및 테스트 모듈 부재 — **[우선순위: 중간]**
- React 차원의 Custom ErrorBoundary 부재 (Next.js 빌트인 위주).
- `scripts/`에 3개의 수동 테스트만 존재하며, Vitest/Jest 등의 Unit Test 및 E2E 테스트(Playwright) 부재.

#### 2.7 `next.config.ts` 미설정 — **[우선순위: 낮음]**
- 외부 이미지 호스트, 실험적 최적화 옵션(예: serverAction, 터보팩 등)이 빈 상태로 방치되어 있음.

---

## 3. 종합 평가 및 체크리스트

| 영역 | 점수 | 평가 |
|-----|------|------|
| **아키텍처** | ⭐⭐⭐⭐ | `SnapBuilder` 분리로 모듈화 진전. IR 패턴 훌륭함. |
| **코드 품질** | ⭐⭐⭐ | Exporter 간 물리적 중복이 가장 큰 감점 요인. |
| **타입 정합성**| ⭐⭐⭐ | 타입 중복 선언 및 불일치 (SettingsStore) 정리 필요. |
| **보안/테스트**| ⭐⭐ | 기본 기능 동작은 좋으나 방어 코드(ErrorBoundary)와 테스트 빈약. |

### 전체 점수: **3.8/5 — 양호(Good), 리팩토링 및 클린업 요망**

---

## 4. 이후 진행 로드맵 (개선 옵션)

### 🚨 권장 리팩토링 대상 (Option A)
1. **`BaseExporter.ts` 추출 및 상속 적용**: 중복 코드 50% 이상 절감 기대.
2. **`SettingsStore` 단일 진실 공급원(SSOT) 맵핑 정리**: `types/index.ts` 연동.

### 🔄 유지보수 패키징 (Option B)
1. **Error Boundary 적용**: `app/` 라우트 최상단 밎 `PromptPreview` 범위.
2. **단위 테스트(Vitest) 도입**: Builder IR 검증 및 Exporter 문자열 변환 검증 셋업.

---

**Updated**: 2026-02-20 | **Reviewer**: AI Code Review Agent
