# Lumina Promptus 코드 리뷰

> **리뷰 일시**: 2026-02-12  
> **대상 버전**: v21.6 (Digital Darkroom Architecture)  
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
├── prompt/           # ⭐ 핵심 엔진 (Builder 2개 + Exporter 3개)
├── rules/            # 충돌 감지/해결 시스템 (5개 파일)
store/               # Zustand 상태관리 (Settings/Prompt/History)
types/               # TypeScript 타입 정의
hooks/               # Custom Hooks (usePromptBuilder)
scripts/             # 테스트 스크립트 (3개)
```

| 카테고리 | 파일 수 | 주요 파일 (LOC) |
|---------|--------|----------------|
| 프롬프트 엔진 | 8 | `StudioBuilder.ts` (979), `LandscapeBuilder.ts` (494) |
| Exporter | 3 | `NanoBananaExporter.ts` (459), `ChatGPTExporter.ts` (489), `MidjourneyExporter.ts` (359) |
| 충돌 규칙 | 5 | `conflict-rules.ts` (256), `conflict-framing-fashion.ts` (275) |
| UI 컴포넌트 | 26 | `combobox-field.tsx` (518), `PromptPreview.tsx` (229) |
| 타입 정의 | 3 | `types/index.ts` (416), `landscape.types.ts`, `lighting.types.ts` |
| 설정/매핑 | 7 | `lenses.ts` (30K), `cameras.ts` (17K), `fashion-options.ts` (19K) |

---

## 2. 아키텍처 평가

### ✅ 강점

#### 2.1 IR(Intermediate Representation) 기반 설계 — ⭐ 우수
```
UserSettings → Builder(IR 생성) → Exporter(모델별 변환) → 최종 프롬프트
```
- UI 설정과 프롬프트 출력을 **IR로 완전히 분리**하여, 새 AI 모델 추가 시 Exporter만 작성하면 됨
- Slot 시스템(`slotId`, `priority`, `locked`)으로 프롬프트 블록 간 우선순위 제어 가능
- 모델별 최적화: NanoBanana(자연어 서술), ChatGPT(섹션 라벨), Midjourney(키워드 + 파라미터)

#### 2.2 충돌 감지 시스템 — 우수
- 선언적 규칙 기반 (`conflict-rules.ts`): source/target 필드 매핑으로 유지보수성 높음
- 3단계 제한 레벨: `disabled` > `none`(경고) > `ok`
- UI 연동: `ComboboxField`의 `getConflictLevel` prop으로 선택 불가/경고 시각적 표시
- 도메인 분리: 프레이밍-패션(`conflict-framing-fashion.ts`), 프레이밍-포즈, 라이팅 규칙 독립 관리

#### 2.3 Dictionary 패턴 — 우수
- 컨텍스트 기반 프롬프트 변형 (TIGHT/MEDIUM/WIDE × STUDIO/LANDSCAPE/SNAP)
- `getPrompt()` 함수의 우선순위 기반 Fallback: `customContext > framing > 그룹 > mode > base`
- 역변환 지원 (`detectEntryFromPrompt`) — 프롬프트에서 설정 복원 가능성 확보

#### 2.4 상태 관리 — 양호
- Zustand의 간결한 API 활용, 미들웨어 패턴 (`persist`)으로 히스토리 localStorage 저장
- `usePromptBuilder` 훅에서 300ms debounce 적용하여 불필요한 재빌드 방지

#### 2.5 모바일 최적화 — 양호
- iOS Safari zoom 방지 (`font-size: 16px !important`, `touch-action: manipulation`)
- `viewport` meta에 `maximum-scale=1, user-scalable=no` 적용
- 반응형 레이아웃: `grid-cols-1 lg:grid-cols-[1fr_420px]`

---

### ⚠️ 개선 필요 사항

#### 2.6 Exporter 코드 중복 — 높은 우선순위
3개 Exporter (`NanoBanana`, `ChatGPT`, `Midjourney`)에서 **동일 로직이 반복**됩니다:

| 중복 메서드 | 영향도 |
|-----------|------|
| `buildAppearanceDescription()` | NanoBanana 123줄, ChatGPT 120줄 — 거의 동일 |
| `addArticle()` / `joinWithAnd()` | 3개 파일 모두 동일 코드 |
| `getSubjectSection()` | 패턴 동일, 미세한 포맷 차이만 존재 |
| `getFashionSection()` | IR 슬롯 조회 로직 동일 |

**제안**: `BaseExporter` 추상 클래스 도입
```typescript
abstract class BaseExporter {
    protected addArticle(text: string): string { ... }
    protected joinWithAnd(parts: string[]): string { ... }
    protected buildAppearanceDescription(subject, num): string { ... }
    abstract export(): string; // 모델별 구조 커스터마이징
}
```

#### 2.7 StudioBuilder 파일 크기 — 중간 우선순위
`StudioBuilder.ts`가 **979줄**로 과대합니다. `PromptBuilderV2` 클래스에 Studio + Snap 두 가지 모드가 혼재:

- `buildSnapPrompt()` (L188-295, 107줄): 별도 `SnapBuilder.ts`로 분리 권장
- `getSubjectPrompt()` → `buildStudioSubjectPrompt()` → `buildSingleSubjectDescription()` (180줄): Subject 서브모듈 분리 가능
- 유틸리티 (`addArticle`, `joinWithAnd`, `estimateTokens`): 공통 모듈로 추출

#### 2.8 타입 시스템 일관성 — 중간 우선순위
- `types/index.ts`의 `SettingsStore` 인터페이스(L397-405)와 `store/useSettingsStore.ts`의 내부 `SettingsStore` 인터페이스(L161-171)가 **별도로 정의**, `landscape`/`snap` 필드가 `types/index.ts` 쪽에는 없음
- `UserSettings` 타입에 `snap?: SnapSettings`가 optional이지만 `useSettingsStore`에서는 항상 존재
- `orientation: 'landscape' | 'portrait'` 필드가 `deprecated` 주석만 있고 코드 내에서 여전히 기본값으로 설정됨

**제안**: `types/index.ts`의 `SettingsStore`를 single source of truth로 통합하고, deprecated 필드 제거

#### 2.9 Error Boundary 부재 — 중간 우선순위
- `PromptPreview` 등 주요 컴포넌트에 React Error Boundary가 없음
- Builder/Exporter 내부에서 `getCameraById()`/`getLensById()`가 `undefined`를 반환할 수 있으나 일부 경로에서 null check 부재
- API Route에서 환경변수 미설정 시 처리가 불충분할 수 있음

#### 2.10 `next.config.ts` 미설정 — 낮은 우선순위
현재 빈 설정 상태:
```typescript
const nextConfig: NextConfig = {
  /* config options here */
};
```
- `images.remotePatterns` 설정 없음 (외부 이미지 사용 시 필요)
- `experimental` 옵션 미활용 (Server Actions, Turbopack 등)

---

## 3. 코드 품질 분석

### 3.1 TypeScript 활용도 — ⭐ 매우 양호

| 항목 | 평가 | 비고 |
|-----|------|------|
| `strict: true` | ✅ | tsconfig.json 에 엄격 모드 활성화 |
| Union Type 활용 | ✅ | `PortraitFraming`, `PortraitGaze` 등 8종 리터럴 타입 |
| Generic 활용 | ✅ | `applyFramingConflicts<T>` 등 제네릭 패턴 |
| 인터페이스 설계 | ✅ | IR/Slot/Conflict 계층 구조가 명확 |
| `as` 타입 단언 | ⚠️ | `ChatGPTExporter` 생성자에서 `{} as UserSettings` 사용 — runtime 에러 가능성 |

### 3.2 React 패턴 — 양호

| 항목 | 평가 | 비고 |
|-----|------|------|
| `'use client'` 분리 | ✅ | 페이지/컴포넌트별 올바르게 적용 |
| `useCallback` 의존성 | ✅ | `buildPrompt`의 deps 배열 정확 |
| Controlled Components | ✅ | `ComboboxField`가 value/onSelect 패턴 준수 |
| 메모이제이션 | ⚠️ | 대부분의 컴포넌트에서 `React.memo` 미사용 — 대규모 옵션 리스트 리렌더링 가능성 |
| `key` prop | ✅ | 리스트 렌더링에서 고유 key 사용 |

### 3.3 CSS/디자인 시스템 — 양호

- 커스텀 CSS 변수 (`--lp-accent`, `--lp-text` 등) + 유틸리티 클래스 (`lp-card`, `lp-tab-trigger`) 정의
- Tailwind v4 `@theme inline` 활용
- Dark mode 전용 (`html lang="ko" className="dark"`)
- `oklch` 컬러 시스템 사용 — 모던한 색상 관리

### 3.4 주석/문서화 — 양호_

- 대부분의 함수/클래스에 한국어 주석 존재
- JSDoc 스타일 (`@param`, `@returns`)이 일부 부재 — `getPrompt()` 등 핵심 함수에만 적용됨
- 각 파일의 상단에 파일 목적 주석 일관되게 존재

---

## 4. 보안 점검

| 항목 | 상태 | 상세 |
|-----|------|------|
| `.env.local` gitignore | ✅ | `.env*` 패턴으로 모든 env 파일 제외 |
| API Key 노출 | ✅ | API Routes(`/api/places/*`)에서 서버사이드 처리 |
| XSS 방지 | ✅ | React의 기본 이스케이핑 + 사용자 입력의 직접 `innerHTML` 사용 없음 |
| 의존성 보안 | ⚠️ | `cesium` (136.0) 번들 크기 큼 — Landscape 모드에서만 사용, dynamic import 권장 |
| CORS | ⚠️ | API Routes에 명시적 CORS 헤더 미설정 — Next.js 기본 동작에 의존 |

---

## 5. 성능 분석

### 5.1 번들 크기 우려 사항

| 패키지 | 추정 크기 | 이슈 |
|--------|---------|------|
| `cesium` | ~40MB (raw) | **Landscape 모드 전용** — 전체 앱에 포함 시 초기 로드 지연 |
| `@hugeicons/*` | ~5MB | 아이콘 tree-shaking 여부 확인 필요 |
| `suncalc` | ~8KB | 경량, 문제 없음 |
| `qrcode.react` | ~25KB | QR 미사용 시 불필요 로드 |

**제안**: Cesium을 `next/dynamic`으로 lazy-load 하거나 Landscape 라우트에서만 로드

### 5.2 렌더링 성능

- `useSettingsStore`의 `settings` 객체가 변경될 때마다 `usePromptBuilder`가 전체 IR을 재빌드
- 300ms debounce가 있으나, 슬라이더 같은 연속 입력에서는 여전히 빈번한 빌드 발생 가능
- `StudioBuilder.buildSingleSubjectDescription()`에서 다수의 문자열 조합 — 성능 임팩트는 미미하나, 3인 Subject 시 3배 호출

### 5.3 API 호출 최적화

- Places API 호출에 클라이언트 캐싱 없음 — 동일 검색어 재요청 가능
- Weather API에 시간 기반 캐시(ISR/SWR) 미적용

---

## 6. 테스트

### 현재 상태

| 항목 | 상태 |
|-----|------|
| Unit Test 프레임워크 | ❌ 미설정 (Jest/Vitest 없음) |
| `scripts/` 테스트 | ⚠️ 수동 실행 스크립트 3개 (dictionary 검증용) |
| E2E 테스트 | ❌ 미설정 |
| CI/CD 파이프라인 | ❌ 미설정 |

**권장 우선순위**:
1. **Vitest 도입** → Builder/Exporter 유닛 테스트 (입력 → 프롬프트 출력 검증)
2. **Conflict Rules 테스트** → 모든 규칙 조합 자동 검증
3. **Playwright E2E** → Studio 모드 기본 워크플로우 자동화

---

## 7. 종합 평가

| 영역 | 점수 | 평가 |
|-----|------|------|
| **아키텍처** | ⭐⭐⭐⭐ | IR 기반 설계가 확장성과 유지보수성 확보 |
| **코드 품질** | ⭐⭐⭐⭐ | TypeScript 엄격 모드, 일관된 패턴 |
| **DRY 원칙** | ⭐⭐⭐ | Exporter 간 중복이 주요 개선점 |
| **보안** | ⭐⭐⭐⭐ | API Key 관리 올바름, 기본적 보안 충족 |
| **성능** | ⭐⭐⭐ | Cesium 번들 크기, 캐싱 전략 보완 필요 |
| **테스트** | ⭐⭐ | 자동화 테스트 체계 부재 |
| **문서화** | ⭐⭐⭐⭐ | docs 폴더 존재, 코드 내 주석 충실 |
| **UI/UX** | ⭐⭐⭐⭐⭐ | 전문적 다크 UI, 모바일 최적화, 충돌 시각화 |

### 전체 점수: **3.9/5 — 양호(Good)**

---

## 8. 개선 로드맵 (우선순위순)

### Phase 1: 즉시 적용 (1-2일)
- [ ] `ChatGPTExporter` 생성자의 `{} as UserSettings` 제거 → optional chaining 적용
- [ ] `types/index.ts`의 `UserSettings` 타입에 `landscape`, `snap` 필드 추가 (타입 정합성)
- [ ] deprecated `orientation` 필드 제거

### Phase 2: 단기 개선 (1주)
- [ ] `BaseExporter` 추상 클래스 도입 → 3개 Exporter 공통 로직 추출
- [ ] `StudioBuilder`에서 `SnapBuilder` 분리 (SRP 원칙)
- [ ] `cesium`을 `next/dynamic`으로 lazy-load
- [ ] 주요 API Route에 간단한 메모리 캐시 적용

### Phase 3: 중기 개선 (1개월)
- [ ] Vitest 설정 + Builder/Exporter 유닛 테스트 작성
- [ ] React Error Boundary 추가 (프롬프트 생성, API 호출 영역)
- [ ] `React.memo` 적용: 대규모 옵션 리스트 컴포넌트 (`ComboboxField`)
- [ ] Lighthouse 성능 프로파일링 및 번들 최적화

### Phase 4: 장기 개선 (분기)
- [ ] Playwright E2E 테스트 자동화
- [ ] CI/CD 파이프라인 (GitHub Actions)
- [ ] Storybook 도입 → UI 컴포넌트 문서화 및 시각적 테스트

---

**Updated**: 2026-02-12 | **Reviewer**: AI Code Review Agent
