/**
 * Angle Dictionary
 * 구도별 앵글 강조 프롬프트
 */

import type { Dictionary } from './types';

export const ANGLE_DICT: Dictionary = {
    'eye_level': {
        id: 'eye_level',
        label: '아이레벨',
        prompts: {
            base: 'eye level view',
            // TIGHT (close-up, bust-shot)
            'close-up': 'capturing deep emotional connection, detailed facial features, intense eye contact',
            'bust-shot': 'capturing deep emotional connection, detailed facial features, intense eye contact',
            // MEDIUM (waist-shot, half-shot)
            'waist-shot': 'engaging conversational perspective, standard broadcast framing, approachable vibe',
            'half-shot': 'engaging conversational perspective, standard broadcast framing, approachable vibe',
            // WIDE (three-quarter-shot, full-shot)
            'three-quarter-shot': 'objective documentation style, showing full outfit details, neutral stance',
            'full-shot': 'objective documentation style, showing full outfit details, neutral stance',
        },
        detectionKeywords: ['eye level', 'straight on', 'neutral angle'],
    },
    'high_angle': {
        id: 'high_angle',
        label: '하이앵글',
        prompts: {
            base: 'high angle shot',
            'close-up': 'emphasizing innocence, large eyes, vulnerable look, soft jawline',
            'bust-shot': 'emphasizing innocence, large eyes, vulnerable look, soft jawline',
            'waist-shot': 'approachable and friendly vibe, slimming effect on body, casual selfie style',
            'half-shot': 'approachable and friendly vibe, slimming effect on body, casual selfie style',
            'three-quarter-shot': 'subject integrated with ground, diminished stature, wide context visible',
            'full-shot': 'subject integrated with ground, diminished stature, wide context visible',
        },
        detectionKeywords: ['high angle', 'looking down', 'from above'],
    },
    'low_angle': {
        id: 'low_angle',
        label: '로우앵글',
        prompts: {
            base: 'low angle shot',
            'close-up': 'emphasizing jawline, imposing gaze, strong character, dominant expression',
            'bust-shot': 'emphasizing jawline, imposing gaze, strong character, dominant expression',
            'waist-shot': 'conveying confidence and authority, slight superiority, heroic chest expansion',
            'half-shot': 'conveying confidence and authority, slight superiority, heroic chest expansion',
            'three-quarter-shot': 'heroic and powerful perspective, elongated leg line, majestic presence',
            'full-shot': 'heroic and powerful perspective, elongated leg line, majestic presence',
        },
        detectionKeywords: ['low angle', 'looking up', 'from below', 'heroic'],
    },
    'birds_eye': {
        id: 'birds_eye',
        label: '버즈아이',
        prompts: {
            base: 'bird\'s eye view, overhead shot',
            'close-up': 'focus on eyelashes and nose bridge, artistic flat-lay portrait',
            'bust-shot': 'focus on eyelashes and nose bridge, artistic flat-lay portrait',
            'waist-shot': 'dramatic overhead view, separating subject from background floor',
            'half-shot': 'dramatic overhead view, separating subject from background floor',
            'three-quarter-shot': 'geometric composition with shadow, architectural layout, flat-lay body',
            'full-shot': 'geometric composition with shadow, architectural layout, flat-lay body',
        },
        detectionKeywords: ['bird\'s eye', 'overhead', 'top down', 'aerial'],
    },
    'worms_eye': {
        id: 'worms_eye',
        label: '웜즈아이',
        prompts: {
            base: 'worm\'s eye view, extreme low angle',
            'close-up': 'distorted perspective, grotesque or dramatic tension, nostrils visible',
            'bust-shot': 'distorted perspective, grotesque or dramatic tension, nostrils visible',
            'waist-shot': 'distorted perspective, grotesque or dramatic tension, nostrils visible',
            'half-shot': 'distorted perspective, grotesque or dramatic tension, nostrils visible',
            'three-quarter-shot': 'extreme dynamic perspective, giant-like stature, sole of shoes visible',
            'full-shot': 'extreme dynamic perspective, giant-like stature, sole of shoes visible',
        },
        detectionKeywords: ['worm\'s eye', 'extreme low', 'ground level'],
    },
};
