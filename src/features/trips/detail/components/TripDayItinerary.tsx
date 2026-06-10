import type { TripCourseDetail } from '../types/tripDetail'
import { TripPlaceCard } from './TripPlaceCard'
import { css } from '@/styled-system/css'

const sectionStyle = css({
  display: 'grid',
  gap: '5',
})

const headerStyle = css({
  display: 'grid',
  gap: '2',
})

const eyebrowStyle = css({
  color: 'primary',
  fontSize: 'sm',
  fontWeight: 'bold',
})

const titleStyle = css({
  color: 'text.primary',
  fontSize: { base: 'xl', md: '2xl' },
  fontWeight: 'bold',
  lineHeight: 'tight',
})

const descriptionStyle = css({
  color: 'text.secondary',
  fontSize: 'sm',
  lineHeight: 'relaxed',
})

const dayGroupStyle = css({
  display: 'grid',
  gap: '3',
})

const dayTitleStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2',
  color: 'text.primary',
  fontSize: 'lg',
  fontWeight: 'bold',
})

const dayBadgeStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minH: '7',
  px: '3',
  borderRadius: 'pill',
  bg: 'primary.soft',
  color: 'primary',
  fontSize: 'xs',
  fontWeight: 'bold',
})

interface TripDayItineraryProps {
  trip: TripCourseDetail
}

export function TripDayItinerary({ trip }: TripDayItineraryProps) {
  return (
    <section className={sectionStyle} aria-labelledby="trip-itinerary-title">
      <div className={headerStyle}>
        <span className={eyebrowStyle}>ITINERARY</span>
        <h2 id="trip-itinerary-title" className={titleStyle}>
          코스 순서
        </h2>
        <p className={descriptionStyle}>
          작성자가 정리한 이동 순서와 장소별 메모를 확인해보세요.
        </p>
      </div>

      {trip.days.map((day) => (
        <div key={day.day} className={dayGroupStyle}>
          <h3 className={dayTitleStyle}>
            <span className={dayBadgeStyle}>Day {day.day}</span>
            {day.title}
          </h3>

          {day.places.map((place) => (
            <TripPlaceCard key={place.id} place={place} />
          ))}
        </div>
      ))}
    </section>
  )
}
