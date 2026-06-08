import type { TestResultResponse } from '@/features/result/result.types'

export const mockResultData: TestResultResponse = {
  typeCode: 'moonlight-cat',
  typeName: '달빛 아래 걷는 고양이',
  typeNameEn: 'MOONLIGHT CAT',
  typeLabel: 'TYPE · 06 / 08',
  description:
    '천천히 스며드는 여행을 좋아하는 힐링형 여행자예요. 계획 없이도 혼자 유연하게 움직이는 걸 즐기며 도시의 문화와 에너지에서 영감을 받는 타입이에요. 특별한 체험을 위해서라면 지갑 열기를 주저 않아요.',
  thumbnailSrc: '/thumbnail-default.svg',
  keywords: ['힐링형', '혼자형', '도시형'],
  matchScore: 94,
  typeRank: 1,
  recommendedDestinations: [
    {
      id: 'namhae',
      region: '경상남도',
      title: '남해',
      description: '파란 바다와 초록 언덕이 어우러진 남쪽의 보석.',
      hashtags: ['#바다', '#드라이브', '#힐링'],
    },
    {
      id: 'tongyeong',
      region: '경상남도',
      title: '통영',
      description: '한국의 나폴리라 불리는 항구 도시.',
      hashtags: ['#항구', '#야경', '#해산물', '#케이블카'],
    },
    {
      id: 'jeju-seogwipo',
      region: '제주특별자치도',
      title: '제주 서귀포',
      description: '천지연 폭포와 한라산 남쪽 기슭의 아늑한 도시.',
      hashtags: ['#폭포', '#올레길', '#카페'],
    },
  ],
  allTypes: [
    {
      typeCode: 'lone-camel',
      icon: '🐪',
      title: '새벽을 달리는 낙타',
      subtitle: 'LONE CAMEL',
      description: '액티비티 · 혼자 · 자연',
      isMyType: false,
    },
    {
      typeCode: 'street-fox',
      icon: '🦊',
      title: '골목을 가르는 여우',
      subtitle: 'STREET FOX',
      description: '액티비티 · 혼자 · 도시',
      isMyType: false,
    },
    {
      typeCode: 'wild-goose',
      icon: '🪿',
      title: '파도를 헤치는 기러기',
      subtitle: 'WILD GOOSE',
      description: '액티비티 · 단체 · 자연',
      isMyType: false,
    },
    {
      typeCode: 'city-swallow',
      icon: '🐦',
      title: '도시를 누비는 제비',
      subtitle: 'CITY SWALLOW',
      description: '액티비티 · 단체 · 도시',
      isMyType: false,
    },
    {
      typeCode: 'sunset-deer',
      icon: '🦌',
      title: '노을을 가르치는 사슴',
      subtitle: 'SUNSET DEER',
      description: '힐링 · 혼자 · 자연',
      isMyType: false,
    },
    {
      typeCode: 'moonlight-cat',
      icon: '🐱',
      title: '달빛 아래 걷는 고양이',
      subtitle: 'MOONLIGHT CAT',
      description: '힐링 · 혼자 · 도시',
      isMyType: true,
    },
    {
      typeCode: 'riverside-heron',
      icon: '🦢',
      title: '강가에 모이는 백로',
      subtitle: 'RIVERSIDE HERON',
      description: '힐링 · 단체 · 자연',
      isMyType: false,
    },
    {
      typeCode: 'cafe-sparrow',
      icon: '🐦',
      title: '카페에 둥지 트는 참새',
      subtitle: 'CAFE SPARROW',
      description: '힐링 · 단체 · 도시',
      isMyType: false,
    },
  ],
  compassData: {
    centerEmoji: '🐱',
    centerLabel: '달빛 아래 걷는 고양이',
    axes: [
      { subject: '활동성', badge: '자연형', value: 40 },
      { subject: '경험지향', badge: '단세형', value: 75 },
      { subject: '소비스타일', badge: '계획형', value: 68 },
      { subject: '공간지향', badge: '도시형', value: 82 },
      { subject: '사교성', badge: '혼자형', value: 25 },
      { subject: '계획성', badge: '즉흥형', value: 50 },
    ],
    reading:
      '당신은 도시의 분위기를 사랑하는 독립적인 여행자입니다. 철저한 계획 위에 약간의 여유를 두고, 혼자만의 속도로 여행지를 탐험합니다. 사람들 사이에서도 고요한 자기만의 시간을 찾아내는 능력이 탁월합니다.',
    traits: [
      {
        icon: '🐾',
        title: '혼자만의 속도',
        description: '타인의 페이스에 맞추기보다 자신만의 리듬으로 여행합니다.',
      },
      {
        icon: '🗺️',
        title: '목적적인 여행',
        description:
          '여행 전 충분히 조사하고 계획을 세워 알찬 일정을 만듭니다.',
      },
      {
        icon: '🌃',
        title: '도시의 분위기',
        description:
          '골목길 카페, 야경, 거리 예술 등 도시 고유의 감성을 즐깁니다.',
      },
      {
        icon: '✨',
        title: '특별한 경험을 찾아서',
        description:
          '유명 관광지보다 숨겨진 명소나 로컬 문화를 탐험하는 것을 좋아합니다.',
      },
    ],
  },
}
