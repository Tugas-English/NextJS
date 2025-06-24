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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Award,
    Calendar,
    MoreHorizontal,
    Plus,
    Search,
    Trophy,
    Users,
} from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

const activeChallenge = {
    id: "1",
    title: "Tulis Surat Opini tentang AI di Masa Depan",
    description:
        "Tantangan untuk menulis surat opini yang menganalisis dampak AI terhadap kehidupan manusia di masa depan.",
    skill: "writing",
    hotsType: "evaluate",
    startDate: "2024-07-01",
    endDate: "2024-07-07",
    participants: 18,
    maxParticipants: 30,
    rewardPoints: 200,
    submissions: 12,
};

const upcomingChallenges = [
    {
        id: "2",
        title: "Analisis Dampak Perubahan Iklim",
        description:
            "Tantangan untuk menganalisis artikel tentang perubahan iklim dan memberikan solusi.",
        skill: "reading",
        hotsType: "analyze",
        startDate: "2024-07-08",
        endDate: "2024-07-14",
        participants: 15,
        maxParticipants: 30,
        rewardPoints: 150,
    },
    {
        id: "3",
        title: "Presentasi Solusi Masalah Sosial",
        description:
            "Tantangan untuk mempresentasikan solusi atas masalah sosial di lingkungan sekitar.",
        skill: "speaking",
        hotsType: "problem-solve",
        startDate: "2024-07-15",
        endDate: "2024-07-21",
        participants: 10,
        maxParticipants: 30,
        rewardPoints: 180,
    },
];

const pastChallenges = [
    {
        id: "4",
        title: "Evaluasi Pidato Tokoh Inspiratif",
        description:
            "Tantangan untuk mengevaluasi pidato tokoh inspiratif dan menganalisis teknik persuasi.",
        skill: "listening",
        hotsType: "evaluate",
        startDate: "2024-06-24",
        endDate: "2024-06-30",
        participants: 25,
        maxParticipants: 30,
        rewardPoints: 150,
        submissions: 22,
        winners: [
            { id: "1", name: "Andi Pratama", score: 95 },
            { id: "2", name: "Citra Dewi", score: 92 },
            { id: "3", name: "Budi Santoso", score: 88 },
        ],
    },
    {
        id: "5",
        title: "Infografis Tentang Energi Terbarukan",
        description:
            "Tantangan untuk membuat infografis yang menjelaskan tentang energi terbarukan.",
        skill: "writing",
        hotsType: "create",
        startDate: "2024-06-17",
        endDate: "2024-06-23",
        participants: 20,
        maxParticipants: 30,
        rewardPoints: 180,
        submissions: 18,
        winners: [
            { id: "3", name: "Budi Santoso", score: 96 },
            { id: "5", name: "Eka Putri", score: 94 },
            { id: "1", name: "Andi Pratama", score: 90 },
        ],
    },
];

const topParticipants = [
    { id: "1", name: "Andi Pratama", challenges: 8, wins: 3, points: 580 },
    { id: "3", name: "Budi Santoso", challenges: 7, wins: 2, points: 520 },
    { id: "5", name: "Eka Putri", challenges: 6, wins: 2, points: 480 },
    { id: "2", name: "Citra Dewi", challenges: 8, wins: 1, points: 450 },
    { id: "4", name: "Deni Kurniawan", challenges: 5, wins: 1, points: 320 },
];

export default function ChallengesPage() {
    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-bold'>Tantangan Mingguan</h1>
                <Link href='/teacher/challenges/create'>
                    <Button className='flex items-center gap-2'>
                        <Plus className='h-4 w-4' />
                        <span>Buat Tantangan</span>
                    </Button>
                </Link>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Total Tantangan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>12</div>
                        <p className='text-xs text-muted-foreground'>
                            +2 bulan ini
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Total Partisipan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>85</div>
                        <p className='text-xs text-muted-foreground'>
                            +15 bulan ini
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Poin Dibagikan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>2,450</div>
                        <p className='text-xs text-muted-foreground'>
                            +350 bulan ini
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Tantangan Aktif</CardTitle>
                    <CardDescription>
                        Tantangan yang sedang berlangsung saat ini
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {activeChallenge ? (
                        <div className='space-y-4'>
                            <div className='flex justify-between items-start'>
                                <div>
                                    <h3 className='text-lg font-semibold'>
                                        {activeChallenge.title}
                                    </h3>
                                    <p className='text-sm text-muted-foreground mt-1'>
                                        {activeChallenge.description}
                                    </p>
                                </div>
                                <Badge className='ml-2'>Aktif</Badge>
                            </div>

                            <div className='flex flex-wrap gap-2'>
                                <Badge variant='outline'>
                                    {activeChallenge.skill}
                                </Badge>
                                <Badge variant='secondary'>
                                    {activeChallenge.hotsType}
                                </Badge>
                                <Badge
                                    variant='outline'
                                    className='flex items-center gap-1'
                                >
                                    <Trophy className='h-3 w-3' />
                                    {activeChallenge.rewardPoints} poin
                                </Badge>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
                                <div className='space-y-2'>
                                    <div className='flex justify-between text-sm'>
                                        <span className='text-muted-foreground'>
                                            Tanggal
                                        </span>
                                        <span>
                                            {activeChallenge.startDate} -{" "}
                                            {activeChallenge.endDate}
                                        </span>
                                    </div>
                                </div>
                                <div className='space-y-2'>
                                    <div className='flex justify-between text-sm'>
                                        <span className='text-muted-foreground'>
                                            Partisipan
                                        </span>
                                        <span>
                                            {activeChallenge.participants}/
                                            {activeChallenge.maxParticipants}
                                        </span>
                                    </div>
                                    <Progress
                                        value={
                                            (activeChallenge.participants /
                                                activeChallenge.maxParticipants) *
                                            100
                                        }
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <div className='flex justify-between text-sm'>
                                        <span className='text-muted-foreground'>
                                            Pengumpulan
                                        </span>
                                        <span>
                                            {activeChallenge.submissions}/
                                            {activeChallenge.participants}
                                        </span>
                                    </div>
                                    <Progress
                                        value={
                                            (activeChallenge.submissions /
                                                activeChallenge.participants) *
                                            100
                                        }
                                    />
                                </div>
                            </div>

                            <div className='flex justify-end gap-2 mt-4'>
                                <Button variant='outline'>
                                    Lihat Partisipan
                                </Button>
                                <Button variant='outline'>
                                    Lihat Pengumpulan
                                </Button>
                                <Button>Kelola Tantangan</Button>
                            </div>
                        </div>
                    ) : (
                        <div className='text-center py-8'>
                            <Award className='h-12 w-12 mx-auto text-muted-foreground' />
                            <h3 className='mt-4 text-lg font-medium'>
                                Tidak Ada Tantangan Aktif
                            </h3>
                            <p className='mt-2 text-sm text-muted-foreground'>
                                Saat ini tidak ada tantangan yang sedang
                                berlangsung.
                            </p>
                            <Button className='mt-4'>
                                Buat Tantangan Baru
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Tabs defaultValue='upcoming'>
                <TabsList className='grid w-full grid-cols-2'>
                    <TabsTrigger value='upcoming'>Akan Datang</TabsTrigger>
                    <TabsTrigger value='past'>Selesai</TabsTrigger>
                </TabsList>

                <TabsContent value='upcoming' className='mt-6'>
                    <Card>
                        <CardHeader>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <CardTitle>Tantangan Mendatang</CardTitle>
                                    <CardDescription>
                                        Tantangan yang akan dimulai dalam waktu
                                        dekat
                                    </CardDescription>
                                </div>
                                <div className='relative w-64'>
                                    <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                                    <Input
                                        type='search'
                                        placeholder='Cari tantangan...'
                                        className='pl-8'
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Judul</TableHead>
                                        <TableHead>Skill</TableHead>
                                        <TableHead>HOTS Type</TableHead>
                                        <TableHead>Periode</TableHead>
                                        <TableHead>Partisipan</TableHead>
                                        <TableHead>Poin</TableHead>
                                        <TableHead className='text-right'>
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {upcomingChallenges.map((challenge) => (
                                        <TableRow key={challenge.id}>
                                            <TableCell className='font-medium'>
                                                <div className='flex items-center gap-2'>
                                                    <Award className='h-4 w-4 text-muted-foreground' />
                                                    {challenge.title}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant='outline'>
                                                    {challenge.skill}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant='secondary'>
                                                    {challenge.hotsType}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className='flex items-center gap-1'>
                                                    <Calendar className='h-3 w-3 text-muted-foreground' />
                                                    <span>
                                                        {challenge.startDate} -{" "}
                                                        {challenge.endDate}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className='flex items-center gap-1'>
                                                    <Users className='h-3 w-3 text-muted-foreground' />
                                                    <span>
                                                        {challenge.participants}
                                                        /
                                                        {
                                                            challenge.maxParticipants
                                                        }
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className='flex items-center gap-1'>
                                                    <Trophy className='h-3 w-3 text-muted-foreground' />
                                                    <span>
                                                        {challenge.rewardPoints}
                                                    </span>
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
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            Lihat Detail
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            Lihat Partisipan
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className='text-destructive'>
                                                            Batalkan
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

                <TabsContent value='past' className='mt-6'>
                    <Card>
                        <CardHeader>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <CardTitle>Tantangan Selesai</CardTitle>
                                    <CardDescription>
                                        Tantangan yang telah selesai
                                    </CardDescription>
                                </div>
                                <div className='relative w-64'>
                                    <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                                    <Input
                                        type='search'
                                        placeholder='Cari tantangan...'
                                        className='pl-8'
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Judul</TableHead>
                                        <TableHead>Skill</TableHead>
                                        <TableHead>HOTS Type</TableHead>
                                        <TableHead>Periode</TableHead>
                                        <TableHead>Partisipasi</TableHead>
                                        <TableHead>Pemenang</TableHead>
                                        <TableHead className='text-right'>
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pastChallenges.map((challenge) => (
                                        <TableRow key={challenge.id}>
                                            <TableCell className='font-medium'>
                                                <div className='flex items-center gap-2'>
                                                    <Award className='h-4 w-4 text-muted-foreground' />
                                                    {challenge.title}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant='outline'>
                                                    {challenge.skill}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant='secondary'>
                                                    {challenge.hotsType}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className='flex items-center gap-1'>
                                                    <Calendar className='h-3 w-3 text-muted-foreground' />
                                                    <span>
                                                        {challenge.startDate} -{" "}
                                                        {challenge.endDate}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className='flex items-center gap-1'>
                                                    <span>
                                                        {challenge.submissions}/
                                                        {challenge.participants}
                                                    </span>
                                                    <span className='text-xs text-muted-foreground'>
                                                        (
                                                        {Math.round(
                                                            (challenge.submissions /
                                                                challenge.participants) *
                                                                100
                                                        )}
                                                        %)
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className='flex flex-col'>
                                                    <span className='text-xs font-medium'>
                                                        {
                                                            challenge.winners[0]
                                                                .name
                                                        }
                                                    </span>
                                                    <span className='text-xs text-muted-foreground'>
                                                        {
                                                            challenge.winners[0]
                                                                .score
                                                        }{" "}
                                                        poin
                                                    </span>
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
                                                            Lihat Detail
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            Lihat Pemenang
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            Lihat Pengumpulan
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            Duplikat Tantangan
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
            </Tabs>

            <Card>
                <CardHeader>
                    <CardTitle>Leaderboard Siswa</CardTitle>
                    <CardDescription>
                        Siswa dengan performa terbaik dalam tantangan mingguan
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Peringkat</TableHead>
                                <TableHead>Nama Siswa</TableHead>
                                <TableHead>Tantangan Diikuti</TableHead>
                                <TableHead>Kemenangan</TableHead>
                                <TableHead>Total Poin</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topParticipants.map((student, index) => (
                                <TableRow key={student.id}>
                                    <TableCell>
                                        <div className='flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-medium'>
                                            {index + 1}
                                        </div>
                                    </TableCell>
                                    <TableCell className='font-medium'>
                                        {student.name}
                                    </TableCell>
                                    <TableCell>{student.challenges}</TableCell>
                                    <TableCell>{student.wins}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant='secondary'
                                            className='flex items-center gap-1'
                                        >
                                            <Trophy className='h-3 w-3' />
                                            {student.points}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
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
