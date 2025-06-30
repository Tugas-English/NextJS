'use client';
import type { DataTableRowAction } from '@/types/data-table';
import * as React from 'react';

import { DataTable } from '@/components/data-table/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import { DataTableSortList } from '@/components/data-table/data-table-sort-list';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { Assignment } from '@/db/schema';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getAssignmentsTableColumns } from './assignments-table-columns';
import { DeleteAssignmentsDialog } from './assignments-delete-dialog';
import { AssignmentsTableActionBar } from './assignments-table-actions-bar';
import { getAssignments } from '@/lib/actions/assignments';

interface AssignmentsTableProps {
  promises: Promise<[Awaited<ReturnType<typeof getAssignments>>]>;
}

export function AssignmentsTable({ promises }: AssignmentsTableProps) {
  const [{ data, pageCount }] = React.use(promises);
  const router = useRouter();

  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<Assignment> | null>(null);

  const handleRowAction = React.useCallback(
    (action: DataTableRowAction<Assignment>) => {
      try {
        if (!action.row?.id) return;

        switch (action.variant) {
          case 'view':
            router.push(`/teacher/assignments/${action.row.id}`);
            break;
          case 'update':
            router.push(`/teacher/assignments/${action.row.id}/edit`);
            break;
          case 'delete':
            setRowAction(action);
            break;
          default:
            console.warn('Unknown action variant:', action.variant);
        }
      } catch (error) {
        toast.error(`Navigation error: ${error}`);
      }
    },
    [router],
  );

  const columns = React.useMemo(
    () =>
      getAssignmentsTableColumns({
        onRowAction: handleRowAction,
      }),
    [handleRowAction],
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }],
      columnPinning: { right: ['actions'] },
    },
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <>
      <DataTable
        table={table}
        actionBar={<AssignmentsTableActionBar table={table} />}
      >
        <DataTableToolbar table={table}>
          <DataTableSortList table={table} />
        </DataTableToolbar>
      </DataTable>
      <DeleteAssignmentsDialog
        open={rowAction?.variant === 'delete'}
        onOpenChange={() => setRowAction(null)}
        assignments={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
    </>
  );
}
