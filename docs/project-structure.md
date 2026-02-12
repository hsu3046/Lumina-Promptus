# Lumina Promptus - 프로젝트 구조

> 마지막 업데이트: 2026-01-01 (IR 중심 아키텍처 리팩토링)

## 전체 구조

```
lumina-promptus/
├── app/                    # Next.js App Router 페이지
├── components/             # React 컴포넌트
│   ├── settings/           # 설정 패널
│   └── ui/                 # shadcn 기반 공통 UI
├── config/                 # 설정 데이터 (mappings)
├── lib/                    # 비즈니스 로직
│   ├── prompt/             # 프롬프트 생성
│   ├── rules/              # 충돌 규칙
│   └── landscape/          # 풍경 모드 유틸리티
├── store/                  # Zustand 상태 관리
├── types/                  # TypeScript 타입 정의
├── hooks/                  # 전역 커스텀 훅
└── docs/                   # 문서
```

---

## 📁 app/

Next.js App Router 페이지들.

| 파일 | 역할 |
|------|------|
| `page.tsx` | 메인 페이지 (스튜디오 모드) |
| `studio/page.tsx` | 스튜디오 모드 전용 페이지 |
| `landscape/page.tsx` | 풍경 모드 전용 페이지 |
| `snap/page.tsx` | 스냅 모드 전용 페이지 |
| `layout.tsx` | 공통 레이아웃 |
| `api/` | API Route 핸들러 |

---

## 📁 components/

### settings/

설정 패널 컴포넌트.

| 파일 | 역할 |
|------|------|
| `PromptPreview.tsx` | 생성된 프롬프트 미리보기 및 복사/실행 |
| `index.ts` | export 모음 |

### settings/tabs/

탭별 설정 컴포넌트.

#### camera/
| 파일 | 역할 |
|------|------|
| `CameraTab.tsx` | 카메라/렌즈 설정 UI |
| `useCameraSettings.ts` | 카메라 설정 훅 (노출 계산 포함) |
| `exposure-calculator.ts` | EV 계산, 자동 노출 로직 |
| `lens-composition-validator.ts` | 렌즈-구도 호환성 검증 |

#### lighting/
| 파일 | 역할 |
|------|------|
| `LightingTab.tsx` | 조명 설정 UI |
| `lighting-rules.ts` | 조명 옵션 정의 (패턴, 키, 비율 등) |

#### subject/
| 파일 | 역할 |
|------|------|
| `SubjectTab.tsx` | 피사체 탭 래퍼 |
| `StudioSubjectForm.tsx` | 스튜디오 모드 피사체 설정 |
| `PersonForm.tsx` | 개별 인물 설정 폼 |
| `PresetSearchPicker.tsx` | 프리셋 검색 피커 |
| `subject-presets.ts` | 피사체 프리셋 정의 |
| `conflict-aware-random.ts` | 충돌 회피 랜덤 선택 로직 |
| `portrait-conflict-validator.ts` | 인물 사진 충돌 검증 |

#### landscape/
| 파일 | 역할 |
|------|------|
| `LandscapeTab.tsx` | 풍경 모드 탭 |
| `LocationSearch.tsx` | 위치 검색 |
| `LandmarkInput.tsx` | 랜드마크 입력 |
| `PlaceDetails.tsx` | 장소 상세 정보 |
| `SunPositionInfo.tsx` | 태양 위치 정보 |
| `OcclusionInfo.tsx` | 공간 분석 (차폐율) |

#### snap/
| 파일 | 역할 |
|------|------|
| `SnapTab.tsx` | 스냅 모드 탭 |

### ui/

shadcn 기반 공통 UI 컴포넌트.

| 파일 | 역할 |
|------|------|
| `combobox-field.tsx` | **핵심** - 충돌 아이콘 지원 드롭다운 |
| `button.tsx`, `card.tsx`, `select.tsx` 등 | 기본 UI 컴포넌트 |

---

## 📁 config/

설정 데이터 및 매핑.

### mappings/
| 파일 | 역할 |
|------|------|
| `cameras.ts` | 카메라 바디 데이터 |
| `lenses.ts` | 렌즈 데이터 |
| `lighting-patterns.ts` | 조명 패턴/프리셋 정의 |
| `portrait-composition.ts` | 구도/앵글/표정 옵션 |
| `fashion-options.ts` | 패션 아이템 옵션 |
| `landscape-environment.ts` | 풍경 환경 설정 |
| `snap-options.ts` | 스냅 모드 옵션 |

---

## 📁 lib/

비즈니스 로직.

### prompt/

프롬프트 생성 관련 (**IR 중심 아키텍처**).

| 파일 | 역할 |
|------|------|
| `builders/StudioBuilder.ts` | **핵심** - 스튜디오 IR 생성 (location, fashion, expression_pose, tech_specs 슬롯) |
| `builders/LandscapeBuilder.ts` | 풍경 IR 생성 (`LandscapePromptBuilder` 클래스 추가) |
| `exporters/NanoBananaExporter.ts` | IR 슬롯 조합으로 Nano Banana Pro 형식 변환 |
| `exporters/ChatGPTExporter.ts` | IR 슬롯 조합으로 ChatGPT 형식 변환 |
| `exporters/MidjourneyExporter.ts` | IR 슬롯 조합으로 Midjourney 형식 변환 |
| `prompt-diff-generator.ts` | 프롬프트 변경 추적 |
| `slot-definitions.ts` | 프롬프트 슬롯 정의 (Studio + Landscape) |
| `launchers.ts` | 외부 앱 실행 |

### rules/

충돌 규칙 시스템.

| 파일 | 역할 |
|------|------|
| `conflict-rules.ts` | **핵심** - 충돌 규칙 정의 (source of truth) |
| `conflict-adapter.ts` | UI용 충돌 체크 함수 |
| `conflict-evaluator.ts` | 규칙 평가 엔진 (확장용) |
| `conflict-resolver.ts` | IR 충돌 감지 |
| `conflict-framing-fashion.ts` | 구도-패션 충돌 규칙 |

### landscape/

풍경 모드 유틸리티.

| 파일 | 역할 |
|------|------|
| `sun-calculator.ts` | 태양 위치 계산 |
| `solar-calculator.ts` | 일출/일몰 시간 계산 |
| `occlusion-analyzer.ts` | 공간 차폐 분석 |
| `environment-validator.ts` | 환경 설정 검증 |

### 기타
| 파일 | 역할 |
|------|------|
| `utils.ts` | 공통 유틸리티 (cn 함수 등) |

---

## 📁 store/

Zustand 상태 관리.

| 파일 | 역할 |
|------|------|
| `useSettingsStore.ts` | 전역 설정 상태 |
| `usePromptStore.ts` | 프롬프트 생성 상태 |
| `useHistoryStore.ts` | 히스토리 관리 |
| `index.ts` | export 모음 |

---

## 📁 types/

TypeScript 타입 정의.

| 파일 | 역할 |
|------|------|
| `index.ts` | 핵심 타입 (PromptIR, UserSettings 등) |
| `lighting.types.ts` | 조명 관련 타입 |
| `landscape.types.ts` | 풍경 모드 타입 |

---

## 📁 hooks/

전역 커스텀 훅.

| 파일 | 역할 |
|------|------|
| `usePromptBuilder.ts` | 프롬프트 빌드 훅 (디바운싱 포함) |

---

## 파일 명명 규칙

| 위치 | 규칙 | 예시 |
|------|------|------|
| `lib/rules/` | `conflict-*.ts` | `conflict-adapter.ts` |
| `lib/prompt/` | `kebab-case.ts` | `prompt-diff-generator.ts` |
| `components/` | `PascalCase.tsx` | `CameraTab.tsx` |
| `config/mappings/` | `kebab-case.ts` | `lighting-patterns.ts` |

---

## 충돌 시스템 요약

```
config/mappings/portrait-composition.ts  → ConflictLevel 타입 정의
lib/rules/conflict-rules.ts              → 규칙 정의 (source of truth)
lib/rules/conflict-adapter.ts            → UI용 조회 함수
components/.../combobox-field.tsx        → 충돌 아이콘 표시
```

### 충돌 레벨
- `disabled` (🔴): 선택 불가
- `none` (⚠️): 경고 표시
- `ok`: 정상

---

## IR 중심 아키텍처

프롬프트 생성 흐름:

```
Settings → Builder (IR 생성) → Exporter (순서/포맷만)
```

### Studio IR 슬롯
| 슬롯 | 역할 |
|------|------|
| `location` | 배경/장소 |
| `fashion` | 패션/의상 |
| `expression_pose` | 표정/포즈/시선 |
| `tech_specs` | 카메라/렌즈 스펙 |

### Landscape IR 슬롯
| 슬롯 | 역할 |
|------|------|
| `landscape_instruction` | 지시문 |
| `landscape_subject` | 장소/좌표 |
| `landscape_composition` | 구도/공간 배치 |
| `landscape_environment` | 환경/날씨 |
| `landscape_camera` | 카메라 스펙 |

**이점:** 프롬프트 수정 시 Builder 파일 하나만 수정
