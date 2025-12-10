'use client';

import { Variant } from '@/constants/data';
import { VariantTable } from './index';
import { useVariantColumns } from './columns';

export default function VariantClientWrapper({
  variants,
  totalVariants
}: {
  variants: Variant[];
  totalVariants: number;
}) {
  const columns = useVariantColumns(); // SAFE: client hook in client file

  return (
    <VariantTable
      data={variants}
      totalItems={totalVariants}
      columns={columns}
    />
  );
}
