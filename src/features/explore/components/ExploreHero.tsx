'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { css } from '@/styled-system/css'

interface ExploreHeroProps {
  bgImage: string
  heroTitle: string
  heroDesc: string
}

export function ExploreHero({
  bgImage,
  heroTitle,
  heroDesc,
}: ExploreHeroProps) {
  return (
    <section
      className={css({
        position: 'relative',
        h: { base: '260px', md: '340px' },
        overflow: 'hidden',
      })}
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={bgImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className={css({ position: 'absolute', inset: 0 })}
        >
          <Image
            src={bgImage}
            alt={heroTitle}
            fill
            className={css({ objectFit: 'cover' })}
            priority
          />
        </motion.div>
      </AnimatePresence>

      <div
        className={css({ position: 'absolute', inset: 0 })}
        style={{
          background:
            'linear-gradient(to top, var(--colors-bg-canvas) 0%, color-mix(in srgb, var(--colors-bg-canvas) 50%, transparent) 55%, transparent 100%)',
        }}
      />

      <div
        className={css({
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: { base: 6, md: 12 },
        })}
      >
        <div className={css({ maxW: '7xl', mx: 'auto' })}>
          <AnimatePresence mode="wait">
            <motion.div
              key={heroTitle}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <h1
                className={css({
                  fontSize: { base: '2xl', md: '4xl' },
                  fontWeight: 'bold',
                  color: 'text.primary',
                  mb: 1,
                })}
              >
                {heroTitle}
              </h1>
              <p className={css({ fontSize: 'sm', color: 'text.secondary' })}>
                {heroDesc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
