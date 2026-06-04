'use client'

import { motion } from 'framer-motion'
import type { TravelCategory } from '@/types/travel.types'
import { css } from '@/styled-system/css'
import { PolaroidCard } from './PolaroidCard'

interface CategoryCardProps {
  category: TravelCategory
  index: number
  style: { left: string; top: string; rotate: number; zIndex: number }
}

export function CategoryCard({ category, index, style }: CategoryCardProps) {
  return (
    <motion.div
      className={css({
        position: 'absolute',
        w: { base: '140px', md: '165px', lg: '180px' },
        h: { base: '196px', md: '231px', lg: '252px' },
      })}
      style={{ left: style.left, top: style.top, zIndex: style.zIndex }}
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
      <PolaroidCard image={category.image} alt={category.name}>
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
      </PolaroidCard>
    </motion.div>
  )
}
