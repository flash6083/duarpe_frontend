'use client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Admin } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Admin>[] = [
  {
    accessorKey: 'firstName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='First name' />
    ),
    enableColumnFilter: true,
    filterFn: (row, id, value) =>
      row
        .getValue<string>(id)
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    meta: {
      placeholder: 'Search admins...',
      variant: 'text',
      icon: Text
    }
  },
  {
    accessorKey: 'lastName',
    header: 'Last name'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone number'
  },
  {
    accessorKey: 'isActive',
    header: 'Is active'
  },
  {
    accessorKey: 'createdBy',
    header: 'Created by'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
