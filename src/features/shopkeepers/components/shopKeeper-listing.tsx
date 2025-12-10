import { ShopKeeper } from '@/constants/data';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { NextResponse } from 'next/server';
import { ShopKeeperTable } from './shopKeeper-tables';
import { columns } from './shopKeeper-tables/columns';

type ShopKeeperListingPage = {};

export default async function ShopKeeperListingPage({}: ShopKeeperListingPage) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/shops/getShopkeepers`,
    {
      headers: { Cookie: `session=${session.value}` },
      cache: 'no-store'
    }
  );

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();

  const totalShopKeepers = data.length;
  const shopKeepers: ShopKeeper[] = data;

  return (
    <ShopKeeperTable
      data={shopKeepers}
      totalItems={totalShopKeepers}
      columns={columns}
    />
  );
}
