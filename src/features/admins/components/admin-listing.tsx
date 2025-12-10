import { Admin } from '@/constants/data';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { NextResponse } from 'next/server';
import { AdminTable } from './admin-tables';
import { columns } from './admin-tables/columns';

type AdminListingPage = {};

export default async function AdminListingPage({}: AdminListingPage) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/superadmins/admin/getAdmins`,
    {
      headers: { Cookie: `session=${session.value}` },
      cache: 'no-store'
    }
  );

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();

  const totalAdmins = data.length;
  const admins: Admin[] = data;

  return (
    <AdminTable data={admins} totalItems={totalAdmins} columns={columns} />
  );
}
