'use client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Shop } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Shop>[] = [
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
    accessorKey: 'panNumber',
    header: 'PAN Number'
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
    accessorKey: 'district',
    header: 'District'
  },
  {
    accessorKey: 'state',
    header: 'State'
  },
  {
    accessorKey: 'pin',
    header: 'Pin'
  },
  {
    accessorKey: 'gstin',
    header: 'GSTIN'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
