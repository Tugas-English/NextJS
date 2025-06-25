// src/app/teacher/students/progress/page.tsx
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
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
} from "recharts";
import {
    ArrowRight,
    ArrowUpRight,
    BookOpen,
    CheckCircle,
    Download,
    FileText,
    Filter,
    Search,
    SlidersHorizontal,
    Sparkles,
    Trophy,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Data dummy untuk demo
const students = [
    {
        id: "1",
        name: "Andi Pratama",
        avatar: "/avatars/student-1.jpg",
        skills: {
            reading: 85,
            listening: 78,
            writing: 92,
            speaking: 88,
        },
        hotsSkills: {
            analyze: 82,
            evaluate: 85,
            create: 90,
            problemSolve: 83,
            infer: 75,
        },
        completedActivities: 45,
        averageScore: 86,
        improvement: 12,
        lastActive: "2 hari lalu",
    },
    {
        id: "2",
        name: "Budi Santoso",
        avatar: "/avatars/student-2.jpg",
        skills: {
            reading: 72,
            listening: 80,
            writing: 75,
            speaking: 70,
        },
        hotsSkills: {
            analyze: 75,
            evaluate: 72,
            create: 68,
            problemSolve: 78,
            infer: 70,
        },
        completedActivities: 38,
        averageScore: 74,
        improvement: 8,
        lastActive: "1 hari lalu",
    },
    {
        id: "3",
        name: "Citra Dewi",
        avatar: "/avatars/student-3.jpg",
        skills: {
            reading: 90,
            listening: 85,
            writing: 88,
            speaking: 92,
        },
        hotsSkills: {
            analyze: 90,
            evaluate: 88,
            create: 92,
            problemSolve: 85,
            infer: 82,
        },
        completedActivities: 42,
        averageScore: 89,
        improvement: 15,
        lastActive: "hari ini",
    },
    {
        id: "4",
        name: "Deni Kurniawan",
        avatar: "/avatars/student-4.jpg",
        skills: {
            reading: 68,
            listening: 72,
            writing: 70,
            speaking: 75,
        },
        hotsSkills: {
            analyze: 70,
            evaluate: 65,
            create: 72,
            problemSolve: 68,
            infer: 65,
        },
        completedActivities: 30,
        averageScore: 71,
        improvement: 5,
        lastActive: "3 hari lalu",
    },
    {
        id: "5",
        name: "Eka Putri",
        avatar: "/avatars/student-5.jpg",
        skills: {
            reading: 82,
            listening: 80,
            writing: 85,
            speaking: 78,
        },
        hotsSkills: {
            analyze: 78,
            evaluate: 80,
            create: 85,
            problemSolve: 75,
            infer: 78,
        },
        completedActivities: 40,
        averageScore: 81,
        improvement: 10,
        lastActive: "hari ini",
    },
];

const classProgressData = [
    { month: "Jan", avgScore: 72 },
    { month: "Feb", avgScore: 74 },
    { month: "Mar", avgScore: 76 },
    { month: "Apr", avgScore: 78 },
    { month: "Mei", avgScore: 80 },
    { month: "Jun", avgScore: 83 },
];

const skillComparisonData = [
    { skill: "Reading", avgScore: 79 },
    { skill: "Listening", avgScore: 77 },
    { skill: "Writing", avgScore: 82 },
    { skill: "Speaking", avgScore: 80 },
];

const hotsDistributionData = [
    { skill: "Analyze", value: 78 },
    { skill: "Evaluate", value: 76 },
    { skill: "Create", value: 82 },
    { skill: "Problem-solve", value: 75 },
    { skill: "Infer", value: 72 },
];

export default function StudentProgressPage() {
    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-bold'>Laporan Kemajuan Siswa</h1>
                <div className='flex gap-2'>
                    <Button
                        variant='outline'
                        className='flex items-center gap-2'
                    >
                        <Filter className='h-4 w-4' />
                        <span>Filter</span>
                    </Button>
                    <Button
                        variant='outline'
                        className='flex items-center gap-2'
                    >
                        <Download className='h-4 w-4' />
                        <span>Ekspor Laporan</span>
                    </Button>
                </div>
            </div>

            <Tabs defaultValue='overview'>
                <TabsList className='grid w-full grid-cols-3'>
                    <TabsTrigger value='overview'>Ikhtisar Kelas</TabsTrigger>
                    <TabsTrigger value='individual'>
                        Kemajuan Individual
                    </TabsTrigger>
                    <TabsTrigger value='hots-analysis'>
                        Analisis HOTS
                    </TabsTrigger>
                </TabsList>

                <div className='mt-6 flex justify-between items-center'>
                    <div className='flex items-center gap-2'>
                        <Select defaultValue='all'>
                            <SelectTrigger className='w-40'>
                                <SelectValue placeholder='Pilih kelas' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='all'>Semua Kelas</SelectItem>
                                <SelectItem value='10a'>
                                    Bahasa Inggris 10A
                                </SelectItem>
                                <SelectItem value='hots'>
                                    HOTS Lanjutan
                                </SelectItem>
                                <SelectItem value='writing'>
                                    Menulis Kreatif
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <Select defaultValue='semester1'>
                            <SelectTrigger className='w-40'>
                                <SelectValue placeholder='Pilih periode' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='semester1'>
                                    Semester 1
                                </SelectItem>
                                <SelectItem value='semester2'>
                                    Semester 2
                                </SelectItem>
                                <SelectItem value='3months'>
                                    3 Bulan Terakhir
                                </SelectItem>
                                <SelectItem value='6months'>
                                    6 Bulan Terakhir
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='relative w-64'>
                        <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                        <Input
                            type='search'
                            placeholder='Cari siswa...'
                            className='pl-8'
                        />
                    </div>
                </div>

                <TabsContent value='overview' className='mt-4'>
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                        <Card>
                            <CardHeader className='pb-2'>
                                <CardTitle className='text-sm font-medium'>
                                    Nilai Rata-rata Kelas
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='text-2xl font-bold'>81</div>
                                <p className='text-xs text-muted-foreground'>
                                    +3 dari bulan lalu
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className='pb-2'>
                                <CardTitle className='text-sm font-medium'>
                                    Tingkat Penyelesaian
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='text-2xl font-bold'>85%</div>
                                <p className='text-xs text-muted-foreground'>
                                    39/45 aktivitas selesai
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className='pb-2'>
                                <CardTitle className='text-sm font-medium'>
                                    Peningkatan Rata-rata
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='text-2xl font-bold'>+10%</div>
                                <p className='text-xs text-muted-foreground'>
                                    Semester ini
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className='pb-2'>
                                <CardTitle className='text-sm font-medium'>
                                    Siswa Aktif
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='text-2xl font-bold'>28/32</div>
                                <p className='text-xs text-muted-foreground'>
                                    88% tingkat keaktifan
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Perkembangan Nilai Kelas</CardTitle>
                                <CardDescription>
                                    Nilai rata-rata kelas dalam 6 bulan terakhir
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className='h-80'>
                                    <ResponsiveContainer
                                        width='100%'
                                        height='100%'
                                    >
                                        <LineChart data={classProgressData}>
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
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Perbandingan Skill</CardTitle>
                                <CardDescription>
                                    Nilai rata-rata berdasarkan jenis skill
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className='h-80'>
                                    <ResponsiveContainer
                                        width='100%'
                                        height='100%'
                                    >
                                        <BarChart data={skillComparisonData}>
                                            <CartesianGrid strokeDasharray='3 3' />
                                            <XAxis dataKey='skill' />
                                            <YAxis domain={[0, 100]} />
                                            <Tooltip />
                                            <Legend />
                                            <Bar
                                                dataKey='avgScore'
                                                fill='#8884d8'
                                                name='Nilai Rata-rata'
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className='mt-6'>
                        <CardHeader>
                            <CardTitle>Siswa Teratas</CardTitle>
                            <CardDescription>
                                Siswa dengan performa terbaik
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                {students.slice(0, 3).map((student, index) => (
                                    <div
                                        key={student.id}
                                        className='flex flex-col items-center border rounded-lg p-4'
                                    >
                                        <div className='relative'>
                                            <Avatar className='h-20 w-20'>
                                                <AvatarImage
                                                    src={student.avatar}
                                                    alt={student.name}
                                                />
                                                <AvatarFallback>
                                                    {student.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className='absolute -top-2 -right-2 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold'>
                                                {index + 1}
                                            </div>
                                        </div>
                                        <div className='mt-4 text-center'>
                                            <h3 className='font-medium'>
                                                {student.name}
                                            </h3>
                                            <p className='text-sm text-muted-foreground'>
                                                Nilai rata-rata:{" "}
                                                {student.averageScore}
                                            </p>
                                        </div>
                                        <div className='mt-4 w-full grid grid-cols-2 gap-2'>
                                            <div className='text-center p-2 bg-muted rounded-md'>
                                                <div className='text-sm font-medium'>
                                                    {
                                                        student.completedActivities
                                                    }
                                                </div>
                                                <div className='text-xs text-muted-foreground'>
                                                    Aktivitas
                                                </div>
                                            </div>
                                            <div className='text-center p-2 bg-muted rounded-md'>
                                                <div className='text-sm font-medium flex items-center justify-center'>
                                                    +{student.improvement}%
                                                    <ArrowUpRight className='h-3 w-3 text-green-500 ml-1' />
                                                </div>
                                                <div className='text-xs text-muted-foreground'>
                                                    Peningkatan
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='individual' className='mt-4'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Kemajuan Individual Siswa</CardTitle>
                            <CardDescription>
                                Lihat kemajuan per siswa
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className='w-[50px]'>
                                            <Checkbox />
                                        </TableHead>
                                        <TableHead>Nama Siswa</TableHead>
                                        <TableHead>Reading</TableHead>
                                        <TableHead>Listening</TableHead>
                                        <TableHead>Writing</TableHead>
                                        <TableHead>Speaking</TableHead>
                                        <TableHead>Rata-rata</TableHead>
                                        <TableHead>Aktivitas</TableHead>
                                        <TableHead>Peningkatan</TableHead>
                                        <TableHead>Terakhir Aktif</TableHead>
                                        <TableHead className='text-right'>
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {students.map((student) => {
                                        const skillAvg =
                                            (student.skills.reading +
                                                student.skills.listening +
                                                student.skills.writing +
                                                student.skills.speaking) /
                                            4;

                                        return (
                                            <TableRow key={student.id}>
                                                <TableCell>
                                                    <Checkbox />
                                                </TableCell>
                                                <TableCell>
                                                    <div className='flex items-center gap-2'>
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
                                                </TableCell>
                                                <TableCell>
                                                    {student.skills.reading}
                                                </TableCell>
                                                <TableCell>
                                                    {student.skills.listening}
                                                </TableCell>
                                                <TableCell>
                                                    {student.skills.writing}
                                                </TableCell>
                                                <TableCell>
                                                    {student.skills.speaking}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={
                                                            student.averageScore >=
                                                            85
                                                                ? "bg-green-500"
                                                                : student.averageScore >=
                                                                  75
                                                                ? "bg-blue-500"
                                                                : "bg-yellow-500"
                                                        }
                                                    >
                                                        {student.averageScore}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className='flex items-center gap-1'>
                                                        <CheckCircle className='h-3 w-3 text-muted-foreground' />
                                                        <span>
                                                            {
                                                                student.completedActivities
                                                            }
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className='flex items-center'>
                                                        +{student.improvement}%
                                                        <ArrowUpRight className='h-3 w-3 text-green-500 ml-1' />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {student.lastActive}
                                                </TableCell>
                                                <TableCell className='text-right'>
                                                    <Link
                                                        href={`/teacher/students/${student.id}`}
                                                    >
                                                        <Button
                                                            variant='ghost'
                                                            size='sm'
                                                            className='flex items-center gap-1'
                                                        >
                                                            <span>Detail</span>
                                                            <ArrowRight className='h-3 w-3' />
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

                <TabsContent value='hots-analysis' className='mt-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Distribusi Kemampuan HOTS</CardTitle>
                                <CardDescription>
                                    Kemampuan HOTS rata-rata kelas
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className='h-80'>
                                    <ResponsiveContainer
                                        width='100%'
                                        height='100%'
                                    >
                                        <RadarChart
                                            outerRadius={90}
                                            data={hotsDistributionData}
                                        >
                                            <PolarGrid />
                                            <PolarAngleAxis dataKey='skill' />
                                            <PolarRadiusAxis
                                                domain={[0, 100]}
                                            />
                                            <Radar
                                                name='Nilai Rata-rata'
                                                dataKey='value'
                                                stroke='#8884d8'
                                                fill='#8884d8'
                                                fillOpacity={0.6}
                                            />
                                            <Tooltip />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className='grid grid-cols-5 gap-2 mt-4'>
                                    {hotsDistributionData.map((item) => (
                                        <div
                                            key={item.skill}
                                            className='text-center'
                                        >
                                            <div className='text-lg font-bold'>
                                                {item.value}%
                                            </div>
                                            <div className='text-xs text-muted-foreground'>
                                                {item.skill}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Area yang Perlu Ditingkatkan
                                </CardTitle>
                                <CardDescription>
                                    Berdasarkan analisis kemampuan HOTS
                                </CardDescription>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div className='border rounded-lg p-4'>
                                    <div className='flex items-center gap-2'>
                                        <div className='bg-yellow-100 text-yellow-700 p-2 rounded-full'>
                                            <SlidersHorizontal className='h-4 w-4' />
                                        </div>
                                        <div className='font-medium'>
                                            Kemampuan Inferensi (Infer)
                                        </div>
                                    </div>
                                    <p className='text-sm text-muted-foreground mt-2'>
                                        Siswa masih kesulitan dalam menarik
                                        kesimpulan dari informasi implisit.
                                        Diperlukan lebih banyak latihan untuk
                                        meningkatkan kemampuan ini.
                                    </p>
                                    <div className='mt-3'>
                                        <Link href='#'>
                                            <Button
                                                variant='outline'
                                                size='sm'
                                                className='text-xs'
                                            >
                                                Lihat Aktivitas Terkait
                                            </Button>
                                        </Link>
                                    </div>
                                </div>

                                <div className='border rounded-lg p-4'>
                                    <div className='flex items-center gap-2'>
                                        <div className='bg-yellow-100 text-yellow-700 p-2 rounded-full'>
                                            <SlidersHorizontal className='h-4 w-4' />
                                        </div>
                                        <div className='font-medium'>
                                            Kemampuan Evaluasi (Evaluate)
                                        </div>
                                    </div>
                                    <p className='text-sm text-muted-foreground mt-2'>
                                        Siswa perlu meningkatkan kemampuan
                                        mengevaluasi argumen dan bukti secara
                                        kritis. Disarankan memberikan lebih
                                        banyak aktivitas evaluasi.
                                    </p>
                                    <div className='mt-3'>
                                        <Link href='#'>
                                            <Button
                                                variant='outline'
                                                size='sm'
                                                className='text-xs'
                                            >
                                                Lihat Aktivitas Terkait
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant='outline' className='w-full'>
                                    Buat Rekomendasi Aktivitas
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    <Card className='mt-6'>
                        <CardHeader>
                            <CardTitle>Performa HOTS per Siswa</CardTitle>
                            <CardDescription>
                                Detail kemampuan HOTS untuk setiap siswa
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className='w-[50px]'>
                                            <Checkbox />
                                        </TableHead>
                                        <TableHead>Nama Siswa</TableHead>
                                        <TableHead>Analyze</TableHead>
                                        <TableHead>Evaluate</TableHead>
                                        <TableHead>Create</TableHead>
                                        <TableHead>Problem-solve</TableHead>
                                        <TableHead>Infer</TableHead>
                                        <TableHead>Rata-rata HOTS</TableHead>
                                        <TableHead className='text-right'>
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {students.map((student) => {
                                        const hotsAvg =
                                            (student.hotsSkills.analyze +
                                                student.hotsSkills.evaluate +
                                                student.hotsSkills.create +
                                                student.hotsSkills
                                                    .problemSolve +
                                                student.hotsSkills.infer) /
                                            5;

                                        return (
                                            <TableRow key={student.id}>
                                                <TableCell>
                                                    <Checkbox />
                                                </TableCell>
                                                <TableCell>
                                                    <div className='flex items-center gap-2'>
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
                                                </TableCell>
                                                <TableCell>
                                                    {student.hotsSkills.analyze}
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        student.hotsSkills
                                                            .evaluate
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {student.hotsSkills.create}
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        student.hotsSkills
                                                            .problemSolve
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {student.hotsSkills.infer}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={
                                                            hotsAvg >= 85
                                                                ? "bg-green-500"
                                                                : hotsAvg >= 75
                                                                ? "bg-blue-500"
                                                                : "bg-yellow-500"
                                                        }
                                                    >
                                                        {Math.round(hotsAvg)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className='text-right'>
                                                    <Link
                                                        href={`/teacher/students/${student.id}?tab=hots`}
                                                    >
                                                        <Button
                                                            variant='ghost'
                                                            size='sm'
                                                            className='flex items-center gap-1'
                                                        >
                                                            <span>Detail</span>
                                                            <ArrowRight className='h-3 w-3' />
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter>
                            <Button variant='outline' className='w-full'>
                                Ekspor Data HOTS
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>

            <Card>
                <CardHeader>
                    <CardTitle>Rekomendasi Aktivitas</CardTitle>
                    <CardDescription>
                        Berdasarkan analisis kemajuan siswa
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <div className='border rounded-lg p-4'>
                            <div className='flex items-center gap-2 mb-3'>
                                <Sparkles className='h-5 w-5 text-primary' />
                                <h3 className='font-medium'>
                                    Inferensi dari Teks Sastra
                                </h3>
                            </div>
                            <p className='text-sm text-muted-foreground'>
                                Aktivitas membaca dan menarik kesimpulan dari
                                teks sastra untuk meningkatkan kemampuan
                                inferensi.
                            </p>
                            <div className='flex items-center gap-2 mt-3'>
                                <Badge variant='outline'>Reading</Badge>
                                <Badge variant='secondary'>Infer</Badge>
                            </div>
                            <div className='mt-4'>
                                <Button size='sm' className='w-full'>
                                    Assign ke Kelas
                                </Button>
                            </div>
                        </div>
                        <div className='border rounded-lg p-4'>
                            <div className='flex items-center gap-2 mb-3'>
                                <Sparkles className='h-5 w-5 text-primary' />
                                <h3 className='font-medium'>
                                    Evaluasi Argumen
                                </h3>
                            </div>
                            <p className='text-sm text-muted-foreground'>
                                Aktivitas menganalisis dan mengevaluasi argumen
                                dalam artikel opini untuk meningkatkan kemampuan
                                evaluasi.
                            </p>
                            <div className='flex items-center gap-2 mt-3'>
                                <Badge variant='outline'>Reading</Badge>
                                <Badge variant='secondary'>Evaluate</Badge>
                            </div>
                            <div className='mt-4'>
                                <Button size='sm' className='w-full'>
                                    Assign ke Kelas
                                </Button>
                            </div>
                        </div>
                        <div className='border rounded-lg p-4'>
                            <div className='flex items-center gap-2 mb-3'>
                                <Sparkles className='h-5 w-5 text-primary' />
                                <h3 className='font-medium'>
                                    Pemecahan Masalah Kolaboratif
                                </h3>
                            </div>
                            <p className='text-sm text-muted-foreground'>
                                Aktivitas pemecahan masalah dalam kelompok untuk
                                meningkatkan kemampuan problem-solving dan
                                komunikasi.
                            </p>
                            <div className='flex items-center gap-2 mt-3'>
                                <Badge variant='outline'>Speaking</Badge>
                                <Badge variant='secondary'>Problem-solve</Badge>
                            </div>
                            <div className='mt-4'>
                                <Button size='sm' className='w-full'>
                                    Assign ke Kelas
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant='outline' className='w-full'>
                        Lihat Semua Rekomendasi
                    </Button>
                </CardFooter>
            </Card>

            <div className='flex justify-between items-center mt-8'>
                <h2 className='text-xl font-bold'>Tindakan yang Disarankan</h2>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <Card>
                    <CardHeader>
                        <div className='flex items-center gap-2'>
                            <div className='bg-blue-100 text-blue-700 p-2 rounded-full'>
                                <FileText className='h-5 w-5' />
                            </div>
                            <CardTitle className='text-base'>
                                Buat Laporan Kemajuan
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className='text-sm text-muted-foreground'>
                            Buat laporan kemajuan individual untuk siswa yang
                            membutuhkan perhatian khusus.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button variant='outline' className='w-full'>
                            Buat Laporan
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <div className='flex items-center gap-2'>
                            <div className='bg-green-100 text-green-700 p-2 rounded-full'>
                                <BookOpen className='h-5 w-5' />
                            </div>
                            <CardTitle className='text-base'>
                                Rencanakan Modul Remedial
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className='text-sm text-muted-foreground'>
                            Buat modul remedial untuk siswa yang membutuhkan
                            bantuan dalam area tertentu.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button variant='outline' className='w-full'>
                            Buat Modul
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <div className='flex items-center gap-2'>
                            <div className='bg-purple-100 text-purple-700 p-2 rounded-full'>
                                <Trophy className='h-5 w-5' />
                            </div>
                            <CardTitle className='text-base'>
                                Buat Tantangan Mingguan
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className='text-sm text-muted-foreground'>
                            Buat tantangan mingguan yang berfokus pada area yang
                            perlu ditingkatkan.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button variant='outline' className='w-full'>
                            Buat Tantangan
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
