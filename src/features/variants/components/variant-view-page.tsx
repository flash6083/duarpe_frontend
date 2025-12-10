/* eslint-disable no-console */
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { NextResponse } from 'next/server';
import { toast } from 'sonner';
import VariantForm from './variant-form';

type TVariantViewPageProps = {
  variantId: string;
};

export default async function VariantViewPage({
  variantId
}: TVariantViewPageProps) {
  let variant = null;
  let pageTitle = 'Create New Variant';

  if (variantId !== 'new') {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');

    if (!session) {
      console.log('No session found');
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/getVariant/${variantId}`,
      {
        headers: { Cookie: `session=${session.value}` },
        cache: 'no-store'
      }
    );

    if (!res.ok) {
      console.log('Res is', res);
      toast.error('Failed to fetch variant data');
      notFound();
    }

    // ✅ Fix here
    variant = await res.json();

    if (!variant) {
      console.log('Variant not found');
      toast.error('Variant not found');
      notFound();
    }
    pageTitle = `Edit variant`;
  }

  return <VariantForm initialData={variant} pageTitle={pageTitle} />;
}
