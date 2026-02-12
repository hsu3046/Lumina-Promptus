/**
 * Body Pose Dictionary
 * 구도별 컨텍스트 인식 프롬프트 생성
 */

import type { Dictionary } from './types';

export const BODY_POSE_DICT: Dictionary = {
    'straight': {
        id: 'straight',
        label: '자연스럽게',
        prompts: {
            base: 'natural standing pose',
            // WIDE (full, knee, medium, waist)
            'full-shot': 'standing naturally, relaxed posture',
            'three-quarter-shot': 'standing naturally, relaxed posture',
            'half-shot': 'standing naturally, relaxed posture',
            'waist-shot': 'standing naturally, relaxed posture',
            // TIGHT (bust, close-up)
            'bust-shot': 'relaxed neck and shoulders, natural head position',
            'close-up': 'relaxed neck and shoulders, natural head position',
        },
        detectionKeywords: ['standing', 'natural pose', 'upright', 'relaxed posture'],
    },
    'contrapposto': {
        id: 'contrapposto',
        label: '컨트라포스토',
        prompts: {
            base: 'contrapposto pose',
            // WIDE
            'full-shot': 'contrapposto pose, weight shifted to one hip, asymmetric stance',
            'three-quarter-shot': 'contrapposto pose, weight shifted to one hip, asymmetric stance',
            'half-shot': 'contrapposto pose, weight shifted to one hip, asymmetric stance',
            'waist-shot': 'contrapposto pose, weight shifted to one hip, asymmetric stance',
            // TIGHT (상체 콘트라포스토)
            'bust-shot': 'asymmetric shoulder line, head tilted slightly opposite to shoulders, dynamic neck tension',
            'close-up': 'asymmetric shoulder line, head tilted slightly opposite to shoulders, dynamic neck tension',
        },
        detectionKeywords: ['contrapposto', 'weight shifted', 'asymmetric stance', 'asymmetric shoulder'],
    },
    's-curve': {
        id: 's-curve',
        label: 'S커브',
        prompts: {
            base: 'S-curve pose',
            // WIDE
            'full-shot': 'elegant S-curve body silhouette, hourglass figure',
            'three-quarter-shot': 'elegant S-curve body silhouette, hourglass figure',
            'half-shot': 'elegant S-curve body silhouette, hourglass figure',
            'waist-shot': 'elegant S-curve body silhouette, hourglass figure',
            // TIGHT (마이크로 S커브)
            'bust-shot': 'micro S-curve pose, head tilted to side, fluid neck line, slight shoulder twist',
            'close-up': 'micro S-curve pose, head tilted to side, fluid neck line, slight shoulder twist',
        },
        detectionKeywords: ['S-curve', 'hourglass', 'micro S-curve', 'shoulder twist'],
    },
    'three-quarter-turn': {
        id: 'three-quarter-turn',
        label: '3/4 턴',
        prompts: {
            base: 'three-quarter turn',
            // WIDE
            'full-shot': 'body turned 45 degrees, three-quarter stance',
            'three-quarter-shot': 'body turned 45 degrees, three-quarter stance',
            'half-shot': 'body turned 45 degrees, three-quarter stance',
            'waist-shot': 'body turned 45 degrees, three-quarter stance',
            // TIGHT (얼굴 각도 중심)
            'bust-shot': 'three-quarter view of the face, showing one ear, jawline emphasized',
            'close-up': 'three-quarter view of the face, showing one ear, jawline emphasized',
        },
        detectionKeywords: ['three-quarter', 'turned 45 degrees', 'jawline emphasized'],
    },
    'sitting': {
        id: 'sitting',
        label: '시팅',
        prompts: {
            base: 'sitting pose',
            // WIDE
            'full-shot': 'sitting on a chair, seated pose',
            'three-quarter-shot': 'sitting on a chair, seated pose',
            'half-shot': 'sitting on a chair, seated pose',
            'waist-shot': 'sitting on a chair, seated pose',
            // TIGHT (앉은 느낌의 상체 묘사)
            'bust-shot': 'relaxed seated posture, upper body only, leaning slightly forward',
            'close-up': 'relaxed seated posture, upper body only, leaning slightly forward',
        },
        detectionKeywords: ['sitting', 'seated', 'on a chair', 'seated posture'],
    },
    'reclining': {
        id: 'reclining',
        label: '리클라인',
        prompts: {
            base: 'reclining pose',
            // WIDE
            'full-shot': 'reclining pose, lying down, sprawling',
            'three-quarter-shot': 'reclining pose, lying down, sprawling',
            'half-shot': 'reclining pose, lying down, sprawling',
            'waist-shot': 'reclining pose, lying down, sprawling',
            // TIGHT (누운 상태의 얼굴 묘사)
            'bust-shot': 'head resting back, lying down perspective, hair spread out',
            'close-up': 'head resting back, lying down perspective, face focus, hair spread out',
        },
        detectionKeywords: ['reclining', 'lying down', 'sprawling', 'head resting'],
    },
};
