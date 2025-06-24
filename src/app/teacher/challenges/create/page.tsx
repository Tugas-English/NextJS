"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Schema validasi untuk form tantangan mingguan
const challengeFormSchema = z.object({
    title: z.string().min(5, { message: "Judul minimal 5 karakter" }),
    description: z
        .string()
        .min(10, { message: "Deskripsi minimal 10 karakter" }),
    skill: z.enum(["reading", "listening", "writing", "speaking"], {
        required_error: "Pilih jenis skill",
    }),
    hotsType: z.enum(
        ["analyze", "evaluate", "create", "problem-solve", "infer"],
        {
            required_error: "Pilih tipe HOTS",
        }
    ),
    activityId: z.string().optional(),
    assignmentId: z.string().optional(),
    startDate: z.date({ required_error: "Pilih tanggal mulai" }),
    endDate: z.date({ required_error: "Pilih tanggal berakhir" }),
    rewardPoints: z.number().min(10).max(1000),
    maxParticipants: z.number().min(1),
    badgeImage: z.string().optional(),
});

type ChallengeFormValues = z.infer<typeof challengeFormSchema>;

// Data dummy untuk aktivitas dan tugas yang tersedia
const availableActivities = [
    {
        id: "1",
        title: "Analisis Artikel Berita",
        skill: "reading",
        hotsType: "analyze",
    },
    {
        id: "2",
        title: "Menulis Esai Argumentatif",
        skill: "writing",
        hotsType: "evaluate",
    },
    {
        id: "3",
        title: "Presentasi Solusi Masalah",
        skill: "speaking",
        hotsType: "problem-solve",
    },
    {
        id: "4",
        title: "Evaluasi Pidato",
        skill: "listening",
        hotsType: "evaluate",
    },
];

const availableAssignments = [
    {
        id: "1",
        title: "Analisis Artikel Berita",
        skill: "reading",
        hotsType: "analyze",
    },
    {
        id: "2",
        title: "Menulis Esai Argumentatif",
        skill: "writing",
        hotsType: "evaluate",
    },
    {
        id: "3",
        title: "Presentasi Solusi Masalah",
        skill: "speaking",
        hotsType: "problem-solve",
    },
];

export default function CreateChallengePage() {
    const [challengeType, setChallengeType] = useState<
        "activity" | "assignment" | "new"
    >("new");

    const form = useForm<ChallengeFormValues>({
        resolver: zodResolver(challengeFormSchema),
        defaultValues: {
            title: "",
            description: "",
            rewardPoints: 100,
            maxParticipants: 30,
        },
    });

    async function onSubmit(data: ChallengeFormValues) {
        try {
            console.log("Form data:", data);
            // Implementasi API call untuk menyimpan tantangan
            // await createChallenge(data);

            // Tampilkan notifikasi sukses
            alert("Tantangan mingguan berhasil dibuat!");
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Terjadi kesalahan saat membuat tantangan");
        }
    }

    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-bold'>Buat Tantangan Mingguan</h1>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-8'
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Jenis Tantangan</CardTitle>
                            <CardDescription>
                                Pilih jenis tantangan yang ingin dibuat
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            <div className='grid grid-cols-3 gap-4'>
                                <div
                                    className={cn(
                                        "border rounded-md p-4 cursor-pointer",
                                        challengeType === "new" &&
                                            "border-primary bg-primary/5"
                                    )}
                                    onClick={() => setChallengeType("new")}
                                >
                                    <h3 className='font-medium'>
                                        Tantangan Baru
                                    </h3>
                                    <p className='text-sm text-muted-foreground mt-1'>
                                        Buat tantangan baru dari awal
                                    </p>
                                </div>
                                <div
                                    className={cn(
                                        "border rounded-md p-4 cursor-pointer",
                                        challengeType === "activity" &&
                                            "border-primary bg-primary/5"
                                    )}
                                    onClick={() => setChallengeType("activity")}
                                >
                                    <h3 className='font-medium'>
                                        Dari Aktivitas
                                    </h3>
                                    <p className='text-sm text-muted-foreground mt-1'>
                                        Gunakan aktivitas yang sudah ada
                                    </p>
                                </div>
                                <div
                                    className={cn(
                                        "border rounded-md p-4 cursor-pointer",
                                        challengeType === "assignment" &&
                                            "border-primary bg-primary/5"
                                    )}
                                    onClick={() =>
                                        setChallengeType("assignment")
                                    }
                                >
                                    <h3 className='font-medium'>Dari Tugas</h3>
                                    <p className='text-sm text-muted-foreground mt-1'>
                                        Gunakan tugas yang sudah ada
                                    </p>
                                </div>
                            </div>

                            {challengeType === "activity" && (
                                <FormField
                                    control={form.control}
                                    name='activityId'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Pilih Aktivitas
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Pilih aktivitas' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {availableActivities.map(
                                                        (activity) => (
                                                            <SelectItem
                                                                key={
                                                                    activity.id
                                                                }
                                                                value={
                                                                    activity.id
                                                                }
                                                            >
                                                                {activity.title}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {challengeType === "assignment" && (
                                <FormField
                                    control={form.control}
                                    name='assignmentId'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Pilih Tugas</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Pilih tugas' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {availableAssignments.map(
                                                        (assignment) => (
                                                            <SelectItem
                                                                key={
                                                                    assignment.id
                                                                }
                                                                value={
                                                                    assignment.id
                                                                }
                                                            >
                                                                {
                                                                    assignment.title
                                                                }
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Detail Tantangan</CardTitle>
                            <CardDescription>
                                Lengkapi detail untuk tantangan mingguan
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            <FormField
                                control={form.control}
                                name='title'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Judul Tantangan</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Masukkan judul tantangan'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='description'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Deskripsi</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder='Masukkan deskripsi tantangan'
                                                rows={4}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className='grid grid-cols-2 gap-4'>
                                <FormField
                                    control={form.control}
                                    name='skill'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Skill</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                disabled={
                                                    challengeType !== "new"
                                                }
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Pilih skill' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value='reading'>
                                                        Reading
                                                    </SelectItem>
                                                    <SelectItem value='listening'>
                                                        Listening
                                                    </SelectItem>
                                                    <SelectItem value='writing'>
                                                        Writing
                                                    </SelectItem>
                                                    <SelectItem value='speaking'>
                                                        Speaking
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='hotsType'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipe HOTS</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                disabled={
                                                    challengeType !== "new"
                                                }
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Pilih tipe HOTS' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value='analyze'>
                                                        Analyze
                                                    </SelectItem>
                                                    <SelectItem value='evaluate'>
                                                        Evaluate
                                                    </SelectItem>
                                                    <SelectItem value='create'>
                                                        Create
                                                    </SelectItem>
                                                    <SelectItem value='problem-solve'>
                                                        Problem Solve
                                                    </SelectItem>
                                                    <SelectItem value='infer'>
                                                        Infer
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pengaturan Tantangan</CardTitle>
                            <CardDescription>
                                Atur periode dan hadiah untuk tantangan
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            <div className='grid grid-cols-2 gap-4'>
                                <FormField
                                    control={form.control}
                                    name='startDate'
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col'>
                                            <FormLabel>Tanggal Mulai</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value &&
                                                                    "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(
                                                                    field.value,
                                                                    "PPP"
                                                                )
                                                            ) : (
                                                                <span>
                                                                    Pilih
                                                                    tanggal
                                                                </span>
                                                            )}
                                                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className='w-auto p-0'
                                                    align='start'
                                                >
                                                    <Calendar
                                                        mode='single'
                                                        selected={field.value}
                                                        onSelect={
                                                            field.onChange
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='endDate'
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col'>
                                            <FormLabel>
                                                Tanggal Berakhir
                                            </FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value &&
                                                                    "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(
                                                                    field.value,
                                                                    "PPP"
                                                                )
                                                            ) : (
                                                                <span>
                                                                    Pilih
                                                                    tanggal
                                                                </span>
                                                            )}
                                                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className='w-auto p-0'
                                                    align='start'
                                                >
                                                    <Calendar
                                                        mode='single'
                                                        selected={field.value}
                                                        onSelect={
                                                            field.onChange
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <FormField
                                    control={form.control}
                                    name='rewardPoints'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Poin Hadiah</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    min={10}
                                                    max={1000}
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            Number(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Poin yang akan diberikan kepada
                                                pemenang
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='maxParticipants'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Jumlah Maksimum Partisipan
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    min={1}
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            Number(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Batas jumlah siswa yang dapat
                                                berpartisipasi
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name='badgeImage'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Badge Tantangan (Opsional)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='file'
                                                accept='image/*'
                                                onChange={(e) => {
                                                    // Handle file upload logic
                                                    if (
                                                        e.target.files &&
                                                        e.target.files[0]
                                                    ) {
                                                        // Dalam implementasi sebenarnya, upload file ke server
                                                        // dan dapatkan URL-nya
                                                        field.onChange(
                                                            "uploaded-badge-url.jpg"
                                                        );
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Unggah gambar badge untuk pemenang
                                            tantangan
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <div className='flex justify-end gap-2'>
                        <Button variant='outline' type='button'>
                            Batal
                        </Button>
                        <Button type='submit'>Buat Tantangan</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
