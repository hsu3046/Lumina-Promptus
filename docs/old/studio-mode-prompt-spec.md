# 스튜디오 모드 프롬프트 조합 규칙

## 기본 조합 순서

```
[1. 피사체] + [2. 라이팅] + [3. 카메라/렌즈] + [Metatag]
```

---

## 1. 피사체 설정 (SubjectSettings)

> ⚠️ **표정(Expression)만 미구현**: 나머지 피사체 설정은 `StudioSubjectForm`에서 구현됨

### 조합 순서
```
[인종] + [나이] + [성별] + [포즈] + [시선] + [의상] → [구도] + [배경]
```

---

## 2. 라이팅 설정 (LightingSettings)

### 조건
| 조건 | 프롬프트 |
|------|---------|
| 스튜디오 라이팅 ON | 선택된 조명 설정 조합 |
| 스튜디오 라이팅 OFF | **프롬프트 없음** |

### ON일 때 조합 순서
```
[패턴] + [키] + [비율] + [광질] + [색온도] + [분위기] + [시간대] + [특수조명]
```

---

## 3. 카메라/렌즈 설정 (CameraSettings)

### 조건별 처리

| 항목 | 라이팅 ON | 라이팅 OFF |
|------|-----------|------------|
| 카메라 metaToken | ✅ 포함 | ✅ 포함 |
| 렌즈 특성 | ✅ 포함 | ✅ 포함 |
| 셔터스피드 | ❌ 생략 | ✅ **언어로 표현** |
| ISO | ❌ 생략 | ✅ **언어로 표현** |
| 노출 보정 | ❌ 생략 | ✅ **언어로 표현** |
| 색온도 | ❌ 생략 | ✅ **언어로 표현** |
| 비율/방향 | ✅ 포함 | ✅ 포함 |

### 카메라: metaToken 사용

`cameras.ts`의 `metaToken` 필드를 직접 삽입:

```typescript
// 예시
camera.metaToken = "DNG_LEICA_M11"  // → 프롬프트에 그대로 삽입
camera.metaToken = "NEF_NIKON_D850"
camera.metaToken = "ARW_SONY_A7RV"
```

### 렌즈 특성 분기 처리

`lenses.ts`의 `category`와 렌즈 특성 필드를 조합:

| 조건 | 추가 프롬프트 |
|------|--------------|
| 조리개 = `maxAperture` | `category` + `bokeh` + `vignetting` |
| 조리개 ≠ `maxAperture` | `category` + `characteristic_studio` |

#### 예시 (Nikon 85mm f/1.4G)
```typescript
// maxAperture(f/1.4)일 때
"medium telephoto, smooth creamy bokeh with soft transitions, subtle vignette wide open"

// f/5.6일 때
"medium telephoto, professional studio portrait, delicate skin micro-contrast"
```

### 언어 표현 매핑 (라이팅 OFF 전용)

#### ISO → 그레인 표현
| ISO | 프롬프트 |
|-----|---------|
| 50-200 | `clean, noise-free image` |
| 400-800 | `subtle film grain` |
| 1600-3200 | `visible grain, analog feel` |
| 6400+ | `heavy grain, gritty texture` |

#### 색온도 → 색감 표현
| 색온도 | 프롬프트 |
|--------|---------|
| 2500-3500K | `warm golden tones` |
| 4000-5000K | `neutral balanced colors` |
| 5500-6500K | `daylight white balance` |
| 7000K+ | `cool blue tint` |

#### 노출 보정 → 밝기 표현
| EV | 프롬프트 |
|----|---------|
| -2 ~ -1 | `underexposed, moody dark` |
| -0.5 ~ +0.5 | (생략) |
| +1 ~ +2 | `bright, airy, overexposed look` |

#### 셔터스피드 → 모션 표현
| 셔터 | 프롬프트 |
|------|---------|
| 1/15 이하 | `motion blur, long exposure` |
| 1/30-1/125 | (생략 - 일반) |
| 1/250+ | `frozen motion, sharp` |

---

## 최종 조합 예시

### 스튜디오 라이팅 ON (조리개 = maxAperture)
```
Korean woman in her 30s, elegant standing pose, looking at camera, wearing formal black dress, medium shot, studio backdrop, Rembrandt lighting with triangle highlight, mid-key balanced exposure, 4:1 lighting contrast, soft diffused light, tungsten 3200K, dramatic intense mood, DNG_LEICA_M11, medium telephoto, smooth creamy bokeh with soft transitions, subtle vignette wide open
```

### 스튜디오 라이팅 ON (조리개 ≠ maxAperture)
```
Korean woman in her 30s, elegant standing pose, looking at camera, wearing formal black dress, medium shot, studio backdrop, Rembrandt lighting with triangle highlight, mid-key balanced exposure, 4:1 lighting contrast, soft diffused light, tungsten 3200K, dramatic intense mood, DNG_LEICA_M11, medium telephoto, professional studio portrait, delicate skin micro-contrast
```

### 스튜디오 라이팅 OFF (자연광)
```
Korean woman in her 30s, elegant standing pose, looking at camera, wearing formal black dress, medium shot, outdoor backdrop, NEF_NIKON_D850, medium telephoto, professional studio portrait, delicate skin micro-contrast, warm golden tones, subtle film grain
```

---

## TODO
- [ ] 피사체: 표정(Expression) UI/로직 구현
- [ ] PromptBuilderV2 수정하여 조건부 로직 구현
- [ ] 언어 표현 매핑 함수 추가
- [ ] 렌즈 category + 특성 분기 처리 구현
- [ ] 카메라 metaToken 사용
- [ ] Metatag: Midjourney 선택 시만 추가 (차후 구현)
- [ ] 라이팅 ON/OFF 분기 처리
