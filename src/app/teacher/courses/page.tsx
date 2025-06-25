"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
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
    BookOpen,
    FileText,
    GraduationCap,
    MoreHorizontal,
    Plus,
    Search,
    Settings,
    Users,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Data dummy untuk demo
const courses = [
    {
        id: "1",
        name: "Bahasa Inggris 10A",
        description: "Kelas bahasa Inggris untuk siswa kelas 10 jurusan IPA",
        level: "10",
        students: 32,
        modules: 5,
        assignments: 12,
        activities: 24,
        averageScore: 82,
        schedule: "Senin & Rabu, 08:00 - 09:30",
        createdAt: "2023-08-15",
    },
    {
        id: "2",
        name: "HOTS Lanjutan",
        description: "Kelas pengembangan keterampilan berpikir tingkat tinggi",
        level: "11",
        students: 28,
        modules: 4,
        assignments: 10,
        activities: 18,
        averageScore: 85,
        schedule: "Selasa & Kamis, 10:00 - 11:30",
        createdAt: "2023-08-20",
    },
    {
        id: "3",
        name: "Menulis Kreatif",
        description:
            "Kelas pengembangan keterampilan menulis kreatif dan argumentatif",
        level: "12",
        students: 25,
        modules: 3,
        assignments: 8,
        activities: 15,
        averageScore: 88,
        schedule: "Jumat, 13:00 - 15:00",
        createdAt: "2023-09-05",
    },
    {
        id: "4",
        name: "English Speaking Club",
        description:
            "Klub ekstrakurikuler untuk pengembangan keterampilan berbicara",
        level: "All",
        students: 20,
        modules: 2,
        assignments: 6,
        activities: 12,
        averageScore: 80,
        schedule: "Rabu, 15:30 - 17:00",
        createdAt: "2023-09-10",
    },
];

const topStudents = [
    {
        id: "1",
        name: "Andi Pratama",
        class: "Bahasa Inggris 10A",
        score: 95,
        avatar: "/avatars/student-1.jpg",
    },
    {
        id: "3",
        name: "Citra Dewi",
        class: "HOTS Lanjutan",
        score: 93,
        avatar: "/avatars/student-3.jpg",
    },
    {
        id: "2",
        name: "Budi Santoso",
        class: "Menulis Kreatif",
        score: 91,
        avatar: "/avatars/student-2.jpg",
    },
    {
        id: "4",
        name: "Deni Kurniawan",
        class: "Bahasa Inggris 10A",
        score: 89,
        avatar: "/avatars/student-4.jpg",
    },
    {
        id: "5",
        name: "Eka Putri",
        class: "HOTS Lanjutan",
        score: 88,
        avatar: "/avatars/student-5.jpg",
    },
];

const recentAssignments = [
    {
        id: "1",
        title: "Analisis Artikel Berita",
        class: "Bahasa Inggris 10A",
        dueDate: "2024-07-15",
        submissions: "28/32",
        avgScore: 85,
    },
    {
        id: "2",
        title: "Menulis Esai Argumentatif",
        class: "HOTS Lanjutan",
        dueDate: "2024-07-10",
        submissions: "25/28",
        avgScore: 78,
    },
    {
        id: "3",
        title: "Presentasi Solusi Masalah",
        class: "Menulis Kreatif",
        dueDate: "2024-07-20",
        submissions: "18/25",
        avgScore: null,
    },
];

export default function CoursesPage() {
    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-bold'>Kelas</h1>
                <Link href='/teacher/courses/create'>
                    <Button className='flex items-center gap-2'>
                        <Plus className='h-4 w-4' />
                        <span>Buat Kelas Baru</span>
                    </Button>
                </Link>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Total Kelas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {courses.length}
                        </div>
                        <p className='text-xs text-muted-foreground'>
                            Aktif semester ini
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Total Siswa
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {courses.reduce(
                                (total, course) => total + course.students,
                                0
                            )}
                        </div>
                        <p className='text-xs text-muted-foreground'>
                            Dari semua kelas
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Nilai Rata-rata
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {Math.round(
                                courses.reduce(
                                    (total, course) =>
                                        total + course.averageScore,
                                    0
                                ) / courses.length
                            )}
                        </div>
                        <p className='text-xs text-muted-foreground'>
                            Dari semua kelas
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Total Tugas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {courses.reduce(
                                (total, course) => total + course.assignments,
                                0
                            )}
                        </div>
                        <p className='text-xs text-muted-foreground'>
                            Aktif & Selesai
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle>Daftar Kelas</CardTitle>
                            <CardDescription>
                                Kelola semua kelas yang Anda ajar
                            </CardDescription>
                        </div>
                        <div className='relative w-64'>
                            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                            <Input
                                type='search'
                                placeholder='Cari kelas...'
                                className='pl-8'
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama Kelas</TableHead>
                                <TableHead>Level</TableHead>
                                <TableHead>Siswa</TableHead>
                                <TableHead>Modul</TableHead>
                                <TableHead>Tugas</TableHead>
                                <TableHead>Aktivitas</TableHead>
                                <TableHead>Nilai Rata-rata</TableHead>
                                <TableHead className='text-right'>
                                    Aksi
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {courses.map((course) => (
                                <TableRow key={course.id}>
                                    <TableCell className='font-medium'>
                                        <div className='flex items-center gap-2'>
                                            <BookOpen className='h-4 w-4 text-muted-foreground' />
                                            <div>
                                                <div>{course.name}</div>
                                                <div className='text-xs text-muted-foreground'>
                                                    {course.schedule}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant='outline'>
                                            {course.level}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex items-center gap-1'>
                                            <Users className='h-3 w-3 text-muted-foreground' />
                                            <span>{course.students}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{course.modules}</TableCell>
                                    <TableCell>{course.assignments}</TableCell>
                                    <TableCell>{course.activities}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                course.averageScore >= 85
                                                    ? "default"
                                                    : "outline"
                                            }
                                        >
                                            {course.averageScore}
                                        </Badge>
                                    </TableCell>
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
                                                    <Link
                                                        href={`/teacher/courses/${course.id}`}
                                                        className='flex w-full'
                                                    >
                                                        Lihat Detail
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Link
                                                        href={`/teacher/courses/${course.id}/students`}
                                                        className='flex w-full'
                                                    >
                                                        Lihat Siswa
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Link
                                                        href={`/teacher/courses/${course.id}/assignments`}
                                                        className='flex w-full'
                                                    >
                                                        Lihat Tugas
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Link
                                                        href={`/teacher/courses/${course.id}/edit`}
                                                        className='flex w-full'
                                                    >
                                                        Edit Kelas
                                                    </Link>
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

            <Tabs defaultValue='students'>
                <TabsList className='grid w-full grid-cols-2'>
                    <TabsTrigger value='students'>Siswa Terbaik</TabsTrigger>
                    <TabsTrigger value='assignments'>Tugas Terbaru</TabsTrigger>
                </TabsList>

                <TabsContent value='students' className='mt-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Siswa dengan Performa Terbaik</CardTitle>
                            <CardDescription>
                                Berdasarkan nilai rata-rata dari semua kelas
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-4'>
                                {topStudents.map((student, index) => (
                                    <div
                                        key={student.id}
                                        className='flex items-center justify-between border-b pb-3 last:border-0'
                                    >
                                        <div className='flex items-center gap-3'>
                                            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-medium'>
                                                {index + 1}
                                            </div>
                                            <Avatar className='h-10 w-10'>
                                                <AvatarImage
                                                    src={student.avatar}
                                                    alt={student.name}
                                                />
                                                <AvatarFallback>
                                                    {student.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className='font-medium'>
                                                    {student.name}
                                                </div>
                                                <div className='text-xs text-muted-foreground'>
                                                    {student.class}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge
                                            variant={
                                                student.score >= 90
                                                    ? "default"
                                                    : "outline"
                                            }
                                        >
                                            {student.score}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant='outline' className='w-full'>
                                <Link
                                    href='/teacher/students'
                                    className='flex w-full justify-center'
                                >
                                    Lihat Semua Siswa
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value='assignments' className='mt-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Tugas Terbaru</CardTitle>
                            <CardDescription>
                                Tugas yang sedang berjalan di semua kelas
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-4'>
                                {recentAssignments.map((assignment) => (
                                    <div
                                        key={assignment.id}
                                        className='flex justify-between items-center border-b pb-3 last:border-0'
                                    >
                                        <div>
                                            <div className='flex items-center gap-2'>
                                                <FileText className='h-4 w-4 text-muted-foreground' />
                                                <span className='font-medium'>
                                                    {assignment.title}
                                                </span>
                                            </div>
                                            <div className='text-xs text-muted-foreground mt-1'>
                                                {assignment.class} • Tenggat:{" "}
                                                {assignment.dueDate}
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-4'>
                                            <div className='text-sm'>
                                                <div className='text-right'>
                                                    {assignment.submissions}
                                                </div>
                                                <div className='text-xs text-muted-foreground'>
                                                    Pengumpulan
                                                </div>
                                            </div>
                                            {assignment.avgScore ? (
                                                <Badge>
                                                    {assignment.avgScore}
                                                </Badge>
                                            ) : (
                                                <Badge variant='outline'>
                                                    Belum dinilai
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant='outline' className='w-full'>
                                <Link
                                    href='/teacher/assignments'
                                    className='flex w-full justify-center'
                                >
                                    Lihat Semua Tugas
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <Card>
                    <CardHeader>
                        <CardTitle>Aktivitas Mendatang</CardTitle>
                        <CardDescription>
                            Jadwal aktivitas di semua kelas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-4'>
                            <div className='flex items-center gap-3 border-b pb-3'>
                                <div className='flex h-10 w-10 items-center justify-center rounded-md bg-primary/10'>
                                    <BookOpen className='h-5 w-5 text-primary' />
                                </div>
                                <div>
                                    <div className='font-medium'>
                                        Sesi Bahasa Inggris 10A
                                    </div>
                                    <div className='text-xs text-muted-foreground mt-1'>
                                        Senin, 08:00 - 09:30 • Ruang 101
                                    </div>
                                </div>
                            </div>

                            <div className='flex items-center gap-3 border-b pb-3'>
                                <div className='flex h-10 w-10 items-center justify-center rounded-md bg-primary/10'>
                                    <GraduationCap className='h-5 w-5 text-primary' />
                                </div>
                                <div>
                                    <div className='font-medium'>
                                        Sesi HOTS Lanjutan
                                    </div>
                                    <div className='text-xs text-muted-foreground mt-1'>
                                        Selasa, 10:00 - 11:30 • Ruang 203
                                    </div>
                                </div>
                            </div>

                            <div className='flex items-center gap-3'>
                                <div className='flex h-10 w-10 items-center justify-center rounded-md bg-primary/10'>
                                    <FileText className='h-5 w-5 text-primary' />
                                </div>
                                <div>
                                    <div className='font-medium'>
                                        Tenggat Tugas: Analisis Artikel
                                    </div>
                                    <div className='text-xs text-muted-foreground mt-1'>
                                        Jumat, 23:59 • Bahasa Inggris 10A
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant='outline' className='w-full'>
                            <Link
                                href='/teacher/calendar'
                                className='flex w-full justify-center'
                            >
                                Lihat Kalender
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pengaturan Kelas</CardTitle>
                        <CardDescription>
                            Akses cepat ke pengaturan kelas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='grid grid-cols-2 gap-4'>
                            <Button
                                variant='outline'
                                className='h-auto flex-col items-center justify-center py-4'
                            >
                                <Users className='h-6 w-6 mb-2' />
                                <span>Kelola Siswa</span>
                            </Button>

                            <Button
                                variant='outline'
                                className='h-auto flex-col items-center justify-center py-4'
                            >
                                <FileText className='h-6 w-6 mb-2' />
                                <span>Buat Tugas</span>
                            </Button>

                            <Button
                                variant='outline'
                                className='h-auto flex-col items-center justify-center py-4'
                            >
                                <BookOpen className='h-6 w-6 mb-2' />
                                <span>Buat Modul</span>
                            </Button>

                            <Button
                                variant='outline'
                                className='h-auto flex-col items-center justify-center py-4'
                            >
                                <Settings className='h-6 w-6 mb-2' />
                                <span>Pengaturan</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
