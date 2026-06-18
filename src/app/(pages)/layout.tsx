import { Footer, Header } from '@/components/layout'
import { css } from '@/styled-system/css'
import type { ReactNode } from 'react'

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

      <main
        className={css({
          flex: { base: '0 0 auto', md: 1 },
          minW: 0,
          pt: { base: '4', md: '6' },
          pb: { base: '4', md: '0' },
        })}
      >
        {children}
      </main>

      <Footer />
    </div>
  )
}
