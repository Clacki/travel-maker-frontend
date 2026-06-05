import type { ReactNode } from 'react'
import { Footer, Header } from '@/components/layout'
import { css } from '@/styled-system/css'

export default function PagesLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        minH: '100vh',
      })}
    >
      <Header />
      <main className={css({ flex: 1, minW: 0 })}>{children}</main>
      <Footer />
    </div>
  )
}
