import { Variant } from '@/constants/data';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import VariantClientWrapper from './variant-tables/VariantClientWrapper';

export default async function VariantListingPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');

  if (!session) {
    notFound();
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/getVariants`,
    {
      headers: { Cookie: `session=${session.value}` },
      cache: 'no-store'
    }
  );

  if (!res.ok) {
    notFound();
  }

  const variants: Variant[] = await res.json();

  return (
    <VariantClientWrapper variants={variants} totalVariants={variants.length} />
  );
}
