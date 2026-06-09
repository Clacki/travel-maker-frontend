'use client'

import { css } from '@/styled-system/css'

interface InfoItem {
  label: string
  value: string
}

interface InfoGridProps {
  items: InfoItem[]
}

const gridStyle = css({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '3',
  pt: '4',
  borderTopWidth: '1px',
  borderColor: 'border.subtle',
})

const itemStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1',
})

const labelStyle = css({
  fontSize: 'xs',
  color: 'text.secondary',
})

const valueStyle = css({
  fontSize: 'sm',
  color: 'text.primary',
  fontWeight: 'medium',
})

export default function InfoGrid({ items }: InfoGridProps) {
  return (
    <dl className={gridStyle}>
      {items.map((item, index) =>
        item.label ? (
          <div key={item.label} className={itemStyle}>
            <dt className={labelStyle}>{item.label}</dt>
            <dd className={valueStyle}>{item.value}</dd>
          </div>
        ) : (
          <div key={index} aria-hidden="true" />
        )
      )}
    </dl>
  )
}
