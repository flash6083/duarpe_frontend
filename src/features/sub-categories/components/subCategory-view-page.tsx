/* eslint-disable no-console */
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { NextResponse } from 'next/server';
import { toast } from 'sonner';
import SubCategoryForm from './subCategory-form';

type TSubCategoryViewPageProps = {
  subCategoryId: string;
};

export default async function SubCategoryViewPage({
  subCategoryId
}: TSubCategoryViewPageProps) {
  let subCategory = null;
  let pageTitle = 'Create New Sub-Category';

  if (subCategoryId !== 'new') {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');

    if (!session) {
      console.log('No session found');
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories/getOneSubCategory/${subCategoryId}`,
      {
        headers: { Cookie: `session=${session.value}` },
        cache: 'no-store'
      }
    );

    if (!res.ok) {
      console.log('Res is', res);
      toast.error('Failed to fetch sub-category data');
      notFound();
    }

    // ✅ Fix here
    subCategory = await res.json();

    if (!subCategory) {
      console.log('Sub-category not found');
      toast.error('Sub-category not found');
      notFound();
    }
    pageTitle = `Edit sub-category`;
  }

  return <SubCategoryForm initialData={subCategory} pageTitle={pageTitle} />;
}
