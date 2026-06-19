import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const refreshToken = request.cookies.get('refresh_token')

  if (!refreshToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile/:path/edit'],
}
