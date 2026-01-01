// config/presets/subject-presets.ts
// 4대 분류 검색형 프리셋 데이터

import type { StudioSubject } from '@/types';

// ===== A: 외모 프리셋 (50개 - 국가/인종 기반) =====
export interface AppearancePreset {
    id: string;
    label: string;
    keywords: string[];
    description: string;
    values: Pick<StudioSubject, 'skinTone' | 'hairColor' | 'eyeColor' | 'faceShape'>;
}

export const APPEARANCE_PRESETS: AppearancePreset[] = [
    // ===== 동아시아 =====
    { id: 'korean', label: '한국인', keywords: ['korean', '한국', 'k-beauty', '동양'], description: '밝은 피부, 검은 머리, 갈색 눈, 타원형 얼굴', values: { skinTone: 'light', hairColor: 'black', eyeColor: 'brown', faceShape: 'oval' } },
    { id: 'japanese', label: '일본인', keywords: ['japanese', '일본', '동양'], description: '창백한 피부, 검은 머리, 갈색 눈, 타원형 얼굴', values: { skinTone: 'fair', hairColor: 'black', eyeColor: 'brown', faceShape: 'oval' } },
    { id: 'chinese', label: '중국인', keywords: ['chinese', '중국', '동양'], description: '밝은 피부, 검은 머리, 갈색 눈, 둥근 얼굴', values: { skinTone: 'light', hairColor: 'black', eyeColor: 'brown', faceShape: 'round' } },
    { id: 'chinese-northern', label: '북중국인', keywords: ['chinese', '중국', '북방', '만주'], description: '밝은 피부, 검은 머리, 긴 얼굴', values: { skinTone: 'light', hairColor: 'black', eyeColor: 'brown', faceShape: 'oblong' } },
    { id: 'taiwanese', label: '대만인', keywords: ['taiwanese', '대만', '타이베이'], description: '밝은 피부, 검은 머리, 갈색 눈', values: { skinTone: 'light', hairColor: 'black', eyeColor: 'brown', faceShape: 'oval' } },
    { id: 'hong-kong', label: '홍콩인', keywords: ['hong kong', '홍콩', '광동'], description: '밝은 피부, 검은 머리, 갈색 눈', values: { skinTone: 'light', hairColor: 'black', eyeColor: 'brown', faceShape: 'oval' } },
    { id: 'mongolian', label: '몽골인', keywords: ['mongolian', '몽골', '유목민'], description: '탠 피부, 검은 머리, 갈색 눈, 각진 얼굴', values: { skinTone: 'tan', hairColor: 'black', eyeColor: 'brown', faceShape: 'square' } },

    // ===== 동남아시아 =====
    { id: 'thai', label: '태국인', keywords: ['thai', '태국', '방콕', '동남아'], description: '탠 피부, 검은 머리, 갈색 눈', values: { skinTone: 'tan', hairColor: 'black', eyeColor: 'brown', faceShape: 'oval' } },
    { id: 'vietnamese', label: '베트남인', keywords: ['vietnamese', '베트남', '하노이', '호치민'], description: '밝은 탠 피부, 검은 머리, 갈색 눈', values: { skinTone: 'tan', hairColor: 'black', eyeColor: 'brown', faceShape: 'oval' } },
    { id: 'filipino', label: '필리핀인', keywords: ['filipino', '필리핀', '마닐라', '동남아'], description: '탠 피부, 검은 머리, 갈색 눈, 둥근 얼굴', values: { skinTone: 'tan', hairColor: 'black', eyeColor: 'brown', faceShape: 'round' } },
    { id: 'indonesian', label: '인도네시아인', keywords: ['indonesian', '인도네시아', '자카르타', '발리'], description: '탠 피부, 검은 머리, 갈색 눈', values: { skinTone: 'tan', hairColor: 'black', eyeColor: 'brown', faceShape: 'oval' } },
    { id: 'malaysian', label: '말레이시아인', keywords: ['malaysian', '말레이시아', '쿠알라룸푸르'], description: '탠 피부, 검은 머리, 갈색 눈', values: { skinTone: 'tan', hairColor: 'black', eyeColor: 'brown', faceShape: 'oval' } },
    { id: 'singaporean', label: '싱가포르인', keywords: ['singaporean', '싱가포르', '다문화'], description: '밝은 피부, 검은 머리, 갈색 눈', values: { skinTone: 'light', hairColor: 'black', eyeColor: 'brown', faceShape: 'oval' } },

    // ===== 남아시아 =====
    { id: 'indian', label: '인도인', keywords: ['indian', '인도', '볼리우드', '남아시아'], description: '브라운 피부, 검은 머리, 갈색 눈', values: { skinTone: 'brown', hairColor: 'black', eyeColor: 'brown', faceShape: 'oval' } },
    { id: 'indian-north', label: '북인도인', keywords: ['indian', '북인도', '펀잡', '델리'], description: '미디움 피부, 검은 머리, 갈색 눈', values: { skinTone: 'medium', hairColor: 'black', eyeColor: 'brown', faceShape: 'oval' } },
    { id: 'indian-south', label: '남인도인', keywords: ['indian', '남인도', '타밀', '케랄라'], description: '다크 브라운 피부, 검은 머리', values: { skinTone: 'dark', hairColor: 'black', eyeColor: 'brown', faceShape: 'oval' } },
    { id: 'pakistani', label: '파키스탄인', keywords: ['pakistani', '파키스탄', '라호르', '카라치'], description: '미디움 피부, 검은 머리, 갈색 눈', values: { skinTone: 'medium', hairColor: 'black', eyeColor: 'brown', faceShape: 'oblong' } },
    { id: 'bangladeshi', label: '방글라데시인', keywords: ['bangladeshi', '방글라데시', '다카'], description: '브라운 피부, 검은 머리, 갈색 눈', values: { skinTone: 'brown', hairColor: 'black', eyeColor: 'brown', faceShape: 'oval' } },
    { id: 'sri-lankan', label: '스리랑카인', keywords: ['sri lankan', '스리랑카', '콜롬보'], description: '브라운 피부, 검은 머리, 갈색 눈, 둥근 얼굴', values: { skinTone: 'brown', hairColor: 'black', eyeColor: 'brown', faceShape: 'round' } },
    { id: 'nepali', label: '네팔인', keywords: ['nepali', '네팔', '카트만두', '히말라야'], description: '탠 피부, 검은 머리, 갈색 눈', values: { skinTone: 'tan', hairColor: 'black', eyeColor: 'brown', faceShape: 'oval' } },

    // ===== 중동/서아시아 =====
    { id: 'arabic', label: '아랍인', keywords: ['arabic', '아랍', '중동', '두바이'], description: '미디움 피부, 검은 머리, 갈색 눈', values: { skinTone: 'medium', hairColor: 'black', eyeColor: 'brown', faceShape: 'oblong' } },
    { id: 'persian', label: '페르시아인', keywords: ['persian', '이란', '페르시아', '테헤란'], description: '미디움 피부, 검은 머리, 헤이즐 눈', values: { skinTone: 'medium', hairColor: 'black', eyeColor: 'hazel', faceShape: 'oval' } },
    { id: 'turkish', label: '터키인', keywords: ['turkish', '터키', '이스탄불', '앙카라'], description: '미디움 피부, 검은 머리, 갈색 눈', values: { skinTone: 'medium', hairColor: 'black', eyeColor: 'brown', faceShape: 'oval' } },
    { id: 'israeli', label: '이스라엘인', keywords: ['israeli', '이스라엘', '텔아비브', '예루살렘'], description: '미디움 피부, 갈색 머리, 갈색 눈', values: { skinTone: 'medium', hairColor: 'brown', eyeColor: 'brown', faceShape: 'oval' } },
    { id: 'lebanese', label: '레바논인', keywords: ['lebanese', '레바논', '베이루트'], description: '미디움 피부, 검은 머리, 갈색 눈', values: { skinTone: 'medium', hairColor: 'black', eyeColor: 'brown', faceShape: 'oval' } },

    // ===== 유럽 - 북유럽/서유럽 =====
    { id: 'swedish', label: '스웨덴인', keywords: ['swedish', '스웨덴', '스칸디나비아', '북유럽'], description: '창백한 피부, 금발, 파란 눈', values: { skinTone: 'fair', hairColor: 'blonde', eyeColor: 'blue', faceShape: 'oblong' } },
    { id: 'norwegian', label: '노르웨이인', keywords: ['norwegian', '노르웨이', '오슬로', '바이킹'], description: '창백한 피부, 금발, 파란 눈, 긴 얼굴', values: { skinTone: 'fair', hairColor: 'blonde', eyeColor: 'blue', faceShape: 'oblong' } },
    { id: 'danish', label: '덴마크인', keywords: ['danish', '덴마크', '코펜하겐', '북유럽'], description: '창백한 피부, 금발, 파란 눈', values: { skinTone: 'fair', hairColor: 'blonde', eyeColor: 'blue', faceShape: 'oval' } },
    { id: 'finnish', label: '핀란드인', keywords: ['finnish', '핀란드', '헬싱키', '북유럽'], description: '창백한 피부, 금발, 그레이 눈', values: { skinTone: 'fair', hairColor: 'blonde', eyeColor: 'gray', faceShape: 'oval' } },
    { id: 'german', label: '독일인', keywords: ['german', '독일', '베를린', '뮌헨'], description: '밝은 피부, 갈색 머리, 파란 눈, 각진 얼굴', values: { skinTone: 'light', hairColor: 'brown', eyeColor: 'blue', faceShape: 'square' } },
    { id: 'dutch', label: '네덜란드인', keywords: ['dutch', '네덜란드', '암스테르담'], description: '창백한 피부, 금발, 파란 눈, 긴 얼굴', values: { skinTone: 'fair', hairColor: 'blonde', eyeColor: 'blue', faceShape: 'oblong' } },
    { id: 'british', label: '영국인', keywords: ['british', '영국', '런던', '잉글랜드'], description: '밝은 피부, 갈색 머리, 갈색 눈', values: { skinTone: 'light', hairColor: 'brown', eyeColor: 'brown', faceShape: 'oval' } },
    { id: 'french', label: '프랑스인', keywords: ['french', '프랑스', '파리', '패션'], description: '밝은 피부, 갈색 머리, 헤이즐 눈', values: { skinTone: 'light', hairColor: 'brown', eyeColor: 'hazel', faceShape: 'oval' } },

    // ===== 유럽 - 남유럽 =====
    { id: 'italian', label: '이탈리아인', keywords: ['italian', '이탈리아', '로마', '밀라노'], description: '미디움 피부, 갈색 머리, 갈색 눈', values: { skinTone: 'medium', hairColor: 'brown', eyeColor: 'brown', faceShape: 'oval' } },
    { id: 'spanish', label: '스페인인', keywords: ['spanish', '스페인', '마드리드', '바르셀로나'], description: '미디움 피부, 검은 머리, 갈색 눈', values: { skinTone: 'medium', hairColor: 'black', eyeColor: 'brown', faceShape: 'oval' } },
    { id: 'portuguese', label: '포르투갈인', keywords: ['portuguese', '포르투갈', '리스본'], description: '미디움 피부, 갈색 머리, 갈색 눈', values: { skinTone: 'medium', hairColor: 'brown', eyeColor: 'brown', faceShape: 'oval' } },
    { id: 'greek', label: '그리스인', keywords: ['greek', '그리스', '아테네', '지중해'], description: '미디움 피부, 검은 머리, 갈색 눈', values: { skinTone: 'medium', hairColor: 'black', eyeColor: 'brown', faceShape: 'oval' } },

    // ===== 유럽 - 동유럽 =====
    { id: 'russian', label: '러시아인', keywords: ['russian', '러시아', '모스크바', '슬라브'], description: '창백한 피부, 금발, 파란 눈', values: { skinTone: 'fair', hairColor: 'blonde', eyeColor: 'blue', faceShape: 'oval' } },
    { id: 'ukrainian', label: '우크라이나인', keywords: ['ukrainian', '우크라이나', '키이우', '슬라브'], description: '창백한 피부, 금발, 녹색 눈', values: { skinTone: 'fair', hairColor: 'blonde', eyeColor: 'green', faceShape: 'oval' } },
    { id: 'polish', label: '폴란드인', keywords: ['polish', '폴란드', '바르샤바', '슬라브'], description: '밝은 피부, 갈색 머리, 파란 눈', values: { skinTone: 'light', hairColor: 'brown', eyeColor: 'blue', faceShape: 'oval' } },

    // ===== 아메리카 =====
    { id: 'american-caucasian', label: '미국 백인', keywords: ['american', '미국', '백인', 'usa'], description: '밝은 피부, 갈색 머리, 헤이즐 눈', values: { skinTone: 'light', hairColor: 'brown', eyeColor: 'hazel', faceShape: 'oval' } },
    { id: 'african-american', label: '아프리카계 미국인', keywords: ['african-american', '미국 흑인', 'african american'], description: '브라운 피부, 검은 머리, 갈색 눈', values: { skinTone: 'brown', hairColor: 'black', eyeColor: 'brown', faceShape: 'round' } },
    { id: 'hispanic-american', label: '히스패닉계 미국인', keywords: ['hispanic', '라틴', '멕시코계', '히스패닉'], description: '미디움 피부, 갈색 머리, 갈색 눈', values: { skinTone: 'medium', hairColor: 'brown', eyeColor: 'brown', faceShape: 'oval' } },
    { id: 'mexican', label: '멕시코인', keywords: ['mexican', '멕시코', '멕시코시티'], description: '미디움 피부, 검은 머리, 갈색 눈', values: { skinTone: 'medium', hairColor: 'black', eyeColor: 'brown', faceShape: 'oval' } },
    { id: 'brazilian', label: '브라질인', keywords: ['brazilian', '브라질', '상파울루', '리우'], description: '탠 피부, 갈색 머리, 갈색 눈', values: { skinTone: 'tan', hairColor: 'brown', eyeColor: 'brown', faceShape: 'oval' } },
    { id: 'colombian', label: '콜롬비아인', keywords: ['colombian', '콜롬비아', '보고타', '남미'], description: '탠 피부, 검은 머리, 갈색 눈', values: { skinTone: 'tan', hairColor: 'black', eyeColor: 'brown', faceShape: 'oval' } },

    // ===== 아프리카 =====
    { id: 'nigerian', label: '나이지리아인', keywords: ['nigerian', '나이지리아', '라고스', '아프리카'], description: '다크 피부, 검은 머리, 갈색 눈', values: { skinTone: 'dark', hairColor: 'black', eyeColor: 'brown', faceShape: 'oval' } },
    { id: 'ethiopian', label: '에티오피아인', keywords: ['ethiopian', '에티오피아', '동아프리카'], description: '브라운 피부, 검은 머리, 갈색 눈, 긴 얼굴', values: { skinTone: 'brown', hairColor: 'black', eyeColor: 'brown', faceShape: 'oblong' } },
    { id: 'south-african', label: '남아프리카인', keywords: ['south african', '남아프리카', '요하네스버그'], description: '다크 피부, 검은 머리, 갈색 눈', values: { skinTone: 'dark', hairColor: 'black', eyeColor: 'brown', faceShape: 'oval' } },
    { id: 'egyptian', label: '이집트인', keywords: ['egyptian', '이집트', '카이로', '북아프리카'], description: '미디움 피부, 검은 머리, 갈색 눈', values: { skinTone: 'medium', hairColor: 'black', eyeColor: 'brown', faceShape: 'oval' } },

    // ===== 오세아니아/특수 =====
    { id: 'australian', label: '호주인', keywords: ['australian', '호주', '시드니', '멜번'], description: '밝은 피부, 금발, 파란 눈', values: { skinTone: 'light', hairColor: 'blonde', eyeColor: 'blue', faceShape: 'oval' } },
    { id: 'polynesian', label: '폴리네시아인', keywords: ['polynesian', '폴리네시아', '하와이', '태평양'], description: '탠 피부, 검은 머리, 갈색 눈, 둥근 얼굴', values: { skinTone: 'tan', hairColor: 'black', eyeColor: 'brown', faceShape: 'round' } },
    { id: 'maori', label: '마오리족', keywords: ['maori', '마오리', '뉴질랜드', '원주민'], description: '탠 피부, 검은 머리, 갈색 눈, 각진 얼굴', values: { skinTone: 'tan', hairColor: 'black', eyeColor: 'brown', faceShape: 'square' } },

    // ===== 혼혈/특수 =====
    { id: 'mixed-asian-caucasian', label: '아시안-백인 혼혈', keywords: ['mixed', '혼혈', '하프', '다문화'], description: '밝은 피부, 갈색 머리, 헤이즐 눈', values: { skinTone: 'light', hairColor: 'brown', eyeColor: 'hazel', faceShape: 'oval' } },
    { id: 'mixed-black-caucasian', label: '흑인-백인 혼혈', keywords: ['mixed', '혼혈', '다문화'], description: '미디움 피부, 갈색 머리, 갈색 눈', values: { skinTone: 'medium', hairColor: 'brown', eyeColor: 'brown', faceShape: 'oval' } },
    { id: 'irish-redhead', label: '아일랜드 레드헤드', keywords: ['irish', '아일랜드', '레드헤드', '빨간머리'], description: '창백한 피부, 빨간 머리, 녹색 눈', values: { skinTone: 'fair', hairColor: 'red', eyeColor: 'green', faceShape: 'heart' } },
];


// ===== B: 스타일 프리셋 (20개) =====
export type StyleTag = 'male' | 'female' | 'child' | 'teen' | 'adult' | 'senior' | 'athletic' | 'formal-ready';

export interface StylePreset {
    id: string;
    label: string;
    keywords: string[];
    description: string;
    tags: StyleTag[];
    values: Pick<StudioSubject, 'gender' | 'ageGroup' | 'hairStyle' | 'bodyType'>;
}

export const STYLE_PRESETS: StylePreset[] = [
    { id: 'young-woman', label: '20대 여성', keywords: ['20대', '여성', 'young', 'woman', '젊은'], description: '긴 머리, 보통 체형의 젊은 여성', tags: ['female', 'adult', 'formal-ready'], values: { gender: 'female', ageGroup: 'early-20s', hairStyle: 'long-straight', bodyType: 'average' } },
    { id: 'young-man', label: '20대 남성', keywords: ['20대', '남성', 'young', 'man', '젊은'], description: '짧은 머리, 보통 체형의 젊은 남성', tags: ['male', 'adult', 'formal-ready'], values: { gender: 'male', ageGroup: 'early-20s', hairStyle: 'short-straight', bodyType: 'average' } },
    { id: 'beautiful-woman', label: '아름다운 여성', keywords: ['아름다운', '미인', 'beautiful', '예쁜', '모델'], description: '웨이브 머리, 슬림한 체형의 아름다운 여성', tags: ['female', 'adult', 'formal-ready'], values: { gender: 'female', ageGroup: 'late-20s', hairStyle: 'long-wavy', bodyType: 'slim' } },
    { id: 'handsome-man', label: '잘생긴 남성', keywords: ['잘생긴', '미남', 'handsome', '멋있는', '훈남'], description: '짧은 머리, 건장한 체형의 잘생긴 남성', tags: ['male', 'adult', 'formal-ready'], values: { gender: 'male', ageGroup: '30s', hairStyle: 'short-straight', bodyType: 'athletic' } },
    { id: 'teen-girl', label: '20대 초반 여성', keywords: ['10대', '소녀', 'teen', 'girl', '청소년'], description: '포니테일, 슬림한 젊은 여성', tags: ['female', 'teen'], values: { gender: 'female', ageGroup: 'early-20s', hairStyle: 'ponytail', bodyType: 'slim' } },
    { id: 'teen-boy', label: '20대 초반 남성', keywords: ['10대', '소년', 'teen', 'boy', '청소년'], description: '짧은 머리, 슬림한 젊은 남성', tags: ['male', 'teen'], values: { gender: 'male', ageGroup: 'early-20s', hairStyle: 'short-straight', bodyType: 'slim' } },
    { id: 'mature-woman', label: '40대 여성', keywords: ['40대', '성숙', 'mature', 'woman', '중년'], description: '중간 길이 머리, 글래머 체형의 성숙한 여성', tags: ['female', 'adult', 'formal-ready'], values: { gender: 'female', ageGroup: '40s-50s', hairStyle: 'medium-straight', bodyType: 'curvy' } },
    { id: 'mature-man', label: '40대 남성', keywords: ['40대', '중년', 'mature', 'man', '아저씨'], description: '짧은 머리, 건장한 체형의 중년 남성', tags: ['male', 'adult', 'formal-ready'], values: { gender: 'male', ageGroup: '40s-50s', hairStyle: 'short-straight', bodyType: 'athletic' } },
    { id: 'elderly-woman', label: '노년 여성', keywords: ['노인', '할머니', 'elderly', 'grandmother', '시니어'], description: '올림머리, 보통 체형의 노년 여성', tags: ['female', 'senior'], values: { gender: 'female', ageGroup: '80plus', hairStyle: 'bun', bodyType: 'average' } },
    { id: 'elderly-man', label: '노년 남성', keywords: ['노인', '할아버지', 'elderly', 'grandfather', '시니어'], description: '대머리, 보통 체형의 노년 남성', tags: ['male', 'senior'], values: { gender: 'male', ageGroup: '80plus', hairStyle: 'bald', bodyType: 'average' } },
    { id: 'child-girl', label: '20대 초반 소녀', keywords: ['어린이', '소녀', 'child', 'girl', '아이'], description: '땋은 머리, 슬림한 젊은 소녀', tags: ['female', 'child'], values: { gender: 'female', ageGroup: 'early-20s', hairStyle: 'braids', bodyType: 'slim' } },
    { id: 'child-boy', label: '20대 초반 소년', keywords: ['어린이', '소년', 'child', 'boy', '아이'], description: '짧은 머리, 슬림한 젊은 소년', tags: ['male', 'child'], values: { gender: 'male', ageGroup: 'early-20s', hairStyle: 'short-straight', bodyType: 'slim' } },
    { id: 'athletic-woman', label: '운동선수 여성', keywords: ['운동선수', 'athletic', 'fitness', '스포츠', '근육'], description: '포니테일, 건장한 체형의 운동선수 여성', tags: ['female', 'adult', 'athletic'], values: { gender: 'female', ageGroup: 'late-20s', hairStyle: 'ponytail', bodyType: 'athletic' } },
    { id: 'athletic-man', label: '운동선수 남성', keywords: ['운동선수', 'athletic', 'fitness', '스포츠', '근육'], description: '짧은 머리, 건장한 체형의 운동선수 남성', tags: ['male', 'adult', 'athletic'], values: { gender: 'male', ageGroup: 'late-20s', hairStyle: 'short-straight', bodyType: 'athletic' } },
    { id: 'plus-size-woman', label: '플러스 사이즈 여성', keywords: ['플러스', 'plus-size', 'curvy', '통통', '빅사이즈'], description: '긴 머리, 곡선형 체형의 여성', tags: ['female', 'adult', 'formal-ready'], values: { gender: 'female', ageGroup: '30s', hairStyle: 'long-straight', bodyType: 'curvy' } },
    { id: 'curly-woman', label: '곱슬머리 여성', keywords: ['곱슬', 'curly', '웨이브', '아프로', '펌'], description: '곱슬머리, 보통 체형의 여성', tags: ['female', 'adult', 'formal-ready'], values: { gender: 'female', ageGroup: 'late-20s', hairStyle: 'curly', bodyType: 'average' } },
    { id: 'bald-man', label: '대머리 남성', keywords: ['대머리', 'bald', '삭발', '민머리', '스킨헤드'], description: '대머리, 건장한 체형의 남성', tags: ['male', 'adult', 'formal-ready'], values: { gender: 'male', ageGroup: '40s-50s', hairStyle: 'bald', bodyType: 'athletic' } },
    { id: 'long-hair-man', label: '장발 남성', keywords: ['장발', 'long hair', '긴머리', '히피', '록커'], description: '긴 머리, 슬림한 체형의 남성', tags: ['male', 'adult'], values: { gender: 'male', ageGroup: 'late-20s', hairStyle: 'long-straight', bodyType: 'slim' } },
    { id: 'bob-woman', label: '단발 여성', keywords: ['단발', 'bob', '숏컷', '짧은머리', '커트'], description: '짧은 머리, 슬림한 체형의 여성', tags: ['female', 'adult', 'formal-ready'], values: { gender: 'female', ageGroup: '30s', hairStyle: 'short-straight', bodyType: 'slim' } },
    { id: 'worker-man', label: '60대 현장 노동자', keywords: ['노동자', 'worker', '현장', '60대', '일꾼', '건설'], description: '짧은 머리, 건장한 체형의 현장 노동자', tags: ['male', 'senior'], values: { gender: 'male', ageGroup: '60s-70s', hairStyle: 'short-straight', bodyType: 'athletic' } },
];

// ===== C: 패션 프리셋 (20개) =====
export type FashionTag = 'male' | 'female' | 'unisex' | 'child' | 'teen' | 'adult' | 'senior' | 'athletic' | 'formal';

export interface FashionPreset {
    id: string;
    label: string;
    keywords: string[];
    description: string;
    tags: FashionTag[];
    values: Pick<StudioSubject, 'topWear' | 'bottomWear' | 'footwear' | 'accessory'>;
}

export const FASHION_PRESETS: FashionPreset[] = [
    { id: 'casual', label: '캐주얼', keywords: ['캐주얼', 'casual', '편한', '일상', '데일리'], description: '흰 티셔츠, 청바지, 스니커즈의 편안한 룩', tags: ['unisex', 'teen', 'adult', 'senior'], values: { topWear: 'white-tshirt', bottomWear: 'blue-jeans', footwear: 'white-sneakers', accessory: '' } },
    { id: 'formal', label: '포멀', keywords: ['포멀', 'formal', '정장', '비즈니스', '면접'], description: '검은 정장, 드레스 팬츠, 구두, 넥타이', tags: ['male', 'adult', 'formal'], values: { topWear: 'suit-jacket', bottomWear: 'dress-pants', footwear: 'leather-shoes', accessory: 'necktie' } },
    { id: 'business-casual', label: '비즈니스 캐주얼', keywords: ['비즈니스', 'business', '오피스', '사무실', '직장'], description: '드레스 셔츠, 치노 팬츠, 로퍼의 오피스 룩', tags: ['unisex', 'adult', 'formal'], values: { topWear: 'dress-shirt', bottomWear: 'chinos', footwear: 'loafers', accessory: '' } },
    { id: 'streetwear', label: '스트릿웨어', keywords: ['스트릿', 'streetwear', '힙합', '도시', '언더그라운드'], description: '오버사이즈 후디, 카고 팬츠, 하이탑 스니커즈', tags: ['unisex', 'teen', 'adult'], values: { topWear: 'hoodie', bottomWear: 'cargo-pants', footwear: 'high-tops', accessory: 'baseball-cap' } },
    { id: 'hiphop', label: '힙합 패션', keywords: ['힙합', 'hiphop', '래퍼', '골드체인', '블링블링'], description: '그래픽 티, 배기진, 하이탑, 골드체인 래퍼 스타일', tags: ['unisex', 'teen', 'adult'], values: { topWear: 'graphic-tee', bottomWear: 'baggy-jeans', footwear: 'high-tops', accessory: 'gold-chain' } },
    { id: 'wedding-dress', label: '웨딩 드레스', keywords: ['웨딩', 'wedding', '신부', '결혼식', '드레스'], description: '레이스 웨딩드레스, 베일, 다이아몬드 귀걸이', tags: ['female', 'adult', 'formal'], values: { topWear: 'wedding-dress', bottomWear: '', footwear: 'white-heels', accessory: 'veil' } },
    { id: 'tuxedo', label: '턱시도', keywords: ['턱시도', 'tuxedo', '신랑', '결혼식', '갈라'], description: '블랙 턱시도, 보타이, 에나멜 구두', tags: ['male', 'adult', 'formal'], values: { topWear: 'tuxedo', bottomWear: 'tuxedo-pants', footwear: 'patent-leather', accessory: 'bow-tie' } },
    { id: 'korean-hanbok', label: '한복', keywords: ['한복', 'hanbok', '전통', '한국', '설날'], description: '한국 전통 의상, 저고리, 치마, 비녀', tags: ['unisex', 'child', 'teen', 'adult', 'senior'], values: { topWear: 'hanbok-jeogori', bottomWear: 'hanbok-chima', footwear: 'gomusin', accessory: 'binyeo' } },
    { id: 'summer', label: '여름 패션', keywords: ['여름', 'summer', '시원', '바캉스', '해변'], description: '블라우스, 반바지, 샌들, 선글라스', tags: ['unisex', 'teen', 'adult'], values: { topWear: 'blouse', bottomWear: 'shorts', footwear: 'sandals', accessory: 'sunglasses' } },
    { id: 'winter', label: '겨울 패션', keywords: ['겨울', 'winter', '따뜻', '코트', '눈'], description: '울 코트, 청바지, 부츠, 비니', tags: ['unisex', 'teen', 'adult', 'senior'], values: { topWear: 'wool-coat', bottomWear: 'blue-jeans', footwear: 'ankle-boots', accessory: 'beanie' } },
    { id: 'athletic', label: '스포츠웨어', keywords: ['운동복', 'athletic', '스포츠', '헬스', '요가'], description: '탱크탑, 요가 팬츠, 러닝화의 운동 룩', tags: ['unisex', 'teen', 'adult', 'athletic'], values: { topWear: 'tank-top', bottomWear: 'yoga-pants', footwear: 'running-shoes', accessory: 'watch' } },
    { id: 'bohemian', label: '보헤미안', keywords: ['보헤미안', 'bohemian', '히피', '자유로운', '빈티지'], description: '블라우스, 맥시 스커트, 샌들', tags: ['female', 'adult'], values: { topWear: 'blouse', bottomWear: 'maxi-skirt', footwear: 'sandals', accessory: 'earrings' } },
    { id: 'punk', label: '펑크', keywords: ['펑크', 'punk', '록', '반항', '가죽'], description: '가죽 재킷, 스키니진, 컴뱃 부츠', tags: ['unisex', 'teen', 'adult'], values: { topWear: 'leather-jacket', bottomWear: 'skinny-jeans', footwear: 'combat-boots', accessory: 'choker' } },
    { id: 'minimalist', label: '미니멀', keywords: ['미니멀', 'minimalist', '심플', '단순', '깔끔'], description: '블랙 터틀넥, 블랙 팬츠의 심플한 룩', tags: ['unisex', 'adult', 'formal'], values: { topWear: 'turtleneck', bottomWear: 'dress-pants', footwear: 'white-sneakers', accessory: '' } },
    { id: 'preppy', label: '프레피', keywords: ['프레피', 'preppy', '교복', '학생', '아이비리그'], description: '폴로 셔츠, 가디건, 플리츠 스커트', tags: ['unisex', 'teen', 'adult'], values: { topWear: 'polo-shirt', bottomWear: 'pleated-skirt', footwear: 'loafers', accessory: '' } },
    { id: 'gothic', label: '고스', keywords: ['고스', 'gothic', '다크', '검은색', '뱀파이어'], description: '코르셋, 맥시 스커트, 플랫폼 부츠', tags: ['female', 'teen', 'adult'], values: { topWear: 'corset', bottomWear: 'maxi-skirt', footwear: 'platform-shoes', accessory: 'choker' } },
    { id: 'vintage', label: '빈티지', keywords: ['빈티지', 'vintage', '레트로', '50년대', '클래식'], description: '캐주얼 드레스, 메리 제인 힐, 진주 귀걸이', tags: ['female', 'adult'], values: { topWear: 'casual-dress', bottomWear: '', footwear: 'mary-janes', accessory: 'pearl-necklace' } },
    { id: 'swimwear', label: '수영복', keywords: ['수영복', 'swimwear', '비키니', '해변', '수영장'], description: '비키니, 플립플롭, 밀짚모자의 비치 룩', tags: ['female', 'teen', 'adult'], values: { topWear: 'bikini-top', bottomWear: 'bikini-bottom', footwear: 'flip-flops', accessory: 'straw-hat' } },
    { id: 'pajamas', label: '잠옷', keywords: ['잠옷', 'pajamas', '홈웨어', '실크', '편안'], description: '스웨터, 조거 팬츠, 슬리퍼', tags: ['unisex', 'child', 'teen', 'adult', 'senior'], values: { topWear: 'sweater', bottomWear: 'joggers', footwear: 'slippers', accessory: '' } },
    { id: 'uniform', label: '유니폼', keywords: ['유니폼', 'uniform', '제복', '근무복', '직원'], description: '드레스 셔츠, 드레스 팬츠, 가죽구두, 넥타이', tags: ['unisex', 'adult', 'formal'], values: { topWear: 'dress-shirt', bottomWear: 'dress-pants', footwear: 'leather-shoes', accessory: 'necktie' } },
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
