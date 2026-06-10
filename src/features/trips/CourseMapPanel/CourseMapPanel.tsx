'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { useCourseStore } from '@/store/tripsStore'
import { Button } from '@/components/common/button/Button'
import { createTrip } from '@/features/trips/api/tripsApi'
import type { CreateTripPayload } from '@/features/trips/types/trips.types'
import { ROUTES } from '@/constants/routes'

import { css } from '@/styled-system/css'

// 카카오맵 SDK 공식 타입 미제공 → 최소 필요 인터페이스 정의
interface KakaoLatLng {
  getLat: () => number
  getLng: () => number
}
interface KakaoLatLngBounds {
  extend: (latlng: KakaoLatLng) => void
}
interface KakaoOverlay {
  setMap: (map: KakaoMapInstance | null) => void
}
interface KakaoPolyline {
  setMap: (map: KakaoMapInstance | null) => void
}
interface KakaoMapInstance {
  setBounds: (bounds: KakaoLatLngBounds) => void
}

// 디자인 토큰 raw 값 (카카오맵 DOM API는 Panda CSS 토큰 미지원)
const PRIMARY_COLOR = '#2CA6BE' // semantic token 'primary'

const panelStyle = css({
  display: 'flex',
  flexDirection: 'column',
  h: 'full',
  bg: 'bg.surface',
  borderRadius: '2xl',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  overflow: 'hidden',
})

const mapHeaderStyle = css({
  px: '4',
  pt: '3',
  pb: '2.5',
  borderBottomWidth: '1px',
  borderColor: 'border.subtle',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '3',
  flexShrink: 0,
})

const mapHeaderLeftStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5',
})

const mapTitleStyle = css({
  fontSize: 'md',
  fontWeight: 'semibold',
  color: 'text.primary',
})

const mapSubtitleStyle = css({
  fontSize: 'xs',
  color: 'text.secondary',
})

const mapAreaStyle = css({
  flex: 1,
  position: 'relative',
  overflow: 'hidden',
  mx: '3',
  my: '2',
  borderRadius: 'xl',
})

const mapContainerStyle = css({
  position: 'absolute',
  inset: 0,
})

const legendRowStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  px: '4',
  py: '1.5',
  borderTopWidth: '1px',
  borderColor: 'border.subtle',
  flexShrink: 0,
})

const legendItemsStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '3',
})

const legendItemStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '1',
  fontSize: 'xs',
  color: 'text.secondary',
})

const legendDotPrimaryStyle = css({
  w: '2',
  h: '2',
  borderRadius: 'pill',
  flexShrink: 0,
  bg: 'primary',
})

const legendDotSuccessStyle = css({
  w: '2',
  h: '2',
  borderRadius: 'pill',
  flexShrink: 0,
  bg: 'success',
})

const autoSaveStyle = css({
  fontSize: 'xs',
  color: 'text.secondary',
})

const bottomBarStyle = css({
  display: 'flex',
  gap: '2',
  px: '4',
  py: '3',
  bg: 'bg.surface',
  borderTopWidth: '1px',
  borderColor: 'border.subtle',
  flexShrink: 0,
})

const APP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY

export function CourseMapPanel() {
  const router = useRouter()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<KakaoMapInstance | null>(null)
  const overlaysRef = useRef<KakaoOverlay[]>([])
  const polylineRef = useRef<KakaoPolyline | null>(null)
  const [createError, setCreateError] = useState<string | null>(null)

  const {
    title,
    description,
    selectedRegion,
    selectedDay,
    dateRange,
    places,
    estimatedHours,
    estimatedMinutes,
    resetCourse,
  } = useCourseStore()

  // places 의존성 제거 — 초기화는 마운트 시 1회만 실행
  // 중심/줌은 마커 useEffect의 setBounds가 자동 조정
  const initMap = useCallback(() => {
    if (!mapRef.current) {
      return
    }

    const center = new window.kakao.maps.LatLng(36.5, 127.5) // 한국 중심
    const map = new window.kakao.maps.Map(mapRef.current, {
      center,
      level: 13,
    })
    mapInstanceRef.current = map
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (window.kakao?.maps) {
      window.kakao.maps.load(initMap)
      return
    }

    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${APP_KEY}&autoload=false&libraries=services`
    script.onload = () => window.kakao.maps.load(initMap)
    document.head.appendChild(script)
  }, [initMap])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !window.kakao?.maps) {
      return
    }

    overlaysRef.current.forEach((o) => o.setMap(null))
    overlaysRef.current = []
    if (polylineRef.current) {
      polylineRef.current.setMap(null)
      polylineRef.current = null
    }

    const coordPlaces = places.filter(
      (p) => p.lat && p.lng && p.dayIndex === selectedDay
    )
    if (coordPlaces.length === 0) {
      return
    }

    const path: KakaoLatLng[] = []

    coordPlaces.forEach((place, idx) => {
      const position = new window.kakao.maps.LatLng(place.lat!, place.lng!)
      path.push(position)

      const overlayContent = document.createElement('div')
      overlayContent.style.cssText = [
        'position:relative',
        'display:inline-flex',
        'align-items:center',
        'justify-content:center',
        'min-width:28px',
        'height:28px',
        'padding:0 8px',
        `background:${PRIMARY_COLOR}`,
        'color:#fff',
        'font-size:12px',
        'font-weight:bold',
        'border-radius:12px',
        'box-shadow:0 2px 6px rgba(0,0,0,0.25)',
        'cursor:default',
        'white-space:nowrap',
      ].join(';')

      // 말풍선 꼬리 (아래 방향 삼각형)
      const tail = document.createElement('div')
      tail.style.cssText = [
        'position:absolute',
        'bottom:-7px',
        'left:50%',
        'transform:translateX(-50%)',
        'width:0',
        'height:0',
        'border-left:6px solid transparent',
        'border-right:6px solid transparent',
        `border-top:8px solid ${PRIMARY_COLOR}`,
      ].join(';')

      overlayContent.textContent = String(idx + 1)
      overlayContent.appendChild(tail)

      const overlay = new window.kakao.maps.CustomOverlay({
        position,
        content: overlayContent,
        yAnchor: 1.4,
      })
      overlay.setMap(map)
      overlaysRef.current.push(overlay)
    })

    if (path.length >= 2) {
      const polyline = new window.kakao.maps.Polyline({
        map,
        path,
        strokeWeight: 3,
        strokeColor: PRIMARY_COLOR,
        strokeOpacity: 0.9,
        strokeStyle: 'dashdot',
      })
      polylineRef.current = polyline
    }

    if (coordPlaces.length > 0) {
      const bounds = new window.kakao.maps.LatLngBounds()
      path.forEach((p) => bounds.extend(p))
      map.setBounds(bounds)
    }
  }, [places, selectedDay])

  const handleCreateTrip = async () => {
    if (!selectedRegion || !dateRange?.from) {
      return
    }

    setCreateError(null)
    try {
      const payload: CreateTripPayload = {
        title,
        description,
        region: selectedRegion,
        startDate: dateRange.from.toISOString().split('T')[0],
        endDate: (dateRange.to ?? dateRange.from).toISOString().split('T')[0],
        visibility: 'public',
        places: places.map((p, i) => ({
          id: p.id,
          name: p.name,
          address: p.address,
          order: i + 1,
        })),
      }

      await createTrip(payload)
      resetCourse()
      router.push(ROUTES.TRIPS)
    } catch (error) {
      console.error('코스 등록 실패:', error)
      setCreateError('코스 등록에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const isSaveEnabled =
    title.trim().length > 0 &&
    selectedRegion !== null &&
    dateRange?.from !== undefined &&
    places.length >= 2

  const headerTitle = selectedRegion
    ? `${selectedRegion} · ${selectedDay}일차`
    : `${selectedDay}일차`

  const durationText =
    estimatedHours > 0 || estimatedMinutes > 0
      ? `약 ${estimatedHours > 0 ? `${estimatedHours}시간 ` : ''}${estimatedMinutes > 0 ? `${estimatedMinutes}분` : ''}`
      : null

  return (
    <div className={panelStyle}>
      {/* 지도 헤더 */}
      <div className={mapHeaderStyle}>
        <div className={mapHeaderLeftStyle}>
          <p className={mapTitleStyle}>{headerTitle}</p>
          <p className={mapSubtitleStyle}>
            지도를 클릭해 코스에 장소를 추가할 수 있어요
          </p>
          {durationText && (
            <p
              className={css({
                fontSize: 'xs',
                color: 'text.secondary',
                mt: '0.5',
              })}
            >
              {durationText}
            </p>
          )}
        </div>
      </div>

      {/* 지도 영역 */}
      <div className={mapAreaStyle}>
        <div ref={mapRef} className={mapContainerStyle} />
      </div>

      {/* 범례 */}
      <div className={legendRowStyle}>
        <div className={legendItemsStyle}>
          <div className={legendItemStyle}>
            <span className={legendDotPrimaryStyle} />
            코스 경로
          </div>
          <div className={legendItemStyle}>
            <span className={legendDotSuccessStyle} />
            제안선
          </div>
        </div>
        <span className={autoSaveStyle}>마지막 저장 방금 전 · 자동저장 ON</span>
      </div>

      {/* 에러 메시지 */}
      {createError && (
        <p
          className={css({
            px: '4',
            pb: '2',
            fontSize: 'xs',
            color: 'warning',
          })}
        >
          {createError}
        </p>
      )}

      {/* 하단 버튼 */}
      <div className={bottomBarStyle}>
        <Button variant="neutral" size="md" shape="rounded" fullWidth>
          임시저장
        </Button>
        <Button variant="neutral" size="md" shape="rounded" fullWidth>
          미리보기
        </Button>
        <Button
          variant="primary"
          size="md"
          shape="rounded"
          fullWidth
          disabled={!isSaveEnabled}
          onClick={handleCreateTrip}
        >
          코스 등록하기
        </Button>
      </div>
    </div>
  )
}

export default CourseMapPanel
