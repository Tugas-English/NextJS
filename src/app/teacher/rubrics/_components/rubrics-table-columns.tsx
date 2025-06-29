"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type ColumnDef, type Column } from "@tanstack/react-table";
import { DataTableRowAction } from "@/types/data-table";
import { formatDate } from "@/lib/format";
import { Rubric } from "@/db/schema";

interface GetRubricsTableColumnsProps {
    onRowAction: (action: DataTableRowAction<Rubric>) => void;
}

export function getRubricsTableColumns({
    onRowAction,
}: GetRubricsTableColumnsProps): ColumnDef<Rubric>[] {
    return [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label='Select all'
                    className='translate-y-0.5'
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label='Select row'
                    className='translate-y-0.5'
                />
            ),
            enableSorting: false,
            enableHiding: false,
            size: 40,
        },
        {
            id: "name",
            accessorKey: "name",
            header: ({ column }: { column: Column<Rubric, unknown> }) => (
                <DataTableColumnHeader column={column} title='Nama Rubrik' />
            ),
            cell: ({ row }) => (
                <div className='font-medium'>{row.getValue("name")}</div>
            ),
            meta: {
                label: "Nama Rubrik",
                placeholder: "Cari nama rubrik...",
                variant: "text",
            },
            enableColumnFilter: true,
        },
        {
            id: "maxScore",
            accessorKey: "maxScore",
            header: ({ column }: { column: Column<Rubric, unknown> }) => (
                <DataTableColumnHeader column={column} title='Skor Maks' />
            ),
            cell: ({ row }) => {
                const maxScore = row.getValue<number>("maxScore");
                return <Badge variant='outline'>{maxScore} poin</Badge>;
            },
            meta: {
                label: "Skor Maks",
                variant: "range",
            },
            enableColumnFilter: true,
        },
        {
            id: "criteriaCount",
            header: ({ column }: { column: Column<Rubric, unknown> }) => (
                <DataTableColumnHeader
                    column={column}
                    title='Jumlah Kriteria'
                />
            ),
            cell: ({ row }) => {
                const criteria = row.original.criteria;
                const count = criteria ? Object.keys(criteria).length : 0;
                return <Badge variant='secondary'>{count} kriteria</Badge>;
            },
            enableSorting: false,
        },
        {
            id: "isDefault",
            accessorKey: "isDefault",
            header: ({ column }: { column: Column<Rubric, unknown> }) => (
                <DataTableColumnHeader column={column} title='Default' />
            ),
            cell: ({ row }) => {
                const isDefault = row.getValue<boolean>("isDefault");
                return (
                    <Badge variant={isDefault ? "default" : "outline"}>
                        {isDefault ? "Default" : "Biasa"}
                    </Badge>
                );
            },
            meta: {
                label: "Status Default",
                variant: "multiSelect",
                options: [
                    { label: "Default", value: "true" },
                    { label: "Biasa", value: "false" },
                ],
            },
            enableColumnFilter: true,
        },
        {
            id: "createdAt",
            accessorKey: "createdAt",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title='Dibuat Pada' />
            ),
            cell: ({ cell }) => formatDate(cell.getValue<Date>()),
            meta: {
                label: "Dibuat Pada",
                variant: "dateRange",
                icon: CalendarIcon,
            },
            enableColumnFilter: true,
        },
        {
            id: "updatedAt",
            accessorKey: "updatedAt",
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title='Diperbarui Pada'
                />
            ),
            cell: ({ cell }) => formatDate(cell.getValue<Date>()),
            enableColumnFilter: true,
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='sm'>
                                ⋮
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuItem
                                onClick={() =>
                                    onRowAction({
                                        variant: "view",
                                        row,
                                    })
                                }
                            >
                                Lihat
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() =>
                                    onRowAction({
                                        variant: "update",
                                        row,
                                    })
                                }
                            >
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() =>
                                    onRowAction({
                                        variant: "delete",
                                        row,
                                    })
                                }
                            >
                                Hapus
                            </DropdownMenuItem>
                            {!row.original.isDefault && (
                                <DropdownMenuItem
                                    onClick={() =>
                                        onRowAction({
                                            variant: "set-default",
                                            row,
                                        })
                                    }
                                >
                                    Jadikan Default
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
}
