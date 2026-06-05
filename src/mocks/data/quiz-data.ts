import type { QuizQuestion } from '@/features/test/quiz.types'

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: '여행 스타일은?',
    choiceA: {
      label: '글램핑 독채',
      description: '자연 속 프라이빗 공간',
      imageSrc: '/images/quiz/q1-a.jpg',
      imageAlt: '글램핑 독채',
    },
    choiceB: {
      label: '시티 호텔',
      description: '도심의 세련된 숙박',
      imageSrc: '/images/quiz/q1-b.jpg',
      imageAlt: '시티 호텔',
    },
  },
  {
    id: 2,
    question: '여행 예산 관리는?',
    choiceA: {
      label: '항목별 예산표',
      description: '꼼꼼하게 계획하고 관리',
      imageSrc: '/images/quiz/q2-a.jpg',
      imageAlt: '항목별 예산표',
    },
    choiceB: {
      label: '그냥 카드 긁기',
      description: '쓰고 싶을 때 쓰는 스타일',
      imageSrc: '/images/quiz/q2-b.jpg',
      imageAlt: '그냥 카드 긁기',
    },
  },
  {
    id: 3,
    question: '여행 아침은?',
    choiceA: {
      label: '일찍 루트대로 출발',
      description: '일정대로 알차게 시작',
      imageSrc: '/images/quiz/q3-a.jpg',
      imageAlt: '일찍 일정대로',
    },
    choiceB: {
      label: '알람 없이 뒹굴',
      description: '늦잠 자고 느긋하게',
      imageSrc: '/images/quiz/q3-b.jpg',
      imageAlt: '알람 없이 뒹굴기',
    },
  },
  {
    id: 4,
    question: '여행지 선택 기준은?',
    choiceA: {
      label: '자연 트레킹 코스',
      description: '자연을 걸으며 힐링',
      imageSrc: '/images/quiz/q4-a.jpg',
      imageAlt: '자연 트레킹 코스',
    },
    choiceB: {
      label: '도심 핫스팟 투어',
      description: '도시의 핫플레이스 탐방',
      imageSrc: '/images/quiz/q4-b.jpg',
      imageAlt: '도심 핫스팟 투어',
    },
  },
  {
    id: 5,
    question: '목적지 도착! 첫 행동은?',
    choiceA: {
      label: '바로 첫 스팟 출발',
      description: '짐 던지고 바로 나가기',
      imageSrc: '/images/quiz/q5-a.jpg',
      imageAlt: '바로 첫 스팟 출발',
    },
    choiceB: {
      label: '카페에서 계획 세우기',
      description: '여유롭게 커피 한 잔 후 시작',
      imageSrc: '/images/quiz/q5-b.jpg',
      imageAlt: '카페에서 계획 세우기',
    },
  },
  {
    id: 6,
    question: '자유 시간엔?',
    choiceA: {
      label: '혼자 골목 산책',
      description: '나만의 취향대로 자유롭게',
      imageSrc: '/images/quiz/q6-a.jpg',
      imageAlt: '혼자 골라 즐기기',
    },
    choiceB: {
      label: '다같이 액티비티',
      description: '모두 함께 신나는 활동',
      imageSrc: '/images/quiz/q6-b.jpg',
      imageAlt: '다같이 액티비티',
    },
  },
  {
    id: 7,
    question: '여행 하이라이트는?',
    choiceA: {
      label: '서핑·트레킹',
      description: '몸으로 느끼는 짜릿한 경험',
      imageSrc: '/images/quiz/q7-a.jpg',
      imageAlt: '서핑 트레킹',
    },
    choiceB: {
      label: '미술관·공연',
      description: '문화와 예술로 채우는 시간',
      imageSrc: '/images/quiz/q7-b.jpg',
      imageAlt: '미술관 공연',
    },
  },
  {
    id: 8,
    question: '현지 맛집 발견!',
    choiceA: {
      label: '혼자 조용히',
      description: '혼밥으로 집중해서 음미',
      imageSrc: '/images/quiz/q8-a.jpg',
      imageAlt: '혼자 조용히',
    },
    choiceB: {
      label: '다같이 우르르',
      description: '모두 함께 왁자지껄하게',
      imageSrc: '/images/quiz/q8-b.jpg',
      imageAlt: '다같이 우르르',
    },
  },
  {
    id: 9,
    question: '하루 완전 자유!',
    choiceA: {
      label: '국립공원 트레킹',
      description: '대자연 속에서 하루 종일',
      imageSrc: '/images/quiz/q9-a.jpg',
      imageAlt: '국립공원 트레킹',
    },
    choiceB: {
      label: '갤러리·파인다이닝',
      description: '감성 충전 후 고급 식사',
      imageSrc: '/images/quiz/q9-b.jpg',
      imageAlt: '갤러리 파인다이닝',
    },
  },
  {
    id: 10,
    question: '여행의 클라이맥스는?',
    choiceA: {
      label: '로컬 축제·시장',
      description: '현지 문화에 흠뻑 빠지기',
      imageSrc: '/images/quiz/q10-a.jpg',
      imageAlt: '로컬 축제 시장',
    },
    choiceB: {
      label: '럭셔리 풀빌라',
      description: '최고급 리조트에서 여유롭게',
      imageSrc: '/images/quiz/q10-b.jpg',
      imageAlt: '럭셔리 풀빌라',
    },
  },
  {
    id: 11,
    question: '낯선 도시에선?',
    choiceA: {
      label: '미리 공부하고 감상',
      description: '역사·배경 알고 즐기는 편',
      imageSrc: '/images/quiz/q11-a.jpg',
      imageAlt: '미리 공부하고 감상',
    },
    choiceB: {
      label: '그냥 가서 느끼기',
      description: '아무것도 모르고 직접 체험',
      imageSrc: '/images/quiz/q11-b.jpg',
      imageAlt: '그냥 가서 느끼기',
    },
  },
  {
    id: 12,
    question: '여행 마지막 밤은?',
    choiceA: {
      label: '혼자 해변 노을',
      description: '조용히 혼자 마무리',
      imageSrc: '/images/quiz/q12-a.jpg',
      imageAlt: '혼자 해변 노을',
    },
    choiceB: {
      label: '루프탑 바 칵테일',
      description: '신나게 마지막 밤을 불태우기',
      imageSrc: '/images/quiz/q12-b.jpg',
      imageAlt: '루프탑 바 칵테일',
    },
  },
]

export const TOTAL_QUESTIONS = quizQuestions.length
