import { Product, Shop } from '@/constants/data';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { NextResponse } from 'next/server';
import { columns } from './product-tables/columns';
import { ProductTable } from './product-tables';

type ProductListingPage = {};

export default async function ProductListingPage({}: ProductListingPage) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/getProducts`,
    {
      headers: { Cookie: `session=${session.value}` },
      cache: 'no-store'
    }
  );

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();

  const totalProducts = data.length;
  const products: Product[] = data;

  return (
    <ProductTable
      data={products}
      totalItems={totalProducts}
      columns={columns}
    />
  );
}
