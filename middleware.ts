import { NextRequest, NextResponse } from 'next/server'

const WHITE_LIST = ['/auth/sign-in', '/auth/sign-up', '/api/auth', '/auth/error', '/auth/forgot-password', '/auth/reset-password']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow API routes and static files
  if (
    pathname.startsWith('/api/') || 
    pathname.startsWith('/_next/') || 
    pathname === '/favicon.ico' ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/public/')
  ) {
    return NextResponse.next()
  }

  // Allow whitelisted auth paths
  if (WHITE_LIST.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Check for session cookie (NextAuth sets this)
  const sessionToken = request.cookies.get('authjs.session-token') || 
                      request.cookies.get('__Secure-authjs.session-token')
  
  if (!sessionToken) {
    const url = new URL('/auth/sign-in', request.nextUrl.origin)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)'],
}