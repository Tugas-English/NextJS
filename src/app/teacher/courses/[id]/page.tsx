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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Award,
    BarChart2,
    BookOpen,
    FileText,
    GraduationCap,
    LineChart,
    Mail,
    MoreHorizontal,
    Pencil,
    Plus,
    Search,
    UserPlus,
    Users,
    X,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import Link from "next/link";

// Data dummy untuk demo
const courseData = {
    id: "1",
    name: "Bahasa Inggris 10A",
    description:
        "Kelas bahasa Inggris untuk siswa kelas 10 dengan fokus pada pengembangan kemampuan HOTS.",
    coverImage: "/images/english-class.jpg",
    schedule: "Senin & Rabu, 08:00 - 09:30",
    room: "Ruang 101",
    startDate: "15 Juli 2024",
    endDate: "15 Desember 2024",
    studentsCount: 32,
    activitiesCount: 45,
    assignmentsCount: 18,
    averageScore: 82,
};

const students = [
    {
        id: "1",
        name: "Andi Pratama",
        email: "andi@example.com",
        avatar: "/avatars/student-1.jpg",
        averageScore: 92,
        completedAssignments: 16,
    },
    {
        id: "2",
        name: "Budi Santoso",
        email: "budi@example.com",
        avatar: "/avatars/student-2.jpg",
        averageScore: 85,
        completedAssignments: 15,
    },
    {
        id: "3",
        name: "Citra Dewi",
        email: "citra@example.com",
        avatar: "/avatars/student-3.jpg",
        averageScore: 90,
        completedAssignments: 17,
    },
    {
        id: "4",
        name: "Deni Kurniawan",
        email: "deni@example.com",
        avatar: "/avatars/student-4.jpg",
        averageScore: 78,
        completedAssignments: 14,
    },
    {
        id: "5",
        name: "Eka Putri",
        email: "eka@example.com",
        avatar: "/avatars/student-5.jpg",
        averageScore: 88,
        completedAssignments: 16,
    },
];

const assignments = [
    {
        id: "1",
        title: "Analisis Artikel Berita",
        dueDate: "2024-07-15",
        submissions: 28,
        totalStudents: 32,
        avgScore: 85,
    },
    {
        id: "2",
        title: "Menulis Esai Argumentatif",
        dueDate: "2024-07-10",
        submissions: 30,
        totalStudents: 32,
        avgScore: 78,
    },
    {
        id: "3",
        title: "Presentasi Solusi Masalah",
        dueDate: "2024-07-20",
        submissions: 25,
        totalStudents: 32,
        avgScore: 82,
    },
    {
        id: "4",
        title: "Evaluasi Pidato",
        dueDate: "2024-07-25",
        submissions: 20,
        totalStudents: 32,
        avgScore: null,
    },
    {
        id: "5",
        title: "Analisis Puisi",
        dueDate: "2024-08-05",
        submissions: 0,
        totalStudents: 32,
        avgScore: null,
    },
];

const modules = [
    {
        id: "1",
        title: "Modul Berpikir Kritis",
        activitiesCount: 5,
        completionRate: 80,
    },
    {
        id: "2",
        title: "Modul Analisis Teks",
        activitiesCount: 4,
        completionRate: 65,
    },
    {
        id: "3",
        title: "Modul Komunikasi Efektif",
        activitiesCount: 6,
        completionRate: 50,
    },
];

const hotsDistribution = [
    { name: "Analyze", value: 35 },
    { name: "Evaluate", value: 25 },
    { name: "Create", value: 20 },
    { name: "Problem-solve", value: 15 },
    { name: "Infer", value: 5 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const scoreDistribution = [
    { score: "90-100", count: 5 },
    { score: "80-89", count: 15 },
    { score: "70-79", count: 8 },
    { score: "60-69", count: 4 },
    { score: "< 60", count: 0 },
];

export default function CourseDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const [searchTerm, setSearchTerm] = useState("");

    // Filter siswa berdasarkan pencarian
    const filteredStudents = students.filter(
        (student) =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <div>
                    <h1 className='text-3xl font-bold'>{courseData.name}</h1>
                    <p className='text-muted-foreground'>
                        {courseData.description}
                    </p>
                </div>
                <div className='flex gap-2'>
                    <Button
                        variant='outline'
                        className='flex items-center gap-2'
                    >
                        <Pencil className='h-4 w-4' />
                        <span>Edit Kelas</span>
                    </Button>
                    <Button className='flex items-center gap-2'>
                        <UserPlus className='h-4 w-4' />
                        <span>Tambah Siswa</span>
                    </Button>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Jumlah Siswa
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {courseData.studentsCount}
                        </div>
                        <p className='text-xs text-muted-foreground'>
                            Aktif mengikuti kelas
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Aktivitas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {courseData.activitiesCount}
                        </div>
                        <p className='text-xs text-muted-foreground'>
                            Total aktivitas HOTS
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Tugas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {courseData.assignmentsCount}
                        </div>
                        <p className='text-xs text-muted-foreground'>
                            {
                                assignments.filter((a) => a.submissions === 0)
                                    .length
                            }{" "}
                            belum dimulai
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Rata-rata Nilai
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {courseData.averageScore}
                        </div>
                        <p className='text-xs text-muted-foreground'>
                            Dari semua tugas
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informasi Kelas</CardTitle>
                    <CardDescription>Detail dan jadwal kelas</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='space-y-4'>
                            <div>
                                <h3 className='text-sm font-medium text-muted-foreground'>
                                    Jadwal
                                </h3>
                                <p>{courseData.schedule}</p>
                            </div>
                            <div>
                                <h3 className='text-sm font-medium text-muted-foreground'>
                                    Ruangan
                                </h3>
                                <p>{courseData.room}</p>
                            </div>
                            <div>
                                <h3 className='text-sm font-medium text-muted-foreground'>
                                    Periode
                                </h3>
                                <p>
                                    {courseData.startDate} -{" "}
                                    {courseData.endDate}
                                </p>
                            </div>
                        </div>
                        <div className='space-y-4'>
                            <div>
                                <h3 className='text-sm font-medium'>
                                    Distribusi HOTS
                                </h3>
                                <div className='h-48 mt-2'>
                                    <ResponsiveContainer
                                        width='100%'
                                        height='100%'
                                    >
                                        <PieChart>
                                            <Pie
                                                data={hotsDistribution}
                                                cx='50%'
                                                cy='50%'
                                                labelLine={false}
                                                label={({ name, percent }) =>
                                                    `${name}: ${(
                                                        percent * 100
                                                    ).toFixed(0)}%`
                                                }
                                                outerRadius={60}
                                                fill='#8884d8'
                                                dataKey='value'
                                            >
                                                {hotsDistribution.map(
                                                    (entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={
                                                                COLORS[
                                                                    index %
                                                                        COLORS.length
                                                                ]
                                                            }
                                                        />
                                                    )
                                                )}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue='students'>
                <TabsList className='grid w-full grid-cols-4'>
                    <TabsTrigger
                        value='students'
                        className='flex items-center gap-2'
                    >
                        <Users className='h-4 w-4' />
                        <span>Siswa</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value='assignments'
                        className='flex items-center gap-2'
                    >
                        <FileText className='h-4 w-4' />
                        <span>Tugas</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value='modules'
                        className='flex items-center gap-2'
                    >
                        <BookOpen className='h-4 w-4' />
                        <span>Modul</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value='analytics'
                        className='flex items-center gap-2'
                    >
                        <BarChart2 className='h-4 w-4' />
                        <span>Analisis</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value='students' className='mt-6'>
                    <Card>
                        <CardHeader>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <CardTitle>Daftar Siswa</CardTitle>
                                    <CardDescription>
                                        {courseData.studentsCount} siswa
                                        terdaftar dalam kelas ini
                                    </CardDescription>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <div className='relative w-64'>
                                        <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                                        <Input
                                            type='search'
                                            placeholder='Cari siswa...'
                                            className='pl-8'
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                        />
                                    </div>
                                    <Button className='flex items-center gap-2'>
                                        <UserPlus className='h-4 w-4' />
                                        <span>Tambah</span>
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Rata-rata Nilai</TableHead>
                                        <TableHead>Tugas Selesai</TableHead>
                                        <TableHead className='text-right'>
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStudents.map((student) => (
                                        <TableRow key={student.id}>
                                            <TableCell>
                                                <div className='flex items-center gap-3'>
                                                    <Avatar className='h-8 w-8'>
                                                        <AvatarImage
                                                            src={student.avatar}
                                                            alt={student.name}
                                                        />
                                                        <AvatarFallback>
                                                            {student.name.charAt(
                                                                0
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className='font-medium'>
                                                        {student.name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {student.email}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        student.averageScore >=
                                                        80
                                                            ? "default"
                                                            : "outline"
                                                    }
                                                >
                                                    {student.averageScore}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className='flex items-center gap-2'>
                                                    <span>
                                                        {
                                                            student.completedAssignments
                                                        }
                                                        /
                                                        {
                                                            courseData.assignmentsCount
                                                        }
                                                    </span>
                                                    <Progress
                                                        value={
                                                            (student.completedAssignments /
                                                                courseData.assignmentsCount) *
                                                            100
                                                        }
                                                        className='w-20'
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className='text-right'>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
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
                                                                href={`/teacher/students/${student.id}`}
                                                                className='flex items-center w-full'
                                                            >
                                                                Lihat Profil
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className='flex items-center gap-2'>
                                                            <Mail className='h-4 w-4' />
                                                            <span>
                                                                Kirim Pesan
                                                            </span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className='flex items-center gap-2 text-destructive'>
                                                            <X className='h-4 w-4' />
                                                            <span>
                                                                Hapus dari Kelas
                                                            </span>
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
                </TabsContent>

                <TabsContent value='assignments' className='mt-6'>
                    <Card>
                        <CardHeader>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <CardTitle>Tugas Kelas</CardTitle>
                                    <CardDescription>
                                        Daftar tugas untuk kelas ini
                                    </CardDescription>
                                </div>
                                <Button className='flex items-center gap-2'>
                                    <Plus className='h-4 w-4' />
                                    <span>Tambah Tugas</span>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Judul Tugas</TableHead>
                                        <TableHead>Tenggat</TableHead>
                                        <TableHead>Pengumpulan</TableHead>
                                        <TableHead>Rata-rata Nilai</TableHead>
                                        <TableHead className='text-right'>
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {assignments.map((assignment) => {
                                        const submissionRate = Math.round(
                                            (assignment.submissions /
                                                assignment.totalStudents) *
                                                100
                                        );

                                        return (
                                            <TableRow key={assignment.id}>
                                                <TableCell>
                                                    <div className='flex items-center gap-2'>
                                                        <FileText className='h-4 w-4 text-muted-foreground' />
                                                        <span className='font-medium'>
                                                            {assignment.title}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {assignment.dueDate}
                                                </TableCell>
                                                <TableCell>
                                                    <div className='flex items-center gap-2'>
                                                        <span>
                                                            {submissionRate}%
                                                        </span>
                                                        <Progress
                                                            value={
                                                                submissionRate
                                                            }
                                                            className='w-20'
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {assignment.avgScore ? (
                                                        <Badge>
                                                            {
                                                                assignment.avgScore
                                                            }
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant='outline'>
                                                            Belum dinilai
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className='text-right'>
                                                    <Link
                                                        href={`/teacher/assignments/${assignment.id}`}
                                                    >
                                                        <Button
                                                            variant='outline'
                                                            size='sm'
                                                        >
                                                            Lihat Detail
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='modules' className='mt-6'>
                    <Card>
                        <CardHeader>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <CardTitle>Modul Pembelajaran</CardTitle>
                                    <CardDescription>
                                        Modul yang digunakan dalam kelas ini
                                    </CardDescription>
                                </div>
                                <Button className='flex items-center gap-2'>
                                    <Plus className='h-4 w-4' />
                                    <span>Tambah Modul</span>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                {modules.map((module) => (
                                    <Card
                                        key={module.id}
                                        className='overflow-hidden'
                                    >
                                        <div className='h-2 bg-primary' />
                                        <CardHeader>
                                            <CardTitle className='text-lg'>
                                                {module.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className='space-y-4'>
                                            <div className='flex items-center justify-between'>
                                                <span className='text-sm text-muted-foreground'>
                                                    Aktivitas:
                                                </span>
                                                <span>
                                                    {module.activitiesCount}
                                                </span>
                                            </div>
                                            <div className='space-y-1'>
                                                <div className='flex items-center justify-between'>
                                                    <span className='text-sm text-muted-foreground'>
                                                        Penyelesaian:
                                                    </span>
                                                    <span>
                                                        {module.completionRate}%
                                                    </span>
                                                </div>
                                                <Progress
                                                    value={
                                                        module.completionRate
                                                    }
                                                />
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Link
                                                href={`/teacher/modules/${module.id}`}
                                                className='w-full'
                                            >
                                                <Button
                                                    variant='outline'
                                                    className='w-full'
                                                >
                                                    Lihat Detail
                                                </Button>
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='analytics' className='mt-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Distribusi Nilai</CardTitle>
                                <CardDescription>
                                    Distribusi nilai siswa
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className='h-80'>
                                    <ResponsiveContainer
                                        width='100%'
                                        height='100%'
                                    >
                                        <BarChart
                                            data={scoreDistribution}
                                            margin={{
                                                top: 20,
                                                right: 30,
                                                left: 20,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray='3 3' />
                                            <XAxis dataKey='score' />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar
                                                dataKey='count'
                                                fill='#8884d8'
                                                name='Jumlah Siswa'
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Statistik Siswa</CardTitle>
                                <CardDescription>
                                    Berdasarkan performa
                                </CardDescription>
                            </CardHeader>
                            <CardContent className='space-y-6'>
                                <div className='border rounded-md p-4'>
                                    <h3 className='text-sm font-medium mb-3'>
                                        Siswa Terbaik
                                    </h3>
                                    <div className='space-y-4'>
                                        {students
                                            .sort(
                                                (a, b) =>
                                                    b.averageScore -
                                                    a.averageScore
                                            )
                                            .slice(0, 3)
                                            .map((student, index) => (
                                                <div
                                                    key={student.id}
                                                    className='flex items-center justify-between'
                                                >
                                                    <div className='flex items-center gap-3'>
                                                        <Badge
                                                            variant={
                                                                index === 0
                                                                    ? "default"
                                                                    : "outline"
                                                            }
                                                        >
                                                            {index + 1}
                                                        </Badge>
                                                        <Avatar className='h-8 w-8'>
                                                            <AvatarImage
                                                                src={
                                                                    student.avatar
                                                                }
                                                                alt={
                                                                    student.name
                                                                }
                                                            />
                                                            <AvatarFallback>
                                                                {student.name.charAt(
                                                                    0
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className='font-medium'>
                                                            {student.name}
                                                        </span>
                                                    </div>
                                                    <Badge>
                                                        {student.averageScore}
                                                    </Badge>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <div className='border rounded-md p-4'>
                                    <h3 className='text-sm font-medium mb-3'>
                                        Perlu Perhatian
                                    </h3>
                                    <div className='space-y-4'>
                                        {students
                                            .sort(
                                                (a, b) =>
                                                    a.averageScore -
                                                    b.averageScore
                                            )
                                            .slice(0, 3)
                                            .map((student) => (
                                                <div
                                                    key={student.id}
                                                    className='flex items-center justify-between'
                                                >
                                                    <div className='flex items-center gap-3'>
                                                        <Avatar className='h-8 w-8'>
                                                            <AvatarImage
                                                                src={
                                                                    student.avatar
                                                                }
                                                                alt={
                                                                    student.name
                                                                }
                                                            />
                                                            <AvatarFallback>
                                                                {student.name.charAt(
                                                                    0
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className='font-medium'>
                                                            {student.name}
                                                        </span>
                                                    </div>
                                                    <Badge variant='outline'>
                                                        {student.averageScore}
                                                    </Badge>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className='mt-6'>
                        <CardHeader>
                            <CardTitle>Ringkasan Analisis</CardTitle>
                            <CardDescription>
                                Analisis performa kelas secara keseluruhan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-4'>
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                    <div className='border rounded-md p-4'>
                                        <div className='flex items-center gap-2'>
                                            <Award className='h-5 w-5 text-primary' />
                                            <h3 className='font-medium'>
                                                Pencapaian
                                            </h3>
                                        </div>
                                        <p className='mt-2 text-sm text-muted-foreground'>
                                            Rata-rata nilai kelas berada di atas
                                            target minimal 75. Mayoritas siswa
                                            (62.5%) mendapatkan nilai di atas
                                            80.
                                        </p>
                                    </div>

                                    <div className='border rounded-md p-4'>
                                        <div className='flex items-center gap-2'>
                                            <GraduationCap className='h-5 w-5 text-primary' />
                                            <h3 className='font-medium'>
                                                Kemajuan
                                            </h3>
                                        </div>
                                        <p className='mt-2 text-sm text-muted-foreground'>
                                            Tingkat penyelesaian tugas mencapai
                                            85.7% untuk tugas yang sudah
                                            dimulai. Partisipasi siswa dalam
                                            aktivitas cukup tinggi.
                                        </p>
                                    </div>

                                    <div className='border rounded-md p-4'>
                                        <div className='flex items-center gap-2'>
                                            <LineChart className='h-5 w-5 text-primary' />
                                            <h3 className='font-medium'>
                                                Tren
                                            </h3>
                                        </div>
                                        <p className='mt-2 text-sm text-muted-foreground'>
                                            Terlihat peningkatan nilai rata-rata
                                            sebesar 7% dibandingkan dengan awal
                                            semester. Keterampilan HOTS yang
                                            paling berkembang adalah Analyze.
                                        </p>
                                    </div>
                                </div>

                                <div className='border rounded-md p-4'>
                                    <h3 className='font-medium mb-2'>
                                        Rekomendasi
                                    </h3>
                                    <ul className='space-y-2 text-sm text-muted-foreground'>
                                        <li className='flex items-start gap-2'>
                                            <span className='rounded-full bg-primary h-1.5 w-1.5 mt-1.5' />
                                            <span>
                                                Fokus lebih banyak pada
                                                aktivitas tipe Infer yang masih
                                                rendah (5%).
                                            </span>
                                        </li>
                                        <li className='flex items-start gap-2'>
                                            <span className='rounded-full bg-primary h-1.5 w-1.5 mt-1.5' />
                                            <span>
                                                Berikan bantuan tambahan untuk 4
                                                siswa yang mendapat nilai di
                                                bawah 70.
                                            </span>
                                        </li>
                                        <li className='flex items-start gap-2'>
                                            <span className='rounded-full bg-primary h-1.5 w-1.5 mt-1.5' />
                                            <span>
                                                Tambahkan lebih banyak aktivitas
                                                collaborative problem-solving
                                                untuk meningkatkan keterlibatan.
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className='w-full'>
                                Ekspor Analisis Lengkap
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
