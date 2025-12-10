// app/dashboard/page.tsx (server)
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie) return redirect('/auth/sign-in');

  // if user is valid, forward them
  return redirect('/dashboard/overview');
}
