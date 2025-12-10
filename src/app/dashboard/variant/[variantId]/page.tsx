import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import VariantViewPage from '@/features/variants/components/variant-view-page';
import { NextResponse } from 'next/server';
import { Suspense } from 'react';
export const metadata = {
  title: 'Dashboard : Product Variant Details'
};

type PageProps = { params: Promise<{ variantId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  const variantView = await VariantViewPage({
    variantId: params.variantId
  });
  if (variantView instanceof NextResponse) {
    return variantView;
  }

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>{variantView}</Suspense>
      </div>
    </PageContainer>
  );
}
