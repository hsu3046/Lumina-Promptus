// types/index.ts - Lumina Promptus Core Types

// ===== Intermediate Representation (IR) =====

export interface PromptIR {
  slots: Record<string, SlotContent>;
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
  priority: number; // 1-10 (높을수록 중요)
  tokens: number;
  source: 'deterministic' | 'ai_refined' | 'user_direct';
  locked: boolean; // true면 다른 슬롯이 덮어쓸 수 없음
}

// ===== Conflict Detection =====

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

// ===== Slot System =====

export interface PromptSlot {
  id: string;
  name: string;
  purpose: string;
  priority: number; // 1-10
  maxTokens: number;
  conflicts: string[]; // 충돌하는 슬롯 ID들
  dependencies: string[]; // 이 슬롯이 필요로 하는 슬롯들
  mergeStrategy: 'replace' | 'append' | 'prepend' | 'custom';
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// ===== User Settings =====

export interface UserSettings {
  camera: CameraSettings;
  lighting: LightingSettings;
  colorGrading: ColorGradingSettings;
  artDirection: ArtDirectionSettings;
  userInput: UserInputSettings;
}

export interface CameraSettings {
  bodyId: string;
  lensId: string;
  iso: number;
  aperture: string; // "f/1.4", "f/2.8", etc
  shutterSpeed: string; // "1/200", "1/60", etc
  whiteBalance: number; // Kelvin
  exposureCompensation: number; // EV (-3 to +3)
  apertureAuto: boolean;
  shutterSpeedAuto: boolean;
  isoAuto: boolean;
  aspectRatio: '3:2' | '4:3' | '16:9' | '1:1' | '4:5';
  orientation: 'landscape' | 'portrait';
}

export interface LightingSettings {
  enabled: boolean; // 라이팅 ON/OFF
  // 필수 설정
  pattern: 'rembrandt' | 'butterfly' | 'loop' | 'split';
  key: 'high-key' | 'mid-key' | 'low-key';
  // 선택 설정
  ratio?: '2:1' | '3:1' | '4:1' | '8:1' | '16:1';
  quality?: 'soft' | 'hard';
  colorTemp?: 'warm-golden' | 'tungsten' | 'daylight' | 'cloudy' | 'shade' | 'cool-blue';
  mood?: 'dramatic' | 'natural' | 'glamorous' | 'mysterious' | 'editorial' | 'cinematic';
  timeBase?: 'none' | 'golden-hour' | 'blue-hour' | 'midday-sun' | 'overcast' | 'window-light';
  special?: ('rim-light' | 'hair-light' | 'background-light' | 'chiaroscuro' | 'clamshell' | 'broad-lighting' | 'short-lighting' | 'edge-lighting')[];
}

export interface ColorGradingSettings {
  filmStock?: string;
  digitalProfile?: string;
  grainLevel: number; // 0-100
  vignetting: boolean;
  lensFlare: boolean;
  chromaticAberration: boolean;
}

export interface ArtDirectionSettings {
  compositionRule: string;
  cameraAngle: string;
  shotType: string;
  photographerStyleId?: string;
  environmentEffects: string[];
  lensCharacteristicType: 'studio' | 'landscape' | 'architecture' | 'product' | 'street';
}


// Studio 인물 정보
export interface StudioSubject {
  autoMode: boolean; // Auto 모드 - ON이면 인종/성별/나이만 활성화
  gender: 'male' | 'female';
  ageGroup: 'child' | 'teen' | '20s' | '30s' | '40s' | '50plus' | 'elderly';
  ethnicity: 'korean' | 'asian' | 'caucasian' | 'black' | 'hispanic' | 'middle_eastern';
  bodyType: 'slim' | 'average' | 'athletic' | 'curvy' | 'plus';
  skinTexture: 'smooth' | 'natural' | 'freckled' | 'weathered';
  hairColor: 'black' | 'brown' | 'blonde' | 'red' | 'gray' | 'white';
  hairStyle: 'short' | 'medium' | 'long' | 'wavy' | 'curly' | 'straight' | 'bald' | 'ponytail' | 'bun' | 'braids';
  gazeDirection: 'camera' | 'aside' | 'down' | 'up';
  pose: 'contrapposto' | 'sitting' | 'shoulder_lookback' | 'hands_to_face' | 'walking';
  accessory: 'none' | 'glasses' | 'sunglasses' | 'earrings' | 'necklace' | 'hat' | 'scarf';
  fashion: string;
}

export interface UserInputSettings {
  subjectDescription: string;
  moodDescription: string;
  // Studio 전용
  studioSubjectCount: 1 | 2 | 3;
  studioComposition: 'closeup' | 'bust' | 'waist' | 'full' | 'extreme_closeup';
  studioBackgroundType: 'seamless_white' | 'seamless_gray' | 'seamless_blue' | 'textured';
  studioSubjects: StudioSubject[];
}

// ===== Generated Prompt =====

export interface GeneratedPrompt {
  ir: PromptIR;
  rendered: {
    [model: string]: string;
  };
  metadata: {
    deterministic: {
      camera: string;
      lighting: string;
      composition: string;
    };
    aiRefined: {
      subject: {
        original: string;
        refined: string;
        entitiesPreserved: boolean;
      };
      mood: {
        original: string;
        refined: string;
      };
    };
    diff: PromptDiff[];
  };
  versionId: string;
  timestamp: number;
}

// ===== Before/After Diff =====

export interface PromptDiff {
  slotId: string;
  before: string;
  after: string;
  changeType: 'added' | 'removed' | 'modified';
  impact: {
    description: string;
    severity: 'low' | 'medium' | 'high';
  };
}

// ===== Spec Types =====

export interface ApertureSpec {
  min: string;           // 최소 조리개 (개방) "f/1.2"
  max: string;           // 최대 조리개 (조임) "f/22"
  stops: string[];       // 사용 가능한 모든 stops ["f/1.2", "f/1.4", ...]
  defaultValue: string;  // 기본값 "f/2.8"
}

export interface ISOSpec {
  min: number;           // 최저 ISO (확장 포함)
  max: number;           // 최고 ISO (확장 포함)
  nativeMin: number;     // Native ISO 최저
  nativeMax: number;     // Native ISO 최고
  stops: number[];       // 사용 가능한 ISO stops [100, 125, 160, 200, ...]
  defaultValue: number;  // 기본값
}

export interface ShutterSpeedSpec {
  min: string;           // 가장 느린 셔터 "30"
  max: string;           // 가장 빠른 셔터 "1/8000"
  stops: string[];       // 사용 가능한 stops ["30", "15", ..., "1/8000"]
  defaultValue: string;  // 기본값 "1/200"
}

// ===== Mount System =====

export type Mount =
  | 'Canon RF'
  | 'Canon EF'
  | 'Canon FD'
  | 'Sony E'
  | 'Nikon Z'
  | 'Nikon F'
  | 'Leica M'
  | 'Leica L'
  | 'Fujifilm X'
  | 'Fujifilm G'
  | 'Hasselblad X'
  | 'Hasselblad V'
  | 'Pentax 67'
  | 'Minolta MD'
  | 'Panasonic L'; // L-mount alliance

// ===== Data Mappings =====

export interface CameraBody {
  id: string;
  brand: string;
  model: string;
  mount: Mount;
  sensorSize: 'Full Frame' | 'APS-C' | 'Medium Format' | 'Micro Four Thirds' | '35mm Film' | '6x6cm Medium Format Film' | '6x7cm Medium Format Film';
  megapixel: number;
  metaToken: string;
  promptKeywords: string;
  isoSpec: ISOSpec;
  shutterSpeedSpec: ShutterSpeedSpec;
}

export interface Lens {
  id: string;
  brand: string;
  model: string;
  mount: Mount;
  focalLength: string; // "85mm", "24-70mm", etc
  maxAperture: string;
  bokeh: string;
  vignetting: string;
  category: 'ultra_wide' | 'wide' | 'standard' | 'medium_telephoto' | 'telephoto' | 'macro';
  characteristic_studio: string;
  characteristic_landscape: string;
  characteristic_architecture: string;
  characteristic_product: string;
  characteristic_street: string;
  apertureSpec: ApertureSpec;
}

export interface FilmStock {
  id: string;
  name: string;
  brand: string;
  type: 'color_negative' | 'color_positive' | 'black_white';
  iso: number;
  promptKeywords: string;
  thumbnail?: string;
}

export interface NegativePreset {
  id: string;
  name: string;
  category: 'portrait' | 'product' | 'landscape' | 'general';
  keywords: string[];
  description: string;
}

// ===== History =====

export interface PromptHistoryItem {
  id: string;
  timestamp: number;
  ir: PromptIR;
  settings: UserSettings;
  changeDescription: string;
}

// ===== Store Types =====

export interface SettingsStore {
  settings: UserSettings;
  updateCamera: (camera: Partial<CameraSettings>) => void;
  updateLighting: (lighting: Partial<LightingSettings>) => void;
  updateColorGrading: (colorGrading: Partial<ColorGradingSettings>) => void;
  updateArtDirection: (artDirection: Partial<ArtDirectionSettings>) => void;
  updateUserInput: (userInput: Partial<UserInputSettings>) => void;
  resetToDefaults: () => void;
}

export interface PromptStore {
  ir: PromptIR | null;
  previousIr: PromptIR | null;
  rendered: GeneratedPrompt['rendered'] | null;
  isGenerating: boolean;
  setIR: (ir: PromptIR) => void;
  setRendered: (rendered: GeneratedPrompt['rendered']) => void;
  setIsGenerating: (isGenerating: boolean) => void;
}
