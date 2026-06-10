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
}

const pageStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '8',
})

const contentGridStyle = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', lg: 'minmax(0, 7fr) minmax(0, 5fr)' },
  gap: '6',
  alignItems: 'start',
})

const rightColumnStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '4',
})

export default function TravelDetailPage({ detail }: TravelDetailPageProps) {
  return (
    <PageLayout>
      <div className={pageStyle}>
        <Breadcrumb placeName={detail.place_name} />

        <div className={contentGridStyle}>
          <GallerySectionContainer images={detail.images} placeId={detail.id} />

          <div className={rightColumnStyle}>
            <InfoCard detail={detail} />
            <MapSection
              name={detail.place_name}
              latitude={detail.latitude}
              longitude={detail.longitude}
            />
          </div>
        </div>

        {/* TODO: GET /api/v1/places/{place_id}/reviews 연동 후 reviews 교체 */}
        <ReviewsSection
          placeId={detail.id}
          reviews={[]}
          reviewCount={detail.review_count}
        />
      </div>
    </PageLayout>
  )
}
