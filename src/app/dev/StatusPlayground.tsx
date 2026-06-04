'use client'

import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '@/components/common/status'
import { css } from '@/styled-system/css'

const gridStyle = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', lg: 'repeat(3, minmax(0, 1fr))' },
  gap: '4',
})

const previewStyle = css({
  minH: '320px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  bg: 'bg.canvas',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'lg',
})

export function StatusPlayground() {
  return (
    <div className={gridStyle}>
      <div className={previewStyle}>
        <EmptyState />
      </div>

      <div className={previewStyle}>
        <ErrorState actionLabel="다시 시도" onAction={() => undefined} />
      </div>

      <div className={previewStyle}>
        <LoadingState />
      </div>
    </div>
  )
}
