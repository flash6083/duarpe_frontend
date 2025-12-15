'use client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Category } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    enableGlobalFilter: true
  },
  {
    accessorKey: 'summary',
    header: 'Summary',
    cell: ({ row }) => {
      const summary = row.getValue('summary') as string;

      return <span className='block max-w-[200px] truncate'>{summary}</span>;
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
