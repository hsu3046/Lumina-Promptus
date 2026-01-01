# 사실적 풍경 사진 생성 시스템 설계 문서

**Nano Banana Pro + Google Street View 통합**

---

## 🎯 **프로젝트 목표**

전문 사진가가 실제로 현장에서 촬영한 것 같은 사실적인 풍경 사진을 AI로 생성

**핵심 원칙**:
- 지리적 정확도 최우선
- 실제 카메라 촬영 느낌
- 사용자의 정밀한 제어

---

## 🏗️ **시스템 아키텍처**

```
사용자 입력 (위치, 각도, 카메라 설정, 환경)
    ↓
참조 이미지 수집 (Google Street View + Satellite)
    ↓
프롬프트 생성 (함수 기반 엔지니어링)
    ↓
출력: 프롬프트 + 14장 참조 이미지
    ↓
[Phase 2] Nano Banana Pro 이미지 생성
```

---

## 📐 **Phase 1 구현 범위**

### **구현할 것**
1. ✅ Google Maps 위치 검색
2. ✅ Street View 각도 선택 UI
3. ✅ 카메라 설정 (렌즈/화각)
4. ✅ 환경 설정 (시간/날씨/계절)
5. ✅ 14장 참조 이미지 수집
6. ✅ 프롬프트 자동 생성 (함수)
7. ✅ 프롬프트 + 이미지 다운로드

### **구현하지 않을 것**
- ❌ 실제 AI 이미지 생성 (수동 테스트)
- ❌ 이미지 편집 기능
- ❌ 대화형 개선
- ❌ LLM 기반 프롬프트 생성

---

## 📊 **참조 이미지 전략**

### **기본 구성: 14장**

```
[중심 뷰 - 5장]
1. 유저 선택 정확한 각도 (heading, pitch)
2. 약간 왼쪽 (-10°)
3. 약간 오른쪽 (+10°)
4. 약간 위 (+5° pitch)
5. 약간 아래 (-5° pitch)

[주변 컨텍스트 - 8장]
6. 정북 (0°)
7. 북동 (45°)
8. 정동 (90°)
9. 남동 (135°)
10. 정남 (180°)
11. 남서 (225°)
12. 정서 (270°)
13. 북서 (315°)

[지형 - 1장]
14. 위성 이미지 (Mapbox Satellite)
```

---

## 🔍 **이미지 개수 최적화 분석**

### **시나리오 1: 14장 (기본)**

**구성**: 중심 5 + 360° 8 + 위성 1

**장점**:
- ✅ 최고 정확도
- ✅ AI가 공간 완벽 이해
- ✅ 미세한 각도 조정 가능

**비용**: 14 × $0.007 = $0.098
**시간**: 14장 병렬 수집 = 약 5-8초

---

### **시나리오 2: 9장 (절약형)**

**구성**: 중심 1 + 360° 8방향

**제거**: 
- 중심 미세 각도 4장
- 위성 이미지 1장

**영향 분석**:
- ⚠️ 중심 뷰 정밀도 감소 (10-15%)
  - 유저가 원한 정확한 구도 재현 어려움
  - 전경/중경/배경 배치 부정확 가능성
- ⚠️ 지형 정확도 감소 (5-10%)
  - 하천/산 위치 오류 가능성
- ✅ 전체 공간 파악은 유지 (8방향 유지)

**비용 절감**: $0.098 → $0.063 (36% 절감)
**시간 절감**: 5초 변화 없음 (병렬 처리)

**결론**: ⚠️ 비권장
- 비용 절감 효과 미미 ($0.035)
- 품질 저하 영향 큼 (10-15%)
- 전문가 촬영 느낌 손실

---

### **시나리오 3: 5장 (최소)**

**구성**: 중심 1 + 4방향 (N/E/S/W)

**제거**:
- 중심 미세 각도 4장
- 대각선 4방향
- 위성 이미지

**영향 분석**:
- ❌ 중심 뷰 정밀도 대폭 감소 (20-30%)
- ❌ 공간 이해도 부족 (대각선 정보 없음)
- ❌ 지형 정확도 감소 (10-15%)
- ❌ 부자연스러운 랜드마크 배치

**비용 절감**: $0.098 → $0.035 (64% 절감)
**시간 절감**: 거의 없음

**결론**: ❌ 절대 비권장
- 프로젝트 목표 달성 불가
- 일반 AI 생성과 차별점 없음
- "전문가 촬영 느낌" 완전 상실

---

### **시나리오 4: 11장 (균형)**

**구성**: 중심 3 + 360° 8방향

**제거**:
- 중심 미세 각도 2장 (위/아래 pitch만 제거)
- 위성 이미지 1장

**영향 분석**:
- ⚠️ 중심 뷰 정밀도 소폭 감소 (5%)
  - 좌우 각도는 유지 → 큰 영향 없음
- ⚠️ 지형 정확도 감소 (5%)
  - 8방향 유지로 보완 가능
- ✅ 공간 파악 완벽 유지

**비용 절감**: $0.098 → $0.077 (21% 절감)
**시간 절감**: 거의 없음

**결론**: ✅ 허용 가능
- 품질 저하 최소 (5%)
- 비용 효율 개선
- 전문가 느낌 유지

---

### **최종 권장사항**

| 시나리오 | 이미지 수 | 비용 | 품질 | 추천 |
|---------|----------|------|------|------|
| **기본** | 14장 | $0.098 | ⭐⭐⭐⭐⭐ | ✅ **Phase 1** |
| **균형** | 11장 | $0.077 | ⭐⭐⭐⭐ | ✅ 차선책 |
| **절약** | 9장 | $0.063 | ⭐⭐⭐ | ⚠️ 비권장 |
| **최소** | 5장 | $0.035 | ⭐⭐ | ❌ 목표 달성 불가 |

**Phase 1 권장**: **14장 (기본)**
- 이유: 테스트 단계에서 최고 품질 확보
- 추후 실제 데이터로 최적화 가능
- 비용 차이 미미 ($0.035 = 약 40원)

---

## 🎨 **프롬프트 생성 함수**

### **구조**

```typescript
interface PromptConfig {
  // 위치 정보
  location: {
    name: string;
    coordinates: [number, number];
    elevation: number;
  };
  
  // 사용자 선택
  camera: {
    heading: number;        // 0-360°
    pitch: number;          // -90 ~ 90°
    lens: '14mm' | '24mm' | '35mm' | '50mm' | '85mm' | '105mm';
  };
  
  environment: {
    time: 'sunrise' | 'golden-hour' | 'midday' | 'blue-hour' | 'night';
    weather: 'clear' | 'partly-cloudy' | 'overcast' | 'light-rain';
    season: 'spring' | 'summer' | 'autumn' | 'winter';
  };
  
  // 자동 수집 데이터
  landmarks: Array<{
    name: string;
    distance: number;
    direction: string;
  }>;
}
```

---

### **프롬프트 템플릿**

```typescript
function generatePrompt(config: PromptConfig): string {
  const { location, camera, environment, landmarks } = config;
  
  // 1. 기본 설정
  const cameraSpecs = getCameraSpecs(camera.lens);
  const lightingDesc = getLightingDescription(environment.time);
  const weatherDesc = getWeatherDescription(environment.weather);
  const seasonDesc = getSeasonDescription(environment.season);
  
  // 2. 카메라 설정
  const cameraSetup = `
Camera: Nikon D850
Lens: ${camera.lens} ${cameraSpecs.type}
Aperture: ${cameraSpecs.aperture}
ISO: ${cameraSpecs.iso}
Direction: ${getCompassDirection(camera.heading)}° (${camera.heading}°)
Tilt: ${camera.pitch > 0 ? 'upward' : 'downward'} ${Math.abs(camera.pitch)}°
  `.trim();
  
  // 3. 참조 이미지 역할
  const referenceInstructions = `
Reference Images Guide:
- Images 1-5: Primary view from exact user-selected angle
  → Maintain precise composition, spatial relationships, and depth
- Images 6-13: 360° surrounding context (N, NE, E, SE, S, SW, W, NW)
  → Understand landmark positions and spatial layout
- Image 14: Satellite overhead view
  → Ensure geographic accuracy of terrain, rivers, roads

Critical: Use references to preserve reality, NOT to copy exactly.
Enhance lighting and atmosphere while maintaining spatial truth.
  `.trim();
  
  // 4. 환경 설정
  const environmentalContext = `
Time: ${environment.time} ${lightingDesc}
Weather: ${environment.weather} ${weatherDesc}
Season: ${environment.season} ${seasonDesc}
Location: ${location.name} at ${location.elevation}m elevation
  `.trim();
  
  // 5. 보이는 랜드마크 (자동 생성)
  const visibleLandmarks = generateLandmarkDescription(
    landmarks,
    camera.heading,
    camera.lens
  );
  
  // 6. 최종 프롬프트 조합
  return `
Create a professional landscape photograph based on 14 reference images.

${cameraSetup}

${referenceInstructions}

${environmentalContext}

Visible Elements:
${visibleLandmarks}

Photography Style:
- Professional landscape photography
- National Geographic quality
- Photorealistic detail
- Natural color grading with ${environment.time} enhancement
- Sharp focus throughout (${cameraSpecs.dof})
- Atmospheric perspective with subtle haze
- Balanced exposure: detailed shadows and highlights

Technical Requirements:
- 4K resolution (3840×2160)
- Professional RAW processing aesthetic
- ${cameraSpecs.characteristic}
- Minimal post-processing feel
- Authentic ${camera.lens} perspective

CRITICAL: This must look like a real photograph taken by a professional 
photographer at this exact location. Maintain geographic accuracy while 
enhancing natural beauty.
  `.trim();
}
```

---

### **보조 함수**

```typescript
// 렌즈 특성
function getCameraSpecs(lens: string) {
  const specs = {
    '14mm': {
      type: 'ultra-wide-angle',
      aperture: 'f/8',
      iso: 'ISO 200',
      dof: 'deep depth of field',
      characteristic: 'expansive view with slight barrel distortion'
    },
    '24mm': {
      type: 'wide-angle',
      aperture: 'f/5.6',
      iso: 'ISO 200',
      dof: 'deep depth of field',
      characteristic: 'natural wide perspective, minimal distortion'
    },
    '50mm': {
      type: 'standard lens',
      aperture: 'f/8',
      iso: 'ISO 200',
      dof: 'deep depth of field',
      characteristic: 'natural human eye perspective'
    },
    '85mm': {
      type: 'portrait telephoto',
      aperture: 'f/5.6',
      iso: 'ISO 200',
      dof: 'moderate depth of field',
      characteristic: 'compressed perspective, subject isolation'
    },
    '105mm': {
      type: 'telephoto',
      aperture: 'f/4',
      iso: 'ISO 400',
      dof: 'shallow depth of field',
      characteristic: 'strong compression, background magnification'
    }
  };
  return specs[lens];
}

// 조명 설명
function getLightingDescription(time: string) {
  const lighting = {
    'sunrise': '(warm golden light, long shadows, soft glow)',
    'golden-hour': '(warm golden tones, dramatic long shadows, rich colors)',
    'midday': '(bright overhead sun, short shadows, high contrast)',
    'blue-hour': '(cool blue tones, soft diffused light, minimal shadows)',
    'night': '(city lights, artificial illumination, long exposure feel)'
  };
  return lighting[time];
}

// 날씨 설명
function getWeatherDescription(weather: string) {
  const descriptions = {
    'clear': '(crystal clear sky, high visibility, vivid colors)',
    'partly-cloudy': '(dynamic clouds, varied lighting, depth)',
    'overcast': '(soft diffused light, muted colors, even illumination)',
    'light-rain': '(wet surfaces, enhanced reflections, atmospheric mood)'
  };
  return descriptions[weather];
}

// 계절 설명
function getSeasonDescription(season: string) {
  const descriptions = {
    'spring': '(fresh green foliage, cherry blossoms, vibrant)',
    'summer': '(lush green vegetation, clear atmosphere)',
    'autumn': '(golden and red foliage, warm earth tones)',
    'winter': '(bare trees, possible snow, crisp air, cool tones)'
  };
  return descriptions[season];
}

// 랜드마크 설명 생성
function generateLandmarkDescription(
  landmarks: Landmark[],
  heading: number,
  lens: string
): string {
  // 유저가 보는 방향 기준으로 가시성 판단
  const visibleLandmarks = landmarks.filter(lm => {
    const angleDiff = Math.abs(lm.direction - heading);
    const fov = getFOV(lens);
    return angleDiff < fov / 2;
  });
  
  // 거리별 분류
  const foreground = visibleLandmarks.filter(lm => lm.distance < 500);
  const middleground = visibleLandmarks.filter(
    lm => lm.distance >= 500 && lm.distance < 2000
  );
  const background = visibleLandmarks.filter(lm => lm.distance >= 2000);
  
  return `
Foreground (0-500m): ${foreground.map(lm => lm.name).join(', ') || 'Natural terrain'}
Middleground (500m-2km): ${middleground.map(lm => lm.name).join(', ') || 'Urban landscape'}
Background (2km+): ${background.map(lm => lm.name).join(', ') || 'Distant horizon'}
  `.trim();
}

// 화각 계산
function getFOV(lens: string): number {
  const fovMap = {
    '14mm': 114,
    '24mm': 84,
    '35mm': 63,
    '50mm': 47,
    '85mm': 28,
    '105mm': 23
  };
  return fovMap[lens];
}

// 나침반 방향
function getCompassDirection(heading: number): string {
  const directions = [
    'N', 'NNE', 'NE', 'ENE', 
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 
    'W', 'WNW', 'NW', 'NNW'
  ];
  const index = Math.round(heading / 22.5) % 16;
  return directions[index];
}
```

---

## 🖼️ **참조 이미지 수집 로직**

### **Google Street View Static API**

```typescript
interface StreetViewConfig {
  location: [number, number];  // [lat, lng]
  size: [number, number];      // [width, height]
  heading: number;             // 0-360
  pitch: number;               // -90 ~ 90
  fov: number;                 // 화각
  apiKey: string;
}

function generateStreetViewURL(config: StreetViewConfig): string {
  const [lat, lng] = config.location;
  const [width, height] = config.size;
  
  return `https://maps.googleapis.com/maps/api/streetview?` +
    `size=${width}x${height}` +
    `&location=${lat},${lng}` +
    `&heading=${config.heading}` +
    `&pitch=${config.pitch}` +
    `&fov=${config.fov}` +
    `&key=${config.apiKey}`;
}

// 14장 참조 이미지 URL 생성
function generate14ReferenceImages(
  location: [number, number],
  userHeading: number,
  userPitch: number,
  apiKey: string
): string[] {
  const urls: string[] = [];
  
  // 1-5: 중심 뷰 (미세 각도)
  const centerVariations = [
    { heading: userHeading, pitch: userPitch },           // 1. 정확한 유저 선택
    { heading: userHeading - 10, pitch: userPitch },      // 2. 왼쪽
    { heading: userHeading + 10, pitch: userPitch },      // 3. 오른쪽
    { heading: userHeading, pitch: userPitch + 5 },       // 4. 위
    { heading: userHeading, pitch: userPitch - 5 }        // 5. 아래
  ];
  
  centerVariations.forEach(variation => {
    urls.push(generateStreetViewURL({
      location,
      size: [600, 400],
      heading: variation.heading,
      pitch: variation.pitch,
      fov: 90,
      apiKey
    }));
  });
  
  // 6-13: 360° 주변 (8방향)
  const surroundingDirections = [0, 45, 90, 135, 180, 225, 270, 315];
  
  surroundingDirections.forEach(heading => {
    urls.push(generateStreetViewURL({
      location,
      size: [600, 400],
      heading,
      pitch: 0,
      fov: 90,
      apiKey
    }));
  });
  
  // 14: 위성 이미지
  const satelliteURL = generateSatelliteURL(location, apiKey);
  urls.push(satelliteURL);
  
  return urls;
}
```

---

### **Mapbox Satellite API**

```typescript
function generateSatelliteURL(
  location: [number, number],
  mapboxToken: string
): string {
  const [lng, lat] = location;
  const zoom = 15;
  const width = 600;
  const height = 400;
  
  return `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/` +
    `${lng},${lat},${zoom},0/${width}x${height}@2x?` +
    `access_token=${mapboxToken}`;
}
```

---

## 📱 **Phase 1 사용자 플로우**

### **1. 장소 검색**
```
사용자 입력: "서울 남산타워"
    ↓
Google Maps Geocoding API
    ↓
좌표: (37.5512, 126.9882)
고도: 243m
```

---

### **2. 각도 선택**
```
Google Street View 임베드
    ↓
사용자 드래그/회전
    ↓
선택된 파라미터:
- heading: 87° (동쪽)
- pitch: -5° (약간 아래)
```

---

### **3. 카메라 설정**
```
렌즈 선택: 50mm (표준)
→ 자동 설정:
  - FOV: 47°
  - Aperture: f/8
  - 특성: 자연스러운 인간 시야
```

---

### **4. 환경 설정**
```
시간: Golden Hour (18:30)
날씨: Clear Sky
계절: Autumn
```

---

### **5. 생성 및 다운로드**
```
"Generate" 버튼 클릭
    ↓
백엔드 처리:
1. 14장 참조 이미지 다운로드
2. Google Maps Places API로 랜드마크 수집
3. 프롬프트 함수 실행
    ↓
출력:
- prompt.txt (생성된 프롬프트)
- references/ (14장 이미지)
  ├─ 01_center_main.jpg
  ├─ 02_center_left.jpg
  ├─ ...
  └─ 14_satellite.jpg
- metadata.json (모든 설정 정보)
    ↓
사용자가 ZIP 다운로드
    ↓
[Phase 2] 수동으로 Nano Banana Pro에 업로드 및 테스트
```

---

## 💰 **비용 분석 (Phase 1)**

### **API 비용 (이미지 1세트)**

```
Google Maps APIs:
- Geocoding: $0.005
- Places (Nearby): $0.017
- Elevation: $0.005
- Street View × 13: $0.091
  
Mapbox:
- Satellite × 1: $0.001

총 Phase 1 비용: $0.119/세트
```

### **예상 테스트 비용**

```
10개 위치 테스트: $1.19
50개 위치 테스트: $5.95
100개 위치 테스트: $11.90

→ Phase 1 개발 단계 매우 저렴
```

---

## 🎯 **성공 지표**

### **Phase 1 완료 기준**

1. ✅ 사용자가 정확한 각도 선택 가능
2. ✅ 14장 참조 이미지 자동 수집
3. ✅ 전문적인 프롬프트 생성
4. ✅ 다운로드 가능한 패키지 출력
5. ✅ 메타데이터 완벽 보존

### **품질 기준**

프롬프트가 다음을 포함해야 함:
- ✅ 정확한 카메라 스펙
- ✅ 참조 이미지 역할 명시
- ✅ 지리적 정보 (고도, 랜드마크)
- ✅ 환경 설정 (시간/날씨/계절)
- ✅ 전문가 촬영 스타일 지시

---

## 📂 **출력 구조**

### **다운로드 ZIP 파일 구조**

```
namsan-tower-east-view-golden-hour.zip
├─ prompt.txt                    # 생성된 프롬프트
├─ metadata.json                 # 모든 설정 정보
├─ references/
│  ├─ 01_center_exact.jpg       # 유저 선택 정확한 각도
│  ├─ 02_center_left10.jpg      # 왼쪽 10°
│  ├─ 03_center_right10.jpg     # 오른쪽 10°
│  ├─ 04_center_up5.jpg         # 위 5°
│  ├─ 05_center_down5.jpg       # 아래 5°
│  ├─ 06_north_0.jpg            # 북쪽
│  ├─ 07_northeast_45.jpg       # 북동
│  ├─ 08_east_90.jpg            # 동쪽
│  ├─ 09_southeast_135.jpg      # 남동
│  ├─ 10_south_180.jpg          # 남쪽
│  ├─ 11_southwest_225.jpg      # 남서
│  ├─ 12_west_270.jpg           # 서쪽
│  ├─ 13_northwest_315.jpg      # 북서
│  └─ 14_satellite.jpg          # 위성 이미지
└─ README.txt                    # 사용 가이드
```

---

### **metadata.json 예시**

```json
{
  "version": "1.0",
  "generated_at": "2025-12-29T15:30:00Z",
  "location": {
    "name": "N Seoul Tower, Namsan Mountain, Seoul",
    "coordinates": {
      "lat": 37.5512,
      "lng": 126.9882
    },
    "elevation": 243
  },
  "camera": {
    "heading": 87,
    "heading_label": "East (E)",
    "pitch": -5,
    "lens": "50mm",
    "lens_type": "standard lens",
    "fov": 47,
    "aperture": "f/8",
    "iso": "ISO 200"
  },
  "environment": {
    "time": "golden-hour",
    "time_description": "18:30 sunset",
    "weather": "clear",
    "season": "autumn"
  },
  "landmarks": [
    {
      "name": "Lotte World Tower",
      "distance": 8000,
      "direction": 90,
      "layer": "background"
    },
    {
      "name": "Han River",
      "distance": 2000,
      "direction": 85,
      "layer": "middleground"
    }
  ],
  "reference_images": {
    "total": 14,
    "center_views": 5,
    "surrounding_views": 8,
    "satellite": 1
  },
  "costs": {
    "google_maps": 0.118,
    "mapbox": 0.001,
    "total": 0.119,
    "currency": "USD"
  }
}
```

---

## 🚀 **Phase 1 구현 체크리스트**

### **프론트엔드**

- [ ] Google Maps 위치 검색 UI
- [ ] Street View 임베드 및 각도 선택
- [ ] 렌즈 선택 UI (5개 옵션)
- [ ] 시간/날씨/계절 선택 드롭다운
- [ ] "Generate" 버튼
- [ ] 진행 상태 표시
- [ ] ZIP 다운로드 기능

### **백엔드**

- [ ] Google Maps APIs 통합
  - [ ] Geocoding API
  - [ ] Places API (Nearby Search)
  - [ ] Elevation API
  - [ ] Street View Static API
- [ ] Mapbox Satellite API 통합
- [ ] 프롬프트 생성 함수
  - [ ] 카메라 스펙 매핑
  - [ ] 조명/날씨/계절 설명 생성
  - [ ] 랜드마크 자동 분류
  - [ ] 최종 프롬프트 조합
- [ ] 14장 이미지 수집 로직
- [ ] ZIP 파일 생성
- [ ] 메타데이터 JSON 생성

### **테스트**

- [ ] 5개 이상 다양한 위치 테스트
  - [ ] 산 (남산타워)
  - [ ] 해변 (해운대)
  - [ ] 도심 (여의도)
  - [ ] 강 (한강뷰)
  - [ ] 역사 건물 (경복궁)
- [ ] 모든 렌즈 화각 테스트
- [ ] 모든 시간대 테스트
- [ ] 프롬프트 품질 검증
- [ ] 참조 이미지 품질 확인

---

## 📊 **Phase 2 준비 사항**

Phase 1 완료 후 수동 테스트를 통해 검증할 사항:

1. **프롬프트 효과성**
   - Nano Banana Pro가 지시사항 정확히 따르는가?
   - 참조 이미지 14장 모두 활용하는가?
   - 지리적 정확도 달성되는가?

2. **참조 이미지 최적화**
   - 14장이 과한가? 11장으로 충분한가?
   - 어떤 이미지가 가장 중요한가?
   - FOV/해상도 조정 필요한가?

3. **프롬프트 개선**
   - 어떤 표현이 효과적인가?
   - 불필요한 지시사항은?
   - 추가해야 할 디테일은?

4. **비용 vs 품질**
   - 실제 생성 비용 ($0.039/이미지)
   - 총 비용 ($0.158/세트)
   - ROI 평가

---

## 🎯 **핵심 차별점**

### **vs 일반 AI 이미지 생성**

| 요소 | 일반 AI | 우리 시스템 |
|------|---------|------------|
| **지리 정확도** | 20-30% | **90%+** |
| **사용자 제어** | 텍스트만 | **정밀한 각도** |
| **참조 데이터** | 없음 | **14장 실제 사진** |
| **전문가 느낌** | 없음 | **완벽한 카메라 시뮬레이션** |
| **재현 가능성** | 불가능 | **완벽한 재현 가능** |

---

## ⚡ **개발 타임라인**

### **Week 1-2: 핵심 기능**
- Google Maps 통합
- Street View UI
- 기본 프롬프트 함수

### **Week 3: 고도화**
- 렌즈/환경 설정
- 14장 이미지 수집
- 메타데이터 생성

### **Week 4: 테스트 및 개선**
- 다양한 위치 테스트
- 프롬프트 개선
- 출력 형식 최적화

---

## 🎯 **예상 결과**

Phase 1 완료 시 달성되는 것:

1. ✅ **완벽한 재료 준비**
   - 프로페셔널 프롬프트
   - 14장 고품질 참조 이미지
   - 완벽한 메타데이터

2. ✅ **수동 테스트 가능**
   - Nano Banana Pro에 즉시 업로드
   - 다양한 변수 실험
   - 최적 설정 발견

3. ✅ **Phase 2 기반 마련**
   - 검증된 프롬프트 전략
   - 최적화된 이미지 구성
   - 자동화 준비 완료

---

## 🏆 **성공의 정의**

**Phase 1이 성공했다면**:

> "생성된 프롬프트와 참조 이미지를 Nano Banana Pro에 업로드했을 때, 
> 전문 사진가가 그 장소에서 실제로 촬영한 것과 구분할 수 없는 
> 사실적인 풍경 사진이 나온다."

**핵심 지표**:
- 지리적 정확도: 90% 이상
- 사실감: 실제 사진과 구분 불가
- 사용자 만족도: "정확히 원하는 각도"
- 비용 효율: 기존 대비 50% 절감

---

**이 문서는 Phase 1 구현의 완벽한 청사진입니다!** 🎯✨
