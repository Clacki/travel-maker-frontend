import { css } from '@/styled-system/css'

import { PageLayout } from '@/components/layout/PageLayout'
import { ResultCard } from './_components/ResultCard'
import { TravelCard } from './_components/TravelCard'

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

        <div className={css({ w: 'full', maxW: '400px' })}>
          <TravelCard
            title="제주 서귀포"
            description="올레길·바다 힐링"
            region="제주특별자치도"
            hashtags={['올레길', '자연', '산책']}
          />
        </div>
      </div>
    </PageLayout>
  )
}
