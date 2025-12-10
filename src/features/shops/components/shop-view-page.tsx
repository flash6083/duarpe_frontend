/* eslint-disable no-console */
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { NextResponse } from 'next/server';
import { toast } from 'sonner';
import ShopForm from './shop-form';

type TShopViewPageProps = {
  shopId: string;
};

export default async function ShopViewPage({ shopId }: TShopViewPageProps) {
  let shop = null;
  let pageTitle = 'Create New Shop';

  if (shopId !== 'new') {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');

    if (!session) {
      console.log('No session found');
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/shops/getOneShop/${shopId}`,
      {
        headers: { Cookie: `session=${session.value}` },
        cache: 'no-store'
      }
    );

    if (!res.ok) {
      console.log('Res is', res);
      toast.error('Failed to fetch shop data');
      notFound();
    }

    // ✅ Fix here
    shop = await res.json();

    if (!shop) {
      console.log('Shop not found');
      toast.error('Shop not found');
      notFound();
    }
    pageTitle = `Edit Shop`;
  }

  return <ShopForm initialData={shop} pageTitle={pageTitle} />;
}
