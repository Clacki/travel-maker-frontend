import type { ReactNode } from 'react'
import { Header } from '@/components/layout'
import { css } from '@/styled-system/css'

const overlayHeaderStyle = css({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bg: 'transparent',
  borderBottomWidth: '0',
})

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className={css({ position: 'relative', minH: '100vh' })}>
      <Header className={overlayHeaderStyle} />
      {children}
    </div>
  )
}
