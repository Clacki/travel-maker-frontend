'use client'

import { MapPin } from 'lucide-react'

import { css } from '@/styled-system/css'

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
  w: 'full',
  height: '260px',
  bg: 'bg.subtle',
})

const mapPlaceholderStyle = css({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'primary',
  backgroundImage:
    'linear-gradient(30deg, transparent 49%, token(colors.border.subtle) 50%, transparent 51%), linear-gradient(150deg, transparent 49%, token(colors.border.subtle) 50%, transparent 51%)',
  backgroundSize: '72px 72px',
})

const markerStyle = css({
  width: '12',
  height: '12',
  borderRadius: 'pill',
  bg: 'bg.surface',
  boxShadow: 'sm',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const placeNameStyle = css({
  position: 'absolute',
  top: '3',
  left: '3',
  bg: 'bg.surface',
  opacity: '0.92',
  borderRadius: 'sm',
  px: '3',
  py: '2',
  fontSize: 'xs',
  color: 'text.primary',
  maxWidth: '70%',
})

const noticeStyle = css({
  position: 'absolute',
  right: '3',
  bottom: '3',
  bg: 'bg.surface',
  opacity: '0.9',
  borderRadius: 'sm',
  px: '3',
  py: '1.5',
  fontSize: 'xs',
  color: 'text.secondary',
})

export default function MapSection({ name }: MapSectionProps) {
  return (
    <div className={wrapperStyle} aria-label={`${name} 지도 영역`}>
      <div className={mapPlaceholderStyle} aria-hidden="true">
        <span className={markerStyle}>
          <MapPin size={24} />
        </span>
      </div>
      <span className={placeNameStyle}>{name}</span>
      <span className={noticeStyle}>
        데모 버전에서는 지도 기능을 제공하지 않습니다.
      </span>
    </div>
  )
}
