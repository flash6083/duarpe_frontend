'use client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { ShopKeeper } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import { CellAction } from './cell-action';

export const columns: ColumnDef<ShopKeeper>[] = [
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
      placeholder: 'Search shops...',
      variant: 'text',
      icon: Text
    }
  },
  {
    accessorKey: 'phone',
    header: 'Phone Number'
  },
  {
    accessorKey: 'email',
    header: 'Email Id'
  },
  {
    accessorKey: 'isActive',
    header: 'Is Active'
  },
  {
    accessorKey: 'createdByType',
    header: 'Created By'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
