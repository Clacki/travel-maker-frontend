import Image from 'next/image'
import errorStatusImage from '@/assets/images/status/error-status.svg'
import { css } from '@/styled-system/css'

interface ExploreEmptyProps {
  onClearFilters: () => void
}

export function ExploreEmpty({ onClearFilters }: ExploreEmptyProps) {
  return (
    <div className={css({ textAlign: 'center', py: 20 })}>
      <Image
        src={errorStatusImage}
        alt=""
        className={css({
          mx: 'auto',
          mb: 4,
          w: '380px',
          h: '380px',
          objectFit: 'contain',
        })}
      />
      <p
        className={css({
          fontSize: 'lg',
          color: 'text.secondary',
          mb: 4,
        })}
      >
        조건에 맞는 여행지가 없습니다
      </p>
      <button
        type="button"
        onClick={onClearFilters}
        className={css({
          px: 6,
          py: 3,
          bg: 'primary',
          color: 'text.inverse',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          border: 'none',
          _hover: { opacity: 0.88 },
        })}
      >
        필터 초기화하기
      </button>
    </div>
  )
}
