/* eslint-disable no-console */
// app/api/auth/me/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');

    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/superadmins/`, {
      headers: { Cookie: `session=${session.value}` },
      cache: 'no-store'
    });

    if (!res.ok) {
      return NextResponse.json({ user: null }, { status: res.status });
    }

    const data = await res.json();

    console.log('I am in the custom auth me route', data);

    return NextResponse.json({ user: data }, { status: 200 });
  } catch (err) {
    console.error('Error fetching user:', err);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
