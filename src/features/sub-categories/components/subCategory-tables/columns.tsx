'use client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Shop, subCategory } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import { CellAction } from './cell-action';

export const columns: ColumnDef<subCategory>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    enableGlobalFilter: true
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description = row.getValue('description') as string;

      return (
        <span className='block max-w-[200px] truncate'>{description}</span>
      );
    },
    enableGlobalFilter: true
  },
  {
    accessorKey: 'categoryName',
    header: 'Category',
    cell: ({ row }) => {
      const categoryName = row.getValue('categoryName') as string;

      return (
        <span className='block max-w-[200px] truncate'>{categoryName}</span>
      );
    },
    enableGlobalFilter: true
  },
  {
    accessorKey: 'isActive',
    header: 'Is Active',
    enableGlobalFilter: true
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
