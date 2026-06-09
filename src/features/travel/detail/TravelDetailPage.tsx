import { PageLayout } from '@/components/layout/PageLayout'
import Breadcrumb from './components/Breadcrumb'
import GallerySectionContainer from './components/GallerySectionContainer'
import InfoCard from './components/InfoCard'
import MapSection from './components/MapSection'
import ReviewsSection from './components/ReviewsSection'

import type { TravelDetail } from './types/travelDetail.types'

import { css } from '@/styled-system/css'

interface TravelDetailPageProps {
  detail: TravelDetail
  isAuthenticated: boolean
}

const pageStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '8',
})

const contentGridStyle = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', lg: '7fr 5fr' },
  gap: '6',
  alignItems: 'start',
})

const rightColumnStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '4',
})

export default function TravelDetailPage({
  detail,
  isAuthenticated,
}: TravelDetailPageProps) {
  return (
    <PageLayout>
      <div className={pageStyle}>
        <Breadcrumb placeName={detail.place_name} />

        <div className={contentGridStyle}>
          <GallerySectionContainer images={detail.images} placeId={detail.id} />

          <div className={rightColumnStyle}>
            <InfoCard detail={detail} isAuthenticated={isAuthenticated} />
            <MapSection
              name={detail.place_name}
              latitude={detail.latitude}
              longitude={detail.longitude}
            />
          </div>
        </div>

        {/* TODO: 리뷰 목록은 GET /api/v1/places/{place_id}/reviews 별도 연동 필요 */}
        <ReviewsSection
          reviews={[]}
          reviewCount={detail.review_count}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </PageLayout>
  )
}
