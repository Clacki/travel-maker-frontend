'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { preload } from 'react-dom'

import { css } from '@/styled-system/css'

import { ROUTES } from '@/constants/routes'
import { quizQuestions, TOTAL_QUESTIONS } from '@/mocks/data/quiz-data'
import { useQuizStore } from '@/store/quizStore'

import { ProgressBar } from '../ProgressBar/ProgressBar'
import { QuizCard } from '../QuizCard/QuizCard'
import { QuizNavigation } from '../QuizNavigation/QuizNavigation'

const section = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '6',
  w: 'full',
  maxW: '1040px',
  mx: 'auto',
  h: 'calc(100dvh - 72px)',
  py: '6',
  px: '6',
})

const questionArea = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '3',
  textAlign: 'center',
})

const questionText = css({
  fontSize: '3xl',
  fontWeight: 'bold',
  color: 'text.primary',
  lineHeight: 'tight',
})

const subtitle = css({
  fontSize: 'sm',
  color: 'text.secondary',
})

const cardsRow = css({
  display: 'flex',
  justifyContent: 'center',
  gap: '6',
  w: 'full',
  overflow: 'visible',
})

export function QuizSection() {
  const router = useRouter()
  const {
    currentIndex,
    selectedChoice,
    selectChoice,
    goNext,
    goPrev,
    resetQuiz,
  } = useQuizStore()

  useEffect(() => {
    resetQuiz()
  }, [resetQuiz])

  const question = quizQuestions[currentIndex]
  const isLast = currentIndex === TOTAL_QUESTIONS - 1

  useEffect(() => {
    if (!isLast) {
      const next = quizQuestions[currentIndex + 1]
      preload(next.choiceA.imageSrc, { as: 'image' })
      preload(next.choiceB.imageSrc, { as: 'image' })
    }
  }, [currentIndex, isLast])

  function handleNext() {
    if (selectedChoice === null) return
    if (isLast) {
      goNext(question.id, TOTAL_QUESTIONS)
      router.push(ROUTES.TEST_RESULT)
      return
    }
    goNext(question.id, TOTAL_QUESTIONS)
  }

  return (
    <div className={section}>
      <ProgressBar current={currentIndex + 1} total={TOTAL_QUESTIONS} />

      <div className={questionArea}>
        <h1 className={questionText}>{question.question}</h1>
        <p className={subtitle}>마음에 더 끌리는 쪽을 선택해 주세요</p>
      </div>

      <div className={cardsRow}>
        <div className={css({ w: '50%', maxW: '472px' })}>
          <QuizCard
            choice={question.choiceA}
            side="A"
            isSelected={selectedChoice === 'A'}
            priority={currentIndex === 0}
            onClick={() => selectChoice('A')}
          />
        </div>
        <div className={css({ w: '50%', maxW: '472px' })}>
          <QuizCard
            choice={question.choiceB}
            side="B"
            isSelected={selectedChoice === 'B'}
            priority={currentIndex === 0}
            onClick={() => selectChoice('B')}
          />
        </div>
      </div>

      <QuizNavigation
        currentIndex={currentIndex}
        canGoNext={selectedChoice !== null}
        isLast={isLast}
        onPrev={goPrev}
        onNext={handleNext}
      />
    </div>
  )
}
