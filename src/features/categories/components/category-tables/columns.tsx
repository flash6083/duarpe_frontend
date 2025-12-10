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
    enableColumnFilter: true,
    filterFn: (row, id, value) =>
      row
        .getValue<string>(id)
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    meta: {
      placeholder: 'Search categories...',
      variant: 'text',
      icon: Text
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
    accessorKey: 'isActive',
    header: 'Is Active'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
