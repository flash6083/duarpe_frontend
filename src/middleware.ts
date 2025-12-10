/* eslint-disable no-console */
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  // Only protect dashboard
  if (!req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  const session = req.cookies.get('session')?.value;
  if (!session) {
    url.pathname = '/auth/sign-in';
    return NextResponse.redirect(url);
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const res = await fetch(`${apiUrl}/getAdminOrSuperAdmin/me`, {
      headers: { cookie: `session=${session}` },
      credentials: 'include',
      cache: 'no-store'
    });

    // ❌ If both fail, redirect to sign-in
    if (!res.ok) {
      console.log('Invalid session, redirecting to sign-in');
      url.pathname = '/auth/sign-in';
      return NextResponse.redirect(url);
    }

    // ✅ If the user just hits /dashboard (or with trailing slash)
    //    redirect them to /dashboard/overview
    if (
      req.nextUrl.pathname === '/dashboard' ||
      req.nextUrl.pathname === '/dashboard/'
    ) {
      url.pathname = '/dashboard/overview';
      return NextResponse.redirect(url);
    }

    // ✅ Otherwise, allow access to other dashboard subpaths
    return NextResponse.next();
  } catch (err) {
    console.error('middleware fetch error', err);
    url.pathname = '/auth/sign-in';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/dashboard/:path*']
};
