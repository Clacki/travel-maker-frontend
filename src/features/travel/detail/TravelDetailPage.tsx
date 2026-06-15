import { PageLayout } from '@/components/layout/PageLayout'
import Breadcrumb from './components/Breadcrumb'
import GallerySectionContainer from './components/GallerySectionContainer'
import InfoCard from './components/InfoCard'
import MapSectionClient from './components/MapSectionClient'
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
  animation: 'blurIn 0.6s ease-out',
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
            <MapSectionClient
              name={detail.place_name}
              latitude={detail.latitude}
              longitude={detail.longitude}
            />
          </div>
        </div>

        <ReviewsSection placeId={detail.id} reviewCount={detail.review_count} />
      </div>
    </PageLayout>
  )
}
