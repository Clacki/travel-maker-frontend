export type QuizChoice = {
  label: string
  description: string
  imageSrc: string
  imageAlt: string
}

export type QuizQuestion = {
  id: number
  question: string
  choiceA: QuizChoice
  choiceB: QuizChoice
}

export type QuizAnswer = {
  questionId: number
  selected: 'A' | 'B'
}
