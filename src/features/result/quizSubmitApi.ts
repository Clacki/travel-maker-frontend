import api from '@/lib/api'
import type { QuizAnswer } from '@/features/test/quiz.types'
import type { QuizSubmitResponse } from './quizSubmit.types'

export const postQuizSubmit = async (
  answers: QuizAnswer[]
): Promise<QuizSubmitResponse> => {
  const sorted = [...answers].sort((a, b) => a.questionId - b.questionId)
  const payload = { answers: sorted.map((a) => a.selected) }
  const response = await api.post<QuizSubmitResponse>('/quiz/submit', payload)
  return response.data
}
