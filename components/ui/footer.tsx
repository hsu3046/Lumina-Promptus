'use client';

export function Footer() {
    return (
        <footer className="w-full py-4 border-t border-zinc-800 bg-zinc-900/50">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex flex-col items-center gap-1 text-center">
                    <p className="text-[11px] text-zinc-500">
                        © 2025 Lumina Promptus. 프로페셔널 AI 사진 시뮬레이터
                    </p>
                    <p className="text-[10px] text-zinc-600">
                        본 서비스에서 생성된 프롬프트를 활용하여 제작된 결과물의 저작권 귀속 및 활용에 따른 모든 법적 책임은 사용자 본인에게 있습니다
                    </p>
                </div>
            </div>
        </footer>
    );
}
