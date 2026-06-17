import type { Metadata } from 'next'

import { TestAuthGate } from './_components/TestAuthGate/TestAuthGate'
import { QuizSection } from './_components/QuizSection/QuizSection'

export const metadata: Metadata = {
  title: '여행 성향 테스트 | TravelMaker',
  description: '나에게 맞는 여행 스타일을 찾아보세요.',
}

export default function TestPage() {
  return (
    <TestAuthGate>
      <QuizSection />
    </TestAuthGate>
  )
}
