import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import AdminViewPage from '@/features/admins/components/admin-view-page';
import { NextResponse } from 'next/server';
import { Suspense } from 'react';
export const metadata = {
  title: 'Dashboard : Admin Details'
};

type PageProps = { params: Promise<{ adminId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  const adminView = await AdminViewPage({ adminId: params.adminId });
  if (adminView instanceof NextResponse) {
    return adminView;
  }

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>{adminView}</Suspense>
      </div>
    </PageContainer>
  );
}
