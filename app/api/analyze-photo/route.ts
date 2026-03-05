// app/api/analyze-photo/route.ts
// 레퍼런스 사진 분석 API — Gemini 3.1 Flash + Structured Output
// 사진을 분석하여 스튜디오 모드 옵션(카메라/라이팅/구도/인물 등)을 JSON으로 반환

import { NextRequest, NextResponse } from 'next/server';

// ===== 분석 결과 JSON Schema =====
// 모든 필드 nullable — AI가 판단 불가 시 null 반환
const ANALYSIS_JSON_SCHEMA = {
    type: 'object',
    properties: {
        // === 카메라 ===
        lensCategory: {
            type: ['string', 'null'],
            enum: ['ultra_wide', 'wide', 'standard', 'medium_telephoto', 'telephoto', 'macro', null],
            description: 'Estimated lens focal length category based on field of view and perspective distortion',
        },
        aperture: {
            type: ['string', 'null'],
            description: 'Estimated aperture from depth of field. Values like "f/1.4", "f/2.8", "f/5.6", "f/8", "f/11"',
        },
        shutterSpeed: {
            type: ['string', 'null'],
            description: 'Estimated shutter speed from motion blur. Values like "1/200", "1/60", "1/1000". If no blur visible, return "1/200"',
        },
        iso: {
            type: ['integer', 'null'],
            description: 'Estimated ISO from noise/grain level. Common values: 100, 200, 400, 800, 1600, 3200, 6400',
        },
        aspectRatio: {
            type: ['string', 'null'],
            enum: ['3:2', '2:3', '4:3', '3:4', '16:9', '9:16', '5:4', '4:5', '1:1', null],
            description: 'Image aspect ratio',
        },

        // === 라이팅 ===
        lightingEnabled: {
            type: ['boolean', 'null'],
            description: 'Whether specific studio lighting setup is visible (true) or natural/ambient only (false)',
        },
        lightingPattern: {
            type: ['string', 'null'],
            enum: ['rembrandt', 'butterfly', 'loop', 'split', null],
            description: 'Shadow pattern on face: rembrandt (triangle shadow), butterfly (shadow under nose), loop (soft shadow), split (half face shadow)',
        },
        lightingKey: {
            type: ['string', 'null'],
            enum: ['high-key', 'mid-key', 'low-key', null],
            description: 'Overall brightness: high-key (bright/white), mid-key (balanced), low-key (dark/dramatic)',
        },
        lightingRatio: {
            type: ['string', 'null'],
            enum: ['2:1', '3:1', '4:1', '8:1', '16:1', null],
            description: 'Light-to-shadow ratio on face',
        },
        lightingQuality: {
            type: ['string', 'null'],
            enum: ['soft', 'hard', null],
            description: 'Soft (diffused, gradual shadows) or hard (sharp shadow edges)',
        },
        lightingColorTemp: {
            type: ['string', 'null'],
            enum: ['warm-golden', 'tungsten', 'daylight', 'cloudy', 'shade', 'cool-blue', null],
            description: 'Color temperature of the light',
        },
        lightingMood: {
            type: ['string', 'null'],
            enum: ['dramatic', 'natural', 'glamorous', 'mysterious', 'editorial', 'cinematic', null],
            description: 'Overall mood created by lighting',
        },
        lightingTimeBase: {
            type: ['string', 'null'],
            enum: ['none', 'golden-hour', 'blue-hour', 'midday-sun', 'overcast', 'window-light', null],
            description: 'Time-based natural light. Return "none" for studio lighting',
        },

        // === 아트디렉션 ===
        compositionRule: {
            type: ['string', 'null'],
            enum: ['rule_of_thirds', 'center', 'golden_ratio', 'symmetry', 'leading_lines', 'frame_within_frame', null],
            description: 'Composition rule used in the image',
        },
        cameraAngle: {
            type: ['string', 'null'],
            enum: ['eye_level', 'high_angle', 'low_angle', 'birds_eye', 'worms_eye', 'drone', null],
            description: 'Camera angle relative to subject',
        },
        shotType: {
            type: ['string', 'null'],
            enum: ['extreme-close-up', 'close-up', 'bust-shot', 'waist-shot', 'half-shot', 'three-quarter-shot', 'full-shot', 'long-shot', null],
            description: 'How much of the subject is visible in frame',
        },
        photoStyleId: {
            type: ['string', 'null'],
            enum: [
                'kodak-trix-400', 'kodak-portra-400', 'fuji-velvia-100', 'ilford-hp5-400', 'cinestill-800t',
                'style-lindbergh', 'style-leibovitz', 'style-avedon', 'style-eggleston', 'style-fan-ho',
                null,
            ],
            description: 'Closest matching photo style or film stock based on color grading, contrast, and mood',
        },

        // === 인물 (사람이 없으면 모두 null) ===
        gender: {
            type: ['string', 'null'],
            enum: ['male', 'female', 'androgynous', null],
            description: 'Apparent gender of the main subject. null if no person in photo',
        },
        ageGroup: {
            type: ['string', 'null'],
            enum: ['early-20s', 'late-20s', '30s', '40s-50s', '60s-70s', '80plus', null],
            description: 'Estimated age group',
        },
        skinTone: {
            type: ['string', 'null'],
            enum: ['fair', 'light', 'medium', 'tan', 'brown', 'dark', null],
            description: 'Skin tone',
        },
        hairColor: {
            type: ['string', 'null'],
            enum: ['black', 'brown', 'blonde', 'red', 'gray', 'white', null],
            description: 'Hair color',
        },
        hairStyle: {
            type: ['string', 'null'],
            enum: [
                'short-straight', 'medium-straight', 'long-straight',
                'short-wavy', 'medium-wavy', 'long-wavy',
                'ponytail', 'bun', 'braids', 'half-up', 'curly', 'bald', null,
            ],
            description: 'Hair style',
        },
        bodyType: {
            type: ['string', 'null'],
            enum: ['slim', 'average', 'athletic', 'muscular', 'curvy', null],
            description: 'Body type',
        },

        // === 포즈 ===
        bodyPose: {
            type: ['string', 'null'],
            enum: ['straight', 'contrapposto', 's-curve', 'three-quarter-turn', 'sitting', 'reclining', null],
            description: 'Body pose',
        },
        handPose: {
            type: ['string', 'null'],
            enum: ['natural-relaxed', 'editorial-hands', 'pocket-hands', 'crossed-arms', 'framing-face', 'hair-touch', null],
            description: 'Hand position',
        },
        expression: {
            type: ['string', 'null'],
            enum: [
                'natural-smile', 'bright-smile', 'subtle-smile', 'neutral',
                'serious', 'pensive', 'mysterious', 'intense', 'playful', 'sensual', null,
            ],
            description: 'Facial expression',
        },
        gazeDirection: {
            type: ['string', 'null'],
            enum: ['direct-eye-contact', 'off-camera', 'looking-up', 'looking-down', 'side-gaze', 'over-shoulder', 'eyes-closed', 'half-closed-eyes', null],
            description: 'Where the subject is looking',
        },

        // === 컬러그레이딩 ===
        grainLevel: {
            type: ['integer', 'null'],
            description: 'Film grain level 0-100. 0=no grain, 30=subtle, 60=noticeable, 100=heavy',
        },
        vignetting: {
            type: ['boolean', 'null'],
            description: 'Whether edge darkening (vignetting) is present',
        },

        // === 배경 ===
        studioBackgroundType: {
            type: ['string', 'null'],
            enum: [
                'seamless_white', 'seamless_black', 'seamless_gray',
                'seamless_red', 'seamless_beige',
                'seamless_blue', 'seamless_green',
                'textured',
                null,
            ],
            description: 'Studio background type. seamless_blue/green = chromakey screen. textured = textured backdrop. Return null if the background is outdoor, urban, or interior (not a studio backdrop).',
        },
    },
    required: [
        'lensCategory', 'aperture', 'shutterSpeed', 'iso', 'aspectRatio',
        'lightingEnabled', 'lightingPattern', 'lightingKey', 'lightingRatio',
        'lightingQuality', 'lightingColorTemp', 'lightingMood', 'lightingTimeBase',
        'compositionRule', 'cameraAngle', 'shotType', 'photoStyleId',
        'gender', 'ageGroup', 'skinTone', 'hairColor', 'hairStyle', 'bodyType',
        'bodyPose', 'handPose', 'expression', 'gazeDirection',
        'grainLevel', 'vignetting', 'studioBackgroundType',
    ],
};

// ===== 분석 프롬프트 =====
const ANALYSIS_PROMPT = `You are an expert photography analyst and portrait lighting specialist.

Analyze this reference photo and extract technical photography parameters.

RULES:
- Return null for ANY field you cannot confidently determine from the image.
- Camera body CANNOT be determined from a photo — do not guess.
- For lensCategory, estimate from field of view and perspective distortion.
- For aperture, estimate from depth of field (shallow DOF = wide aperture like f/1.4-f/2.8).
- For lighting, carefully analyze shadow patterns on the face.
- If there is NO person in the photo, return null for ALL subject-related fields (gender, ageGroup, skinTone, hairColor, hairStyle, bodyType, bodyPose, handPose, expression, gazeDirection).
- For photoStyleId, match the overall color grading and aesthetic to the closest film stock or photographer style.
- Be precise with your analysis. Only return values you're confident about.`;

// ===== API Route Handler =====
export async function POST(request: NextRequest) {
    try {
        const apiKey = request.headers.get('X-API-Key');
        if (!apiKey) {
            return NextResponse.json({ error: 'API Key가 필요합니다.' }, { status: 401 });
        }

        const body = await request.json();
        const { image } = body;

        if (!image) {
            return NextResponse.json({ error: '이미지가 필요합니다.' }, { status: 400 });
        }

        // base64 이미지 데이터 추출
        const base64Data = image.includes(',') ? image.split(',')[1] : image;
        const mimeType = image.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';

        // Gemini 3.1 Flash — generateContent with Structured Output
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`;

        const geminiResponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: ANALYSIS_PROMPT },
                        {
                            inlineData: {
                                mimeType,
                                data: base64Data,
                            },
                        },
                    ],
                }],
                generationConfig: {
                    responseMimeType: 'application/json',
                    responseJsonSchema: ANALYSIS_JSON_SCHEMA,
                    temperature: 0.1, // 낮은 temperature — 결정적 분석
                },
            }),
        });

        if (!geminiResponse.ok) {
            const errorData = await geminiResponse.text();
            console.error('Gemini API 에러:', errorData);
            return NextResponse.json(
                { error: `Gemini API 에러 (${geminiResponse.status})`, details: errorData },
                { status: geminiResponse.status },
            );
        }

        const result = await geminiResponse.json();

        // Gemini 응답에서 JSON 파싱
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
            return NextResponse.json({ error: '분석 결과를 가져올 수 없습니다.' }, { status: 500 });
        }

        const analysis = JSON.parse(text);
        return NextResponse.json({ analysis });

    } catch (error) {
        console.error('사진 분석 에러:', error);
        return NextResponse.json(
            { error: '사진 분석 중 오류가 발생했습니다.' },
            { status: 500 },
        );
    }
}
