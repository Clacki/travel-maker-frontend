import { buttonRecipe } from '@/components/common/button/Button'
import { css, cx } from '@/styled-system/css'

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

const placeholderStyle = css({
  width: '100%',
  height: '180px',
  bg: 'bg.muted',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'text.secondary',
  fontSize: 'sm',
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
})

const mapButtonStyle = css({
  position: 'absolute',
  top: '3',
  right: '3',
})

export default function MapSection({
  name,
  latitude,
  longitude,
}: MapSectionProps) {
  const kakaoMapUrl = `https://map.kakao.com/link/map/${encodeURIComponent(name)},${latitude},${longitude}`

  return (
    <div className={wrapperStyle}>
      <div className={placeholderStyle} aria-label="지도 영역">
        지도
      </div>
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
