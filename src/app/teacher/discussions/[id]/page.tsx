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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertTriangle,
    ArrowLeft,
    Calendar,
    Heart,
    Lock,
    MessageSquare,
    MoreHorizontal,
    Pin,
    Reply,
    ThumbsUp,
    Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Data dummy untuk demo
const discussionThread = {
    id: "1",
    title: "Dampak AI pada Masa Depan Pendidikan",
    description:
        "Diskusi tentang bagaimana AI akan mengubah cara kita belajar dan mengajar",
    category: "general",
    author: {
        id: "1",
        name: "Ms. Johnson",
        avatar: "/avatars/teacher.jpg",
        role: "teacher",
    },
    createdAt: "2024-07-01 10:30",
    postsCount: 24,
    participantsCount: 15,
    isPinned: true,
    isLocked: false,
};

const discussionPosts = [
    {
        id: "1",
        content:
            "Selamat datang di diskusi tentang dampak AI pada masa depan pendidikan. Dalam thread ini, kita akan membahas bagaimana teknologi AI dapat mengubah cara kita belajar dan mengajar. Mari berbagi pendapat dan wawasan Anda tentang topik ini.",
        author: {
            id: "1",
            name: "Ms. Johnson",
            avatar: "/avatars/teacher.jpg",
            role: "teacher",
        },
        timestamp: "2024-07-01 10:30",
        likesCount: 12,
        isEdited: false,
        replies: [],
    },
    {
        id: "2",
        content:
            "Menurut saya, AI dapat sangat membantu dalam personalisasi pembelajaran. Dengan kemampuan untuk menganalisis data tentang gaya belajar dan kemajuan siswa, AI dapat menyesuaikan materi pembelajaran agar lebih efektif untuk setiap individu.",
        author: {
            id: "2",
            name: "Budi Santoso",
            avatar: "/avatars/student-2.jpg",
            role: "student",
        },
        timestamp: "2024-07-01 11:15",
        likesCount: 8,
        isEdited: false,
        replies: [
            {
                id: "3",
                content:
                    "Saya setuju dengan Budi. Personalisasi adalah salah satu keunggulan utama AI dalam pendidikan. Namun, kita juga perlu mempertimbangkan keterbatasan AI dalam memahami konteks sosial dan emosional dalam pembelajaran.",
                author: {
                    id: "3",
                    name: "Citra Dewi",
                    avatar: "/avatars/student-3.jpg",
                    role: "student",
                },
                timestamp: "2024-07-01 11:45",
                likesCount: 5,
                isEdited: false,
            },
            {
                id: "4",
                content:
                    "Pertimbangan yang bagus, Citra. AI memang masih memiliki keterbatasan dalam aspek sosial-emosional. Bagaimana menurut kalian tentang peran guru dalam era AI? Apakah peran guru akan berubah atau bahkan berkurang?",
                author: {
                    id: "1",
                    name: "Ms. Johnson",
                    avatar: "/avatars/teacher.jpg",
                    role: "teacher",
                },
                timestamp: "2024-07-01 12:30",
                likesCount: 7,
                isEdited: false,
            },
        ],
    },
    {
        id: "5",
        content:
            "Saya khawatir AI akan mengurangi interaksi manusia dalam pendidikan. Meskipun personalisasi itu baik, pembelajaran juga melibatkan keterampilan sosial dan kolaborasi yang mungkin sulit dikembangkan melalui interaksi dengan AI.",
        author: {
            id: "4",
            name: "Deni Kurniawan",
            avatar: "/avatars/student-4.jpg",
            role: "student",
        },
        timestamp: "2024-07-02 09:20",
        likesCount: 6,
        isEdited: false,
        replies: [],
    },
    {
        id: "6",
        content:
            "AI dapat membantu guru untuk fokus pada aspek pembelajaran yang lebih kompleks. Tugas-tugas rutin seperti penilaian objektif dan pemberian umpan balik dasar dapat diambil alih oleh AI, sehingga guru memiliki lebih banyak waktu untuk interaksi yang bermakna dengan siswa.",
        author: {
            id: "1",
            name: "Andi Pratama",
            avatar: "/avatars/student-1.jpg",
            role: "student",
        },
        timestamp: "2024-07-02 14:45",
        likesCount: 10,
        isEdited: true,
        replies: [],
    },
];

const participants = [
    {
        id: "1",
        name: "Ms. Johnson",
        avatar: "/avatars/teacher.jpg",
        role: "teacher",
        postsCount: 2,
    },
    {
        id: "2",
        name: "Budi Santoso",
        avatar: "/avatars/student-2.jpg",
        role: "student",
        postsCount: 1,
    },
    {
        id: "3",
        name: "Citra Dewi",
        avatar: "/avatars/student-3.jpg",
        role: "student",
        postsCount: 1,
    },
    {
        id: "4",
        name: "Deni Kurniawan",
        avatar: "/avatars/student-4.jpg",
        role: "student",
        postsCount: 1,
    },
    {
        id: "5",
        name: "Andi Pratama",
        avatar: "/avatars/student-1.jpg",
        role: "student",
        postsCount: 1,
    },
];

export default function DiscussionDetailPage() {
    const [replyContent, setReplyContent] = useState("");
    const [replyingTo, setReplyingTo] = useState<string | null>(null);

    const handleReply = (postId: string | null) => {
        setReplyingTo(postId);
        if (postId === null) {
            setReplyContent("");
        }
    };

    const submitReply = () => {
        if (replyContent.trim() === "") return;

        console.log("Submitting reply:", {
            content: replyContent,
            parentId: replyingTo,
        });

        // Reset form
        setReplyContent("");
        setReplyingTo(null);

        // In a real app, you would submit the reply to the server
        // and update the UI with the new post
    };

    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-2'>
                <Link href='/teacher/discussions'>
                    <Button
                        variant='ghost'
                        size='sm'
                        className='flex items-center gap-1'
                    >
                        <ArrowLeft className='h-4 w-4' />
                        <span>Kembali</span>
                    </Button>
                </Link>
            </div>

            <div className='flex justify-between items-start'>
                <div>
                    <h1 className='text-3xl font-bold'>
                        {discussionThread.title}
                    </h1>
                    <div className='flex items-center gap-2 mt-2'>
                        <Badge variant='outline'>Umum</Badge>
                        {discussionThread.isPinned && (
                            <Badge
                                variant='secondary'
                                className='flex items-center gap-1'
                            >
                                <Pin className='h-3 w-3' />
                                <span>Pinned</span>
                            </Badge>
                        )}
                        {discussionThread.isLocked && (
                            <Badge
                                variant='destructive'
                                className='flex items-center gap-1'
                            >
                                <Lock className='h-3 w-3' />
                                <span>Locked</span>
                            </Badge>
                        )}
                    </div>
                </div>
                <div className='flex gap-2'>
                    <Button
                        variant='outline'
                        className='flex items-center gap-2'
                    >
                        {discussionThread.isPinned ? (
                            <>
                                <Pin className='h-4 w-4' />
                                <span>Lepas Pin</span>
                            </>
                        ) : (
                            <>
                                <Pin className='h-4 w-4' />
                                <span>Pin Diskusi</span>
                            </>
                        )}
                    </Button>
                    <Button
                        variant='outline'
                        className='flex items-center gap-2'
                    >
                        {discussionThread.isLocked ? (
                            <>
                                <Lock className='h-4 w-4' />
                                <span>Buka Kunci</span>
                            </>
                        ) : (
                            <>
                                <Lock className='h-4 w-4' />
                                <span>Kunci Diskusi</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                            <Avatar className='h-10 w-10'>
                                <AvatarImage
                                    src={discussionThread.author.avatar}
                                    alt={discussionThread.author.name}
                                />
                                <AvatarFallback>MJ</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className='font-medium'>
                                    {discussionThread.author.name}
                                </div>
                                <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                                    <Calendar className='h-3 w-3' />
                                    <span>{discussionThread.createdAt}</span>
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center gap-4'>
                            <div className='flex items-center gap-2'>
                                <MessageSquare className='h-4 w-4 text-muted-foreground' />
                                <span>
                                    {discussionThread.postsCount} postingan
                                </span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <Users className='h-4 w-4 text-muted-foreground' />
                                <span>
                                    {discussionThread.participantsCount}{" "}
                                    partisipan
                                </span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p>{discussionThread.description}</p>
                </CardContent>
            </Card>

            <Tabs defaultValue='discussion'>
                <TabsList className='grid w-full grid-cols-2'>
                    <TabsTrigger value='discussion'>Diskusi</TabsTrigger>
                    <TabsTrigger value='participants'>Partisipan</TabsTrigger>
                </TabsList>

                <TabsContent value='discussion' className='mt-6'>
                    <div className='space-y-6'>
                        {discussionPosts.map((post) => (
                            <div key={post.id} className='space-y-4'>
                                <Card>
                                    <CardHeader className='pb-2'>
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center gap-3'>
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
                                                    <div className='font-medium flex items-center gap-2'>
                                                        {post.author.name}
                                                        {post.author.role ===
                                                            "teacher" && (
                                                            <Badge
                                                                variant='secondary'
                                                                className='text-xs'
                                                            >
                                                                Guru
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className='text-xs text-muted-foreground'>
                                                        {post.timestamp}
                                                        {post.isEdited && (
                                                            <span className='ml-2'>
                                                                (diedit)
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
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
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        Pin Postingan
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className='text-destructive'>
                                                        Hapus
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className='whitespace-pre-wrap'>
                                            {post.content}
                                        </p>
                                    </CardContent>
                                    <CardFooter className='flex justify-between border-t pt-4'>
                                        <div className='flex items-center gap-4'>
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                className='flex items-center gap-1'
                                            >
                                                <ThumbsUp className='h-4 w-4' />
                                                <span>{post.likesCount}</span>
                                            </Button>
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                className='flex items-center gap-1'
                                                onClick={() =>
                                                    handleReply(post.id)
                                                }
                                            >
                                                <Reply className='h-4 w-4' />
                                                <span>Balas</span>
                                            </Button>
                                        </div>
                                        <Button variant='ghost' size='sm'>
                                            Laporkan
                                        </Button>
                                    </CardFooter>
                                </Card>

                                {/* Reply form */}
                                {replyingTo === post.id && (
                                    <Card className='ml-8 border-l-4'>
                                        <CardHeader>
                                            <CardTitle className='text-sm'>
                                                Balas ke {post.author.name}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <Textarea
                                                placeholder='Tulis balasan Anda...'
                                                value={replyContent}
                                                onChange={(e) =>
                                                    setReplyContent(
                                                        e.target.value
                                                    )
                                                }
                                                rows={4}
                                            />
                                        </CardContent>
                                        <CardFooter className='flex justify-end gap-2'>
                                            <Button
                                                variant='outline'
                                                onClick={() =>
                                                    handleReply(null)
                                                }
                                            >
                                                Batal
                                            </Button>
                                            <Button onClick={submitReply}>
                                                Kirim Balasan
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                )}

                                {/* Replies */}
                                {post.replies && post.replies.length > 0 && (
                                    <div className='ml-8 space-y-4'>
                                        {post.replies.map((reply) => (
                                            <Card
                                                key={reply.id}
                                                className='border-l-4'
                                            >
                                                <CardHeader className='pb-2'>
                                                    <div className='flex items-center justify-between'>
                                                        <div className='flex items-center gap-3'>
                                                            <Avatar className='h-8 w-8'>
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
                                                                <div className='font-medium flex items-center gap-2'>
                                                                    {
                                                                        reply
                                                                            .author
                                                                            .name
                                                                    }
                                                                    {reply
                                                                        .author
                                                                        .role ===
                                                                        "teacher" && (
                                                                        <Badge
                                                                            variant='secondary'
                                                                            className='text-xs'
                                                                        >
                                                                            Guru
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <div className='text-xs text-muted-foreground'>
                                                                    {
                                                                        reply.timestamp
                                                                    }
                                                                    {reply.isEdited && (
                                                                        <span className='ml-2'>
                                                                            (diedit)
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
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
                                                                <DropdownMenuItem className='text-destructive'>
                                                                    Hapus
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className='whitespace-pre-wrap'>
                                                        {reply.content}
                                                    </p>
                                                </CardContent>
                                                <CardFooter className='flex justify-between border-t pt-4'>
                                                    <div className='flex items-center gap-4'>
                                                        <Button
                                                            variant='ghost'
                                                            size='sm'
                                                            className='flex items-center gap-1'
                                                        >
                                                            <ThumbsUp className='h-4 w-4' />
                                                            <span>
                                                                {
                                                                    reply.likesCount
                                                                }
                                                            </span>
                                                        </Button>
                                                        <Button
                                                            variant='ghost'
                                                            size='sm'
                                                            className='flex items-center gap-1'
                                                            onClick={() =>
                                                                handleReply(
                                                                    post.id
                                                                )
                                                            }
                                                        >
                                                            <Reply className='h-4 w-4' />
                                                            <span>Balas</span>
                                                        </Button>
                                                    </div>
                                                    <Button
                                                        variant='ghost'
                                                        size='sm'
                                                    >
                                                        Laporkan
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Main reply form */}
                        {!discussionThread.isLocked && replyingTo === null && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tambahkan Komentar</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        placeholder='Tulis komentar Anda...'
                                        value={replyContent}
                                        onChange={(e) =>
                                            setReplyContent(e.target.value)
                                        }
                                        rows={4}
                                    />
                                </CardContent>
                                <CardFooter className='flex justify-end'>
                                    <Button onClick={submitReply}>
                                        Kirim Komentar
                                    </Button>
                                </CardFooter>
                            </Card>
                        )}

                        {discussionThread.isLocked && (
                            <Card className='border-destructive'>
                                <CardContent className='flex items-center gap-2 py-4'>
                                    <AlertTriangle className='h-5 w-5 text-destructive' />
                                    <p className='text-sm'>
                                        Diskusi ini telah dikunci. Tidak dapat
                                        menambahkan komentar baru.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value='participants' className='mt-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Partisipan Diskusi</CardTitle>
                            <CardDescription>
                                {participants.length} partisipan dalam diskusi
                                ini
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-4'>
                                {participants.map((participant) => (
                                    <div
                                        key={participant.id}
                                        className='flex items-center justify-between border-b pb-3'
                                    >
                                        <div className='flex items-center gap-3'>
                                            <Avatar className='h-10 w-10'>
                                                <AvatarImage
                                                    src={participant.avatar}
                                                    alt={participant.name}
                                                />
                                                <AvatarFallback>
                                                    {participant.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className='font-medium flex items-center gap-2'>
                                                    {participant.name}
                                                    {participant.role ===
                                                        "teacher" && (
                                                        <Badge
                                                            variant='secondary'
                                                            className='text-xs'
                                                        >
                                                            Guru
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className='text-xs text-muted-foreground'>
                                                    {participant.postsCount}{" "}
                                                    postingan
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant='ghost' size='sm'>
                                            Lihat Profil
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
