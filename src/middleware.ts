import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const isLoggedIn = !!request.cookies.get('access_token')
  const isDetailPage = request.nextUrl.pathname.startsWith('/detail')

  if (isDetailPage && !isLoggedIn) {
    const redirectUrl = new URL('/', request.url)
    redirectUrl.searchParams.set('showLogin', 'true')
    return NextResponse.redirect(redirectUrl)
  }
}

export const config = {
  matcher: ['/detail/:path*'],
}
