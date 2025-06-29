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
import { Course } from "@/db/schema";

interface GetCoursesTableColumnsProps {
    onRowAction: (action: DataTableRowAction<Course>) => void;
}

export function getCoursesTableColumns({
    onRowAction,
}: GetCoursesTableColumnsProps): ColumnDef<Course>[] {
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
            header: ({ column }: { column: Column<Course, unknown> }) => (
                <DataTableColumnHeader column={column} title='Judul Kelas' />
            ),
            cell: ({ row }) => (
                <div className='font-medium'>{row.getValue("title")}</div>
            ),
            meta: {
                label: "Judul Kelas",
                placeholder: "Cari judul...",
                variant: "text",
            },
            enableColumnFilter: true,
        },
        {
            id: "primarySkill",
            accessorKey: "primarySkill",
            header: ({ column }: { column: Column<Course, unknown> }) => (
                <DataTableColumnHeader column={column} title='Skill Utama' />
            ),
            cell: ({ row }) => {
                const skill = row.getValue<string>("primarySkill");
                const skillLabels = {
                    reading: "Reading",
                    listening: "Listening",
                    writing: "Writing",
                    speaking: "Speaking",
                    mixed: "Campuran",
                };
                return (
                    <Badge variant='outline' className='capitalize'>
                        {skillLabels[skill as keyof typeof skillLabels] ||
                            skill}
                    </Badge>
                );
            },
            meta: {
                label: "Skill Utama",
                variant: "multiSelect",
                options: [
                    { label: "Reading", value: "reading" },
                    { label: "Listening", value: "listening" },
                    { label: "Writing", value: "writing" },
                    { label: "Speaking", value: "speaking" },
                    { label: "Campuran", value: "mixed" },
                ],
            },
            enableColumnFilter: true,
        },
        {
            id: "students",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title='Siswa' />
            ),
            cell: ({ row }) => {
                // TODO: Replace with actual student count from junction table
                const maxStudents = row.original.maxStudents;
                return (
                    <div className='text-sm'>
                        <span className='font-medium'>0</span>
                        <span className='text-muted-foreground'>
                            /{maxStudents}
                        </span>
                    </div>
                );
            },
        },
        {
            id: "dateRange",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title='Periode' />
            ),
            cell: ({ row }) => {
                const startDate = row.original.startDate;
                const endDate = row.original.endDate;
                return (
                    <div className='text-sm'>
                        {formatDate(startDate)} - {formatDate(endDate)}
                    </div>
                );
            },
            enableColumnFilter: true,
            meta: {
                label: "Periode",
                variant: "dateRange",
                icon: CalendarIcon,
            },
        },
        {
            id: "isActive",
            accessorKey: "isActive",
            header: ({ column }: { column: Column<Course, unknown> }) => (
                <DataTableColumnHeader column={column} title='Status' />
            ),
            cell: ({ row }) => {
                const isActive = row.getValue<boolean>("isActive");
                return (
                    <Badge variant={isActive ? "default" : "outline"}>
                        {isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                );
            },
            meta: {
                label: "Status",
                variant: "multiSelect",
                options: [
                    { label: "Aktif", value: "true" },
                    { label: "Nonaktif", value: "false" },
                ],
            },
            enableColumnFilter: true,
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const isActive = row.original.isActive;
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
                                        variant: isActive
                                            ? "deactivate"
                                            : "activate",
                                        row,
                                    })
                                }
                            >
                                {isActive ? "Nonaktifkan" : "Aktifkan"}
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
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
}
