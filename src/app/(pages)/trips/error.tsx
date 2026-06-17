'use client'

import { useEffect } from 'react'
import { Button } from '@/components/common/button'
import { css } from '@/styled-system/css'

const wrapperStyle = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4',
  minH: '60vh',
  textAlign: 'center',
  px: '4',
})

const titleStyle = css({
  fontSize: '2xl',
  fontWeight: 'bold',
  color: 'text.primary',
})

const descStyle = css({
  fontSize: 'sm',
  color: 'text.secondary',
})

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function TripsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className={wrapperStyle}>
      <h2 className={titleStyle}>오류가 발생했습니다</h2>
      <p className={descStyle}>경로 목록을 불러오는 중 문제가 생겼습니다.</p>
      <Button variant="primary" onClick={reset}>
        다시 시도
      </Button>
    </div>
  )
}
