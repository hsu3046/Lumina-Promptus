/**
 * Pose Dictionary 테스트
 * 
 * 실행: npx tsx scripts/test-pose-dict.ts
 */

import { BODY_POSE_DICT, HAND_POSE_DICT, getPrompt } from '../lib/dictionary';

const FRAMINGS = ['close-up', 'bust-shot', 'waist-shot', 'half-shot', 'three-quarter-shot', 'full-shot'];

console.log('=== Body Pose Dictionary 테스트 ===\n');

for (const [poseId, pose] of Object.entries(BODY_POSE_DICT)) {
    console.log(`\n### ${pose.label} (${poseId}) ###`);

    for (const framing of FRAMINGS) {
        const prompt = getPrompt(BODY_POSE_DICT, poseId, { framing });
        const display = prompt || '(empty)';
        console.log(`  ${framing.padEnd(20)} → ${display.substring(0, 55)}...`);
    }
}

console.log('\n\n=== Hand Pose Dictionary 테스트 ===\n');

for (const [poseId, pose] of Object.entries(HAND_POSE_DICT)) {
    console.log(`\n### ${pose.label} (${poseId}) ###`);

    for (const framing of FRAMINGS) {
        const prompt = getPrompt(HAND_POSE_DICT, poseId, { framing });
        const display = prompt || '(empty - no hands visible)';
        console.log(`  ${framing.padEnd(20)} → ${display.substring(0, 55)}...`);
    }
}
