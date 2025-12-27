// store/useSettingsStore.ts
// 사용자 설정 상태 관리 - Zustand

import { create } from 'zustand';
import type {
    CameraSettings,
    LightingSettings,
    ColorGradingSettings,
    ArtDirectionSettings,
    QualitySettings,
    UserInputSettings,
    UserSettings,
    StudioSubject,
} from '@/types';

// 기본값 정의
const defaultCameraSettings: CameraSettings = {
    bodyId: 'canon_eos_r5',
    lensId: 'canon_rf_85mm_f12',
    iso: 100,
    aperture: 'f/2.8',
    shutterSpeed: '1/200',
    whiteBalance: 5600,
    apertureAuto: false,
    shutterSpeedAuto: false,
    isoAuto: false,
};

const defaultLightingSettings: LightingSettings = {
    enabled: true,
    exposure: 'normal',
    patternId: 'rembrandt',
    quality: 'soft',
    colorTemp: 5600,
    timeOfDay: 'daylight',
    keyFillBackRatio: '4:2:1',
    // 스튜디오 전용 라이팅 기본값
    studioLightingSetup: '3point',
    studioLightingTool: 'softbox',
    studioBackgroundDetail: 'circular',
    studioColorTemp: '5600k',
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

const defaultQualitySettings: QualitySettings = {
    level: 'high',
    negativePresetId: 'standard',
    customNegatives: [],
};

// Studio 인물 기본값
const createDefaultStudioSubject = (): StudioSubject => ({
    autoMode: true,
    gender: 'female',
    ageGroup: '20s',
    ethnicity: 'asian',
    hairColor: 'black',
    hairStyle: 'long',
    eyeColor: 'brown',
    skinTexture: 'natural',
    otherFeatures: '',
    fashion: '',
});

const defaultUserInputSettings: UserInputSettings = {
    subjectDescription: '',
    moodDescription: '',
    studioSubjectCount: 1,
    studioComposition: 'bust',
    studioSubjects: [createDefaultStudioSubject()],
};

export const defaultSettings: UserSettings = {
    camera: defaultCameraSettings,
    lighting: defaultLightingSettings,
    colorGrading: defaultColorGradingSettings,
    artDirection: defaultArtDirectionSettings,
    quality: defaultQualitySettings,
    userInput: defaultUserInputSettings,
};

// Store 인터페이스
interface SettingsStore {
    settings: UserSettings;
    updateCamera: (camera: Partial<CameraSettings>) => void;
    updateLighting: (lighting: Partial<LightingSettings>) => void;
    updateColorGrading: (colorGrading: Partial<ColorGradingSettings>) => void;
    updateArtDirection: (artDirection: Partial<ArtDirectionSettings>) => void;
    updateQuality: (quality: Partial<QualitySettings>) => void;
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

    updateQuality: (quality) =>
        set((state) => ({
            settings: {
                ...state.settings,
                quality: { ...state.settings.quality, ...quality },
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
