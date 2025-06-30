'use client';

import { Assignment } from '@/db/schema';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type ColumnDef, type Column } from '@tanstack/react-table';
import { DataTableRowAction } from '@/types/data-table';
import { formatDate } from '@/lib/format';

interface GetAssignmentsTableColumnsProps {
  onRowAction: (action: DataTableRowAction<Assignment>) => void;
}

export function getAssignmentsTableColumns({
  onRowAction,
}: GetAssignmentsTableColumnsProps): ColumnDef<Assignment>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      id: 'title',
      accessorKey: 'title',
      header: ({ column }: { column: Column<Assignment, unknown> }) => (
        <DataTableColumnHeader column={column} title="Judul" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('title')}</div>
      ),
      meta: {
        label: 'Judul',
        placeholder: 'Cari judul...',
        variant: 'text',
      },
      enableColumnFilter: true,
    },
    {
      id: 'dueDate',
      accessorKey: 'dueDate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tenggat Waktu" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<Date>()),
      meta: {
        label: 'Tenggat Waktu',
        variant: 'dateRange',
        icon: CalendarIcon,
      },
      enableColumnFilter: true,
    },
    {
      id: 'isChallenge',
      accessorKey: 'isChallenge',
      header: ({ column }: { column: Column<Assignment, unknown> }) => (
        <DataTableColumnHeader column={column} title="Tipe" />
      ),
      cell: ({ row }) => {
        const isChallenge = row.getValue<boolean>('isChallenge');
        return (
          <Badge variant={isChallenge ? 'secondary' : 'outline'}>
            {isChallenge ? 'Challenge' : 'Tugas Biasa'}
          </Badge>
        );
      },
      meta: {
        label: 'Tipe',
        variant: 'multiSelect',
        options: [
          { label: 'Challenge', value: 'true' },
          { label: 'Tugas Biasa', value: 'false' },
        ],
      },
      enableColumnFilter: true,
    },
    {
      id: 'isPublished',
      accessorKey: 'isPublished',
      header: ({ column }: { column: Column<Assignment, unknown> }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const isPublished = row.getValue<boolean>('isPublished');
        return (
          <Badge variant={isPublished ? 'default' : 'outline'}>
            {isPublished ? 'Dipublikasi' : 'Draft'}
          </Badge>
        );
      },
      meta: {
        label: 'Status',
        variant: 'multiSelect',
        options: [
          { label: 'Dipublikasi', value: 'true' },
          { label: 'Draft', value: 'false' },
        ],
      },
      enableColumnFilter: true,
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Dibuat Pada" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<Date>()),
      meta: {
        label: 'Dibuat Pada',
        variant: 'dateRange',
        icon: CalendarIcon,
      },
      enableColumnFilter: true,
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                ⋮
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  onRowAction({
                    variant: 'view',
                    row,
                  })
                }
              >
                Lihat
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  onRowAction({
                    variant: 'update',
                    row,
                  })
                }
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  onRowAction({
                    variant: 'delete',
                    row,
                  })
                }
              >
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
