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
    aspectRatio: '3:2',
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

    // A: 외모
    skinTone: 'light',
    hairColor: 'black',
    eyeColor: 'brown',
    faceShape: 'oval',

    // B: 스타일
    gender: 'female',
    ageGroup: '20s',
    hairStyle: 'long',
    bodyType: 'average',

    // C: 패션
    topWear: '',
    bottomWear: '',
    footwear: '',
    accessory: '',

    // D: 포즈
    bodyPose: 'contrapposto',
    handPose: 'natural-relaxed',
    expression: 'natural-smile',
    gazeDirection: 'direct-eye-contact',
});

const defaultUserInputSettings: UserInputSettings = {
    subjectDescription: '',
    moodDescription: '',
    studioSubjectCount: 1,
    studioComposition: 'bust-shot',
    studioBackgroundType: 'seamless_gray',
    studioSubjects: [createDefaultStudioSubject()],
};

export const defaultSettings: UserSettings = {
    camera: defaultCameraSettings,
    lighting: defaultLightingSettings,
    colorGrading: defaultColorGradingSettings,
    artDirection: defaultArtDirectionSettings,
    userInput: defaultUserInputSettings,
};

// Store 인터페이스
interface SettingsStore {
    settings: UserSettings;
    updateCamera: (camera: Partial<CameraSettings>) => void;
    updateLighting: (lighting: Partial<LightingSettings>) => void;
    updateColorGrading: (colorGrading: Partial<ColorGradingSettings>) => void;
    updateArtDirection: (artDirection: Partial<ArtDirectionSettings>) => void;
    updateUserInput: (userInput: Partial<UserInputSettings>) => void;
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

    resetToDefaults: () => set({ settings: defaultSettings }),
}));
