'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { TravelCategory } from '@/types/travel.types'
import { css, cx } from '@/styled-system/css'

type CardPositionStyle = {
  left: string
  top: string
  rotate: number
  zIndex: number
}

interface CategoryCardProps {
  category: TravelCategory
  index: number
  style: CardPositionStyle
}

export function CategoryCard({ category, index, style }: CategoryCardProps) {
  return (
    <motion.div
      style={{
        left: style.left,
        top: style.top,
        zIndex: style.zIndex,
        position: 'absolute',
      }}
      initial={{ opacity: 0, scale: 0.8, rotate: style.rotate }}
      animate={{ opacity: 1, scale: 1, rotate: style.rotate }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: 'spring',
        stiffness: 100,
      }}
      whileHover={{
        scale: 1.12,
        zIndex: 50,
        rotate: 0,
        transition: { duration: 0.3 },
      }}
    >
      <Link
        href={`/explore?category=${category.id}`}
        className={css({
          display: 'flex',
          flexDir: 'column',
          w: { base: '140px', md: '165px', lg: '180px' },
          h: { base: '196px', md: '231px', lg: '252px' },
          rounded: '2xl',
          bg: 'bg.surface',
          pt: '8px',
          px: '8px',
          pb: 0,
          shadow: 'lg',
          cursor: 'pointer',
          textDecoration: 'none',
          '& .polaroid-image': {
            transitionProperty: 'transform',
            transitionDuration: '500ms',
          },
          '&:hover .polaroid-image': { transform: 'scale(1.06)' },
        })}
      >
        <div
          className={css({
            position: 'relative',
            flex: '0 0 80%',
            overflow: 'hidden',
            rounded: 'lg',
          })}
        >
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="(max-width: 768px) 140px, (max-width: 1024px) 165px, 180px"
            className={cx(css({ objectFit: 'cover' }), 'polaroid-image')}
          />
        </div>

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
          <h3
            className={css({
              fontSize: { base: 'xs', lg: 'sm' },
              fontWeight: 'medium',
              color: 'text.primary',
              textAlign: 'center',
            })}
          >
            {category.name}
          </h3>
        </div>
      </Link>
    </motion.div>
  )
}
