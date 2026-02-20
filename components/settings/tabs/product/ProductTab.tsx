'use client';

// components/settings/tabs/product/ProductTab.tsx
// 제품 촬영 모드 설정 탭

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ShoppingBag02Icon, PaintBrushIcon, Sun03Icon, Camera01Icon, Image01Icon } from '@hugeicons/core-free-icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SectionHeader } from '@/components/ui/section-header';
import { ComboboxField } from '@/components/ui/combobox-field';
import { CameraTab } from '@/components/settings/tabs/camera/CameraTab';
import { LightingTab } from '@/components/settings/tabs/lighting/LightingTab';
import { ReferenceImageUpload } from '@/components/settings/ReferenceImageUpload';
import { useSettingsStore } from '@/store/useSettingsStore';
import {
    PRODUCT_CATEGORIES,
    PRODUCT_MATERIALS,
    PRODUCT_SURFACES,
    PRODUCT_SHOT_TYPES,
} from '@/config/mappings/product-options';

export function ProductTab() {
    const product = useSettingsStore(state => state.settings.product);
    const updateProduct = useSettingsStore(state => state.updateProduct);

    return (
        <Tabs defaultValue="product" className="w-full">
            <TabsList className="w-full border-b border-zinc-800 p-0 h-auto">
                <TabsTrigger value="product" className="lp-tab-trigger">
                    <HugeiconsIcon icon={ShoppingBag02Icon} size={16} />
                    제품 설정
                </TabsTrigger>
                <TabsTrigger value="lighting" className="lp-tab-trigger">
                    <HugeiconsIcon icon={Sun03Icon} size={16} />
                    라이팅
                </TabsTrigger>
                <TabsTrigger value="camera" className="lp-tab-trigger">
                    <HugeiconsIcon icon={Camera01Icon} size={16} />
                    카메라 설정
                </TabsTrigger>
            </TabsList>

            {/* 제품 설정 탭 */}
            <TabsContent value="product" className="mt-6 space-y-6">
                {/* 레퍼런스 이미지 */}
                <section className="space-y-3">
                    <SectionHeader icon={Image01Icon} title="레퍼런스 이미지" />
                    <ReferenceImageUpload
                        image={product.referenceImage}
                        onUpload={(img) => updateProduct({ referenceImage: img })}
                        onRemove={() => updateProduct({ referenceImage: undefined })}
                    />
                </section>

                <hr className="lp-divider" />

                {/* 제품 정보 */}
                <section className="space-y-4">
                    <SectionHeader icon={ShoppingBag02Icon} title="제품 정보" />

                    <div className="grid grid-cols-2 gap-4">
                        {/* 카테고리 */}
                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-400">카테고리</Label>
                            <ComboboxField
                                label=""
                                options={PRODUCT_CATEGORIES.map(c => ({ value: c.value, label: c.label }))}
                                value={product.category}
                                onSelect={(v) => updateProduct({ category: v as typeof product.category })}
                            />
                        </div>

                        {/* 재질 */}
                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-400">재질</Label>
                            <ComboboxField
                                label=""
                                options={PRODUCT_MATERIALS.map(m => ({ value: m.value, label: m.label }))}
                                value={product.material}
                                onSelect={(v) => updateProduct({ material: v as typeof product.material })}
                            />
                        </div>
                    </div>

                    {/* 카테고리가 custom일 때 직접 입력 */}
                    {product.category === 'custom' && (
                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-400">카테고리 직접 입력</Label>
                            <Input
                                value={product.customCategory}
                                onChange={(e) => updateProduct({ customCategory: e.target.value })}
                                placeholder="예: 의료기기, 스포츠 용품..."
                                className="bg-zinc-900 border-zinc-700 text-sm"
                            />
                        </div>
                    )}

                    {/* 제품명 */}
                    <div className="space-y-2">
                        <Label className="text-xs text-zinc-400">제품명 (영어 권장)</Label>
                        <Input
                            value={product.productName}
                            onChange={(e) => updateProduct({ productName: e.target.value })}
                            placeholder="예: luxury perfume bottle, wireless earbuds..."
                            className="bg-zinc-900 border-zinc-700 text-sm"
                        />
                    </div>
                </section>

                <hr className="lp-divider" />

                {/* 배경 및 소품 */}
                <section className="space-y-4">
                    <SectionHeader icon={PaintBrushIcon} title="배경 및 소품" />

                    <div className="grid grid-cols-2 gap-4">
                        {/* 서페이스/백드롭 */}
                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-400">서페이스/배경</Label>
                            <ComboboxField
                                label=""
                                options={PRODUCT_SURFACES.map(s => ({ value: s.value, label: s.label }))}
                                value={product.surface}
                                onSelect={(v) => updateProduct({ surface: v as typeof product.surface })}
                            />
                        </div>

                        {/* 구도 */}
                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-400">구도</Label>
                            <ComboboxField
                                label=""
                                options={PRODUCT_SHOT_TYPES.map(s => ({ value: s.value, label: s.label }))}
                                value={product.shotType}
                                onSelect={(v) => updateProduct({ shotType: v as typeof product.shotType })}
                            />
                        </div>
                    </div>

                    {/* 소품 */}
                    <div className="space-y-2">
                        <Label className="text-xs text-zinc-400">소품 (스타일링용)</Label>
                        <Input
                            value={product.props}
                            onChange={(e) => updateProduct({ props: e.target.value })}
                            placeholder="예: flowers, water droplets, leaves..."
                            className="bg-zinc-900 border-zinc-700 text-sm"
                        />
                    </div>
                </section>
            </TabsContent>

            {/* 라이팅 탭 (스튜디오와 동일) */}
            <TabsContent value="lighting" className="mt-6">
                <LightingTab />
            </TabsContent>

            {/* 카메라 설정 탭 */}
            <TabsContent value="camera" className="mt-6">
                <CameraTab />
            </TabsContent>
        </Tabs>
    );
}
