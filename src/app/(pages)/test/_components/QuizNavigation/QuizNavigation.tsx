import { css } from '@/styled-system/css'

import { Button } from '@/components/common/button/Button'

interface QuizNavigationProps {
  currentIndex: number
  onPrev: () => void
}

const navWrapper = css({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  w: 'full',
})

export function QuizNavigation({ currentIndex, onPrev }: QuizNavigationProps) {
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
    </div>
  )
}
