/**
 * Angle Dictionary 테스트
 * 
 * 실행: npx tsx scripts/test-angle-dict.ts
 */

import { ANGLE_DICT, getPrompt } from '../lib/dictionary';

const FRAMINGS = ['close-up', 'bust-shot', 'waist-shot', 'half-shot', 'three-quarter-shot', 'full-shot'];
const ANGLES = ['eye_level', 'high_angle', 'low_angle', 'birds_eye', 'worms_eye'];

console.log('=== Angle Dictionary 테스트 ===\n');

for (const angle of ANGLES) {
    console.log(`\n### ${ANGLE_DICT[angle].label} (${angle}) ###`);
    console.log(`base: ${ANGLE_DICT[angle].prompts.base}\n`);

    for (const framing of FRAMINGS) {
        const prompt = getPrompt(ANGLE_DICT, angle, { framing });
        console.log(`  ${framing.padEnd(20)} → ${prompt.substring(0, 60)}...`);
    }
}

console.log('\n\n=== 역변환 테스트 ===');
import { detectEntryFromPrompt } from '../lib/dictionary';

const testPrompts = [
    'heroic and powerful perspective, elongated leg line',
    'capturing deep emotional connection, detailed facial features',
    'bird\'s eye view with geometric composition',
];

for (const text of testPrompts) {
    const detected = detectEntryFromPrompt(ANGLE_DICT, text);
    console.log(`"${text.substring(0, 50)}..." → ${detected || 'not found'}`);
}
