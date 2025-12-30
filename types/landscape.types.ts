// types/landscape.types.ts
// 풍경 사진 생성 시스템 타입 정의

// ===== 위치 정보 =====

export interface LandscapeLocation {
    name: string;                    // 장소명 (예: "서울 남산타워")
    coordinates: {
        lat: number;                   // 위도
        lng: number;                   // 경도
    };
    elevation: number;               // 고도 (미터)
    types?: string[];                // 장소 유형 (tourist_attraction, park 등)
    summary?: string | null;         // 장소 설명 (editorialSummary)
    address?: string | null;         // 주소 (formattedAddress)
}

// ===== 카메라 각도 설정 =====

export interface LandscapeCameraAngle {
    heading: number;                 // 0-360° (나침반 방향)
    pitch: number;                   // -90 ~ 90° (상하 각도)
    heightOffset: number;            // 3D 캡처용 카메라 높이 오프셋 (미터)
    detectedTerrainHeight?: number;  // 자동 감지된 지형 높이 (미터)
    distance?: number;               // 촬영 거리 (미터) 1-1000
    height?: number;                 // 촬영 높이 (미터) 0-500
    horizontalOffset?: number;       // 촬영 방향 오프셋 -50 ~ 50 (좌-중앙-우)
}

// ===== 렌즈 타입 (풍경 촬영용 주요 렌즈) =====

export type LandscapeLensType =
    | '14mm'    // 초광각
    | '24mm'    // 광각
    | '35mm'    // 표준광각
    | '50mm'    // 표준
    | '85mm'    // 중망원
    | '105mm';  // 망원

// ===== 환경 설정 =====

export type LandscapeTimeOfDay =
    | 'sunrise'       // 일출
    | 'golden-hour'   // 골든아워 (일출/일몰 전후)
    | 'midday'        // 한낮
    | 'blue-hour'     // 블루아워 (일출 전/일몰 후)
    | 'night';        // 밤

export type LandscapeWeather =
    | 'clear'          // 맑은 하늘
    | 'partly-cloudy'  // 부분적으로 흐림
    | 'overcast'       // 흐림
    | 'light-rain';    // 가벼운 비

export type LandscapeSeason =
    | 'spring'   // 봄
    | 'summer'   // 여름
    | 'autumn'   // 가을
    | 'winter';  // 겨울

export type LandscapeAtmosphere =
    | 'mist'     // 은은한 박무
    | 'haze'     // 시네마틱 연무
    | 'clear'    // 투명한 공기
    | 'grain'    // 아날로그 입자감
    | 'rays';    // 웅장한 빛내림

export interface LandscapeEnvironment {
    time: LandscapeTimeOfDay;
    weather: LandscapeWeather;
    season: LandscapeSeason;
    atmosphere: LandscapeAtmosphere;
}

// ===== 랜드마크 정보 =====

export interface LandscapeLandmark {
    name: string;
    distance: number;            // 미터 단위
    direction: number;           // 0-360° 방향
    layer: 'foreground' | 'middleground' | 'background';
    types?: string[];            // Google Places 타입
    relativeDirection?: 'left' | 'center' | 'right';  // 카메라 기준 좌/우
    enabled?: boolean;           // 활성화 여부 (체크박스)
    hasEditorialSummary?: boolean;  // AI 추천 (✨ 표시)
}

// ===== 참조 이미지 =====

export interface LandscapeReferenceImage {
    id: string;
    type: 'center' | 'surrounding' | 'satellite';
    label: string;               // 설명 (예: "center_exact", "north_0")
    heading: number;
    pitch: number;
    url: string;
}

// ===== 통합 설정 =====

export interface LandscapeSettings {
    location: LandscapeLocation;
    camera: LandscapeCameraAngle;
    currentPanoId?: string;          // Current Street View panorama ID (for capture sync)
    lensId: string;                  // 기존 lenses.ts의 렌즈 ID
    environment: LandscapeEnvironment;
    landmarks?: LandscapeLandmark[];
}

// ===== 프롬프트 설정 (생성용) =====

export interface LandscapePromptConfig {
    location: LandscapeLocation;
    camera: {
        heading: number;
        pitch: number;
        lens: LandscapeLensType;
        fov: number;
        aperture: string;
        iso: string;
        characteristic: string;
    };
    environment: LandscapeEnvironment;
    landmarks: LandscapeLandmark[];
    referenceImages: LandscapeReferenceImage[];
}

// ===== 출력 메타데이터 =====

export interface LandscapeMetadata {
    version: string;
    generatedAt: string;
    location: LandscapeLocation;
    camera: {
        heading: number;
        headingLabel: string;      // "East (E)"
        pitch: number;
        lens: string;
        lensType: string;
        fov: number;
        aperture: string;
        iso: string;
    };
    environment: LandscapeEnvironment;
    landmarks: LandscapeLandmark[];
    referenceImages: {
        total: number;
        centerViews: number;
        surroundingViews: number;
        satellite: number;
    };
    costs: {
        googleMaps: number;
        mapbox: number;
        total: number;
        currency: string;
    };
}
