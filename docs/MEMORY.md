# Project Memory

**Last Updated:** 2026-02-12

## Critical Issues & Solutions

### 2026-02-12: Radix Select `align` prop은 `position="popper"`에서만 동작
- **Problem:** `SelectContent`에 `align="start"` 설정했으나 드롭다운 위치 변경 안됨
- **Root Cause:** Radix UI Select의 기본값 `position="item-aligned"` 모드에서는 `align` prop이 무시됨
- **Solution:** `position="popper"` + `align="start"` 함께 설정
- **Prevention:** Radix Select의 positioning은 반드시 두 prop을 같이 확인할 것
- **Code:**
```tsx
// ❌ BAD - align은 무시됨
<SelectContent align="start">

// ✅ GOOD - popper 모드에서만 align 동작
<SelectContent position="popper" align="start"
  className="w-[var(--radix-select-trigger-width)]">
```

### 2026-02-12: SelectTrigger 기본 `text-center`로 인한 multi-line SelectItem 중앙정렬
- **Problem:** 스타일 셀렉터만 텍스트가 중앙정렬됨 (다른 셀렉터는 정상)
- **Root Cause:** shadcn Select의 `SelectTrigger`에 기본 CSS로 `text-center`가 내포되어 있음. 단일 텍스트 SelectItem은 영향 없으나, `flex-col` 구조(이름 + 설명)를 가진 SelectItem은 시각적으로 중앙정렬됨
- **Solution:** SelectTrigger에 `text-left`, SelectValue에 `w-full text-left` 추가
- **Prevention:** SelectItem에 multi-line/flex-col 구조 사용 시 반드시 `text-left` 명시
- **Code:**
```tsx
// ❌ BAD - multi-line content가 중앙정렬됨
<SelectTrigger className="w-full">
    <SelectValue />
</SelectTrigger>

// ✅ GOOD - 명시적 왼쪽 정렬
<SelectTrigger className="w-full text-left">
    <SelectValue className="w-full text-left" />
</SelectTrigger>
```

## Important Decisions

### Decision: Photo Style은 promptTokens로 분해하여 전달
- **Date:** 2026-02-12
- **Options:** A) 작가 이름 직접 사용, B) 기술적 키워드로 분해 (promptTokens)
- **Chosen:** B
- **Reasoning:** KI 전략에 따라 직접 작가명 사용을 피하고, 각 스타일의 시각적 특성을 기술적 토큰으로 분해하여 `style` IR 슬롯에 주입
- **Trade-offs:** 프리셋 추가 시 promptTokens 수작업 필요

### Decision: `photographerStyleId` → `photoStyleId` 리네이밍
- **Date:** 2026-02-12
- **Reasoning:** 필름 스톡과 작가 스타일 모두를 포괄하는 범용 필드명으로 통일
- **Scope:** `types/index.ts`, `useSettingsStore.ts`, `StudioBuilder.ts`, `SnapBuilder.ts`

## Recurring Patterns

### Pattern: CSS `@import` 규칙 위치 에러
- **Occurrences:** 1회 (2026-02-12, `globals.css`)
- **Context:** `@import` 뒤에 다른 규칙이 먼저 오면 CSS 파싱 에러로 전체 앱 렌더링 실패
- **Fix:** `@import`는 반드시 파일 최상단에 배치
