/* eslint-disable no-console */
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { NextResponse } from 'next/server';
import { toast } from 'sonner';
import CategoryForm from './category-form';

type TCategoryViewPageProps = {
  categoryId: string;
};

export default async function CategoryViewPage({
  categoryId
}: TCategoryViewPageProps) {
  let category = null;
  let pageTitle = 'Create New Category';

  if (categoryId !== 'new') {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');

    if (!session) {
      console.log('No session found');
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories/getOneCategory/${categoryId}`,
      {
        headers: { Cookie: `session=${session.value}` },
        cache: 'no-store'
      }
    );

    if (!res.ok) {
      console.log('Res is', res);
      toast.error('Failed to fetch category data');
      notFound();
    }

    // ✅ Fix here
    category = await res.json();

    if (!category) {
      console.log('Category not found');
      toast.error('Category not found');
      notFound();
    }
    pageTitle = `Edit Category`;
  }

  return <CategoryForm initialData={category} pageTitle={pageTitle} />;
}
