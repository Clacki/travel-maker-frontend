import type { GetPlacesFilterParams } from './types/places.types'

export const ITEMS_PER_PAGE = 12

export type SortKey = 'popular' | 'bookmarks' | 'reviews' | 'recommended'

export const SORT_LABELS: Record<SortKey, string> = {
  popular: '별점순',
  bookmarks: '북마크순',
  reviews: '리뷰순',
  recommended: '추천순',
}

export const SORT_API_MAP: Record<
  Exclude<SortKey, 'recommended'>,
  Pick<GetPlacesFilterParams, 'sort' | 'order'>
> = {
  popular: { sort: 'rating', order: 'desc' },
  bookmarks: { sort: 'bookmark', order: 'desc' },
  reviews: { sort: 'review', order: 'desc' },
}

export const DEFAULT_BG =
  'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600&h=900&fit=crop'

export const STYLE_TO_CATEGORY: Record<string, string> = {
  beach: 'beach',
  mountain: 'mountain',
  city: 'city',
  culture: 'culture',
  food: 'food',
  activity: 'adventure',
  romantic: 'romantic',
}

export const CATEGORY_TO_TAG_NAME: Record<string, string> = {
  beach: '해변',
  mountain: '산악',
  city: '도시',
  culture: '문화',
  food: '미식',
  adventure: '액티비티',
  romantic: '로맨틱',
}

export const FILTER_TAG_TO_TAG_NAME: Record<string, string> = {
  'beach-coast': '해수욕·해안',
  'water-sports': '수상레저',
  camping: '캠핑·글램핑',
  'mountain-valley': '산·숲·계곡',
  'nature-eco': '자연생태',
  trekking: '자연공원·트레킹',
  landmark: '랜드마크',
  'park-street': '공원·거리',
  shopping: '쇼핑',
  history: '역사·유적',
  museum: '박물관·전시',
  traditional: '전통체험',
  restaurant: '음식점',
  cafe: '카페·디저트',
  market: '시장·먹거리',
  'land-sports': '육상스포츠',
  extreme: '항공·익스트림',
  'theme-park': '테마파크·시설',
  spa: '스파·웰니스',
  resort: '숙박·리조트',
  solo: '혼자',
  couple: '커플',
  family: '가족',
  friends: '친구',
  seoul: '서울',
  gyeonggi: '경기',
  incheon: '인천',
  gangwon: '강원',
  chungbuk: '충북',
  chungnam: '충남',
  daejeon: '대전',
  sejong: '세종',
  jeonbuk: '전북',
  jeonnam: '전남',
  gwangju: '광주',
  gyeongbuk: '경북',
  gyeongnam: '경남',
  daegu: '대구',
  ulsan: '울산',
  busan: '부산',
  jeju: '제주',
  parking: '주차',
  pet: '반려동물',
  free: '무료',
}
