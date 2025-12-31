// config/mappings/cameras.ts
// 카메라 바디 데이터 매핑 - 20종 추가 (v1.1)

import type { CameraBody, ISOSpec, ShutterSpeedSpec, AspectRatioSpec, Mount } from '@/types';

// 공통 1/3 스탑 셔터 스피드 배열 (대부분 카메라에 적용)
const COMMON_SHUTTER_STOPS: string[] = [
    '30', '25', '20', '15', '13', '10', '8', '6', '5', '4', '3.2', '2.5', '2', '1.6', '1.3', '1',
    '0.8', '0.6', '0.5', '0.4', '0.3', '1/4', '1/5', '1/6', '1/8', '1/10', '1/13', '1/15', '1/20', '1/25',
    '1/30', '1/40', '1/50', '1/60', '1/80', '1/100', '1/125', '1/160', '1/200', '1/250', '1/320', '1/400',
    '1/500', '1/640', '1/800', '1/1000', '1/1250', '1/1600', '1/2000', '1/2500', '1/3200', '1/4000',
    '1/5000', '1/6400', '1/8000'
];

// 공통 1/3 스탑 ISO 배열
const COMMON_ISO_STOPS: number[] = [
    100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000, 2500, 3200,
    4000, 5000, 6400, 8000, 10000, 12800, 16000, 20000, 25600, 32000, 40000, 51200
];

// ===== 비율 (Aspect Ratio) =====
// 기본 비율 Spec (대부분 디지털 카메라)
export const DEFAULT_ASPECT_RATIO_SPEC: AspectRatioSpec = {
    landscape: ['3:2', '4:3', '16:9', '5:4'],
    portrait: ['2:3', '3:4', '9:16', '4:5'],
    square: ['1:1'],
    defaultValue: '3:2'
};

// Nikon DSLR 비율 (제한적)
const NIKON_DSLR_ASPECT_RATIO: AspectRatioSpec = {
    landscape: ['3:2', '5:4'],
    portrait: ['2:3', '4:5'],
    square: ['1:1'],
    defaultValue: '3:2'
};

// 중형 6x6 정방형 (Hasselblad 500C/M 등)
const MEDIUM_FORMAT_6X6_ASPECT_RATIO: AspectRatioSpec = {
    landscape: [],
    portrait: [],
    square: ['1:1'],
    defaultValue: '1:1'
};

// 중형 6x7 (Pentax 67)
const MEDIUM_FORMAT_6X7_ASPECT_RATIO: AspectRatioSpec = {
    landscape: ['7:6'],
    portrait: ['6:7'],
    square: [],
    defaultValue: '7:6'
};

// 35mm 필름 (Leica M3 등)
const FILM_35MM_ASPECT_RATIO: AspectRatioSpec = {
    landscape: ['3:2'],
    portrait: ['2:3'],
    square: [],
    defaultValue: '3:2'
};

// 내부 배열 (정렬 전)
const _CAMERA_BODIES: CameraBody[] = [
    {
        id: 'sony_a7r_v',
        brand: 'Sony',
        model: 'A7R V',
        mount: 'Sony E',
        sensorSize: 'Full Frame',
        megapixel: 61,
        metaToken: 'ARW_SONY_A7RV',
        promptKeywords: 'modern digital look, vibrant colors, cool professional tones, exceptional resolution',
        isoSpec: {
            min: 50,
            max: 102400,
            nativeMin: 100,
            nativeMax: 32000,
            stops: [50, ...COMMON_ISO_STOPS, 64000, 102400],
            defaultValue: 100
        },
        shutterSpeedSpec: {
            min: '30',
            max: '1/8000',
            stops: COMMON_SHUTTER_STOPS,
            defaultValue: '1/200'
        }
    },
    {
        id: 'hasselblad_x2d',
        brand: 'Hasselblad',
        model: 'X2D 100C',
        mount: 'Hasselblad X',
        sensorSize: 'Medium Format',
        megapixel: 100,
        metaToken: 'DNG_HASSELBLAD_X2D',
        promptKeywords: 'medium format sensor, luxury color science, exceptional detail and bokeh, high dynamic range',
        isoSpec: {
            min: 64,
            max: 25600,
            nativeMin: 64,
            nativeMax: 25600,
            stops: [64, 100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6400, 8000, 10000, 12800, 16000, 20000, 25600],
            defaultValue: 100
        },
        shutterSpeedSpec: {
            min: '60',
            max: '1/4000',
            stops: [
                '60', '45', '30', '25', '20', '15', '13', '10', '8', '6', '5', '4', '3.2', '2.5', '2', '1.6', '1.3', '1',
                '0.8', '0.6', '0.5', '0.4', '0.3', '1/4', '1/5', '1/6', '1/8', '1/10', '1/13', '1/15', '1/20', '1/25',
                '1/30', '1/40', '1/50', '1/60', '1/80', '1/100', '1/125', '1/160', '1/200', '1/250', '1/320', '1/400',
                '1/500', '1/640', '1/800', '1/1000', '1/1250', '1/1600', '1/2000', '1/2500', '1/3200', '1/4000'
            ],
            defaultValue: '1/200'
        }
    },
    {
        id: 'leica_m11',
        brand: 'Leica',
        model: 'M11',
        mount: 'Leica M',
        sensorSize: 'Full Frame',
        megapixel: 60,
        metaToken: 'DNG_LEICA_M11',
        promptKeywords: 'full frame rangefinder, high micro-contrast, timeless Leica color science, rich black and white tones, film-like quality',
        isoSpec: {
            min: 64,
            max: 50000,
            nativeMin: 64,
            nativeMax: 50000,
            stops: [64, 100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6400, 8000, 10000, 12800, 16000, 20000, 25600, 32000, 40000, 50000],
            defaultValue: 100
        },
        shutterSpeedSpec: {
            min: '60',
            max: '1/16000',
            stops: [
                '60', '45', '30', '25', '20', '15', '13', '10', '8', '6', '5', '4', '3.2', '2.5', '2', '1.6', '1.3', '1',
                '0.8', '0.6', '0.5', '0.4', '0.3', '1/4', '1/5', '1/6', '1/8', '1/10', '1/13', '1/15', '1/20', '1/25',
                '1/30', '1/40', '1/50', '1/60', '1/80', '1/100', '1/125', '1/160', '1/200', '1/250', '1/320', '1/400',
                '1/500', '1/640', '1/800', '1/1000', '1/1250', '1/1600', '1/2000', '1/2500', '1/3200', '1/4000',
                '1/5000', '1/6400', '1/8000', '1/10000', '1/12500', '1/16000'
            ],
            defaultValue: '1/200'
        }
    },
    {
        id: 'canon_5d_mark_iv',
        brand: 'Canon',
        model: '5D Mark IV',
        mount: 'Canon EF',
        sensorSize: 'Full Frame',
        megapixel: 30.4,
        metaToken: 'CR2_CANON_5D_MARK_IV',
        promptKeywords: 'warm skin tones, pleasing reds, soft color transitions, classic rendering',
        isoSpec: {
            min: 50,
            max: 102400,
            nativeMin: 100,
            nativeMax: 32000,
            stops: [
                50,    // L (expanded)
                100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6400, 8000, 10000, 12800, 16000, 20000, 25600, 32000,  // native range
                51200,  // H1 (expanded)
                102400  // H2 (expanded)
            ],
            defaultValue: 100
        },
        shutterSpeedSpec: {
            min: '30',
            max: '1/8000',
            stops: [
                // 1/3 stop increments (공식 스펙)
                '30', '25', '20', '15', '13', '10', '8', '6', '5', '4', '3.2', '2.5', '2', '1.6', '1.3', '1',
                '0.8', '0.6', '0.5', '0.4', '0.3',
                '1/4', '1/5', '1/6', '1/8', '1/10', '1/13', '1/15', '1/20', '1/25',
                '1/30', '1/40', '1/50', '1/60', '1/80', '1/100', '1/125', '1/160', '1/200', '1/250', '1/320', '1/400',
                '1/500', '1/640', '1/800', '1/1000', '1/1250', '1/1600', '1/2000', '1/2500', '1/3200', '1/4000',
                '1/5000', '1/6400', '1/8000'
            ],
            defaultValue: '1/125'
        }
    },
    {
        id: 'canon_eos_r5_mark_ii',
        brand: 'Canon',
        model: 'R5 Mark II',
        mount: 'Canon RF',
        sensorSize: 'Full Frame',
        megapixel: 45,
        metaToken: 'CR3_CANON_EOS_R5_MKII',
        promptKeywords: 'warm color science, rich skin tones, professional hybrid look',
        isoSpec: {
            min: 50,
            max: 102400,
            nativeMin: 100,
            nativeMax: 51200,
            stops: [50, ...COMMON_ISO_STOPS, 102400],
            defaultValue: 100
        },
        shutterSpeedSpec: {
            min: '30',
            max: '1/32000', // Electronic shutter
            stops: [
                ...COMMON_SHUTTER_STOPS,
                '1/10000', '1/12500', '1/16000', '1/20000', '1/25000', '1/32000'
            ],
            defaultValue: '1/200'
        }
    },
    {
        id: 'nikon_d850',
        brand: 'Nikon',
        model: 'D850',
        mount: 'Nikon F',
        sensorSize: 'Full Frame',
        megapixel: 45.7,
        metaToken: 'NEF_NIKON_D850',
        promptKeywords: 'neutral balanced tones, natural color accuracy, high dynamic range',
        isoSpec: {
            min: 32,
            max: 102400,
            nativeMin: 64,
            nativeMax: 25600,
            stops: [
                32,     // Lo 1 (expanded, ISO 64 - 1 EV)
                64, 80, 100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6400, 8000, 10000, 12800, 16000, 20000, 25600,  // native range (ISO 64-25600)
                51200,  // Hi 1 (expanded, ISO 25600 + 1 EV)
                102400  // Hi 2 (expanded, ISO 25600 + 2 EV)
            ],
            defaultValue: 64
        },
        shutterSpeedSpec: {
            min: '30',
            max: '1/8000',
            stops: [
                // 1/3 stop increments (공식 스펙: 30s - 1/8000s)
                '30', '25', '20', '15', '13', '10', '8', '6', '5', '4', '3.2', '2.5', '2', '1.6', '1.3', '1',
                '0.8', '0.6', '0.5', '0.4', '0.3',
                '1/4', '1/5', '1/6', '1/8', '1/10', '1/13', '1/15', '1/20', '1/25',
                '1/30', '1/40', '1/50', '1/60', '1/80', '1/100', '1/125', '1/160', '1/200', '1/250', '1/320', '1/400',
                '1/500', '1/640', '1/800', '1/1000', '1/1250', '1/1600', '1/2000', '1/2500', '1/3200', '1/4000',
                '1/5000', '1/6400', '1/8000'
            ],
            defaultValue: '1/125'
        },
        aspectRatioSpec: NIKON_DSLR_ASPECT_RATIO
    },
    {
        id: 'nikon_z9',
        brand: 'Nikon',
        model: 'Z9',
        mount: 'Nikon Z',
        sensorSize: 'Full Frame',
        megapixel: 45.7,
        metaToken: 'NEF_NIKON_Z9',
        promptKeywords: 'clean neutral colors, precise color reproduction, professional clarity',
        isoSpec: {
            min: 32,
            max: 102400,
            nativeMin: 64,
            nativeMax: 25600,
            stops: [32, 64, ...COMMON_ISO_STOPS, 102400],
            defaultValue: 100
        },
        shutterSpeedSpec: {
            min: '30',
            max: '1/32000', // Electronic shutter only
            stops: [
                ...COMMON_SHUTTER_STOPS,
                '1/10000', '1/12500', '1/16000', '1/20000', '1/25000', '1/32000'
            ],
            defaultValue: '1/200'
        }
    },
    {
        id: 'fujifilm_gfx100_ii',
        brand: 'Fujifilm',
        model: 'GFX100 II',
        mount: 'Fujifilm G',
        sensorSize: 'Medium Format',
        megapixel: 102,
        metaToken: 'RAF_FUJIFILM_GFX100II',
        promptKeywords: 'medium format clarity, film-inspired colors, rich tonal range',
        isoSpec: {
            min: 40,
            max: 102400,
            nativeMin: 80,
            nativeMax: 12800,
            stops: [40, 50, 64, 80, 100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6400, 8000, 10000, 12800, 16000, 20000, 25600, 32000, 40000, 51200, 64000, 80000, 102400],
            defaultValue: 100
        },
        shutterSpeedSpec: {
            min: '60',
            max: '1/16000',
            stops: [
                '60', '45', '30', '25', '20', '15', '13', '10', '8', '6', '5', '4', '3.2', '2.5', '2', '1.6', '1.3', '1',
                '0.8', '0.6', '0.5', '0.4', '0.3', '1/4', '1/5', '1/6', '1/8', '1/10', '1/13', '1/15', '1/20', '1/25',
                '1/30', '1/40', '1/50', '1/60', '1/80', '1/100', '1/125', '1/160', '1/200', '1/250', '1/320', '1/400',
                '1/500', '1/640', '1/800', '1/1000', '1/1250', '1/1600', '1/2000', '1/2500', '1/3200', '1/4000',
                '1/5000', '1/6400', '1/8000', '1/10000', '1/12500', '1/16000'
            ],
            defaultValue: '1/200'
        }
    },
    {
        id: 'fujifilm_x_t5',
        brand: 'Fujifilm',
        model: 'X-T5',
        mount: 'Fujifilm X',
        sensorSize: 'APS-C',
        megapixel: 40.2,
        metaToken: 'RAF_FUJIFILM_XT5',
        promptKeywords: 'film simulation look, nostalgic color palette, X-Trans rendering',
        isoSpec: {
            min: 64,
            max: 51200,
            nativeMin: 125,
            nativeMax: 12800,
            stops: [64, 80, 100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6400, 8000, 10000, 12800, 16000, 20000, 25600, 32000, 40000, 51200],
            defaultValue: 125
        },
        shutterSpeedSpec: {
            min: '15',
            max: '1/8000',
            stops: [
                '15', '13', '10', '8', '6', '5', '4', '3.2', '2.5', '2', '1.6', '1.3', '1',
                '0.8', '0.6', '0.5', '0.4', '0.3', '1/4', '1/5', '1/6', '1/8', '1/10', '1/13', '1/15', '1/20', '1/25',
                '1/30', '1/40', '1/50', '1/60', '1/80', '1/100', '1/125', '1/160', '1/200', '1/250', '1/320', '1/400',
                '1/500', '1/640', '1/800', '1/1000', '1/1250', '1/1600', '1/2000', '1/2500', '1/3200', '1/4000',
                '1/5000', '1/6400', '1/8000'
            ],
            defaultValue: '1/200'
        }
    },
    {
        id: 'leica_m3_film',
        brand: 'Leica',
        model: 'M3',
        mount: 'Leica M',
        sensorSize: '35mm Film',
        megapixel: 0, // 필름 카메라
        metaToken: 'FILM_LEICA_M3',
        promptKeywords: 'vintage film grain, classic rangefinder tones, legendary Leica glow',
        isoSpec: {
            min: 12,
            max: 6400,
            nativeMin: 25, // 일반적인 필름 ISO 범위
            nativeMax: 3200,
            stops: [12, 16, 20, 25, 32, 40, 50, 64, 80, 100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6400],
            defaultValue: 100 // 필름의 일반적인 기본 ISO
        },
        shutterSpeedSpec: {
            min: '1',
            max: '1/1000',
            stops: [
                '1', '0.8', '0.6', '0.5', '0.4', '0.3', '1/4', '1/5', '1/6', '1/8', '1/10', '1/13', '1/15', '1/20', '1/25',
                '1/30', '1/40', '1/50', '1/60', '1/80', '1/100', '1/125', '1/160', '1/200', '1/250', '1/320', '1/400',
                '1/500', '1/640', '1/800', '1/1000'
            ],
            defaultValue: '1/125'
        },
        aspectRatioSpec: FILM_35MM_ASPECT_RATIO
    },
    {
        id: 'hasselblad_500cm_film',
        brand: 'Hasselblad',
        model: '500C/M',
        mount: 'Hasselblad V',
        sensorSize: '6x6cm Medium Format Film',
        megapixel: 0, // 필름 카메라
        metaToken: 'FILM_HASSELBLAD_500CM',
        promptKeywords: 'vintage medium format look, classic film tones, 6x6 square aesthetic',
        isoSpec: {
            min: 12,
            max: 6400,
            nativeMin: 25,
            nativeMax: 3200,
            stops: [12, 16, 20, 25, 32, 40, 50, 64, 80, 100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6400],
            defaultValue: 100
        },
        shutterSpeedSpec: {
            min: '1',
            max: '1/500', // Lens-integrated leaf shutter
            stops: [
                '1', '0.8', '0.6', '0.5', '0.4', '0.3', '1/4', '1/5', '1/6', '1/8', '1/10', '1/13', '1/15', '1/20', '1/25',
                '1/30', '1/40', '1/50', '1/60', '1/80', '1/100', '1/125', '1/160', '1/200', '1/250', '1/320', '1/400', '1/500'
            ],
            defaultValue: '1/125'
        },
        aspectRatioSpec: MEDIUM_FORMAT_6X6_ASPECT_RATIO
    },
    {
        id: 'pentax_67_film',
        brand: 'Pentax',
        model: '67',
        mount: 'Pentax 67',
        sensorSize: '6x7cm Medium Format Film',
        megapixel: 0, // 필름 카메라
        metaToken: 'FILM_PENTAX_67',
        promptKeywords: 'medium format film rendering, dreamy 6x7 tones, vintage bokeh richness',
        isoSpec: {
            min: 12,
            max: 6400,
            nativeMin: 25,
            nativeMax: 3200,
            stops: [12, 16, 20, 25, 32, 40, 50, 64, 80, 100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6400],
            defaultValue: 100
        },
        shutterSpeedSpec: {
            min: '1',
            max: '1/1000',
            stops: [
                '1', '0.8', '0.6', '0.5', '0.4', '0.3', '1/4', '1/5', '1/6', '1/8', '1/10', '1/13', '1/15', '1/20', '1/25',
                '1/30', '1/40', '1/50', '1/60', '1/80', '1/100', '1/125', '1/160', '1/200', '1/250', '1/320', '1/400',
                '1/500', '1/640', '1/800', '1/1000'
            ],
            defaultValue: '1/125'
        },
        aspectRatioSpec: MEDIUM_FORMAT_6X7_ASPECT_RATIO
    }
];

// 정렬된 배열 export: 1) Brand Name (A-Z), 2) 동일 브랜드 내 Model (A-Z)
export const CAMERA_BODIES = [..._CAMERA_BODIES].sort((a, b) => {
    // 1차: Brand Name 알파벳 순
    const brandCompare = a.brand.localeCompare(b.brand);
    if (brandCompare !== 0) return brandCompare;
    // 2차: 동일 브랜드 내 Model 알파벳 순
    return a.model.localeCompare(b.model);
});

// 브랜드별 그룹핑 (정렬된 배열 기반)
export const CAMERA_BODIES_BY_BRAND = CAMERA_BODIES.reduce<Record<string, CameraBody[]>>((acc, camera) => {
    if (!acc[camera.brand]) {
        acc[camera.brand] = [];
    }
    acc[camera.brand].push(camera);
    return acc;
}, {});

// ID로 카메라 조회
export function getCameraById(id: string): CameraBody | undefined {
    return CAMERA_BODIES.find(camera => camera.id === id);
}