// config/presets/subject-presets.ts
// 4대 분류 검색형 프리셋 데이터

import type { StudioSubject } from '@/types';

// ===== A: 외모 프리셋 (20개) =====
export interface AppearancePreset {
    id: string;
    label: string;
    keywords: string[];
    description: string;
    values: Pick<StudioSubject, 'skinTone' | 'hairColor' | 'eyeColor' | 'faceShape'>;
}

export const APPEARANCE_PRESETS: AppearancePreset[] = [
    { id: 'korean', label: '한국인', keywords: ['korean', '한국', '동양', 'k-beauty'], description: '밝은 피부, 검은 머리, 갈색 눈, 타원형 얼굴', values: { skinTone: 'light', hairColor: 'black', eyeColor: 'brown', faceShape: 'oval' } },
    { id: 'japanese', label: '일본인', keywords: ['japanese', '일본', '동양'], description: '창백한 피부, 검은 머리, 갈색 눈, 타원형 얼굴', values: { skinTone: 'fair', hairColor: 'black', eyeColor: 'brown', faceShape: 'oval' } },
    { id: 'chinese', label: '중국인', keywords: ['chinese', '중국', '동양'], description: '밝은 피부, 검은 머리, 갈색 눈, 둥근 얼굴', values: { skinTone: 'light', hairColor: 'black', eyeColor: 'brown', faceShape: 'round' } },
    { id: 'southeast-asian', label: '동남아시아인', keywords: ['southeast', '동남아', '태국', '베트남', '필리핀'], description: '탠 피부, 검은 머리, 갈색 눈의 열대 외모', values: { skinTone: 'tan', hairColor: 'black', eyeColor: 'brown', faceShape: 'oval' } },
    { id: 'indian', label: '인도인', keywords: ['indian', '인도', '남아시아', '볼리우드'], description: '브라운 피부, 검은 머리, 갈색 눈', values: { skinTone: 'brown', hairColor: 'black', eyeColor: 'brown', faceShape: 'oval' } },
    { id: 'caucasian-fair', label: '백인 페어', keywords: ['caucasian', '백인', 'fair', '창백', '북유럽'], description: '창백한 피부, 금발, 파란 눈의 서양인', values: { skinTone: 'fair', hairColor: 'blonde', eyeColor: 'blue', faceShape: 'oval' } },
    { id: 'caucasian-tan', label: '백인 탠', keywords: ['caucasian', '백인', 'tan', '선탠', '지중해'], description: '선탠 피부, 갈색 머리, 녹색 눈', values: { skinTone: 'tan', hairColor: 'brown', eyeColor: 'green', faceShape: 'square' } },
    { id: 'hispanic', label: '히스패닉', keywords: ['hispanic', '라틴', '스페인', '멕시코', '남미'], description: '미디움 피부, 갈색 머리, 갈색 눈의 라틴 외모', values: { skinTone: 'medium', hairColor: 'brown', eyeColor: 'brown', faceShape: 'oval' } },
    { id: 'african', label: '아프리카인', keywords: ['african', '아프리카', '흑인', '다크스킨'], description: '다크 피부, 검은 머리, 갈색 눈', values: { skinTone: 'dark', hairColor: 'black', eyeColor: 'brown', faceShape: 'oval' } },
    { id: 'african-american', label: '아프리카계 미국인', keywords: ['african-american', '미국 흑인', '브라운스킨'], description: '브라운 피부, 검은 머리, 동그란 얼굴', values: { skinTone: 'brown', hairColor: 'black', eyeColor: 'brown', faceShape: 'round' } },
    { id: 'middle-eastern', label: '중동인', keywords: ['middle eastern', '중동', '아랍', '페르시아', '터키'], description: '미디움 피부, 검은 머리, 진한 눈썹', values: { skinTone: 'medium', hairColor: 'black', eyeColor: 'brown', faceShape: 'oblong' } },
    { id: 'nordic', label: '북유럽인', keywords: ['nordic', '스칸디나비아', '북유럽', '바이킹', '스웨덴'], description: '창백한 피부, 금발, 파란 눈, 긴 얼굴', values: { skinTone: 'fair', hairColor: 'blonde', eyeColor: 'blue', faceShape: 'oblong' } },
    { id: 'mediterranean', label: '지중해인', keywords: ['mediterranean', '이탈리아', '그리스', '스페인', '포르투갈'], description: '올리브 피부, 갈색 머리, 헤이즐 눈', values: { skinTone: 'medium', hairColor: 'brown', eyeColor: 'hazel', faceShape: 'oval' } },
    { id: 'redhead', label: '레드헤드', keywords: ['redhead', '빨간머리', '주근깨', '아일랜드', '스코틀랜드'], description: '창백한 피부, 빨간 머리, 녹색 눈, 주근깨', values: { skinTone: 'fair', hairColor: 'red', eyeColor: 'green', faceShape: 'heart' } },
    { id: 'fantasy-pink', label: '판타지 핑크', keywords: ['fantasy', '판타지', '핑크', '애니메이션', '코스프레'], description: '분홍 머리, 파란 눈의 환상적인 외모', values: { skinTone: 'fair', hairColor: 'pink', eyeColor: 'blue', faceShape: 'heart' } },
    { id: 'fantasy-blue', label: '판타지 블루', keywords: ['fantasy', '판타지', '블루', '사이버펑크', 'sf'], description: '파란 머리, 회색 눈의 미래적 외모', values: { skinTone: 'fair', hairColor: 'blue', eyeColor: 'gray', faceShape: 'oval' } },
    { id: 'mixed-asian', label: '혼혈 아시안', keywords: ['mixed', '혼혈', '하프', '다문화'], description: '밝은 피부, 갈색 머리, 헤이즐 눈의 혼혈 외모', values: { skinTone: 'light', hairColor: 'brown', eyeColor: 'hazel', faceShape: 'oval' } },
    { id: 'albino', label: '알비노', keywords: ['albino', '알비노', '하얀', '희귀', '백색'], description: '매우 창백한 피부, 흰 머리, 회색 눈', values: { skinTone: 'fair', hairColor: 'white', eyeColor: 'gray', faceShape: 'oval' } },
    { id: 'mature-gray', label: '성숙한 그레이', keywords: ['gray', '그레이', '백발', '성숙', '실버'], description: '밝은 피부, 회색 머리의 성숙한 외모', values: { skinTone: 'light', hairColor: 'gray', eyeColor: 'brown', faceShape: 'oblong' } },
    { id: 'tropical', label: '트로피컬', keywords: ['tropical', '열대', '하와이', '폴리네시아', '태평양'], description: '탠 피부, 검은 머리, 둥근 얼굴의 열대 외모', values: { skinTone: 'tan', hairColor: 'black', eyeColor: 'brown', faceShape: 'round' } },
];

// ===== B: 스타일 프리셋 (20개) =====
export interface StylePreset {
    id: string;
    label: string;
    keywords: string[];
    description: string;
    values: Pick<StudioSubject, 'gender' | 'ageGroup' | 'hairStyle' | 'bodyType'>;
}

export const STYLE_PRESETS: StylePreset[] = [
    { id: 'young-woman', label: '20대 여성', keywords: ['20대', '여성', 'young', 'woman', '젊은'], description: '긴 머리, 보통 체형의 젊은 여성', values: { gender: 'female', ageGroup: '20s', hairStyle: 'long', bodyType: 'average' } },
    { id: 'young-man', label: '20대 남성', keywords: ['20대', '남성', 'young', 'man', '젊은'], description: '짧은 머리, 보통 체형의 젊은 남성', values: { gender: 'male', ageGroup: '20s', hairStyle: 'short', bodyType: 'average' } },
    { id: 'beautiful-woman', label: '아름다운 여성', keywords: ['아름다운', '미인', 'beautiful', '예쁜', '모델'], description: '웨이브 머리, 슬림한 체형의 아름다운 여성', values: { gender: 'female', ageGroup: '20s', hairStyle: 'wavy', bodyType: 'slim' } },
    { id: 'handsome-man', label: '잘생긴 남성', keywords: ['잘생긴', '미남', 'handsome', '멋있는', '훈남'], description: '짧은 머리, 건장한 체형의 잘생긴 남성', values: { gender: 'male', ageGroup: '30s', hairStyle: 'short', bodyType: 'athletic' } },
    { id: 'teen-girl', label: '10대 소녀', keywords: ['10대', '소녀', 'teen', 'girl', '청소년'], description: '포니테일, 슬림한 10대 소녀', values: { gender: 'female', ageGroup: 'teen', hairStyle: 'ponytail', bodyType: 'slim' } },
    { id: 'teen-boy', label: '10대 소년', keywords: ['10대', '소년', 'teen', 'boy', '청소년'], description: '짧은 머리, 슬림한 10대 소년', values: { gender: 'male', ageGroup: 'teen', hairStyle: 'short', bodyType: 'slim' } },
    { id: 'mature-woman', label: '40대 여성', keywords: ['40대', '성숙', 'mature', 'woman', '중년'], description: '중간 길이 머리, 글래머 체형의 성숙한 여성', values: { gender: 'female', ageGroup: '40s', hairStyle: 'medium', bodyType: 'curvy' } },
    { id: 'mature-man', label: '40대 남성', keywords: ['40대', '중년', 'mature', 'man', '아저씨'], description: '짧은 머리, 건장한 체형의 중년 남성', values: { gender: 'male', ageGroup: '40s', hairStyle: 'short', bodyType: 'athletic' } },
    { id: 'elderly-woman', label: '노년 여성', keywords: ['노인', '할머니', 'elderly', 'grandmother', '시니어'], description: '올림머리, 보통 체형의 노년 여성', values: { gender: 'female', ageGroup: 'elderly', hairStyle: 'bun', bodyType: 'average' } },
    { id: 'elderly-man', label: '노년 남성', keywords: ['노인', '할아버지', 'elderly', 'grandfather', '시니어'], description: '대머리, 보통 체형의 노년 남성', values: { gender: 'male', ageGroup: 'elderly', hairStyle: 'bald', bodyType: 'average' } },
    { id: 'child-girl', label: '어린 소녀', keywords: ['어린이', '소녀', 'child', 'girl', '아이'], description: '땋은 머리, 슬림한 어린 소녀', values: { gender: 'female', ageGroup: 'child', hairStyle: 'braids', bodyType: 'slim' } },
    { id: 'child-boy', label: '어린 소년', keywords: ['어린이', '소년', 'child', 'boy', '아이'], description: '짧은 머리, 슬림한 어린 소년', values: { gender: 'male', ageGroup: 'child', hairStyle: 'short', bodyType: 'slim' } },
    { id: 'athletic-woman', label: '운동선수 여성', keywords: ['운동선수', 'athletic', 'fitness', '스포츠', '근육'], description: '포니테일, 건장한 체형의 운동선수 여성', values: { gender: 'female', ageGroup: '20s', hairStyle: 'ponytail', bodyType: 'athletic' } },
    { id: 'athletic-man', label: '운동선수 남성', keywords: ['운동선수', 'athletic', 'fitness', '스포츠', '근육'], description: '짧은 머리, 건장한 체형의 운동선수 남성', values: { gender: 'male', ageGroup: '20s', hairStyle: 'short', bodyType: 'athletic' } },
    { id: 'plus-size-woman', label: '플러스 사이즈 여성', keywords: ['플러스', 'plus-size', 'curvy', '통통', '빅사이즈'], description: '긴 머리, 플러스 사이즈 체형의 여성', values: { gender: 'female', ageGroup: '30s', hairStyle: 'long', bodyType: 'plus' } },
    { id: 'curly-woman', label: '곱슬머리 여성', keywords: ['곱슬', 'curly', '웨이브', '아프로', '펌'], description: '곱슬머리, 보통 체형의 여성', values: { gender: 'female', ageGroup: '20s', hairStyle: 'curly', bodyType: 'average' } },
    { id: 'bald-man', label: '대머리 남성', keywords: ['대머리', 'bald', '삭발', '민머리', '스킨헤드'], description: '대머리, 건장한 체형의 남성', values: { gender: 'male', ageGroup: '40s', hairStyle: 'bald', bodyType: 'athletic' } },
    { id: 'long-hair-man', label: '장발 남성', keywords: ['장발', 'long hair', '긴머리', '히피', '록커'], description: '긴 머리, 슬림한 체형의 남성', values: { gender: 'male', ageGroup: '20s', hairStyle: 'long', bodyType: 'slim' } },
    { id: 'bob-woman', label: '단발 여성', keywords: ['단발', 'bob', '숏컷', '짧은머리', '커트'], description: '짧은 머리, 슬림한 체형의 여성', values: { gender: 'female', ageGroup: '30s', hairStyle: 'short', bodyType: 'slim' } },
    { id: 'worker-man', label: '60대 현장 노동자', keywords: ['노동자', 'worker', '현장', '60대', '일꾼', '건설'], description: '짧은 머리, 건장한 체형의 현장 노동자', values: { gender: 'male', ageGroup: '50plus', hairStyle: 'short', bodyType: 'athletic' } },
];

// ===== C: 패션 프리셋 (20개) =====
export interface FashionPreset {
    id: string;
    label: string;
    keywords: string[];
    description: string;
    values: Pick<StudioSubject, 'topWear' | 'bottomWear' | 'footwear' | 'accessory'>;
}

export const FASHION_PRESETS: FashionPreset[] = [
    { id: 'casual', label: '캐주얼', keywords: ['캐주얼', 'casual', '편한', '일상', '데일리'], description: '흰 티셔츠, 청바지, 스니커즈의 편안한 룩', values: { topWear: 'white-tshirt', bottomWear: 'blue-jeans', footwear: 'white-sneakers', accessory: '' } },
    { id: 'formal', label: '포멀', keywords: ['포멀', 'formal', '정장', '비즈니스', '면접'], description: '검은 정장, 드레스 팬츠, 구두, 넥타이', values: { topWear: 'suit-jacket', bottomWear: 'dress-pants', footwear: 'leather-shoes', accessory: 'necktie' } },
    { id: 'business-casual', label: '비즈니스 캐주얼', keywords: ['비즈니스', 'business', '오피스', '사무실', '직장'], description: '드레스 셔츠, 치노 팬츠, 로퍼의 오피스 룩', values: { topWear: 'dress-shirt', bottomWear: 'chinos', footwear: 'loafers', accessory: '' } },
    { id: 'streetwear', label: '스트릿웨어', keywords: ['스트릿', 'streetwear', '힙합', '도시', '언더그라운드'], description: '오버사이즈 후디, 카고 팬츠, 하이탑 스니커즈', values: { topWear: 'hoodie', bottomWear: 'cargo-pants', footwear: 'high-tops', accessory: 'baseball-cap' } },
    { id: 'hiphop', label: '힙합 패션', keywords: ['힙합', 'hiphop', '래퍼', '골드체인', '블링블링'], description: '그래픽 티, 배기진, 하이탑, 골드체인 래퍼 스타일', values: { topWear: 'graphic-tee', bottomWear: 'baggy-jeans', footwear: 'high-tops', accessory: 'gold-chain' } },
    { id: 'wedding-dress', label: '웨딩 드레스', keywords: ['웨딩', 'wedding', '신부', '결혼식', '드레스'], description: '레이스 웨딩드레스, 베일, 다이아몬드 귀걸이', values: { topWear: 'wedding-dress', bottomWear: '', footwear: 'white-heels', accessory: 'veil' } },
    { id: 'tuxedo', label: '턱시도', keywords: ['턱시도', 'tuxedo', '신랑', '결혼식', '갈라'], description: '블랙 턱시도, 보타이, 에나멜 구두', values: { topWear: 'tuxedo', bottomWear: 'tuxedo-pants', footwear: 'patent-leather', accessory: 'bow-tie' } },
    { id: 'korean-hanbok', label: '한복', keywords: ['한복', 'hanbok', '전통', '한국', '설날'], description: '한국 전통 의상, 저고리, 치마, 비녀', values: { topWear: 'hanbok-jeogori', bottomWear: 'hanbok-chima', footwear: 'gomusin', accessory: 'binyeo' } },
    { id: 'summer', label: '여름 패션', keywords: ['여름', 'summer', '시원', '바캉스', '해변'], description: '블라우스, 반바지, 샌들, 선글라스', values: { topWear: 'blouse', bottomWear: 'shorts', footwear: 'sandals', accessory: 'sunglasses' } },
    { id: 'winter', label: '겨울 패션', keywords: ['겨울', 'winter', '따뜻', '코트', '눈'], description: '울 코트, 청바지, 부츠, 비니', values: { topWear: 'wool-coat', bottomWear: 'blue-jeans', footwear: 'ankle-boots', accessory: 'beanie' } },
    { id: 'athletic', label: '스포츠웨어', keywords: ['운동복', 'athletic', '스포츠', '헬스', '요가'], description: '탱크탑, 요가 팬츠, 러닝화의 운동 룩', values: { topWear: 'tank-top', bottomWear: 'yoga-pants', footwear: 'running-shoes', accessory: 'watch' } },
    { id: 'bohemian', label: '보헤미안', keywords: ['보헤미안', 'bohemian', '히피', '자유로운', '빈티지'], description: '블라우스, 맥시 스커트, 샌들', values: { topWear: 'blouse', bottomWear: 'maxi-skirt', footwear: 'sandals', accessory: 'earrings' } },
    { id: 'punk', label: '펑크', keywords: ['펑크', 'punk', '록', '반항', '가죽'], description: '가죽 재킷, 스키니진, 컴뱃 부츠', values: { topWear: 'leather-jacket', bottomWear: 'skinny-jeans', footwear: 'combat-boots', accessory: 'choker' } },
    { id: 'minimalist', label: '미니멀', keywords: ['미니멀', 'minimalist', '심플', '단순', '깔끔'], description: '블랙 터틀넥, 블랙 팬츠의 심플한 룩', values: { topWear: 'turtleneck', bottomWear: 'dress-pants', footwear: 'white-sneakers', accessory: '' } },
    { id: 'preppy', label: '프레피', keywords: ['프레피', 'preppy', '교복', '학생', '아이비리그'], description: '폴로 셔츠, 가디건, 플리츠 스커트', values: { topWear: 'polo-shirt', bottomWear: 'pleated-skirt', footwear: 'loafers', accessory: '' } },
    { id: 'gothic', label: '고스', keywords: ['고스', 'gothic', '다크', '검은색', '뱀파이어'], description: '코르셋, 맥시 스커트, 플랫폼 부츠', values: { topWear: 'corset', bottomWear: 'maxi-skirt', footwear: 'platform-shoes', accessory: 'choker' } },
    { id: 'vintage', label: '빈티지', keywords: ['빈티지', 'vintage', '레트로', '50년대', '클래식'], description: '캐주얼 드레스, 메리 제인 힐, 진주 귀걸이', values: { topWear: 'casual-dress', bottomWear: '', footwear: 'mary-janes', accessory: 'pearl-necklace' } },
    { id: 'swimwear', label: '수영복', keywords: ['수영복', 'swimwear', '비키니', '해변', '수영장'], description: '비키니, 플립플롭, 밀짚모자의 비치 룩', values: { topWear: 'bikini-top', bottomWear: 'bikini-bottom', footwear: 'flip-flops', accessory: 'straw-hat' } },
    { id: 'pajamas', label: '잠옷', keywords: ['잠옷', 'pajamas', '홈웨어', '실크', '편안'], description: '스웨터, 조거 팬츠, 슬리퍼', values: { topWear: 'sweater', bottomWear: 'joggers', footwear: 'slippers', accessory: '' } },
    { id: 'uniform', label: '유니폼', keywords: ['유니폼', 'uniform', '제복', '근무복', '직원'], description: '드레스 셔츠, 드레스 팬츠, 가죽구두, 넥타이', values: { topWear: 'dress-shirt', bottomWear: 'dress-pants', footwear: 'leather-shoes', accessory: 'necktie' } },
];

// ===== D: 포즈 프리셋 (20개) =====
export interface PosePreset {
    id: string;
    label: string;
    keywords: string[];
    description: string;
    values: Pick<StudioSubject, 'bodyPose' | 'handPose' | 'expression' | 'gazeDirection'>;
}

export const POSE_PRESETS: PosePreset[] = [
    { id: 'natural', label: '자연스러운 포즈', keywords: ['자연스러운', 'natural', '편안', '릴렉스', '자연'], description: '컨트라포스토, 편안한 손, 자연스러운 미소, 카메라 응시', values: { bodyPose: 'contrapposto', handPose: 'natural-relaxed', expression: 'natural-smile', gazeDirection: 'direct-eye-contact' } },
    { id: 'model', label: '모델 포즈', keywords: ['모델', 'model', '패션', '화보', '런웨이'], description: 'S커브, 에디토리얼 손, 시리어스, 옆 응시의 패션 포즈', values: { bodyPose: 's-curve', handPose: 'editorial-hands', expression: 'serious', gazeDirection: 'side-gaze' } },
    { id: 'confident', label: '자신감 있는 포즈', keywords: ['자신감', 'confident', '당당', '파워', '리더'], description: '정면 자세, 팔짱, 시리어스 표정, 직시', values: { bodyPose: 'straight', handPose: 'crossed-arms', expression: 'serious', gazeDirection: 'direct-eye-contact' } },
    { id: 'friendly', label: '친근한 포즈', keywords: ['친근', 'friendly', '밝은', '웃음', '따뜻'], description: '편안한 자세, 활짝 웃음, 카메라 응시', values: { bodyPose: 'contrapposto', handPose: 'natural-relaxed', expression: 'bright-smile', gazeDirection: 'direct-eye-contact' } },
    { id: 'mysterious', label: '신비로운 포즈', keywords: ['신비', 'mysterious', '몽환', '미스터리', '어둠'], description: '3/4 턴, 머리 터치, 신비로운 표정, 카메라 밖 응시', values: { bodyPose: 'three-quarter-turn', handPose: 'hair-touch', expression: 'mysterious', gazeDirection: 'off-camera' } },
    { id: 'sensual', label: '관능적 포즈', keywords: ['관능', 'sensual', '섹시', '매혹', '유혹'], description: 'S커브, 에디토리얼 손, 관능적 표정, 반쯤 감은 눈', values: { bodyPose: 's-curve', handPose: 'editorial-hands', expression: 'sensual', gazeDirection: 'half-closed-eyes' } },
    { id: 'playful', label: '장난스러운 포즈', keywords: ['장난', 'playful', '재미', '귀여운', '활발'], description: '편안한 자세, 얼굴 프레이밍, 장난스러운 표정', values: { bodyPose: 'contrapposto', handPose: 'framing-face', expression: 'playful', gazeDirection: 'direct-eye-contact' } },
    { id: 'pensive', label: '사색적 포즈', keywords: ['사색', 'pensive', '생각', '명상', '철학'], description: '앉은 자세, 에디토리얼 손, 사색적 표정, 아래 응시', values: { bodyPose: 'sitting', handPose: 'editorial-hands', expression: 'pensive', gazeDirection: 'looking-down' } },
    { id: 'powerful', label: '강렬한 포즈', keywords: ['강렬', 'powerful', '임팩트', '힘', '파워풀'], description: '정면 자세, 팔짱, 강렬한 표정과 눈빛', values: { bodyPose: 'straight', handPose: 'crossed-arms', expression: 'intense', gazeDirection: 'direct-eye-contact' } },
    { id: 'elegant', label: '우아한 포즈', keywords: ['우아', 'elegant', '고급', '품위', '우아함'], description: 'S커브, 편안한 손, 은은한 미소, 어깨 너머 응시', values: { bodyPose: 's-curve', handPose: 'natural-relaxed', expression: 'subtle-smile', gazeDirection: 'over-shoulder' } },
    { id: 'casual-sitting', label: '캐주얼 시팅', keywords: ['앉아', 'sitting', '캐주얼', '편안', '의자'], description: '앉은 자세, 편안한 손, 자연스러운 미소', values: { bodyPose: 'sitting', handPose: 'natural-relaxed', expression: 'natural-smile', gazeDirection: 'direct-eye-contact' } },
    { id: 'reclining', label: '리클라이닝', keywords: ['누워', 'reclining', '편안', '소파', '침대'], description: '기대거나 누운 자세, 은은한 미소, 카메라 밖 응시', values: { bodyPose: 'reclining', handPose: 'natural-relaxed', expression: 'subtle-smile', gazeDirection: 'off-camera' } },
    { id: 'editorial', label: '에디토리얼', keywords: ['에디토리얼', 'editorial', '화보', '잡지', '하이패션'], description: '3/4 턴, 에디토리얼 손, 시리어스, 옆 응시', values: { bodyPose: 'three-quarter-turn', handPose: 'editorial-hands', expression: 'serious', gazeDirection: 'side-gaze' } },
    { id: 'dreamy', label: '몽환적 포즈', keywords: ['몽환', 'dreamy', '환상', '꿈', '판타지'], description: '누운 자세, 머리 터치, 사색적 표정, 위 응시', values: { bodyPose: 'reclining', handPose: 'hair-touch', expression: 'pensive', gazeDirection: 'looking-up' } },
    { id: 'cool', label: '쿨한 포즈', keywords: ['쿨', 'cool', '시크', '차가운', '도도'], description: '컨트라포스토, 주머니에 손, 무표정, 카메라 밖 응시', values: { bodyPose: 'contrapposto', handPose: 'pocket-hands', expression: 'neutral', gazeDirection: 'off-camera' } },
    { id: 'warm', label: '따뜻한 포즈', keywords: ['따뜻', 'warm', '포근', '온화', '친절'], description: '앉은 자세, 얼굴 프레이밍, 자연스러운 미소', values: { bodyPose: 'sitting', handPose: 'framing-face', expression: 'natural-smile', gazeDirection: 'direct-eye-contact' } },
    { id: 'dramatic', label: '드라마틱 포즈', keywords: ['드라마틱', 'dramatic', '극적', '드라마', '영화'], description: '3/4 턴, 얼굴 프레이밍, 강렬한 표정, 위 응시', values: { bodyPose: 'three-quarter-turn', handPose: 'framing-face', expression: 'intense', gazeDirection: 'looking-up' } },
    { id: 'closed-eyes', label: '눈 감은 포즈', keywords: ['눈감은', 'closed eyes', '명상', '평화', '수면'], description: '정면 자세, 편안한 손, 눈 감음, 명상적 분위기', values: { bodyPose: 'straight', handPose: 'natural-relaxed', expression: 'neutral', gazeDirection: 'eyes-closed' } },
    { id: 'looking-away', label: '시선 회피 포즈', keywords: ['시선 회피', 'looking away', '수줍', '부끄러움', '돌아봄'], description: '컨트라포스토, 머리 터치, 은은한 미소, 카메라 밖 응시', values: { bodyPose: 'contrapposto', handPose: 'hair-touch', expression: 'subtle-smile', gazeDirection: 'off-camera' } },
    { id: 'business', label: '비즈니스 포즈', keywords: ['비즈니스', 'business', '전문가', 'CEO', '기업'], description: '정면 자세, 팔짱, 은은한 미소, 전문적인 분위기', values: { bodyPose: 'straight', handPose: 'crossed-arms', expression: 'subtle-smile', gazeDirection: 'direct-eye-contact' } },
];
