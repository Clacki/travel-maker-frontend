'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { isAxiosError } from 'axios'

import { useCourseStore } from '@/store/tripsStore'
import { Button } from '@/components/common/button/Button'
import { MAX_PLACES_PER_DAY } from '@/features/trips/types/course.types'
import {
  postRoute,
  patchRoute,
  type CreateRouteRequest,
} from '@/features/trips/api/routesApi'
import { getRegionTags, getThemeTags } from '@/features/trips/api/tagsApi'
import type { Tag } from '@/types/tag.types'
import { ROUTES } from '@/constants/routes'

import { css, cx } from '@/styled-system/css'

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

// 카카오맵 CustomOverlay DOM 생성 유틸 (컴포넌트 외부 순수 함수)
function createMarkerOverlay(
  label: string,
  color: string
): { el: HTMLDivElement; tailInner: HTMLDivElement } {
  const el = document.createElement('div')
  el.style.cssText = [
    'position:relative',
    'display:inline-flex',
    'align-items:center',
    'justify-content:center',
    'min-width:28px',
    'height:28px',
    'padding:0 8px',
    `background:${color}`,
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
    `border-top:10px solid ${color}`,
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
    `border-top:8px solid ${color}`,
  ].join(';')

  el.textContent = label
  el.appendChild(tailOuter)
  el.appendChild(tailInner)

  return { el, tailInner }
}

const panelStyle = css({
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
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
  mt: '0.5',
})

const mapBadgeStyle = css({
  bg: 'primary.soft',
  color: 'primary',
  borderRadius: 'pill',
  fontSize: 'xs',
  px: '2',
  py: '0.5',
  fontWeight: 'medium',
  flexShrink: 0,
})

const errorStyle = css({
  px: '4',
  pb: '2',
  fontSize: 'xs',
  color: 'warning',
})

const mapAreaStyle = css({
  position: 'relative',
  mx: '3',
  my: '2',
  borderRadius: 'xl',
  overflow: 'hidden',
  aspectRatio: '1 / 1',
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

const bottomBarStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '3',
  px: '4',
  py: '3',
  bg: 'bg.surface',
  flexShrink: 0,
})

const statusChipStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '1',
  px: '2',
  py: '0.5',
  borderRadius: 'pill',
  fontSize: 'xs',
  fontWeight: 'medium',
  whiteSpace: 'nowrap',
})

const statusChipDoneStyle = css({
  bg: 'primary.soft',
  color: 'primary',
})

const statusChipPendingStyle = css({
  bg: 'bg.muted',
  color: 'text.secondary',
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
  const [createError, setCreateError] = useState<string | null>(
    APP_KEY ? null : '지도 서비스를 초기화할 수 없습니다.'
  )
  const [tagLoadError, setTagLoadError] = useState<string | null>(null)
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
  const focusLocation = useCourseStore((s) => s.focusLocation)

  // 생성 페이지 이탈 시에만 코스 데이터 초기화 (수정 페이지는 초기화 불필요)
  useEffect(() => {
    return () => {
      if (mode === 'create') {
        resetCourse()
      }
    }
  }, [mode, resetCourse])

  // 지역/테마 태그 분리 조회
  useEffect(() => {
    Promise.all([getRegionTags(), getThemeTags()])
      .then(([regions, themes]) => {
        setRegionTags(regions)
        setThemeTags(themes)
      })
      .catch(() => {
        setTagLoadError(
          '지역/테마 정보를 불러오지 못했습니다. 페이지를 새로고침해주세요.'
        )
      })
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
    if (!APP_KEY) {
      return
    }

    if (window.kakao?.maps) {
      window.kakao.maps.load(initMap)
      return
    }

    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${APP_KEY}&autoload=false`
    script.onload = () => window.kakao.maps.load(initMap)
    document.head.appendChild(script)
  }, [initMap])

  const dayPlaces = useMemo(
    () => places.filter((p) => p.dayIndex === selectedDay),
    [places, selectedDay]
  )

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

    const coordPlaces = dayPlaces.filter((p) => p.lat && p.lng)
    if (coordPlaces.length === 0) {
      return
    }

    const path: KakaoLatLng[] = []
    overlayContentsRef.current = []

    coordPlaces.forEach((place, idx) => {
      const position = new window.kakao.maps.LatLng(place.lat!, place.lng!)
      path.push(position)

      const { el, tailInner } = createMarkerOverlay(
        String(idx + 1),
        PRIMARY_COLOR
      )

      overlayContentsRef.current.push({ id: place.id, el, tailInner })

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

    if (coordPlaces.length > 0) {
      const bounds = new window.kakao.maps.LatLngBounds()
      path.forEach((p) => bounds.extend(p))
      map.setBounds(bounds)
    }
  }, [dayPlaces])

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

  // day별 place_ids 빌드 — backendId 없는 장소 제외, 빈 day 제외
  const buildDays = () => {
    const dayMap = new Map<number, number[]>()
    places.forEach((p) => {
      if (!dayMap.has(p.dayIndex)) {
        dayMap.set(p.dayIndex, [])
      }
      if (p.backendId !== undefined) {
        dayMap.get(p.dayIndex)!.push(p.backendId)
      }
    })
    return Array.from(dayMap.entries())
      .map(([day_index, place_ids]) => ({ day_index, place_ids }))
      .filter((d) => d.place_ids.length > 0)
  }

  // 일차별 장소 수 제약 검증 (API: 1~5개)
  const validateDays = (
    days: { day_index: number; place_ids: number[] }[]
  ): string | null => {
    for (const day of days) {
      if (day.place_ids.length > MAX_PLACES_PER_DAY) {
        return `${day.day_index}일차 장소는 최대 ${MAX_PLACES_PER_DAY}개까지 등록할 수 있습니다.`
      }
    }
    return null
  }

  // 공통 payload 빌드 — 성공 시 payload 반환, 실패 시 null (에러 setState 처리 포함)
  const buildRoutePayload = (): CreateRouteRequest | null => {
    if (!selectedRegion || !dateRange?.from) {
      return null
    }
    const regionTag = regionTags.find((t) => t.tag_name === selectedRegion)
    if (!regionTag) {
      setCreateError('지역 태그를 찾을 수 없습니다.')
      return null
    }
    const themeTagIds = selectedThemes
      .map((t) => themeTags.find((tag) => tag.tag_name === t)?.id)
      .filter((id): id is number => id !== undefined)

    const days = buildDays()
    const dayError = validateDays(days)
    if (dayError) {
      setCreateError(dayError)
      return null
    }
    return {
      title,
      description: description || undefined,
      region_tag_id: regionTag.id,
      theme_tag_ids: themeTagIds.length > 0 ? themeTagIds : undefined,
      start_date: dateRange.from.toISOString().split('T')[0],
      end_date: (dateRange?.to ?? dateRange.from).toISOString().split('T')[0],
      days,
    }
  }

  const handleAxiosError = (error: unknown, defaultMsg: string) => {
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        router.push(ROUTES.LOGIN)
        return
      }
      if (error.response?.status === 403) {
        setCreateError('권한이 없습니다.')
        return
      }
      if (error.response?.status === 400) {
        setCreateError('입력 정보를 확인해주세요.')
        return
      }
    }
    setCreateError(defaultMsg)
  }

  const handleCreateTrip = async () => {
    setCreateError(null)
    const payload = buildRoutePayload()
    if (!payload) {
      return
    }
    try {
      await postRoute(payload)
      resetCourse()
      router.push(ROUTES.TRIPS)
    } catch (error) {
      handleAxiosError(error, '코스 등록에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleUpdateTrip = async () => {
    if (!tripId) {
      return
    }
    setCreateError(null)
    const payload = buildRoutePayload()
    if (!payload) {
      return
    }
    try {
      await patchRoute(Number(tripId), payload)
      router.push(ROUTES.TRIP_DETAIL(tripId))
    } catch (error) {
      handleAxiosError(error, '코스 수정에 실패했습니다. 다시 시도해주세요.')
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

  return (
    <div className={panelStyle}>
      {/* 지도 헤더 */}
      <div className={mapHeaderStyle}>
        <div className={mapHeaderLeftStyle}>
          <p className={mapTitleStyle}>지도 영역</p>
          <p className={mapSubtitleStyle}>{headerTitle}</p>
        </div>
        <span className={mapBadgeStyle}>카카오맵</span>
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
        </div>
      </div>

      {/* 에러 메시지 */}
      {tagLoadError && <p className={errorStyle}>{tagLoadError}</p>}
      {createError && <p className={errorStyle}>{createError}</p>}
      {/* 하단 상태 바 */}
      <div className={bottomBarStyle}>
        <span
          className={cx(
            statusChipStyle,
            places.length >= 2 ? statusChipDoneStyle : statusChipPendingStyle
          )}
        >
          {places.length >= 2 ? '✓' : '○'} 장소 {places.length}/2
        </span>
        <Button
          variant="primary"
          size="md"
          shape="pill"
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
