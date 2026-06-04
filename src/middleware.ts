import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // refresh_token은 HttpOnly Cookie로 발급되므로 서버에서 읽기 가능
  const isLoggedIn = !!request.cookies.get('refresh_token')
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
