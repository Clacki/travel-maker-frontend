'use client'

import { motion } from 'framer-motion'
import { Star, MapPin } from 'lucide-react'
import type { Destination } from '@/types/travel.types'
import { css } from '@/styled-system/css'
import { PolaroidCard } from './PolaroidCard'

interface DestinationCardProps {
  destination: Destination
  index: number
}

interface RatingBadgeProps {
  rating: number
}

function RatingBadge({ rating }: RatingBadgeProps) {
  return (
    <div
      className={css({
        bg: 'black/55',
        backdropFilter: 'blur(4px)',
        px: '8px',
        py: '3px',
        rounded: 'full',
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
      })}
    >
      <Star
        className={css({
          w: '12px',
          h: '12px',
          color: 'accent',
          fill: 'accent',
        })}
      />
      <span
        className={css({
          fontSize: 'xs',
          color: 'text.inverse',
          fontWeight: 'medium',
        })}
      >
        {rating}
      </span>
    </div>
  )
}

export function DestinationCard({ destination, index }: DestinationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={css({ h: '280px' })}
    >
      <PolaroidCard
        image={destination.image}
        alt={destination.name}
        sizes="(max-width: 768px) 45vw, (max-width: 1024px) 30vw, 220px"
        badge={<RatingBadge rating={destination.rating} />}
      >
        {/* 하단 스트립: 이름 + 위치 */}
        <div className={css({ textAlign: 'center', w: 'full' })}>
          <p
            className={css({
              fontSize: 'sm',
              fontWeight: 'semibold',
              color: 'text.primary',
              lineHeight: 'tight',
              mb: '2px',
            })}
          >
            {destination.name}
          </p>
          <div
            className={css({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              color: 'text.secondary',
            })}
          >
            <MapPin className={css({ w: '10px', h: '10px' })} />
            <span className={css({ fontSize: 'xs' })}>
              {destination.location}
            </span>
          </div>
        </div>
      </PolaroidCard>
    </motion.div>
  )
}
