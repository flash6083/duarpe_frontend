'use client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Admin } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Admin>[] = [
  {
    accessorKey: 'firstName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='First name' />
    ),
    enableGlobalFilter: true
  },
  {
    accessorKey: 'lastName',
    header: 'Last name',
    enableGlobalFilter: true
  },
  {
    accessorKey: 'email',
    header: 'Email',
    enableGlobalFilter: true
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone number',
    enableGlobalFilter: true
  },
  {
    accessorKey: 'isActive',
    header: 'Is active',
    enableGlobalFilter: true
  },
  {
    accessorKey: 'createdBy',
    header: 'Created by',
    enableGlobalFilter: true
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
