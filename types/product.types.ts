// types/product.types.ts
// 제품 사진 생성 시스템 타입 정의

// ===== 제품 카테고리 =====

export type ProductCategory =
    | 'cosmetics'     // 화장품/뷰티
    | 'food'          // 음식/음료
    | 'electronics'   // 전자기기
    | 'fashion'       // 패션 잡화
    | 'interior'      // 가구/인테리어
    | 'custom';       // 사용자 직접 입력

// ===== 제품 서페이스/백드롭 =====

export type ProductSurface =
    | 'white-marble'     // 흰색 대리석
    | 'black-marble'     // 검정 대리석
    | 'wood'             // 원목 테이블
    | 'concrete'         // 콘크리트
    | 'linen'            // 린넨 패브릭
    | 'acrylic'          // 아크릴/유리
    | 'gradient'         // 그라데이션 배경
    | 'natural'          // 자연 배경
    | 'studio-white'     // 스튜디오 화이트
    | 'studio-black';    // 스튜디오 블랙

// ===== 제품 구도 =====

export type ProductShotType =
    | 'hero'          // 히어로 샷 (45° 앵글, 제품 강조)
    | 'flat-lay'      // 플랫레이 (탑다운 90°)
    | 'eye-level'     // 아이레벨 (정면)
    | 'low-angle'     // 로우앵글 (아래에서 위로)
    | 'styled'        // 스타일링 샷 (소품 배치)
    | 'detail'        // 디테일 샷 (클로즈업)
    | 'lifestyle';    // 라이프스타일 (사용 장면)

// ===== 제품 재질 =====

export type ProductMaterial =
    | 'glass'         // 유리/투명
    | 'metal'         // 금속
    | 'matte'         // 매트
    | 'glossy'        // 광택
    | 'fabric'        // 직물
    | 'leather'       // 가죽
    | 'ceramic'       // 세라믹
    | 'paper'         // 종이/패키징
    | 'food-organic'; // 유기물 (음식)

// ===== 레퍼런스 이미지 =====

export interface ProductReferenceImage {
    id: string;
    base64: string;       // data URL (data:image/png;base64,...)
    fileName: string;
    fileSize: number;      // bytes
    mimeType: string;
}

// ===== 제품 설정 (통합) =====

export interface ProductSettings {
    // 제품 정보
    category: ProductCategory;
    customCategory: string;        // category가 'custom'일 때 사용
    productName: string;           // 제품명 (프롬프트에 반영)
    material: ProductMaterial;

    // 배경/서페이스
    surface: ProductSurface;

    // 구도
    shotType: ProductShotType;

    // 소품 (스타일링 샷용)
    props: string;                 // 사용자 자유 입력 (예: "꽃, 물방울, 나뭇잎")

    // 레퍼런스 이미지
    referenceImage?: ProductReferenceImage;
}
