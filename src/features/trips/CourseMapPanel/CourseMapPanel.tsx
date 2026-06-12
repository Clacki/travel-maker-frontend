'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { isAxiosError } from 'axios'

import { useCourseStore } from '@/store/tripsStore'
import { Button } from '@/components/common/button/Button'
import { updateTrip } from '@/features/trips/api/tripsApi'
import {
  postRoute,
  type CreateRouteRequest,
} from '@/features/trips/api/routesApi'
import { getTags, type Tag } from '@/features/trips/api/placesApi'
import type { CreateTripPayload } from '@/features/trips/types/trips.types'
import { ROUTES } from '@/constants/routes'

import { css } from '@/styled-system/css'

interface CourseMapPanelProps {
  mode?: 'create' | 'edit'
  tripId?: string
}

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

export function CourseMapPanel({
  mode = 'create',
  tripId,
}: CourseMapPanelProps) {
  const router = useRouter()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<KakaoMapInstance | null>(null)
  const overlaysRef = useRef<KakaoOverlay[]>([])
  const polylineRef = useRef<KakaoPolyline | null>(null)
  const [createError, setCreateError] = useState<string | null>(null)
  const [geocodeError, setGeocodeError] = useState<string | null>(null)
  const [isGeocoding, setIsGeocoding] = useState(false)
  const isGeocodingRef = useRef(false)
  const [regionTags, setRegionTags] = useState<Tag[]>([])
  const [themeTags, setThemeTags] = useState<Tag[]>([])
  const overlayContentsRef = useRef<
    Array<{ id: string; el: HTMLDivElement; tailInner: HTMLDivElement }>
  >([])

  const title = useCourseStore((s) => s.title)
  const description = useCourseStore((s) => s.description)
  const selectedRegion = useCourseStore((s) => s.selectedRegion)
  const selectedThemes = useCourseStore((s) => s.selectedThemes)
  const selectedDay = useCourseStore((s) => s.selectedDay)
  const selectedPlaceId = useCourseStore((s) => s.selectedPlaceId)
  const dateRange = useCourseStore((s) => s.dateRange)
  const places = useCourseStore((s) => s.places)
  const estimatedHours = useCourseStore((s) => s.estimatedHours)
  const estimatedMinutes = useCourseStore((s) => s.estimatedMinutes)
  const isDirty = useCourseStore((s) => s.isDirty)
  const resetCourse = useCourseStore((s) => s.resetCourse)
  const addPlace = useCourseStore((s) => s.addPlace)
  const focusLocation = useCourseStore((s) => s.focusLocation)

  useEffect(() => {
    isGeocodingRef.current = isGeocoding
  }, [isGeocoding])

  // 생성 페이지 이탈 시에만 코스 데이터 초기화 (수정 페이지는 초기화 불필요)
  useEffect(() => {
    return () => {
      if (mode === 'create') {
        resetCourse()
      }
    }
  }, [mode, resetCourse])

  // 지역/테마 태그 마운트 시 1회 조회
  useEffect(() => {
    Promise.all([getTags('지역'), getTags('테마')])
      .then(([r, t]) => {
        setRegionTags(r)
        setThemeTags(t)
      })
      .catch(() => {})
  }, [])

  // 검색 패널에서 장소 선택 시 지도 이동
  useEffect(() => {
    if (!focusLocation || !mapInstanceRef.current || !window.kakao?.maps) {
      return
    }
    const latlng = new window.kakao.maps.LatLng(
      focusLocation.lat,
      focusLocation.lng
    )
    mapInstanceRef.current.panTo(latlng)
  }, [focusLocation])

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

    // 지도 클릭 → Geocoder로 주소 변환 → 코스에 장소 추가
    const geocoder = new window.kakao.maps.services.Geocoder()

    window.kakao.maps.event.addListener(
      map,
      'click',
      (mouseEvent: { latLng: KakaoLatLng }) => {
        if (isGeocodingRef.current) {
          return
        }

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
            } else {
              setGeocodeError('해당 위치의 주소를 찾을 수 없습니다.')
              setTimeout(() => setGeocodeError(null), 3000)
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

    overlayContentsRef.current = []

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
        'border:none',
        'box-shadow:0 2px 6px rgba(0,0,0,0.25)',
        'cursor:default',
        'white-space:nowrap',
        'transition:all 0.2s ease',
      ].join(';')

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
        `border-top:10px solid ${PRIMARY_COLOR}`,
      ].join(';')

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
        `border-top:8px solid ${PRIMARY_COLOR}`,
      ].join(';')

      overlayContent.textContent = String(idx + 1)
      overlayContent.appendChild(tailOuter)
      overlayContent.appendChild(tailInner)

      overlayContentsRef.current.push({
        id: place.id,
        el: overlayContent,
        tailInner,
      })

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
  }, [places, selectedDay])

  // 선택된 장소 마커 스타일 업데이트 + 지도 이동
  // selectedPlaceId 변경 시에만 실행되어 전체 마커 재생성 방지
  useEffect(() => {
    if (!mapInstanceRef.current || !window.kakao?.maps) {
      return
    }

    overlayContentsRef.current.forEach(({ id, el, tailInner }) => {
      const isSelected = id === selectedPlaceId
      const bgColor = isSelected ? '#fff' : PRIMARY_COLOR
      const textColor = isSelected ? PRIMARY_COLOR : '#fff'
      el.style.background = bgColor
      el.style.color = textColor
      el.style.border = isSelected ? `2px solid ${PRIMARY_COLOR}` : 'none'
      el.style.minWidth = isSelected ? '32px' : '28px'
      el.style.height = isSelected ? '32px' : '28px'
      el.style.fontSize = isSelected ? '13px' : '12px'
      tailInner.style.borderTopColor = bgColor
    })

    if (!selectedPlaceId) {
      return
    }
    const place = places.find((p) => p.id === selectedPlaceId)
    if (!place?.lat || !place?.lng) {
      return
    }
    mapInstanceRef.current.panTo(
      new window.kakao.maps.LatLng(place.lat, place.lng)
    )
  }, [selectedPlaceId, places])

  const buildUpdatePayload = (
    region: string,
    from: Date
  ): CreateTripPayload => ({
    title,
    description,
    region,
    startDate: from.toISOString().split('T')[0],
    endDate: (dateRange?.to ?? from).toISOString().split('T')[0],
    visibility: 'public',
    places: places.map((p, i) => ({
      id: p.id,
      name: p.name,
      address: p.address,
      order: i + 1,
    })),
  })

  const handleCreateTrip = async () => {
    if (!selectedRegion || !dateRange?.from) {
      return
    }

    setCreateError(null)

    try {
      const regionTag = regionTags.find((t) => t.tag_name === selectedRegion)
      if (!regionTag) {
        setCreateError('지역 태그를 찾을 수 없습니다.')
        return
      }

      const themeTagIds = selectedThemes
        .map((t) => themeTags.find((tag) => tag.tag_name === t)?.id)
        .filter((id): id is number => id !== undefined)

      // days 배열 — place_ids는 backendId가 있는 장소만 포함, 빈 배열인 day는 제외
      const dayMap = new Map<number, number[]>()
      places.forEach((p) => {
        if (!dayMap.has(p.dayIndex)) {
          dayMap.set(p.dayIndex, [])
        }
        if (p.backendId !== undefined) {
          dayMap.get(p.dayIndex)!.push(p.backendId)
        }
      })
      const days = Array.from(dayMap.entries())
        .map(([day_index, place_ids]) => ({ day_index, place_ids }))
        .filter((d) => d.place_ids.length > 0)

      const payload: CreateRouteRequest = {
        title,
        description: description || undefined,
        region_tag_id: regionTag.id,
        theme_tag_ids: themeTagIds.length > 0 ? themeTagIds : undefined,
        start_date: dateRange.from.toISOString().split('T')[0],
        end_date: (dateRange?.to ?? dateRange.from).toISOString().split('T')[0],
        days,
      }

      await postRoute(payload)
      resetCourse()
      router.push(ROUTES.TRIPS)
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          router.push(ROUTES.LOGIN)
          return
        }
        if (error.response?.status === 403) {
          setCreateError('경로를 생성할 권한이 없습니다.')
          return
        }
        if (error.response?.status === 400) {
          setCreateError('입력 정보를 확인해주세요.')
          return
        }
      }
      setCreateError('코스 등록에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleUpdateTrip = async () => {
    if (!tripId || !selectedRegion || !dateRange?.from) {
      return
    }

    setCreateError(null)
    try {
      await updateTrip(
        tripId,
        buildUpdatePayload(selectedRegion, dateRange.from)
      )
      router.push(ROUTES.TRIP_DETAIL(tripId))
    } catch {
      setCreateError('코스 수정에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const isValid =
    title.trim().length > 0 &&
    selectedRegion !== null &&
    dateRange?.from !== undefined &&
    places.length >= 2

  const isSaveEnabled = mode === 'edit' ? isDirty && isValid : isValid

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
            마커를 클릭해 코스에 장소를 추가할 수 있어요
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
          onClick={mode === 'edit' ? handleUpdateTrip : handleCreateTrip}
        >
          {mode === 'edit' ? '코스 저장하기' : '코스 등록하기'}
        </Button>
      </div>
    </div>
  )
}

export default CourseMapPanel
