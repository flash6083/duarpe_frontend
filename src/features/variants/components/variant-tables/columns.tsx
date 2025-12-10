// columns.tsx
'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { ColumnDef, Column } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Text } from 'lucide-react';
import { Variant } from '@/constants/data';
import { CellAction } from './cell-action';
import { useVariantFilterOptions } from './options';

export function useVariantColumns() {
  const { categoryOptions, subCategoryOptions } = useVariantFilterOptions();

  const columns: ColumnDef<Variant>[] = useMemo(() => {
    return [
      // -------- PRODUCT NAME --------
      {
        id: 'productName',
        accessorKey: 'productName',
        header: ({ column }: { column: Column<Variant, unknown> }) => (
          <DataTableColumnHeader column={column} title='Product Name' />
        ),
        cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,
        meta: {
          label: 'Product Name',
          placeholder: 'Search variants...',
          variant: 'text',
          icon: Text
        },
        enableColumnFilter: true
      },

      // -------- THUMBNAIL IMAGE --------
      {
        id: 'thumbnailImage',
        accessorKey: 'thumbnailImage',
        header: 'Thumbnail',
        cell: ({ row }) => {
          const url = row.getValue<string>('thumbnailImage');
          return (
            <div className='relative h-[50px] w-[50px]'>
              <Image
                src={url}
                alt='Thumbnail'
                fill
                sizes='50px'
                className='rounded object-cover'
              />
            </div>
          );
        }
      },

      // -------- CATEGORY FILTER --------
      // columns.tsx
      {
        id: 'categoryId', // Changed
        accessorKey: 'categoryId', // Changed to use ID
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Category' />
        ),
        cell: ({ row }) => {
          // Display the name but filter by ID
          return <span>{row.original.categoryName}</span>;
        },
        enableColumnFilter: true,
        meta: {
          label: 'Category',
          variant: 'multiSelect',
          options: categoryOptions // These already use IDs as values
        }
      },

      // -------- SUB-CATEGORY FILTER --------

      {
        id: 'subcategoryId', // Changed
        accessorKey: 'subcategoryId', // Changed to use ID
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Sub-category' />
        ),
        cell: ({ row }) => {
          // Display the name but filter by ID
          return <span>{row.original.subcategoryName}</span>;
        },
        enableColumnFilter: true,
        meta: {
          label: 'Sub-category',
          variant: 'multiSelect',
          options: subCategoryOptions // These already use IDs as values
        }
      },

      // -------- DETAILS --------
      {
        accessorKey: 'details',
        header: 'Details',
        cell: ({ row }) => (
          <span className='block max-w-[200px] truncate'>
            {row.getValue('details')}
          </span>
        )
      },

      // -------- PRICE FIELDS --------
      {
        accessorKey: 'mrp',
        header: 'MRP'
      },
      {
        accessorKey: 'discountedPrice',
        header: 'Discounted Price'
      },
      {
        accessorKey: 'gstPercent',
        header: 'GST %'
      },

      // -------- ACTIONS --------
      {
        id: 'actions',
        cell: ({ row }) => <CellAction data={row.original} />
      }
    ];
  }, [categoryOptions, subCategoryOptions]);

  return columns;
}
