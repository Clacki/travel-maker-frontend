'use client'

import Image from 'next/image'
import { css } from '@/styled-system/css'

interface PolaroidCardProps {
  image: string
  alt: string
  sizes?: string
  /** 이미지 위에 올릴 배지 (평점 등) */
  badge?: React.ReactNode
  /** 하단 흰색 스트립 안에 들어갈 내용 */
  children: React.ReactNode
  className?: string
}

/**
 * 공통 폴라로이드 카드 베이스
 * - 상단·좌·우 흰 패딩 (프레임)
 * - 이미지 자체 둥근 모서리
 * - 하단 흰 텍스트 스트립
 * CategoryCard / DestinationCard 가 이 컴포넌트를 래핑해서 사용
 */
export function PolaroidCard({
  image,
  alt,
  sizes = '(max-width: 768px) 140px, (max-width: 1024px) 165px, 180px',
  badge,
  children,
  className,
}: PolaroidCardProps) {
  return (
    <div
      className={
        css({
          display: 'flex',
          flexDir: 'column',
          h: 'full',
          rounded: '2xl',
          bg: 'bg.surface',
          pt: '8px',
          px: '8px',
          pb: 0,
          /* TODO: Design Token 추가 필요 — shadows.lg (현재 'lg' 토큰 없음) */
          shadow: '0 12px 40px rgba(0,0,0,0.20), 0 2px 8px rgba(0,0,0,0.08)',
          cursor: 'pointer',
          '& .polaroid-image': { transition: 'transform 500ms' },
          '&:hover .polaroid-image': { transform: 'scale(1.06)' },
        }) + (className ? ` ${className}` : '')
      }
    >
      {/* 이미지 영역 */}
      <div
        className={css({
          position: 'relative',
          flex: '0 0 80%',
          overflow: 'hidden',
          rounded: 'lg',
        })}
      >
        <Image
          src={image}
          alt={alt}
          fill
          sizes={sizes}
          className={css({ objectFit: 'cover' }) + ' polaroid-image'}
        />
        {badge && (
          <div
            className={css({ position: 'absolute', top: '8px', right: '8px' })}
          >
            {badge}
          </div>
        )}
      </div>

      {/* 하단 흰 텍스트 스트립 */}
      <div
        className={css({
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          py: '4px',
        })}
      >
        {children}
      </div>
    </div>
  )
}
