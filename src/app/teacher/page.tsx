// src/app/teacher/page.tsx
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import {
    Activity,
    Award,
    Calendar,
    FileText,
    MessageSquare,
    Plus,
} from "lucide-react";
import Link from "next/link";

const activityStats = [
    { name: "Reading", count: 45 },
    { name: "Listening", count: 32 },
    { name: "Writing", count: 28 },
    { name: "Speaking", count: 19 },
];

const hotsDistribution = [
    { name: "Analyze", value: 35 },
    { name: "Evaluate", value: 25 },
    { name: "Create", value: 20 },
    { name: "Problem-solve", value: 15 },
    { name: "Infer", value: 5 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const recentAssignments = [
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
        submissions: 25,
        totalStudents: 32,
        avgScore: 78,
    },
    {
        id: "3",
        title: "Presentasi Solusi Masalah",
        dueDate: "2024-07-20",
        submissions: 18,
        totalStudents: 32,
        avgScore: null,
    },
];

const upcomingEvents = [
    {
        id: "1",
        title: "Tenggat Tugas: Analisis Artikel Berita",
        date: "2024-07-15",
        type: "assignment",
    },
    {
        id: "2",
        title: "Tantangan Mingguan: Tulis Surat Opini tentang AI",
        date: "2024-07-07",
        type: "challenge",
    },
    {
        id: "3",
        title: "Diskusi Kelas: Dampak AI pada Pendidikan",
        date: "2024-07-08",
        type: "discussion",
    },
];

const studentPerformance = [
    { month: "Jan", avgScore: 72 },
    { month: "Feb", avgScore: 74 },
    { month: "Mar", avgScore: 76 },
    { month: "Apr", avgScore: 78 },
    { month: "Mei", avgScore: 80 },
    { month: "Jun", avgScore: 83 },
];

export default function TeacherDashboardPage() {
    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-bold'>Dashboard Guru</h1>
                <div className='flex gap-2'>
                    <Link href='/teacher/activities/create'>
                        <Button
                            variant='outline'
                            className='flex items-center gap-2'
                        >
                            <Activity className='h-4 w-4' />
                            <span>Buat Aktivitas</span>
                        </Button>
                    </Link>
                    <Link href='/teacher/assignments/create'>
                        <Button className='flex items-center gap-2'>
                            <Plus className='h-4 w-4' />
                            <span>Buat Tugas</span>
                        </Button>
                    </Link>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Total Aktivitas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>124</div>
                        <p className='text-xs text-muted-foreground'>
                            +8 bulan ini
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Tugas Aktif
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>8</div>
                        <p className='text-xs text-muted-foreground'>
                            5 perlu dinilai
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
                        <div className='text-2xl font-bold'>85</div>
                        <p className='text-xs text-muted-foreground'>
                            Dalam 3 kelas
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
                        <div className='text-2xl font-bold'>82</div>
                        <p className='text-xs text-muted-foreground'>
                            +3 dari bulan lalu
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <Card className='md:col-span-1'>
                    <CardHeader>
                        <CardTitle>Distribusi Aktivitas</CardTitle>
                        <CardDescription>
                            Berdasarkan jenis skill
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='h-80'>
                            <ResponsiveContainer width='100%' height='100%'>
                                <BarChart
                                    data={activityStats}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray='3 3' />
                                    <XAxis dataKey='name' />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar
                                        dataKey='count'
                                        fill='#8884d8'
                                        name='Jumlah Aktivitas'
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className='md:col-span-1'>
                    <CardHeader>
                        <CardTitle>Distribusi HOTS</CardTitle>
                        <CardDescription>Berdasarkan tipe HOTS</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='h-80'>
                            <ResponsiveContainer width='100%' height='100%'>
                                <PieChart>
                                    <Pie
                                        data={hotsDistribution}
                                        cx='50%'
                                        cy='50%'
                                        labelLine={false}
                                        label={({ name, percent }) =>
                                            `${name}: ${(percent * 100).toFixed(
                                                0
                                            )}%`
                                        }
                                        outerRadius={80}
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
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <Card className='md:col-span-2'>
                    <CardHeader>
                        <CardTitle>Tugas Terbaru</CardTitle>
                        <CardDescription>
                            Status pengumpulan tugas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-4'>
                            {recentAssignments.map((assignment) => {
                                const submissionRate = Math.round(
                                    (assignment.submissions /
                                        assignment.totalStudents) *
                                        100
                                );

                                return (
                                    <div
                                        key={assignment.id}
                                        className='flex items-center justify-between border-b pb-3'
                                    >
                                        <div>
                                            <div className='font-medium'>
                                                {assignment.title}
                                            </div>
                                            <div className='text-sm text-muted-foreground mt-1'>
                                                Tenggat: {assignment.dueDate}
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-4'>
                                            <div className='text-right'>
                                                <div className='text-sm font-medium'>
                                                    {submissionRate}%
                                                    Dikumpulkan
                                                </div>
                                                <div className='text-xs text-muted-foreground'>
                                                    {assignment.submissions}/
                                                    {assignment.totalStudents}{" "}
                                                    siswa
                                                </div>
                                            </div>
                                            <div className='text-right'>
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
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Link href='/teacher/assignments'>
                            <Button variant='outline' className='w-full'>
                                Lihat Semua Tugas
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>

                <Card className='md:col-span-1'>
                    <CardHeader>
                        <CardTitle>Agenda Mendatang</CardTitle>
                        <CardDescription>
                            Jadwal dan tenggat waktu
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-4'>
                            {upcomingEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className='flex items-start gap-3 border-b pb-3'
                                >
                                    <div className='rounded-md bg-primary/10 p-2'>
                                        {event.type === "assignment" && (
                                            <FileText className='h-4 w-4 text-primary' />
                                        )}
                                        {event.type === "challenge" && (
                                            <Award className='h-4 w-4 text-primary' />
                                        )}
                                        {event.type === "discussion" && (
                                            <MessageSquare className='h-4 w-4 text-primary' />
                                        )}
                                    </div>
                                    <div>
                                        <div className='text-sm font-medium'>
                                            {event.title}
                                        </div>
                                        <div className='flex items-center gap-1 mt-1'>
                                            <Calendar className='h-3 w-3 text-muted-foreground' />
                                            <span className='text-xs text-muted-foreground'>
                                                {event.date}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant='outline' className='w-full'>
                            Lihat Kalender
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <Card className='md:col-span-2'>
                    <CardHeader>
                        <CardTitle>Performa Siswa</CardTitle>
                        <CardDescription>
                            Perkembangan nilai rata-rata siswa
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='h-80'>
                            <ResponsiveContainer width='100%' height='100%'>
                                <LineChart data={studentPerformance}>
                                    <CartesianGrid strokeDasharray='3 3' />
                                    <XAxis dataKey='month' />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type='monotone'
                                        dataKey='avgScore'
                                        stroke='#8884d8'
                                        name='Nilai Rata-rata'
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Link href='/teacher/students'>
                            <Button variant='outline' className='w-full'>
                                Lihat Detail Siswa
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>

                <Card className='md:col-span-1'>
                    <CardHeader>
                        <CardTitle>Siswa Terbaik</CardTitle>
                        <CardDescription>
                            Berdasarkan performa HOTS
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-4'>
                            <div className='flex items-center gap-3'>
                                <Avatar className='h-10 w-10'>
                                    <AvatarImage
                                        src='/avatars/student-1.jpg'
                                        alt='Andi Pratama'
                                    />
                                    <AvatarFallback>AP</AvatarFallback>
                                </Avatar>
                                <div className='flex-1'>
                                    <div className='font-medium'>
                                        Andi Pratama
                                    </div>
                                    <div className='text-xs text-muted-foreground'>
                                        Nilai rata-rata: 92
                                    </div>
                                </div>
                                <Badge>1</Badge>
                            </div>

                            <div className='flex items-center gap-3'>
                                <Avatar className='h-10 w-10'>
                                    <AvatarImage
                                        src='/avatars/student-3.jpg'
                                        alt='Citra Dewi'
                                    />
                                    <AvatarFallback>CD</AvatarFallback>
                                </Avatar>
                                <div className='flex-1'>
                                    <div className='font-medium'>
                                        Citra Dewi
                                    </div>
                                    <div className='text-xs text-muted-foreground'>
                                        Nilai rata-rata: 90
                                    </div>
                                </div>
                                <Badge>2</Badge>
                            </div>

                            <div className='flex items-center gap-3'>
                                <Avatar className='h-10 w-10'>
                                    <AvatarImage
                                        src='/avatars/student-2.jpg'
                                        alt='Budi Santoso'
                                    />
                                    <AvatarFallback>BS</AvatarFallback>
                                </Avatar>
                                <div className='flex-1'>
                                    <div className='font-medium'>
                                        Budi Santoso
                                    </div>
                                    <div className='text-xs text-muted-foreground'>
                                        Nilai rata-rata: 88
                                    </div>
                                </div>
                                <Badge>3</Badge>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Link href='/teacher/students'>
                            <Button variant='outline' className='w-full'>
                                Lihat Semua Siswa
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
