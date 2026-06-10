import { create } from 'zustand'

import {
  calculateResultVector,
  getTypeKey,
  type TypeKey,
} from '@/features/result/quizCalculator'
import type { QuizSubmitResponse } from '@/features/result/quizSubmit.types'
import type { QuizAnswer } from '@/features/test/quiz.types'

type QuizStore = {
  currentIndex: number
  answers: QuizAnswer[]
  selectedChoice: 'A' | 'B' | null
  /** 6축 정규화 점수 (0.0~1.0). 퀴즈 완료 후 계산되어 저장됨 */
  resultVector: number[] | null
  /** 활동성×사교성×공간지향 기반 타입 키 (예: 'ftf'). 퀴즈 완료 후 저장됨 */
  typeKey: TypeKey | null
  /** API 응답 결과. 성공 시 저장됨 */
  apiResult: QuizSubmitResponse | null
  selectChoice: (choice: 'A' | 'B') => void
  goNext: (questionId: number, totalQuestions: number) => void
  goPrev: () => void
  resetQuiz: () => void
  /** 퀴즈 완료 시 answers로 result_vector와 type_key를 계산해 저장한다 */
  setCalculatedResult: (answers: QuizAnswer[]) => void
  setApiResult: (result: QuizSubmitResponse) => void
}

export const useQuizStore = create<QuizStore>((set) => ({
  currentIndex: 0,
  answers: [],
  selectedChoice: null,
  resultVector: null,
  typeKey: null,
  apiResult: null,

  selectChoice: (choice) => set({ selectedChoice: choice }),

  goNext: (questionId, totalQuestions) =>
    set((state) => {
      if (state.selectedChoice === null) return state

      const existingIndex = state.answers.findIndex(
        (a) => a.questionId === questionId
      )
      const newAnswer: QuizAnswer = {
        questionId,
        selected: state.selectedChoice,
      }
      const updatedAnswers =
        existingIndex >= 0
          ? state.answers.map((a, i) => (i === existingIndex ? newAnswer : a))
          : [...state.answers, newAnswer]

      const nextIndex = state.currentIndex + 1
      const isLast = nextIndex >= totalQuestions

      return {
        answers: updatedAnswers,
        currentIndex: isLast ? state.currentIndex : nextIndex,
        selectedChoice: isLast
          ? state.selectedChoice
          : (state.answers.find((a) => a.questionId === questionId + 1)
              ?.selected ?? null),
      }
    }),

  goPrev: () =>
    set((state) => {
      if (state.currentIndex <= 0) return state
      const prevIndex = state.currentIndex - 1
      const prevAnswer = state.answers.find(
        (a) => a.questionId === prevIndex + 1
      )
      return {
        currentIndex: prevIndex,
        selectedChoice: prevAnswer?.selected ?? null,
      }
    }),

  resetQuiz: () =>
    set({
      currentIndex: 0,
      answers: [],
      selectedChoice: null,
      resultVector: null,
      typeKey: null,
      apiResult: null,
    }),

  setCalculatedResult: (answers) => {
    const vector = calculateResultVector(answers)
    const key = getTypeKey(vector)
    set({ resultVector: vector, typeKey: key })
  },

  setApiResult: (result) => set({ apiResult: result }),
}))
