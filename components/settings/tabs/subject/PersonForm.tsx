'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { StudioSubject } from '@/types';

interface PersonFormProps {
    index: number;
    subject: StudioSubject;
    onUpdate: (updates: Partial<StudioSubject>) => void;
}

export function PersonForm({ index, subject, onUpdate }: PersonFormProps) {
    // autoMode: true = 상세 OFF (기본 필드만), false = 상세 ON (모든 필드)
    const showDetail = !subject.autoMode;

    return (
        <div className="space-y-3 py-3">
            {/* 인물 헤더 + 상세 Switch */}
            <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-amber-400">인물 {index + 1}</div>
                <div className="flex items-center gap-1">
                    <Switch
                        checked={showDetail}
                        onCheckedChange={(checked) => onUpdate({ autoMode: !checked })}
                    />
                    <span className="text-xs text-zinc-500">상세</span>
                </div>
            </div>

            {/* 기본 필드: 인종, 성별, 나이, 체형 (4개) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="space-y-1">
                    <Label className="text-[10px] text-zinc-500">인종</Label>
                    <Select
                        value={subject.ethnicity}
                        onValueChange={(v) => onUpdate({ ethnicity: v as StudioSubject['ethnicity'] })}
                    >
                        <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 h-8 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            <SelectItem value="korean">한국인</SelectItem>
                            <SelectItem value="asian">아시아</SelectItem>
                            <SelectItem value="caucasian">백인</SelectItem>
                            <SelectItem value="black">흑인</SelectItem>
                            <SelectItem value="hispanic">히스패닉</SelectItem>
                            <SelectItem value="middle_eastern">중동</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <Label className="text-[10px] text-zinc-500">성별</Label>
                    <Select
                        value={subject.gender}
                        onValueChange={(v) => {
                            const defaultHairStyle = v === 'male' ? 'short' : 'long';
                            onUpdate({ gender: v as 'male' | 'female', hairStyle: defaultHairStyle as StudioSubject['hairStyle'] });
                        }}
                    >
                        <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 h-8 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            <SelectItem value="male">남성</SelectItem>
                            <SelectItem value="female">여성</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <Label className="text-[10px] text-zinc-500">나이</Label>
                    <Select
                        value={subject.ageGroup}
                        onValueChange={(v) => onUpdate({ ageGroup: v as StudioSubject['ageGroup'] })}
                    >
                        <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 h-8 text-xs">
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
                <div className="space-y-1">
                    <Label className="text-[10px] text-zinc-500">체형</Label>
                    <Select
                        value={subject.bodyType}
                        onValueChange={(v) => onUpdate({ bodyType: v as StudioSubject['bodyType'] })}
                    >
                        <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 h-8 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            <SelectItem value="slim">슬림</SelectItem>
                            <SelectItem value="average">보통</SelectItem>
                            <SelectItem value="athletic">건장</SelectItem>
                            <SelectItem value="curvy">글래머</SelectItem>
                            <SelectItem value="plus">플러스</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* 상세 필드: 상세 ON일 때만 표시 */}
            {showDetail && (
                <>
                    {/* 머리색, 헤어스타일, 눈동자색, 시선 (4개) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div className="space-y-1">
                            <Label className="text-[10px] text-zinc-500">머리색</Label>
                            <Select
                                value={subject.hairColor}
                                onValueChange={(v) => onUpdate({ hairColor: v as StudioSubject['hairColor'] })}
                            >
                                <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 h-8 text-xs">
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
                            <Label className="text-[10px] text-zinc-500">헤어스타일</Label>
                            <Select
                                value={subject.hairStyle}
                                onValueChange={(v) => onUpdate({ hairStyle: v as StudioSubject['hairStyle'] })}
                            >
                                <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 h-8 text-xs">
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
                            <Label className="text-[10px] text-zinc-500">포즈</Label>
                            <Select
                                value={subject.pose}
                                onValueChange={(v) => onUpdate({ pose: v as StudioSubject['pose'] })}
                            >
                                <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 h-8 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                    <SelectItem value="contrapposto">컨트라포스토</SelectItem>
                                    <SelectItem value="sitting">시크한 시팅</SelectItem>
                                    <SelectItem value="shoulder_lookback">숄더 룩백</SelectItem>
                                    <SelectItem value="hands_to_face">에디토리얼 핸즈</SelectItem>
                                    <SelectItem value="walking">다이내믹 워킹</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] text-zinc-500">시선</Label>
                            <Select
                                value={subject.gazeDirection}
                                onValueChange={(v) => onUpdate({ gazeDirection: v as StudioSubject['gazeDirection'] })}
                            >
                                <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 h-8 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                    <SelectItem value="camera">카메라</SelectItem>
                                    <SelectItem value="aside">옆</SelectItem>
                                    <SelectItem value="down">아래</SelectItem>
                                    <SelectItem value="up">위</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* 패션 */}
                    <div className="space-y-1">
                        <Label className="text-[10px] text-zinc-500">패션</Label>
                        <input
                            type="text"
                            placeholder="예: 하얀 셔츠와 검은 슬랙스..."
                            value={subject.fashion}
                            onChange={(e) => onUpdate({ fashion: e.target.value })}
                            className="w-full h-8 px-3 text-xs bg-zinc-950 border border-zinc-800 rounded-md"
                        />
                    </div>
                </>
            )}
        </div>
    );
}
