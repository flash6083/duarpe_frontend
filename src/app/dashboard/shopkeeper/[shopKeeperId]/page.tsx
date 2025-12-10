import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import ShopKeeperViewPage from '@/features/shopkeepers/components/shopKeeper-view-page';
import { NextResponse } from 'next/server';
import { Suspense } from 'react';
export const metadata = {
  title: 'Dashboard : ShopKeeper Details'
};

type PageProps = { params: Promise<{ shopKeeperId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  const shopKeeperView = await ShopKeeperViewPage({
    shopKeeperId: params.shopKeeperId
  });
  if (shopKeeperView instanceof NextResponse) {
    return shopKeeperView;
  }

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>{shopKeeperView}</Suspense>
      </div>
    </PageContainer>
  );
}
