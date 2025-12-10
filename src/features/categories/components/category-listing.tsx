import { Category } from '@/constants/data';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { NextResponse } from 'next/server';
import { CategoryTable } from './category-tables';
import { columns } from './category-tables/columns';

type CategoryListingPage = {};

export default async function CategoryListingPage({}: CategoryListingPage) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/categories/getCategories`,
    {
      headers: { Cookie: `session=${session.value}` },
      cache: 'no-store'
    }
  );

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();

  const totalCategories = data.length;
  const categories: Category[] = data;

  return (
    <CategoryTable
      data={categories}
      totalItems={totalCategories}
      columns={columns}
    />
  );
}
