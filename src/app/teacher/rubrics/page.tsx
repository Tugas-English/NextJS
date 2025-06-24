"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    ClipboardList,
    Download,
    MoreHorizontal,
    Plus,
    Search,
    Upload,
} from "lucide-react";
import Link from "next/link";

// Data dummy untuk demo
const rubrics = [
    {
        id: "1",
        name: "Rubrik Standar HOTS",
        description: "Rubrik umum untuk penilaian aktivitas HOTS",
        criteriaCount: 3,
        maxScore: 100,
        isDefault: true,
        createdAt: "2024-06-10",
    },
    {
        id: "2",
        name: "Rubrik Menulis Esai",
        description: "Khusus untuk penilaian esai argumentatif",
        criteriaCount: 4,
        maxScore: 100,
        isDefault: false,
        createdAt: "2024-06-15",
    },
    {
        id: "3",
        name: "Rubrik Presentasi Lisan",
        description: "Untuk penilaian aktivitas speaking",
        criteriaCount: 5,
        maxScore: 100,
        isDefault: false,
        createdAt: "2024-06-20",
    },
    {
        id: "4",
        name: "Rubrik Analisis Teks",
        description: "Untuk aktivitas analisis bacaan",
        criteriaCount: 3,
        maxScore: 100,
        isDefault: false,
        createdAt: "2024-06-25",
    },
];

export default function RubricsPage() {
    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-bold'>Rubrik Penilaian</h1>
                <div className='flex gap-2'>
                    <Link href='/teacher/rubrics/import'>
                        <Button
                            variant='outline'
                            className='flex items-center gap-2'
                        >
                            <Upload className='h-4 w-4' />
                            <span>Import/Export</span>
                        </Button>
                    </Link>
                    <Link href='/teacher/rubrics/create'>
                        <Button className='flex items-center gap-2'>
                            <Plus className='h-4 w-4' />
                            <span>Buat Rubrik</span>
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle>Semua Rubrik</CardTitle>
                            <CardDescription>
                                Kelola rubrik penilaian untuk tugas HOTS
                            </CardDescription>
                        </div>
                        <div className='relative w-64'>
                            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                            <Input
                                type='search'
                                placeholder='Cari rubrik...'
                                className='pl-8'
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama Rubrik</TableHead>
                                <TableHead>Deskripsi</TableHead>
                                <TableHead>Kriteria</TableHead>
                                <TableHead>Skor Maks.</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Dibuat</TableHead>
                                <TableHead className='text-right'>
                                    Aksi
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rubrics.map((rubric) => (
                                <TableRow key={rubric.id}>
                                    <TableCell className='font-medium'>
                                        <div className='flex items-center gap-2'>
                                            <ClipboardList className='h-4 w-4 text-muted-foreground' />
                                            {rubric.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>{rubric.description}</TableCell>
                                    <TableCell>
                                        {rubric.criteriaCount}
                                    </TableCell>
                                    <TableCell>{rubric.maxScore}</TableCell>
                                    <TableCell>
                                        {rubric.isDefault ? (
                                            <Badge>Default</Badge>
                                        ) : (
                                            <Badge variant='outline'>
                                                Custom
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>{rubric.createdAt}</TableCell>
                                    <TableCell className='text-right'>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant='ghost'
                                                    size='sm'
                                                >
                                                    <MoreHorizontal className='h-4 w-4' />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align='end'>
                                                <DropdownMenuItem>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    Duplikat
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    {rubric.isDefault
                                                        ? "Hapus Default"
                                                        : "Jadikan Default"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Download className='h-4 w-4 mr-2' />
                                                    Export JSON
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className='text-destructive'>
                                                    Hapus
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
