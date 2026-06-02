import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import '@/styles/globals.css'

const pretendard = localFont({
  src: '../assets/fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Travel Maker',
  description: '국내 여행 추천 서비스',
}

async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') return
  const { initMocks } = await import('../../mocks')
  return initMocks()
}

enableMocking()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
      <body className="min-h-full">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
