import { Shop } from '@/constants/data';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { NextResponse } from 'next/server';
import { ShopTable } from './shop-tables';
import { columns } from './shop-tables/columns';

type ShopListingPage = {};

export default async function ShopListingPage({}: ShopListingPage) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shops/getShops`, {
    headers: { Cookie: `session=${session.value}` },
    cache: 'no-store'
  });

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();

  const totalShops = data.length;
  const shops: Shop[] = data;

  return <ShopTable data={shops} totalItems={totalShops} columns={columns} />;
}
