'use client'

import { useState, useCallback } from 'react'

import { css, cx } from '@/styled-system/css'

import { buttonRecipe } from '@/components/common/button/Button'

interface ShareButtonProps {
  typeKey: string
}

const shareButtonStyle = css({
  cursor: 'pointer',
})

export function ShareButton({ typeKey }: ShareButtonProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')

  const handleShare = useCallback(async () => {
    const shareUrl = `${window.location.origin}/test/result?type=${typeKey}`

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: '나의 여행 성향 테스트 결과',
          url: shareUrl,
        })
        return
      } catch {
        // 사용자가 공유 취소하거나 미지원 시 클립보드 복사로 폴백
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl)
      setStatus('copied')
      setTimeout(() => setStatus('idle'), 1500)
    } catch {
      setStatus('failed')
      setTimeout(() => setStatus('idle'), 2000)
    }
  }, [typeKey])

  const label = {
    idle: '결과 공유하기',
    copied: '링크 복사됨!',
    failed: 'URL을 직접 복사해주세요',
  }[status]

  return (
    <button
      type="button"
      className={cx(
        buttonRecipe({ variant: 'outline', size: 'md', shape: 'pill' }),
        shareButtonStyle
      )}
      onClick={handleShare}
    >
      {label}
    </button>
  )
}
