export type FilterTag = {
  id: string
  label: string
  emoji?: string
  variant?: string
}

export type FilterSectionData = {
  id: string
  icon: string
  label: string
  typeLabel: string
  badgeVariant: 'multi' | 'single' | 'bool'
  selectionMode: 'multi' | 'single'
  tags: FilterTag[]
}

export const travelFilterSections: FilterSectionData[] = [
  {
    id: 'style',
    icon: '🗺️',
    label: '여행 스타일',
    typeLabel: '복수 선택',
    badgeVariant: 'multi',
    selectionMode: 'multi',
    tags: [
      { id: 'all', label: '전체', emoji: '🌍' },
      { id: 'beach', label: '해변 휴양', emoji: '🏖️' },
      { id: 'mountain', label: '산악 탐험', emoji: '🏔️' },
      { id: 'city', label: '도시 탐방', emoji: '🏙️' },
      { id: 'culture', label: '문화 체험', emoji: '🎭' },
      { id: 'food', label: '미식 여행', emoji: '🍜' },
      { id: 'activity', label: '액티비티', emoji: '🧗' },
      { id: 'romantic', label: '로맨틱 여행', emoji: '💕' },
    ],
  },
  {
    id: 'theme',
    icon: '🏷️',
    label: '세부 테마',
    typeLabel: '복수 선택',
    badgeVariant: 'multi',
    selectionMode: 'multi',
    tags: [
      { id: 'beach-coast', label: '해수욕·해안' },
      { id: 'water-sports', label: '수상 레저' },
      { id: 'camping', label: '캠핑·글램핑' },
      { id: 'mountain-valley', label: '산·숲·계곡' },
      { id: 'nature-eco', label: '자연생태' },
      { id: 'trekking', label: '자연공원·트레킹' },
      { id: 'landmark', label: '랜드마크' },
      { id: 'park-street', label: '공원·거리' },
      { id: 'shopping', label: '쇼핑' },
      { id: 'history', label: '역사·유적' },
      { id: 'museum', label: '박물관·전시' },
      { id: 'traditional', label: '전통 체험' },
      { id: 'restaurant', label: '음식점' },
      { id: 'cafe', label: '카페·디저트' },
      { id: 'market', label: '시장·먹거리' },
      { id: 'land-sports', label: '육상 스포츠' },
      { id: 'extreme', label: '항공·익스트림' },
      { id: 'theme-park', label: '테마파크·시설' },
      { id: 'spa', label: '스파·웰니스' },
      { id: 'resort', label: '숙박·리조트' },
    ],
  },
  {
    id: 'companion',
    icon: '👥',
    label: '동행',
    typeLabel: '복수 선택',
    badgeVariant: 'multi',
    selectionMode: 'multi',
    tags: [
      { id: 'solo', label: '혼자', emoji: '🙋' },
      { id: 'couple', label: '커플', emoji: '💑' },
      { id: 'family', label: '가족', emoji: '👨‍👩‍👧' },
      { id: 'friends', label: '친구', emoji: '🤝' },
    ],
  },
  {
    id: 'region',
    icon: '📍',
    label: '지역',
    typeLabel: '1개 선택',
    badgeVariant: 'single',
    selectionMode: 'single',
    tags: [
      { id: 'seoul', label: '서울', variant: 'region' },
      { id: 'gyeonggi', label: '경기', variant: 'region' },
      { id: 'incheon', label: '인천', variant: 'region' },
      { id: 'gangwon', label: '강원', variant: 'region' },
      { id: 'chungbuk', label: '충북', variant: 'region' },
      { id: 'chungnam', label: '충남', variant: 'region' },
      { id: 'daejeon', label: '대전', variant: 'region' },
      { id: 'sejong', label: '세종', variant: 'region' },
      { id: 'jeonbuk', label: '전북', variant: 'region' },
      { id: 'jeonnam', label: '전남', variant: 'region' },
      { id: 'gwangju', label: '광주', variant: 'region' },
      { id: 'gyeongbuk', label: '경북', variant: 'region' },
      { id: 'gyeongnam', label: '경남', variant: 'region' },
      { id: 'daegu', label: '대구', variant: 'region' },
      { id: 'ulsan', label: '울산', variant: 'region' },
      { id: 'busan', label: '부산', variant: 'region' },
      { id: 'jeju', label: '제주', variant: 'region' },
    ],
  },
  {
    id: 'facility',
    icon: '🅿️',
    label: '편의시설',
    typeLabel: '복수 선택',
    badgeVariant: 'bool',
    selectionMode: 'multi',
    tags: [
      { id: 'parking', label: '주차 가능', variant: 'toggle' },
      { id: 'pet', label: '반려동물 동반', variant: 'toggle' },
      { id: 'free', label: '무료 입장', variant: 'toggle' },
    ],
  },
]
