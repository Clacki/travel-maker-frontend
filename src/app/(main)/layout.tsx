import type { ReactNode } from 'react'
import { Footer, Header } from '@/components/layout'
import { css } from '@/styled-system/css'

const overlayHeaderWrapperStyle = css({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 50,
})

const overlayHeaderStyle = css({
  bg: 'transparent',
  borderBottomWidth: '0',
})

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        position: 'relative',
        display: 'flex',
        flexDir: 'column',
        minH: '100vh',
      })}
    >
      <div className={overlayHeaderWrapperStyle}>
        <Header className={overlayHeaderStyle} />
      </div>
      <main className={css({ flex: 1, minW: 0 })}>{children}</main>
      <Footer />
    </div>
  )
}
