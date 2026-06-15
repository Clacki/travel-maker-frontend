'use client'

import { useEffect, useRef, useState } from 'react'
import { buttonRecipe } from '@/components/common/button/Button'
import { css, cx } from '@/styled-system/css'

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void
        Map: new (container: HTMLElement, options: any) => any
        LatLng: new (lat: number, lng: number) => any
        Marker: new (options: any) => any
        CustomOverlay: new (options: any) => any
        Polyline: new (options: any) => any
        LatLngBounds: new () => any
        event: {
          addListener: (target: any, type: string, handler: any) => void
        }
        services: {
          Places: new () => any
          Geocoder: new () => {
            coord2Address: (
              lng: number,
              lat: number,
              callback: (result: any, status: string) => void
            ) => void
          }
          Status: { OK: string }
        }
      }
    }
  }
}

interface MapSectionProps {
  name: string
  latitude: number
  longitude: number
}

const wrapperStyle = css({
  position: 'relative',
  borderRadius: 'lg',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  overflow: 'hidden',
})

const mapContainerStyle = css({
  width: '100%',
  height: '260px',
})

const addressOverlayStyle = css({
  position: 'absolute',
  top: '3',
  left: '3',
  bg: 'bg.surface',
  opacity: '0.9',
  borderRadius: 'sm',
  px: '3',
  py: '2',
  fontSize: 'xs',
  color: 'text.primary',
  maxWidth: '60%',
  zIndex: 10,
})

const mapButtonStyle = css({
  position: 'absolute',
  top: '3',
  right: '3',
  zIndex: 10,
})

const mapSkeletonStyle = css({
  position: 'absolute',
  inset: 0,
  bg: 'bg.subtle',
  animation: 'pulse',
  zIndex: 1,
})

const APP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY

export default function MapSection({
  name,
  latitude,
  longitude,
}: MapSectionProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isMapReady, setIsMapReady] = useState(false)
  const kakaoMapUrl = `https://map.kakao.com/link/map/${encodeURIComponent(name)},${latitude},${longitude}`

  useEffect(() => {
    function renderMap() {
      if (!mapRef.current) return
      window.kakao.maps.load(() => {
        if (!mapRef.current) return
        const center = new window.kakao.maps.LatLng(latitude, longitude)
        const map = new window.kakao.maps.Map(mapRef.current, {
          center,
          level: 4,
        })
        const marker = new window.kakao.maps.Marker({ position: center })
        marker.setMap(map)
        setIsMapReady(true)
      })
    }

    if (window.kakao?.maps) {
      renderMap()
      return
    }

    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${APP_KEY}&autoload=false`
    script.async = true
    script.onload = renderMap
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [latitude, longitude])

  return (
    <div className={wrapperStyle}>
      {!isMapReady && <div className={mapSkeletonStyle} />}
      <div ref={mapRef} className={mapContainerStyle} />
      <span className={addressOverlayStyle}>{name}</span>
      <a
        href={kakaoMapUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="카카오맵에서 위치 보기"
        className={cx(
          buttonRecipe({ variant: 'primary', size: 'sm' }),
          mapButtonStyle
        )}
      >
        지도 보기
      </a>
    </div>
  )
}
