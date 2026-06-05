import { css } from '@/styled-system/css'

import { Button } from '@/components/common/button/Button'

interface QuizNavigationProps {
  currentIndex: number
  canGoNext: boolean
  isLast: boolean
  onPrev: () => void
  onNext: () => void
}

const navWrapper = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  w: 'full',
})

export function QuizNavigation({
  currentIndex,
  canGoNext,
  isLast,
  onPrev,
  onNext,
}: QuizNavigationProps) {
  return (
    <div className={navWrapper}>
      <Button
        variant="neutral"
        size="md"
        shape="pill"
        onClick={onPrev}
        disabled={currentIndex === 0}
      >
        <span aria-hidden="true">←</span> 이전
      </Button>
      <Button
        variant="primary"
        size="md"
        shape="pill"
        onClick={onNext}
        disabled={!canGoNext}
      >
        {isLast ? '결과 보기' : '다음'} <span aria-hidden="true">→</span>
      </Button>
    </div>
  )
}
