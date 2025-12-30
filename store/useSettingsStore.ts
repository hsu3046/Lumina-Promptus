// store/useSettingsStore.ts
// 사용자 설정 상태 관리 - Zustand

import { create } from 'zustand';
import type {
    CameraSettings,
    LightingSettings,
    ColorGradingSettings,
    ArtDirectionSettings,
    UserInputSettings,
    UserSettings,
    StudioSubject,
} from '@/types';
import type { LandscapeSettings } from '@/types/landscape.types';

// 기본값 정의 (스튜디오 기본: Nikon D850 + AF-S 85mm)
const defaultCameraSettings: CameraSettings = {
    bodyId: 'nikon_d850',
    lensId: 'nikon_af_s_85mm_f14g',
    iso: 100,
    aperture: 'f/2.8',
    shutterSpeed: '1/200',
    whiteBalance: 5600,
    exposureCompensation: 0, // EV 0
    apertureAuto: true,
    shutterSpeedAuto: true,
    isoAuto: true,
    aspectRatio: '2:3',
    orientation: 'portrait',
};

const defaultLightingSettings: LightingSettings = {
    enabled: false,
    // 필수 설정 (Rembrandt 권장 조합)
    pattern: 'rembrandt',
    key: 'mid-key',
    // 선택 설정
    ratio: '4:1',
    quality: 'soft',
    colorTemp: 'daylight',
    mood: 'natural',
    timeBase: 'none',
    special: undefined,
};

const defaultColorGradingSettings: ColorGradingSettings = {
    filmStock: undefined,
    digitalProfile: undefined,
    grainLevel: 0,
    vignetting: false,
    lensFlare: false,
    chromaticAberration: false,
};

const defaultArtDirectionSettings: ArtDirectionSettings = {
    compositionRule: 'rule_of_thirds',
    cameraAngle: 'eye_level',
    shotType: 'medium_shot',
    photographerStyleId: undefined,
    environmentEffects: [],
    lensCharacteristicType: 'studio',
};


// Studio 인물 기본값
const createDefaultStudioSubject = (): StudioSubject => ({
    autoMode: true,

    // A: 외모 (한국인 프리셋 기본값)
    appearancePresetId: 'korean',
    skinTone: 'light',
    hairColor: 'black',
    eyeColor: 'brown',
    faceShape: 'oval',

    // B: 스타일
    gender: 'female',
    ageGroup: 'early-20s',
    hairStyle: 'long-straight',
    bodyType: 'average',

    // C: 패션
    topWear: '',
    bottomWear: '',
    footwear: '',
    accessory: '',
    accessory2: '',

    // D: 포즈
    bodyPose: 'straight',
    handPose: 'natural-relaxed',
    expression: 'natural-smile',
    gazeDirection: 'direct-eye-contact',

    // E: 위치/여백
    position: 'center',
    margin: 'normal',
});

const defaultUserInputSettings: UserInputSettings = {
    subjectDescription: '',
    moodDescription: '',
    studioSubjectCount: 1,
    studioComposition: 'bust-shot',
    studioBackgroundType: 'seamless_gray',
    studioSubjects: [createDefaultStudioSubject()],
};

// Landscape 기본값
const defaultLandscapeSettings: LandscapeSettings = {
    location: {
        name: '',
        coordinates: { lat: 37.5512, lng: 126.9882 }, // 서울 남산타워 기본
        elevation: 0,
    },
    camera: {
        heading: 0,
        pitch: 0,
        heightOffset: 2, // 기본 눈높이 (지형 위 2m)
    },
    lensId: 'nikon_af_s_24mm_f14g_ed',
    environment: {
        time: 'golden-hour',
        weather: 'clear',
        season: 'autumn',
    },
    landmarks: [],
};

export const defaultSettings: UserSettings & { landscape: LandscapeSettings } = {
    camera: defaultCameraSettings,
    lighting: defaultLightingSettings,
    colorGrading: defaultColorGradingSettings,
    artDirection: defaultArtDirectionSettings,
    userInput: defaultUserInputSettings,
    landscape: defaultLandscapeSettings,
};

// Store 인터페이스
interface SettingsStore {
    settings: UserSettings & { landscape: LandscapeSettings };
    updateCamera: (camera: Partial<CameraSettings>) => void;
    updateLighting: (lighting: Partial<LightingSettings>) => void;
    updateColorGrading: (colorGrading: Partial<ColorGradingSettings>) => void;
    updateArtDirection: (artDirection: Partial<ArtDirectionSettings>) => void;
    updateUserInput: (userInput: Partial<UserInputSettings>) => void;
    updateLandscape: (landscape: Partial<LandscapeSettings>) => void;
    resetToDefaults: () => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
    settings: defaultSettings,

    updateCamera: (camera) =>
        set((state) => ({
            settings: {
                ...state.settings,
                camera: { ...state.settings.camera, ...camera },
            },
        })),

    updateLighting: (lighting) =>
        set((state) => ({
            settings: {
                ...state.settings,
                lighting: { ...state.settings.lighting, ...lighting },
            },
        })),

    updateColorGrading: (colorGrading) =>
        set((state) => ({
            settings: {
                ...state.settings,
                colorGrading: { ...state.settings.colorGrading, ...colorGrading },
            },
        })),

    updateArtDirection: (artDirection) =>
        set((state) => ({
            settings: {
                ...state.settings,
                artDirection: { ...state.settings.artDirection, ...artDirection },
            },
        })),

    updateUserInput: (userInput) =>
        set((state) => ({
            settings: {
                ...state.settings,
                userInput: { ...state.settings.userInput, ...userInput },
            },
        })),

    updateLandscape: (landscape) =>
        set((state) => ({
            settings: {
                ...state.settings,
                landscape: { ...state.settings.landscape, ...landscape },
            },
        })),

    resetToDefaults: () => set({ settings: defaultSettings }),
}));
