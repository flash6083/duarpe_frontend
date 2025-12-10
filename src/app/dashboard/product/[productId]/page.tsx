import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import ProductViewPage from '@/features/products/components/product-view-page';
import { NextResponse } from 'next/server';
import { Suspense } from 'react';
export const metadata = {
  title: 'Dashboard : Product Details'
};

type PageProps = { params: Promise<{ productId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  const productView = await ProductViewPage({
    productId: params.productId
  });
  if (productView instanceof NextResponse) {
    return productView;
  }

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>{productView}</Suspense>
      </div>
    </PageContainer>
  );
}
