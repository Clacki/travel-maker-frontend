'use client'

import { PageLayout } from '@/components/layout/PageLayout'
import { ErrorState } from '@/components/common/status/ErrorState'
import { css } from '@/styled-system/css'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

const containerStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minH: '60vh',
})

export default function DetailError({ error, reset }: ErrorProps) {
  const status = /^\d{3}$/.test(error.message) ? error.message : null

  return (
    <PageLayout>
      <div className={containerStyle}>
        <ErrorState
          title={status ? `오류 ${status}` : '오류가 발생했어요'}
          description="장소 정보를 불러오지 못했어요. 다시 시도해주세요."
          actionLabel="다시 시도"
          onAction={reset}
        />
      </div>
    </PageLayout>
  )
}
