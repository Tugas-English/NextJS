"use client";
import type { DataTableRowAction } from "@/types/data-table";
import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getRubricsTableColumns } from "./rubrics-table-columns";
import { RubricsTableActionBar } from "./rubrics-table-actions-bar";
import { DeleteRubricsDialog } from "./rubrics-delete-dialog";
import { Rubric } from "@/db/schema";
import { getRubrics } from "@/lib/actions/rubrics";

interface RubricsTableProps {
    promises: Promise<[Awaited<ReturnType<typeof getRubrics>>]>;
}

export function RubricsTable({ promises }: RubricsTableProps) {
    const [{ data, pageCount }] = React.use(promises);
    const router = useRouter();

    const [rowAction, setRowAction] =
        React.useState<DataTableRowAction<Rubric> | null>(null);

    const handleRowAction = React.useCallback(
        (action: DataTableRowAction<Rubric>) => {
            try {
                if (!action.row?.id) return;

                switch (action.variant) {
                    case "view":
                        router.push(`/teacher/rubrics/${action.row.id}`);
                        break;
                    case "update":
                        router.push(`/teacher/rubrics/${action.row.id}/edit`);
                        break;
                    case "delete":
                        setRowAction(action);
                        break;
                    default:
                        console.warn("Unknown action variant:", action.variant);
                }
            } catch (error) {
                toast.error(`Navigation error: ${error}`);
            }
        },
        [router]
    );

    const columns = React.useMemo(
        () =>
            getRubricsTableColumns({
                onRowAction: handleRowAction,
            }),
        [handleRowAction]
    );

    const { table } = useDataTable({
        data,
        columns,
        pageCount,
        initialState: {
            sorting: [{ id: "createdAt", desc: true }],
            columnPinning: { right: ["actions"] },
        },
        getRowId: (originalRow) => originalRow.id,
        shallow: false,
        clearOnDefault: true,
    });

    return (
        <>
            <DataTable
                table={table}
                actionBar={<RubricsTableActionBar table={table} />}
            >
                <DataTableToolbar table={table}>
                    <DataTableSortList table={table} />
                </DataTableToolbar>
            </DataTable>
            <DeleteRubricsDialog
                open={rowAction?.variant === "delete"}
                onOpenChange={() => setRowAction(null)}
                rubrics={
                    rowAction?.row.original ? [rowAction?.row.original] : []
                }
                showTrigger={false}
                onSuccess={() => rowAction?.row.toggleSelected(false)}
            />
        </>
    );
}
