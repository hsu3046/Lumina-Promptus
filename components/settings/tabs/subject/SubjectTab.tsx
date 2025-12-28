'use client';

import { useSettingsStore } from '@/store/useSettingsStore';
import { StudioSubjectForm } from './StudioSubjectForm';

export function SubjectTab() {
    const { settings } = useSettingsStore();
    const characteristicType = settings.artDirection.lensCharacteristicType;

    return (
        <div className="space-y-4">
            {/* 타입별 피사체 설정 */}
            {characteristicType === 'studio' && <StudioSubjectForm />}

            {/* 다른 타입 - 준비 중 */}
            {characteristicType !== 'studio' && (
                <div className="text-center py-8 text-zinc-500">
                    <p>
                        {characteristicType.charAt(0).toUpperCase() + characteristicType.slice(1)} 모드 입력 폼은 준비 중입니다.
                    </p>
                </div>
            )}
        </div>
    );
}
