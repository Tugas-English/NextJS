"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Download, File, FileSpreadsheet, Filter } from "lucide-react";
import { useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Data dummy untuk demo
const studentProgressData = [
    {
        id: "1",
        name: "Andi Pratama",
        reading: 85,
        listening: 78,
        writing: 92,
        speaking: 88,
    },
    {
        id: "2",
        name: "Budi Santoso",
        reading: 72,
        listening: 80,
        writing: 75,
        speaking: 70,
    },
    {
        id: "3",
        name: "Citra Dewi",
        reading: 90,
        listening: 85,
        writing: 88,
        speaking: 92,
    },
    {
        id: "4",
        name: "Deni Kurniawan",
        reading: 68,
        listening: 72,
        writing: 70,
        speaking: 75,
    },
    {
        id: "5",
        name: "Eka Putri",
        reading: 82,
        listening: 80,
        writing: 85,
        speaking: 78,
    },
];

const hotsAnalysisData = [
    { name: "Analyze", nilai: 78 },
    { name: "Evaluate", nilai: 65 },
    { name: "Create", nilai: 82 },
    { name: "Problem-solve", nilai: 70 },
    { name: "Infer", nilai: 75 },
];

const assignmentResultsData = [
    {
        id: "1",
        title: "Analisis Artikel Berita",
        completed: 28,
        pending: 4,
        avgScore: 82,
        dueDate: "2024-07-15",
    },
    {
        id: "2",
        title: "Menulis Esai Argumentatif",
        completed: 25,
        pending: 7,
        avgScore: 78,
        dueDate: "2024-07-10",
    },
    {
        id: "3",
        title: "Presentasi Solusi Masalah",
        completed: 30,
        pending: 2,
        avgScore: 85,
        dueDate: "2024-07-20",
    },
];

export default function ReportsPage() {
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [selectedFormat, setSelectedFormat] = useState("pdf");

    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-bold'>Laporan & Ekspor</h1>
            </div>

            <Tabs defaultValue='student-progress'>
                <TabsList className='grid w-full grid-cols-3'>
                    <TabsTrigger value='student-progress'>
                        Kemajuan Siswa
                    </TabsTrigger>
                    <TabsTrigger value='assignment-results'>
                        Hasil Tugas
                    </TabsTrigger>
                    <TabsTrigger value='hots-analysis'>
                        Analisis HOTS
                    </TabsTrigger>
                </TabsList>

                <div className='mt-6 mb-4 flex justify-between items-center'>
                    <div className='flex items-center gap-2'>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant='outline'
                                    className='flex items-center gap-2'
                                >
                                    <Filter className='h-4 w-4' />
                                    <span>Filter</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-80'>
                                <div className='space-y-4'>
                                    <h4 className='font-medium'>
                                        Rentang Waktu
                                    </h4>
                                    <div className='grid grid-cols-2 gap-2'>
                                        <div className='space-y-2'>
                                            <Label>Dari Tanggal</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant='outline'
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal",
                                                            !startDate &&
                                                                "text-muted-foreground"
                                                        )}
                                                    >
                                                        {startDate
                                                            ? format(
                                                                  startDate,
                                                                  "dd/MM/yyyy"
                                                              )
                                                            : "Pilih tanggal"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className='w-auto p-0'>
                                                    <Calendar
                                                        mode='single'
                                                        selected={startDate}
                                                        onSelect={setStartDate}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        <div className='space-y-2'>
                                            <Label>Sampai Tanggal</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant='outline'
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal",
                                                            !endDate &&
                                                                "text-muted-foreground"
                                                        )}
                                                    >
                                                        {endDate
                                                            ? format(
                                                                  endDate,
                                                                  "dd/MM/yyyy"
                                                              )
                                                            : "Pilih tanggal"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className='w-auto p-0'>
                                                    <Calendar
                                                        mode='single'
                                                        selected={endDate}
                                                        onSelect={setEndDate}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>

                                    <div className='space-y-2'>
                                        <Label>Kelas</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Pilih kelas' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='all'>
                                                    Semua Kelas
                                                </SelectItem>
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
                                    </div>

                                    <div className='pt-2'>
                                        <Button className='w-full'>
                                            Terapkan Filter
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className='flex items-center gap-2'>
                        <Select
                            value={selectedFormat}
                            onValueChange={setSelectedFormat}
                        >
                            <SelectTrigger className='w-32'>
                                <SelectValue placeholder='Format' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='pdf'>PDF</SelectItem>
                                <SelectItem value='excel'>Excel</SelectItem>
                                <SelectItem value='csv'>CSV</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button className='flex items-center gap-2'>
                            <Download className='h-4 w-4' />
                            <span>Ekspor</span>
                        </Button>
                    </div>
                </div>

                <TabsContent value='student-progress'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Kemajuan Siswa</CardTitle>
                            <CardDescription>
                                Laporan kemajuan siswa berdasarkan skill
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
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {studentProgressData.map((student) => {
                                        const average = Math.round(
                                            (student.reading +
                                                student.listening +
                                                student.writing +
                                                student.speaking) /
                                                4
                                        );
                                        return (
                                            <TableRow key={student.id}>
                                                <TableCell>
                                                    <Checkbox />
                                                </TableCell>
                                                <TableCell className='font-medium'>
                                                    {student.name}
                                                </TableCell>
                                                <TableCell>
                                                    {student.reading}
                                                </TableCell>
                                                <TableCell>
                                                    {student.listening}
                                                </TableCell>
                                                <TableCell>
                                                    {student.writing}
                                                </TableCell>
                                                <TableCell>
                                                    {student.speaking}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            average >= 80
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                    >
                                                        {average}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='assignment-results'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Hasil Tugas</CardTitle>
                            <CardDescription>
                                Laporan hasil tugas dan tingkat penyelesaian
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className='w-[50px]'>
                                            <Checkbox />
                                        </TableHead>
                                        <TableHead>Judul Tugas</TableHead>
                                        <TableHead>Selesai</TableHead>
                                        <TableHead>Belum</TableHead>
                                        <TableHead>Skor Rata-rata</TableHead>
                                        <TableHead>Tenggat</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {assignmentResultsData.map((assignment) => {
                                        const total =
                                            assignment.completed +
                                            assignment.pending;
                                        const completionRate = Math.round(
                                            (assignment.completed / total) * 100
                                        );

                                        return (
                                            <TableRow key={assignment.id}>
                                                <TableCell>
                                                    <Checkbox />
                                                </TableCell>
                                                <TableCell className='font-medium'>
                                                    {assignment.title}
                                                </TableCell>
                                                <TableCell>
                                                    {assignment.completed} (
                                                    {completionRate}%)
                                                </TableCell>
                                                <TableCell>
                                                    {assignment.pending}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            assignment.avgScore >=
                                                            80
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                    >
                                                        {assignment.avgScore}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {assignment.dueDate}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='hots-analysis'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Analisis HOTS</CardTitle>
                            <CardDescription>
                                Analisis kemampuan HOTS siswa berdasarkan
                                kategori
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='h-80'>
                                <ResponsiveContainer width='100%' height='100%'>
                                    <BarChart
                                        width={500}
                                        height={300}
                                        data={hotsAnalysisData}
                                        margin={{
                                            top: 5,
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
                                            dataKey='nilai'
                                            fill='#8884d8'
                                            name='Nilai Rata-rata'
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className='mt-6 flex justify-center gap-4'>
                                <div className='text-center'>
                                    <div className='text-2xl font-bold'>
                                        78%
                                    </div>
                                    <div className='text-sm text-muted-foreground'>
                                        Analyze
                                    </div>
                                </div>
                                <div className='text-center'>
                                    <div className='text-2xl font-bold'>
                                        65%
                                    </div>
                                    <div className='text-sm text-muted-foreground'>
                                        Evaluate
                                    </div>
                                </div>
                                <div className='text-center'>
                                    <div className='text-2xl font-bold'>
                                        82%
                                    </div>
                                    <div className='text-sm text-muted-foreground'>
                                        Create
                                    </div>
                                </div>
                                <div className='text-center'>
                                    <div className='text-2xl font-bold'>
                                        70%
                                    </div>
                                    <div className='text-sm text-muted-foreground'>
                                        Problem-solve
                                    </div>
                                </div>
                                <div className='text-center'>
                                    <div className='text-2xl font-bold'>
                                        75%
                                    </div>
                                    <div className='text-sm text-muted-foreground'>
                                        Infer
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Card>
                <CardHeader>
                    <CardTitle>Riwayat Ekspor</CardTitle>
                    <CardDescription>
                        Laporan yang telah diekspor sebelumnya
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama Laporan</TableHead>
                                <TableHead>Jenis</TableHead>
                                <TableHead>Format</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead className='text-right'>
                                    Aksi
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className='font-medium'>
                                    <div className='flex items-center gap-2'>
                                        <File className='h-4 w-4 text-muted-foreground' />
                                        <span>Kemajuan Siswa - Juni 2024</span>
                                    </div>
                                </TableCell>
                                <TableCell>Kemajuan Siswa</TableCell>
                                <TableCell>PDF</TableCell>
                                <TableCell>2024-06-30</TableCell>
                                <TableCell className='text-right'>
                                    <Button variant='ghost' size='sm'>
                                        <Download className='h-4 w-4' />
                                    </Button>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className='font-medium'>
                                    <div className='flex items-center gap-2'>
                                        <FileSpreadsheet className='h-4 w-4 text-muted-foreground' />
                                        <span>Hasil Tugas - Semester 1</span>\{" "}
                                    </div>
                                </TableCell>
                                <TableCell>Hasil Tugas</TableCell>
                                <TableCell>Excel</TableCell>
                                <TableCell>2024-06-25</TableCell>
                                <TableCell className='text-right'>
                                    <Button variant='ghost' size='sm'>
                                        <Download className='h-4 w-4' />
                                    </Button>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className='font-medium'>
                                    <div className='flex items-center gap-2'>
                                        <File className='h-4 w-4 text-muted-foreground' />
                                        <span>Analisis HOTS - Kelas 10A</span>
                                    </div>
                                </TableCell>
                                <TableCell>Analisis HOTS</TableCell>
                                <TableCell>PDF</TableCell>
                                <TableCell>2024-06-20</TableCell>
                                <TableCell className='text-right'>
                                    <Button variant='ghost' size='sm'>
                                        <Download className='h-4 w-4' />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
