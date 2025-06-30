'use client';
import type { DataTableRowAction } from '@/types/data-table';
import * as React from 'react';

import { DataTable } from '@/components/data-table/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import { DataTableSortList } from '@/components/data-table/data-table-sort-list';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { Module } from '@/db/schema';
import {
  getModules,
  getModuleSkillCounts,
  getModuleHotsTypeCounts,
  getDifficultyRange,
} from '@/lib/actions/modules';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getModulesTableColumns } from './modules-table-columns';
import { ModulesTableActionBar } from './modules-table-actions-bar';
import { DeleteModulesDialog } from './modules-delete-dialog';

interface ModulesTableProps {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getModules>>,
      Awaited<ReturnType<typeof getModuleSkillCounts>>,
      Awaited<ReturnType<typeof getModuleHotsTypeCounts>>,
      Awaited<ReturnType<typeof getDifficultyRange>>,
    ]
  >;
}

export function ModulesTable({ promises }: ModulesTableProps) {
  const [{ data, pageCount }, skillCounts, hotsTypeCounts, difficultyRange] =
    React.use(promises);
  const router = useRouter();

  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<Module> | null>(null);

  const handleRowAction = React.useCallback(
    (action: DataTableRowAction<Module>) => {
      try {
        if (!action.row?.id) return;

        switch (action.variant) {
          case 'view':
            router.push(`/teacher/modules/${action.row.id}`);
            break;
          case 'update':
            router.push(`/teacher/modules/${action.row.id}/edit`);
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
      getModulesTableColumns({
        skillCounts,
        hotsTypeCounts,
        difficultyRange,
        onRowAction: handleRowAction,
      }),
    [skillCounts, hotsTypeCounts, difficultyRange, handleRowAction],
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
        actionBar={<ModulesTableActionBar table={table} />}
      >
        <DataTableToolbar table={table}>
          <DataTableSortList table={table} />
        </DataTableToolbar>
      </DataTable>
      <DeleteModulesDialog
        open={rowAction?.variant === 'delete'}
        onOpenChange={() => setRowAction(null)}
        modules={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
    </>
  );
}
