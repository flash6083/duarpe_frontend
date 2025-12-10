/* eslint-disable no-console */
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { NextResponse } from 'next/server';
import { toast } from 'sonner';
import ShopKeeperForm from './shopKeeper-form';

type TShopKeeperViewPageProps = {
  shopKeeperId: string;
};

export default async function ShopKeeperViewPage({
  shopKeeperId
}: TShopKeeperViewPageProps) {
  let shopKeeper = null;
  let pageTitle = 'Create New ShopKeeper';

  if (shopKeeperId !== 'new') {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');

    if (!session) {
      console.log('No session found');
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/shops/getOneShopkeeper/${shopKeeperId}`,
      {
        headers: { Cookie: `session=${session.value}` },
        cache: 'no-store'
      }
    );

    if (!res.ok) {
      console.log('Res is', res);
      toast.error('Failed to fetch shop keeper data');
      notFound();
    }

    // ✅ Fix here
    shopKeeper = await res.json();

    if (!shopKeeper) {
      console.log('ShopKeeper not found');
      toast.error('ShopKeeper not found');
      notFound();
    }
    pageTitle = `Edit ShopKeeper`;
  }

  return <ShopKeeperForm initialData={shopKeeper} pageTitle={pageTitle} />;
}
