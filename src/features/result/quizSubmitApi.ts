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

export const getSharedQuizResult = async (
  typeKey: string,
  vector: string
): Promise<QuizSubmitResponse> => {
  const response = await api.get<QuizSubmitResponse>('/quiz/result/shared', {
    params: { type_key: typeKey, vector },
  })
  return response.data
}
