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
  panTo: (latlng: KakaoLatLng) => void
}

// 디자인 토큰 raw 값 (카카오맵 DOM API는 Panda CSS 토큰 미지원)
const PRIMARY_COLOR = '#2CA6BE' // semantic token 'primary'
const SELECTED_COLOR = '#FF6B35' // 선택된 마커 색상 (코랄 오렌지)
const ROUTE_LINE_COLOR = '#FF6B35' // 코스 경로선 색상 (코랄 오렌지)

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
  mx: '3',
  my: '2',
  borderRadius: 'xl',
})

const mapContainerStyle = css({
  position: 'absolute',
  inset: 0,
  // globals.css의 `svg { display: block; max-width: 100% }` 리셋이
  // 카카오맵 내부 SVG(폴리라인 레이어)의 width를 0으로 만드는 문제 해결
  '& svg': {
    display: 'revert',
    maxWidth: 'revert',
  },
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
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [isMapReady, setIsMapReady] = useState(false)
  const isGeocodingRef = useRef(false)
  useEffect(() => {
    isGeocodingRef.current = isGeocoding
  }, [isGeocoding])

  const {
    title,
    description,
    selectedRegion,
    selectedDay,
    selectedPlaceId,
    dateRange,
    places,
    estimatedHours,
    estimatedMinutes,
    resetCourse,
    addPlace,
  } = useCourseStore()

  // 페이지 이탈 시 코스 데이터 초기화
  useEffect(() => {
    return () => {
      resetCourse()
    }
  }, [resetCourse])

  // ref로 최신 addPlace를 참조하여 initMap의 useCallback deps를 [] 유지
  const addPlaceRef = useRef(addPlace)
  useEffect(() => {
    addPlaceRef.current = addPlace
  }, [addPlace])

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
    setIsMapReady(true)

    // 지도 클릭 → Geocoder로 주소 변환 → 코스에 장소 추가
    const geocoder = new window.kakao.maps.services.Geocoder()

    window.kakao.maps.event.addListener(
      map,
      'click',
      (mouseEvent: { latLng: KakaoLatLng }) => {
        if (isGeocodingRef.current) return

        const lat = mouseEvent.latLng.getLat()
        const lng = mouseEvent.latLng.getLng()

        setIsGeocoding(true)

        geocoder.coord2Address(
          lng,
          lat,
          (
            result: Array<{
              road_address?: { address_name: string }
              address?: { address_name: string }
            }>,
            status: string
          ) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const addr = result[0]
              const roadAddress = addr.road_address?.address_name ?? ''
              const jibunAddress = addr.address?.address_name ?? ''
              const displayName =
                roadAddress || jibunAddress || '알 수 없는 장소'
              const fullAddress = jibunAddress || roadAddress || ''

              addPlaceRef.current({
                id: crypto.randomUUID(),
                name: displayName,
                address: fullAddress,
                lat,
                lng,
              })
            }
            setIsGeocoding(false)
          }
        )
      }
    )
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

      const isSelected = place.id === selectedPlaceId
      const markerSize = isSelected ? '32px' : '28px'
      const markerFontSize = isSelected ? '13px' : '12px'
      const bgColor = isSelected ? '#fff' : PRIMARY_COLOR
      const textColor = isSelected ? PRIMARY_COLOR : '#fff'
      const borderStyle = isSelected ? `2px solid ${PRIMARY_COLOR}` : 'none'

      const overlayContent = document.createElement('div')
      overlayContent.style.cssText = [
        'position:relative',
        'display:inline-flex',
        'align-items:center',
        'justify-content:center',
        `min-width:${markerSize}`,
        `height:${markerSize}`,
        'padding:0 8px',
        `background:${bgColor}`,
        `color:${textColor}`,
        `font-size:${markerFontSize}`,
        'font-weight:bold',
        'border-radius:12px',
        `border:${borderStyle}`,
        'box-shadow:0 2px 6px rgba(0,0,0,0.25)',
        'cursor:default',
        'white-space:nowrap',
        'transition:all 0.2s ease',
      ].join(';')

      // 말풍선 꼬리 - 바깥 삼각형 (테두리 역할)
      const tailOuter = document.createElement('div')
      tailOuter.style.cssText = [
        'position:absolute',
        'bottom:-10px',
        'left:50%',
        'transform:translateX(-50%)',
        'width:0',
        'height:0',
        'border-left:8px solid transparent',
        'border-right:8px solid transparent',
        `border-top:10px solid ${isSelected ? PRIMARY_COLOR : PRIMARY_COLOR}`,
      ].join(';')

      // 말풍선 꼬리 - 안쪽 삼각형 (배경색으로 덮어 테두리 효과)
      const tailInner = document.createElement('div')
      tailInner.style.cssText = [
        'position:absolute',
        'bottom:-7px',
        'left:50%',
        'transform:translateX(-50%)',
        'width:0',
        'height:0',
        'border-left:6px solid transparent',
        'border-right:6px solid transparent',
        `border-top:8px solid ${bgColor}`,
      ].join(';')

      overlayContent.textContent = String(idx + 1)
      overlayContent.appendChild(tailOuter)
      overlayContent.appendChild(tailInner)

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
        path,
        strokeWeight: 5,
        strokeColor: PRIMARY_COLOR,
        strokeOpacity: 0.9,
        strokeStyle: 'solid',
      })
      polyline.setMap(map)
      polylineRef.current = polyline
    }

    if (coordPlaces.length > 0) {
      const bounds = new window.kakao.maps.LatLngBounds()
      path.forEach((p) => bounds.extend(p))
      map.setBounds(bounds)
    }
  }, [places, selectedDay, isMapReady, selectedPlaceId])

  // 선택된 장소로 지도 이동
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !selectedPlaceId) return
    const place = places.find((p) => p.id === selectedPlaceId)
    if (!place?.lat || !place?.lng) return
    map.panTo(new window.kakao.maps.LatLng(place.lat, place.lng))
  }, [selectedPlaceId, places])

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
        <div
          ref={mapRef}
          className={mapContainerStyle}
          style={{ cursor: isGeocoding ? 'wait' : 'crosshair' }}
        />
        {isGeocoding && (
          <div
            style={{
              position: 'absolute',
              top: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              background: 'rgba(0,0,0,0.6)',
              color: '#fff',
              fontSize: 12,
              padding: '4px 12px',
              borderRadius: 20,
              pointerEvents: 'none',
            }}
          >
            장소 확인 중...
          </div>
        )}
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
