'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { preload } from 'react-dom'

import { ROUTES } from '@/constants/routes'
import { quizQuestions, TOTAL_QUESTIONS } from '@/features/test/data/quizData'
import { postQuizSubmit } from '@/features/result/quizSubmitApi'
import type { QuizAnswer } from '@/features/test/quiz.types'
import { useQuizStore } from '@/store/quizStore'

import { css } from '@/styled-system/css'

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
    setCalculatedResult,
    setApiResult,
    setApiError,
  } = useQuizStore()
  const [isNavigating, setIsNavigating] = useState(false)

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
    if (selectedChoice === null || isNavigating) {
      return
    }
    if (isLast) {
      const currentAnswers = useQuizStore.getState().answers
      const finalAnswers: QuizAnswer[] = [
        ...currentAnswers.filter((a) => a.questionId !== question.id),
        { questionId: question.id, selected: selectedChoice },
      ]

      // 1. 로컬에서 타입 즉시 계산
      setCalculatedResult(finalAnswers)
      const localTypeKey = useQuizStore.getState().typeKey

      // 2. 결과 페이지로 즉시 이동 (API 응답 대기 없음)
      setIsNavigating(true)
      goNext(question.id, TOTAL_QUESTIONS)
      router.push(
        localTypeKey
          ? `${ROUTES.TEST_RESULT}?type=${localTypeKey}`
          : ROUTES.TEST_RESULT
      )

      // 3. API는 백그라운드에서 호출 → 스토어 업데이트 → 결과 페이지 자동 갱신
      postQuizSubmit(finalAnswers)
        .then((response) => {
          setApiResult(response)
        })
        .catch(() => {
          setApiError()
        })

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
        canGoNext={selectedChoice !== null && !isNavigating}
        isLast={isLast}
        onPrev={goPrev}
        onNext={handleNext}
      />
    </div>
  )
}
