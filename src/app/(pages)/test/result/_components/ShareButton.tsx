'use client'

import { useState, useCallback } from 'react'

import { css, cx } from '@/styled-system/css'

import { buttonRecipe } from '@/components/common/button/Button'
import { Toast } from '@/components/common/Toast/Toast'
import { useQuizStore } from '@/store/quizStore'

interface ShareButtonProps {
  typeKey: string
}

const shareButtonStyle = css({
  cursor: 'pointer',
})

export function ShareButton({ typeKey }: ShareButtonProps) {
  const [toastVisible, setToastVisible] = useState(false)

  const handleShare = useCallback(async () => {
    const { resultVector } = useQuizStore.getState()

    const shareUrl = resultVector
      ? `${window.location.origin}/test/result?type_key=${typeKey}&vector=${resultVector.join(',')}`
      : `${window.location.origin}/test/result?type=${typeKey}`

    try {
      await navigator.clipboard.writeText(shareUrl)
    } catch {
      // clipboard 실패 시 무시
    }

    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2000)
  }, [typeKey])

  return (
    <>
      <button
        type="button"
        className={cx(
          buttonRecipe({ variant: 'outline', size: 'md', shape: 'pill' }),
          shareButtonStyle
        )}
        onClick={handleShare}
      >
        결과 공유하기
      </button>
      <Toast message="링크가 복사되었습니다" visible={toastVisible} />
    </>
  )
}
