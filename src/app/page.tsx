// app/page.tsx (server)
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Page() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  // eslint-disable-next-line no-console
  console.log('Session Cookie:', sessionCookie);

  if (!sessionCookie) return redirect('/auth/sign-in');

  return redirect('/dashboard/overview');
}
