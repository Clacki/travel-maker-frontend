'use client'

import { useRouter } from 'next/navigation'

import { PageLayout } from '@/components/layout/PageLayout'
import { EmptyState } from '@/components/common/status/EmptyState'
import { css } from '@/styled-system/css'

const containerStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minH: '60vh',
})

export default function DetailNotFound() {
  const router = useRouter()

  return (
    <PageLayout>
      <div className={containerStyle}>
        <EmptyState
          title="장소를 찾을 수 없어요"
          description="삭제됐거나 존재하지 않는 장소예요."
          actionLabel="여행지 탐색하기"
          onAction={() => router.push('/explore')}
        />
      </div>
    </PageLayout>
  )
}
