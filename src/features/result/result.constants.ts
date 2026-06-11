import {
  BookOpen,
  Building2,
  Camera,
  Coffee,
  Footprints,
  HeartHandshake,
  Landmark,
  Leaf,
  Map,
  MapPin,
  Megaphone,
  MessageCircle,
  Moon,
  Mountain,
  PartyPopper,
  Route,
  ShoppingBag,
  Sparkles,
  Sunset,
  Target,
  TreePine,
  UtensilsCrossed,
  Utensils,
  Waves,
  Wind,
  Zap,
} from 'lucide-react'

import type { TypeKey } from './quizCalculator'
import type { CompassTrait } from './result.types'

export type TravelTypeStaticData = {
  typeCode: string
  name: string
  nameEn: string
  imageSrc: string
  tags: [string, string, string]
  traits: [CompassTrait, CompassTrait, CompassTrait, CompassTrait]
}

/**
 * type_key 결정 축 순서: 활동성(t/f) + 사교성(t/f) + 공간지향(t/f)
 * - t = 정규화 점수 ≥ 0.5
 * - f = 정규화 점수 < 0.5
 */
export const TRAVEL_TYPE_MAP: Record<TypeKey, TravelTypeStaticData> = {
  ttt: {
    typeCode: 'lone-wolf',
    name: '새벽을 달리는 늑대',
    nameEn: 'LONE WOLF',
    imageSrc: '/images/types/wolf.png',
    tags: ['액티비티형', '혼자형', '자연형'],
    traits: [
      {
        icon: Mountain,
        title: '자연 속 도전',
        description:
          '트레킹, 클라이밍 등 자연에서 몸으로 부딪히는 활동을 즐깁니다.',
      },
      {
        icon: Map,
        title: '혼자만의 루트',
        description:
          '자신만의 페이스로 루트를 개척하며 자유로운 여행을 즐깁니다.',
      },
      {
        icon: Zap,
        title: '새벽 출발',
        description: '이른 아침부터 움직여 누구보다 많은 것을 경험합니다.',
      },
      {
        icon: Leaf,
        title: '자연 충전',
        description: '도시 소음 대신 자연의 소리에서 에너지를 충전합니다.',
      },
    ],
  },
  ttf: {
    typeCode: 'street-fox',
    name: '골목을 가르는 여우',
    nameEn: 'STREET FOX',
    imageSrc: '/images/types/fox.png',
    tags: ['액티비티형', '혼자형', '도시형'],
    traits: [
      {
        icon: Building2,
        title: '도시 탐험가',
        description: '골목골목을 누비며 숨겨진 핫플을 발굴하는 것을 즐깁니다.',
      },
      {
        icon: Target,
        title: '날카로운 감각',
        description: '혼자서도 계획적으로 도시의 정수를 빠르게 파악합니다.',
      },
      {
        icon: Footprints,
        title: '걷기의 달인',
        description: '대중교통보다 걸어서 도시를 직접 느끼는 것을 선호합니다.',
      },
      {
        icon: MapPin,
        title: '로컬 맛집 발굴',
        description:
          '현지인들이 즐겨 찾는 숨은 맛집을 찾아내는 능력이 있습니다.',
      },
    ],
  },
  tft: {
    typeCode: 'wild-goose',
    name: '파도를 헤치는 기러기',
    nameEn: 'WILD GOOSE',
    imageSrc: '/images/types/goose.png',
    tags: ['액티비티형', '단체형', '자연형'],
    traits: [
      {
        icon: Waves,
        title: '단체 액티비티',
        description:
          '친구들과 함께하는 서핑, 래프팅 등 역동적인 활동을 즐깁니다.',
      },
      {
        icon: Wind,
        title: '자연의 에너지',
        description:
          '바다, 산, 강 등 자연 속에서 일행과 함께 활력을 충전합니다.',
      },
      {
        icon: Megaphone,
        title: '분위기 메이커',
        description: '여행 그룹의 에너지를 끌어올리는 핵심 역할을 담당합니다.',
      },
      {
        icon: PartyPopper,
        title: '현지 축제 참여',
        description:
          '로컬 이벤트나 축제에서 현지인들과 어우러지는 것을 좋아합니다.',
      },
    ],
  },
  tff: {
    typeCode: 'city-swallow',
    name: '도시를 누비는 제비',
    nameEn: 'CITY SWALLOW',
    imageSrc: '/images/types/swallow.png',
    tags: ['액티비티형', '단체형', '도시형'],
    traits: [
      {
        icon: PartyPopper,
        title: '핫플 정복',
        description: '친구들과 함께 트렌디한 팝업과 핫플을 빠르게 정복합니다.',
      },
      {
        icon: UtensilsCrossed,
        title: '맛집 원정대',
        description: '유명 맛집을 찾아 일행과 함께 즐기는 것을 좋아합니다.',
      },
      {
        icon: ShoppingBag,
        title: '쇼핑 탐험',
        description: '로컬 마켓부터 편집숍까지 다양한 쇼핑을 즐깁니다.',
      },
      {
        icon: Camera,
        title: '인생샷 수집',
        description:
          '도시의 감각적인 공간에서 멋진 사진을 남기는 것을 즐깁니다.',
      },
    ],
  },
  ftt: {
    typeCode: 'sunset-deer',
    name: '노을을 기다리는 사슴',
    nameEn: 'SUNSET DEER',
    imageSrc: '/images/types/deer.png',
    tags: ['힐링형', '혼자형', '자연형'],
    traits: [
      {
        icon: Sunset,
        title: '노을 감상가',
        description: '혼자 자연 속에서 노을을 바라보며 깊은 사색을 즐깁니다.',
      },
      {
        icon: Leaf,
        title: '느린 여행',
        description:
          '서두르지 않고 자연의 속도에 맞춰 천천히 여행을 음미합니다.',
      },
      {
        icon: BookOpen,
        title: '고즈넉한 탐방',
        description: '한적한 문화유산이나 자연 명소를 혼자 조용히 둘러봅니다.',
      },
      {
        icon: TreePine,
        title: '자연 치유',
        description:
          '숲과 바람, 물소리 속에서 일상의 피로를 완전히 풀어냅니다.',
      },
    ],
  },
  ftf: {
    typeCode: 'moonlight-cat',
    name: '달빛 아래 걷는 고양이',
    nameEn: 'MOONLIGHT CAT',
    imageSrc: '/images/types/cat.png',
    tags: ['힐링형', '혼자형', '도시형'],
    traits: [
      {
        icon: Moon,
        title: '도시의 감성',
        description:
          '골목길 카페, 야경, 거리 예술 등 도시 고유의 감성을 즐깁니다.',
      },
      {
        icon: Footprints,
        title: '혼자만의 속도',
        description: '타인의 페이스에 맞추기보다 자신만의 리듬으로 여행합니다.',
      },
      {
        icon: Map,
        title: '목적적인 여행',
        description:
          '여행 전 충분히 조사하고 계획을 세워 알찬 일정을 만듭니다.',
      },
      {
        icon: Sparkles,
        title: '특별한 경험',
        description:
          '유명 관광지보다 숨겨진 명소나 로컬 문화를 탐험하는 것을 좋아합니다.',
      },
    ],
  },
  fft: {
    typeCode: 'riverside-heron',
    name: '강가에 모이는 백로',
    nameEn: 'RIVERSIDE HERON',
    imageSrc: '/images/types/heron.png',
    tags: ['힐링형', '단체형', '자연형'],
    traits: [
      {
        icon: HeartHandshake,
        title: '함께하는 힐링',
        description: '소중한 사람들과 자연 속에서 천천히 쉬는 여행을 즐깁니다.',
      },
      {
        icon: Route,
        title: '여유로운 산책',
        description: '강가나 숲길을 일행과 함께 걸으며 대화를 나눕니다.',
      },
      {
        icon: Landmark,
        title: '전통 마을 탐방',
        description: '고즈넉한 한옥마을이나 전통 문화 공간을 함께 방문합니다.',
      },
      {
        icon: Coffee,
        title: '여유로운 카페',
        description:
          '좋은 뷰의 카페에서 일행과 시간 가는 줄 모르고 이야기를 나눕니다.',
      },
    ],
  },
  fff: {
    typeCode: 'cafe-sparrow',
    name: '카페에 둥지 트는 참새',
    nameEn: 'CAFE SPARROW',
    imageSrc: '/images/types/sparrow.png',
    tags: ['힐링형', '단체형', '도시형'],
    traits: [
      {
        icon: Coffee,
        title: '카페 투어',
        description:
          '감성 카페를 친구들과 함께 찾아다니는 것이 여행의 핵심입니다.',
      },
      {
        icon: Sunset,
        title: '야경과 힐링',
        description: '루프탑이나 해안가에서 야경을 바라보며 여유를 즐깁니다.',
      },
      {
        icon: Utensils,
        title: '맛집 공유',
        description: '맛있는 음식을 일행과 함께 나누며 소소한 행복을 찾습니다.',
      },
      {
        icon: MessageCircle,
        title: '도란도란 대화',
        description:
          '빽빽한 일정보다 느긋하게 이야기 나누는 시간을 소중히 여깁니다.',
      },
    ],
  },
}

/**
 * RadarChart 꼭짓점 순서 (시계방향, 위(N)부터)
 * 0: 활동성   (top)
 * 1: 경험지향 (upper-right)
 * 2: 소비스타일 (lower-right)
 * 3: 공간지향 (bottom)
 * 4: 사교성   (lower-left)
 * 5: 계획성   (upper-left)
 */
export const COMPASS_AXES_CONFIG = [
  {
    subject: '활동성',
    vectorIndex: 0,
    trueBadge: '액티비티형',
    falseBadge: '힐링형',
  },
  {
    subject: '경험지향',
    vectorIndex: 4,
    trueBadge: '문화형',
    falseBadge: '체험형',
  },
  {
    subject: '소비스타일',
    vectorIndex: 5,
    trueBadge: '가성비형',
    falseBadge: '럭셔리형',
  },
  {
    subject: '공간지향',
    vectorIndex: 3,
    trueBadge: '자연형',
    falseBadge: '도시형',
  },
  {
    subject: '사교성',
    vectorIndex: 2,
    trueBadge: '혼자형',
    falseBadge: '단체형',
  },
  {
    subject: '계획성',
    vectorIndex: 1,
    trueBadge: '계획형',
    falseBadge: '즉흥형',
  },
] as const

/** type_key → 1-based 순서 인덱스 */
export const TYPE_KEY_ORDER: Record<TypeKey, number> = {
  ttt: 1,
  ttf: 2,
  tft: 3,
  tff: 4,
  ftt: 5,
  ftf: 6,
  fft: 7,
  fff: 8,
}
