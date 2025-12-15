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
    enableGlobalFilter: true
  },
  {
    accessorKey: 'phone',
    header: 'Phone Number',
    enableGlobalFilter: true
  },
  {
    accessorKey: 'email',
    header: 'Email Id',
    enableGlobalFilter: true
  },
  {
    accessorKey: 'isActive',
    header: 'Is Active',
    enableGlobalFilter: true
  },
  {
    accessorKey: 'createdByType',
    header: 'Created By',
    enableGlobalFilter: true
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
