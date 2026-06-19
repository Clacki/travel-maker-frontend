'use client'

import { useState, useRef, useEffect } from 'react'
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

const valueClampedStyle = css({
  fontSize: 'sm',
  color: 'text.primary',
  fontWeight: 'medium',
  whiteSpace: 'pre-line',
})

const valueExpandedStyle = css({
  fontSize: 'sm',
  color: 'text.primary',
  fontWeight: 'medium',
  whiteSpace: 'pre-line',
})

const toggleButtonStyle = css({
  fontSize: 'xs',
  color: 'primary',
  cursor: 'pointer',
  mt: '0.5',
  background: 'none',
  border: 'none',
  padding: '0',
  textAlign: 'left',
})

function InfoGridItem({ label, value }: InfoItem) {
  const [expanded, setExpanded] = useState(false)
  const [isOverflow, setIsOverflow] = useState(false)
  const valueRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = valueRef.current
    if (!el) return
    setIsOverflow(el.scrollHeight > el.clientHeight)
  }, [value])

  return (
    <div className={itemStyle}>
      <dt className={labelStyle}>{label}</dt>
      <dd
        ref={valueRef}
        className={expanded ? valueExpandedStyle : valueClampedStyle}
        style={
          !expanded
            ? {
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
              }
            : undefined
        }
        title={value}
      >
        {value}
      </dd>
      {isOverflow && (
        <button
          type="button"
          className={toggleButtonStyle}
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded ? 'true' : 'false'}
        >
          {expanded ? '접기 ▲' : '더보기 ▼'}
        </button>
      )}
    </div>
  )
}

export default function InfoGrid({ items }: InfoGridProps) {
  return (
    <dl className={gridStyle}>
      {items.map((item, index) =>
        item.label ? (
          <InfoGridItem
            key={item.label}
            label={item.label}
            value={item.value}
          />
        ) : (
          <div key={index} aria-hidden="true" />
        )
      )}
    </dl>
  )
}
