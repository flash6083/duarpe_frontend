'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Product } from '@/constants/data';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, Text, XCircle } from 'lucide-react';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    enableColumnFilter: true,
    filterFn: (row, id, value) =>
      row
        .getValue<string>(id)
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    meta: {
      placeholder: 'Search products...',
      variant: 'text',
      icon: Text
    }
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description = row.getValue('description') as string;

      return (
        <span className='block max-w-[200px] truncate'>{description}</span>
      );
    }
  },
  {
    accessorKey: 'summary',
    header: 'Summary',
    cell: ({ row }) => {
      const summary = row.getValue('summary') as string;

      return <span className='block max-w-[200px] truncate'>{summary}</span>;
    }
  },
  {
    accessorKey: 'categoryName',
    header: 'Category',
    cell: ({ row }) => {
      const categoryName = row.getValue('categoryName') as string;

      return (
        <span className='block max-w-[200px] truncate'>{categoryName}</span>
      );
    }
  },

  {
    accessorKey: 'subcategoryName',
    header: 'Sub-Category',
    cell: ({ row }) => {
      const subcategoryName = row.getValue('subcategoryName') as string;

      return (
        <span className='block max-w-[200px] truncate'>{subcategoryName}</span>
      );
    }
  },
  {
    accessorKey: 'hsnCode',
    header: 'HSN Code'
  },

  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
