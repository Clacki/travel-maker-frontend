'use client'

import dynamic from 'next/dynamic'
import { css } from '@/styled-system/css'

const MapSection = dynamic(() => import('./MapSection'), {
  ssr: false,
  loading: () => (
    <div
      className={css({
        borderRadius: 'lg',
        borderWidth: '1px',
        borderColor: 'border.subtle',
        overflow: 'hidden',
        w: 'full',
        h: '260px',
        bg: 'bg.subtle',
        animation: 'pulse',
      })}
    />
  ),
})

export default MapSection
