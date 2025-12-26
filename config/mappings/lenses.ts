// config/mappings/lenses.ts
// 렌즈 데이터 매핑

/* 
========================
✅ 정확한 스펙 확인 완료 (30종)
========================

**최신 프라임 렌즈 (12종)**

CANON RF MOUNT (3종)
1. RF 50mm f/1.2L USM - 표준 최고봉, 10-blade 조리개
2. RF 85mm f/1.2L USM - 인물 사진 완벽, Blue Spectrum Refractive Optics
3. RF 24mm f/1.4L VCM - 광각 인물 최적, Voice Coil Motor

SONY G MASTER (3종)
4. FE 50mm f/1.2 GM - XA 렌즈 3매, 11-blade 조리개
5. FE 85mm f/1.4 GM - G Master 광학, 정확한 AF
6. FE 135mm f/1.8 GM - 압축 효과 극한, 스포츠/인물 겸용

NIKON Z S-LINE (2종)
7. NIKKOR Z 50mm f/1.2 S - Nano Crystal Coat, 9-blade
8. NIKKOR Z 85mm f/1.2 S - S-Line 플래그십, 11-blade

LEICA M-MOUNT (3종)
9. Noctilux-M 50mm f/0.95 ASPH ⭐ - 세계에서 가장 밝은 렌즈!
10. Summilux-M 50mm f/1.4 ASPH - 클래식 라이카 렌더링
11. APO-Summicron-M 50mm f/2 ASPH - APO 크로메틱 보정 완벽

FUJIFILM XF (1종)
12. XF 56mm f/1.2 R WR - APS-C 인물 최적 (85mm 환산)

**표준 줌 렌즈 (5종)**
13. Sony FE 24-70mm f/2.8 GM II - XD Linear AF
14. Canon RF 24-70mm f/2.8L IS USM - 5스탑 IS
15. Nikon NIKKOR Z 24-70mm f/2.8 S - Nano Crystal Coat
16. Leica Vario-Elmarit-SL 24-70mm f/2.8 ASPH - L-mount
17. Fujifilm XF 16-55mm f/2.8 R LM WR - APS-C (24-84mm 환산)

**초광각 렌즈 (3종)**
18. Nikon NIKKOR Z 14-24mm f/2.8 S - 별사진 최적
19. Canon RF 15-35mm f/2.8L IS USM - 5스탑 IS
20. Sony FE 12-24mm f/2.8 GM - 극초광각

**중형 포맷 렌즈 (3종)** 📸
21. Hasselblad XCD 90mm f/2.5 V - 미디엄 포맷 최적화
22. Fujifilm GF 80mm f/1.7 R WR - 중형 포맷 최고 밝기
23. Hasselblad HC 80mm f/2.8 - V시스템 호환, Carl Zeiss 설계

**전설적인 올드렌즈 (7종)** 🎞️
24. Canon EF 85mm f/1.2L II USM (Classic) - 전설의 인물렌즈
25. Canon FD 55mm f/1.2 S.S.C. (Vintage) - 70년대 클래식
26. Leica Noctilux 50mm f/1.0 (Version 4) - 올드 녹틸럭스
27. Pentax SMC 67 105mm f/2.4 (Film) ⭐ - 중형 필름 전설
28. Carl Zeiss Planar C 80mm f/2.8 T* ⭐ - 핫셀블라드 V시스템
29. Nikon NIKKOR 50mm f/1.2 AI-S (Vintage) - 니콘 F3 시대
30. Minolta MD Rokkor 50mm f/1.2 (Vintage) - 미놀타 전설

========================
💡 렌즈 특징 요약
========================

**세계에서 가장 밝은 렌즈들**
- Leica Noctilux-M 50mm f/0.95 ASPH: 세계 최고 밝기!
- Leica Noctilux 50mm f/1.0 (v4): 빈티지 극한 밝기
- Canon RF 50mm f/1.2L: 표준 렌즈 최고봉
- Canon RF 85mm f/1.2L: 인물 사진 완벽
- Canon EF 85mm f/1.2L II: 전설의 올드렌즈

**중형 포맷 전용**
- Fujifilm GF 80mm f/1.7: 중형 포맷 최고 밝기
- Hasselblad XCD 90mm f/2.5 V: 상업 사진 최적
- Hasselblad HC 80mm f/2.8: V시스템 클래식
- Pentax SMC 67 105mm f/2.4: 필름 인물 전설
- Carl Zeiss Planar C 80mm f/2.8: T* 코팅 명품

**올드렌즈 특징**
- Canon FD 55mm f/1.2 S.S.C.: 소프트 렌더링, 따뜻한 색감
- Leica Noctilux 50mm f/1.0: 유니크한 빈티지 보케
- Nikon NIKKOR 50mm f/1.2 AI-S: F3 시대 수동 포커스 감성
- Minolta MD Rokkor 50mm f/1.2: 부드러운 보케, 따뜻한 톤

========================
*/

import type { Lens, ApertureSpec, Mount } from '@/types';

// 공통 1/3 스탑 조리개 배열 (f/1.2 ~ f/22)
const FULL_APERTURE_STOPS: string[] = [
    'f/1.2', 'f/1.4', 'f/1.6', 'f/1.8', 'f/2', 'f/2.2', 'f/2.5', 'f/2.8',
    'f/3.2', 'f/3.5', 'f/4', 'f/4.5', 'f/5', 'f/5.6', 'f/6.3', 'f/7.1',
    'f/8', 'f/9', 'f/10', 'f/11', 'f/13', 'f/14', 'f/16', 'f/18', 'f/20', 'f/22'
];

// 특정 범위의 조리개 스탑 배열 생성 헬퍼
function getApertureRange(minAperture: string, maxAperture: string): string[] {
    const minIdx = FULL_APERTURE_STOPS.indexOf(minAperture);
    const maxIdx = FULL_APERTURE_STOPS.indexOf(maxAperture);
    if (minIdx === -1 || maxIdx === -1) return [minAperture, maxAperture];
    return FULL_APERTURE_STOPS.slice(minIdx, maxIdx + 1);
}

export const LENSES: Lens[] = [
    // ===== 최신 프라임 렌즈 (12종) =====

    // Canon RF 프라임
    {
        id: 'canon_rf_50mm_f12',
        brand: 'Canon',
        model: 'RF 50mm f/1.2L USM',
        mount: 'Canon RF',
        focalLength: '50mm',
        maxAperture: 'f/1.2',
        category: 'standard',
        characteristics: '표준 최고봉, 극한의 밝기, 10-blade 원형 조리개, Air Sphere Coating',
        promptKeywords: '50mm f/1.2 lens, Canon RF mount, fastest 50mm, shallow depth of field, professional portrait',
        compatibleBodies: ['canon_eos_r5', 'canon_eos_r5_mark_ii', 'canon_eos_r6_mark_ii', 'canon_eos_r3'],
        apertureSpec: {
            min: 'f/1.2',
            max: 'f/16',
            stops: getApertureRange('f/1.2', 'f/16'),
            defaultValue: 'f/2.8'
        }
    },
    {
        id: 'canon_rf_85mm_f12',
        brand: 'Canon',
        model: 'RF 85mm f/1.2L USM',
        mount: 'Canon RF',
        focalLength: '85mm',
        maxAperture: 'f/1.2',
        category: 'medium_telephoto',
        characteristics: '인물 사진 완벽, 크리미한 보케, Blue Spectrum Refractive Optics',
        promptKeywords: '85mm lens, f/1.2 aperture, shallow depth of field, creamy bokeh, portrait lens',
        compatibleBodies: ['canon_eos_r5', 'canon_eos_r5_mark_ii', 'canon_eos_r6_mark_ii', 'canon_eos_r3'],
        apertureSpec: {
            min: 'f/1.2',
            max: 'f/16',
            stops: getApertureRange('f/1.2', 'f/16'),
            defaultValue: 'f/2.8'
        }
    },
    {
        id: 'canon_rf_24mm_f14',
        brand: 'Canon',
        model: 'RF 24mm f/1.4L VCM',
        mount: 'Canon RF',
        focalLength: '24mm',
        maxAperture: 'f/1.4',
        category: 'wide',
        characteristics: '광각 인물 최적, Voice Coil Motor, 환경적 포트레이트',
        promptKeywords: '24mm wide angle lens, f/1.4 aperture, environmental portrait, architectural photography',
        compatibleBodies: ['canon_eos_r5', 'canon_eos_r5_mark_ii', 'canon_eos_r6_mark_ii', 'canon_eos_r3'],
        apertureSpec: {
            min: 'f/1.4',
            max: 'f/16',
            stops: getApertureRange('f/1.4', 'f/16'),
            defaultValue: 'f/4'
        }
    },

    // Sony G Master 프라임
    {
        id: 'sony_gm_50mm_f12',
        brand: 'Sony',
        model: 'FE 50mm f/1.2 GM',
        mount: 'Sony E',
        focalLength: '50mm',
        maxAperture: 'f/1.2',
        category: 'standard',
        characteristics: 'G Master 최고급, XA 렌즈 3매, 11-blade 조리개',
        promptKeywords: '50mm f/1.2 lens, G Master optics, Sony E-mount, shallow bokeh, professional standard prime',
        compatibleBodies: ['sony_a7r_v', 'sony_a1', 'sony_a9_iii', 'sony_a7_iv'],
        apertureSpec: {
            min: 'f/1.2',
            max: 'f/16',
            stops: getApertureRange('f/1.2', 'f/16'),
            defaultValue: 'f/2.8'
        }
    },
    {
        id: 'sony_gm_85mm_f14',
        brand: 'Sony',
        model: 'FE 85mm f/1.4 GM',
        mount: 'Sony E',
        focalLength: '85mm',
        maxAperture: 'f/1.4',
        category: 'medium_telephoto',
        characteristics: 'G Master 광학, 정확한 AF, 둥근 보케, 최소 왜곡',
        promptKeywords: '85mm lens, f/1.4 aperture, G Master optics, beautiful bokeh, portrait lens',
        compatibleBodies: ['sony_a7r_v', 'sony_a1', 'sony_a9_iii', 'sony_a7_iv'],
        apertureSpec: {
            min: 'f/1.4',
            max: 'f/16',
            stops: getApertureRange('f/1.4', 'f/16'),
            defaultValue: 'f/2.8'
        }
    },
    {
        id: 'sony_gm_135mm_f18',
        brand: 'Sony',
        model: 'FE 135mm f/1.8 GM',
        mount: 'Sony E',
        focalLength: '135mm',
        maxAperture: 'f/1.8',
        category: 'telephoto',
        characteristics: '압축 효과 극한, 분리감 최고, 스포츠/인물 겸용',
        promptKeywords: '135mm lens, f/1.8 aperture, telephoto compression, extreme subject separation, sports portrait',
        compatibleBodies: ['sony_a7r_v', 'sony_a1', 'sony_a9_iii', 'sony_a7_iv'],
        apertureSpec: {
            min: 'f/1.8',
            max: 'f/22',
            stops: getApertureRange('f/1.8', 'f/22'),
            defaultValue: 'f/2.8'
        }
    },

    // Nikon Z 프라임
    {
        id: 'nikon_z_50mm_f12',
        brand: 'Nikon',
        model: 'NIKKOR Z 50mm f/1.2 S',
        mount: 'Nikon Z',
        focalLength: '50mm',
        maxAperture: 'f/1.2',
        category: 'standard',
        characteristics: 'S-Line 최고급, Nano Crystal Coat, 9-blade 조리개',
        promptKeywords: '50mm f/1.2 lens, Nikon Z mount, S-Line optics, professional standard prime',
        compatibleBodies: ['nikon_z9', 'nikon_z8', 'nikon_z6_iii'],
        apertureSpec: {
            min: 'f/1.2',
            max: 'f/16',
            stops: getApertureRange('f/1.2', 'f/16'),
            defaultValue: 'f/2.8'
        }
    },
    {
        id: 'nikon_z_85mm_f12',
        brand: 'Nikon',
        model: 'NIKKOR Z 85mm f/1.2 S',
        mount: 'Nikon Z',
        focalLength: '85mm',
        maxAperture: 'f/1.2',
        category: 'medium_telephoto',
        characteristics: 'S-Line 플래그십, 11-blade 조리개, 최상급 해상력',
        promptKeywords: '85mm f/1.2 lens, Nikon Z mount, S-Line portrait, shallow bokeh',
        compatibleBodies: ['nikon_z9', 'nikon_z8', 'nikon_z6_iii'],
        apertureSpec: {
            min: 'f/1.2',
            max: 'f/16',
            stops: getApertureRange('f/1.2', 'f/16'),
            defaultValue: 'f/2.8'
        }
    },

    // Leica 현대 렌즈
    {
        id: 'leica_noctilux_50mm_f095',
        brand: 'Leica',
        model: 'Noctilux-M 50mm f/0.95 ASPH',
        mount: 'Leica M',
        focalLength: '50mm',
        maxAperture: 'f/0.95',
        category: 'standard',
        characteristics: '세계에서 가장 밝은 렌즈, 극한의 보케, 어둠 속의 빛, 11-blade 조리개',
        promptKeywords: '50mm f/0.95 lens, Leica Noctilux, fastest lens, ultra shallow bokeh, night photography king',
        compatibleBodies: ['leica_m11_p', 'leica_m3_film'],
        apertureSpec: {
            min: 'f/0.95',
            max: 'f/16',
            stops: ['f/0.95', 'f/1', 'f/1.2', ...getApertureRange('f/1.4', 'f/16')],
            defaultValue: 'f/2'
        }
    },
    {
        id: 'leica_summilux_50mm',
        brand: 'Leica',
        model: 'Summilux-M 50mm f/1.4 ASPH',
        mount: 'Leica M',
        focalLength: '50mm',
        maxAperture: 'f/1.4',
        category: 'standard',
        characteristics: '클래식 라이카 렌더링, 필름같은 3D 입체감, 전설적인 보케',
        promptKeywords: '50mm lens, f/1.4 Leica Summilux, legendary bokeh, classic 3D rendering, film-like quality',
        compatibleBodies: ['leica_m11_p', 'leica_m3_film'],
        apertureSpec: {
            min: 'f/1.4',
            max: 'f/16',
            stops: getApertureRange('f/1.4', 'f/16'),
            defaultValue: 'f/2.8'
        }
    },
    {
        id: 'leica_apo_summicron_50mm',
        brand: 'Leica',
        model: 'APO-Summicron-M 50mm f/2 ASPH',
        mount: 'Leica M',
        focalLength: '50mm',
        maxAperture: 'f/2',
        category: 'standard',
        characteristics: 'APO 크로메틱 보정 완벽, 최고 해상력, 미세한 디테일',
        promptKeywords: '50mm f/2 lens, Leica APO, apochromatic correction, ultimate sharpness, detail king',
        compatibleBodies: ['leica_m11_p', 'leica_m3_film'],
        apertureSpec: {
            min: 'f/2',
            max: 'f/16',
            stops: getApertureRange('f/2', 'f/16'),
            defaultValue: 'f/4'
        }
    },

    // Fujifilm XF 프라임
    {
        id: 'fujifilm_xf_56mm_f12',
        brand: 'Fujifilm',
        model: 'XF 56mm f/1.2 R WR',
        mount: 'Fujifilm X',
        focalLength: '56mm',
        maxAperture: 'f/1.2',
        category: 'medium_telephoto',
        characteristics: 'APS-C 인물 최적 (85mm 환산), 부드러운 보케, 필름 시뮬레이션 최적화',
        promptKeywords: '56mm f/1.2 lens, Fujifilm X-mount, portrait lens, shallow bokeh, film simulation optimized',
        compatibleBodies: ['fujifilm_x_t5', 'fujifilm_x100vi'],
        apertureSpec: {
            min: 'f/1.2',
            max: 'f/16',
            stops: getApertureRange('f/1.2', 'f/16'),
            defaultValue: 'f/2.8'
        }
    },

    // ===== 표준 줌 렌즈 (5종) =====

    {
        id: 'sony_gm_24_70mm_f28',
        brand: 'Sony',
        model: 'FE 24-70mm f/2.8 GM II',
        mount: 'Sony E',
        focalLength: '24-70mm',
        maxAperture: 'f/2.8',
        category: 'standard',
        characteristics: '만능 표준 줌, 웨딩/이벤트용, XD Linear AF',
        promptKeywords: '24-70mm standard zoom, f/2.8 aperture, versatile focal range, professional event photography',
        compatibleBodies: ['sony_a7r_v', 'sony_a1', 'sony_a9_iii', 'sony_a7_iv'],
        apertureSpec: {
            min: 'f/2.8',
            max: 'f/22',
            stops: getApertureRange('f/2.8', 'f/22'),
            defaultValue: 'f/5.6'
        }
    },
    {
        id: 'canon_rf_24_70mm_f28',
        brand: 'Canon',
        model: 'RF 24-70mm f/2.8L IS USM',
        mount: 'Canon RF',
        focalLength: '24-70mm',
        maxAperture: 'f/2.8',
        category: 'standard',
        characteristics: '표준 줌 결정판, 5스탑 IS, Nano USM',
        promptKeywords: '24-70mm standard zoom, f/2.8 aperture, Canon RF mount, image stabilization, professional zoom',
        compatibleBodies: ['canon_eos_r5', 'canon_eos_r5_mark_ii', 'canon_eos_r6_mark_ii', 'canon_eos_r3'],
        apertureSpec: {
            min: 'f/2.8',
            max: 'f/22',
            stops: getApertureRange('f/2.8', 'f/22'),
            defaultValue: 'f/5.6'
        }
    },
    {
        id: 'nikon_z_24_70mm_f28',
        brand: 'Nikon',
        model: 'NIKKOR Z 24-70mm f/2.8 S',
        mount: 'Nikon Z',
        focalLength: '24-70mm',
        maxAperture: 'f/2.8',
        category: 'standard',
        characteristics: 'S-Line 표준 줌, Nano Crystal Coat, 최소 왜곡',
        promptKeywords: '24-70mm standard zoom, f/2.8 aperture, Nikon Z mount, S-Line optics, professional zoom',
        compatibleBodies: ['nikon_z9', 'nikon_z8', 'nikon_z6_iii'],
        apertureSpec: {
            min: 'f/2.8',
            max: 'f/22',
            stops: getApertureRange('f/2.8', 'f/22'),
            defaultValue: 'f/5.6'
        }
    },
    {
        id: 'leica_vario_elmarit_24_70mm',
        brand: 'Leica',
        model: 'Vario-Elmarit-SL 24-70mm f/2.8 ASPH',
        mount: 'Leica L',
        focalLength: '24-70mm',
        maxAperture: 'f/2.8',
        category: 'standard',
        characteristics: 'L-mount 표준 줌, 라이카 색감, 프리미엄 빌드',
        promptKeywords: '24-70mm standard zoom, f/2.8 aperture, Leica L-mount, premium build quality',
        compatibleBodies: ['leica_sl3', 'leica_sl3_s'],
        apertureSpec: {
            min: 'f/2.8',
            max: 'f/22',
            stops: getApertureRange('f/2.8', 'f/22'),
            defaultValue: 'f/5.6'
        }
    },
    {
        id: 'fujifilm_xf_16_55mm_f28',
        brand: 'Fujifilm',
        model: 'XF 16-55mm f/2.8 R LM WR',
        mount: 'Fujifilm X',
        focalLength: '16-55mm',
        maxAperture: 'f/2.8',
        category: 'standard',
        characteristics: 'APS-C 표준 줌 (24-84mm 환산), 방진방적, 필름 시뮬레이션',
        promptKeywords: '16-55mm standard zoom, f/2.8 aperture, Fujifilm X-mount, weather sealed',
        compatibleBodies: ['fujifilm_x_t5'],
        apertureSpec: {
            min: 'f/2.8',
            max: 'f/22',
            stops: getApertureRange('f/2.8', 'f/22'),
            defaultValue: 'f/5.6'
        }
    },

    // ===== 초광각 렌즈 (3종) =====

    {
        id: 'nikon_z_14_24mm_f28',
        brand: 'Nikon',
        model: 'NIKKOR Z 14-24mm f/2.8 S',
        mount: 'Nikon Z',
        focalLength: '14-24mm',
        maxAperture: 'f/2.8',
        category: 'ultra_wide',
        characteristics: '초광각 줌, 별사진 최적, S-Line 품질',
        promptKeywords: '14-24mm ultra wide zoom, f/2.8 aperture, landscape photography, astrophotography',
        compatibleBodies: ['nikon_z9', 'nikon_z8', 'nikon_z6_iii'],
        apertureSpec: {
            min: 'f/2.8',
            max: 'f/22',
            stops: getApertureRange('f/2.8', 'f/22'),
            defaultValue: 'f/5.6'
        }
    },
    {
        id: 'canon_rf_15_35mm_f28',
        brand: 'Canon',
        model: 'RF 15-35mm f/2.8L IS USM',
        mount: 'Canon RF',
        focalLength: '15-35mm',
        maxAperture: 'f/2.8',
        category: 'ultra_wide',
        characteristics: '초광각 줌, 5스탑 IS, 풍경/건축 최적',
        promptKeywords: '15-35mm ultra wide zoom, f/2.8 aperture, landscape architecture, image stabilization',
        compatibleBodies: ['canon_eos_r5', 'canon_eos_r5_mark_ii', 'canon_eos_r6_mark_ii', 'canon_eos_r3'],
        apertureSpec: {
            min: 'f/2.8',
            max: 'f/22',
            stops: getApertureRange('f/2.8', 'f/22'),
            defaultValue: 'f/5.6'
        }
    },
    {
        id: 'sony_gm_12_24mm_f28',
        brand: 'Sony',
        model: 'FE 12-24mm f/2.8 GM',
        mount: 'Sony E',
        focalLength: '12-24mm',
        maxAperture: 'f/2.8',
        category: 'ultra_wide',
        characteristics: '극초광각 줌, f/2.8 밝기 유지, G Master 품질',
        promptKeywords: '12-24mm extreme ultra wide, f/2.8 aperture, G Master optics, landscape astrophotography',
        compatibleBodies: ['sony_a7r_v', 'sony_a1', 'sony_a9_iii', 'sony_a7_iv'],
        apertureSpec: {
            min: 'f/2.8',
            max: 'f/22',
            stops: getApertureRange('f/2.8', 'f/22'),
            defaultValue: 'f/5.6'
        }
    },

    // ===== 중형 포맷 렌즈 (3종) =====

    {
        id: 'hasselblad_xcd_90mm',
        brand: 'Hasselblad',
        model: 'XCD 90mm f/2.5 V',
        mount: 'Hasselblad X',
        focalLength: '90mm',
        maxAperture: 'f/2.5',
        category: 'medium_telephoto',
        characteristics: '미디엄 포맷 최적화, 극도의 선명함, 제품 사진용',
        promptKeywords: '90mm medium format lens, f/2.5 aperture, Hasselblad XCD mount, commercial photography quality',
        compatibleBodies: ['hasselblad_907x_cfv_100c'],
        apertureSpec: {
            min: 'f/2.5',
            max: 'f/22',
            stops: ['f/2.5', ...getApertureRange('f/2.8', 'f/22')],
            defaultValue: 'f/5.6'
        }
    },
    {
        id: 'fujifilm_gf_80mm_f17',
        brand: 'Fujifilm',
        model: 'GF 80mm f/1.7 R WR',
        mount: 'Fujifilm G',
        focalLength: '80mm',
        maxAperture: 'f/1.7',
        category: 'medium_telephoto',
        characteristics: '중형 포맷 최고 밝기, 63mm 환산, 인물 사진 최적',
        promptKeywords: '80mm f/1.7 lens, medium format, GFX mount, portrait king, ultra shallow bokeh',
        compatibleBodies: ['fujifilm_gfx100_ii'],
        apertureSpec: {
            min: 'f/1.7',
            max: 'f/16',
            stops: ['f/1.7', ...getApertureRange('f/1.8', 'f/16')],
            defaultValue: 'f/4'
        }
    },
    {
        id: 'hasselblad_hc_80mm',
        brand: 'Hasselblad',
        model: 'HC 80mm f/2.8',
        mount: 'Hasselblad V',
        focalLength: '80mm',
        maxAperture: 'f/2.8',
        category: 'medium_telephoto',
        characteristics: 'V시스템 호환, Carl Zeiss 설계, 중형 표준',
        promptKeywords: '80mm f/2.8 lens, Hasselblad V-system, Carl Zeiss design, medium format standard',
        compatibleBodies: ['hasselblad_500cm_film', 'hasselblad_907x_cfv_100c'],
        apertureSpec: {
            min: 'f/2.8',
            max: 'f/22',
            stops: getApertureRange('f/2.8', 'f/22'),
            defaultValue: 'f/5.6'
        }
    },

    // ===== 전설적인 올드렌즈 (7종) =====

    {
        id: 'canon_ef_85mm_f12_ii',
        brand: 'Canon',
        model: 'EF 85mm f/1.2L II USM (Classic)',
        mount: 'Canon EF',
        focalLength: '85mm',
        maxAperture: 'f/1.2',
        category: 'medium_telephoto',
        characteristics: '전설의 인물렌즈, 드림 보케, EF 마운트 올드렌즈',
        promptKeywords: '85mm f/1.2 lens, Canon EF mount classic, legendary portrait, dream bokeh, vintage L-series',
        compatibleBodies: ['canon_eos_r5', 'canon_eos_r5_mark_ii', 'canon_eos_r6_mark_ii'],
        apertureSpec: {
            min: 'f/1.2',
            max: 'f/16',
            stops: getApertureRange('f/1.2', 'f/16'),
            defaultValue: 'f/2.8'
        }
    },
    {
        id: 'canon_fd_55mm_f12',
        brand: 'Canon',
        model: 'FD 55mm f/1.2 S.S.C. (Vintage)',
        mount: 'Canon FD',
        focalLength: '55mm',
        maxAperture: 'f/1.2',
        category: 'standard',
        characteristics: '빈티지 캐논 전설, 소프트 렌더링, 따뜻한 색감, 70년대 클래식',
        promptKeywords: '55mm f/1.2 vintage lens, Canon FD mount, soft rendering, warm color, 1970s classic',
        compatibleBodies: [],
        apertureSpec: {
            min: 'f/1.2',
            max: 'f/16',
            stops: getApertureRange('f/1.2', 'f/16'),
            defaultValue: 'f/2'
        }
    },
    {
        id: 'leica_noctilux_50mm_f10',
        brand: 'Leica',
        model: 'Noctilux 50mm f/1.0 (Version 4)',
        mount: 'Leica M',
        focalLength: '50mm',
        maxAperture: 'f/1.0',
        category: 'standard',
        characteristics: '올드 녹틸럭스, 유니크한 렌더링, 빈티지 보케',
        promptKeywords: '50mm f/1.0 lens, vintage Leica Noctilux, unique rendering, classic bokeh, film era',
        compatibleBodies: ['leica_m11_p', 'leica_m3_film'],
        apertureSpec: {
            min: 'f/1.0',
            max: 'f/16',
            stops: ['f/1.0', ...getApertureRange('f/1.2', 'f/16')],
            defaultValue: 'f/2'
        }
    },
    {
        id: 'pentax_smc_105mm_f24',
        brand: 'Pentax',
        model: 'SMC Pentax 67 105mm f/2.4 (Film)',
        mount: 'Pentax 67',
        focalLength: '105mm',
        maxAperture: 'f/2.4',
        category: 'medium_telephoto',
        characteristics: '중형 필름 전설, 압도적 보케, 인물 사진 최애, 6x7 판형',
        promptKeywords: '105mm f/2.4 lens, Pentax 67 medium format, legendary bokeh, film portrait king',
        compatibleBodies: ['pentax_67_film'],
        apertureSpec: {
            min: 'f/2.4',
            max: 'f/22',
            stops: ['f/2.4', ...getApertureRange('f/2.5', 'f/22')],
            defaultValue: 'f/5.6'
        }
    },
    {
        id: 'carl_zeiss_planar_80mm',
        brand: 'Carl Zeiss',
        model: 'Planar C 80mm f/2.8 T* (Hasselblad)',
        mount: 'Hasselblad V',
        focalLength: '80mm',
        maxAperture: 'f/2.8',
        category: 'medium_telephoto',
        characteristics: 'Carl Zeiss 명품, T* 코팅, 핫셀블라드 V시스템, 클래식 중형',
        promptKeywords: '80mm f/2.8 lens, Carl Zeiss Planar, Hasselblad V-mount, T-star coating, medium format classic',
        compatibleBodies: ['hasselblad_500cm_film'],
        apertureSpec: {
            min: 'f/2.8',
            max: 'f/22',
            stops: getApertureRange('f/2.8', 'f/22'),
            defaultValue: 'f/5.6'
        }
    },
    {
        id: 'nikon_ai_50mm_f12',
        brand: 'Nikon',
        model: 'NIKKOR 50mm f/1.2 AI-S (Vintage)',
        mount: 'Nikon F',
        focalLength: '50mm',
        maxAperture: 'f/1.2',
        category: 'standard',
        characteristics: '니콘 F3 시대 명품, 수동 포커스 감성, 빈티지 렌더링',
        promptKeywords: '50mm f/1.2 vintage lens, Nikon F-mount, AI-S manual focus, vintage rendering, film era',
        compatibleBodies: ['nikon_f3_film'],
        apertureSpec: {
            min: 'f/1.2',
            max: 'f/16',
            stops: getApertureRange('f/1.2', 'f/16'),
            defaultValue: 'f/2'
        }
    },
    {
        id: 'minolta_md_50mm_f12',
        brand: 'Minolta',
        model: 'MD Rokkor 50mm f/1.2 (Vintage)',
        mount: 'Minolta MD',
        focalLength: '50mm',
        maxAperture: 'f/1.2',
        category: 'standard',
        characteristics: '미놀타 로코르 전설, 부드러운 보케, 따뜻한 톤',
        promptKeywords: '50mm f/1.2 vintage lens, Minolta MD mount, Rokkor optics, soft bokeh, warm tone',
        compatibleBodies: [],
        apertureSpec: {
            min: 'f/1.2',
            max: 'f/16',
            stops: getApertureRange('f/1.2', 'f/16'),
            defaultValue: 'f/2'
        }
    }
];

// 카테고리별 그룹핑
export const LENSES_BY_CATEGORY = LENSES.reduce((acc, lens) => {
    if (!acc[lens.category]) {
        acc[lens.category] = [];
    }
    acc[lens.category].push(lens);
    return acc;
}, {} as Record<Lens['category'], Lens[]>);

// 호환 가능한 렌즈 조회 (카메라 ID 기반 - deprecated)
export function getLensesByBodyId(bodyId: string): Lens[] {
    return LENSES.filter(lens => lens.compatibleBodies.includes(bodyId));
}

// 마운트 기반 렌즈 조회 (권장)
export function getLensesByMount(mount: Mount): Lens[] {
    return LENSES.filter(lens => lens.mount === mount);
}

// ID로 렌즈 조회
export function getLensById(id: string): Lens | undefined {
    return LENSES.find(lens => lens.id === id);
}

// 카테고리 라벨
export const LENS_CATEGORY_LABELS: Record<Lens['category'], string> = {
    ultra_wide: '초광각 (14-24mm)',
    wide: '광각 (24-35mm)',
    standard: '표준 (35-70mm)',
    medium_telephoto: '중망원 (70-135mm)',
    telephoto: '망원 (135mm+)',
    macro: '매크로'
};