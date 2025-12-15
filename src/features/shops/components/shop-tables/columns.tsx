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
      <DataTableColumnHeader column={column} title="Name" />
    ),
    enableGlobalFilter: true
  },
  {
    accessorKey: 'panNumber',
    header: 'PAN Number',
    enableGlobalFilter: true
  },
  {
    accessorKey: 'gstin',
    header: 'GSTIN',
    enableGlobalFilter: true
  },
  {
    accessorKey: 'district',
    header: 'District',
    enableGlobalFilter: true
  },
  {
    accessorKey: 'state',
    header: 'State',
    enableGlobalFilter: true
  },
  {
    accessorKey: 'pin',
    header: 'Pin',
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
