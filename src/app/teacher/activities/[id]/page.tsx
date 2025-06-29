import { getActivityById } from "@/lib/actions/activities";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft,
    Calendar,
    Edit,
    Eye,
    FileText,
    Headphones,
    Link2,
    ListChecks,
    Video,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/format";

type ActivityDetailProps = {
    params: Promise<{ id: string }>;
};

export interface ScaffoldingStep {
    step: number;
    title: string;
    description: string;
}

export interface Activity {
    id: string;
    title: string;
    description: string | null;
    skill: string;
    hotsType: string;
    difficulty: number;
    estimatedDuration: number | null;
    content: string | null;
    instructions: string | null;
    scaffoldingSteps: ScaffoldingStep[] | null;
    audioUrl: string | null;
    videoUrl: string | null;
    attachmentUrls: string[] | null;
    isPublished: boolean | null;
    tags: string[] | null;
    createdBy: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export default async function DetailActivitiesPage({
    params,
}: ActivityDetailProps) {
    const { id } = await params;
    const activity = (await getActivityById(id)) as Activity;
    console.log(activity);

    if (!activity) {
        notFound();
    }

    const scaffoldingSteps = activity.scaffoldingSteps || [];
    const tags = activity.tags || [];

    return (
        <div className='space-y-6 p-6'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Button variant='outline' size='icon' asChild>
                        <Link href='/teacher/activities'>
                            <ArrowLeft className='h-4 w-4' />
                        </Link>
                    </Button>
                    <h1 className='text-3xl font-bold'>{activity.title}</h1>
                </div>
                <div className='flex items-center gap-2'>
                    <Button variant='outline' asChild>
                        <Link href={`/teacher/activities/${activity.id}/edit`}>
                            <Edit className='mr-2 h-4 w-4' />
                            Edit
                        </Link>
                    </Button>
                    <Button variant='default' asChild>
                        <Link href={`/student/activities/${activity.id}`}>
                            <Eye className='mr-2 h-4 w-4' />
                            Lihat sebagai Siswa
                        </Link>
                    </Button>
                </div>
            </div>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                <div className='md:col-span-2 space-y-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Deskripsi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='whitespace-pre-wrap'>
                                {activity.description}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Konten</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='prose max-w-none dark:prose-invert'>
                                <p className='whitespace-pre-wrap'>
                                    {activity.content}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Instruksi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='prose max-w-none dark:prose-invert'>
                                <p className='whitespace-pre-wrap'>
                                    {activity.instructions}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {activity.scaffoldingSteps &&
                        activity.scaffoldingSteps.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Langkah-langkah Scaffolding
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className='space-y-4'>
                                        {scaffoldingSteps.map((step, index) => (
                                            <div
                                                key={index}
                                                className='border rounded-lg p-4'
                                            >
                                                <h3 className='font-medium'>
                                                    Langkah {step.step}:{" "}
                                                    {step.title}
                                                </h3>
                                                <p className='mt-2 text-sm text-muted-foreground'>
                                                    {step.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                    {(activity.audioUrl ||
                        activity.videoUrl ||
                        (activity.attachmentUrls &&
                            activity.attachmentUrls.length > 0)) && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Media dan Lampiran</CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                {activity.audioUrl && (
                                    <div>
                                        <div className='flex items-center gap-2 mb-2'>
                                            <Headphones className='h-4 w-4' />
                                            <h3 className='font-medium'>
                                                Audio
                                            </h3>
                                        </div>
                                        <audio controls className='w-full'>
                                            <source src={activity.audioUrl} />
                                            Browser Anda tidak mendukung
                                            pemutaran audio.
                                        </audio>
                                    </div>
                                )}

                                {activity.videoUrl && (
                                    <div>
                                        <div className='flex items-center gap-2 mb-2'>
                                            <Video className='h-4 w-4' />
                                            <h3 className='font-medium'>
                                                Video
                                            </h3>
                                        </div>
                                        <div className='aspect-video overflow-hidden rounded-lg'>
                                            <iframe
                                                className='w-full h-full'
                                                src={activity.videoUrl}
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    </div>
                                )}

                                {activity.attachmentUrls &&
                                    activity.attachmentUrls.length > 0 && (
                                        <div>
                                            <div className='flex items-center gap-2 mb-2'>
                                                <FileText className='h-4 w-4' />
                                                <h3 className='font-medium'>
                                                    Lampiran
                                                </h3>
                                            </div>
                                            <div className='space-y-2'>
                                                {activity.attachmentUrls.map(
                                                    (
                                                        url: string,
                                                        index: number
                                                    ) => (
                                                        <div
                                                            key={index}
                                                            className='flex items-center justify-between rounded-lg border p-3'
                                                        >
                                                            <div className='flex items-center gap-2 overflow-hidden'>
                                                                <FileText className='h-4 w-4 shrink-0' />
                                                                <span className='truncate'>
                                                                    {url
                                                                        .split(
                                                                            "/"
                                                                        )
                                                                        .pop()}
                                                                </span>
                                                            </div>
                                                            <Button
                                                                variant='ghost'
                                                                size='sm'
                                                                asChild
                                                            >
                                                                <a
                                                                    href={url}
                                                                    target='_blank'
                                                                    rel='noopener noreferrer'
                                                                >
                                                                    <Link2 className='h-4 w-4' />
                                                                </a>
                                                            </Button>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className='space-y-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div>
                                <h3 className='text-sm font-medium text-muted-foreground'>
                                    Status
                                </h3>
                                <Badge
                                    variant={
                                        activity.isPublished
                                            ? "default"
                                            : "outline"
                                    }
                                    className='mt-1'
                                >
                                    {activity.isPublished
                                        ? "Dipublikasikan"
                                        : "Draft"}
                                </Badge>
                            </div>

                            <div>
                                <h3 className='text-sm font-medium text-muted-foreground'>
                                    Skill
                                </h3>
                                <Badge
                                    variant='outline'
                                    className='mt-1 capitalize'
                                >
                                    {activity.skill}
                                </Badge>
                            </div>

                            <div>
                                <h3 className='text-sm font-medium text-muted-foreground'>
                                    Tipe HOTS
                                </h3>
                                <Badge
                                    variant='secondary'
                                    className='mt-1 capitalize'
                                >
                                    {activity.hotsType}
                                </Badge>
                            </div>

                            <div>
                                <h3 className='text-sm font-medium text-muted-foreground'>
                                    Tingkat Kesulitan
                                </h3>
                                <Badge
                                    variant={
                                        activity.difficulty <= 2
                                            ? "outline"
                                            : activity.difficulty <= 4
                                            ? "secondary"
                                            : "destructive"
                                    }
                                    className='mt-1'
                                >
                                    Level {activity.difficulty}
                                </Badge>
                            </div>

                            <div>
                                <h3 className='text-sm font-medium text-muted-foreground'>
                                    Durasi Estimasi
                                </h3>
                                <p className='mt-1'>
                                    {activity.estimatedDuration} menit
                                </p>
                            </div>

                            <Separator />

                            <div>
                                <h3 className='text-sm font-medium text-muted-foreground'>
                                    Dibuat pada
                                </h3>
                                <div className='mt-1 flex items-center gap-1'>
                                    <Calendar className='h-3.5 w-3.5 text-muted-foreground' />
                                    <span>
                                        {formatDate(activity.createdAt ?? "")}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h3 className='text-sm font-medium text-muted-foreground'>
                                    Terakhir diperbarui
                                </h3>
                                <div className='mt-1 flex items-center gap-1'>
                                    <Calendar className='h-3.5 w-3.5 text-muted-foreground' />
                                    <span>
                                        {formatDate(activity.updatedAt ?? "")}
                                    </span>
                                </div>
                            </div>

                            {tags.length > 0 && (
                                <div>
                                    <h3 className='text-sm font-medium text-muted-foreground'>
                                        Tags
                                    </h3>
                                    <div className='mt-1 flex flex-wrap gap-1'>
                                        {tags.map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant='outline'
                                                className='text-xs'
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Langkah Selanjutnya</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <Button className='w-full' asChild>
                                <Link
                                    href={`/teacher/assignments/create?activityId=${activity.id}`}
                                >
                                    <ListChecks className='mr-2 h-4 w-4' />
                                    Buat Tugas
                                </Link>
                            </Button>

                            <Button
                                variant='outline'
                                className='w-full'
                                asChild
                            >
                                <Link
                                    href={`/teacher/modules?activityId=${activity.id}`}
                                >
                                    <FileText className='mr-2 h-4 w-4' />
                                    Tambahkan ke Modul
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
