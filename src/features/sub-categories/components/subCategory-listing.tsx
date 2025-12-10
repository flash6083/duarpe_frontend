import { Shop, subCategory } from '@/constants/data';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { NextResponse } from 'next/server';
import { SubCategoryTable } from './subCategory-tables';
import { columns } from './subCategory-tables/columns';

type SubCategoryListingPage = {};

export default async function SubCategoryListingPage({}: SubCategoryListingPage) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/categories/getSubCategories`,
    {
      headers: { Cookie: `session=${session.value}` },
      cache: 'no-store'
    }
  );

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();

  const totalSubCategories = data.length;
  const subCategories: subCategory[] = data;

  return (
    <SubCategoryTable
      data={subCategories}
      totalItems={totalSubCategories}
      columns={columns}
    />
  );
}
