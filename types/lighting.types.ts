// types/lighting.types.ts
// 조명 설정 타입 정의

export type LightingPattern = 'rembrandt' | 'butterfly' | 'loop' | 'split';

export type LightingKey = 'high-key' | 'mid-key' | 'low-key';

export type LightingRatio = '2:1' | '3:1' | '4:1' | '8:1' | '16:1';

export type LightQuality = 'soft' | 'hard';

export type ColorTemperature =
    | 'warm-golden'   // 2800K
    | 'tungsten'      // 3200K
    | 'daylight'      // 5600K
    | 'cloudy'        // 6500K
    | 'shade'         // 7500K
    | 'cool-blue';    // 8000K+

export type SpecialLighting =
    | 'rim-light'
    | 'hair-light'
    | 'background-light'
    | 'chiaroscuro'
    | 'clamshell'
    | 'broad-lighting'
    | 'short-lighting'
    | 'edge-lighting';

export type LightingMood =
    | 'dramatic'
    | 'natural'
    | 'glamorous'
    | 'mysterious'
    | 'editorial'
    | 'cinematic';

export type TimeLighting =
    | 'none'
    | 'golden-hour'
    | 'blue-hour'
    | 'midday-sun'
    | 'overcast'
    | 'window-light';

export interface LightingConfig {
    pattern: LightingPattern;
    key: LightingKey;
    ratio?: LightingRatio;
    quality?: LightQuality;
    colorTemp?: ColorTemperature;
    special?: SpecialLighting[];
    mood?: LightingMood;
    timeBase?: TimeLighting;
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: string[];
}
