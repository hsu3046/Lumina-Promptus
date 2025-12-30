# UI 표준화 및 라우팅 리팩토링 가이드

> **작성일**: 2025-12-30
> **버전**: v19.3

## 개요

이 문서는 Lumina Promptus의 UI 표준화 및 라우팅 분리 작업 내용을 정리합니다.

---

## 1. 라우팅 구조

### 이전 구조
```
app/
  page.tsx  ← 모든 모드가 단일 파일에서 조건부 렌더링
```

### 현재 구조
```
app/
  page.tsx          ← /studio로 리다이렉트
  studio/
    page.tsx        ← 스튜디오 모드 전용
  landscape/
    page.tsx        ← 풍경 모드 전용
```

### URL 규칙
| 경로 | 설명 |
|------|------|
| `/` | `/studio`로 리다이렉트 |
| `/studio` | 스튜디오 모드 |
| `/landscape` | 풍경 모드 |
| `/snap` | 스냅 모드 (준비중) |

---

## 2. 디자인 토큰

`app/globals.css`에 정의된 유틸리티 클래스:

### 색상 토큰
```css
--lp-accent: amber-500        /* 강조색 */
--lp-text: zinc-200           /* 기본 텍스트 */
--lp-text-secondary: zinc-400 /* 보조 텍스트 */
--lp-text-muted: zinc-500     /* 비활성 텍스트 */
```

### 유틸리티 클래스
| 클래스 | 용도 | 적용 스타일 |
|--------|------|-------------|
| `.lp-section-header` | 섹션 헤더 | `flex items-center gap-2 text-amber-500` |
| `.lp-section-title` | 섹션 제목 | `text-sm font-medium` |
| `.lp-label` | 필드 라벨 | `text-xs text-zinc-400` |
| `.lp-label-sm` | 작은 라벨 | `text-[10px] text-zinc-500` |
| `.lp-value` | 강조 값 | `text-xs text-amber-500` |
| `.lp-value-muted` | 일반 값 | `text-xs text-zinc-400` |
| `.lp-card` | 카드 컨테이너 | `p-3 bg-zinc-800/50 rounded-lg border border-zinc-800` |
| `.lp-tab-trigger` | 탭 트리거 | 언더라인 스타일 탭 |
| `.lp-divider` | 구분선 | `border-zinc-700/50` |

---

## 3. 공통 컴포넌트

### SectionHeader
**경로**: `components/ui/section-header.tsx`

```tsx
<SectionHeader icon={MapPin} title="장소 설정" />
<SectionHeader icon={Sun} title="환경 설정">
  {/* 오른쪽 추가 요소 */}
  <Button>액션</Button>
</SectionHeader>
```

### FieldLabel / FieldValue
**경로**: `components/ui/field-label.tsx`

```tsx
<FieldLabel>필드 이름</FieldLabel>
<FieldLabel size="sm">작은 라벨</FieldLabel>
<FieldValue>강조값</FieldValue>
<FieldValue muted>일반값</FieldValue>
```

### Footer
**경로**: `components/ui/footer.tsx`

저작권 및 면책조항을 표시하는 공통 푸터.

### HelpDialog
**경로**: `components/ui/help-dialog.tsx`

모드별 기능 설명을 포함한 도움말 다이얼로그.

---

## 4. 아이콘 규칙

### 사용 라이브러리
- **Lucide React** (최우선)
- ~~Hugeicons~~ (제거됨)

### 주요 아이콘 매핑
| 용도 | 아이콘 |
|------|--------|
| 장소/위치 | `MapPin` |
| 환경/날씨 | `Sun` |
| 카메라 | `Camera` |
| 피사체 | `User` |
| 라이팅 | `Sun` |
| 방향/나침반 | `Compass` |
| 랜드마크 | `Mountain` |

---

## 5. 폰트 규칙

### 폰트 패밀리
- **로고**: `Playfair Display` (`--font-playfair`)
- **본문**: `Pretendard` (`--font-pretendard`)

### 크기 규칙
| 용도 | 크기 |
|------|------|
| 섹션 제목 | `text-sm font-medium` |
| 필드 라벨 | `text-xs` |
| 설명/힌트 | `text-[10px]` |
| 매우 작은 텍스트 | `text-[9px]` |

---

## 6. 파일 구조

```
components/
  ui/
    section-header.tsx   # 섹션 헤더
    field-label.tsx      # 필드 라벨/값
    footer.tsx           # 푸터
    help-dialog.tsx      # 도움말
    combobox-field.tsx   # Combobox (suffix 지원)
    ...
  settings/
    tabs/
      landscape/         # 풍경 모드 컴포넌트
        LandscapeTab.tsx
        LocationSearch.tsx
        PlaceDetails.tsx
        LandmarkInput.tsx
        OcclusionInfo.tsx
      subject/           # 피사체 컴포넌트
      lighting/          # 라이팅 컴포넌트
      camera/            # 카메라 컴포넌트
```

---

## 7. 마이그레이션 체크리스트

새 컴포넌트 작성 시:

- [ ] `lp-*` 유틸리티 클래스 사용
- [ ] `SectionHeader` 컴포넌트로 섹션 헤더 통일
- [ ] `lp-tab-trigger` 클래스로 탭 스타일 통일
- [ ] `lp-divider` 클래스로 구분선 통일
- [ ] Lucide React 아이콘만 사용
- [ ] `FieldLabel` / `FieldValue`로 라벨/값 통일
