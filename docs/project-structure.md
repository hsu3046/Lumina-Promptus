# Lumina Promptus - 프로젝트 구조 및 아키텍처

## 개요

**Lumina Promptus**는 AI 이미지 생성을 위한 프롬프트 빌더입니다. 카메라, 조명, 피사체 설정을 조합하여 최적화된 프롬프트를 생성합니다.

---

## 기술 스택

- **프레임워크**: Next.js 14 (App Router)
- **UI**: shadcn/ui + Tailwind CSS
- **상태 관리**: Zustand
- **언어**: TypeScript

---

## 디렉토리 구조

```
lumina-promptus/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # 메인 페이지
│   ├── layout.tsx                # 레이아웃
│   └── api/
│       └── refine-prompt/        # AI 프롬프트 정제 API
├── components/
│   ├── settings/                 # 설정 패널
│   │   ├── tabs/
│   │   │   ├── camera/           # 카메라 탭 (CameraTab.tsx)
│   │   │   ├── lighting/         # 조명 탭 (LightingTab.tsx)
│   │   │   └── subject/          # 피사체 탭 (StudioSubjectForm, PersonForm)
│   │   └── PromptPreview.tsx     # 프롬프트 미리보기
│   ├── ui/                       # shadcn 컴포넌트
│   └── hooks/                    # 커스텀 훅
├── config/
│   ├── lighting-rules.ts         # 조명 충돌 규칙
│   └── mappings/
│       ├── cameras.ts            # 카메라 바디 데이터 (40KB)
│       ├── lenses.ts             # 렌즈 데이터 (40KB)
│       ├── lighting-patterns.ts  # 조명 패턴 프롬프트
│       ├── portrait-composition.ts # 포트레이트 충돌 매트릭스
│       └── fashion-options.ts    # 패션 옵션
├── lib/
│   ├── lens-composition-validator.ts    # 렌즈×구도 충돌
│   ├── portrait-conflict-validator.ts   # 포즈/표정 충돌
│   ├── lighting-validator.ts            # 조명 충돌
│   ├── exposure-calculator.ts           # 노출 계산
│   └── prompt-builder/
│       └── PromptBuilderV2.ts           # 프롬프트 생성기
├── store/
│   └── useSettingsStore.ts       # Zustand 설정 스토어
├── types/
│   ├── index.ts                  # 메인 타입 정의
│   └── lighting.types.ts         # 조명 타입
└── docs/                         # 문서
    ├── conflict-rules-system.md  # 충돌 시스템 문서
    └── project-structure.md      # 이 파일
```

---

## 핵심 데이터 흐름

```
사용자 설정 변경
    ↓
useSettingsStore (Zustand)
    ↓
Validator 검증 (실시간)
├── lens-composition-validator
├── portrait-conflict-validator
└── lighting-validator
    ↓
UI 피드백 (아이콘, 필터링)
    ↓
PromptBuilderV2 (프롬프트 생성)
    ↓
PromptPreview (미리보기)
```

---

## 충돌 검증 시스템

### 레벨 정의
- `recommend`: 💡 권장
- `ok`: ✅ 정상
- `warning`: ⚠️ 주의
- `critical`: ❌ 오류
- `disabled`: 🚫 숨김

### 매트릭스 (4개)
1. **렌즈 × 구도**: `FRAMING_LENS_MATRIX`
2. **구도 × 앵글**: `FRAMING_ANGLE_CONFLICTS`
3. **구도 × 조명**: `FRAMING_PATTERN_CONFLICTS`
4. **앵글 × 시선**: `ANGLE_GAZE_CONFLICTS`

### 규칙 기반 (12개)
- `lighting-validator.ts`: 12개 조명 충돌 검증

---

## 주요 컴포넌트

### CameraTab
- 브랜드/바디/렌즈 선택
- 렌즈 드롭다운에 충돌 아이콘 표시
- 조리개/셔터스피드/ISO 슬라이더

### LightingTab
- 조명 패턴 선택 (Rembrandt, Butterfly, Loop, Split)
- Key, Ratio, Quality, ColorTemp 설정
- 구도 기반 패턴 필터링

### StudioSubjectForm
- 인원수 선택 (1~3명)
- 구도/앵글/구성규칙 캐러셀
- 구도 기반 앵글 자동 필터링

### PersonForm
- 바디포즈/손포즈/표정/시선 선택
- 실시간 충돌 검증

---

## 확장 가이드

### 새 카메라/렌즈 추가
`config/mappings/cameras.ts` 또는 `lenses.ts`에 추가

### 새 충돌 규칙 추가
1. 매트릭스: 해당 `*_CONFLICTS` Record에 추가
2. 규칙: `CONFLICT_RULES` 또는 `LIGHTING_CONFLICTS`에 추가

### 새 프롬프트 요소 추가
`lib/prompt-builder/PromptBuilderV2.ts`의 해당 섹션에 매핑 추가

---

## 파일 크기 참고

| 파일 | 크기 | 설명 |
|-----|------|------|
| cameras.ts | 38KB | 카메라 바디 데이터 |
| lenses.ts | 40KB | 렌즈 데이터 |
| lighting-rules.ts | 17KB | 조명 충돌 규칙 |
| lighting-validator.ts | 11KB | 조명 검증 로직 |
