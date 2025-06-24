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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Lock,
    MessageSquare,
    MoreHorizontal,
    Pin,
    PlusCircle,
    Search,
    Users,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

// Data dummy untuk demo
const discussionThreads = [
    {
        id: "1",
        title: "Dampak AI pada Masa Depan Pendidikan",
        description:
            "Diskusi tentang bagaimana AI akan mengubah cara kita belajar dan mengajar",
        category: "general",
        author: {
            name: "Ms. Johnson",
            avatar: "/avatars/teacher.jpg",
        },
        postsCount: 24,
        participantsCount: 15,
        lastActivity: "2024-07-05 14:30",
        isPinned: true,
        isLocked: false,
    },
    {
        id: "2",
        title: "Analisis Puisi 'Aku' karya Chairil Anwar",
        description:
            "Diskusi analisis mendalam tentang puisi terkenal karya Chairil Anwar",
        category: "assignment",
        assignment: "Analisis Puisi Modern",
        author: {
            name: "Ms. Johnson",
            avatar: "/avatars/teacher.jpg",
        },
        postsCount: 18,
        participantsCount: 12,
        lastActivity: "2024-07-04 09:15",
        isPinned: false,
        isLocked: false,
    },
    {
        id: "3",
        title: "Teknik Menulis Esai Argumentatif",
        description:
            "Tips dan trik untuk menulis esai argumentatif yang meyakinkan",
        category: "module",
        module: "Modul Menulis Kreatif",
        author: {
            name: "Ms. Johnson",
            avatar: "/avatars/teacher.jpg",
        },
        postsCount: 12,
        participantsCount: 20,
        lastActivity: "2024-07-03 16:45",
        isPinned: false,
        isLocked: false,
    },
    {
        id: "4",
        title: "Diskusi Tantangan Mingguan: Surat Opini tentang AI",
        description:
            "Forum diskusi untuk tantangan mingguan yang sedang berlangsung",
        category: "challenge",
        challenge: "Tulis Surat Opini tentang AI di Masa Depan",
        author: {
            name: "Ms. Johnson",
            avatar: "/avatars/teacher.jpg",
        },
        postsCount: 30,
        participantsCount: 18,
        lastActivity: "2024-07-05 10:20",
        isPinned: true,
        isLocked: false,
    },
    {
        id: "5",
        title: "Strategi Pengembangan Keterampilan Berpikir Kritis",
        description:
            "Diskusi tentang metode efektif untuk mengembangkan kemampuan berpikir kritis",
        category: "general",
        author: {
            name: "Ms. Johnson",
            avatar: "/avatars/teacher.jpg",
        },
        postsCount: 8,
        participantsCount: 10,
        lastActivity: "2024-07-02 13:10",
        isPinned: false,
        isLocked: true,
    },
];

const recentPosts = [
    {
        id: "1",
        content:
            "Saya setuju dengan pendapat Budi. AI dapat membantu personalisasi pembelajaran, tetapi tidak bisa menggantikan peran guru sepenuhnya...",
        threadId: "1",
        threadTitle: "Dampak AI pada Masa Depan Pendidikan",
        author: {
            id: "1",
            name: "Andi Pratama",
            avatar: "/avatars/student-1.jpg",
        },
        timestamp: "2024-07-05 14:30",
        likesCount: 5,
    },
    {
        id: "2",
        content:
            "Menurut analisis saya, puisi ini menggambarkan semangat individualisme dan kebebasan. Penggunaan kata 'aku' yang berulang menekankan...",
        threadId: "2",
        threadTitle: "Analisis Puisi 'Aku' karya Chairil Anwar",
        author: {
            id: "3",
            name: "Citra Dewi",
            avatar: "/avatars/student-3.jpg",
        },
        timestamp: "2024-07-04 09:15",
        likesCount: 8,
    },
    {
        id: "3",
        content:
            "Dalam menulis esai argumentatif, penting untuk memiliki thesis statement yang jelas di paragraf pembuka. Selain itu, setiap paragraf harus...",
        threadId: "3",
        threadTitle: "Teknik Menulis Esai Argumentatif",
        author: {
            id: "2",
            name: "Budi Santoso",
            avatar: "/avatars/student-2.jpg",
        },
        timestamp: "2024-07-03 16:45",
        likesCount: 3,
    },
];

export default function DiscussionsPage() {
    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-bold'>Forum Diskusi</h1>
                <Link href='/teacher/discussions/create'>
                    <Button className='flex items-center gap-2'>
                        <PlusCircle className='h-4 w-4' />
                        <span>Buat Diskusi Baru</span>
                    </Button>
                </Link>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Total Diskusi
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>24</div>
                        <p className='text-xs text-muted-foreground'>
                            +3 bulan ini
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Total Postingan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>342</div>
                        <p className='text-xs text-muted-foreground'>
                            +45 bulan ini
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Partisipasi Siswa
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>78%</div>
                        <p className='text-xs text-muted-foreground'>
                            +5% dari bulan lalu
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue='all-discussions'>
                <TabsList className='grid w-full grid-cols-3'>
                    <TabsTrigger value='all-discussions'>
                        Semua Diskusi
                    </TabsTrigger>
                    <TabsTrigger value='recent-posts'>
                        Postingan Terbaru
                    </TabsTrigger>
                    <TabsTrigger value='my-discussions'>
                        Diskusi Saya
                    </TabsTrigger>
                </TabsList>

                <div className='mt-6 flex justify-between items-center'>
                    <div className='flex items-center gap-2'>
                        <select className='h-9 rounded-md border border-input bg-background px-3 text-sm'>
                            <option value='all'>Semua Kategori</option>
                            <option value='general'>Umum</option>
                            <option value='assignment'>Tugas</option>
                            <option value='module'>Modul</option>
                            <option value='challenge'>Tantangan</option>
                        </select>

                        <select className='h-9 rounded-md border border-input bg-background px-3 text-sm'>
                            <option value='newest'>Terbaru</option>
                            <option value='most-active'>Paling Aktif</option>
                            <option value='most-participants'>
                                Partisipan Terbanyak
                            </option>
                        </select>
                    </div>

                    <div className='relative w-64'>
                        <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                        <Input
                            type='search'
                            placeholder='Cari diskusi...'
                            className='pl-8'
                        />
                    </div>
                </div>

                <TabsContent value='all-discussions' className='mt-4'>
                    <Card>
                        <CardContent className='pt-6'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Judul Diskusi</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>Postingan</TableHead>
                                        <TableHead>Partisipan</TableHead>
                                        <TableHead>
                                            Aktivitas Terakhir
                                        </TableHead>
                                        <TableHead className='text-right'>
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {discussionThreads.map((thread) => (
                                        <TableRow key={thread.id}>
                                            <TableCell>
                                                <div className='space-y-1'>
                                                    <div className='flex items-center gap-2'>
                                                        <MessageSquare className='h-4 w-4 text-muted-foreground' />
                                                        <span className='font-medium'>
                                                            {thread.title}
                                                            {thread.isPinned && (
                                                                <Pin className='inline-block h-3 w-3 ml-1 text-muted-foreground' />
                                                            )}
                                                            {thread.isLocked && (
                                                                <Lock className='inline-block h-3 w-3 ml-1 text-muted-foreground' />
                                                            )}
                                                        </span>
                                                    </div>
                                                    <p className='text-xs text-muted-foreground line-clamp-1'>
                                                        {thread.description}
                                                    </p>
                                                    <div className='flex items-center gap-2'>
                                                        <Avatar className='h-5 w-5'>
                                                            <AvatarImage
                                                                src={
                                                                    thread
                                                                        .author
                                                                        .avatar
                                                                }
                                                                alt={
                                                                    thread
                                                                        .author
                                                                        .name
                                                                }
                                                            />
                                                            <AvatarFallback>
                                                                MJ
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className='text-xs'>
                                                            {thread.author.name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {thread.category ===
                                                    "general" && (
                                                    <Badge variant='outline'>
                                                        Umum
                                                    </Badge>
                                                )}
                                                {thread.category ===
                                                    "assignment" && (
                                                    <Badge variant='secondary'>
                                                        Tugas
                                                    </Badge>
                                                )}
                                                {thread.category ===
                                                    "module" && (
                                                    <Badge>Modul</Badge>
                                                )}
                                                {thread.category ===
                                                    "challenge" && (
                                                    <Badge variant='destructive'>
                                                        Tantangan
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {thread.postsCount}
                                            </TableCell>
                                            <TableCell>
                                                <div className='flex items-center gap-1'>
                                                    <Users className='h-3 w-3 text-muted-foreground' />
                                                    <span>
                                                        {
                                                            thread.participantsCount
                                                        }
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {thread.lastActivity}
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
                                                            Lihat Diskusi
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            Edit
                                                        </DropdownMenuItem>
                                                        {thread.isPinned ? (
                                                            <DropdownMenuItem>
                                                                Lepas Pin
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem>
                                                                Pin Diskusi
                                                            </DropdownMenuItem>
                                                        )}
                                                        {thread.isLocked ? (
                                                            <DropdownMenuItem>
                                                                Buka Kunci
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem>
                                                                Kunci Diskusi
                                                            </DropdownMenuItem>
                                                        )}
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
                </TabsContent>

                <TabsContent value='recent-posts' className='mt-4'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Postingan Terbaru</CardTitle>
                            <CardDescription>
                                Postingan terbaru dari siswa di forum diskusi
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-6'>
                                {recentPosts.map((post) => (
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
                                            <Badge variant='outline'>
                                                {post.likesCount} suka
                                            </Badge>
                                        </div>
                                        <div className='mt-3'>
                                            <p className='text-sm'>
                                                {post.content}
                                            </p>
                                        </div>
                                        <div className='mt-3 pt-3 border-t flex justify-between items-center'>
                                            <span className='text-xs text-muted-foreground'>
                                                Di thread: {post.threadTitle}
                                            </span>
                                            <Button variant='ghost' size='sm'>
                                                Lihat Diskusi
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='my-discussions' className='mt-4'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Diskusi Saya</CardTitle>
                            <CardDescription>
                                Diskusi yang Anda buat atau ikuti
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Judul Diskusi</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>Postingan</TableHead>
                                        <TableHead>Partisipan</TableHead>
                                        <TableHead>
                                            Aktivitas Terakhir
                                        </TableHead>
                                        <TableHead className='text-right'>
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {discussionThreads
                                        .filter(
                                            (thread) =>
                                                thread.author.name ===
                                                "Ms. Johnson"
                                        )
                                        .map((thread) => (
                                            <TableRow key={thread.id}>
                                                <TableCell>
                                                    <div className='space-y-1'>
                                                        <div className='flex items-center gap-2'>
                                                            <MessageSquare className='h-4 w-4 text-muted-foreground' />
                                                            <span className='font-medium'>
                                                                {thread.title}
                                                                {thread.isPinned && (
                                                                    <Pin className='inline-block h-3 w-3 ml-1 text-muted-foreground' />
                                                                )}
                                                                {thread.isLocked && (
                                                                    <Lock className='inline-block h-3 w-3 ml-1 text-muted-foreground' />
                                                                )}
                                                            </span>
                                                        </div>
                                                        <p className='text-xs text-muted-foreground line-clamp-1'>
                                                            {thread.description}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {thread.category ===
                                                        "general" && (
                                                        <Badge variant='outline'>
                                                            Umum
                                                        </Badge>
                                                    )}
                                                    {thread.category ===
                                                        "assignment" && (
                                                        <Badge variant='secondary'>
                                                            Tugas
                                                        </Badge>
                                                    )}
                                                    {thread.category ===
                                                        "module" && (
                                                        <Badge>Modul</Badge>
                                                    )}
                                                    {thread.category ===
                                                        "challenge" && (
                                                        <Badge variant='destructive'>
                                                            Tantangan
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {thread.postsCount}
                                                </TableCell>
                                                <TableCell>
                                                    <div className='flex items-center gap-1'>
                                                        <Users className='h-3 w-3 text-muted-foreground' />
                                                        <span>
                                                            {
                                                                thread.participantsCount
                                                            }
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {thread.lastActivity}
                                                </TableCell>
                                                <TableCell className='text-right'>
                                                    <Button
                                                        variant='ghost'
                                                        size='sm'
                                                    >
                                                        Lihat Diskusi
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
