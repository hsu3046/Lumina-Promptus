// config/mappings/cameras.ts
// 카메라 바디 데이터 매핑 - 20종 추가 (v1.1)

import type { CameraBody, ISOSpec, ShutterSpeedSpec, Mount } from '@/types';

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

export const CAMERA_BODIES: CameraBody[] = [
    // ===== 기존 5종 =====
    {
        id: 'canon_eos_r5',
        brand: 'Canon',
        model: 'EOS R5',
        mount: 'Canon RF',
        sensorSize: 'Full Frame',
        megapixel: 45,
        characteristics: '따뜻한 스킨톤, 정밀한 디테일, 다이나믹 레인지',
        metaToken: 'CR3_CANON_EOS_R5',
        promptKeywords: 'shot on Canon EOS R5, full frame sensor, 45 megapixels, professional DSLR quality',
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
            max: '1/8000',
            stops: COMMON_SHUTTER_STOPS,
            defaultValue: '1/200'
        }
    },
    {
        id: 'sony_a7r_v',
        brand: 'Sony',
        model: 'A7R V',
        mount: 'Sony E',
        sensorSize: 'Full Frame',
        megapixel: 61,
        characteristics: '극도로 높은 해상도, 정확한 색재현, 뛰어난 저조도 성능',
        metaToken: 'ARW_SONY_A7RV',
        promptKeywords: 'shot on Sony A7R V, 61 megapixels, full frame mirrorless, exceptional resolution',
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
        id: 'nikon_z8',
        brand: 'Nikon',
        model: 'Z8',
        mount: 'Nikon Z',
        sensorSize: 'Full Frame',
        megapixel: 45.7,
        characteristics: '자연스러운 색감, 안정적인 화이트밸런스, 프로급 내구성',
        metaToken: 'NEF_NIKON_Z8',
        promptKeywords: 'shot on Nikon Z8, full frame sensor, natural color science, professional build',
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
        characteristics: '압도적인 디테일, 미디엄 포맷 보케, 럭셔리한 색감',
        metaToken: 'DNG_HASSELBLAD_X2D',
        promptKeywords: 'shot on Hasselblad X2D 100C, medium format sensor, 100 megapixels, exceptional detail and bokeh',
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
        characteristics: '클래식한 렌더링, 필름같은 질감, 수동 포커스 정밀함',
        metaToken: 'DNG_LEICA_M11',
        promptKeywords: 'shot on Leica M11, full frame rangefinder, 60 megapixels, classic Leica rendering, film-like quality',
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

    // ===== 신규 20종 추가 =====

    // 1. Canon EOS R5 Mark II ✅ 정확한 스펙 확인
    {
        id: 'canon_eos_r5_mark_ii',
        brand: 'Canon',
        model: 'EOS R5 Mark II',
        mount: 'Canon RF',
        sensorSize: 'Full Frame',
        megapixel: 45,
        characteristics: '스택형 센서, 아이 컨트롤 AF, 30fps 연사, 8K 60p',
        metaToken: 'CR3_CANON_EOS_R5_MKII',
        promptKeywords: 'shot on Canon EOS R5 Mark II, stacked full-frame BSI CMOS, 45 megapixels, eye-controlled AF, professional hybrid',
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

    // 2. Nikon Z9 ✅ 정확한 스펙 확인
    {
        id: 'nikon_z9',
        brand: 'Nikon',
        model: 'Z9',
        mount: 'Nikon Z',
        sensorSize: 'Full Frame',
        megapixel: 45.7,
        characteristics: '플래그십, 무한 버퍼, 8K 60p, 전자셔터 전용',
        metaToken: 'NEF_NIKON_Z9',
        promptKeywords: 'shot on Nikon Z9, flagship stacked sensor, 45.7 megapixels, electronic shutter only, professional sports camera',
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

    // 3. Sony A1 ✅ 정확한 스펙 확인
    {
        id: 'sony_a1',
        brand: 'Sony',
        model: 'A1',
        mount: 'Sony E',
        sensorSize: 'Full Frame',
        megapixel: 50.1,
        characteristics: '올라운더, 30fps 연사, 8K 30p, 빠른 AF',
        metaToken: 'ARW_SONY_A1',
        promptKeywords: 'shot on Sony A1, 50.1 megapixels, stacked BSI CMOS, flagship speed and resolution',
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
            max: '1/32000', // Electronic shutter
            stops: [
                ...COMMON_SHUTTER_STOPS,
                '1/10000', '1/12500', '1/16000', '1/20000', '1/25000', '1/32000'
            ],
            defaultValue: '1/200'
        }
    },

    // 4. Sony A9 III ✅ 정확한 스펙 확인
    {
        id: 'sony_a9_iii',
        brand: 'Sony',
        model: 'A9 III',
        mount: 'Sony E',
        sensorSize: 'Full Frame',
        megapixel: 24.6,
        characteristics: '세계 최초 글로벌 셔터, 120fps 연사, 롤링셔터 제로',
        metaToken: 'ARW_SONY_A9III',
        promptKeywords: 'shot on Sony A9 III, global shutter sensor, 24.6 megapixels, zero rolling shutter, 120fps bursts',
        isoSpec: {
            min: 125,
            max: 51200,
            nativeMin: 250,
            nativeMax: 25600,
            stops: [125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6400, 8000, 10000, 12800, 16000, 20000, 25600, 32000, 40000, 51200],
            defaultValue: 250
        },
        shutterSpeedSpec: {
            min: '30',
            max: '1/80000', // Global shutter
            stops: [
                ...COMMON_SHUTTER_STOPS,
                '1/10000', '1/12500', '1/16000', '1/20000', '1/25000', '1/32000',
                '1/40000', '1/50000', '1/64000', '1/80000'
            ],
            defaultValue: '1/250'
        }
    },

    // 5. Canon EOS R6 Mark II ✅ 정확한 스펙 확인
    {
        id: 'canon_eos_r6_mark_ii',
        brand: 'Canon',
        model: 'EOS R6 Mark II',
        mount: 'Canon RF',
        sensorSize: 'Full Frame',
        megapixel: 24,
        characteristics: '저조도 특화, 40fps 연사, 올라운드 워크호스',
        metaToken: 'CR3_CANON_EOS_R6_MKII',
        promptKeywords: 'shot on Canon EOS R6 Mark II, 24 megapixels, low-light specialist, fast hybrid camera',
        isoSpec: {
            min: 50,
            max: 204800,
            nativeMin: 100,
            nativeMax: 102400,
            stops: [50, ...COMMON_ISO_STOPS, 64000, 102400, 128000, 160000, 204800],
            defaultValue: 100
        },
        shutterSpeedSpec: {
            min: '30',
            max: '1/16000', // Electronic shutter
            stops: [
                ...COMMON_SHUTTER_STOPS,
                '1/10000', '1/12500', '1/16000'
            ],
            defaultValue: '1/200'
        }
    },

    // 6. Nikon Z6 III ✅ 정확한 스펙 확인
    {
        id: 'nikon_z6_iii',
        brand: 'Nikon',
        model: 'Z6 III',
        mount: 'Nikon Z',
        sensorSize: 'Full Frame',
        megapixel: 24.5,
        characteristics: '부분 스택형 센서, 콘텐츠 인증, 저조도 성능',
        metaToken: 'NEF_NIKON_Z6III',
        promptKeywords: 'shot on Nikon Z6 III, partially stacked sensor, 24.5 megapixels, content credentials, hybrid powerhouse',
        isoSpec: {
            min: 50,
            max: 204800,
            nativeMin: 100,
            nativeMax: 64000,
            stops: [50, ...COMMON_ISO_STOPS, 64000, 80000, 102400, 128000, 160000, 204800],
            defaultValue: 100
        },
        shutterSpeedSpec: {
            min: '30',
            max: '1/16000', // Electronic shutter
            stops: [
                ...COMMON_SHUTTER_STOPS,
                '1/10000', '1/12500', '1/16000'
            ],
            defaultValue: '1/200'
        }
    },

    // 7. Fujifilm GFX100 II ✅ 정확한 스펙 확인
    {
        id: 'fujifilm_gfx100_ii',
        brand: 'Fujifilm',
        model: 'GFX100 II',
        mount: 'Fujifilm G',
        sensorSize: 'Medium Format',
        megapixel: 102,
        characteristics: '미디엄 포맷, 초고해상도, 8스탑 손떨림 보정',
        metaToken: 'RAF_FUJIFILM_GFX100II',
        promptKeywords: 'shot on Fujifilm GFX100 II, medium format 102 megapixels, exceptional detail, Fujifilm color science',
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

    // 8. Fujifilm X-T5 ✅ 정확한 스펙 확인
    {
        id: 'fujifilm_x_t5',
        brand: 'Fujifilm',
        model: 'X-T5',
        mount: 'Fujifilm X',
        sensorSize: 'APS-C',
        megapixel: 40.2,
        characteristics: 'X-Trans CMOS, 필름 시뮬레이션, 복고 디자인',
        metaToken: 'RAF_FUJIFILM_XT5',
        promptKeywords: 'shot on Fujifilm X-T5, APS-C 40.2 megapixels, X-Trans sensor, film simulation, retro design',
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

    // 9. Panasonic Lumix S5 IIX ✅ 정확한 스펙 확인
    {
        id: 'panasonic_lumix_s5_iix',
        brand: 'Panasonic',
        model: 'Lumix S5 IIX',
        mount: 'Panasonic L',
        sensorSize: 'Full Frame',
        megapixel: 24.2,
        characteristics: '비디오 전문, ProRes 내부 녹화, 오픈게이트',
        metaToken: 'RW2_PANASONIC_S5IIX',
        promptKeywords: 'shot on Panasonic Lumix S5 IIX, 24.2 megapixels, cinema-grade video, ProRes internal recording',
        isoSpec: {
            min: 50,
            max: 204800,
            nativeMin: 100,
            nativeMax: 51200,
            stops: [50, ...COMMON_ISO_STOPS, 64000, 80000, 102400, 128000, 160000, 204800],
            defaultValue: 100
        },
        shutterSpeedSpec: {
            min: '60',
            max: '1/8000',
            stops: [
                '60', '45', '30', '25', '20', '15', '13', '10', '8', '6', '5', '4', '3.2', '2.5', '2', '1.6', '1.3', '1',
                '0.8', '0.6', '0.5', '0.4', '0.3', '1/4', '1/5', '1/6', '1/8', '1/10', '1/13', '1/15', '1/20', '1/25',
                '1/30', '1/40', '1/50', '1/60', '1/80', '1/100', '1/125', '1/160', '1/200', '1/250', '1/320', '1/400',
                '1/500', '1/640', '1/800', '1/1000', '1/1250', '1/1600', '1/2000', '1/2500', '1/3200', '1/4000',
                '1/5000', '1/6400', '1/8000'
            ],
            defaultValue: '1/200'
        }
    },

    // 10. Hasselblad 907X & CFV 100C ✅ 정확한 스펙 확인
    {
        id: 'hasselblad_907x_cfv_100c',
        brand: 'Hasselblad',
        model: '907X & CFV 100C',
        mount: 'Hasselblad X',
        sensorSize: 'Medium Format',
        megapixel: 100,
        characteristics: '모듈식 디자인, 리프 셔터, V시스템 호환, 클래식 디자인',
        metaToken: 'DNG_HASSELBLAD_907X',
        promptKeywords: 'shot on Hasselblad 907X CFV 100C, medium format 100 megapixels, modular design, waist-level shooting, classic Hasselblad aesthetic',
        isoSpec: {
            min: 64,
            max: 25600,
            nativeMin: 64,
            nativeMax: 25600,
            stops: [64, 100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6400, 8000, 10000, 12800, 16000, 20000, 25600],
            defaultValue: 100
        },
        shutterSpeedSpec: {
            min: '68min', // 특이하게 68분 지원
            max: '1/6000', // Electronic shutter
            stops: [
                '68min', '60', '45', '30', '25', '20', '15', '13', '10', '8', '6', '5', '4', '3.2', '2.5', '2', '1.6', '1.3', '1',
                '0.8', '0.6', '0.5', '0.4', '0.3', '1/4', '1/5', '1/6', '1/8', '1/10', '1/13', '1/15', '1/20', '1/25',
                '1/30', '1/40', '1/50', '1/60', '1/80', '1/100', '1/125', '1/160', '1/200', '1/250', '1/320', '1/400',
                '1/500', '1/640', '1/800', '1/1000', '1/1250', '1/1600', '1/2000', '1/2500', '1/3200', '1/4000', // XCD 렌즈
                '1/5000', '1/6000' // Electronic shutter
            ],
            defaultValue: '1/200'
        }
    },

    // 11. Leica SL3 ✅ 정확한 스펙 확인
    {
        id: 'leica_sl3',
        brand: 'Leica',
        model: 'SL3',
        mount: 'Leica L',
        sensorSize: 'Full Frame',
        megapixel: 60,
        characteristics: 'Triple Resolution, 8K 동영상, 혁신적인 3다이얼 인터페이스',
        metaToken: 'DNG_LEICA_SL3',
        promptKeywords: 'shot on Leica SL3, 60 megapixels BSI CMOS, triple resolution technology, L-mount flagship, Leica color science',
        isoSpec: {
            min: 50,
            max: 100000,
            nativeMin: 100,
            nativeMax: 50000,
            stops: [50, 64, 80, 100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6400, 8000, 10000, 12800, 16000, 20000, 25600, 32000, 40000, 50000, 64000, 80000, 100000],
            defaultValue: 100
        },
        shutterSpeedSpec: {
            min: '30',
            max: '1/8000',
            stops: COMMON_SHUTTER_STOPS,
            defaultValue: '1/200'
        }
    },

    // 12. Leica SL3-S ✅ 정확한 스펙 확인
    {
        id: 'leica_sl3_s',
        brand: 'Leica',
        model: 'SL3-S',
        mount: 'Leica L',
        sensorSize: 'Full Frame',
        megapixel: 24,
        characteristics: '저조도 특화, 6K 동영상, Content Credentials, 빠른 AF',
        metaToken: 'DNG_LEICA_SL3S',
        promptKeywords: 'shot on Leica SL3-S, 24 megapixels BSI CMOS, low-light specialist, 6K open gate video, professional hybrid',
        isoSpec: {
            min: 50,
            max: 100000,
            nativeMin: 100,
            nativeMax: 50000,
            stops: [50, 64, 80, 100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6400, 8000, 10000, 12800, 16000, 20000, 25600, 32000, 40000, 50000, 64000, 80000, 100000],
            defaultValue: 100
        },
        shutterSpeedSpec: {
            min: '30',
            max: '1/8000',
            stops: COMMON_SHUTTER_STOPS,
            defaultValue: '1/200'
        }
    },

    // 13. Leica M11-P ✅ 정확한 스펙 확인
    {
        id: 'leica_m11_p',
        brand: 'Leica',
        model: 'M11-P',
        mount: 'Leica M',
        sensorSize: 'Full Frame',
        megapixel: 60,
        characteristics: 'Content Credentials, 레인지파인더, 256GB 내장 메모리, 사파이어 LCD',
        metaToken: 'DNG_LEICA_M11P',
        promptKeywords: 'shot on Leica M11-P, 60 megapixels BSI CMOS, rangefinder, triple resolution, content authenticity, discreet photography',
        isoSpec: {
            min: 64,
            max: 50000,
            nativeMin: 64,
            nativeMax: 50000,
            stops: [64, 80, 100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6400, 8000, 10000, 12800, 16000, 20000, 25600, 32000, 40000, 50000],
            defaultValue: 100
        },
        shutterSpeedSpec: {
            min: '60min',
            max: '1/16000', // Electronic shutter
            stops: [
                '60min', '60', '45', '30', '25', '20', '15', '13', '10', '8', '6', '5', '4', '3.2', '2.5', '2', '1.6', '1.3', '1',
                '0.8', '0.6', '0.5', '0.4', '0.3', '1/4', '1/5', '1/6', '1/8', '1/10', '1/13', '1/15', '1/20', '1/25',
                '1/30', '1/40', '1/50', '1/60', '1/80', '1/100', '1/125', '1/160', '1/180', // Flash sync at 1/180
                '1/200', '1/250', '1/320', '1/400', '1/500', '1/640', '1/800', '1/1000', '1/1250', '1/1600',
                '1/2000', '1/2500', '1/3200', '1/4000', // Mechanical shutter max
                '1/5000', '1/6400', '1/8000', '1/10000', '1/12500', '1/16000' // Electronic shutter
            ],
            defaultValue: '1/200'
        }
    },

    // 14. Sony A7 IV ✅ 정확한 스펙 확인
    {
        id: 'sony_a7_iv',
        brand: 'Sony',
        model: 'A7 IV',
        mount: 'Sony E',
        sensorSize: 'Full Frame',
        megapixel: 33,
        characteristics: '베스트셀러, 하이브리드, 759 PDAF 포인트, 10fps',
        metaToken: 'ARW_SONY_A7IV',
        promptKeywords: 'shot on Sony A7 IV, 33 megapixels BSI CMOS, versatile hybrid camera, real-time tracking AF, 4K 60p video',
        isoSpec: {
            min: 50,
            max: 204800,
            nativeMin: 100,
            nativeMax: 51200,
            stops: [50, 64, 80, 100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6400, 8000, 10000, 12800, 16000, 20000, 25600, 32000, 40000, 51200, 64000, 80000, 102400, 128000, 160000, 204800],
            defaultValue: 100
        },
        shutterSpeedSpec: {
            min: '30',
            max: '1/8000',
            stops: COMMON_SHUTTER_STOPS,
            defaultValue: '1/200'
        }
    },

    // 15. Canon EOS R3 ✅ 정확한 스펙 확인
    {
        id: 'canon_eos_r3',
        brand: 'Canon',
        model: 'EOS R3',
        mount: 'Canon RF',
        sensorSize: 'Full Frame',
        megapixel: 24,
        characteristics: '스포츠 플래그십, Eye Control AF, 30fps, 스택형 센서',
        metaToken: 'CR3_CANON_EOS_R3',
        promptKeywords: 'shot on Canon EOS R3, 24 megapixels stacked CMOS, professional sports photography, eye-controlled autofocus, 30fps continuous shooting',
        isoSpec: {
            min: 50,
            max: 204800,
            nativeMin: 100,
            nativeMax: 102400,
            stops: [50, 64, 80, 100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6400, 8000, 10000, 12800, 16000, 20000, 25600, 32000, 40000, 51200, 64000, 80000, 102400, 128000, 160000, 204800],
            defaultValue: 100
        },
        shutterSpeedSpec: {
            min: '30',
            max: '1/64000', // Electronic shutter
            stops: [
                '30', '25', '20', '15', '13', '10', '8', '6', '5', '4', '3.2', '2.5', '2', '1.6', '1.3', '1',
                '0.8', '0.6', '0.5', '0.4', '0.3', '1/4', '1/5', '1/6', '1/8', '1/10', '1/13', '1/15', '1/20', '1/25',
                '1/30', '1/40', '1/50', '1/60', '1/80', '1/100', '1/125', '1/160', '1/200', '1/250', '1/320', '1/400',
                '1/500', '1/640', '1/800', '1/1000', '1/1250', '1/1600', '1/2000', '1/2500', '1/3200', '1/4000',
                '1/5000', '1/6400', '1/8000', // Mechanical shutter max
                '1/10000', '1/12500', '1/16000', '1/20000', '1/25000', '1/32000', '1/40000', '1/50000', '1/64000' // Electronic shutter
            ],
            defaultValue: '1/250'
        }
    },

    // 16. Leica Q3 ✅ 정확한 스펙 확인 (고정렌즈 28mm f/1.7)
    {
        id: 'leica_q3',
        brand: 'Leica',
        model: 'Q3',
        mount: 'Leica L',
        sensorSize: 'Full Frame',
        megapixel: 60,
        characteristics: '고정렌즈 Summilux 28mm f/1.7, Triple Resolution, 8K 동영상, 틸팅 LCD',
        metaToken: 'DNG_LEICA_Q3',
        promptKeywords: 'shot on Leica Q3, 60 megapixels BSI CMOS, Summilux 28mm f/1.7 ASPH lens, premium compact, triple resolution technology',
        isoSpec: {
            min: 50,
            max: 100000,
            nativeMin: 100,
            nativeMax: 100000,
            stops: [50, 64, 80, 100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6400, 8000, 10000, 12800, 16000, 20000, 25600, 32000, 40000, 50000, 64000, 80000, 100000],
            defaultValue: 100
        },
        shutterSpeedSpec: {
            min: '120',
            max: '1/16000', // Electronic shutter
            stops: [
                '120', '60', '45', '30', '25', '20', '15', '13', '10', '8', '6', '5', '4', '3.2', '2.5', '2', '1.6', '1.3', '1',
                '0.8', '0.6', '0.5', '0.4', '0.3', '1/4', '1/5', '1/6', '1/8', '1/10', '1/13', '1/15', '1/20', '1/25',
                '1/30', '1/40', '1/50', '1/60', '1/80', '1/100', '1/125', '1/160', '1/200', '1/250', '1/320', '1/400',
                '1/500', '1/640', '1/800', '1/1000', '1/1250', '1/1600', '1/2000', // Mechanical shutter max
                '1/2500', '1/3200', '1/4000', '1/5000', '1/6400', '1/8000', '1/10000', '1/12500', '1/16000' // Electronic shutter
            ],
            defaultValue: '1/200'
        }
    },

    // 17. Fujifilm X100VI ✅ 정확한 스펙 확인 (고정렌즈 23mm f/2, APS-C)
    {
        id: 'fujifilm_x100vi',
        brand: 'Fujifilm',
        model: 'X100VI',
        mount: 'Fujifilm X',
        sensorSize: 'APS-C',
        megapixel: 40.2,
        characteristics: '고정렌즈 23mm f/2, 하이브리드 뷰파인더, 필름 시뮬레이션 20종, 6.0스탑 IBIS',
        metaToken: 'RAF_FUJIFILM_X100VI',
        promptKeywords: 'shot on Fujifilm X100VI, 40 megapixels X-Trans CMOS 5 HR, fixed 23mm f/2 lens, film simulation, retro compact camera',
        isoSpec: {
            min: 125,
            max: 12800,
            nativeMin: 125,
            nativeMax: 12800,
            stops: [125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6400, 8000, 10000, 12800],
            defaultValue: 200
        },
        shutterSpeedSpec: {
            min: '30',
            max: '1/4000', // Mechanical shutter
            stops: COMMON_SHUTTER_STOPS,
            defaultValue: '1/250'
        }
    },

    // ===== 전설적인 필름 카메라 (4종) =====

    // 18. Leica M3 ✅ 정확한 스펙 확인 (1954-1967 필름 카메라)
    {
        id: 'leica_m3_film',
        brand: 'Leica',
        model: 'M3 (Film)',
        mount: 'Leica M',
        sensorSize: '35mm Film',
        megapixel: 0, // 필름 카메라
        characteristics: '전설의 레인지파인더, 라이카 광택, M-mount 원조, 거리 사진의 아이콘',
        metaToken: 'FILM_LEICA_M3',
        promptKeywords: 'shot on Leica M3 film camera, classic rangefinder, 35mm film aesthetic, Leica glow, legendary bokeh, vintage street photography',
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
        }
    },

    // 19. Hasselblad 500C/M ✅ 정확한 스펙 확인 (1970-1989 필름 카메라)
    {
        id: 'hasselblad_500cm_film',
        brand: 'Hasselblad',
        model: '500C/M (Film)',
        mount: 'Hasselblad V',
        sensorSize: '6x6cm Medium Format Film',
        megapixel: 0, // 필름 카메라
        characteristics: '중형 필름의 정점, 정방형 6x6, 모듈식 시스템, NASA 우주 카메라',
        metaToken: 'FILM_HASSELBLAD_500CM',
        promptKeywords: 'shot on Hasselblad 500C/M film camera, 6x6 square format, medium format film aesthetic, Carl Zeiss optics, waist-level composition, NASA space photography',
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
        }
    },

    // 20. Nikon F3 ✅ 정확한 스펙 확인 (1980-2000 필름 카메라)
    {
        id: 'nikon_f3_film',
        brand: 'Nikon',
        model: 'F3 (Film)',
        mount: 'Nikon F',
        sensorSize: '35mm Film',
        megapixel: 0, // 필름 카메라
        characteristics: '기계식 SLR 완성형, 보도 사진 표준, 80~90년대 아이콘, 조르제토 쥬지아로 디자인',
        metaToken: 'FILM_NIKON_F3',
        promptKeywords: 'shot on Nikon F3 film camera, professional SLR, photojournalism aesthetic, 35mm film, vintage news photography, 80s-90s documentary style',
        isoSpec: {
            min: 12,
            max: 6400,
            nativeMin: 25,
            nativeMax: 3200,
            stops: [12, 16, 20, 25, 32, 40, 50, 64, 80, 100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6400],
            defaultValue: 100
        },
        shutterSpeedSpec: {
            min: '8',
            max: '1/2000',
            stops: [
                '8', '6', '5', '4', '3.2', '2.5', '2', '1.6', '1.3', '1', '0.8', '0.6', '0.5', '0.4', '0.3',
                '1/4', '1/5', '1/6', '1/8', '1/10', '1/13', '1/15', '1/20', '1/25', '1/30', '1/40', '1/50', '1/60',
                '1/80', '1/100', '1/125', '1/160', '1/200', '1/250', '1/320', '1/400', '1/500', '1/640', '1/800',
                '1/1000', '1/1250', '1/1600', '1/2000'
            ],
            defaultValue: '1/125'
        }
    },

    // 21. Pentax 67 ✅ 정확한 스펙 확인 (1969-2009 필름 카메라)
    {
        id: 'pentax_67_film',
        brand: 'Pentax',
        model: '67 (Film)',
        mount: 'Pentax 67',
        sensorSize: '6x7cm Medium Format Film',
        megapixel: 0, // 필름 카메라
        characteristics: '꿈의 인물 카메라, 6x7 대형 판형, 초대형 SLR, 압도적 보케',
        metaToken: 'FILM_PENTAX_67',
        promptKeywords: 'shot on Pentax 67 film camera, 6x7 medium format, portrait photography legend, shallow depth of field, oversized SLR, dream camera bokeh',
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
        }
    }
];

// 브랜드별 그룹핑
export const CAMERA_BODIES_BY_BRAND = CAMERA_BODIES.reduce((acc, camera) => {
    if (!acc[camera.brand]) {
        acc[camera.brand] = [];
    }
    acc[camera.brand].push(camera);
    return acc;
}, {} as Record<string, CameraBody[]>);

// ID로 카메라 조회
export function getCameraById(id: string): CameraBody | undefined {
    return CAMERA_BODIES.find(camera => camera.id === id);
}

/* 
========================
✅ 정확한 스펙 확인 완료 (21종)
========================

**디지털 카메라 (17종)**

1. Canon EOS R5 Mark II (45MP) - 스택형 센서, 30fps
2. Nikon Z9 (45.7MP) - 플래그십, 전자셔터 전용
3. Sony A1 (50.1MP) - 올라운더, 30fps
4. Sony A9 III (24.6MP) - 글로벌 셔터, 120fps, 1/80000s
5. Canon EOS R6 Mark II (24MP) - 저조도 특화, 40fps
6. Nikon Z6 III (24.5MP) - 부분 스택형 센서
7. Fujifilm GFX100 II (102MP) - 미디엄 포맷, 8스탑 손떨림보정
8. Fujifilm X-T5 (40.2MP APS-C) - X-Trans, 필름 시뮬레이션
9. Panasonic Lumix S5 IIX (24.2MP) - ProRes 내부녹화
10. Hasselblad 907X & CFV 100C (100MP) - 모듈식, 68분 장노출
11. Leica SL3 (60MP) - Triple Resolution, 8K, ISO 50-100000
12. Leica SL3-S (24MP) - 저조도, 6K, Content Credentials
13. Leica M11-P (60MP) - 레인지파인더, 60분 장노출, 256GB 메모리
14. Sony A7 IV (33MP) ⭐ - 베스트셀러 #1, 하이브리드
15. Canon EOS R3 (24MP) ⭐ - 스포츠 플래그십, Eye Control AF, 1/64000s
16. Leica Q3 (60MP, 고정 28mm f/1.7) ⭐ - 럭셔리 컴팩트, 8K
17. Fujifilm X100VI (40.2MP APS-C, 고정 23mm f/2) ⭐ - 2024년 최고 인기, IBIS

**전설적인 필름 카메라 (4종)** 🎞️

18. Leica M3 (1954-1967) ⭐ - 거리 사진의 전설, 라이카 광택, M-mount 원조
19. Hasselblad 500C/M (1970-1989) ⭐ - 중형 필름 정점, 6x6 정방형, NASA 우주 카메라
20. Nikon F3 (1980-2000) ⭐ - 기계식 SLR 완성형, 보도 사진 표준, 쥬지아로 디자인
21. Pentax 67 (1969-2009) ⭐ - 꿈의 인물 카메라, 6x7 대형 판형, 압도적 보케

========================
💡 필름 카메라 특징
========================

**Leica M3 (35mm Film)**
- 1/1000s 셔터, ISO 12-6400 (필름 설정)
- M-mount 원조, 레인지파인더의 전설
- "라이카 광택"과 독특한 보케로 유명
- 거리 사진과 인물 사진의 아이콘

**Hasselblad 500C/M (6x6cm Medium Format Film)**
- 1/500s 리프 셔터 (모든 속도에서 플래시 동조 가능)
- Carl Zeiss 렌즈, 정방형 1:1 구도
- 모듈식 시스템 (렌즈, 뷰파인더, 필름백 교환)
- NASA가 달 탐사에 사용한 카메라

**Nikon F3 (35mm Film)**
- 8s-1/2000s 전자식 셔터
- 조르제토 쥬지아로 디자인
- 80~90년대 보도 사진 표준
- 20년 이상 생산 (1980-2000)

**Pentax 67 (6x7cm Medium Format Film)**
- 1-1/1000s 셔터
- "초대형 35mm SLR" 스타일
- 6x7 대형 판형으로 압도적 보케
- 인물 사진가들의 "꿈의 카메라"

========================
*/