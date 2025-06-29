"use client";
import type { DataTableRowAction } from "@/types/data-table";
import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { ActivitiesTableActionBar } from "./activitity-table-actions-bar";
import { Activitie } from "@/db/schema";
import { getActivitiesTableColumns } from "./activitity-table-columns";
import {
    getActivities,
    getActivitySkillCounts,
    getActivityHotsTypeCounts,
    getDifficultyRange,
} from "@/lib/actions/activities";
import { DeleteActivitiesDialog } from "./activitity-delete-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ActivitiesTableProps {
    promises: Promise<
        [
            Awaited<ReturnType<typeof getActivities>>,
            Awaited<ReturnType<typeof getActivitySkillCounts>>,
            Awaited<ReturnType<typeof getActivityHotsTypeCounts>>,
            Awaited<ReturnType<typeof getDifficultyRange>>
        ]
    >;
}

export function ActivitiesTable({ promises }: ActivitiesTableProps) {
    const [{ data, pageCount }, skillCounts, hotsTypeCounts, difficultyRange] =
        React.use(promises);
    const router = useRouter();

    const [rowAction, setRowAction] =
        React.useState<DataTableRowAction<Activitie> | null>(null);

    const handleRowAction = React.useCallback(
        (action: DataTableRowAction<Activitie>) => {
            try {
                if (!action.row?.id) return;

                switch (action.variant) {
                    case "view":
                        router.push(`/teacher/activities/${action.row.id}`);
                        break;
                    case "update":
                        router.push(
                            `/teacher/activities/${action.row.id}/edit`
                        );
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
            getActivitiesTableColumns({
                skillCounts,
                hotsTypeCounts,
                difficultyRange,
                onRowAction: handleRowAction,
            }),
        [skillCounts, hotsTypeCounts, difficultyRange, handleRowAction]
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

    React.useEffect(() => {
        try {
            if (
                rowAction &&
                rowAction.variant === "view" &&
                rowAction.row &&
                rowAction.row.id
            ) {
                router.push(`/teacher/activities/${rowAction.row.id}`);
            }
        } catch (error) {
            console.error(
                "Gagal melakukan navigasi ke halaman aktivitas:",
                error
            );
        }
    }, [router, rowAction]);

    return (
        <>
            <DataTable
                table={table}
                actionBar={<ActivitiesTableActionBar table={table} />}
            >
                <DataTableToolbar table={table}>
                    <DataTableSortList table={table} />
                </DataTableToolbar>
            </DataTable>
            <DeleteActivitiesDialog
                open={rowAction?.variant === "delete"}
                onOpenChange={() => setRowAction(null)}
                activities={
                    rowAction?.row.original ? [rowAction?.row.original] : []
                }
                showTrigger={false}
                onSuccess={() => rowAction?.row.toggleSelected(false)}
            />
        </>
    );
}
