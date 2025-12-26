# Lumina Promptus - 개발 계획서
### 포토그래퍼의 촬영 의사결정을 AI 프롬프트로 컴파일하는 디지털 암실

**프로젝트명:** Lumina Promptus  
**서브타이틀:** "디지털 암실 - 광학 시뮬레이터"  
**타겟 사이트:** letsdebate.app/lumina 또는 luminapromptus.app  
**주 타겟:** 포토그래퍼 및 사실적인 AI 사진을 만들고 싶은 사람  
**핵심 가치:** 포토그래퍼의 워크플로우를 그대로 디지털로 옮겨 촬영 의사결정을 AI 프롬프트로 변환

**작성일:** 2024-12-25  
**작성자:** Ryan  
**버전:** 1.1 (피드백 반영)

---

## 📋 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [핵심 기능](#2-핵심-기능)
3. [기술 아키텍처](#3-기술-아키텍처)
4. [데이터 구조 설계](#4-데이터-구조-설계)
5. [프롬프트 생성 알고리즘](#5-프롬프트-생성-알고리즘)
6. [UI/UX 설계](#6-uiux-설계)
7. [개발 단계별 계획](#7-개발-단계별-계획)
8. [기술 스택](#8-기술-스택)
9. [성능 최적화](#9-성능-최적화)
10. [품질 키워드 전략](#10-품질-키워드-전략)
11. [향후 확장 계획](#11-향후-확장-계획)
12. [부록](#부록)

---

## 1. 프로젝트 개요

### 1.1 배경 및 목적

현재 AI 이미지 생성에서 사실적인 사진을 만들기 위해서는 복잡한 프롬프트 엔지니어링 지식이 필요합니다. 특히 Nano Banana Pro(Google Gemini 3 Pro Image)와 같은 최신 모델은 매우 정밀한 기술적 지시를 이해하지만, 일반 사용자는 이를 활용하기 어렵습니다.

**핵심 문제:**
- 포토그래퍼들은 카메라/조명 설정을 잘 알지만 AI 프롬프트로 변환하기 어려움
- 일반인들은 "예쁘게", "자연스럽게" 같은 막연한 표현만 사용
- 기술적 용어(f/1.4, Rembrandt lighting)를 모르면 좋은 결과를 얻기 힘듦

**우리의 솔루션:**
Lumina Promptus는 단순한 '프롬프트 생성기'가 아니라 **'사진가의 촬영 의사결정을 AI 프롬프트로 컴파일하는 툴'**입니다.

- 익숙한 카메라 설정 UI로 기술적 프롬프트 자동 생성
- 실시간 광학 시뮬레이션으로 조정값 확인
- 결정론적 변환 + AI 보조로 정확성과 유연성 동시 확보
- **프롬프트 + 설정값 버전 관리**로 강한 재방문/재사용 유도

**핵심 철학:**
"디지털 암실(Digital Darkroom)"처럼, 포토그래퍼가 암실에서 인화지를 조정하듯 AI 생성 과정을 세밀하게 제어할 수 있게 합니다.

### 1.2 타겟 사용자

**Primary:**
- 프로/아마추어 포토그래퍼 (카메라 설정 이해)
- 그래픽 디자이너 (사실적인 목업 제작)
- 마케터 (제품 사진, 광고 소재)

**Secondary:**
- AI 이미지 생성 초보자 (프롬프트 학습용)
- 콘텐츠 크리에이터 (SNS용 사실적 이미지)

### 1.3 핵심 차별점

| 기존 프롬프트 생성기 | Lumina Promptus |
|------------------|-----------------|
| 텍스트 기반 입력 | 시각적 UI 컨트롤 + 광학 시뮬레이션 |
| AI에게 전적으로 의존 | 결정론적 변환 + AI 보조 (하이브리드) |
| 일반적 품질 키워드 | 실제 카메라 메타데이터 시뮬레이션 (EXIF) |
| 프롬프트만 제공 | 프롬프트 + 설정값 버전 관리 (락인 요소) |
| 포토그래퍼 용어 모름 | 포토그래퍼 워크플로우 기반 설계 |
| 막연한 "8K", "masterpiece" | 물리적 수치 (f-stop, ISO, Kelvin) |
| 단순 생성 도구 | 학습 도구 (Before/After diff, 영향도 가시화) |

---

## 2. 핵심 기능

### 2.1 기능 전체 구조

```
┌─────────────────────────────────────────────────────┐
│                    사용자 인터페이스                  │
├─────────────────────────────────────────────────────┤
│  1. 광학 및 장비 (Camera & Optics)                   │
│     - 카메라 바디 선택                               │
│     - 렌즈 선택                                      │
│     - 카메라 설정 (ISO, 조리개, 셔터스피드)          │
│     - 초점 및 DOF 컨트롤                             │
├─────────────────────────────────────────────────────┤
│  2. 조명 시스템 (Lighting System)                    │
│     - 조명 패턴 (Rembrandt, Butterfly, Split 등)    │
│     - 광질 (Hard/Soft)                              │
│     - 색온도 및 시간대                               │
│     - Key:Fill:Back 비율 설정                       │
├─────────────────────────────────────────────────────┤
│  3. 색감 및 질감 (Color & Texture)                   │
│     - 필름 스톡 선택 (Portra, Velvia 등)            │
│     - 디지털 컬러 프로파일 (Log, S-Log 등)           │
│     - 입자감 조절                                    │
│     - 렌즈 효과 (비네팅, 플레어, 색수차)             │
├─────────────────────────────────────────────────────┤
│  4. 예술적 연출 (Art Direction)                      │
│     - 구도 규칙 (3분할법, 황금비율 등)               │
│     - 카메라 앵글                                    │
│     - 포토그래퍼 스타일 (Annie Leibovitz 등) ⭐     │
│     - 환경 효과 (안개, 파티클 등)                    │
├─────────────────────────────────────────────────────┤
│  5. 품질 및 메타데이터 (Quality Control)             │
│     - 품질 레벨 선택 (표준/고급/프리미엄)            │
│     - 메타 토큰 (CR3, EXIF 시뮬레이션)              │
│     - 플랫폼 최적화                                  │
│     - 네거티브 프롬프트 관리                         │
├─────────────────────────────────────────────────────┤
│  6. 사용자 입력 (User Description)                   │
│     - 피사체 자유 묘사 (텍스트)                      │
│     - 분위기/스타일 자유 묘사 (텍스트)               │
│     - AI 자동 정제 옵션                              │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│              프롬프트 생성 엔진 (Core)                │
│  - 결정론적 키워드 매핑                              │
│  - AI 텍스트 정제                                    │
│  - 프롬프트 조합 및 최적화                           │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│                   출력 (Output)                      │
│  - 최종 Positive Prompt                             │
│  - 최종 Negative Prompt                             │
│  - 설정값 메타데이터 (JSON)                         │
│  - 프리뷰 이미지 (선택)                              │
│  - 버전 관리 (설정 저장/불러오기)                    │
└─────────────────────────────────────────────────────┘
```

### 2.2 세부 기능 명세

#### 2.2.1 카메라 및 광학 (Section 1)

**카메라 바디 선택**
- 드롭다운: 주요 브랜드별 (Canon, Nikon, Sony, Hasselblad, Leica)
- 계층 구조:
  ```
  Canon
    └─ Full Frame
        ├─ EOS R5
        ├─ EOS R3
        └─ 5D Mark IV
    └─ APS-C
        └─ R7
  ```
- 자동 정보 표시:
  - 센서 크기
  - 메가픽셀
  - 색감 특성 ("따뜻한 스킨톤", "정확한 재현" 등)

**렌즈 선택**
- 화각별 필터링:
  - 초광각 (14-24mm)
  - 광각 (24-35mm)
  - 표준 (35-70mm)
  - 중망원 (70-135mm)
  - 망원 (135mm+)
- 용도별 추천:
  - 인물: 85mm f/1.4, 135mm f/1.8
  - 풍경: 24mm f/1.4, 16-35mm f/2.8
  - 제품: 100mm Macro
- 브랜드 자동 매칭 (선택한 바디에 맞는 렌즈만 표시)

**카메라 설정**
- ISO 슬라이더: 100 ~ 12800
  - 실시간 "Grain Preview" 표시
- 조리개 슬라이더: f/1.2 ~ f/22
  - **실시간 DOF 시뮬레이션** ⭐ 신규
    - 슬라이더 조절 시 예시 피사체의 배경이 흐려지는 애니메이션 (SVG/Canvas)
    - 전경/중경/배경의 선명도를 시각적으로 표시
    - 화각 + 조리개의 관계를 직관적으로 이해
- 셔터스피드: 1/8000 ~ 30초
  - 모션블러 효과 표시
  - 삼각대 필요 여부 경고 (< 1/60초)
- 화이트밸런스: 2700K ~ 10000K
  - 색온도 그라데이션 바
  - 시간대 자동 제안 (Golden Hour → 2800K)

#### 2.2.2 조명 시스템 (Section 2)

**조명 패턴 선택**
- 시각적 다이어그램으로 선택:
  ```
  [그림: 얼굴 정면도]
  
  ● Rembrandt    ● Butterfly
  ● Split        ● Loop
  ● Broad        ● Short
  ```
- 각 패턴 클릭 시:
  - 예시 이미지 표시
  - 광원 위치 설명
  - 적합한 용도

**3D Interactive Light Stage** ⭐ 신규 핵심 기능
- 가상의 3D 얼굴/인물 모델 위에 광원 위치를 드래그
- 실시간으로 그림자 변화 시뮬레이션
- 광원 개수, 강도, 거리 조절 가능
- 구현 기술:
  - Three.js 또는 Babylon.js
  - 간단한 PBR(Physically Based Rendering) 셰이딩
  - 프리셋 버튼으로 유명 조명 패턴 즉시 적용
- 교육 효과:
  - 포토그래퍼가 조명 배치를 실험하고 학습
  - "왜 이 각도에서 삼각형이 생기는지" 직관적 이해

**광질 및 도구**
- 토글: Hard Light ↔ Soft Light
- 세부 옵션:
  - Softbox 크기 (60cm, 90cm, 120cm)
  - Umbrella (반투명, 반사)
  - Beauty Dish
  - Snoot
- **광원별 영향도 슬라이더:** 각 광원이 최종 프롬프트에 미치는 가중치 조절

**색온도 및 시간대**
- 프리셋 버튼:
  - Golden Hour (2800K)
  - Daylight (5600K)
  - Overcast (6500K)
  - Blue Hour (7000K)
  - Tungsten (3200K)
- 커스텀 슬라이더

**Key:Fill:Back 비율**
- 3개의 연동 슬라이더
- 프리셋:
  - 고대비: 8:1:1
  - 표준: 4:2:1
  - 저대비: 2:1.5:0.5

#### 2.2.3 색감 및 질감 (Section 3)

**필름 스톡 선택**
- 비주얼 썸네일로 표시:
  ```
  [Kodak Portra 400]  [Fuji Velvia 50]  [Ilford HP5]
  따뜻한 스킨톤        강렬한 색감       고대비 흑백
  ```
- 각 필름 클릭 시:
  - 특성 설명
  - 추천 용도
  - 컬러 프로파일 미리보기

**디지털 컬러 프로파일**
- Canon Log / Sony S-Log3 / ProRes RAW
- 선택 시 "평평한 색감, 후보정 여지" 경고 표시

**입자감 조절**
- 슬라이더: None → Heavy
- ISO 값과 연동하여 자동 제안

**렌즈 효과**
- 체크박스:
  - ☐ 비네팅 (어둡게)
  - ☐ 렌즈 플레어
  - ☐ 색수차
  - ☐ 보케 스타일 (원형/육각형/소용돌이)

#### 2.2.4 예술적 연출 (Section 4)

**구도 규칙**
- 라디오 버튼:
  - ○ Rule of Thirds
  - ○ Golden Ratio
  - ○ Center Composition
  - ○ Leading Lines
  - ○ Symmetry

**카메라 앵글**
- 시각적 선택:
  ```
  ↗ High Angle    → Eye Level    ↘ Low Angle
  
  ⬆ Bird's Eye    ⬇ Worm's Eye
  ```

**포토그래퍼 스타일** ⭐ **신규 핵심 기능**

**스타일 레이어링 & Deep Mapping:**
- 포토그래퍼 선택 시 단순히 이름만 추가하는 것이 아니라:
  - **해당 작가가 선호했던 렌즈와 조명 세팅값이 자동으로 UI 슬라이더에 적용**
  - 사용자는 거기서 Fine-tuning 가능
  - 컨셉: "거장의 세팅에서 시작하는 나만의 사진"

**시대적 고증:**
- Ansel Adams 선택 → 자동으로:
  - 흑백 필름 (Ilford HP5)
  - 높은 대비 설정
  - Zone System 프리셋
  - f/64 (깊은 DOF)
- Steve McCurry 선택 → 자동으로:
  - Kodachrome 64 필름
  - 따뜻한 색온도 (Golden Hour)
  - 생생한 채도
  
**스타일 프로파일 기반 동작:**
- 작가명을 직접 토큰으로 사용하기보다, 스타일을 분해:
  - 조명 특성
  - 구도 특성
  - 색상 팔레트
  - 무드
  - 후반작업 특성
- UI 옵션:
  - ☐ "In the style of [작가명]" 직접 언급 (기본: OFF)
  - ☑ 스타일 특성만 적용 (법적 리스크 최소화)

- 카테고리별 분류:
  
  **초상/패션:**
  - Annie Leibovitz (강렬한 개성, 내러티브)
    - 자동 적용: 자연광 선호, 환경적 컨텍스트, 대형 포맷
  - Peter Lindbergh (흑백, 자연스러운 미)
    - 자동 적용: 흑백 필름, 소프트 자연광, 최소 리터칭
  - Richard Avedon (미니멀 배경, 강렬한 초점)
    - 자동 적용: 순백 배경, 중형 포맷, 정면 조명
  
  **풍경/자연:**
  - Ansel Adams (흑백, 높은 대비, Zone System)
  - Sebastião Salgado (다큐멘터리, 사회적 메시지)
  - Steve McCurry (생생한 컬러, 문화적 깊이)
  
  **다큐멘터리/스트리트:**
  - Henri Cartier-Bresson (결정적 순간)
  - Vivian Maier (일상의 시선)
  
  **상업/제품:**
  - Irving Penn (미니멀, 정물)
  - Helmut Newton (강렬한 대비)

**마켓플레이스 확장:**
- 향후 "스타일 프로파일"을 상품 단위로 판매
- 커뮤니티 제작 프리셋 공유

**환경 효과**
- 체크박스:
  - ☐ Fog/Mist
  - ☐ Rain
  - ☐ Dust Particles
  - ☐ Lens Dust Spots
  - ☐ Light Leaks

#### 2.2.5 품질 및 메타데이터 (Section 5)

**품질 레벨 - 성공률 중심 재정의**

기존의 단순한 해상도 차이가 아닌, **"샷 성공률을 올리는 안전장치 묶음"**으로 정의:

```
┌─ 표준 ──────────────────────────┐
│ • 1024×1024px                   │
│ • 빠른 생성 (~10초)             │
│ • 기본 품질 키워드              │
│ • 기본 충돌 검사                │
└─────────────────────────────────┘

┌─ 고급 (권장) ───────────────────┐
│ • 1024×1024px                   │
│ • 향상된 디테일 (~15초)         │
│ • 전문가급 키워드               │
│ • 충돌 검사 강화 ⭐            │
│ • 프롬프트 길이/중복 최적화 ⭐  │
│ • 핵심 슬롯 가중치 조정 ⭐      │
└─────────────────────────────────┘

┌─ 프리미엄 ──────────────────────┐
│ • 2048×2048px (AI 업스케일)     │
│ • 최고 디테일 (~30초)           │
│ • 최고급 키워드 + 후처리        │
│ • 네거티브 프롬프트 강화 ⭐    │
│ • Seed/Variation 제어 ⭐       │
│ • 멀티샷 + 베스트 셀렉션 ⭐     │
└─────────────────────────────────┘
```

**Smart Negative Prompt** ⭐ 신규

상황 맞춤형 자동 생성:
- 선택한 카메라가 **Leica M11** → 디지털 노이즈 차단 키워드 자동 추가
  - "digital noise, sensor artifacts, over-processed"
- **필름 스톡** 선택 → 지나치게 매끄러운 피부 차단
  - "plastic skin, waxy skin, overly smooth, digital perfection"
- **제품 사진** 모드 → 반사/그림자 관련 네거티브 강화
  - "harsh glare, uneven shadows, color cast"

네거티브 프롬프트 프리셋:
- 포트레이트 (기본/전문가)
- 제품 사진
- 풍경
- **결과 기반 자동 튜닝:** ⭐
  - 사용자가 체크한 실패 유형 라벨링
    - 손/얼굴 왜곡
    - 텍스트 깨짐
    - 과도한 보케
    - 피부 플라스틱 질감
  - 해당 실패에 대응하는 네거티브 토큰 세트 학습 (룰 기반 + A/B)
  - "재시도 횟수 감소" KPI 개선

**EXIF 데이터 스트립** ⭐ 신규

생성된 이미지 하단에 실제 사진처럼 데이터 표시:
```
┌────────────────────────────────────────┐
│                                        │
│         [생성된 이미지]                 │
│                                        │
├────────────────────────────────────────┤
│ Canon EOS R5 │ RF 85mm f/1.2L         │
│ f/1.4 │ ISO 200 │ 1/200s │ 5600K     │
└────────────────────────────────────────┘
```
- 브랜드 홍보 효과 (공유 시 Lumina Promptus 노출)
- 포토그래퍼들의 설정 공유 문화 활성화

**메타 토큰 자동 적용**
- 선택한 카메라에 따라 자동 생성:
  - Canon EOS R5 → "CR3_CANON_EOS_R5"
  - Sony A1 → "ARW_SONY_A1"
- EXIF 시뮬레이션 문자열 자동 생성

**플랫폼 최적화**
- 용도 선택:
  - Instagram (1:1, 4:5)
  - 제품 사진 (Amazon 가이드라인)
  - 인쇄용 (300 DPI 고려)
  - 웹용 (sRGB)

#### 2.2.6 사용자 입력 (Section 6)

**피사체 묘사**
- 텍스트 입력창:
  ```
  예: "30대 여성이 자연스럽게 웃는 모습, 긴 머리"
  ```
  
**비주얼 태깅** ⭐ 신규
- 사용자가 입력하는 동안 AI가 실시간 분석
- 관련 키워드를 태그 형태로 추천:
  ```
  입력: "웃는 모습"
  
  추천 태그: [Genuine smile] [Candid] [Visible teeth] 
            [Dimples] [Laugh lines]
  ```
- 클릭으로 추가하여 텍스트 입력 부담 감소

**AI 정제 - 2단계 프로세스** ⭐ 개선

기존 단일 refine 대신:

**1단계: 의미 보존형 정제**
- 모호어 제거
- 관찰 가능한 디테일로 변환
- 원본: "예쁜 여자가 웃고 있어요"
- 정제: "woman in her late 20s, genuine smile with visible teeth, soft wavy brown hair"

**2단계: 컨텍스트 정합형 정제**
- 현재 카메라/조명/구도 선택과 충돌 제거
- 예: 선택한 조명이 "Hard Light"인데 "soft lighting"이 묘사에 있으면 제거
- 선택한 앵글이 "Low Angle"인데 "eye level"이 있으면 조정

**의미 보존 검증** ⭐ 핵심
- 정제 전후 핵심 엔티티 비교:
  - 성별
  - 연령대
  - 행동 (웃음, 걷기 등)
  - 소품 (모자, 안경 등)
  - 배경 (실내/실외)
  - 시간대
- 바뀌면 사용자에게 알림:
  ```
  ⚠️ AI 정제 결과 확인:
  원문: "소녀가 공원에서 뛰어다니는 모습"
  정제: "young woman running through urban park"
  
  변경사항: "소녀" → "young woman"으로 연령대 상향
  [원문 유지] [정제 수락]
  ```

**분위기/스타일 묘사**
- 텍스트 입력창:
  ```
  예: "따뜻하고 자연스러운 느낌"
  ```
- AI 해석:
  - "warm honey tones, soft diffused ambiance, natural window light feel"
  
**즉시 프리뷰**
- 입력 즉시 아래에 프롬프트 미리보기 표시
- Before/After diff 표시 (변경된 부분 하이라이트)

---

## 3. 기술 아키텍처

### 3.1 전체 시스템 구조 (v1.1 개선)

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (React)                   │
│  ┌───────────────────────────────────────────────┐  │
│  │  UI Components (설정 패널, 슬라이더 등)       │  │
│  └───────────────┬───────────────────────────────┘  │
│                  │                                   │
│  ┌───────────────▼───────────────────────────────┐  │
│  │  State Management (Zustand)                  │  │
│  │  - 카메라 설정 상태                           │  │
│  │  - 조명 설정 상태                             │  │
│  │  - 프롬프트 빌더 상태                         │  │
│  └───────────────┬───────────────────────────────┘  │
│                  │                                   │
│  ┌───────────────▼───────────────────────────────┐  │
│  │  Prompt Builder v2 (IR 기반) ⭐ 개선          │  │
│  │  - 결정론적 키워드 매핑                       │  │
│  │  - 중립적 내부 표현(IR) 생성                  │  │
│  │  - 슬롯별 목적/제약/충돌 규칙                 │  │
│  └───────────────┬───────────────────────────────┘  │
│                  │                                   │
│  ┌───────────────▼───────────────────────────────┐  │
│  │  Model-specific Exporters ⭐ 신규             │  │
│  │  - Nano Banana Pro Exporter                  │  │
│  │  - Midjourney Exporter (향후)                │  │
│  │  - Stable Diffusion Exporter (향후)          │  │
│  └───────────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ API Calls
                   │
┌──────────────────▼──────────────────────────────────┐
│                Backend (Node.js)                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  API Routes                                   │  │
│  │  - POST /api/refine-description (2단계) ⭐    │  │
│  │  - POST /api/validate-entities ⭐ 신규        │  │
│  │  - POST /api/interpret-mood                   │  │
│  │  - POST /api/generate-image                   │  │
│  │  - POST /api/analyze-failure ⭐ 신규          │  │
│  │  - GET  /api/presets                          │  │
│  └───────────────┬───────────────────────────────┘  │
│                  │                                   │
│  ┌───────────────▼───────────────────────────────┐  │
│  │  AI Services                                  │  │
│  │  - Claude API (텍스트 정제 + 검증)           │  │
│  │  - Nano Banana Pro (이미지 생성)             │  │
│  └───────────────┬───────────────────────────────┘  │
│                  │                                   │
│  ┌───────────────▼───────────────────────────────┐  │
│  │  Analytics & Learning ⭐ 신규                 │  │
│  │  - 실패 패턴 분석                             │  │
│  │  - 네거티브 프롬프트 학습                     │  │
│  │  - A/B 테스트 자동화                          │  │
│  └───────────────┬───────────────────────────────┘  │
│                  │                                   │
│  ┌───────────────▼───────────────────────────────┐  │
│  │  Database (PostgreSQL)                        │  │
│  │  - 사용자 설정 저장                           │  │
│  │  - 프롬프트 버전 관리                         │  │
│  │  - 실패 라벨 데이터                           │  │
│  │  - 이벤트 스키마 (측정 가능한 평가)           │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### 3.2 핵심 설계 원칙 (v1.1 강화)

**IR(Intermediate Representation) 기반 구조** ⭐ 핵심 개선

```
사용자 설정 (UI)
       ↓
슬롯별 검증 & 충돌 해결
       ↓
중립적 내부 표현 (IR) 생성
       ↓
모델별 Exporter 선택
       ↓
최종 프롬프트 (Nano Banana Pro / Midjourney / SD 등)
```

**IR의 장점:**
- ✅ 모델 추가 시 Exporter만 작성
- ✅ 같은 설정 → 모델별 최적 프롬프트
- ✅ 충돌/중복 규칙 중앙 관리
- ✅ A/B 테스트 용이

**슬롯 시스템:**
```typescript
interface PromptSlot {
  id: string;
  purpose: string;          // "카메라 메타데이터"
  priority: number;         // 1-10 (높을수록 중요)
  maxTokens: number;        // 토큰 예산
  conflicts: string[];      // 충돌하는 슬롯 ID
  dependencies: string[];   // 필요한 슬롯 ID
  validation: (value: any) => boolean;
}
```

**충돌 해결 예시:**
```
포토그래퍼 스타일: "Peter Lindbergh"
  → 자동 적용: 흑백, 소프트 라이트
  
필름 스톡: "Kodak Portra 400" (컬러 필름)
  → 충돌 감지!
  
시스템 제안:
"Peter Lindbergh 스타일은 흑백을 사용합니다.
 컬러 필름과 충돌합니다. 다음 중 선택하세요:
 1. Lindbergh 스타일 유지 (흑백 자동 적용)
 2. Portra 400 우선 (스타일 조명만 적용)
 3. 둘 다 적용 (실험적)"
```

---

## 4. 데이터 구조 설계 (v1.1 개선)

### 4.1 TypeScript 타입 정의

```typescript
// types/index.ts

// ===== 중립적 내부 표현 (IR) ⭐ 신규 =====
export interface PromptIR {
  slots: {
    [slotId: string]: SlotContent;
  };
  metadata: {
    conflicts: ConflictReport[];
    warnings: string[];
    suggestions: string[];
  };
  version: string;
  timestamp: number;
}

export interface SlotContent {
  slotId: string;
  content: string;
  priority: number;
  tokens: number;
  source: 'deterministic' | 'ai_refined' | 'user_direct';
  locked: boolean; // true면 다른 슬롯이 덮어쓸 수 없음
}

export interface ConflictReport {
  type: 'slot_conflict' | 'value_mismatch' | 'missing_dependency';
  severity: 'error' | 'warning' | 'info';
  slots: string[];
  message: string;
  suggestions: ConflictResolution[];
}

export interface ConflictResolution {
  action: 'override' | 'merge' | 'skip' | 'ask_user';
  description: string;
  expectedOutcome: string;
}

// ===== 슬롯 정의 ⭐ 신규 =====
export interface PromptSlot {
  id: string;
  name: string;
  purpose: string;
  priority: number; // 1-10
  maxTokens: number;
  conflicts: string[]; // 충돌하는 슬롯 ID들
  dependencies: string[]; // 이 슬롯이 필요로 하는 슬롯들
  validation: (value: string) => ValidationResult;
  mergeStrategy: 'replace' | 'append' | 'prepend' | 'custom';
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// ===== 기존 UserSettings (개선) =====
export interface UserSettings {
  camera: {
    bodyId: string;
    lensId: string;
    iso: number;
    aperture: string;
    shutterSpeed: string;
    whiteBalance: number;
  };
  lighting: {
    patternId: string;
    quality: 'hard' | 'soft';
    colorTemp: number;
    timeOfDay?: string;
    keyFillBackRatio: string;
  };
  colorGrading: {
    filmStock?: string;
    digitalProfile?: string;
    grainLevel: number;
    vignetting: boolean;
    lensFlare: boolean;
    chromaticAberration: boolean;
  };
  artDirection: {
    compositionRule: string;
    cameraAngle: string;
    shotType: string;
    photographerStyleId?: string;
    environmentEffects: string[];
  };
  quality: {
    level: 'standard' | 'high' | 'premium';
    negativePresetId: string;
    customNegatives: string[];
    autoTuneNegative: boolean; // ⭐ 신규: 결과 기반 자동 튜닝
  };
  userInput: {
    subjectDescription: string;
    moodDescription: string;
  };
}

// ===== 생성된 프롬프트 (IR 기반) ⭐ 개선 =====
export interface GeneratedPrompt {
  ir: PromptIR; // ⭐ 신규: 중립적 내부 표현
  rendered: {
    [model: string]: {
      positive: string;
      negative: string;
    };
  };
  metadata: {
    deterministic: {
      camera: string;
      lighting: string;
      composition: string;
      quality: string;
    };
    aiRefined: {
      subject: {
        original: string;
        refined: string;
        entitiesPreserved: boolean; // ⭐ 신규: 의미 보존 검증
      };
      style: {
        original: string;
        refined: string;
      };
    };
    diff: PromptDiff[]; // ⭐ 신규: 변경 이력
  };
  versionId: string;
  timestamp: number;
}

// ===== Before/After Diff ⭐ 신규 =====
export interface PromptDiff {
  slotId: string;
  before: string;
  after: string;
  changeType: 'added' | 'removed' | 'modified';
  impact: {
    description: string; // "grain 증가 예상"
    severity: 'low' | 'medium' | 'high';
  };
}

// ===== 실패 라벨링 ⭐ 신규 =====
export interface FailureLabel {
  id: string;
  promptId: string;
  failureTypes: FailureType[];
  userFeedback: string;
  timestamp: number;
}

export type FailureType = 
  | 'hand_distortion'
  | 'face_distortion'
  | 'text_artifact'
  | 'excessive_bokeh'
  | 'plastic_skin'
  | 'color_cast'
  | 'wrong_composition'
  | 'missing_elements'
  | 'extra_elements';
```

### 4.2 슬롯 시스템 정의

```typescript
// config/slots/slot-definitions.ts

export const PROMPT_SLOTS: PromptSlot[] = [
  {
    id: 'meta_tokens',
    name: 'Meta Tokens',
    purpose: '카메라 메타데이터 (EXIF 시뮬레이션)',
    priority: 10,
    maxTokens: 50,
    conflicts: [],
    dependencies: [],
    validation: (value) => ({
      valid: /^(CR3|ARW|NEF|DNG)_/.test(value),
      errors: [],
      warnings: []
    }),
    mergeStrategy: 'replace'
  },
  {
    id: 'camera_body',
    name: 'Camera Body',
    purpose: '카메라 바디 및 센서 특성',
    priority: 9,
    maxTokens: 100,
    conflicts: [],
    dependencies: ['meta_tokens'],
    validation: (value) => ({
      valid: value.length > 0,
      errors: [],
      warnings: []
    }),
    mergeStrategy: 'replace'
  },
  {
    id: 'lighting',
    name: 'Lighting Setup',
    purpose: '조명 패턴 및 광질',
    priority: 8,
    maxTokens: 150,
    conflicts: [],
    dependencies: [],
    validation: (value) => ({
      valid: true,
      errors: [],
      warnings: []
    }),
    mergeStrategy: 'append'
  },
  {
    id: 'photographer_style',
    name: 'Photographer Style',
    purpose: '포토그래퍼 스타일 프로파일',
    priority: 7,
    maxTokens: 200,
    conflicts: ['color_grading'], // 흑백 스타일 vs 컬러 필름
    dependencies: [],
    validation: (value) => ({
      valid: true,
      errors: [],
      warnings: []
    }),
    mergeStrategy: 'custom'
  },
  {
    id: 'color_grading',
    name: 'Color Grading',
    purpose: '색감 및 필름 스톡',
    priority: 6,
    maxTokens: 100,
    conflicts: ['photographer_style'],
    dependencies: [],
    validation: (value) => ({
      valid: true,
      errors: [],
      warnings: []
    }),
    mergeStrategy: 'replace'
  },
  {
    id: 'subject',
    name: 'Subject Description',
    purpose: '피사체 묘사',
    priority: 9,
    maxTokens: 200,
    conflicts: [],
    dependencies: [],
    validation: (value) => ({
      valid: value.length > 0,
      errors: value.length === 0 ? ['피사체 묘사 필수'] : [],
      warnings: []
    }),
    mergeStrategy: 'replace'
  },
  {
    id: 'composition',
    name: 'Composition',
    purpose: '구도 및 앵글',
    priority: 5,
    maxTokens: 80,
    conflicts: [],
    dependencies: [],
    validation: (value) => ({
      valid: true,
      errors: [],
      warnings: []
    }),
    mergeStrategy: 'append'
  },
  {
    id: 'quality',
    name: 'Quality Keywords',
    purpose: '품질 향상 키워드',
    priority: 4,
    maxTokens: 100,
    conflicts: [],
    dependencies: [],
    validation: (value) => ({
      valid: true,
      errors: [],
      warnings: []
    }),
    mergeStrategy: 'append'
  },
  {
    id: 'negative',
    name: 'Negative Prompt',
    purpose: '네거티브 프롬프트',
    priority: 10,
    maxTokens: 300,
    conflicts: [],
    dependencies: [],
    validation: (value) => ({
      valid: true,
      errors: [],
      warnings: []
    }),
    mergeStrategy: 'append'
  }
];
```

### 4.3 충돌 해결 규칙

```typescript
// lib/conflict-resolver/rules.ts

export interface ConflictRule {
  condition: (ir: PromptIR) => boolean;
  severity: 'error' | 'warning' | 'info';
  message: string;
  resolutions: ConflictResolution[];
}

export const CONFLICT_RULES: ConflictRule[] = [
  {
    condition: (ir) => {
      const style = ir.slots['photographer_style']?.content || '';
      const color = ir.slots['color_grading']?.content || '';
      return style.includes('black and white') && color.includes('Portra');
    },
    severity: 'warning',
    message: '흑백 스타일과 컬러 필름이 충돌합니다',
    resolutions: [
      {
        action: 'override',
        description: '스타일 우선 (흑백 적용)',
        expectedOutcome: '컬러 필름 설정이 무시되고 흑백으로 생성됩니다'
      },
      {
        action: 'override',
        description: '필름 우선 (컬러 유지)',
        expectedOutcome: '스타일의 조명/구도만 적용되고 컬러는 유지됩니다'
      },
      {
        action: 'merge',
        description: '실험적 조합',
        expectedOutcome: '두 설정 모두 적용되지만 결과 예측 어려움'
      }
    ]
  },
  {
    condition: (ir) => {
      const lighting = ir.slots['lighting']?.content || '';
      const style = ir.slots['style']?.content || '';
      return lighting.includes('hard light') && style.includes('soft');
    },
    severity: 'info',
    message: '조명 설정과 분위기 묘사가 상충될 수 있습니다',
    resolutions: [
      {
        action: 'ask_user',
        description: '사용자에게 확인',
        expectedOutcome: '사용자가 의도한 것인지 확인 후 진행'
      }
    ]
  }
];
```

### 4.2 포토그래퍼 스타일 데이터 구조

```typescript
// config/mappings/photographer-styles.ts

export interface PhotographerStyle {
  id: string;
  name: string;
  category: 'portrait' | 'landscape' | 'documentary' | 'commercial' | 'fashion';
  era: string;
  keywords: string;
  characteristics: {
    lighting: string;
    colorPalette: string;
    composition: string;
    mood: string;
  };
  technicalNotes: string;
  examplePrompt: string;
  thumbnail: string;
}

export const PHOTOGRAPHER_STYLES: PhotographerStyle[] = [
  {
    id: 'annie_leibovitz',
    name: 'Annie Leibovitz',
    category: 'portrait',
    era: '1970s-present',
    keywords: 'in the style of Annie Leibovitz',
    characteristics: {
      lighting: 'dramatic natural light, strong shadows, environmental context',
      colorPalette: 'rich, saturated colors, bold contrasts',
      composition: 'narrative-driven, subject in context, often full-body or environmental',
      mood: 'powerful, intimate, storytelling'
    },
    technicalNotes: 'large format cameras, natural light preference, minimal retouching',
    examplePrompt: 'portrait in the style of Annie Leibovitz, dramatic natural lighting, environmental context, strong personality, narrative composition',
    thumbnail: '/styles/leibovitz.jpg'
  },
  // ... 15-20명의 포토그래퍼 데이터
];
```

---

## 5. 프롬프트 생성 알고리즘 (v1.1 IR 기반 재설계)

### 5.1 PromptBuilder v2 - IR 기반 아키텍처

```typescript
// lib/prompt-builder/PromptBuilderV2.ts

import { PROMPT_SLOTS } from '@/config/slots/slot-definitions';
import { CONFLICT_RULES } from '@/lib/conflict-resolver/rules';

export class PromptBuilderV2 {
  private ir: PromptIR;
  private settings: UserSettings;

  constructor(settings: UserSettings) {
    this.settings = settings;
    this.ir = {
      slots: {},
      metadata: {
        conflicts: [],
        warnings: [],
        suggestions: []
      },
      version: '2.0',
      timestamp: Date.now()
    };
  }

  // ===== Phase 1: IR 생성 =====
  async buildIR(): Promise<PromptIR> {
    // 1. 결정론적 슬롯 채우기
    this.fillDeterministicSlots();

    // 2. AI 정제 슬롯 채우기
    await this.fillAIRefinedSlots();

    // 3. 충돌 감지 및 해결
    this.detectAndResolveConflicts();

    // 4. 가중치 및 우선순위 적용
    this.applyPriorities();

    return this.ir;
  }

  // ===== 1. 결정론적 슬롯 =====
  private fillDeterministicSlots(): void {
    // 메타 토큰
    this.setSlot('meta_tokens', this.getMetaTokens(), {
      priority: 10,
      source: 'deterministic',
      locked: true
    });

    // 카메라 바디
    this.setSlot('camera_body', this.getCameraBody(), {
      priority: 9,
      source: 'deterministic',
      locked: true
    });

    // 렌즈
    this.setSlot('lens', this.getLens(), {
      priority: 9,
      source: 'deterministic',
      locked: true
    });

    // 카메라 설정
    this.setSlot('camera_settings', this.getCameraSettings(), {
      priority: 8,
      source: 'deterministic',
      locked: false
    });

    // 조명
    this.setSlot('lighting', this.getLighting(), {
      priority: 8,
      source: 'deterministic',
      locked: false
    });

    // 구도
    this.setSlot('composition', this.getComposition(), {
      priority: 5,
      source: 'deterministic',
      locked: false
    });

    // 포토그래퍼 스타일 (특별 처리)
    if (this.settings.artDirection.photographerStyleId) {
      this.applyPhotographerStyle(
        this.settings.artDirection.photographerStyleId
      );
    }

    // 품질
    this.setSlot('quality', this.getQualityKeywords(), {
      priority: 4,
      source: 'deterministic',
      locked: false
    });

    // 네거티브
    this.setSlot('negative', this.getNegativePrompt(), {
      priority: 10,
      source: 'deterministic',
      locked: false
    });
  }

  // ===== 2. AI 정제 슬롯 =====
  private async fillAIRefinedSlots(): Promise<void> {
    if (!this.settings.userInput.subjectDescription) return;

    // 2단계 정제 프로세스
    const refined = await this.refineUserInput(
      this.settings.userInput.subjectDescription
    );

    this.setSlot('subject', refined.text, {
      priority: 9,
      source: 'ai_refined',
      locked: false
    });

    // 의미 보존 검증
    if (!refined.entitiesPreserved) {
      this.ir.metadata.warnings.push(
        '피사체 묘사가 크게 변경되었습니다. 확인이 필요합니다.'
      );
    }

    // 분위기/스타일
    if (this.settings.userInput.moodDescription) {
      const moodRefined = await this.interpretMood(
        this.settings.userInput.moodDescription
      );
      
      this.setSlot('style', moodRefined, {
        priority: 6,
        source: 'ai_refined',
        locked: false
      });
    }
  }

  // ===== 3. 충돌 감지 및 해결 =====
  private detectAndResolveConflicts(): void {
    for (const rule of CONFLICT_RULES) {
      if (rule.condition(this.ir)) {
        const conflict: ConflictReport = {
          type: 'slot_conflict',
          severity: rule.severity,
          slots: this.extractAffectedSlots(rule),
          message: rule.message,
          suggestions: rule.resolutions
        };

        this.ir.metadata.conflicts.push(conflict);

        // 자동 해결 시도 (severity가 'info'일 때만)
        if (rule.severity === 'info' && rule.resolutions[0]) {
          this.applyResolution(rule.resolutions[0]);
        }
      }
    }
  }

  // ===== 4. 우선순위 적용 =====
  private applyPriorities(): void {
    // 토큰 예산 초과 시 낮은 우선순위 슬롯 트리밍
    const totalTokens = Object.values(this.ir.slots)
      .reduce((sum, slot) => sum + slot.tokens, 0);

    if (totalTokens > 1500) { // Nano Banana Pro 최적 길이
      this.trimLowPrioritySlots(1500);
    }
  }

  // ===== 포토그래퍼 스타일 Deep Mapping ⭐ =====
  private applyPhotographerStyle(styleId: string): void {
    const style = PHOTOGRAPHER_STYLES.find(s => s.id === styleId);
    if (!style) return;

    // 1. 스타일 프로파일 분해
    const profile = this.decomposeStyleProfile(style);

    // 2. UI 슬라이더 자동 조정 (실제로는 settings를 업데이트)
    this.suggestSettingsFromStyle(profile);

    // 3. 스타일 특성을 관련 슬롯에 병합
    this.mergeIntoSlot('lighting', profile.lighting);
    this.mergeIntoSlot('composition', profile.composition);
    this.mergeIntoSlot('color_grading', profile.colorPalette);

    // 4. 스타일 이름 토큰 (옵션)
    if (this.settings.artDirection.useStyleName) {
      this.setSlot('photographer_style', style.keywords, {
        priority: 7,
        source: 'deterministic',
        locked: false
      });
    }
  }

  private decomposeStyleProfile(style: PhotographerStyle) {
    return {
      lighting: style.characteristics.lighting,
      colorPalette: style.characteristics.colorPalette,
      composition: style.characteristics.composition,
      mood: style.characteristics.mood,
      technicalNotes: style.technicalNotes
    };
  }

  private suggestSettingsFromStyle(profile: any): void {
    // Annie Leibovitz → 자연광, 환경적 컨텍스트
    // Ansel Adams → 흑백, f/64, Zone System
    // 이 정보를 UI에 전달하여 사용자가 수락/거부 가능
    
    this.ir.metadata.suggestions.push(
      `이 스타일은 다음 설정을 권장합니다: ${profile.technicalNotes}`
    );
  }

  // ===== 2단계 AI 정제 ⭐ =====
  private async refineUserInput(input: string): Promise<{
    text: string;
    entitiesPreserved: boolean;
  }> {
    // Step 1: 의미 보존형 정제
    const step1 = await this.meaningPreservingRefinement(input);

    // Step 2: 컨텍스트 정합형 정제
    const step2 = await this.contextAlignedRefinement(step1);

    // Step 3: 엔티티 보존 검증
    const preserved = await this.validateEntityPreservation(input, step2);

    return {
      text: step2,
      entitiesPreserved: preserved
    };
  }

  private async meaningPreservingRefinement(input: string): Promise<string> {
    const prompt = `
Convert to precise photography description:
- Remove vague adjectives ("pretty", "nice")
- Add observable details
- Keep all core entities (gender, age, action, objects)

Input: "${input}"
Output (50 words max):`;

    return await callClaude(prompt);
  }

  private async contextAlignedRefinement(input: string): Promise<string> {
    const context = {
      lighting: this.ir.slots['lighting']?.content || '',
      composition: this.ir.slots['composition']?.content || ''
    };

    const prompt = `
Refine description to match technical context:
Context: Lighting=${context.lighting}, Composition=${context.composition}

Remove contradictions (e.g., "soft lighting" if context has hard light).

Input: "${input}"
Output (40 words max):`;

    return await callClaude(prompt);
  }

  private async validateEntityPreservation(
    original: string,
    refined: string
  ): Promise<boolean> {
    const prompt = `
Compare entities in original vs refined:
- Gender, age, action, objects, background, time

Original: "${original}"
Refined: "${refined}"

Return only: PRESERVED or CHANGED`;

    const result = await callClaude(prompt);
    return result.trim() === 'PRESERVED';
  }

  // ===== 헬퍼 메서드 =====
  private setSlot(
    slotId: string,
    content: string,
    options: {
      priority: number;
      source: SlotContent['source'];
      locked: boolean;
    }
  ): void {
    this.ir.slots[slotId] = {
      slotId,
      content,
      priority: options.priority,
      tokens: this.estimateTokens(content),
      source: options.source,
      locked: options.locked
    };
  }

  private mergeIntoSlot(slotId: string, additionalContent: string): void {
    const existing = this.ir.slots[slotId];
    if (!existing || existing.locked) return;

    const slotDef = PROMPT_SLOTS.find(s => s.id === slotId);
    if (!slotDef) return;

    switch (slotDef.mergeStrategy) {
      case 'append':
        existing.content += ', ' + additionalContent;
        break;
      case 'prepend':
        existing.content = additionalContent + ', ' + existing.content;
        break;
      case 'replace':
        existing.content = additionalContent;
        break;
    }

    existing.tokens = this.estimateTokens(existing.content);
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.split(/\s+/).length * 1.3);
  }
}
```

### 5.2 Model-specific Exporter

```typescript
// lib/exporters/NanoBananaProExporter.ts

export class NanoBananaProExporter {
  private ir: PromptIR;

  constructor(ir: PromptIR) {
    this.ir = ir;
  }

  export(): { positive: string; negative: string } {
    // IR의 슬롯들을 Nano Banana Pro 최적 순서로 조합
    const order = [
      'meta_tokens',
      'camera_body',
      'lens',
      'camera_settings',
      'lighting',
      'subject',
      'composition',
      'photographer_style',
      'color_grading',
      'style',
      'quality'
    ];

    const positiveParts = order
      .map(slotId => this.ir.slots[slotId]?.content)
      .filter(Boolean);

    const negative = this.ir.slots['negative']?.content || '';

    return {
      positive: positiveParts.join(', '),
      negative
    };
  }
}

// lib/exporters/MidjourneyExporter.ts (향후 확장)

export class MidjourneyExporter {
  private ir: PromptIR;

  constructor(ir: PromptIR) {
    this.ir = ir;
  }

  export(): { positive: string; negative: string; parameters: string } {
    // Midjourney는 순서와 포맷이 다름
    const core = [
      this.ir.slots['subject']?.content,
      this.ir.slots['style']?.content,
      this.ir.slots['lighting']?.content,
      this.ir.slots['camera_body']?.content
    ].filter(Boolean).join(', ');

    const parameters = this.buildMidjourneyParams();

    return {
      positive: core,
      negative: this.ir.slots['negative']?.content || '',
      parameters // --ar 16:9 --v 6 등
    };
  }

  private buildMidjourneyParams(): string {
    // ISO, 조리개 등을 Midjourney 파라미터로 변환
    return '--ar 16:9 --v 6 --style raw';
  }
}
```

### 5.3 Before/After Diff 생성

```typescript
// lib/diff/PromptDiffGenerator.ts

export class PromptDiffGenerator {
  static generateDiff(
    before: PromptIR,
    after: PromptIR
  ): PromptDiff[] {
    const diffs: PromptDiff[] = [];

    for (const slotId of Object.keys(after.slots)) {
      const beforeContent = before.slots[slotId]?.content || '';
      const afterContent = after.slots[slotId]?.content || '';

      if (beforeContent !== afterContent) {
        diffs.push({
          slotId,
          before: beforeContent,
          after: afterContent,
          changeType: this.determineChangeType(beforeContent, afterContent),
          impact: this.estimateImpact(slotId, beforeContent, afterContent)
        });
      }
    }

    return diffs;
  }

  private static determineChangeType(
    before: string,
    after: string
  ): PromptDiff['changeType'] {
    if (!before) return 'added';
    if (!after) return 'removed';
    return 'modified';
  }

  private static estimateImpact(
    slotId: string,
    before: string,
    after: string
  ): PromptDiff['impact'] {
    // 슬롯별 영향도 추정 로직
    const impactRules: Record<string, (b: string, a: string) => string> = {
      lighting: (b, a) => {
        if (b.includes('soft') && a.includes('hard')) {
          return '그림자 강도 증가, 대비 향상 예상';
        }
        return '조명 특성 변경';
      },
      camera_settings: (b, a) => {
        const isoChange = this.extractISO(a) - this.extractISO(b);
        if (isoChange > 400) {
          return `grain 증가, 디테일 손실 가능 (ISO +${isoChange})`;
        }
        return 'ISO 변경';
      }
    };

    const descriptionFn = impactRules[slotId];
    const description = descriptionFn 
      ? descriptionFn(before, after)
      : `${slotId} 변경`;

    return {
      description,
      severity: slotId === 'subject' ? 'high' : 'medium'
    };
  }

  private static extractISO(content: string): number {
    const match = content.match(/ISO (\d+)/);
    return match ? parseInt(match[1]) : 0;
  }
}
```

---

## 6. UI/UX 설계 (v1.1 학습 도구 강화)

### 6.1 전체 레이아웃

```
┌──────────────────────────────────────────────────────────┐
│  Header                                                   │
│  [Logo] Lumina Promptus      [Save] [Load] [Share] [Cost]│
└──────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────┐
│  설정 패널 (65%)              │  프리뷰 & 학습 (35%)       │
├──────────────────────────────┼───────────────────────────┤
│  ┌─ 1. 카메라 ─────────────┐ │ ┌─ 실시간 프롬프트 ────┐   │
│  │ [바디] [렌즈] [설정]    │ │ │ Positive:           │   │
│  │ ⚙️ DOF 시뮬레이션        │ │ │ Canon EOS R5...     │   │
│  └─────────────────────────┘ │ │                     │   │
│                              │ │ Negative:           │   │
│  ┌─ 2. 조명 ───────────────┐ │ │ blurry...           │   │
│  │ [패턴] [광질] [색온도]  │ │ └─────────────────────┘   │
│  │ 🎨 3D Light Stage        │ │                          │
│  └─────────────────────────┘ │ ┌─ 변경 이력 ⭐ ───────┐   │
│                              │ │ ISO 100→400:        │   │
│  ┌─ 3. 색감 ───────────────┐ │ │ + grain 증가 예상   │   │
│  │ [필름] [입자] [효과]    │ │ │                     │   │
│  └─────────────────────────┘ │ │ f/2.8→f/1.4:        │   │
│                              │ │ + 배경 흐림 강화    │   │
│  ┌─ 4. 예술 ───────────────┐ │ └─────────────────────┘   │
│  │ [구도] [스타일]         │ │                          │
│  │ 👤 포토그래퍼 프리셋     │ │ ┌─ 충돌 경고 ⚠️ ──────┐   │
│  └─────────────────────────┘ │ │ 흑백 스타일 vs      │   │
│                              │ │ 컬러 필름 충돌      │   │
│  ┌─ 5. 품질 ───────────────┐ │ │ [해결 방법 보기]    │   │
│  │ [레벨] [네거티브]       │ │ └─────────────────────┘   │
│  └─────────────────────────┘ │                          │
│                              │ 💰 예상 비용: $0.015     │
│  ┌─ 6. 입력 ───────────────┐ │ ⏱️  예상 시간: 15초       │
│  │ [피사체] [분위기]       │ │                          │
│  │ 🏷️ 태그 추천             │ │ [생성하기 🚀]            │
│  └─────────────────────────┘ │                          │
└──────────────────────────────┴──────────────────────────┘
```

### 6.2 핵심 UI 컴포넌트 (신규)

#### 6.2.1 Before/After Diff 표시 ⭐

```tsx
// components/PromptPreview/DiffDisplay.tsx

import { PromptDiff } from '@/types';

export function DiffDisplay({ diffs }: { diffs: PromptDiff[] }) {
  return (
    <div className="border rounded-lg p-4 bg-blue-50">
      <h3 className="font-semibold mb-2 flex items-center gap-2">
        <History size={16} />
        변경 이력
      </h3>
      
      <div className="space-y-2">
        {diffs.map((diff, idx) => (
          <div key={idx} className="text-sm">
            <div className="flex items-center gap-2">
              {diff.changeType === 'added' && (
                <Plus size={14} className="text-green-600" />
              )}
              {diff.changeType === 'removed' && (
                <Minus size={14} className="text-red-600" />
              )}
              {diff.changeType === 'modified' && (
                <Edit size={14} className="text-blue-600" />
              )}
              
              <span className="font-medium">{diff.slotId}:</span>
            </div>
            
            {/* Before → After */}
            <div className="ml-6 mt-1">
              <span className="text-red-600 line-through">
                {diff.before || '(없음)'}
              </span>
              {' → '}
              <span className="text-green-600">
                {diff.after || '(제거됨)'}
              </span>
            </div>
            
            {/* 영향도 */}
            <div className={`ml-6 mt-1 text-xs p-2 rounded ${
              diff.impact.severity === 'high' 
                ? 'bg-orange-100 text-orange-700'
                : 'bg-gray-100 text-gray-600'
            }`}>
              ℹ️ 예상 영향: {diff.impact.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### 6.2.2 Prompt Cost Calculator ⭐

```tsx
// components/CostEstimator/PromptCostCalculator.tsx

export function PromptCostCalculator({ 
  ir, 
  qualityLevel 
}: { 
  ir: PromptIR; 
  qualityLevel: 'standard' | 'high' | 'premium';
}) {
  const costs = calculateCosts(ir, qualityLevel);

  return (
    <div className="border rounded-lg p-3 bg-green-50">
      <h3 className="font-semibold text-sm mb-2">💰 예상 비용</h3>
      
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span>텍스트 정제:</span>
          <span>${costs.refinement.toFixed(4)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>이미지 생성:</span>
          <span>${costs.generation.toFixed(4)}</span>
        </div>
        
        {costs.upscale > 0 && (
          <div className="flex justify-between">
            <span>업스케일:</span>
            <span>${costs.upscale.toFixed(4)}</span>
          </div>
        )}
        
        <div className="flex justify-between font-bold border-t pt-1">
          <span>총계:</span>
          <span>${costs.total.toFixed(4)}</span>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-600">
        ⏱️ 예상 시간: {costs.estimatedTime}초
      </div>
    </div>
  );
}

function calculateCosts(ir: PromptIR, level: string) {
  const hasAIRefinement = Object.values(ir.slots)
    .some(slot => slot.source === 'ai_refined');

  return {
    refinement: hasAIRefinement ? 0.003 : 0,
    generation: 0.012,
    upscale: level === 'premium' ? 0.02 : 0,
    total: hasAIRefinement ? 0.015 : 0.012,
    estimatedTime: level === 'premium' ? 30 : level === 'high' ? 15 : 10
  };
}
```

#### 6.2.3 충돌 경고 및 해결 제안 ⭐

```tsx
// components/ConflictResolver/ConflictWarning.tsx

export function ConflictWarning({ 
  conflicts 
}: { 
  conflicts: ConflictReport[] 
}) {
  if (conflicts.length === 0) return null;

  return (
    <div className="space-y-2">
      {conflicts.map((conflict, idx) => (
        <div 
          key={idx}
          className={`border-l-4 p-3 rounded ${
            conflict.severity === 'error' 
              ? 'border-red-500 bg-red-50'
              : conflict.severity === 'warning'
              ? 'border-yellow-500 bg-yellow-50'
              : 'border-blue-500 bg-blue-50'
          }`}
        >
          <div className="flex items-start gap-2">
            {conflict.severity === 'error' && <AlertCircle className="text-red-600" size={20} />}
            {conflict.severity === 'warning' && <AlertTriangle className="text-yellow-600" size={20} />}
            {conflict.severity === 'info' && <Info className="text-blue-600" size={20} />}
            
            <div className="flex-1">
              <p className="font-medium text-sm">{conflict.message}</p>
              
              {conflict.suggestions.length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-blue-600">
                    해결 방법 보기
                  </summary>
                  
                  <div className="mt-2 space-y-2">
                    {conflict.suggestions.map((suggestion, sidx) => (
                      <button
                        key={sidx}
                        className="w-full text-left p-2 border rounded hover:bg-white text-xs"
                        onClick={() => handleResolution(suggestion)}
                      >
                        <div className="font-medium">{suggestion.description}</div>
                        <div className="text-gray-600 mt-1">
                          → {suggestion.expectedOutcome}
                        </div>
                      </button>
                    ))}
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

#### 6.2.4 비주얼 태깅 시스템 ⭐

```tsx
// components/UserInputSection/VisualTagging.tsx

export function VisualTagging({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (v: string) => void; 
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // 실시간 분석
  useEffect(() => {
    const analyze = async () => {
      if (value.length < 3) {
        setSuggestions([]);
        return;
      }

      const tags = await analyzeAndSuggest(value);
      setSuggestions(tags);
    };

    const debounced = setTimeout(analyze, 300);
    return () => clearTimeout(debounced);
  }, [value]);

  return (
    <div className="space-y-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="예: 30대 여성이 웃는 모습"
        className="w-full p-3 border rounded"
        rows={3}
      />
      
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-600">추천 태그:</span>
          {suggestions.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => onChange(value + ' ' + tag)}
              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
            >
              + {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

async function analyzeAndSuggest(input: string): Promise<string[]> {
  // AI 분석으로 관련 키워드 추천
  const response = await fetch('/api/suggest-tags', {
    method: 'POST',
    body: JSON.stringify({ input })
  });
  
  const data = await response.json();
  return data.tags;
}
```

#### 6.2.5 프롬프트 버전 비교 ⭐

```tsx
// components/VersionManager/VersionComparison.tsx

export function VersionComparison({ 
  versionA, 
  versionB 
}: {
  versionA: GeneratedPrompt;
  versionB: GeneratedPrompt;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="border rounded p-4">
        <h3 className="font-semibold mb-2">Version A</h3>
        <div className="text-sm space-y-2">
          {Object.entries(versionA.ir.slots).map(([slotId, slot]) => (
            <div key={slotId}>
              <span className="font-medium">{slotId}:</span>
              <p className="text-gray-700">{slot.content}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border rounded p-4">
        <h3 className="font-semibold mb-2">Version B</h3>
        <div className="text-sm space-y-2">
          {Object.entries(versionB.ir.slots).map(([slotId, slot]) => {
            const isDifferent = 
              versionA.ir.slots[slotId]?.content !== slot.content;
            
            return (
              <div key={slotId} className={isDifferent ? 'bg-yellow-50 p-1' : ''}>
                <span className="font-medium">{slotId}:</span>
                <p className="text-gray-700">{slot.content}</p>
                {isDifferent && (
                  <span className="text-xs text-yellow-600">⚠️ 차이 있음</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

### 6.2 반응형 디자인

```css
/* 모바일 (< 768px) */
- 세로 레이아웃
- 섹션을 아코디언으로
- 프리뷰는 하단 고정

/* 태블릿 (768px - 1024px) */
- 60/40 분할

/* 데스크탑 (> 1024px) */
- 70/30 분할
- 프리뷰 sticky positioning
```

---

## 7. 개발 단계별 계획 (v1.1 우선순위 조정)

### 개발 철학: "옵션보다 품질 레버 먼저"

v1.1에서는 더 많은 기능을 추가하기 전에, **효과가 큰 레버(quality leverage)를 확실히 체감**시키는 데 집중합니다.

**핵심 우선순위:**
1. 결정론적 매핑의 정확도
2. 충돌/중복 제거
3. Diff/변경 이력
4. 네거티브 프리셋 품질

이 4가지를 MVP의 '핵심 품질'로 먼저 고정한 후, 스타일/필름 등 옵션을 확장합니다.

### Phase 1: 핵심 품질 확립 MVP (5주)

**Week 1-2: IR 기반 인프라**
- [ ] Next.js + TypeScript 셋업
- [ ] Zustand 상태 관리
- [ ] **IR(Intermediate Representation) 타입 정의** ⭐
- [ ] **슬롯 시스템 구조 설계** ⭐
- [ ] 기본 데이터 매핑 (카메라 5개, 렌즈 8개, 조명 4개)

**Week 3: PromptBuilder v2 + 충돌 감지**
- [ ] **PromptBuilderV2 클래스 구현 (IR 기반)** ⭐
- [ ] **충돌 감지 규칙 엔진** ⭐
- [ ] 카메라 섹션 UI + 로직
- [ ] 조명 섹션 UI + 로직
- [ ] 실시간 프롬프트 프리뷰

**Week 4: Diff & 학습 도구**
- [ ] **Before/After Diff 생성 로직** ⭐
- [ ] **Diff Display UI** ⭐
- [ ] **변경 이력 추적** ⭐
- [ ] **영향도 추정 (grain 증가 등)** ⭐
- [ ] 설정 저장/불러오기 (LocalStorage)

**Week 5: 네거티브 프롬프트 품질**
- [ ] **Smart Negative Prompt 로직** ⭐
- [ ] **상황 맞춤형 자동 생성** ⭐
- [ ] 네거티브 프리셋 4개 (포트레이트, 제품, 풍경, 범용)
- [ ] 중복 제거 및 최적화
- [ ] **내부 테스트 및 피드백**

### Phase 2: 고급 기능 (4주)

**Week 6: 색감 & 구도**
- [ ] 필름 스톡 선택 (데이터 6개)
- [ ] 디지털 컬러 프로파일
- [ ] 구도 규칙 선택
- [ ] 카메라 앵글 UI

**Week 7: 포토그래퍼 스타일 Deep Mapping** ⭐
- [ ] **포토그래퍼 스타일 데이터 (10명)**
- [ ] **스타일 프로파일 분해 로직**
- [ ] **자동 UI 세팅 제안**
- [ ] **시대적 고증 적용**
- [ ] 스타일 셀렉터 UI

**Week 8: AI 통합 (2단계 정제)**
- [ ] Backend API 셋업
- [ ] **2단계 정제: 의미 보존 + 컨텍스트 정합** ⭐
- [ ] **엔티티 보존 검증** ⭐
- [ ] **비주얼 태깅 시스템** ⭐
- [ ] 사용자 입력 섹션 UI

**Week 9: 광학 시뮬레이션** ⭐
- [ ] **실시간 DOF 애니메이션 (SVG/Canvas)**
- [ ] **3D Interactive Light Stage (Three.js)** (MVP: 간단한 버전)
- [ ] 조명 패턴 프리셋 적용
- [ ] 시각적 피드백 강화

### Phase 3: 이미지 생성 & 측정 (4주)

**Week 10: Model Exporter 구조**
- [ ] **NanoBananaProExporter 구현** ⭐
- [ ] **MidjourneyExporter 스켈레톤** (향후 확장용)
- [ ] IR → 모델별 프롬프트 렌더링

**Week 11: 이미지 생성 & 평가**
- [ ] Nano Banana Pro API 통합
- [ ] 이미지 생성 워크플로우
- [ ] **실패 라벨링 UI** ⭐
- [ ] **이벤트 스키마 설계** ⭐
- [ ] **측정 가능한 평가 루프** ⭐

**Week 12: 데이터베이스 & 버전 관리**
- [ ] PostgreSQL 스키마
- [ ] **실패 패턴 데이터 수집**
- [ ] 프롬프트 히스토리
- [ ] **A/B 테스트 자동화 기초**

**Week 13: 네거티브 자동 튜닝** ⭐
- [ ] **실패 라벨 → 네거티브 토큰 매핑**
- [ ] **룰 기반 학습 시스템**
- [ ] **재시도 횟수 감소 KPI 측정**

### Phase 4: 폴리싱 & 런칭 (2주)

**Week 14: UI/UX 최종**
- [ ] **EXIF 데이터 스트립** ⭐
- [ ] **Prompt Cost Calculator** ⭐
- [ ] **충돌 경고 및 해결 제안 UI** ⭐
- [ ] **프롬프트 버전 비교 UI** ⭐
- [ ] 모바일 최적화
- [ ] 온보딩 튜토리얼

**Week 15: 베타 & 배포**
- [ ] 베타 테스터 초대 (포토그래퍼 10명)
- [ ] **2-4주 데이터 수집 및 분석**
- [ ] **"어느 슬라이더가 이탈 유발?" 분석**
- [ ] 피드백 반영
- [ ] 프로덕션 배포

---

### 기능 확장 가이드라인

**추가하기 전 자문:**
1. 이 기능이 "성공률 향상"에 기여하는가?
2. 사용자가 "조절했는데 왜 안 바뀌지?" 할 가능성은?
3. 학습 곡선이 가파르지 않은가?

**추가해도 좋은 기능:**
- ✅ 명확한 Before/After 차이
- ✅ 자동화된 품질 향상
- ✅ 실패 방지 안전장치

**추가 보류 기능:**
- ⚠️ 시각적 효과가 미미한 미세 조정
- ⚠️ 전문가만 이해하는 고급 옵션
- ⚠️ 충돌 가능성이 높은 옵션

---

## 8. 기술 스택

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand
- **UI:** shadcn/ui + Radix UI
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js 20
- **Framework:** Next.js API Routes / Express
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Cache:** Redis (선택)

### External APIs
- **Claude API:** 텍스트 정제 (~$0.003/request)
- **Nano Banana Pro:** 이미지 생성 (~$0.012/image)
- **Upscaler (선택):** Topaz/Magnific (~$0.02/upscale)

### 배포
- **Frontend:** Vercel
- **Database:** Supabase / Neon
- **Storage:** Cloudflare R2 / AWS S3
- **Monitoring:** Sentry + Vercel Analytics

---

## 9. 성능 최적화

### 9.1 프롬프트 캐싱

```typescript
// 같은 결정론적 설정 = 같은 프롬프트
const promptCache = new Map<string, GeneratedPrompt>();

function getCacheKey(settings: UserSettings): string {
  // AI 정제 부분 제외하고 해싱
  const deterministicPart = {
    camera: settings.camera,
    lighting: settings.lighting,
    // ...
  };
  return hashObject(deterministicPart);
}
```

### 9.2 실시간 프리뷰 디바운싱

```typescript
const [debouncedSettings] = useDebounce(settings, 300);
// 300ms 후에만 프롬프트 업데이트
```

### 9.3 이미지 Progressive Loading

```typescript
1. Blur placeholder
2. 썸네일 먼저 로드
3. 풀 이미지 백그라운드 로드
4. Fade in transition
```

---

## 10. 품질 키워드 전략

### 10.1 품질 키워드의 진실

**실제 효과 순위:**

```yaml
1순위 (매우 효과적): ⭐⭐⭐⭐⭐
  - "professional photography"
  - "shot on Canon EOS R5"
  - "award-winning photograph"
  
2순위 (효과적): ⭐⭐⭐⭐
  - "high detail"
  - "sharp focus"
  - "accurate skin texture"
  
3순위 (간접 효과): ⭐⭐⭐
  - "8K resolution"  # 실제 해상도는 안 올라감
  - "4K quality"
  
4순위 (미미): ⭐⭐
  - "stunning"
  - "beautiful"
  
5순위 (거의 무의미): ⭐
  - "best quality"
  - "masterpiece"
```

### 10.2 정직한 UI 표현

```
┌─ 품질 설정 ────────────────────────┐
│                                    │
│ 출력 품질:                         │
│ ○ 표준 (1024px, ~10초)            │
│ ● 고급 (1024px, ~15초)            │
│ ○ 프리미엄 (2048px 업스케일, ~30초)│
│                                    │
│ ℹ️ 참고: 기본 생성은 1024×1024    │
│   프리미엄은 AI 업스케일 포함      │
└────────────────────────────────────┘
```

### 10.3 효과적인 품질 키워드

**작동하는 것:**
✅ "professional photography" (명확한 벤치마크)
✅ "shot on Canon EOS R5" (구체적 장비)
✅ "high detail, sharp focus" (시각적 특성)
✅ 네거티브 프롬프트 (저품질 차단)

**반쯤 작동:**
⚠️ "8K resolution" (느낌은 향상, 실제 해상도는 X)

**무의미:**
❌ "best quality, masterpiece" (너무 막연)

---

## 11. 향후 확장 계획

### Phase 5: 고급 기능 (3개월 후)

1. **AI 이미지 편집**
   - 생성된 이미지 추가 편집
   - "이 부분만 밝게" 등

2. **배치 생성**
   - 같은 설정으로 variation
   - Seed 고정 옵션

3. **프리셋 마켓플레이스**
   - 유명 포토그래퍼 스타일 판매
   - 커뮤니티 공유

4. **협업 기능**
   - 팀 멤버와 설정 공유
   - 댓글/피드백

### Phase 6: 엔터프라이즈 (6개월 후)

1. **API 제공**
2. **화이트라벨**
3. **고급 분석**

---

## 부록

### A. 용어 사전

| 용어 | 설명 |
|------|------|
| DOF | 피사계 심도 |
| Bokeh | 아웃포커스 흐림 효과 |
| Rembrandt Lighting | 45도 삼각형 하이라이트 |
| Grain | 필름 입자감/노이즈 |
| Vignetting | 가장자리 어둡게 |

### B. 참고 자료

- Annie Leibovitz: "At Work"
- Ansel Adams: "The Camera", "The Negative", "The Print"
- "Light Science & Magic" by Fil Hunter

---

## 마무리

### v1.1의 핵심 개선사항 요약

Lumina Promptus v1.1은 단순한 프롬프트 생성기를 넘어, **"사진가의 촬영 의사결정을 AI 프롬프트로 컴파일하는 디지털 암실"**로 진화했습니다.

**1. IR(중립적 내부 표현) 기반 아키텍처** ⭐⭐⭐

```
문제: 모델마다 다른 프롬프트 형식 → 확장 어려움
해결: 중립적 IR 생성 → 모델별 Exporter로 렌더링
효과: Nano Banana Pro 외 Midjourney, SD 등 쉽게 추가 가능
```

**2. 슬롯 시스템 & 충돌 감지** ⭐⭐⭐

```
문제: "조절했는데 왜 안 바뀌지?" → 사용자 이탈
해결: 슬롯별 목적/제약/충돌 규칙 명시 + 자동 해결 제안
효과: 흑백 스타일 vs 컬러 필름 같은 충돌 사전 경고
```

**3. Before/After Diff & 학습 도구** ⭐⭐⭐

```
문제: 설정 변경의 영향을 알 수 없음
해결: ISO 400→1600 시 "grain 증가 예상" 표시
효과: 디버깅 도구이자 학습 도구
```

**4. 2단계 AI 정제 & 의미 보존 검증** ⭐⭐

```
문제: AI가 원문 의도를 바꿔버림
해결: 엔티티 보존 검증 → 바뀌면 사용자 확인
효과: 신뢰도 크게 향상
```

**5. Smart Negative Prompt & 결과 기반 학습** ⭐⭐

```
문제: 네거티브 프롬프트가 일반적이고 효과 미미
해결: 카메라/필름/용도별 자동 생성 + 실패 패턴 학습
효과: 재시도 횟수 70% 감소 예상
```

**6. 광학 시뮬레이션 (DOF + 3D Light Stage)** ⭐⭐

```
문제: 포토그래퍼가 아니면 설정 의미 모름
해결: 실시간 시각적 피드백
효과: 학습 곡선 완화, 진입 장벽 낮춤
```

**7. 포토그래퍼 스타일 Deep Mapping** ⭐

```
문제: 작가명만 넣으면 법적 리스크 + 효과 불분명
해결: 스타일 프로파일 분해 + UI 자동 세팅
효과: "거장의 세팅에서 시작"하는 학습 경험
```

---

### 리스크 관리 전략

#### 1. 결과 품질의 일관성 (최대 리스크)

**문제:**
- 같은 설정인데 결과가 다름
- AI 모델의 비결정성

**대응:**
- Phase 1부터 **이벤트 스키마** 설계
- 2-4주 만에 "어느 슬롯이 문제?" 데이터 확보
- 품질 레벨 '고급/프리미엄'에서:
  - Seed 고정 옵션
  - 멀티샷 + 베스트 셀렉션
  - 네거티브 강화

**측정 지표:**
- 같은 설정 → 같은 IR 생성률: 100% (결정론적 보장)
- IR → 최종 이미지 일관성: 80%+ 목표

#### 2. 학습 곡선 (두 번째 리스크)

**문제:**
- 너무 많은 선택지 → 사용자 압도
- "뭘 조절해야 할지 모르겠어요"

**대응:**
- **프리셋 중심 설계:**
  - "인물 사진", "제품 사진", "풍경" 프리셋
  - 포토그래퍼 스타일 선택 시 자동 세팅
- **점진적 공개:**
  - 초보: 프리셋만 표시
  - 중급: 기본 슬라이더 노출
  - 고급: 모든 옵션 노출
- **실시간 피드백:**
  - DOF 시뮬레이션
  - Before/After Diff
  - 영향도 표시

**측정 지표:**
- 첫 프롬프트 생성까지 시간: < 3분
- 온보딩 완료율: > 70%

#### 3. 법적/정책적 리스크 (포토그래퍼 스타일)

**문제:**
- "In the style of [작가명]" 직접 언급 → 저작권/초상권 이슈

**대응:**
- **기본값: 스타일 특성만 적용**
  - 작가명 언급 OFF
  - 조명/구도/색감 프로파일만 사용
- **옵션: 작가명 토큰 켜기**
  - 사용자 책임 명시
  - "개인 학습 목적 권장"
- **마켓플레이스:**
  - "스타일 프로파일"로 판매
  - 작가 이름 대신 "Dramatic Environmental Portrait" 같은 설명

---

### 성공 지표 (KPI) v1.1

```yaml
핵심 지표:
  프롬프트 생성 성공률:
    - 정의: 사용자가 저장/공유/다운로드한 프롬프트 비율
    - 목표: > 80%
  
  재시도 횟수:
    - 정의: 평균 몇 번 재생성하는지
    - 현재: ~10회
    - 목표: < 3회 (70% 감소)
  
  유료 전환율:
    - 무료 → Pro
    - 목표: > 5%

기술 지표:
  IR 생성 시간:
    - 목표: < 500ms (결정론적 부분)
  
  AI 정제 시간:
    - 2단계 정제
    - 목표: < 2초
  
  충돌 감지율:
    - 실제 충돌을 얼마나 잡아내는지
    - 목표: > 90%
  
  캐시 히트율:
    - 같은 설정 재사용
    - 목표: > 60%

품질 지표:
  사용자 별점:
    - 1-5점
    - 목표: > 4.5
  
  설정 재사용 비율:
    - 저장된 설정을 다시 사용
    - 목표: > 40%
  
  네거티브 자동 튜닝 효과:
    - 실패 라벨 데이터 누적 후
    - 목표: 특정 실패 유형 30% 감소
```

---

### 다음 단계 우선순위

**즉시 착수 (이번 주):**
1. ✅ v1.1 개발 계획서 최종 검토
2. ⬜ IR 타입 정의 작성 (TypeScript)
3. ⬜ 슬롯 시스템 설계 문서
4. ⬜ Next.js 프로젝트 초기화

**1주차 목표:**
- IR + 슬롯 시스템 구조 완성
- 카메라 바디 5개 데이터
- 충돌 규칙 3개 작성

**1개월 목표:**
- PromptBuilderV2 클래스 구현
- Diff 시스템 작동
- 내부 테스트 가능한 MVP

**3개월 목표:**
- 포토그래퍼 스타일 Deep Mapping 완성
- 이미지 생성 통합
- 실패 라벨링 & 학습 루프 작동

**4개월 목표:**
- 베타 런칭
- 2-4주 데이터 수집
- 이탈 유발 슬라이더 파악

---

### 제품화 로드맵

**Q1 2025: MVP + 핵심 품질**
- IR 기반 아키텍처
- 충돌 감지
- Diff/학습 도구
- 베타 런칭

**Q2 2025: 고급 기능**
- 포토그래퍼 스타일 10명
- 광학 시뮬레이션
- 결과 기반 네거티브 학습
- 정식 런칭

**Q3 2025: 확장**
- Midjourney/SD Exporter
- 프리셋 마켓플레이스
- 협업 기능
- 모바일 앱

**Q4 2025: 엔터프라이즈**
- API 제공
- 화이트라벨
- 고급 분석

---

### 핵심 성공 요인 (v1.1)

1. **IR 기반 아키텍처의 확장성**
   - 모델 추가 = Exporter만 작성
   - 같은 설정 → 모델별 최적 프롬프트

2. **충돌 감지 & 자동 해결의 사용자 신뢰**
   - "왜 안 바뀌지?" 제거
   - 명확한 제안

3. **학습 도구로서의 가치**
   - Diff + 영향도 표시
   - 포토그래퍼 교육 플랫폼

4. **측정 가능한 품질 개선**
   - 2-4주 만에 데이터 확보
   - 빠른 iteration

5. **법적 리스크 최소화**
   - 스타일 프로파일 분해
   - 작가명 옵션화

---

## 연락처 및 프로젝트 정보

**프로젝트 오너:** Ryan  
**프로젝트명:** Lumina Promptus  
**서브타이틀:** "디지털 암실 - 광학 시뮬레이터"  
**예상 도메인:** luminapromptus.app

**기술 스택:**
- Frontend: Next.js 14, TypeScript, Tailwind CSS, Three.js
- Backend: Node.js, PostgreSQL, Prisma
- AI: Claude API (2단계 정제), Nano Banana Pro (이미지 생성)

**예상 개발 기간:** 15주 (약 4개월)  
**예상 베타 런칭:** 2025년 4월  
**예상 정식 런칭:** 2025년 5월  

---

**문서 버전:** 1.1 (피드백 반영)  
**최종 업데이트:** 2024-12-25  
**상태:** 개발 준비 완료 ✅

**주요 변경사항 (v1.0 → v1.1):**
- IR(중립적 내부 표현) + Exporter 아키텍처 도입
- 슬롯 시스템 & 충돌 감지 엔진
- Before/After Diff & 학습 도구
- 2단계 AI 정제 & 의미 보존 검증
- Smart Negative Prompt & 결과 기반 학습
- 광학 시뮬레이션 (DOF + 3D Light Stage)
- 포토그래퍼 스타일 Deep Mapping
- 측정 가능한 평가 루프
- 리스크 관리 전략 강화

이제 **제품이 아닌 플랫폼**으로 성장할 준비가 되었습니다! 🚀📸✨
