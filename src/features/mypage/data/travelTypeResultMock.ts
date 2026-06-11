import type { TravelTypeResultResponse } from '../api/travelTypeResultApi'

export const mockTravelTypeResultResponse: TravelTypeResultResponse = {
  saved: true,
  travel_type_id: 4,
  type_key: 'SEA-AF',
  name: '자유로운 바다 탐험가',
  description:
    '계획보다는 즉흥, 도시보다는 자연, 혼자만의 시간을 사랑하며 바다 앞에서 가장 큰 충전을 얻는 타입이에요.',
  image_url: '',
  type_tags: ['액티비티형', '혼자형', '자연형', '바다', '즉흥여행', '사진찍기'],
  detail_cards: [
    {
      title: '여행 리듬',
      description: '빽빽한 일정 대신 여백이 있는 동선을 선호해요.',
    },
    {
      title: '좋아하는 장소',
      description: '시야가 트인 바다, 산책로, 조용한 전망대를 좋아해요.',
    },
    {
      title: '동행 스타일',
      description: '함께하더라도 각자의 시간을 존중하는 여행에 잘 맞아요.',
    },
    {
      title: '추천 포인트',
      description: '일출과 노을을 볼 수 있는 코스를 넣으면 만족도가 높아요.',
    },
  ],
  result_vector: [
    { label: '액티비티형', value: 88 },
    { label: '혼자형', value: 76 },
    { label: '자연형', value: 82 },
    { label: '바다 선호', value: 91 },
  ],
  destinations: [
    {
      place_id: 126508,
      place_name: '부산',
      description: '바다와 도시 산책을 함께 즐길 수 있는 여행지',
      image_url: '',
      tags: ['바다', '도시'],
      match_rate: 95,
    },
    {
      place_id: 125895,
      place_name: '제주',
      description: '즉흥 드라이브와 자연 풍경이 잘 어울리는 섬',
      image_url: '',
      tags: ['자연', '드라이브'],
      match_rate: 91,
    },
    {
      place_id: 126126,
      place_name: '강릉',
      description: '느긋한 바다 산책과 카페 투어를 즐기기 좋은 곳',
      image_url: '',
      tags: ['바다', '휴식'],
      match_rate: 87,
    },
    {
      place_id: 127394,
      place_name: '여수',
      description: '밤바다와 전망을 함께 담기 좋은 항구 도시',
      image_url: '',
      tags: ['야경', '바다'],
    },
  ],
  updated_at: '2026-05-21T09:00:00.000Z',
  answered_count: 12,
}
