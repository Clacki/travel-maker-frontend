import type { ReactNode } from 'react'
import { css, cx } from '@/styled-system/css'

const layoutContainerStyle = css({
  w: 'full',
  maxW: '1280px',
  mx: 'auto',
  px: { base: '4', md: '6', lg: '8' },
})

interface LayoutContainerProps {
  children: ReactNode
  className?: string
}

export function LayoutContainer({ children, className }: LayoutContainerProps) {
  return <div className={cx(layoutContainerStyle, className)}>{children}</div>
}
