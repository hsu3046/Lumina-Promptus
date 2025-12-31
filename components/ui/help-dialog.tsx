'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { SparklesIcon, Camera01Icon, Location01Icon, Sun01Icon, ColorsIcon, HelpCircleIcon } from '@hugeicons/core-free-icons';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function HelpDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-zinc-400">
                    <HugeiconsIcon icon={HelpCircleIcon} size={16} />
                    도움말
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800 max-w-lg max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-amber-400">
                        <HugeiconsIcon icon={SparklesIcon} size={20} />
                        Lumina Promptus 사용법
                    </DialogTitle>
                    <DialogDescription>
                        AI 이미지 생성을 위한 전문적인 프롬프트를 쉽게 만들어보세요.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 text-sm text-zinc-300 mt-4">
                    {/* 모드 설명 */}
                    <section>
                        <h3 className="font-medium text-zinc-100 mb-2">📸 스튜디오 모드</h3>
                        <p className="text-zinc-400 text-xs">
                            인물 사진, 제품 촬영 등 스튜디오 환경에 최적화된 프롬프트를 생성합니다.
                        </p>
                        <ul className="mt-2 space-y-1 text-xs text-zinc-400">
                            <li className="flex items-center gap-2">
                                <HugeiconsIcon icon={ColorsIcon} size={12} className="text-amber-500" />
                                <span><strong>피사체 설정:</strong> 인원수, 외모, 의상, 포즈 설정</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <HugeiconsIcon icon={Sun01Icon} size={12} className="text-amber-500" />
                                <span><strong>라이팅 설정:</strong> 조명 패턴, 품질, 색온도 설정</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <HugeiconsIcon icon={Camera01Icon} size={12} className="text-amber-500" />
                                <span><strong>카메라 설정:</strong> 카메라 바디, 렌즈, 노출 설정</span>
                            </li>
                        </ul>
                    </section>

                    <hr className="border-zinc-800" />

                    {/* 풍경 모드 */}
                    <section>
                        <h3 className="font-medium text-zinc-100 mb-2">🏞️ 풍경 모드</h3>
                        <p className="text-zinc-400 text-xs">
                            실제 장소 기반의 풍경/건축 사진 프롬프트를 생성합니다.
                        </p>
                        <ul className="mt-2 space-y-1 text-xs text-zinc-400">
                            <li className="flex items-center gap-2">
                                <HugeiconsIcon icon={Location01Icon} size={12} className="text-amber-500" />
                                <span><strong>장소 검색:</strong> Google Places로 실제 장소 검색</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <HugeiconsIcon icon={Sun01Icon} size={12} className="text-amber-500" />
                                <span><strong>환경 설정:</strong> 날씨, 계절, 시간대, 분위기 설정</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <HugeiconsIcon icon={Camera01Icon} size={12} className="text-amber-500" />
                                <span><strong>카메라 설정:</strong> 촬영 거리, 고도 설정</span>
                            </li>
                        </ul>
                    </section>

                    <hr className="border-zinc-800" />

                    {/* 사용 팁 */}
                    <section>
                        <h3 className="font-medium text-zinc-100 mb-2">💡 사용 팁</h3>
                        <ul className="space-y-1 text-xs text-zinc-400">
                            <li>• 설정을 변경하면 하단의 프롬프트가 실시간으로 업데이트됩니다.</li>
                            <li>• 복사 버튼으로 프롬프트를 클립보드에 복사할 수 있습니다.</li>
                            <li>• 스튜디오 모드에서 🎲 버튼으로 랜덤 인물을 생성할 수 있습니다.</li>
                            <li>• 풍경 모드에서 장소를 검색하면 주변 랜드마크가 자동으로 표시됩니다.</li>
                        </ul>
                    </section>
                </div>
            </DialogContent>
        </Dialog>
    );
}
