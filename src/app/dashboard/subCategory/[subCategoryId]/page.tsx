import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import SubCategoryViewPage from '@/features/sub-categories/components/subCategory-view-page';
import { NextResponse } from 'next/server';
import { Suspense } from 'react';
export const metadata = {
  title: 'Dashboard : Sub-Category Details'
};

type PageProps = { params: Promise<{ subCategoryId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  const subCategoryView = await SubCategoryViewPage({
    subCategoryId: params.subCategoryId
  });
  if (subCategoryView instanceof NextResponse) {
    return subCategoryView;
  }

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>{subCategoryView}</Suspense>
      </div>
    </PageContainer>
  );
}
