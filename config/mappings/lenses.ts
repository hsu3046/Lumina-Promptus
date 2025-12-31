// config/mappings/lenses.ts
// 렌즈 데이터 매핑
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
    // ===== NIKON F MOUNT (6종) =====
    {
        id: 'nikon_af_14mm_f28d_ed',
        brand: 'Nikon',
        model: 'AF 14mm f/2.8D ED',
        mount: 'Nikon F',
        focalLength: '14mm',
        maxAperture: 'f/2.8',
        category: 'ultra_wide',
        bokeh: 'Cat\'s eye highlights near edges, onion ring artifacts',
        vignetting: 'Heavy corner darkening',
        characteristic: 'a look with mustache distortion and vivid, high-contrast Nikon D-series color',
        apertureSpec: { min: 'f/2.8', max: 'f/22', stops: getApertureRange('f/2.8', 'f/22'), defaultValue: 'f/8' }
    },
    {
        id: 'nikon_af_s_24mm_f14g_ed',
        brand: 'Nikon',
        model: 'AF-S 24mm f/1.4G ED',
        mount: 'Nikon F',
        focalLength: '24mm',
        maxAperture: 'f/1.4',
        category: 'wide',
        bokeh: 'Creamy smooth bokeh, excellent subject isolation',
        vignetting: 'Noticeable corner shading',
        characteristic: 'a sharp center with a 3D pop effect',
        apertureSpec: { min: 'f/1.4', max: 'f/16', stops: getApertureRange('f/1.4', 'f/16'), defaultValue: 'f/5.6' }
    },
    {
        id: 'nikon_af_s_35mm_f14g',
        brand: 'Nikon',
        model: 'AF-S 35mm f/1.4G',
        mount: 'Nikon F',
        focalLength: '35mm',
        maxAperture: 'f/1.4',
        category: 'standard',
        bokeh: 'Cine-like character with beautiful fall-off',
        vignetting: 'Visible atmospheric corner darkening',
        characteristic: 'that signature magic dust rendering',
        apertureSpec: { min: 'f/1.4', max: 'f/16', stops: getApertureRange('f/1.4', 'f/16'), defaultValue: 'f/4' }
    },
    {
        id: 'nikon_af_s_58mm_f14g',
        brand: 'Nikon',
        model: 'AF-S 58mm f/1.4G',
        mount: 'Nikon F',
        focalLength: '58mm',
        maxAperture: 'f/1.4',
        category: 'standard',
        bokeh: 'Extremely smooth buttery bokeh',
        vignetting: 'Enhanced depth and three-dimensional rendering',
        characteristic: 'a 3D Hi-Fi philosophy with an emphasis on depth and vibe',
        apertureSpec: { min: 'f/1.4', max: 'f/16', stops: getApertureRange('f/1.4', 'f/16'), defaultValue: 'f/2.8' }
    },
    {
        id: 'nikon_af_s_85mm_f14g',
        brand: 'Nikon',
        model: 'AF-S 85mm f/1.4G IF',
        mount: 'Nikon F',
        focalLength: '85mm',
        maxAperture: 'f/1.4',
        category: 'medium_telephoto',
        bokeh: 'Superior pleasing bokeh, gold standard isolation',
        vignetting: 'Natural subject-centering falloff',
        characteristic: 'a sharp look with aesthetic rendering',
        apertureSpec: { min: 'f/1.4', max: 'f/16', stops: getApertureRange('f/1.4', 'f/16'), defaultValue: 'f/2.8' }
    },
    {
        id: 'nikon_af_s_105mm_f14e_ed',
        brand: 'Nikon',
        model: 'AF-S NIKKOR 105mm f/1.4E ED',
        mount: 'Nikon F',
        focalLength: '105mm',
        maxAperture: 'f/1.4',
        category: 'medium_telephoto',
        bokeh: 'Exceptional 3D pop with three-dimensional fidelity',
        vignetting: 'Dimensional rendering with attention focus',
        characteristic: 'best-in-class telephoto performance and optical excellence',
        apertureSpec: { min: 'f/1.4', max: 'f/16', stops: getApertureRange('f/1.4', 'f/16'), defaultValue: 'f/2.8' }
    },

    // ===== LEICA M MOUNT (5종) =====
    {
        id: 'leica_elmarit_m_28mm_f28_asph',
        brand: 'Leica',
        model: 'Elmarit-M 28mm f/2.8 ASPH.',
        mount: 'Leica M',
        focalLength: '28mm',
        maxAperture: 'f/2.8',
        category: 'wide',
        bokeh: 'limited bokeh, subtle subject separation at close distances',
        vignetting: 'light natural corner shading, subtle peripheral falloff',
        characteristic: 'crisp clean Leica rendering with high micro-contrast',
        characteristic_studio: 'wide-angle editorial look, crisp clean studio rendering, high micro-contrast',
        characteristic_landscape: 'sharp expansive nature, deep focus vistas, high edge-to-edge detail',
        characteristic_architecture: 'compact wide architecture, minimal distortion, crisp stone textures',
        characteristic_product: 'lifestyle item wide view, sharp product context, clean modern rendering',
        characteristic_street: 'classic street snapshot view, high micro-contrast, decisive moment standard',
        apertureSpec: { min: 'f/2.8', max: 'f/22', stops: getApertureRange('f/2.8', 'f/22'), defaultValue: 'f/8' }
    },
    {
        id: 'leica_summicron_m_35mm_f2_asph',
        brand: 'Leica',
        model: 'Summicron-M 35mm f/2 ASPH.',
        mount: 'Leica M',
        focalLength: '35mm',
        maxAperture: 'f/2',
        category: 'standard',
        bokeh: 'smooth but restrained bokeh, clean specular highlights, natural blur',
        vignetting: 'subtle vignetting at f/2, natural eye focus',
        characteristic: 'crisp neutral Leica rendering with natural perspective',
        characteristic_studio: 'standard studio portrait, crisp facial details, neutral color rendering',
        characteristic_landscape: 'intimate landscape details, balanced natural tones, clean horizons',
        characteristic_architecture: 'unbiased architectural view, clean edges, faithful structural reproduction',
        characteristic_product: 'standard product perspective, high micro-contrast, sharp surface details',
        characteristic_street: 'classic Leica street perspective, natural human eye view, crisp edges',
        apertureSpec: { min: 'f/2', max: 'f/16', stops: getApertureRange('f/2', 'f/16'), defaultValue: 'f/5.6' }
    },
    {
        id: 'leica_summilux_m_35mm_f14_pre_asph_steel_rim',
        brand: 'Leica',
        model: 'Summilux-M 35mm f/1.4 Steel Rim',
        mount: 'Leica M',
        focalLength: '35mm',
        maxAperture: 'f/1.4',
        category: 'standard',
        bokeh: 'dreamy vintage bokeh, slightly swirly edges, soft highlight bloom',
        vignetting: 'noticeable vintage vignetting wide open, adds artistic frame emphasis',
        characteristic: 'vintage Leica glow with ethereal dreamy rendering',
        characteristic_studio: 'vintage editorial glow, lower contrast fashion look, ethereal rendering',
        characteristic_landscape: 'nostalgic morning mist, dreamy atmospheric rendering, soft light quality',
        characteristic_architecture: 'timeless urban character, historic building texture with soft edges',
        characteristic_product: 'luxury item glow, blooming specular highlights, vintage metallic sheen',
        characteristic_street: 'cinematic street documentary, Leica glow, vintage film-like softness',
        apertureSpec: { min: 'f/1.4', max: 'f/16', stops: getApertureRange('f/1.4', 'f/16'), defaultValue: 'f/2.8' }
    },
    {
        id: 'leica_noctilux_m_50mm_f095_asph',
        brand: 'Leica',
        model: 'Noctilux-M 50mm f/0.95 ASPH.',
        mount: 'Leica M',
        focalLength: '50mm',
        maxAperture: 'f/0.95',
        category: 'standard',
        bokeh: 'extreme creamy bokeh, large specular balls, cat-eye bokeh toward edges',
        vignetting: 'strong natural vignetting wide open, smoother when stopped down',
        characteristic: 'ultra-fast Noctilux look with extreme shallow DOF and luminous rendering',
        characteristic_studio: 'luminous studio portrait, razor-thin focus plane, cinematic depth layering',
        characteristic_landscape: 'surreal night landscape, luminous highlights in nature, extreme separation',
        characteristic_architecture: 'abstract light patterns, glowing architectural edges, luminous depth',
        characteristic_product: 'extreme shallow-focus product art, dreamy item isolation, ethereal glow',
        characteristic_street: 'ultra-fast noctilux look, heavy low-light atmosphere, cinematic night street',
        apertureSpec: { min: 'f/0.95', max: 'f/16', stops: ['f/0.95', 'f/1.4', 'f/2', 'f/2.8', 'f/4', 'f/5.6', 'f/8', 'f/11', 'f/16'], defaultValue: 'f/0.95' }
    },
    {
        id: 'leica_summilux_m_50mm_f14_asph',
        brand: 'Leica',
        model: 'Summilux-M 50mm f/1.4 ASPH.',
        mount: 'Leica M',
        focalLength: '50mm',
        maxAperture: 'f/1.4',
        category: 'standard',
        bokeh: 'smooth modern bokeh, clean blur transitions, minimal nervous bokeh',
        vignetting: 'subtle vignetting wide open, natural corner falloff',
        characteristic: 'reference Leica 50mm with high contrast and 3D pop',
        characteristic_studio: 'reference studio 50mm, high contrast, clean highlight rolloff, 3D pop',
        characteristic_landscape: 'modern landscape detail, balanced contrast, sharp nature textures',
        characteristic_architecture: 'precise structural rendering, high micro-contrast, clean lines',
        characteristic_product: 'premium product rendering, high-end commercial look, sharp details',
        characteristic_street: 'modern Leica street look, crisp micro-contrast, natural skin tones',
        apertureSpec: { min: 'f/1.4', max: 'f/16', stops: getApertureRange('f/1.4', 'f/16'), defaultValue: 'f/4' }
    },
    {
        id: 'canon_rf_50mm_f12',
        brand: 'Canon',
        model: 'RF 50mm f/1.2L USM',
        mount: 'Canon RF',
        focalLength: '50mm',
        maxAperture: 'f/1.2',
        category: 'standard',
        bokeh: '',
        vignetting: '',
        characteristic: '50mm f/1.2 lens, Canon RF mount, fastest 50mm, shallow depth of field, professional portrait',
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
        bokeh: '',
        vignetting: '',
        characteristic: '85mm lens, f/1.2 aperture, shallow depth of field, creamy bokeh, portrait lens',
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
        bokeh: '',
        vignetting: '',
        characteristic: '24mm wide angle lens, f/1.4 aperture, environmental portrait, architectural photography',
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
        bokeh: '',
        vignetting: '',
        characteristic: '50mm f/1.2 lens, G Master optics, Sony E-mount, shallow bokeh, professional standard prime',
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
        bokeh: '',
        vignetting: '',
        characteristic: '85mm lens, f/1.4 aperture, G Master optics, beautiful bokeh, portrait lens',
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
        bokeh: '',
        vignetting: '',
        characteristic: '135mm lens, f/1.8 aperture, telephoto compression, extreme subject separation, sports portrait',
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
        bokeh: '',
        vignetting: '',
        characteristic: '50mm f/1.2 lens, Nikon Z mount, S-Line optics, professional standard prime',
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
        bokeh: '',
        vignetting: '',
        characteristic: '85mm f/1.2 lens, Nikon Z mount, S-Line portrait, shallow bokeh',
        apertureSpec: {
            min: 'f/1.2',
            max: 'f/16',
            stops: getApertureRange('f/1.2', 'f/16'),
            defaultValue: 'f/2.8'
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
        bokeh: '',
        vignetting: '',
        characteristic: '56mm f/1.2 lens, Fujifilm X-mount, portrait lens, shallow bokeh, film simulation optimized',
        apertureSpec: {
            min: 'f/1.2',
            max: 'f/16',
            stops: getApertureRange('f/1.2', 'f/16'),
            defaultValue: 'f/2.8'
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
        bokeh: '',
        vignetting: '',
        characteristic: '90mm medium format lens, f/2.5 aperture, Hasselblad XCD mount, commercial photography quality',
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
        bokeh: '',
        vignetting: '',
        characteristic: '80mm f/1.7 lens, medium format, GFX mount, portrait king, ultra shallow bokeh',
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
        bokeh: '',
        vignetting: '',
        characteristic: '80mm f/2.8 lens, Hasselblad V-system, Carl Zeiss design, medium format standard',
        apertureSpec: {
            min: 'f/2.8',
            max: 'f/22',
            stops: getApertureRange('f/2.8', 'f/22'),
            defaultValue: 'f/5.6'
        }
    },

    // ===== CANON EF MOUNT (5종) =====
    {
        id: 'canon_ef_14mm_f28l_ii',
        brand: 'Canon',
        model: 'EF 14mm f/2.8L II USM',
        mount: 'Canon EF',
        focalLength: '14mm',
        maxAperture: 'f/2.8',
        category: 'ultra_wide',
        bokeh: '',
        vignetting: '',
        characteristic: 'ultra-wide rectilinear, L-series sharpness, architecture and landscape',
        apertureSpec: { min: 'f/2.8', max: 'f/22', stops: getApertureRange('f/2.8', 'f/22'), defaultValue: 'f/8' }
    },
    {
        id: 'canon_ef_35mm_f14l_ii',
        brand: 'Canon',
        model: 'EF 35mm f/1.4L II USM',
        mount: 'Canon EF',
        focalLength: '35mm',
        maxAperture: 'f/1.4',
        category: 'standard',
        bokeh: '',
        vignetting: '',
        characteristic: 'Blue Spectrum Refractive optics, sharp with smooth bokeh, versatile prime',
        apertureSpec: { min: 'f/1.4', max: 'f/22', stops: getApertureRange('f/1.4', 'f/22'), defaultValue: 'f/4' }
    },
    {
        id: 'canon_ef_50mm_f12l',
        brand: 'Canon',
        model: 'EF 50mm f/1.2L USM',
        mount: 'Canon EF',
        focalLength: '50mm',
        maxAperture: 'f/1.2',
        category: 'standard',
        bokeh: '',
        vignetting: '',
        characteristic: 'dreamy wide-open glow, classic L-series rendering, legendary portrait lens',
        apertureSpec: { min: 'f/1.2', max: 'f/16', stops: getApertureRange('f/1.2', 'f/16'), defaultValue: 'f/2.8' }
    },
    {
        id: 'canon_ef_85mm_f14l_is',
        brand: 'Canon',
        model: 'EF 85mm f/1.4L IS USM',
        mount: 'Canon EF',
        focalLength: '85mm',
        maxAperture: 'f/1.4',
        category: 'medium_telephoto',
        bokeh: '',
        vignetting: '',
        characteristic: 'image stabilized portrait, creamy bokeh, sharp and modern rendering',
        apertureSpec: { min: 'f/1.4', max: 'f/22', stops: getApertureRange('f/1.4', 'f/22'), defaultValue: 'f/2.8' }
    },
    {
        id: 'canon_ef_135mm_f2l',
        brand: 'Canon',
        model: 'EF 135mm f/2L USM',
        mount: 'Canon EF',
        focalLength: '135mm',
        maxAperture: 'f/2',
        category: 'telephoto',
        bokeh: '',
        vignetting: '',
        characteristic: 'legendary telephoto portrait, buttery bokeh, timeless L-series classic',
        apertureSpec: { min: 'f/2', max: 'f/22', stops: getApertureRange('f/2', 'f/22'), defaultValue: 'f/2.8' }
    },

    // ===== CANON RF MOUNT 추가 (3종) =====
    {
        id: 'canon_rf_35mm_f14l_vcm',
        brand: 'Canon',
        model: 'RF 35mm f/1.4L VCM',
        mount: 'Canon RF',
        focalLength: '35mm',
        maxAperture: 'f/1.4',
        category: 'standard',
        bokeh: '',
        vignetting: '',
        characteristic: 'hybrid video/photo prime, VCM motor, sharp with smooth bokeh',
        apertureSpec: { min: 'f/1.4', max: 'f/16', stops: getApertureRange('f/1.4', 'f/16'), defaultValue: 'f/4' }
    },
    {
        id: 'canon_rf_85mm_f14l_vcm',
        brand: 'Canon',
        model: 'RF 85mm f/1.4L VCM',
        mount: 'Canon RF',
        focalLength: '85mm',
        maxAperture: 'f/1.4',
        category: 'medium_telephoto',
        bokeh: '',
        vignetting: '',
        characteristic: 'hybrid portrait prime, VCM motor, cinematic bokeh, 11-blade diaphragm',
        apertureSpec: { min: 'f/1.4', max: 'f/16', stops: getApertureRange('f/1.4', 'f/16'), defaultValue: 'f/2.8' }
    },
    {
        id: 'canon_rf_135mm_f18l_is',
        brand: 'Canon',
        model: 'RF 135mm f/1.8L IS USM',
        mount: 'Canon RF',
        focalLength: '135mm',
        maxAperture: 'f/1.8',
        category: 'telephoto',
        bokeh: '',
        vignetting: '',
        characteristic: 'fast telephoto portrait, image stabilized, beautiful subject separation',
        apertureSpec: { min: 'f/1.8', max: 'f/22', stops: getApertureRange('f/1.8', 'f/22'), defaultValue: 'f/2.8' }
    },

    // ===== NIKON Z MOUNT 추가 (3종) =====
    {
        id: 'nikon_z_35mm_f12s',
        brand: 'Nikon',
        model: 'NIKKOR Z 35mm f/1.2 S',
        mount: 'Nikon Z',
        focalLength: '35mm',
        maxAperture: 'f/1.2',
        category: 'standard',
        bokeh: '',
        vignetting: '',
        characteristic: 'ultra-fast wide prime, S-Line optics, exceptional sharpness and bokeh',
        apertureSpec: { min: 'f/1.2', max: 'f/16', stops: getApertureRange('f/1.2', 'f/16'), defaultValue: 'f/4' }
    },
    {
        id: 'nikon_z_58mm_f095s_noct',
        brand: 'Nikon',
        model: 'NIKKOR Z 58mm f/0.95 S Noct',
        mount: 'Nikon Z',
        focalLength: '58mm',
        maxAperture: 'f/0.95',
        category: 'standard',
        bokeh: '',
        vignetting: '',
        characteristic: 'fastest NIKKOR ever, manual focus masterpiece, ultimate low-light rendering',
        apertureSpec: { min: 'f/0.95', max: 'f/16', stops: ['f/0.95', ...getApertureRange('f/1.2', 'f/16')], defaultValue: 'f/1.4' }
    },
    {
        id: 'nikon_z_135mm_f18s_plena',
        brand: 'Nikon',
        model: 'NIKKOR Z 135mm f/1.8 S Plena',
        mount: 'Nikon Z',
        focalLength: '135mm',
        maxAperture: 'f/1.8',
        category: 'telephoto',
        bokeh: '',
        vignetting: '',
        characteristic: 'perfect circular bokeh, no cat-eye effect, ultimate portrait telephoto',
        apertureSpec: { min: 'f/1.8', max: 'f/16', stops: getApertureRange('f/1.8', 'f/16'), defaultValue: 'f/2.8' }
    },

    // ===== CANON EF MOUNT 추가 =====
    {
        id: 'canon_ef_24mm_f14l_ii',
        brand: 'Canon',
        model: 'EF 24mm f/1.4L II USM',
        mount: 'Canon EF',
        focalLength: '24mm',
        maxAperture: 'f/1.4',
        category: 'wide',
        bokeh: '',
        vignetting: '',
        characteristic: 'ultra-wide fast prime, environmental portrait, astro and landscape',
        apertureSpec: { min: 'f/1.4', max: 'f/22', stops: getApertureRange('f/1.4', 'f/22'), defaultValue: 'f/5.6' }
    },

    // ===== PENTAX 67 MOUNT (3종) =====
    {
        id: 'pentax_67_105mm_f24',
        brand: 'Pentax',
        model: 'SMC Pentax 67 105mm f/2.4',
        mount: 'Pentax 67',
        focalLength: '105mm',
        maxAperture: 'f/2.4',
        category: 'standard',
        bokeh: '',
        vignetting: '',
        characteristic: 'legendary medium format standard, 3D rendering, film portrait king',
        apertureSpec: { min: 'f/2.4', max: 'f/22', stops: ['f/2.4', ...getApertureRange('f/2.5', 'f/22')], defaultValue: 'f/5.6' }
    },
    {
        id: 'pentax_67_55mm_f4',
        brand: 'Pentax',
        model: 'SMC Pentax 67 55mm f/4',
        mount: 'Pentax 67',
        focalLength: '55mm',
        maxAperture: 'f/4',
        category: 'wide',
        bokeh: '',
        vignetting: '',
        characteristic: 'medium format wide angle, extreme sharpness, landscape and architecture',
        apertureSpec: { min: 'f/4', max: 'f/22', stops: getApertureRange('f/4', 'f/22'), defaultValue: 'f/8' }
    },
    {
        id: 'pentax_67_165mm_f28',
        brand: 'Pentax',
        model: 'SMC Pentax 67 165mm f/2.8',
        mount: 'Pentax 67',
        focalLength: '165mm',
        maxAperture: 'f/2.8',
        category: 'medium_telephoto',
        bokeh: '',
        vignetting: '',
        characteristic: 'medium format portrait telephoto, creamy bokeh, subject compression',
        apertureSpec: { min: 'f/2.8', max: 'f/22', stops: getApertureRange('f/2.8', 'f/22'), defaultValue: 'f/5.6' }
    },

    // ===== HASSELBLAD V MOUNT 추가 (2종) =====
    {
        id: 'zeiss_planar_80mm_f28_cf',
        brand: 'Carl Zeiss',
        model: 'Planar CF 80mm f/2.8 T*',
        mount: 'Hasselblad V',
        focalLength: '80mm',
        maxAperture: 'f/2.8',
        category: 'standard',
        bokeh: '',
        vignetting: '',
        characteristic: 'legendary medium format standard, NASA heritage, uniform corner-to-corner sharpness',
        apertureSpec: { min: 'f/2.8', max: 'f/22', stops: getApertureRange('f/2.8', 'f/22'), defaultValue: 'f/5.6' }
    },
    {
        id: 'zeiss_sonnar_150mm_f4_cf',
        brand: 'Carl Zeiss',
        model: 'Sonnar CF 150mm f/4 T*',
        mount: 'Hasselblad V',
        focalLength: '150mm',
        maxAperture: 'f/4',
        category: 'medium_telephoto',
        bokeh: '',
        vignetting: '',
        characteristic: 'classic medium format portrait, sharp wide open, flattering compression',
        apertureSpec: { min: 'f/4', max: 'f/22', stops: getApertureRange('f/4', 'f/22'), defaultValue: 'f/5.6' }
    },

    // ===== HASSELBLAD X MOUNT 추가 (2종) =====
    {
        id: 'hasselblad_xcd_55mm_f25v',
        brand: 'Hasselblad',
        model: 'XCD 55mm f/2.5 V',
        mount: 'Hasselblad X',
        focalLength: '55mm',
        maxAperture: 'f/2.5',
        category: 'standard',
        bokeh: '',
        vignetting: '',
        characteristic: 'compact medium format standard, leaf shutter, studio versatile',
        apertureSpec: { min: 'f/2.5', max: 'f/22', stops: ['f/2.5', ...getApertureRange('f/2.8', 'f/22')], defaultValue: 'f/5.6' }
    },
    {
        id: 'hasselblad_xcd_38mm_f25v',
        brand: 'Hasselblad',
        model: 'XCD 38mm f/2.5 V',
        mount: 'Hasselblad X',
        focalLength: '38mm',
        maxAperture: 'f/2.5',
        category: 'wide',
        bokeh: '',
        vignetting: '',
        characteristic: 'wide angle medium format, architecture and landscape, minimal distortion',
        apertureSpec: { min: 'f/2.5', max: 'f/22', stops: ['f/2.5', ...getApertureRange('f/2.8', 'f/22')], defaultValue: 'f/8' }
    },

    // ===== FUJIFILM X MOUNT 추가 (2종) =====
    {
        id: 'fujifilm_xf_23mm_f2_wr',
        brand: 'Fujifilm',
        model: 'XF 23mm f/2 R WR',
        mount: 'Fujifilm X',
        focalLength: '23mm',
        maxAperture: 'f/2',
        category: 'wide',
        bokeh: '',
        vignetting: '',
        characteristic: 'compact street prime, weather sealed, 35mm equivalent classic',
        apertureSpec: { min: 'f/2', max: 'f/16', stops: getApertureRange('f/2', 'f/16'), defaultValue: 'f/5.6' }
    },
    {
        id: 'fujifilm_xf_35mm_f14_r',
        brand: 'Fujifilm',
        model: 'XF 35mm f/1.4 R',
        mount: 'Fujifilm X',
        focalLength: '35mm',
        maxAperture: 'f/1.4',
        category: 'standard',
        bokeh: '',
        vignetting: '',
        characteristic: 'classic Fuji rendering, character-rich bokeh, beloved standard prime',
        apertureSpec: { min: 'f/1.4', max: 'f/16', stops: getApertureRange('f/1.4', 'f/16'), defaultValue: 'f/4' }
    },

    // ===== FUJIFILM G MOUNT 추가 (2종) =====
    {
        id: 'fujifilm_gf_110mm_f2',
        brand: 'Fujifilm',
        model: 'GF 110mm f/2 R LM WR',
        mount: 'Fujifilm G',
        focalLength: '110mm',
        maxAperture: 'f/2',
        category: 'medium_telephoto',
        bokeh: '',
        vignetting: '',
        characteristic: 'medium format portrait king, 87mm equivalent, beautiful bokeh',
        apertureSpec: { min: 'f/2', max: 'f/22', stops: getApertureRange('f/2', 'f/22'), defaultValue: 'f/4' }
    },
    {
        id: 'fujifilm_gf_55mm_f17',
        brand: 'Fujifilm',
        model: 'GF 55mm f/1.7 R WR',
        mount: 'Fujifilm G',
        focalLength: '55mm',
        maxAperture: 'f/1.7',
        category: 'standard',
        bokeh: '',
        vignetting: '',
        characteristic: 'fast medium format standard, 43mm equivalent, versatile prime',
        apertureSpec: { min: 'f/1.7', max: 'f/16', stops: ['f/1.7', ...getApertureRange('f/1.8', 'f/16')], defaultValue: 'f/4' }
    },

    // ===== SONY E MOUNT 추가 (3종) =====
    {
        id: 'sony_gm_14mm_f18',
        brand: 'Sony',
        model: 'FE 14mm f/1.8 GM',
        mount: 'Sony E',
        focalLength: '14mm',
        maxAperture: 'f/1.8',
        category: 'ultra_wide',
        bokeh: '',
        vignetting: '',
        characteristic: 'ultra-wide fast prime, astrophotography, landscape, compact design',
        apertureSpec: { min: 'f/1.8', max: 'f/16', stops: getApertureRange('f/1.8', 'f/16'), defaultValue: 'f/5.6' }
    },
    {
        id: 'sony_gm_24mm_f14',
        brand: 'Sony',
        model: 'FE 24mm f/1.4 GM',
        mount: 'Sony E',
        focalLength: '24mm',
        maxAperture: 'f/1.4',
        category: 'wide',
        bokeh: '',
        vignetting: '',
        characteristic: 'fast wide prime, environmental portrait, vlog and astro',
        apertureSpec: { min: 'f/1.4', max: 'f/16', stops: getApertureRange('f/1.4', 'f/16'), defaultValue: 'f/4' }
    },
    {
        id: 'sony_gm_35mm_f14',
        brand: 'Sony',
        model: 'FE 35mm f/1.4 GM',
        mount: 'Sony E',
        focalLength: '35mm',
        maxAperture: 'f/1.4',
        category: 'standard',
        bokeh: '',
        vignetting: '',
        characteristic: 'versatile fast prime, street and portrait, 11-blade circular aperture',
        apertureSpec: { min: 'f/1.4', max: 'f/16', stops: getApertureRange('f/1.4', 'f/16'), defaultValue: 'f/4' }
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

// 마운트 기반 렌즈 조회
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