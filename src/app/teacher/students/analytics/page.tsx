// src/app/teacher/students/analytics/page.tsx
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    LineChart,
    Line,
    Scatter,
    ScatterChart,
    ZAxis,
} from "recharts";
import { Download, Search } from "lucide-react";
import { useState } from "react";

// Data dummy untuk demo
const classAverages = [
    { skill: "Analyze", average: 78 },
    { skill: "Evaluate", average: 65 },
    { skill: "Create", average: 82 },
    { skill: "Problem-solve", average: 70 },
    { skill: "Infer", average: 75 },
];

const skillProgress = [
    { month: "Jan", reading: 72, listening: 68, writing: 65, speaking: 70 },
    { month: "Feb", reading: 74, listening: 70, writing: 67, speaking: 72 },
    { month: "Mar", reading: 75, listening: 73, writing: 70, speaking: 74 },
    { month: "Apr", reading: 77, listening: 75, writing: 72, speaking: 76 },
    { month: "Mei", reading: 79, listening: 78, writing: 75, speaking: 78 },
    { month: "Jun", reading: 82, listening: 80, writing: 78, speaking: 80 },
];

const hotsDistribution = [
    {
        name: "10A",
        analyze: 78,
        evaluate: 65,
        create: 82,
        problemSolve: 70,
        infer: 75,
    },
    {
        name: "10B",
        analyze: 75,
        evaluate: 68,
        create: 80,
        problemSolve: 72,
        infer: 73,
    },
    {
        name: "10C",
        analyze: 80,
        evaluate: 70,
        create: 85,
        problemSolve: 75,
        infer: 78,
    },
];

const studentHotsData = [
    {
        id: "1",
        name: "Andi Pratama",
        class: "10A",
        analyze: 88,
        evaluate: 82,
        create: 92,
        problemSolve: 85,
        infer: 80,
        average: 85.4,
    },
    {
        id: "2",
        name: "Budi Santoso",
        class: "10A",
        analyze: 75,
        evaluate: 78,
        create: 80,
        problemSolve: 72,
        infer: 70,
        average: 75.0,
    },
    {
        id: "3",
        name: "Citra Dewi",
        class: "10A",
        analyze: 90,
        evaluate: 85,
        create: 88,
        problemSolve: 92,
        infer: 86,
        average: 88.2,
    },
    {
        id: "4",
        name: "Deni Kurniawan",
        class: "10B",
        analyze: 70,
        evaluate: 68,
        create: 72,
        problemSolve: 75,
        infer: 70,
        average: 71.0,
    },
    {
        id: "5",
        name: "Eka Putri",
        class: "10B",
        analyze: 82,
        evaluate: 80,
        create: 85,
        problemSolve: 78,
        infer: 82,
        average: 81.4,
    },
];

const scatterData = studentHotsData.map((student) => ({
    name: student.name,
    x: (student.create + student.problemSolve) / 2, // Creativity & Problem Solving
    y: (student.analyze + student.evaluate) / 2, // Analysis & Evaluation
    z: student.average,
}));

const greatestImprovement = [
    {
        id: "3",
        name: "Citra Dewi",
        class: "10A",
        improvementRate: 15,
        initialScore: 73,
        currentScore: 88,
    },
    {
        id: "5",
        name: "Eka Putri",
        class: "10B",
        improvementRate: 12,
        initialScore: 69,
        currentScore: 81,
    },
    {
        id: "1",
        name: "Andi Pratama",
        class: "10A",
        improvementRate: 10,
        initialScore: 75,
        currentScore: 85,
    },
];

export default function StudentsAnalyticsPage() {
    const [selectedClass, setSelectedClass] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const filteredStudents = studentHotsData.filter((student) => {
        const matchesClass =
            selectedClass === "all" || student.class === selectedClass;
        const matchesSearch = student.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        return matchesClass && matchesSearch;
    });

    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-bold'>Analisis HOTS Siswa</h1>
                <div className='flex items-center gap-2'>
                    <Button
                        variant='outline'
                        className='flex items-center gap-2'
                    >
                        <Download className='h-4 w-4' />
                        <span>Ekspor Data</span>
                    </Button>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Rata-rata HOTS
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>78.2</div>
                        <p className='text-xs text-muted-foreground'>
                            +4.5 dari semester lalu
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Kemampuan Tertinggi
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>Create</div>
                        <p className='text-xs text-muted-foreground'>
                            Rata-rata 82.0
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Kemampuan Terendah
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>Evaluate</div>
                        <p className='text-xs text-muted-foreground'>
                            Rata-rata 65.0
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <Card className='md:col-span-1'>
                    <CardHeader>
                        <CardTitle>Radar HOTS Kelas</CardTitle>
                        <CardDescription>
                            Rata-rata kemampuan HOTS per kelas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='h-80'>
                            <ResponsiveContainer width='100%' height='100%'>
                                <RadarChart
                                    outerRadius={90}
                                    data={classAverages}
                                >
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey='skill' />
                                    <PolarRadiusAxis domain={[0, 100]} />
                                    <Radar
                                        name='Rata-rata Kelas'
                                        dataKey='average'
                                        stroke='#8884d8'
                                        fill='#8884d8'
                                        fillOpacity={0.6}
                                    />
                                    <Tooltip />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className='md:col-span-1'>
                    <CardHeader>
                        <CardTitle>Perkembangan Skill</CardTitle>
                        <CardDescription>
                            Tren kemampuan per skill dalam 6 bulan terakhir
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='h-80'>
                            <ResponsiveContainer width='100%' height='100%'>
                                <LineChart data={skillProgress}>
                                    <CartesianGrid strokeDasharray='3 3' />
                                    <XAxis dataKey='month' />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type='monotone'
                                        dataKey='reading'
                                        stroke='#8884d8'
                                        name='Reading'
                                    />
                                    <Line
                                        type='monotone'
                                        dataKey='listening'
                                        stroke='#82ca9d'
                                        name='Listening'
                                    />
                                    <Line
                                        type='monotone'
                                        dataKey='writing'
                                        stroke='#ffc658'
                                        name='Writing'
                                    />
                                    <Line
                                        type='monotone'
                                        dataKey='speaking'
                                        stroke='#ff8042'
                                        name='Speaking'
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Distribusi HOTS Antar Kelas</CardTitle>
                    <CardDescription>
                        Perbandingan kemampuan HOTS per kelas
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='h-80'>
                        <ResponsiveContainer width='100%' height='100%'>
                            <BarChart
                                data={hotsDistribution}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis dataKey='name' />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    dataKey='analyze'
                                    name='Analyze'
                                    fill='#8884d8'
                                />
                                <Bar
                                    dataKey='evaluate'
                                    name='Evaluate'
                                    fill='#82ca9d'
                                />
                                <Bar
                                    dataKey='create'
                                    name='Create'
                                    fill='#ffc658'
                                />
                                <Bar
                                    dataKey='problemSolve'
                                    name='Problem Solve'
                                    fill='#ff8042'
                                />
                                <Bar
                                    dataKey='infer'
                                    name='Infer'
                                    fill='#8dd1e1'
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Pemetaan Kemampuan Siswa</CardTitle>
                    <CardDescription>
                        Analisis korelasi kemampuan HOTS
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='h-80'>
                        <ResponsiveContainer width='100%' height='100%'>
                            <ScatterChart
                                margin={{
                                    top: 20,
                                    right: 20,
                                    bottom: 20,
                                    left: 20,
                                }}
                            >
                                <CartesianGrid />
                                <XAxis
                                    type='number'
                                    dataKey='x'
                                    name='Creativity & Problem Solving'
                                    domain={[0, 100]}
                                />
                                <YAxis
                                    type='number'
                                    dataKey='y'
                                    name='Analysis & Evaluation'
                                    domain={[0, 100]}
                                />
                                <ZAxis
                                    type='number'
                                    dataKey='z'
                                    range={[60, 400]}
                                    name='Nilai Rata-rata'
                                />
                                <Tooltip
                                    cursor={{ strokeDasharray: "3 3" }}
                                    formatter={(value, name) => {
                                        if (name === "z")
                                            return [
                                                `${value}`,
                                                "Nilai Rata-rata",
                                            ];
                                        return [value, name];
                                    }}
                                    labelFormatter={(label) =>
                                        scatterData[label].name
                                    }
                                />
                                <Legend />
                                <Scatter
                                    name='Pemetaan Siswa'
                                    data={scatterData}
                                    fill='#8884d8'
                                />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className='flex items-center justify-between'>
                    <div>
                        <CardTitle>Detail HOTS Per Siswa</CardTitle>
                        <CardDescription>
                            Nilai HOTS setiap siswa berdasarkan kategori
                        </CardDescription>
                    </div>
                    <div className='flex items-center gap-4'>
                        <div className='relative w-64'>
                            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                            <Input
                                type='search'
                                placeholder='Cari siswa...'
                                className='pl-8'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select
                            value={selectedClass}
                            onValueChange={setSelectedClass}
                        >
                            <SelectTrigger className='w-[180px]'>
                                <SelectValue placeholder='Pilih kelas' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='all'>Semua Kelas</SelectItem>
                                <SelectItem value='10A'>Kelas 10A</SelectItem>
                                <SelectItem value='10B'>Kelas 10B</SelectItem>
                                <SelectItem value='10C'>Kelas 10C</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama Siswa</TableHead>
                                <TableHead>Kelas</TableHead>
                                <TableHead>Analyze</TableHead>
                                <TableHead>Evaluate</TableHead>
                                <TableHead>Create</TableHead>
                                <TableHead>Problem Solve</TableHead>
                                <TableHead>Infer</TableHead>
                                <TableHead>Rata-rata</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell className='font-medium'>
                                        {student.name}
                                    </TableCell>
                                    <TableCell>{student.class}</TableCell>
                                    <TableCell>{student.analyze}</TableCell>
                                    <TableCell>{student.evaluate}</TableCell>
                                    <TableCell>{student.create}</TableCell>
                                    <TableCell>
                                        {student.problemSolve}
                                    </TableCell>
                                    <TableCell>{student.infer}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                student.average >= 80
                                                    ? "default"
                                                    : "outline"
                                            }
                                        >
                                            {student.average}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Peningkatan Terbesar</CardTitle>
                    <CardDescription>
                        Siswa dengan peningkatan kemampuan HOTS terbesar
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='space-y-6'>
                        {greatestImprovement.map((student, index) => (
                            <div
                                key={student.id}
                                className='flex items-center justify-between border-b pb-4'
                            >
                                <div className='flex items-center gap-4'>
                                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
                                        <span className='font-bold'>
                                            {index + 1}
                                        </span>
                                    </div>
                                    <div>
                                        <div className='font-medium'>
                                            {student.name}
                                        </div>
                                        <div className='text-sm text-muted-foreground'>
                                            Kelas {student.class}
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-center gap-4'>
                                    <div className='text-right'>
                                        <div className='text-sm text-muted-foreground'>
                                            Awal
                                        </div>
                                        <div className='font-medium'>
                                            {student.initialScore}
                                        </div>
                                    </div>
                                    <div className='text-right'>
                                        <div className='text-sm text-muted-foreground'>
                                            Sekarang
                                        </div>
                                        <div className='font-medium'>
                                            {student.currentScore}
                                        </div>
                                    </div>
                                    <Badge className='ml-4'>
                                        +{student.improvementRate}%
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant='outline' className='w-full'>
                        Lihat Semua Siswa
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
