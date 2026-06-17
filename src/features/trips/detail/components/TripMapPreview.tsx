'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MapPin } from 'lucide-react'
import type { TripCourseDetail, TripPlace } from '../types/tripDetail'
import type {
  KakaoLatLng,
  KakaoOverlay,
  KakaoPolyline,
  KakaoMapInstance,
} from '@/features/trips/types/kakao.types'
import {
  PRIMARY_COLOR,
  INVERSE_COLOR,
  createMarkerOverlay,
} from '@/features/trips/utils/createKakaoMarker'
import { loadKakaoSdk } from '@/features/trips/utils/loadKakaoSdk'
import { css } from '@/styled-system/css'

const APP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY

const sectionStyle = css({
  display: 'grid',
  gap: '3',
})

const tabsStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2',
})

const tabButtonStyle = css({
  minH: '8',
  px: '4',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'pill',
  bg: 'bg.surface',
  color: 'text.primary',
  fontSize: 'sm',
  fontWeight: 'semibold',
  transitionProperty: 'background-color, border-color, color, box-shadow',
  transitionDuration: '150ms',
  _hover: {
    borderColor: 'primary',
    color: 'primary',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
  '&[aria-pressed=true]': {
    bg: 'primary',
    borderColor: 'primary',
    color: 'text.inverse',
    _hover: {
      bg: 'primary.hover',
      borderColor: 'primary.hover',
      color: 'text.inverse',
    },
  },
})

const mapWrapStyle = css({
  position: 'relative',
  minH: { base: '280px', md: '420px' },
  overflow: 'hidden',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'xl',
  bg: 'bg.muted',
  boxShadow: 'sm',
})

const mapContainerStyle = css({
  position: 'absolute',
  inset: 0,
  '& svg': {
    display: 'revert',
    maxWidth: 'revert',
  },
})

const selectedCardStyle = css({
  position: 'absolute',
  left: { base: '4', md: '6' },
  bottom: { base: '4', md: '6' },
  display: 'grid',
  gap: '1',
  maxW: { base: 'calc(100% - 32px)', md: '360px' },
  p: '4',
  borderRadius: 'lg',
  bg: 'bg.surface',
  color: 'text.primary',
  boxShadow: 'md',
  zIndex: '1',
})

const selectedTitleStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2',
  fontSize: 'sm',
  fontWeight: 'bold',
})

const selectedTextStyle = css({
  color: 'text.secondary',
  fontSize: 'xs',
})

const sequenceStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '2',
  px: '4',
  py: '3',
  bg: 'bg.surface',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'lg',
  color: 'text.primary',
  fontSize: 'sm',
})

const sequenceDividerStyle = css({
  color: 'text.secondary',
})

interface TripMapPreviewProps {
  trip: TripCourseDetail
}

export function TripMapPreview({ trip }: TripMapPreviewProps) {
  const [activeDay, setActiveDay] = useState<number | 'all'>('all')
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | undefined>(
    trip.days[0]?.places[0]?.id
  )

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<KakaoMapInstance | null>(null)
  const overlaysRef = useRef<KakaoOverlay[]>([])
  const polylineRef = useRef<KakaoPolyline | null>(null)
  const overlayContentsRef = useRef<
    Array<{
      id: number
      el: HTMLDivElement
      tailInner: HTMLDivElement
      cleanup: () => void
    }>
  >([])

  const places = useMemo<TripPlace[]>(() => {
    if (activeDay === 'all') {
      return trip.days.flatMap((day) => day.places)
    }
    return trip.days.find((day) => day.day === activeDay)?.places ?? []
  }, [activeDay, trip.days])

  const selectedPlace =
    places.find((place) => place.id === selectedPlaceId) ?? places[0]

  const initMap = useCallback(() => {
    if (!mapRef.current) return
    const center = new window.kakao.maps.LatLng(36.5, 127.5)
    const map = new window.kakao.maps.Map(mapRef.current, {
      center,
      level: 13,
    })
    mapInstanceRef.current = map
  }, [])

  // 카카오맵 SDK 로드
  useEffect(() => {
    if (typeof window === 'undefined' || !APP_KEY) {
      return
    }
    loadKakaoSdk(APP_KEY).then(initMap)
  }, [initMap])

  // 일차 변경 시 마커·폴리라인 갱신
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !window.kakao?.maps) {
      return
    }

    // 기존 오버레이·폴리라인 제거 (이벤트 리스너 cleanup 포함)
    overlayContentsRef.current.forEach(({ cleanup }) => cleanup())
    overlayContentsRef.current = []
    overlaysRef.current.forEach((o) => o.setMap(null))
    overlaysRef.current = []
    if (polylineRef.current) {
      polylineRef.current.setMap(null)
      polylineRef.current = null
    }

    const coordPlaces = places.filter((p) => p.latitude && p.longitude)
    if (coordPlaces.length === 0) {
      return
    }

    const path: KakaoLatLng[] = []
    overlayContentsRef.current = []

    coordPlaces.forEach((place, idx) => {
      const position = new window.kakao.maps.LatLng(
        place.latitude!,
        place.longitude!
      )
      path.push(position)

      const { el, tailInner } = createMarkerOverlay(
        String(idx + 1),
        PRIMARY_COLOR
      )

      const handleClick = () => setSelectedPlaceId(place.id)
      el.addEventListener('click', handleClick)
      overlayContentsRef.current.push({
        id: place.id,
        el,
        tailInner,
        cleanup: () => el.removeEventListener('click', handleClick),
      })

      const overlay = new window.kakao.maps.CustomOverlay({
        position,
        content: el,
        yAnchor: 1.4,
      })
      overlay.setMap(map)
      overlaysRef.current.push(overlay)
    })

    if (path.length >= 2) {
      const polyline = new window.kakao.maps.Polyline({
        path,
        strokeWeight: 5,
        strokeColor: PRIMARY_COLOR,
        strokeOpacity: 0.9,
        strokeStyle: 'solid',
      })
      polyline.setMap(map)
      polylineRef.current = polyline
    }

    const bounds = new window.kakao.maps.LatLngBounds()
    path.forEach((p) => bounds.extend(p))
    map.setBounds(bounds)
  }, [places])

  // 선택 장소 변경 시 마커 스타일 업데이트 + 지도 이동
  useEffect(() => {
    if (!mapInstanceRef.current || !window.kakao?.maps) return

    overlayContentsRef.current.forEach(({ id, el, tailInner }) => {
      const isSelected = id === selectedPlace?.id
      const bgColor = isSelected ? INVERSE_COLOR : PRIMARY_COLOR
      const textColor = isSelected ? PRIMARY_COLOR : INVERSE_COLOR
      el.style.background = bgColor
      el.style.color = textColor
      el.style.border = isSelected ? `2px solid ${PRIMARY_COLOR}` : 'none'
      el.style.minWidth = isSelected ? '32px' : '28px'
      el.style.height = isSelected ? '32px' : '28px'
      tailInner.style.borderTopColor = bgColor
    })

    if (!selectedPlace?.latitude || !selectedPlace?.longitude) {
      return
    }
    mapInstanceRef.current.panTo(
      new window.kakao.maps.LatLng(
        selectedPlace.latitude,
        selectedPlace.longitude
      )
    )
  }, [selectedPlace])

  const selectDay = (day: number | 'all') => {
    const nextPlaces =
      day === 'all'
        ? trip.days.flatMap((d) => d.places)
        : (trip.days.find((d) => d.day === day)?.places ?? [])

    setActiveDay(day)
    setSelectedPlaceId(nextPlaces[0]?.id)
  }

  return (
    <section className={sectionStyle} aria-labelledby="trip-map-title">
      <h2 id="trip-map-title" className={css({ srOnly: true })}>
        지도에서 코스 보기
      </h2>

      <div className={tabsStyle} aria-label="일차별 지도 보기">
        <button
          type="button"
          aria-pressed={activeDay === 'all'}
          className={tabButtonStyle}
          onClick={() => selectDay('all')}
        >
          전체
        </button>
        {trip.days.map((day) => (
          <button
            key={day.day}
            type="button"
            aria-pressed={activeDay === day.day}
            className={tabButtonStyle}
            onClick={() => selectDay(day.day)}
          >
            Day {day.day}
          </button>
        ))}
      </div>

      <div className={mapWrapStyle}>
        <div ref={mapRef} className={mapContainerStyle} />
        {selectedPlace ? (
          <div className={selectedCardStyle}>
            <strong className={selectedTitleStyle}>
              <MapPin size={15} aria-hidden="true" />
              {selectedPlace.order}. {selectedPlace.name}
            </strong>
            {selectedPlace.address ? (
              <span className={selectedTextStyle}>{selectedPlace.address}</span>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className={sequenceStyle} aria-label="장소 순서 요약">
        {places.map((place, index) => (
          <span key={place.id}>
            {index > 0 ? (
              <span className={sequenceDividerStyle}>→ </span>
            ) : null}
            {place.order}. {place.name}
          </span>
        ))}
      </div>
    </section>
  )
}
