import { NextRequest, NextResponse } from 'next/server'

// Pages that don't require authentication (public pages)
const PUBLIC_PAGES = ['/', '/about', '/contact']

// Auth-related pages that don't require authentication
const AUTH_PAGES = ['/auth/sign-in', '/auth/sign-up', '/api/auth', '/auth/error', '/auth/forgot-password', '/auth/reset-password']

// Pages that require authentication (protected pages)
const PROTECTED_PAGES = ['/members', '/news', '/projects', '/account']

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

  // Allow public pages (no authentication required)
  if (PUBLIC_PAGES.includes(pathname)) {
    return NextResponse.next()
  }

  // Allow auth-related pages
  if (AUTH_PAGES.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Check if this is a protected page
  const isProtectedPage = PROTECTED_PAGES.some(path => pathname.startsWith(path))
  
  if (isProtectedPage) {
    // Check for session cookie (NextAuth sets this)
    const sessionToken = request.cookies.get('authjs.session-token') || 
                        request.cookies.get('__Secure-authjs.session-token')
    
    if (!sessionToken) {
      const url = new URL('/auth/sign-in', request.nextUrl.origin)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)'],
}