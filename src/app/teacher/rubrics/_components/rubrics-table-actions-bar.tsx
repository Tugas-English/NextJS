"use client";

import type { Table } from "@tanstack/react-table";
import { Download, Trash2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import {
    DataTableActionBar,
    DataTableActionBarAction,
    DataTableActionBarSelection,
} from "@/components/data-table/data-table-action-bar";
import { Separator } from "@/components/ui/separator";
import { Rubric } from "@/db/schema";
import { deleteRubrics } from "@/lib/actions/rubrics";

const actions = ["export", "delete"] as const;

type Action = (typeof actions)[number];

interface ModulesTableActionProps {
    table: Table<Rubric>;
}

export function RubricsTableActionBar({ table }: ModulesTableActionProps) {
    const rows = table.getFilteredSelectedRowModel().rows;
    const [isPending, startTransition] = React.useTransition();
    const [currentAction, setCurrentAction] = React.useState<Action | null>(
        null
    );

    const getIsActionPending = React.useCallback(
        (action: Action) => isPending && currentAction === action,
        [isPending, currentAction]
    );

    const onModuleDelete = React.useCallback(() => {
        setCurrentAction("delete");
        startTransition(async () => {
            const { error } = await deleteRubrics({
                ids: rows.map((row) => row.original.id),
            });

            if (error) {
                toast.error(error);
                return;
            }
            table.toggleAllRowsSelected(false);
        });
    }, [rows, table]);

    return (
        <DataTableActionBar table={table} visible={rows.length > 0}>
            <DataTableActionBarSelection table={table} />
            <Separator
                orientation='vertical'
                className='hidden data-[orientation=vertical]:h-5 sm:block'
            />
            <div className='flex items-center gap-1.5'>
                <DataTableActionBarAction
                    size='icon'
                    tooltip='Export modules'
                    isPending={getIsActionPending("export")}
                >
                    <Download />
                </DataTableActionBarAction>
                <DataTableActionBarAction
                    size='icon'
                    tooltip='Delete modules'
                    isPending={getIsActionPending("delete")}
                    onClick={onModuleDelete}
                >
                    <Trash2 />
                </DataTableActionBarAction>
            </div>
        </DataTableActionBar>
    );
}
