export interface TravelCategory {
  id: string
  name: string
  description: string
  image: string
  subTags: SubTag[]
  destinations: Destination[]
}

export interface SubTag {
  id: string
  name: string
  icon: string
}

export interface Destination {
  id: string
  name: string
  location: string
  description: string
  image: string
  rating: number
  tags: string[]
}

export const travelCategories: TravelCategory[] = [
  {
    id: 'beach',
    name: '해변 휴양',
    description: '푸른 바다와 하얀 모래사장에서의 힐링',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
    subTags: [
      { id: 'sunset', name: '선셋 뷰', icon: '🌅' },
      { id: 'snorkeling', name: '스노클링', icon: '🤿' },
      { id: 'resort', name: '리조트', icon: '🏨' },
      { id: 'surfing', name: '서핑', icon: '🏄' },
      { id: 'island', name: '섬 여행', icon: '🏝️' },
    ],
    destinations: [
      {
        id: 'maldives',
        name: '몰디브',
        location: '인도양',
        description: '수상 빌라와 산호초가 아름다운 천국의 섬',
        image:
          'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&h=400&fit=crop',
        rating: 4.9,
        tags: ['sunset', 'snorkeling', 'resort'],
      },
      {
        id: 'bali',
        name: '발리',
        location: '인도네시아',
        description: '서핑과 문화가 공존하는 신들의 섬',
        image:
          'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop',
        rating: 4.7,
        tags: ['surfing', 'sunset', 'resort'],
      },
      {
        id: 'jeju',
        name: '제주도',
        location: '대한민국',
        description: '아름다운 자연과 독특한 문화의 보물섬',
        image:
          'https://images.unsplash.com/photo-1596795580386-b86e1b3f0569?w=600&h=400&fit=crop',
        rating: 4.6,
        tags: ['island', 'sunset', 'snorkeling'],
      },
      {
        id: 'phuket',
        name: '푸켓',
        location: '태국',
        description: '태국 최대의 섬, 다양한 해변과 나이트라이프',
        image:
          'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=600&h=400&fit=crop',
        rating: 4.5,
        tags: ['resort', 'snorkeling', 'island'],
      },
    ],
  },
  {
    id: 'mountain',
    name: '산악 탐험',
    description: '웅장한 산맥과 자연 속 모험',
    image:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop',
    subTags: [
      { id: 'hiking', name: '등산', icon: '🥾' },
      { id: 'camping', name: '캠핑', icon: '⛺' },
      { id: 'skiing', name: '스키', icon: '⛷️' },
      { id: 'nature', name: '자연경관', icon: '🌲' },
      { id: 'wildlife', name: '야생동물', icon: '🦌' },
    ],
    destinations: [
      {
        id: 'swiss-alps',
        name: '스위스 알프스',
        location: '스위스',
        description: '유럽의 지붕, 설산과 초원의 조화',
        image:
          'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&h=400&fit=crop',
        rating: 4.9,
        tags: ['skiing', 'hiking', 'nature'],
      },
      {
        id: 'seoraksan',
        name: '설악산',
        location: '대한민국',
        description: '사계절 아름다운 한국의 명산',
        image:
          'https://images.unsplash.com/photo-1598953432500-60b0ebb86ad1?w=600&h=400&fit=crop',
        rating: 4.7,
        tags: ['hiking', 'nature', 'wildlife'],
      },
      {
        id: 'patagonia',
        name: '파타고니아',
        location: '아르헨티나/칠레',
        description: '세계의 끝, 야생 그대로의 대자연',
        image:
          'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=400&fit=crop',
        rating: 4.8,
        tags: ['camping', 'hiking', 'wildlife'],
      },
      {
        id: 'fuji',
        name: '후지산',
        location: '일본',
        description: '일본의 상징, 신성한 영산',
        image:
          'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=600&h=400&fit=crop',
        rating: 4.6,
        tags: ['hiking', 'nature', 'camping'],
      },
    ],
  },
  {
    id: 'city',
    name: '도시 탐방',
    description: '세계 각국의 문화와 건축을 만나다',
    image:
      'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=600&fit=crop',
    subTags: [
      { id: 'architecture', name: '건축물', icon: '🏛️' },
      { id: 'shopping', name: '쇼핑', icon: '🛍️' },
      { id: 'nightlife', name: '나이트라이프', icon: '🌃' },
      { id: 'museum', name: '박물관', icon: '🏛️' },
      { id: 'street-food', name: '길거리 음식', icon: '🍜' },
    ],
    destinations: [
      {
        id: 'paris',
        name: '파리',
        location: '프랑스',
        description: '예술과 낭만의 도시, 빛의 도시',
        image:
          'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop',
        rating: 4.8,
        tags: ['architecture', 'museum', 'shopping'],
      },
      {
        id: 'tokyo',
        name: '도쿄',
        location: '일본',
        description: '전통과 현대가 공존하는 메가시티',
        image:
          'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop',
        rating: 4.7,
        tags: ['shopping', 'street-food', 'nightlife'],
      },
      {
        id: 'newyork',
        name: '뉴욕',
        location: '미국',
        description: '세계의 중심, 꿈의 도시',
        image:
          'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop',
        rating: 4.8,
        tags: ['architecture', 'museum', 'nightlife'],
      },
      {
        id: 'seoul',
        name: '서울',
        location: '대한민국',
        description: 'K-컬처의 심장, 역동적인 수도',
        image:
          'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=600&h=400&fit=crop',
        rating: 4.6,
        tags: ['shopping', 'street-food', 'nightlife'],
      },
    ],
  },
  {
    id: 'culture',
    name: '문화 체험',
    description: '역사와 전통을 깊이 느끼는 여행',
    image:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
    subTags: [
      { id: 'temple', name: '사원/신전', icon: '⛩️' },
      { id: 'festival', name: '축제', icon: '🎊' },
      { id: 'heritage', name: '세계유산', icon: '🏰' },
      { id: 'traditional', name: '전통마을', icon: '🏘️' },
      { id: 'art', name: '예술', icon: '🎨' },
    ],
    destinations: [
      {
        id: 'kyoto',
        name: '교토',
        location: '일본',
        description: '천년 고도, 일본 전통문화의 보고',
        image:
          'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop',
        rating: 4.9,
        tags: ['temple', 'heritage', 'traditional'],
      },
      {
        id: 'rome',
        name: '로마',
        location: '이탈리아',
        description: '영원한 도시, 서양 문명의 요람',
        image:
          'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&h=400&fit=crop',
        rating: 4.8,
        tags: ['heritage', 'art', 'architecture'],
      },
      {
        id: 'angkor',
        name: '앙코르와트',
        location: '캄보디아',
        description: '크메르 제국의 영광, 신비로운 사원',
        image:
          'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=600&h=400&fit=crop',
        rating: 4.8,
        tags: ['temple', 'heritage', 'art'],
      },
      {
        id: 'gyeongju',
        name: '경주',
        location: '대한민국',
        description: '신라 천년의 역사가 숨쉬는 도시',
        image:
          'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=600&h=400&fit=crop',
        rating: 4.6,
        tags: ['heritage', 'temple', 'traditional'],
      },
    ],
  },
  {
    id: 'food',
    name: '미식 여행',
    description: '세계의 맛을 탐험하는 여정',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
    subTags: [
      { id: 'fine-dining', name: '파인 다이닝', icon: '🍽️' },
      { id: 'local-food', name: '로컬 맛집', icon: '🍲' },
      { id: 'wine', name: '와인/술', icon: '🍷' },
      { id: 'market', name: '시장 투어', icon: '🛒' },
      { id: 'cooking', name: '쿠킹 클래스', icon: '👨‍🍳' },
    ],
    destinations: [
      {
        id: 'bangkok',
        name: '방콕',
        location: '태국',
        description: '길거리 음식의 천국, 향신료의 마법',
        image:
          'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=600&h=400&fit=crop',
        rating: 4.7,
        tags: ['local-food', 'market', 'cooking'],
      },
      {
        id: 'florence',
        name: '피렌체',
        location: '이탈리아',
        description: '토스카나의 맛, 와인과 올리브오일',
        image:
          'https://images.unsplash.com/photo-1543429257-3eb4deabeeaf?w=600&h=400&fit=crop',
        rating: 4.8,
        tags: ['fine-dining', 'wine', 'cooking'],
      },
      {
        id: 'osaka',
        name: '오사카',
        location: '일본',
        description: '일본의 부엌, 타코야키와 오코노미야키',
        image:
          'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=600&h=400&fit=crop',
        rating: 4.7,
        tags: ['local-food', 'market', 'cooking'],
      },
      {
        id: 'jeonju',
        name: '전주',
        location: '대한민국',
        description: '한식의 본고장, 비빔밥과 한정식',
        image:
          'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=600&h=400&fit=crop',
        rating: 4.6,
        tags: ['local-food', 'traditional', 'market'],
      },
    ],
  },
  {
    id: 'adventure',
    name: '액티비티',
    description: '짜릿한 모험과 스릴을 즐기다',
    image:
      'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=600&fit=crop',
    subTags: [
      { id: 'diving', name: '다이빙', icon: '🤿' },
      { id: 'bungee', name: '번지점프', icon: '🪂' },
      { id: 'rafting', name: '래프팅', icon: '🚣' },
      { id: 'paragliding', name: '패러글라이딩', icon: '🪂' },
      { id: 'safari', name: '사파리', icon: '🦁' },
    ],
    destinations: [
      {
        id: 'queenstown',
        name: '퀸즈타운',
        location: '뉴질랜드',
        description: '어드벤처의 수도, 익스트림 스포츠 천국',
        image:
          'https://images.unsplash.com/photo-1589871973318-9ca1258faa5d?w=600&h=400&fit=crop',
        rating: 4.9,
        tags: ['bungee', 'paragliding', 'rafting'],
      },
      {
        id: 'cairns',
        name: '케언스',
        location: '호주',
        description: '그레이트 배리어 리프의 관문',
        image:
          'https://images.unsplash.com/photo-1587139223877-04cb899fa3e8?w=600&h=400&fit=crop',
        rating: 4.8,
        tags: ['diving', 'rafting', 'safari'],
      },
      {
        id: 'kenya',
        name: '마사이마라',
        location: '케냐',
        description: '아프리카 대초원의 야생 사파리',
        image:
          'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&h=400&fit=crop',
        rating: 4.8,
        tags: ['safari', 'nature', 'wildlife'],
      },
      {
        id: 'yangyang',
        name: '양양',
        location: '대한민국',
        description: '서핑과 패러글라이딩의 성지',
        image:
          'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&h=400&fit=crop',
        rating: 4.5,
        tags: ['paragliding', 'surfing', 'diving'],
      },
    ],
  },
  {
    id: 'romantic',
    name: '로맨틱 여행',
    description: '사랑하는 사람과 함께하는 특별한 순간',
    image:
      'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=800&h=600&fit=crop',
    subTags: [
      { id: 'honeymoon', name: '허니문', icon: '💕' },
      { id: 'proposal', name: '프로포즈', icon: '💍' },
      { id: 'couple-spa', name: '커플 스파', icon: '🧖' },
      { id: 'dinner', name: '로맨틱 디너', icon: '🕯️' },
      { id: 'cruise', name: '크루즈', icon: '🚢' },
    ],
    destinations: [
      {
        id: 'santorini',
        name: '산토리니',
        location: '그리스',
        description: '에게해의 보석, 화이트와 블루의 향연',
        image:
          'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&h=400&fit=crop',
        rating: 4.9,
        tags: ['honeymoon', 'proposal', 'dinner'],
      },
      {
        id: 'venice',
        name: '베니스',
        location: '이탈리아',
        description: '물의 도시, 곤돌라와 함께하는 로맨스',
        image:
          'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=600&h=400&fit=crop',
        rating: 4.8,
        tags: ['proposal', 'dinner', 'cruise'],
      },
      {
        id: 'tahiti',
        name: '타히티',
        location: '프랑스령 폴리네시아',
        description: '지상 낙원, 수상 방갈로의 로맨스',
        image:
          'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=600&h=400&fit=crop',
        rating: 4.9,
        tags: ['honeymoon', 'couple-spa', 'cruise'],
      },
      {
        id: 'nami',
        name: '남이섬',
        location: '대한민국',
        description: '겨울연가의 배경, 낭만적인 메타세콰이어 길',
        image:
          'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=600&h=400&fit=crop',
        rating: 4.5,
        tags: ['proposal', 'dinner', 'nature'],
      },
    ],
  },
]

export function getCategoryById(id: string): TravelCategory | undefined {
  return travelCategories.find((category) => category.id === id)
}

export function filterDestinationsByTags(
  destinations: Destination[],
  selectedTags: string[]
): Destination[] {
  if (selectedTags.length === 0) return destinations
  return destinations.filter((destination) =>
    selectedTags.some((tag) => destination.tags.includes(tag))
  )
}
