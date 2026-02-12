/**
 * Hand Pose Dictionary
 * 구도별 컨텍스트 인식 프롬프트 생성
 * 
 * Note: Conflict 처리는 lib/rules/conflict-rules.ts에서 별도 관리
 */

import type { Dictionary } from './types';

export const HAND_POSE_DICT: Dictionary = {
    'natural-relaxed': {
        id: 'natural-relaxed',
        label: '자연스럽게',
        prompts: {
            base: 'arms relaxed',
            // WIDE & MID (full ~ waist)
            'full-shot': 'arms relaxed by sides',
            'three-quarter-shot': 'arms relaxed by sides',
            'half-shot': 'arms relaxed by sides',
            'waist-shot': 'arms relaxed by sides',
            // TIGHT (bust, close-up) - 손이 안 보이므로 생략
            'bust-shot': '',  // no hands visible
            'close-up': '',   // no hands visible
        },
        detectionKeywords: ['relaxed hands', 'arms relaxed', 'by sides'],
    },
    'editorial-hands': {
        id: 'editorial-hands',
        label: '에디토리얼 핸즈',
        prompts: {
            base: 'editorial hand pose',
            // WIDE & MID
            'full-shot': 'high-fashion hand gesture, artistic finger posing',
            'three-quarter-shot': 'high-fashion hand gesture, artistic finger posing',
            'half-shot': 'high-fashion hand gesture, artistic finger posing',
            'waist-shot': 'high-fashion hand gesture, artistic finger posing',
            // TIGHT
            'bust-shot': 'hands near face, editorial finger placement, elegant hand pose',
            'close-up': 'hands near face, editorial finger placement, elegant hand pose',
        },
        detectionKeywords: ['editorial', 'fashion pose', 'artistic finger', 'finger placement'],
    },
    'pocket-hands': {
        id: 'pocket-hands',
        label: '포켓 핸즈',
        prompts: {
            base: 'hands in pockets',
            // WIDE & MID
            'full-shot': 'hands in pockets, casual stance',
            'three-quarter-shot': 'hands in pockets, casual stance',
            'half-shot': 'hands in pockets, casual stance',
            'waist-shot': 'hands in pockets, casual stance',
            // TIGHT - Conflict (선택 불가, conflict-rules.ts에서 처리)
            // 'bust-shot': not available
            // 'close-up': not available
        },
        detectionKeywords: ['hands in pocket', 'pockets', 'casual stance'],
    },
    'crossed-arms': {
        id: 'crossed-arms',
        label: '팔짱',
        prompts: {
            base: 'arms crossed over chest',
            // WIDE & MID
            'full-shot': 'arms crossed over chest, confident pose',
            'three-quarter-shot': 'arms crossed over chest, confident pose',
            'half-shot': 'arms crossed over chest, confident pose',
            'waist-shot': 'arms crossed over chest, confident pose',
            // TIGHT (bust까지는 가능)
            'bust-shot': 'arms crossed, strong shoulder line',
            // 'close-up': Conflict - 선택 불가
        },
        detectionKeywords: ['crossed arms', 'arms folded', 'confident pose'],
    },
    'framing-face': {
        id: 'framing-face',
        label: '프레이밍',
        prompts: {
            base: 'hands framing the face',
            // WIDE & MID (full-shot에선 비추천이지만 사용 가능)
            'full-shot': 'hands framing the face',
            'three-quarter-shot': 'hands framing the face',
            'half-shot': 'hands framing the face',
            'waist-shot': 'hands framing the face',
            // TIGHT (이 포즈가 가장 효과적)
            'bust-shot': 'hands framing the face, fingers creating a frame around eyes, leading lines',
            'close-up': 'hands framing the face, fingers creating a frame around eyes, leading lines',
        },
        detectionKeywords: ['framing face', 'hands framing', 'frame around'],
    },
    'hair-touch': {
        id: 'hair-touch',
        label: '헤어 터치',
        prompts: {
            base: 'hand touching hair',
            // WIDE & MID
            'full-shot': 'hand running through hair',
            'three-quarter-shot': 'hand running through hair',
            'half-shot': 'hand running through hair',
            'waist-shot': 'hand running through hair',
            // TIGHT
            'bust-shot': 'hand touching hair near temple, fingers in hair',
            'close-up': 'hand touching hair near temple, fingers in hair',
        },
        detectionKeywords: ['touching hair', 'hair touch', 'running through hair', 'fingers in hair'],
    },
};
