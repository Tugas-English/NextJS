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
import { BookMarked, Eye, MoreHorizontal, Plus, Search } from "lucide-react";
import Link from "next/link";

// Data dummy untuk demo
const modules = [
    {
        id: "1",
        title: "Modul Berpikir Kritis",
        description: "Pengenalan konsep berpikir kritis dan analisis",
        skill: "reading",
        hotsType: "analyze",
        difficulty: 3,
        activitiesCount: 5,
        isPublished: true,
        createdAt: "2024-06-05",
    },
    {
        id: "2",
        title: "Modul Pemecahan Masalah",
        description: "Strategi pemecahan masalah kompleks",
        skill: "writing",
        hotsType: "problem-solve",
        difficulty: 4,
        activitiesCount: 4,
        isPublished: true,
        createdAt: "2024-06-10",
    },
    {
        id: "3",
        title: "Modul Komunikasi Efektif",
        description: "Teknik komunikasi lisan dan presentasi",
        skill: "speaking",
        hotsType: "create",
        difficulty: 2,
        activitiesCount: 6,
        isPublished: false,
        createdAt: "2024-06-15",
    },
    {
        id: "4",
        title: "Modul Analisis Teks",
        description: "Metode analisis teks dan interpretasi",
        skill: "reading",
        hotsType: "analyze",
        difficulty: 3,
        activitiesCount: 5,
        isPublished: true,
        createdAt: "2024-06-20",
    },
];

const skillLabels: Record<string, string> = {
    reading: "Reading",
    listening: "Listening",
    writing: "Writing",
    speaking: "Speaking",
};

const hotsLabels: Record<string, string> = {
    analyze: "Analyze",
    evaluate: "Evaluate",
    create: "Create",
    "problem-solve": "Problem Solve",
    infer: "Infer",
};

export default function ModulesPage() {
    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-bold'>Modul Pembelajaran</h1>
                <Link href='/teacher/modules/create'>
                    <Button className='flex items-center gap-2'>
                        <Plus className='h-4 w-4' />
                        <span>Buat Modul</span>
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle>Semua Modul</CardTitle>
                            <CardDescription>
                                Kelola modul pembelajaran HOTS
                            </CardDescription>
                        </div>
                        <div className='relative w-64'>
                            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                            <Input
                                type='search'
                                placeholder='Cari modul...'
                                className='pl-8'
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Judul Modul</TableHead>
                                <TableHead>Skill</TableHead>
                                <TableHead>HOTS Type</TableHead>
                                <TableHead>Kesulitan</TableHead>
                                <TableHead>Aktivitas</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Dibuat</TableHead>
                                <TableHead className='text-right'>
                                    Aksi
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {modules.map((module) => (
                                <TableRow key={module.id}>
                                    <TableCell className='font-medium'>
                                        <div className='flex items-center gap-2'>
                                            <BookMarked className='h-4 w-4 text-muted-foreground' />
                                            {module.title}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant='outline'>
                                            {skillLabels[module.skill]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant='secondary'>
                                            {hotsLabels[module.hotsType]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex'>
                                            {Array.from({ length: 5 }).map(
                                                (_, i) => (
                                                    <span
                                                        key={i}
                                                        className={`size-2 rounded-full mx-0.5 ${
                                                            i <
                                                            module.difficulty
                                                                ? "bg-primary"
                                                                : "bg-muted"
                                                        }`}
                                                    />
                                                )
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {module.activitiesCount}
                                    </TableCell>
                                    <TableCell>
                                        {module.isPublished ? (
                                            <Badge>Dipublikasi</Badge>
                                        ) : (
                                            <Badge variant='outline'>
                                                Draft
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>{module.createdAt}</TableCell>
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
                                                    <Eye className='h-4 w-4 mr-2' />
                                                    Lihat Detail
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    Duplikat
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    {module.isPublished
                                                        ? "Batalkan Publikasi"
                                                        : "Publikasikan"}
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
