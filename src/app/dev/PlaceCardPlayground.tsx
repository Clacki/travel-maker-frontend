'use client'

import { css } from '@/styled-system/css'
import { PlaceCard } from '@/components/ui/PlaceCard'

export function PlaceCardPlayground() {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '3',
        width: 'full',
      })}
    >
      <PlaceCard
        variant="bookmark"
        placeId={1}
        placeName="부산 광안리 해수욕장"
        description="바닷가를 수놓는 빛의 다리, 광안대교와 함께 걸어가는 부산의 밤"
        tags={['해변', '야경', '부산']}
        rating={4.5}
        isLiked={true}
        onLikeToggle={(id) => console.log('toggle', id)}
      />
      <PlaceCard
        variant="bookmark"
        placeId={2}
        placeName="이미지 없는 카드"
        description="이미지가 없을 때의 placeholder 상태를 확인합니다."
        tags={['태그1', '태그2']}
        rating={3.8}
        isLiked={false}
        onLikeToggle={(id) => console.log('toggle', id)}
      />
      <PlaceCard
        variant="review"
        placeId={3}
        placeName="서울 남산타워"
        description="서울 도심을 한눈에 내려다볼 수 있는 전망대"
        tags={['전망대', '서울', '야경']}
        rating={4.2}
        onEditClick={(id) => console.log('edit', id)}
        onDeleteClick={(id) => console.log('delete', id)}
      />
    </div>
  )
}
