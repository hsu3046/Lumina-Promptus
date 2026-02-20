'use client';

// components/settings/ApiKeyDialog.tsx
// API Key 입력/관리 다이얼로그

import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Settings02Icon, Delete02Icon, SecurityLockIcon } from '@hugeicons/core-free-icons';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    useApiKeyStore,
    maskApiKey,
    PROVIDER_CONFIGS,
    type ImageProvider,
} from '@/store/useApiKeyStore';

export function ApiKeyDialog() {
    const {
        selectedProvider,
        apiKeys,
        setSelectedProvider,
        setApiKey,
        removeApiKey,
    } = useApiKeyStore();

    const [open, setOpen] = useState(false);
    const [tempKey, setTempKey] = useState('');
    const [editingProvider, setEditingProvider] = useState<ImageProvider | null>(null);

    const handleProviderChange = (provider: string) => {
        setSelectedProvider(provider as ImageProvider);
    };

    const handleSaveKey = () => {
        if (editingProvider && tempKey.trim()) {
            setApiKey(editingProvider, tempKey.trim());
            setTempKey('');
            setEditingProvider(null);
        }
    };

    const handleStartEdit = (provider: ImageProvider) => {
        setEditingProvider(provider);
        setTempKey('');
    };

    const handleCancelEdit = () => {
        setEditingProvider(null);
        setTempKey('');
    };

    const handleRemoveKey = (provider: ImageProvider) => {
        removeApiKey(provider);
        if (editingProvider === provider) {
            setEditingProvider(null);
            setTempKey('');
        }
    };

    const providers = Object.entries(PROVIDER_CONFIGS) as [ImageProvider, typeof PROVIDER_CONFIGS[ImageProvider]][];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 gap-1 text-white hover:bg-amber-600 text-xs px-2"
                >
                    <HugeiconsIcon icon={Settings02Icon} size={10} />
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-zinc-100">API Key 설정</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                    {/* Provider 선택 */}
                    <div className="space-y-2">
                        <Label className="text-zinc-400 text-xs">이미지 생성 엔진 — 사용할 엔진을 선택하세요</Label>
                        <RadioGroup
                            value={selectedProvider}
                            onValueChange={handleProviderChange}
                            className="space-y-2"
                        >
                            {providers.map(([id, config]) => {
                                const hasKey = !!apiKeys[id];
                                const isSelected = selectedProvider === id;
                                return (
                                    <div
                                        key={id}
                                        className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${isSelected
                                            ? 'border-amber-500/50 bg-amber-500/5'
                                            : 'border-zinc-800 hover:border-zinc-700'
                                            }`}
                                    >
                                        <RadioGroupItem value={id} id={`provider-${id}`} className="mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <Label
                                                htmlFor={`provider-${id}`}
                                                className="text-sm text-zinc-200 cursor-pointer font-medium flex items-center gap-2"
                                            >
                                                {config.label}
                                                {isSelected && (
                                                    <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full font-normal">
                                                        기본
                                                    </span>
                                                )}
                                                {hasKey && !isSelected && (
                                                    <span className="text-[10px] bg-zinc-700/50 text-zinc-500 px-1.5 py-0.5 rounded-full font-normal">
                                                        등록됨
                                                    </span>
                                                )}
                                            </Label>
                                            <p className="text-xs text-zinc-500 mt-0.5">
                                                {config.description}
                                            </p>
                                            <p className="text-xs text-amber-400/80 mt-0.5 font-mono">
                                                {config.pricing}
                                            </p>
                                            {/* Key 상태 */}
                                            <div className="mt-2">
                                                {editingProvider === id ? (
                                                    <div className="flex gap-2">
                                                        <Input
                                                            type="password"
                                                            value={tempKey}
                                                            onChange={(e) => setTempKey(e.target.value)}
                                                            placeholder="API Key 입력..."
                                                            className="h-7 text-xs bg-zinc-800 border-zinc-700 text-zinc-200"
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') handleSaveKey();
                                                                if (e.key === 'Escape') handleCancelEdit();
                                                            }}
                                                            autoFocus
                                                        />
                                                        <Button
                                                            size="sm"
                                                            onClick={handleSaveKey}
                                                            className="h-7 text-xs px-2 bg-amber-600 hover:bg-amber-700"
                                                            disabled={!tempKey.trim()}
                                                        >
                                                            저장
                                                        </Button>
                                                    </div>
                                                ) : hasKey ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-zinc-500 font-mono">
                                                            {maskApiKey(apiKeys[id]!)}
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleStartEdit(id)}
                                                            className="h-5 text-[10px] px-1.5 text-zinc-500 hover:text-zinc-300"
                                                        >
                                                            변경
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleRemoveKey(id)}
                                                            className="h-5 px-1 text-red-400/60 hover:text-red-400"
                                                        >
                                                            <HugeiconsIcon icon={Delete02Icon} size={10} />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleStartEdit(id)}
                                                        className="h-6 text-xs px-2 border-zinc-700 text-zinc-400 hover:text-zinc-200"
                                                    >
                                                        Key 등록
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </RadioGroup>
                    </div>

                    {/* 보안 안내 */}
                    <p className="text-[10px] text-zinc-600 flex items-center gap-1">
                        <HugeiconsIcon icon={SecurityLockIcon} size={12} />
                        API Key는 브라우저 로컬에만 저장됩니다. 서버로 전송되지 않습니다.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
