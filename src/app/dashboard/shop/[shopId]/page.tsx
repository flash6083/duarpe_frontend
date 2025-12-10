import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import ShopViewPage from '@/features/shops/components/shop-view-page';
import { NextResponse } from 'next/server';
import { Suspense } from 'react';
export const metadata = {
  title: 'Dashboard : Shop Details'
};

type PageProps = { params: Promise<{ shopId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  const shopView = await ShopViewPage({ shopId: params.shopId });
  if (shopView instanceof NextResponse) {
    return shopView;
  }

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>{shopView}</Suspense>
      </div>
    </PageContainer>
  );
}
