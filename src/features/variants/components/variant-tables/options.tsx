// options.ts
'use client';

import { useEffect, useState } from 'react';

export type Option = {
  label: string;
  value: string;
};

export function useVariantFilterOptions() {
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Fetch categories
        const catRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories/getCategories`,
          { credentials: 'include' }
        );
        const catData = await catRes.json();

        setCategoryOptions(
          catData.map((c: any) => ({
            label: c.name,
            value: c.id
          }))
        );

        // Fetch sub-categories
        const subRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories/getSubCategories`,
          { credentials: 'include' }
        );
        const subData = await subRes.json();

        setSubCategoryOptions(
          subData.map((s: any) => ({
            label: s.name,
            value: s.id
          }))
        );
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    };

    load();
  }, []);

  return {
    categoryOptions,
    subCategoryOptions,
    loading
  };
}
