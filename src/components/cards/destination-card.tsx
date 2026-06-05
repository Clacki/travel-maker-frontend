'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { Destination } from '@/lib/travel-data'
import { css } from '@/styled-system/css'

interface DestinationCardProps {
  destination: Destination
  index: number
}

export function DestinationCard({ destination, index }: DestinationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={css({
        borderRadius: '16px',
        overflow: 'hidden',
        bg: 'card',
        border: '1px solid',
        borderColor: 'border',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        _hover: { boxShadow: '0 8px 32px rgba(0,0,0,0.14)' },
        transition: 'box-shadow 0.2s',
      })}
    >
      {/* Image section */}
      <div
        className={css({
          position: 'relative',
          h: '200px',
          w: 'full',
          overflow: 'hidden',
        })}
      >
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          className={css({ objectFit: 'cover' })}
        />

        {/* Gradient overlay bottom */}
        <div
          className={css({
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 50%)',
          })}
        />

        {/* Star rating badge — top right */}
        <div
          className={css({
            position: 'absolute',
            top: '10px',
            right: '10px',
            bg: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(6px)',
            borderRadius: '50px',
            px: '9px',
            py: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          })}
        >
          <span style={{ fontSize: '12px', lineHeight: 1 }}>⭐</span>
          <span
            className={css({
              fontSize: '12px',
              fontWeight: 700,
              color: 'white',
              lineHeight: 1,
            })}
          >
            {destination.rating}
          </span>
        </div>
      </div>

      {/* Text section */}
      <div
        className={css({
          px: '14px',
          py: '12px',
        })}
      >
        <p
          className={css({
            fontSize: 'sm',
            fontWeight: 'semibold',
            color: 'foreground',
            mb: '4px',
            lineHeight: 'tight',
          })}
        >
          {destination.name}
        </p>
        <div
          className={css({
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            color: 'muted.foreground',
          })}
        >
          <MapPin className={css({ w: '11px', h: '11px', flexShrink: 0 })} />
          <span className={css({ fontSize: 'xs' })}>
            {destination.location}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
