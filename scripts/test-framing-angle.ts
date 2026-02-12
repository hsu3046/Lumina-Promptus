/**
 * Phase 1: Framing × Angle 조합 테스트
 * 24개 유효 조합의 프롬프트 출력을 검증
 * 
 * 실행: npx tsx scripts/test-framing-angle.ts
 */

// 테스트 대상 옵션
const FRAMINGS = [
    'close-up',
    'bust-shot',
    'waist-shot',
    'half-shot',
    'three-quarter-shot',
    'full-shot'
] as const;

const ANGLES = [
    'eye_level',
    'high_angle',
    'low_angle',
    'birds_eye',
    'worms_eye'
] as const;

// STUDIO_CONFLICT_RULES (인라인 - conflict-rules.ts에서 복사)
const STUDIO_ANGLE_RULES = [
    // 클로즈업에서 버즈아이/웜즈아이/하이앵글/로우앵글 불가
    {
        framing: ['close-up'],
        disabledAngles: ['birds_eye', 'worms_eye', 'high_angle', 'low_angle'],
    },
    // 버스트샷에서 버즈아이/웜즈아이 불가
    {
        framing: ['bust-shot'],
        disabledAngles: ['birds_eye', 'worms_eye'],
    },
];

// FRAMING 프롬프트 매핑
const FRAMING_PROMPTS: Record<string, string> = {
    'close-up': 'close-up portrait',
    'bust-shot': 'bust shot portrait',
    'waist-shot': 'waist shot portrait',
    'half-shot': 'medium shot portrait',
    'three-quarter-shot': 'knee shot portrait',
    'full-shot': 'full body shot',
};

// ANGLE 프롬프트 매핑
const ANGLE_PROMPTS: Record<string, string> = {
    'eye_level': 'eye level view',
    'high_angle': 'high angle shot',
    'low_angle': 'low angle shot',
    'birds_eye': 'bird\'s eye view, overhead shot',
    'worms_eye': 'worm\'s eye view, extreme low angle',
};

// 충돌 체크
function isDisabled(framing: string, angle: string): boolean {
    for (const rule of STUDIO_ANGLE_RULES) {
        if (rule.framing.includes(framing) && rule.disabledAngles.includes(angle)) {
            return true;
        }
    }
    return false;
}

// 프롬프트 생성
function generatePrompt(framing: string, angle: string): string {
    const framingPrompt = FRAMING_PROMPTS[framing] || framing;
    const anglePrompt = ANGLE_PROMPTS[angle] || angle;
    return `${framingPrompt}, ${anglePrompt}`;
}

// 테스트 실행
function runTest() {
    console.log('=== Phase 1: Framing × Angle 테스트 ===\n');

    let validCount = 0;
    let disabledCount = 0;
    const results: { framing: string; angle: string; prompt: string }[] = [];

    for (const framing of FRAMINGS) {
        console.log(`\n--- ${framing.toUpperCase()} ---`);
        for (const angle of ANGLES) {
            if (isDisabled(framing, angle)) {
                disabledCount++;
                console.log(`  ❌ ${angle} (disabled)`);
            } else {
                validCount++;
                const prompt = generatePrompt(framing, angle);
                results.push({ framing, angle, prompt });
                console.log(`  ✅ ${angle}`);
                console.log(`     → ${prompt}`);
            }
        }
    }

    console.log('\n\n=== 결과 요약 ===');
    console.log(`유효 조합: ${validCount}개`);
    console.log(`Disabled 조합: ${disabledCount}개`);
    console.log(`총 조합: ${validCount + disabledCount}개`);

    return results;
}

runTest();
