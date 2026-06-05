import { create } from 'zustand'

import type { QuizAnswer } from '@/features/test/quiz.types'

type QuizStore = {
  currentIndex: number
  answers: QuizAnswer[]
  selectedChoice: 'A' | 'B' | null
  selectChoice: (choice: 'A' | 'B') => void
  goNext: (questionId: number, totalQuestions: number) => void
  goPrev: () => void
  resetQuiz: () => void
}

export const useQuizStore = create<QuizStore>((set) => ({
  currentIndex: 0,
  answers: [],
  selectedChoice: null,

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
    }),
}))
