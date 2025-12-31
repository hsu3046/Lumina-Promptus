# 🌟 Lumina Promptus

**디지털 암실 - 광학 시뮬레이터**  
AI 사진 프롬프트 빌더 v0.1.0 PoC

---

## 📖 프로젝트 개요

Lumina Promptus는 실제 카메라와 렌즈의 광학 특성을 정확하게 시뮬레이션하여 AI 이미지 생성을 위한 고품질 프롬프트를 생성하는 웹 애플리케이션입니다.

### ✨ 주요 기능

- **Full Spec System**: 21개 카메라 바디 (디지털 17종 + 필름 4종) 및 30개 렌즈의 정확한 스펙 시뮬레이션
- **Mount-based Filtering**: 카메라 마운트 기반 자동 호환 렌즈 필터링 (16개 마운트 지원)
- **Snap Sliders**: 실제 카메라의 1/3 스탑 간격 조리개/ISO/셔터 스피드 조절
- **Brand Auto-selection**: 브랜드 선택 시 카메라/렌즈 자동 선택 및 기본값 적용
- **실시간 프롬프트 생성**: NanoBanana Pro 포맷 export

### 🎯 지원하는 장비

**카메라**: Canon (RF/EF), Sony (E), Nikon (Z/F), Leica (M/L), Fujifilm (X/G), Hasselblad (X/V), Panasonic (L), Pentax (67)

**렌즈**: 최신 GM/RF/Z 렌즈부터 Leica Noctilux, 전설적인 필름 렌즈까지

---

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

### 3. 프로덕션 빌드

```bash
npm run build
npm start
```

---

## 📂 프로젝트 구조

```
├── app/                    # Next.js App Router
│   ├── page.tsx           # 메인 UI 컴포넌트
│   └── globals.css        # 글로벌 스타일
├── components/ui/         # shadcn/ui 컴포넌트
├── config/mappings/       # 카메라/렌즈/조명 데이터
│   ├── cameras.ts         # 21개 카메라 바디 스펙
│   ├── lenses.ts          # 30개 렌즈 스펙
│   └── lighting-patterns.ts
├── lib/
│   ├── prompt-builder/    # 프롬프트 생성 엔진
│   ├── exporters/         # NanoBanana Pro exporter
│   └── conflict-resolver/ # 충돌 해결 로직
├── store/                 # Zustand 상태 관리
├── types/                 # TypeScript 타입 정의
└── docs/                  # 스펙 문서
```

---

## 🔗 GitHub 저장소 연결

### 방법 1: GitHub.com에서 수동 생성

1. [GitHub](https://github.com/new)에서 새 저장소 생성
   - Repository name: `lumina-promptus`
   - Private/Public 선택
   - **"Add a README file" 체크 해제**

2. 로컬 저장소 연결:

```bash
git remote add origin https://github.com/YOUR_USERNAME/lumina-promptus.git
git push -u origin main
```

### 방법 2: GitHub CLI 사용 (추천)

```bash
# GitHub CLI 설치
brew install gh

# GitHub 로그인
gh auth login

# 저장소 생성 및 푸시
gh repo create lumina-promptus --private --source=. --remote=origin --push
```

---

## 🛠 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Icons**: Huge Icons (@hugeicons/react)

---

## 📋 TODO

- [ ] 추가 카메라 브랜드 지원 (Phase, Mamiya 등)
- [ ] 조명 패턴 확장
- [ ] Photographer Style 프리셋 구현
- [ ] 프롬프트 히스토리 및 즐겨찾기
- [ ] Diff 시스템 구현

---

## 📄 라이선스

This project is private and proprietary.

---

## 👤 Author

**yuhitomi**

---

Built with ❤️ using Next.js and shadcn/ui
