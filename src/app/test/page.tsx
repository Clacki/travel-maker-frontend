import { css } from '@/styled-system/css'

import { PageLayout } from '@/components/layout/PageLayout'
import { ResultCard } from './_components/ResultCard'

export default function TestPage() {
  return (
    <PageLayout>
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8',
          p: '6',
        })}
      >
        <h1 className={css({ fontSize: '2xl', fontWeight: 'bold' })}>
          Test Page
        </h1>

        <div className={css({ w: 'full', maxW: '400px' })}>
          <ResultCard
            typeLabel="TYPE 0_9.0~8"
            typeName="MOONLIGHT CAST"
            title="모임 결과 보기"
            description="당신과 가장 잘 맞는 모임 유형입니다"
            keywords={['감성적', '야외활동', '소규모']}
            matchScore={64}
            typeRank={1}
          />
        </div>
      </div>
    </PageLayout>
  )
}
