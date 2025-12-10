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
    enableColumnFilter: true,
    filterFn: (row, id, value) =>
      row
        .getValue<string>(id)
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    meta: {
      placeholder: 'Search sub-categories...',
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
    accessorKey: 'isActive',
    header: 'Is Active'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
