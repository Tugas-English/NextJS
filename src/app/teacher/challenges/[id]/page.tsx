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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Award,
    Calendar,
    CheckCircle,
    ClockIcon,
    Download,
    Edit,
    FileText,
    HelpCircle,
    MoreHorizontal,
    Search,
    Trash2,
    Trophy,
    Users,
    X,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { useState } from "react";

// Data dummy untuk demo
const challenge = {
    id: "1",
    title: "Tulis Surat Opini tentang AI di Masa Depan",
    description:
        "Tantangan untuk menulis surat opini yang menganalisis dampak AI terhadap kehidupan manusia di masa depan.",
    skill: "writing",
    hotsType: "evaluate",
    startDate: "2024-07-01",
    endDate: "2024-07-07",
    rewardPoints: 200,
    badgeImage: "/badges/ai-opinion-badge.jpg",
    participants: 18,
    maxParticipants: 30,
    submissions: 12,
    status: "active" as const, // 'upcoming', 'active', 'completed'
    createdBy: {
        id: "1",
        name: "Ms. Johnson",
        avatar: "/avatars/teacher.jpg",
    },
    activityId: "12",
    activityTitle: "Menulis Surat Opini",
};

const participants = [
    {
        id: "1",
        name: "Andi Pratama",
        avatar: "/avatars/student-1.jpg",
        joinedAt: "2024-07-01 10:15",
        submittedAt: "2024-07-03 14:30",
        score: null,
    },
    {
        id: "2",
        name: "Budi Santoso",
        avatar: "/avatars/student-2.jpg",
        joinedAt: "2024-07-01 11:25",
        submittedAt: "2024-07-02 16:45",
        score: null,
    },
    {
        id: "3",
        name: "Citra Dewi",
        avatar: "/avatars/student-3.jpg",
        joinedAt: "2024-07-01 12:10",
        submittedAt: "2024-07-04 09:20",
        score: null,
    },
    {
        id: "4",
        name: "Deni Kurniawan",
        avatar: "/avatars/student-4.jpg",
        joinedAt: "2024-07-02 08:30",
        submittedAt: null,
        score: null,
    },
    {
        id: "5",
        name: "Eka Putri",
        avatar: "/avatars/student-5.jpg",
        joinedAt: "2024-07-02 13:45",
        submittedAt: "2024-07-05 11:05",
        score: null,
    },
];

const completedChallenge = {
    ...challenge,
    status: "completed" as const,
    participants: 25,
    submissions: 22,
    winners: [
        {
            id: "3",
            name: "Citra Dewi",
            avatar: "/avatars/student-3.jpg",
            score: 95,
        },
        {
            id: "1",
            name: "Andi Pratama",
            avatar: "/avatars/student-1.jpg",
            score: 92,
        },
        {
            id: "5",
            name: "Eka Putri",
            avatar: "/avatars/student-5.jpg",
            score: 88,
        },
    ],
};

const discussionPosts = [
    {
        id: "1",
        content:
            "Apakah kita bisa menulis dari perspektif yang berbeda? Misalnya, dari sudut pandang pengembang AI?",
        author: {
            id: "1",
            name: "Andi Pratama",
            avatar: "/avatars/student-1.jpg",
        },
        timestamp: "2024-07-02 09:45",
        replies: [
            {
                id: "2",
                content:
                    "Tentu saja, kamu bisa memilih perspektif yang menurutmu menarik. Yang penting bisa memberikan argumen yang kuat!",
                author: {
                    id: "teacher",
                    name: "Ms. Johnson",
                    avatar: "/avatars/teacher.jpg",
                },
                timestamp: "2024-07-02 10:15",
            },
        ],
    },
    {
        id: "3",
        content: "Berapa panjang tulisan yang diharapkan untuk tantangan ini?",
        author: {
            id: "4",
            name: "Deni Kurniawan",
            avatar: "/avatars/student-4.jpg",
        },
        timestamp: "2024-07-03 08:30",
        replies: [
            {
                id: "4",
                content:
                    "Minimal 500 kata, maksimal 1000 kata untuk surat opini ini.",
                author: {
                    id: "teacher",
                    name: "Ms. Johnson",
                    avatar: "/avatars/teacher.jpg",
                },
                timestamp: "2024-07-03 09:05",
            },
        ],
    },
];

export default function ChallengeDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const [searchParticipant, setSearchParticipant] = useState("");

    // Untuk demo, kita gunakan challenge data sesuai status
    const challengeData =
        challenge.status === "completed" ? completedChallenge : challenge;

    // Filter partisipan berdasarkan pencarian
    const filteredParticipants = participants.filter((participant) =>
        participant.name.toLowerCase().includes(searchParticipant.toLowerCase())
    );

    // Hitung persentase pengumpulan
    const submissionPercentage =
        (challengeData.submissions / challengeData.participants) * 100;
    const participantPercentage =
        (challengeData.participants / challengeData.maxParticipants) * 100;

    // Format tanggal
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <div className='space-y-1'>
                    <div className='flex items-center gap-2'>
                        <Link href='/teacher/challenges'>
                            <Button variant='ghost' size='sm'>
                                Tantangan
                            </Button>
                        </Link>
                        <span>/</span>
                        <span className='text-muted-foreground'>
                            {challengeData.title}
                        </span>
                    </div>
                    <h1 className='text-3xl font-bold'>
                        {challengeData.title}
                    </h1>
                </div>
                <div className='flex gap-2'>
                    <Button
                        variant='outline'
                        className='flex items-center gap-2'
                    >
                        <Edit className='h-4 w-4' />
                        <span>Edit</span>
                    </Button>
                    {challengeData.status === "completed" ? (
                        <Button className='flex items-center gap-2'>
                            <Download className='h-4 w-4' />
                            <span>Ekspor Hasil</span>
                        </Button>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className='flex items-center gap-2'>
                                    <MoreHorizontal className='h-4 w-4' />
                                    <span>Tindakan</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                                {challengeData.status === "upcoming" && (
                                    <DropdownMenuItem>
                                        Mulai Tantangan Sekarang
                                    </DropdownMenuItem>
                                )}
                                {challengeData.status === "active" && (
                                    <DropdownMenuItem>
                                        Selesaikan Tantangan
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem className='text-destructive'>
                                    <Trash2 className='h-4 w-4 mr-2' />
                                    <span>Hapus Tantangan</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <Card className='md:col-span-2'>
                    <CardHeader>
                        <CardTitle>Detail Tantangan</CardTitle>
                        <CardDescription>
                            Informasi tentang tantangan mingguan
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                        <div className='space-y-2'>
                            <h3 className='text-sm font-medium text-muted-foreground'>
                                Deskripsi
                            </h3>
                            <p>{challengeData.description}</p>
                        </div>

                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                            <div className='space-y-1'>
                                <div className='text-sm font-medium text-muted-foreground'>
                                    Status
                                </div>
                                <div>
                                    {challengeData.status === "upcoming" && (
                                        <Badge
                                            variant='outline'
                                            className='flex items-center gap-1 w-fit'
                                        >
                                            <ClockIcon className='h-3 w-3' />
                                            <span>Akan Datang</span>
                                        </Badge>
                                    )}
                                    {challengeData.status === "active" && (
                                        <Badge className='flex items-center gap-1 w-fit'>
                                            <CheckCircle className='h-3 w-3' />
                                            <span>Aktif</span>
                                        </Badge>
                                    )}
                                    {challengeData.status === "completed" && (
                                        <Badge
                                            variant='secondary'
                                            className='flex items-center gap-1 w-fit'
                                        >
                                            <Trophy className='h-3 w-3' />
                                            <span>Selesai</span>
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <div className='space-y-1'>
                                <div className='text-sm font-medium text-muted-foreground'>
                                    Skill
                                </div>
                                <div>
                                    <Badge variant='outline'>
                                        {challengeData.skill}
                                    </Badge>
                                </div>
                            </div>
                            <div className='space-y-1'>
                                <div className='text-sm font-medium text-muted-foreground'>
                                    HOTS Type
                                </div>
                                <div>
                                    <Badge>{challengeData.hotsType}</Badge>
                                </div>
                            </div>
                            <div className='space-y-1'>
                                <div className='text-sm font-medium text-muted-foreground'>
                                    Poin Hadiah
                                </div>
                                <div className='flex items-center gap-1'>
                                    <Trophy className='h-4 w-4 text-amber-500' />
                                    <span>
                                        {challengeData.rewardPoints} poin
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-1'>
                                <div className='text-sm font-medium text-muted-foreground'>
                                    Tanggal Mulai
                                </div>
                                <div className='flex items-center gap-1'>
                                    <Calendar className='h-4 w-4 text-muted-foreground' />
                                    <span>
                                        {formatDate(challengeData.startDate)}
                                    </span>
                                </div>
                            </div>
                            <div className='space-y-1'>
                                <div className='text-sm font-medium text-muted-foreground'>
                                    Tanggal Berakhir
                                </div>
                                <div className='flex items-center gap-1'>
                                    <Calendar className='h-4 w-4 text-muted-foreground' />
                                    <span>
                                        {formatDate(challengeData.endDate)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {challengeData.activityId && (
                            <div className='space-y-1'>
                                <div className='text-sm font-medium text-muted-foreground'>
                                    Aktivitas Terkait
                                </div>
                                <div className='flex items-center gap-2'>
                                    <FileText className='h-4 w-4 text-muted-foreground' />
                                    <Link
                                        href={`/teacher/activities/${challengeData.activityId}`}
                                        className='text-blue-600 hover:underline'
                                    >
                                        {challengeData.activityTitle}
                                    </Link>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className='md:col-span-1'>
                    <CardHeader>
                        <CardTitle>Statistik</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                        <div className='space-y-2'>
                            <div className='flex justify-between text-sm'>
                                <span className='text-muted-foreground'>
                                    Partisipan
                                </span>
                                <span>
                                    {challengeData.participants}/
                                    {challengeData.maxParticipants}
                                </span>
                            </div>
                            <Progress value={participantPercentage} />
                        </div>

                        <div className='space-y-2'>
                            <div className='flex justify-between text-sm'>
                                <span className='text-muted-foreground'>
                                    Pengumpulan
                                </span>
                                <span>
                                    {challengeData.submissions}/
                                    {challengeData.participants}
                                </span>
                            </div>
                            <Progress value={submissionPercentage} />
                        </div>

                        {challengeData.status === "completed" && (
                            <div className='pt-4'>
                                <h3 className='text-sm font-medium mb-3'>
                                    Pemenang
                                </h3>
                                <div className='space-y-4'>
                                    {completedChallenge.winners.map(
                                        (winner, index) => (
                                            <div
                                                key={winner.id}
                                                className='flex items-center gap-3'
                                            >
                                                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10'>
                                                    <span className='text-sm font-semibold'>
                                                        #{index + 1}
                                                    </span>
                                                </div>
                                                <Avatar className='h-8 w-8'>
                                                    <AvatarImage
                                                        src={winner.avatar}
                                                        alt={winner.name}
                                                    />
                                                    <AvatarFallback>
                                                        {winner.name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className='flex-1'>
                                                    <div className='font-medium'>
                                                        {winner.name}
                                                    </div>
                                                </div>
                                                <Badge variant='secondary'>
                                                    {winner.score}
                                                </Badge>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                        <div className='pt-4'>
                            <div className='text-sm font-medium'>Badge</div>
                            <div className='flex justify-center py-4'>
                                <div className='w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center'>
                                    <Trophy className='h-12 w-12 text-amber-500' />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue='participants'>
                <TabsList className='grid w-full grid-cols-2'>
                    <TabsTrigger
                        value='participants'
                        className='flex items-center gap-2'
                    >
                        <Users className='h-4 w-4' />
                        <span>Partisipan ({challengeData.participants})</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value='discussion'
                        className='flex items-center gap-2'
                    >
                        <MessageSquare className='h-4 w-4' />
                        <span>Diskusi ({discussionPosts.length})</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value='participants' className='mt-6'>
                    <Card>
                        <CardHeader>
                            <div className='flex justify-between items-center'>
                                <CardTitle>Daftar Partisipan</CardTitle>
                                <div className='relative w-64'>
                                    <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                                    <Input
                                        type='search'
                                        placeholder='Cari partisipan...'
                                        className='pl-8'
                                        value={searchParticipant}
                                        onChange={(e) =>
                                            setSearchParticipant(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama Siswa</TableHead>
                                        <TableHead>Tanggal Bergabung</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Nilai</TableHead>
                                        <TableHead className='text-right'>
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredParticipants.map((participant) => (
                                        <TableRow key={participant.id}>
                                            <TableCell>
                                                <div className='flex items-center gap-2'>
                                                    <Avatar className='h-8 w-8'>
                                                        <AvatarImage
                                                            src={
                                                                participant.avatar
                                                            }
                                                            alt={
                                                                participant.name
                                                            }
                                                        />
                                                        <AvatarFallback>
                                                            {participant.name.charAt(
                                                                0
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className='font-medium'>
                                                        {participant.name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {participant.joinedAt}
                                            </TableCell>
                                            <TableCell>
                                                {participant.submittedAt ? (
                                                    <Badge>
                                                        Sudah Mengumpulkan
                                                    </Badge>
                                                ) : (
                                                    <Badge variant='outline'>
                                                        Belum Mengumpulkan
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {participant.score ? (
                                                    <Badge variant='secondary'>
                                                        {participant.score}
                                                    </Badge>
                                                ) : (
                                                    <span className='text-muted-foreground'>
                                                        -
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className='text-right'>
                                                {participant.submittedAt && (
                                                    <Button
                                                        variant='ghost'
                                                        size='sm'
                                                    >
                                                        Lihat Pengumpulan
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='discussion' className='mt-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Diskusi Tantangan</CardTitle>
                            <CardDescription>
                                Tanya jawab dan diskusi terkait tantangan ini
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-6'>
                                {discussionPosts.map((post) => (
                                    <div
                                        key={post.id}
                                        className='border rounded-md p-4'
                                    >
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center gap-2'>
                                                <Avatar className='h-8 w-8'>
                                                    <AvatarImage
                                                        src={post.author.avatar}
                                                        alt={post.author.name}
                                                    />
                                                    <AvatarFallback>
                                                        {post.author.name.charAt(
                                                            0
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className='font-medium'>
                                                        {post.author.name}
                                                    </div>
                                                    <div className='text-xs text-muted-foreground'>
                                                        {post.timestamp}
                                                    </div>
                                                </div>
                                            </div>
                                            <Button variant='ghost' size='sm'>
                                                <MoreHorizontal className='h-4 w-4' />
                                            </Button>
                                        </div>
                                        <div className='mt-3'>
                                            <p className='text-sm'>
                                                {post.content}
                                            </p>
                                        </div>

                                        {post.replies &&
                                            post.replies.length > 0 && (
                                                <div className='mt-4 pl-8 border-l space-y-4'>
                                                    {post.replies.map(
                                                        (reply) => (
                                                            <div key={reply.id}>
                                                                <div className='flex items-center justify-between'>
                                                                    <div className='flex items-center gap-2'>
                                                                        <Avatar className='h-6 w-6'>
                                                                            <AvatarImage
                                                                                src={
                                                                                    reply
                                                                                        .author
                                                                                        .avatar
                                                                                }
                                                                                alt={
                                                                                    reply
                                                                                        .author
                                                                                        .name
                                                                                }
                                                                            />
                                                                            <AvatarFallback>
                                                                                {reply.author.name.charAt(
                                                                                    0
                                                                                )}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                        <div>
                                                                            <div className='font-medium text-sm'>
                                                                                {
                                                                                    reply
                                                                                        .author
                                                                                        .name
                                                                                }
                                                                                {reply
                                                                                    .author
                                                                                    .id ===
                                                                                    "teacher" && (
                                                                                    <Badge
                                                                                        className='ml-2'
                                                                                        variant='secondary'
                                                                                    >
                                                                                        Guru
                                                                                    </Badge>
                                                                                )}
                                                                            </div>
                                                                            <div className='text-xs text-muted-foreground'>
                                                                                {
                                                                                    reply.timestamp
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <Button
                                                                        variant='ghost'
                                                                        size='sm'
                                                                    >
                                                                        <MoreHorizontal className='h-4 w-4' />
                                                                    </Button>
                                                                </div>
                                                                <div className='mt-2'>
                                                                    <p className='text-sm'>
                                                                        {
                                                                            reply.content
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}

                                        <div className='mt-4 flex justify-end'>
                                            <Button variant='ghost' size='sm'>
                                                Balas
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant='outline' className='w-full'>
                                Buat Postingan Baru
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>

            {challengeData.status === "active" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Notifikasi Siswa</CardTitle>
                        <CardDescription>
                            Kirim pengingat atau pemberitahuan kepada siswa
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='space-y-2'>
                            <h3 className='text-sm font-medium text-muted-foreground'>
                                Notifikasi Cepat
                            </h3>
                            <div className='flex gap-2'>
                                <Button className='flex items-center gap-2'>
                                    <HelpCircle className='h-4 w-4' />
                                    <span>Pengingat Tenggat</span>
                                </Button>
                                <Button
                                    variant='outline'
                                    className='flex items-center gap-2'
                                >
                                    <Award className='h-4 w-4' />
                                    <span>Umumkan Pemenang</span>
                                </Button>
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <h3 className='text-sm font-medium text-muted-foreground'>
                                Kirim Pesan Kustom
                            </h3>
                            <Textarea
                                placeholder='Ketik pesan notifikasi untuk siswa...'
                                rows={3}
                            />
                            <div className='flex justify-end'>
                                <Button variant='outline'>
                                    Kirim ke Semua Partisipan
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
