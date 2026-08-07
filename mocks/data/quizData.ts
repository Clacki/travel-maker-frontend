import type { QuizSubmitResponse } from '@/features/result/quizSubmit.types'
import { DEMO_PLACE_IMAGES } from './imageData'

export const demoQuizResult: QuizSubmitResponse = {
  saved: true,
  travel_type_id: 4,
  type_key: 'tff',
  name: '도시를 누비는 제비',
  description: '새로운 골목과 문화 공간을 가볍게 발견하는 여행자입니다.',
  image_url: '/images/types/swallow.png',
  type_tags: ['도시 탐방', '문화 공간', '즉흥 산책'],
  result_vector: [
    { label: '액티비티형', value: 82 },
    { label: '문화형', value: 76 },
    { label: '가성비형', value: 68 },
    { label: '도시형', value: 78 },
    { label: '혼자형', value: 64 },
    { label: '즉흥형', value: 70 },
  ],
  accuracy: 91,
  detail_cards: [
    {
      title: '골목 발견',
      description: '잘 알려지지 않은 골목과 공간을 발견합니다.',
    },
    {
      title: '가벼운 이동',
      description: '한곳에 머무르기보다 리듬 있게 움직입니다.',
    },
    {
      title: '문화 취향',
      description: '전시와 지역 문화를 여행에 자연스럽게 담습니다.',
    },
  ],
  destinations: [
    {
      place_id: 2,
      place_name: '경복궁',
      description: '도심 속 역사 산책',
      image_url: DEMO_PLACE_IMAGES[2],
      tags: ['서울', '문화'],
      match_rate: 94,
    },
    {
      place_id: 9,
      place_name: '북촌 한옥마을',
      description: '한옥 골목 탐방',
      image_url: DEMO_PLACE_IMAGES[9],
      tags: ['서울', '골목'],
      match_rate: 89,
    },
  ],
  compatible_type: null,
  incompatible_type: null,
}
