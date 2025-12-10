import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import CategoryViewPage from '@/features/categories/components/category-view-page';
import { NextResponse } from 'next/server';
import { Suspense } from 'react';
export const metadata = {
  title: 'Dashboard : Category Details'
};

type PageProps = { params: Promise<{ categoryId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  const categoryView = await CategoryViewPage({
    categoryId: params.categoryId
  });
  if (categoryView instanceof NextResponse) {
    return categoryView;
  }

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>{categoryView}</Suspense>
      </div>
    </PageContainer>
  );
}
