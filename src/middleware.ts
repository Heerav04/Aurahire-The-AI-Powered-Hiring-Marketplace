import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  const userId = request.cookies.get('userId')?.value;
  const userRole = request.cookies.get('userRole')?.value;

  const isSeekerRoute = path.startsWith('/seeker');
  const isRecruiterRoute = path.startsWith('/recruiter');
  const isAdminRoute = path.startsWith('/admin') && path !== '/admin/login';

  // 1. If trying to access any protected route without proper auth cookies, redirect to login
  if ((isSeekerRoute || isRecruiterRoute || isAdminRoute) && (!userId || !userRole)) {
    if (isAdminRoute) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Admin Verification
  if (isAdminRoute && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // 3. Seeker / Recruiter mutual exclusion redirects (admins can view both)
  if (userRole === 'seeker' && isRecruiterRoute) {
    return NextResponse.redirect(new URL('/seeker', request.url));
  }

  if (userRole === 'recruiter' && isSeekerRoute) {
    return NextResponse.redirect(new URL('/recruiter', request.url));
  }

  // 4. Redirect from login page to respective portal if already authenticated
  if (path === '/login' && userId && userRole) {
    const target = userRole === 'admin' ? '/admin' : (userRole === 'recruiter' ? '/recruiter' : '/seeker');
    return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/seeker/:path*', '/recruiter/:path*', '/admin/:path*', '/login'],
};
