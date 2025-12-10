/* eslint-disable no-console */
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { NextResponse } from 'next/server';
import { toast } from 'sonner';
import AdminForm from './admin-form';

type TAdminViewPageProps = {
  adminId: string;
};

export default async function AdminViewPage({ adminId }: TAdminViewPageProps) {
  let admin = null;
  let pageTitle = 'Create New Admin';

  if (adminId !== 'new') {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');

    if (!session) {
      console.log('No session found');
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/superadmins/admin/getAdmin/${adminId}`,
      {
        headers: { Cookie: `session=${session.value}` },
        cache: 'no-store'
      }
    );

    if (!res.ok) {
      console.log('Res is', res);
      toast.error('Failed to fetch admin data');
      notFound();
    }

    // ✅ Fix here
    admin = await res.json();

    if (!admin) {
      console.log('Admin not found');
      toast.error('Admin not found');
      notFound();
    }
    pageTitle = `Edit Admin`;
  }

  return <AdminForm initialData={admin} pageTitle={pageTitle} />;
}
