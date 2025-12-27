'use client';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { StudioSubject } from '@/types';

interface PersonFormProps {
    index: number;
    subject: StudioSubject;
    onUpdate: (updates: Partial<StudioSubject>) => void;
}

export function PersonForm({ index, subject, onUpdate }: PersonFormProps) {
    return (
        <div className="space-y-4 p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
            {/* 인물 헤더 + Auto 버튼 */}
            <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-violet-400">인물 {index + 1}</div>
                <button
                    onClick={() => onUpdate({ autoMode: !subject.autoMode })}
                    className={`px-2 py-0.5 text-xs rounded transition-colors ${subject.autoMode
                            ? 'bg-green-600 text-white'
                            : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600'
                        }`}
                >
                    Auto
                </button>
            </div>

            {/* Row 1: 인종, 성별, 나이대 (항상 활성화) */}
            <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                    <Label className="text-xs">인종</Label>
                    <Select
                        value={subject.ethnicity}
                        onValueChange={(v) => onUpdate({ ethnicity: v as StudioSubject['ethnicity'] })}
                    >
                        <SelectTrigger className="bg-zinc-950 border-zinc-800 h-8 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            <SelectItem value="asian">아시아</SelectItem>
                            <SelectItem value="caucasian">백인</SelectItem>
                            <SelectItem value="black">흑인</SelectItem>
                            <SelectItem value="hispanic">히스패닉</SelectItem>
                            <SelectItem value="middle_eastern">중동</SelectItem>
                            <SelectItem value="mixed">혼혈</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">성별</Label>
                    <Select
                        value={subject.gender}
                        onValueChange={(v) => {
                            const defaultHairStyle = v === 'male' ? 'short' : 'long';
                            onUpdate({ gender: v as 'male' | 'female', hairStyle: defaultHairStyle as StudioSubject['hairStyle'] });
                        }}
                    >
                        <SelectTrigger className="bg-zinc-950 border-zinc-800 h-8 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            <SelectItem value="male">남성</SelectItem>
                            <SelectItem value="female">여성</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">나이대</Label>
                    <Select
                        value={subject.ageGroup}
                        onValueChange={(v) => onUpdate({ ageGroup: v as StudioSubject['ageGroup'] })}
                    >
                        <SelectTrigger className="bg-zinc-950 border-zinc-800 h-8 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            <SelectItem value="child">어린이</SelectItem>
                            <SelectItem value="teen">10대</SelectItem>
                            <SelectItem value="20s">20대</SelectItem>
                            <SelectItem value="30s">30대</SelectItem>
                            <SelectItem value="40s">40대</SelectItem>
                            <SelectItem value="50plus">50대+</SelectItem>
                            <SelectItem value="elderly">노인</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Row 2: 머리색, 머리스타일, 눈동자 색, 피부 질감 (Auto OFF일 때만) */}
            <div className={`grid grid-cols-4 gap-3 ${subject.autoMode ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="space-y-1">
                    <Label className="text-xs">머리색</Label>
                    <Select
                        value={subject.hairColor}
                        disabled={subject.autoMode}
                        onValueChange={(v) => onUpdate({ hairColor: v as StudioSubject['hairColor'] })}
                    >
                        <SelectTrigger className="bg-zinc-950 border-zinc-800 h-8 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            <SelectItem value="black">검정</SelectItem>
                            <SelectItem value="brown">갈색</SelectItem>
                            <SelectItem value="blonde">금발</SelectItem>
                            <SelectItem value="red">빨강</SelectItem>
                            <SelectItem value="gray">회색</SelectItem>
                            <SelectItem value="white">흰색</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">머리스타일</Label>
                    <Select
                        value={subject.hairStyle}
                        disabled={subject.autoMode}
                        onValueChange={(v) => onUpdate({ hairStyle: v as StudioSubject['hairStyle'] })}
                    >
                        <SelectTrigger className="bg-zinc-950 border-zinc-800 h-8 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            {subject.gender === 'male' ? (
                                <>
                                    <SelectItem value="short">짧은</SelectItem>
                                    <SelectItem value="medium">중간</SelectItem>
                                    <SelectItem value="wavy">웨이브</SelectItem>
                                    <SelectItem value="curly">곱슬</SelectItem>
                                    <SelectItem value="bald">대머리</SelectItem>
                                </>
                            ) : (
                                <>
                                    <SelectItem value="short">짧은</SelectItem>
                                    <SelectItem value="medium">중간</SelectItem>
                                    <SelectItem value="long">긴</SelectItem>
                                    <SelectItem value="wavy">웨이브</SelectItem>
                                    <SelectItem value="curly">곱슬</SelectItem>
                                    <SelectItem value="straight">스트레이트</SelectItem>
                                    <SelectItem value="ponytail">포니테일</SelectItem>
                                    <SelectItem value="bun">올림머리</SelectItem>
                                    <SelectItem value="braids">땋은머리</SelectItem>
                                </>
                            )}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">눈동자 색</Label>
                    <Select
                        value={subject.eyeColor}
                        disabled={subject.autoMode}
                        onValueChange={(v) => onUpdate({ eyeColor: v as StudioSubject['eyeColor'] })}
                    >
                        <SelectTrigger className="bg-zinc-950 border-zinc-800 h-8 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            <SelectItem value="brown">갈색</SelectItem>
                            <SelectItem value="blue">파랑</SelectItem>
                            <SelectItem value="green">초록</SelectItem>
                            <SelectItem value="hazel">헤이즐</SelectItem>
                            <SelectItem value="gray">회색</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">피부 질감</Label>
                    <Select
                        value={subject.skinTexture}
                        disabled={subject.autoMode}
                        onValueChange={(v) => onUpdate({ skinTexture: v as StudioSubject['skinTexture'] })}
                    >
                        <SelectTrigger className="bg-zinc-950 border-zinc-800 h-8 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            <SelectItem value="smooth">매끄러운</SelectItem>
                            <SelectItem value="natural">자연스러운</SelectItem>
                            <SelectItem value="freckled">주근깨</SelectItem>
                            <SelectItem value="weathered">거친</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Row 3: 기타 특징 (Auto OFF일 때만) */}
            <div className={`space-y-1 ${subject.autoMode ? 'opacity-50 pointer-events-none' : ''}`}>
                <Label className="text-xs">기타 특징</Label>
                <input
                    type="text"
                    placeholder="예: 안경, 귀걸이, 턱수염, 주근깨..."
                    value={subject.otherFeatures}
                    disabled={subject.autoMode}
                    onChange={(e) => onUpdate({ otherFeatures: e.target.value })}
                    className="w-full h-8 px-3 text-xs bg-zinc-950 border border-zinc-800 rounded-md"
                />
            </div>

            {/* Row 4: 패션 (Auto OFF일 때만) */}
            <div className={`space-y-1 ${subject.autoMode ? 'opacity-50 pointer-events-none' : ''}`}>
                <Label className="text-xs">패션</Label>
                <input
                    type="text"
                    placeholder="예: 하얀 셔츠와 검은 슬랙스, 미니멀한 스타일..."
                    value={subject.fashion}
                    disabled={subject.autoMode}
                    onChange={(e) => onUpdate({ fashion: e.target.value })}
                    className="w-full h-8 px-3 text-xs bg-zinc-950 border border-zinc-800 rounded-md"
                />
            </div>
        </div>
    );
}
