// config/mappings/snap-options.ts
// 스냅 모드 피사체/환경 옵션 정의

// ===== 피사체 유형 (누가) =====
export const SNAP_SUBJECT_TYPES = [
    // 인물
    { value: 'pedestrian', label: '행인', category: 'person' },
    { value: 'elderly', label: '노인', category: 'person' },
    { value: 'child', label: '아이', category: 'person' },
    { value: 'couple', label: '커플', category: 'person' },
    { value: 'street-artist', label: '거리 예술가', category: 'person' },
    { value: 'vendor', label: '노점상', category: 'person' },
    // 동물
    { value: 'street-cat', label: '길고양이', category: 'animal' },
    { value: 'pigeon', label: '비둘기', category: 'animal' },
    { value: 'stray-dog', label: '떠돌이 개', category: 'animal' },
    // 탈것
    { value: 'bicycle', label: '자전거', category: 'vehicle' },
    { value: 'motorcycle', label: '오토바이', category: 'vehicle' },
    { value: 'taxi', label: '택시', category: 'vehicle' },
    { value: 'tram', label: '트램', category: 'vehicle' },
    // 사물
    { value: 'umbrella', label: '우산', category: 'object' },
    { value: 'bench', label: '벤치', category: 'object' },
    { value: 'sign', label: '간판', category: 'object' },
    { value: 'poster', label: '포스터', category: 'object' },
] as const;

// ===== 장소 유형 (어디서) =====
export const SNAP_LOCATIONS = [
    { value: 'alley', label: '골목' },
    { value: 'crosswalk', label: '횡단보도' },
    { value: 'park', label: '공원' },
    { value: 'market', label: '시장' },
    { value: 'subway-station', label: '지하철역' },
    { value: 'bus-stop', label: '버스 정류장' },
    { value: 'cafe', label: '카페 앞' },
    { value: 'downtown', label: '도심 거리' },
    { value: 'underpass', label: '지하도' },
    { value: 'stairs', label: '계단' },
] as const;

// ===== 구체적인 장소 (환경 설정용) =====
export const SNAP_SPECIFIC_PLACES = [
    { value: 'tokyo-shibuya', label: '도쿄 시부야' },
    { value: 'paris-montmartre', label: '파리 몽마르트르' },
    { value: 'new-york-times-square', label: '뉴욕 타임스퀘어' },
    { value: 'london-soho', label: '런던 소호' },
    { value: 'hongkong-mongkok', label: '홍콩 몽콕' },
    { value: 'seoul-hongdae', label: '서울 홍대' },
    { value: 'seoul-myeongdong', label: '서울 명동' },
    { value: 'bangkok-khaosan', label: '방콕 카오산로드' },
    { value: 'amsterdam-jordaan', label: '암스테르담 요르단' },
    { value: 'havana-old-town', label: '하바나 구시가' },
    { value: 'marrakech-medina', label: '마라케시 메디나' },
    { value: 'venice-canals', label: '베니스 운하' },
] as const;

// ===== 누구와 =====
export const SNAP_COMPANIONS = [
    { value: 'alone', label: '홀로' },
    { value: 'with-friend', label: '친구와' },
    { value: 'with-lover', label: '연인과' },
    { value: 'with-family', label: '가족과' },
    { value: 'with-pet', label: '반려동물과' },
    { value: 'in-crowd', label: '군중 속에서' },
] as const;

// ===== 행동/상황 (무엇을) =====
export const SNAP_ACTIONS = [
    { value: 'walking', label: '걷고 있는' },
    { value: 'waiting', label: '기다리는' },
    { value: 'sitting', label: '앉아 있는' },
    { value: 'running', label: '뛰는' },
    { value: 'talking', label: '대화하는' },
    { value: 'resting', label: '쉬고 있는' },
    { value: 'working', label: '일하는' },
    { value: 'napping', label: '낮잠 자는' },
    { value: 'eating', label: '먹고 있는' },
    { value: 'watching', label: '바라보는' },
] as const;

// ===== 방식 (어떻게) - 감정 상태 포함 =====
export const SNAP_MANNERS = [
    // 기존 방식
    { value: 'hurriedly', label: '급하게' },
    { value: 'leisurely', label: '느긋하게' },
    { value: 'secretly', label: '몰래' },
    { value: 'silently', label: '조용히' },
    { value: 'absentmindedly', label: '멍하니' },
    // 감정 상태 (부사형)
    { value: 'lonely', label: '쓸쓸하게' },
    { value: 'busy', label: '분주하게' },
    { value: 'peaceful', label: '평화롭게' },
    { value: 'tense', label: '긴장하며' },
    { value: 'nostalgic', label: '향수에 젖어' },
    { value: 'vibrant', label: '활기차게' },
    { value: 'mysterious', label: '신비롭게' },
    { value: 'melancholic', label: '우울하게' },
] as const;

// ===== 감정 상태 (deprecated - SNAP_MANNERS에 통합됨) =====
export const SNAP_MOODS = [
    { value: 'lonely', label: '쓸쓸한' },
    { value: 'busy', label: '분주한' },
    { value: 'peaceful', label: '평화로운' },
    { value: 'tense', label: '긴장된' },
    { value: 'nostalgic', label: '향수 어린' },
    { value: 'vibrant', label: '활기찬' },
    { value: 'mysterious', label: '신비로운' },
    { value: 'melancholic', label: '우울한' },
] as const;

// ===== 환경 - 날씨 =====
export const SNAP_WEATHER = [
    { value: 'clear', label: '맑음' },
    { value: 'cloudy', label: '흐림' },
    { value: 'rainy', label: '비' },
    { value: 'after-rain', label: '비 온 뒤' },
    { value: 'foggy', label: '안개' },
    { value: 'snowy', label: '눈' },
    { value: 'windy', label: '바람' },
] as const;

// ===== 환경 - 계절 =====
export const SNAP_SEASONS = [
    { value: 'spring', label: '봄' },
    { value: 'summer', label: '여름' },
    { value: 'autumn', label: '가을' },
    { value: 'winter', label: '겨울' },
] as const;

// ===== 환경 - 시간대 =====
export const SNAP_TIME_OF_DAY = [
    { value: 'dawn', label: '새벽' },
    { value: 'morning', label: '아침' },
    { value: 'midday', label: '한낮' },
    { value: 'afternoon', label: '오후' },
    { value: 'golden-hour', label: '골든아워' },
    { value: 'blue-hour', label: '블루아워' },
    { value: 'night', label: '야간' },
    { value: 'late-night', label: '심야' },
] as const;

// ===== 환경 - 분위기/효과 =====
export const SNAP_ATMOSPHERE = [
    // 기존 분위기
    { value: 'mist', label: '은은한 박무' },
    { value: 'haze', label: '시네마틱 연무' },
    { value: 'clear', label: '투명한 공기' },
    { value: 'grain', label: '아날로그 입자감' },
    { value: 'rays', label: '웅장한 빛내림' },
    // 렌즈 효과
    { value: 'lens-flare', label: 'Lens Flare' },
    { value: 'raindrops-lens', label: 'Raindrops on Lens' },
    { value: 'motion-blur', label: 'Motion Blur' },
    { value: 'freeze-frame', label: 'Freeze Frame' },
    { value: 'long-exposure', label: 'Long Exposure' },
    { value: 'bokeh', label: 'Bokeh Balls' },
    { value: 'light-leak', label: 'Light Leak' },
    { value: 'vignette', label: '비네팅' },
] as const;

// ===== 환경 - 조명 =====
export const SNAP_LIGHTING = [
    { value: 'natural', label: '자연광' },
    { value: 'neon', label: '네온' },
    { value: 'streetlight', label: '가로등' },
    { value: 'shop-light', label: '상점 불빛' },
    { value: 'car-headlight', label: '차량 헤드라이트' },
    { value: 'mixed', label: '혼합 조명' },
] as const;

// ===== 환경 - 군중 밀도 =====
export const SNAP_CROWD_DENSITY = [
    { value: 'empty', label: '인적 없음' },
    { value: 'sparse', label: '한산함' },
    { value: 'moderate', label: '적당함' },
    { value: 'crowded', label: '붐빔' },
    { value: 'packed', label: '인산인해' },
] as const;

// ===== 환경 - 도시 분위기 (deprecated, keeping for reference) =====
export const SNAP_CITY_VIBES = [
    { value: 'bustling', label: '번화함' },
    { value: 'quiet', label: '한적함' },
    { value: 'desolate', label: '쓸쓸함' },
    { value: 'crowded', label: '복잡함' },
    { value: 'gritty', label: '거칠고 투박함' },
    { value: 'charming', label: '정겨움' },
] as const;

// ===== 스트리트 포토 기법 프리셋 =====
export const STREET_PHOTO_PRESETS = [
    { value: 'panning', label: 'Panning Shot', shutter: '1/30', iso: '400', aperture: '', description: '모션 블러' },
    { value: 'light-trails', label: 'Light Trails', shutter: '2', iso: '100', aperture: '', description: '광궤적' },
    { value: 'ghost-crowd', label: 'Ghost Crowd', shutter: '4', iso: '100', aperture: '', description: '군중 유령' },
    { value: 'high-iso', label: 'High ISO Grain', shutter: '1/125', iso: '3200', aperture: '', description: '필름 그레인' },
    { value: 'zone-focus', label: 'Zone Focus', shutter: '', iso: '', aperture: 'f/8', description: '하이퍼포컬' },
] as const;

// ===== 구도 옵션 (스냅용 간소화) =====
export const SNAP_FRAMING_OPTIONS = [
    { value: 'close-up', label: '클로즈업' },
    { value: 'bust-shot', label: '바스트샷' },
    { value: 'waist-shot', label: '웨이스트샷' },
    { value: 'full-shot', label: '풀샷' },
    { value: 'wide-shot', label: '와이드샷' },
] as const;

// ===== 앵글 옵션 (스냅용 간소화) =====
export const SNAP_ANGLE_OPTIONS = [
    { value: 'eye_level', label: '아이레벨' },
    { value: 'high_angle', label: '하이앵글' },
    { value: 'low_angle', label: '로우앵글' },
    { value: 'birds_eye', label: '버즈아이' },
    { value: 'worms_eye', label: '웜즈아이' },
] as const;
