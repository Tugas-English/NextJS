"use client";

import { Activitie } from "@/db/schema";
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

interface GetActivitiesTableColumnsProps {
    skillCounts: Record<string, number>;
    hotsTypeCounts: Record<string, number>;
    difficultyRange: { min: number; max: number };
    onRowAction: (action: DataTableRowAction<Activitie>) => void;
}

export function getActivitiesTableColumns({
    onRowAction,
}: GetActivitiesTableColumnsProps): ColumnDef<Activitie>[] {
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
            id: "title",
            accessorKey: "title",
            header: ({ column }: { column: Column<Activitie, unknown> }) => (
                <DataTableColumnHeader column={column} title='Judul' />
            ),
            cell: ({ row }) => (
                <div className='font-medium'>{row.getValue("title")}</div>
            ),
            meta: {
                label: "Judul",
                placeholder: "Cari judul...",
                variant: "text",
            },
            enableColumnFilter: true,
        },
        {
            id: "skill",
            accessorKey: "skill",
            header: ({ column }: { column: Column<Activitie, unknown> }) => (
                <DataTableColumnHeader column={column} title='Skill' />
            ),
            cell: ({ row }) => {
                const skill = row.getValue<string>("skill");
                return (
                    <Badge variant='outline' className='capitalize'>
                        {skill}
                    </Badge>
                );
            },
            meta: {
                label: "Skill",
                variant: "multiSelect",
                options: [
                    { label: "Reading", value: "reading" },
                    { label: "Listening", value: "listening" },
                    { label: "Writing", value: "writing" },
                    { label: "Speaking", value: "speaking" },
                ],
            },
            enableColumnFilter: true,
        },
        {
            id: "hotsType",
            accessorKey: "hotsType",
            header: ({ column }: { column: Column<Activitie, unknown> }) => (
                <DataTableColumnHeader column={column} title='Tipe HOTS' />
            ),
            cell: ({ row }) => {
                const hotsType = row.getValue<string>("hotsType");
                return (
                    <Badge variant='secondary' className='capitalize'>
                        {hotsType}
                    </Badge>
                );
            },
            meta: {
                label: "Tipe HOTS",
                variant: "multiSelect",
                options: [
                    { label: "Analyze", value: "analyze" },
                    { label: "Evaluate", value: "evaluate" },
                    { label: "Create", value: "create" },
                    { label: "Problem Solve", value: "problem-solve" },
                    { label: "Infer", value: "infer" },
                ],
            },
            enableColumnFilter: true,
        },
        {
            id: "difficulty",
            accessorKey: "difficulty",
            header: ({ column }: { column: Column<Activitie, unknown> }) => (
                <DataTableColumnHeader column={column} title='Kesulitan' />
            ),
            cell: ({ row }) => {
                const difficulty = row.getValue<number>("difficulty");
                return (
                    <Badge
                        variant={
                            difficulty <= 2
                                ? "outline"
                                : difficulty <= 4
                                ? "secondary"
                                : "destructive"
                        }
                    >
                        Level {difficulty}
                    </Badge>
                );
            },
            meta: {
                label: "Kesulitan",
                variant: "range",
            },
            enableColumnFilter: true,
        },
        {
            id: "isPublished",
            accessorKey: "isPublished",
            header: ({ column }: { column: Column<Activitie, unknown> }) => (
                <DataTableColumnHeader column={column} title='Status' />
            ),
            cell: ({ row }) => {
                const isPublished = row.getValue<boolean>("isPublished");
                return (
                    <Badge variant={isPublished ? "default" : "outline"}>
                        {isPublished ? "Dipublikasi" : "Draft"}
                    </Badge>
                );
            },
            meta: {
                label: "Status",
                variant: "multiSelect",
                options: [
                    { label: "Dipublikasi", value: "true" },
                    { label: "Draft", value: "false" },
                ],
            },
            enableColumnFilter: true,
        },
        {
            id: "createdAt",
            accessorKey: "createdAt",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title='Created At' />
            ),
            cell: ({ cell }) => formatDate(cell.getValue<Date>()),
            meta: {
                label: "Created At",
                variant: "dateRange",
                icon: CalendarIcon,
            },
            enableColumnFilter: true,
        },
        {
            id: "updatedAt",
            accessorKey: "updatedAt",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title='Updated At' />
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
                                View
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
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
}
