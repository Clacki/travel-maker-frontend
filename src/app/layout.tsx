import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import localFont from 'next/font/local'
import { Footer, Header, ThemeProvider } from '@/components/layout'
import { css } from '@/styled-system/css'
import '@/styles/globals.css'

const pretendard = localFont({
  src: '../assets/fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Travel Maker',
  description: '국내 여행 취향 기반 추천 서비스',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning className={pretendard.variable}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div
            className={css({
              minH: '100vh',
              display: 'flex',
              flexDirection: 'column',
              bg: 'bg.canvas',
              color: 'text.primary',
            })}
          >
            <Header />
            <main
              className={css({
                flex: 1,
                minW: 0,
              })}
            >
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
