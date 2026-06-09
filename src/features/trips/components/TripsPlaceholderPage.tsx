import { getTripPageTitle, type TripPageMode } from '../utils/getTripPageTitle'
import { css } from '@/styled-system/css'

interface TripsPlaceholderPageProps {
  mode: TripPageMode
  tripId?: string
}

const pageStyle = css({
  minH: '100vh',
  bg: 'bg.canvas',
  px: { base: '4', md: '6' },
  py: { base: '10', md: '12' },
})

const contentStyle = css({
  width: 'full',
  maxW: '4xl',
  mx: 'auto',
  display: 'grid',
  gap: '3',
})

const labelStyle = css({
  color: 'primary',
  fontSize: 'sm',
  fontWeight: 'semibold',
})

const titleStyle = css({
  color: 'text.primary',
  fontSize: { base: '2xl', md: '3xl' },
  fontWeight: 'bold',
  lineHeight: 'tight',
})

const descriptionStyle = css({
  color: 'text.secondary',
  fontSize: 'sm',
  lineHeight: 'normal',
})

export function TripsPlaceholderPage({
  mode,
  tripId,
}: TripsPlaceholderPageProps) {
  const title = getTripPageTitle(mode)

  return (
    <main className={pageStyle}>
      <section className={contentStyle}>
        <p className={labelStyle}>Trips</p>
        <h1 className={titleStyle}>{title}</h1>
        <p className={descriptionStyle}>
          여행 코스 기능 확장을 위한 기본 라우트입니다.
          {tripId ? ` 현재 tripId: ${tripId}` : ''}
        </p>
      </section>
    </main>
  )
}
