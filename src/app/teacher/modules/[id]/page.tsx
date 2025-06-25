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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Activity,
    BookMarked,
    Edit,
    FileText,
    GripVertical,
    MoreHorizontal,
    Plus,
    Trash2,
    Users,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import Link from "next/link";

// Data dummy untuk demo
const moduleData = {
    id: "1",
    title: "Modul Berpikir Kritis",
    description:
        "Pengenalan konsep berpikir kritis dan analisis. Modul ini dirancang untuk mengembangkan kemampuan siswa dalam menganalisis informasi, mengevaluasi argumen, dan membuat kesimpulan yang logis.",
    skill: "reading",
    hotsType: "analyze",
    difficulty: 3,
    coverImage: "/images/module-cover.jpg",
    isPublished: true,
    createdBy: {
        id: "1",
        name: "Ms. Johnson",
    },
    createdAt: "2024-06-05",
    updatedAt: "2024-06-10",
};

const moduleActivities = [
    {
        id: "1",
        activityId: "1",
        title: "Pengenalan Berpikir Kritis",
        skill: "reading",
        hotsType: "analyze",
        difficulty: 2,
        estimatedDuration: 30,
        order: 1,
        isRequired: true,
    },
    {
        id: "2",
        activityId: "2",
        title: "Identifikasi Argumen dalam Teks",
        skill: "reading",
        hotsType: "analyze",
        difficulty: 3,
        estimatedDuration: 45,
        order: 2,
        isRequired: true,
    },
    {
        id: "3",
        activityId: "3",
        title: "Evaluasi Kredibilitas Sumber",
        skill: "reading",
        hotsType: "evaluate",
        difficulty: 3,
        estimatedDuration: 40,
        order: 3,
        isRequired: true,
    },
    {
        id: "4",
        activityId: "4",
        title: "Menulis Esai Analitis",
        skill: "writing",
        hotsType: "create",
        difficulty: 4,
        estimatedDuration: 60,
        order: 4,
        isRequired: false,
    },
    {
        id: "5",
        activityId: "5",
        title: "Diskusi Kelompok: Studi Kasus",
        skill: "speaking",
        hotsType: "problem-solve",
        difficulty: 4,
        estimatedDuration: 50,
        order: 5,
        isRequired: false,
    },
];

const studentProgress = [
    {
        id: "1",
        name: "Andi Pratama",
        progress: 100,
        completedActivities: 5,
        totalActivities: 5,
        averageScore: 92,
    },
    {
        id: "2",
        name: "Budi Santoso",
        progress: 80,
        completedActivities: 4,
        totalActivities: 5,
        averageScore: 85,
    },
    {
        id: "3",
        name: "Citra Dewi",
        progress: 100,
        completedActivities: 5,
        totalActivities: 5,
        averageScore: 90,
    },
    {
        id: "4",
        name: "Deni Kurniawan",
        progress: 60,
        completedActivities: 3,
        totalActivities: 5,
        averageScore: 78,
    },
    {
        id: "5",
        name: "Eka Putri",
        progress: 40,
        completedActivities: 2,
        totalActivities: 5,
        averageScore: 82,
    },
];

// Data dummy untuk aktivitas yang tersedia
const availableActivities = [
    {
        id: "6",
        title: "Analisis Artikel Berita",
        skill: "reading",
        hotsType: "analyze",
        difficulty: 3,
        estimatedDuration: 40,
    },
    {
        id: "7",
        title: "Menulis Esai Argumentatif",
        skill: "writing",
        hotsType: "evaluate",
        difficulty: 4,
        estimatedDuration: 60,
    },
    {
        id: "8",
        title: "Presentasi Solusi Masalah",
        skill: "speaking",
        hotsType: "problem-solve",
        difficulty: 4,
        estimatedDuration: 45,
    },
];

const skillLabels: Record<string, string> = {
    reading: "Reading",
    listening: "Listening",
    writing: "Writing",
    speaking: "Speaking",
};

const hotsLabels: Record<string, string> = {
    analyze: "Analyze",
    evaluate: "Evaluate",
    create: "Create",
    "problem-solve": "Problem Solve",
    infer: "Infer",
};

export default function ModuleDetailPage() {
    const [editMode, setEditMode] = useState(false);
    const [moduleTitle, setModuleTitle] = useState(moduleData.title);
    const [moduleDescription, setModuleDescription] = useState(
        moduleData.description
    );
    const [isPublished, setIsPublished] = useState(moduleData.isPublished);
    const [activities, setActivities] = useState([...moduleActivities]);

    const handleSaveChanges = () => {
        // Implementasi API call untuk menyimpan perubahan
        // await updateModule({ ...moduleData, title: moduleTitle, description: moduleDescription, isPublished });
        // await updateModuleActivities(activities);

        console.log("Saving changes:", {
            title: moduleTitle,
            description: moduleDescription,
            isPublished,
            activities,
        });

        setEditMode(false);
        alert("Perubahan berhasil disimpan!");
    };

    const handleAddActivity = (activity: any) => {
        const newActivity = {
            id: `new-${Date.now()}`,
            activityId: activity.id,
            title: activity.title,
            skill: activity.skill,
            hotsType: activity.hotsType,
            difficulty: activity.difficulty,
            estimatedDuration: activity.estimatedDuration,
            order: activities.length + 1,
            isRequired: true,
        };

        setActivities([...activities, newActivity]);
    };

    const handleRemoveActivity = (id: string) => {
        const updatedActivities = activities.filter(
            (activity) => activity.id !== id
        );
        // Reorder remaining activities
        const reorderedActivities = updatedActivities.map(
            (activity, index) => ({
                ...activity,
                order: index + 1,
            })
        );

        setActivities(reorderedActivities);
    };

    const handleMoveActivity = (id: string, direction: "up" | "down") => {
        const activityIndex = activities.findIndex(
            (activity) => activity.id === id
        );
        if (activityIndex === -1) return;

        const newActivities = [...activities];

        if (direction === "up" && activityIndex > 0) {
            // Swap with previous item
            [newActivities[activityIndex], newActivities[activityIndex - 1]] = [
                newActivities[activityIndex - 1],
                newActivities[activityIndex],
            ];
        } else if (
            direction === "down" &&
            activityIndex < activities.length - 1
        ) {
            // Swap with next item
            [newActivities[activityIndex], newActivities[activityIndex + 1]] = [
                newActivities[activityIndex + 1],
                newActivities[activityIndex],
            ];
        }

        // Update order values
        const reorderedActivities = newActivities.map((activity, index) => ({
            ...activity,
            order: index + 1,
        }));

        setActivities(reorderedActivities);
    };

    const toggleRequired = (id: string) => {
        const updatedActivities = activities.map((activity) => {
            if (activity.id === id) {
                return { ...activity, isRequired: !activity.isRequired };
            }
            return activity;
        });

        setActivities(updatedActivities);
    };

    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                    <BookMarked className='h-6 w-6' />
                    {editMode ? (
                        <input
                            type='text'
                            value={moduleTitle}
                            onChange={(e) => setModuleTitle(e.target.value)}
                            className='text-3xl font-bold border-b border-gray-300 focus:outline-none focus:border-primary'
                        />
                    ) : (
                        <h1 className='text-3xl font-bold'>{moduleTitle}</h1>
                    )}
                </div>
                <div className='flex gap-2'>
                    {editMode ? (
                        <>
                            <Button
                                variant='outline'
                                onClick={() => setEditMode(false)}
                            >
                                Batal
                            </Button>
                            <Button onClick={handleSaveChanges}>
                                Simpan Perubahan
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant='outline'
                                onClick={() => setEditMode(true)}
                            >
                                <Edit className='h-4 w-4 mr-2' />
                                <span>Edit Modul</span>
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant='outline'>
                                        <MoreHorizontal className='h-4 w-4' />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                    <DropdownMenuItem>
                                        Duplikat Modul
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Ekspor Modul
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Buat Tugas dari Modul
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className='text-destructive'>
                                        Hapus Modul
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    )}
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='md:col-span-2'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Detail Modul</CardTitle>
                            <div className='flex items-center justify-between'>
                                <CardDescription>
                                    Dibuat pada {moduleData.createdAt}
                                </CardDescription>
                                {editMode ? (
                                    <div className='flex items-center gap-2'>
                                        <span className='text-sm'>Status:</span>
                                        <div className='flex items-center gap-2'>
                                            <Switch
                                                checked={isPublished}
                                                onCheckedChange={setIsPublished}
                                            />
                                            <span className='text-sm'>
                                                {isPublished
                                                    ? "Dipublikasi"
                                                    : "Draft"}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <Badge>
                                        {isPublished ? "Dipublikasi" : "Draft"}
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div>
                                <div className='font-medium mb-1'>
                                    Deskripsi
                                </div>
                                {editMode ? (
                                    <textarea
                                        value={moduleDescription}
                                        onChange={(e) =>
                                            setModuleDescription(e.target.value)
                                        }
                                        className='w-full h-32 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                                    />
                                ) : (
                                    <p className='text-sm'>
                                        {moduleDescription}
                                    </p>
                                )}
                            </div>

                            <div className='grid grid-cols-3 gap-4'>
                                <div>
                                    <div className='text-sm font-medium'>
                                        Skill
                                    </div>
                                    <Badge variant='outline'>
                                        {skillLabels[moduleData.skill]}
                                    </Badge>
                                </div>
                                <div>
                                    <div className='text-sm font-medium'>
                                        HOTS Type
                                    </div>
                                    <Badge variant='secondary'>
                                        {hotsLabels[moduleData.hotsType]}
                                    </Badge>
                                </div>
                                <div>
                                    <div className='text-sm font-medium'>
                                        Kesulitan
                                    </div>
                                    <div className='flex'>
                                        {Array.from({ length: 5 }).map(
                                            (_, i) => (
                                                <span
                                                    key={i}
                                                    className={`size-2 rounded-full mx-0.5 ${
                                                        i <
                                                        moduleData.difficulty
                                                            ? "bg-primary"
                                                            : "bg-muted"
                                                    }`}
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className='md:col-span-1'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Statistik Modul</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='grid grid-cols-2 gap-4'>
                                <div className='flex flex-col items-center p-3 border rounded-md'>
                                    <span className='text-2xl font-bold'>
                                        {activities.length}
                                    </span>
                                    <span className='text-xs text-muted-foreground'>
                                        Aktivitas
                                    </span>
                                </div>
                                <div className='flex flex-col items-center p-3 border rounded-md'>
                                    <span className='text-2xl font-bold'>
                                        {
                                            activities.filter(
                                                (a) => a.isRequired
                                            ).length
                                        }
                                    </span>
                                    <span className='text-xs text-muted-foreground'>
                                        Aktivitas Wajib
                                    </span>
                                </div>
                                <div className='flex flex-col items-center p-3 border rounded-md'>
                                    <span className='text-2xl font-bold'>
                                        {studentProgress.length}
                                    </span>
                                    <span className='text-xs text-muted-foreground'>
                                        Siswa
                                    </span>
                                </div>
                                <div className='flex flex-col items-center p-3 border rounded-md'>
                                    <span className='text-2xl font-bold'>
                                        {Math.round(
                                            studentProgress.reduce(
                                                (acc, student) =>
                                                    acc + student.averageScore,
                                                0
                                            ) / studentProgress.length
                                        )}
                                    </span>
                                    <span className='text-xs text-muted-foreground'>
                                        Nilai Rata-rata
                                    </span>
                                </div>
                            </div>

                            <div>
                                <div className='text-sm font-medium mb-1'>
                                    Total Durasi Estimasi
                                </div>
                                <div className='text-lg font-bold'>
                                    {activities.reduce(
                                        (acc, activity) =>
                                            acc + activity.estimatedDuration,
                                        0
                                    )}{" "}
                                    menit
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Tabs defaultValue='activities'>
                <TabsList className='grid w-full grid-cols-2'>
                    <TabsTrigger
                        value='activities'
                        className='flex items-center gap-2'
                    >
                        <Activity className='h-4 w-4' />
                        <span>Aktivitas</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value='students'
                        className='flex items-center gap-2'
                    >
                        <Users className='h-4 w-4' />
                        <span>Siswa</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value='activities' className='mt-6'>
                    <Card>
                        <CardHeader>
                            <div className='flex items-center justify-between'>
                                <CardTitle>Aktivitas dalam Modul</CardTitle>
                                {editMode && (
                                    <Button variant='outline'>
                                        <Plus className='h-4 w-4 mr-2' />
                                        <span>Tambah Aktivitas</span>
                                    </Button>
                                )}
                            </div>
                            <CardDescription>
                                Urutan aktivitas dalam modul ini
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {editMode && (
                                            <TableHead className='w-[50px]'></TableHead>
                                        )}
                                        <TableHead>Urutan</TableHead>
                                        <TableHead>Judul Aktivitas</TableHead>
                                        <TableHead>Skill</TableHead>
                                        <TableHead>HOTS Type</TableHead>
                                        <TableHead>Kesulitan</TableHead>
                                        <TableHead>Durasi</TableHead>
                                        <TableHead>Wajib</TableHead>
                                        {editMode && (
                                            <TableHead className='text-right'>
                                                Aksi
                                            </TableHead>
                                        )}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {activities.map((activity) => (
                                        <TableRow key={activity.id}>
                                            {editMode && (
                                                <TableCell>
                                                    <GripVertical className='h-4 w-4 text-muted-foreground cursor-grab' />
                                                </TableCell>
                                            )}
                                            <TableCell>
                                                {activity.order}
                                            </TableCell>
                                            <TableCell className='font-medium'>
                                                <div className='flex items-center gap-2'>
                                                    <Activity className='h-4 w-4 text-muted-foreground' />
                                                    {activity.title}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant='outline'>
                                                    {
                                                        skillLabels[
                                                            activity.skill
                                                        ]
                                                    }
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant='secondary'>
                                                    {
                                                        hotsLabels[
                                                            activity.hotsType
                                                        ]
                                                    }
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className='flex'>
                                                    {Array.from({
                                                        length: 5,
                                                    }).map((_, i) => (
                                                        <span
                                                            key={i}
                                                            className={`size-2 rounded-full mx-0.5 ${
                                                                i <
                                                                activity.difficulty
                                                                    ? "bg-primary"
                                                                    : "bg-muted"
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {activity.estimatedDuration}{" "}
                                                menit
                                            </TableCell>
                                            <TableCell>
                                                {editMode ? (
                                                    <Switch
                                                        checked={
                                                            activity.isRequired
                                                        }
                                                        onCheckedChange={() =>
                                                            toggleRequired(
                                                                activity.id
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <Badge
                                                        variant={
                                                            activity.isRequired
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                    >
                                                        {activity.isRequired
                                                            ? "Ya"
                                                            : "Tidak"}
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            {editMode && (
                                                <TableCell className='text-right'>
                                                    <div className='flex justify-end gap-2'>
                                                        <Button
                                                            variant='ghost'
                                                            size='sm'
                                                            onClick={() =>
                                                                handleMoveActivity(
                                                                    activity.id,
                                                                    "up"
                                                                )
                                                            }
                                                            disabled={
                                                                activity.order ===
                                                                1
                                                            }
                                                        >
                                                            ↑
                                                        </Button>
                                                        <Button
                                                            variant='ghost'
                                                            size='sm'
                                                            onClick={() =>
                                                                handleMoveActivity(
                                                                    activity.id,
                                                                    "down"
                                                                )
                                                            }
                                                            disabled={
                                                                activity.order ===
                                                                activities.length
                                                            }
                                                        >
                                                            ↓
                                                        </Button>
                                                        <Button
                                                            variant='ghost'
                                                            size='sm'
                                                            onClick={() =>
                                                                handleRemoveActivity(
                                                                    activity.id
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className='h-4 w-4 text-destructive' />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {editMode && (
                        <Card className='mt-6'>
                            <CardHeader>
                                <CardTitle>Tambahkan Aktivitas</CardTitle>
                                <CardDescription>
                                    Pilih aktivitas yang ingin ditambahkan ke
                                    modul
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                    {availableActivities.map((activity) => (
                                        <div
                                            key={activity.id}
                                            className='border rounded-md p-3 flex items-center justify-between'
                                        >
                                            <div>
                                                <p className='font-medium'>
                                                    {activity.title}
                                                </p>
                                                <div className='flex items-center gap-2 mt-1'>
                                                    <Badge
                                                        variant='outline'
                                                        className='text-xs'
                                                    >
                                                        {
                                                            skillLabels[
                                                                activity.skill
                                                            ]
                                                        }
                                                    </Badge>
                                                    <Badge
                                                        variant='secondary'
                                                        className='text-xs'
                                                    >
                                                        {
                                                            hotsLabels[
                                                                activity
                                                                    .hotsType
                                                            ]
                                                        }
                                                    </Badge>
                                                    <span className='text-xs text-muted-foreground'>
                                                        {
                                                            activity.estimatedDuration
                                                        }{" "}
                                                        menit
                                                    </span>
                                                </div>
                                            </div>
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                onClick={() =>
                                                    handleAddActivity(activity)
                                                }
                                                disabled={activities.some(
                                                    (a) =>
                                                        a.activityId ===
                                                        activity.id
                                                )}
                                            >
                                                <Plus className='h-4 w-4' />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Link
                                    href='/teacher/activities/create'
                                    className='w-full'
                                >
                                    <Button
                                        variant='outline'
                                        className='w-full'
                                    >
                                        <Plus className='h-4 w-4 mr-2' />
                                        <span>Buat Aktivitas Baru</span>
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value='students' className='mt-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Kemajuan Siswa</CardTitle>
                            <CardDescription>
                                Progres siswa dalam menyelesaikan modul ini
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama Siswa</TableHead>
                                        <TableHead>Progres</TableHead>
                                        <TableHead>Aktivitas Selesai</TableHead>
                                        <TableHead>Nilai Rata-rata</TableHead>
                                        <TableHead className='text-right'>
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {studentProgress.map((student) => (
                                        <TableRow key={student.id}>
                                            <TableCell className='font-medium'>
                                                {student.name}
                                            </TableCell>
                                            <TableCell>
                                                <div className='flex items-center gap-2'>
                                                    <div className='w-32 h-2 bg-muted rounded-full overflow-hidden'>
                                                        <div
                                                            className='h-full bg-primary'
                                                            style={{
                                                                width: `${student.progress}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span className='text-sm'>
                                                        {student.progress}%
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {student.completedActivities}/
                                                {student.totalActivities}
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
                                            <TableCell className='text-right'>
                                                <Link
                                                    href={`/teacher/students/${student.id}`}
                                                >
                                                    <Button
                                                        variant='ghost'
                                                        size='sm'
                                                    >
                                                        Lihat Detail
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className='flex justify-between'>
                <Button variant='outline' asChild>
                    <Link href='/teacher/modules'>Kembali ke Daftar Modul</Link>
                </Button>
                <Button asChild>
                    <Link
                        href={`/teacher/assignments/create?moduleId=${moduleData.id}`}
                    >
                        <FileText className='h-4 w-4 mr-2' />
                        <span>Buat Tugas dari Modul</span>
                    </Link>
                </Button>
            </div>
        </div>
    );
}
