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
import { Switch } from "@/components/ui/switch";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const assignmentFormSchema = z
    .object({
        title: z.string().min(5, { message: "Judul minimal 5 karakter" }),
        activityId: z.string().optional(),
        moduleId: z.string().optional(),
        instructions: z
            .string()
            .min(10, { message: "Instruksi minimal 10 karakter" }),
        rubricId: z.string({ required_error: "Pilih rubrik penilaian" }),
        dueDate: z.date({ required_error: "Pilih tenggat waktu" }),
        assignedTo: z
            .array(z.string())
            .min(1, { message: "Pilih minimal 1 siswa" }),
        allowResubmission: z.boolean().default(true),
        maxResubmissions: z.number().min(0).max(10),
        isChallenge: z.boolean().default(false),
        challengePoints: z.number().min(0).max(1000),
        isPublished: z.boolean().default(false),
    })
    .refine((data) => data.activityId || data.moduleId, {
        message: "Pilih aktivitas atau modul",
        path: ["activityId"],
    });

type AssignmentFormValues = z.infer<typeof assignmentFormSchema>;

export default function CreateAssignmentPage() {
    const form = useForm<AssignmentFormValues>({
        resolver: zodResolver(assignmentFormSchema),
        defaultValues: {
            title: "",
            instructions: "",
            allowResubmission: true,
            maxResubmissions: 3,
            isChallenge: false,
            challengePoints: 0,
            isPublished: false,
            assignedTo: [],
        },
    });

    // Dummy data untuk demo
    const activities = [
        { id: "1", title: "Analisis Teks Berita" },
        { id: "2", title: "Evaluasi Pidato Persuasif" },
        { id: "3", title: "Menulis Esai Argumentatif" },
    ];

    const modules = [
        { id: "1", title: "Modul Berpikir Kritis" },
        { id: "2", title: "Modul Pemecahan Masalah" },
        { id: "3", title: "Modul Komunikasi Efektif" },
    ];

    const rubrics = [
        { id: "1", name: "Rubrik Standar HOTS" },
        { id: "2", name: "Rubrik Menulis Esai" },
        { id: "3", name: "Rubrik Presentasi Lisan" },
    ];

    const students = [
        { id: "1", name: "Andi Pratama" },
        { id: "2", name: "Budi Santoso" },
        { id: "3", name: "Citra Dewi" },
        { id: "4", name: "Deni Kurniawan" },
    ];

    async function onSubmit(data: AssignmentFormValues) {
        try {
            console.log("Form data:", data);
            // Implementasi API call untuk menyimpan tugas
            // await createAssignment(data);

            // Tampilkan notifikasi sukses
            alert("Tugas berhasil dibuat!");
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Terjadi kesalahan saat membuat tugas");
        }
    }

    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-bold'>Buat Tugas Baru</h1>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-8'
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Detail Tugas</CardTitle>
                            <CardDescription>
                                Lengkapi detail untuk tugas baru Anda
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            <FormField
                                control={form.control}
                                name='title'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Judul Tugas</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Masukkan judul tugas'
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
                                    name='activityId'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Aktivitas</FormLabel>
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
                                                    {activities.map(
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
                                            <FormDescription>
                                                Pilih aktivitas atau modul
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='moduleId'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Modul</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Pilih modul' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {modules.map((module) => (
                                                        <SelectItem
                                                            key={module.id}
                                                            value={module.id}
                                                        >
                                                            {module.title}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Pilih aktivitas atau modul
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name='instructions'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Instruksi Tugas</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder='Masukkan instruksi tugas'
                                                rows={4}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='rubricId'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rubrik Penilaian</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Pilih rubrik' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {rubrics.map((rubric) => (
                                                    <SelectItem
                                                        key={rubric.id}
                                                        value={rubric.id}
                                                    >
                                                        {rubric.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='dueDate'
                                render={({ field }) => (
                                    <FormItem className='flex flex-col'>
                                        <FormLabel>Tenggat Waktu</FormLabel>
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
                                                                Pilih tanggal
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
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pengaturan Pengumpulan</CardTitle>
                            <CardDescription>
                                Atur opsi pengumpulan tugas
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            <FormField
                                control={form.control}
                                name='allowResubmission'
                                render={({ field }) => (
                                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                                        <div className='space-y-0.5'>
                                            <FormLabel className='text-base'>
                                                Izinkan Pengumpulan Ulang
                                            </FormLabel>
                                            <FormDescription>
                                                Siswa dapat mengumpulkan ulang
                                                tugas setelah mendapat feedback
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {form.watch("allowResubmission") && (
                                <FormField
                                    control={form.control}
                                    name='maxResubmissions'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Jumlah Maksimum Pengumpulan
                                                Ulang
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    min={1}
                                                    max={10}
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
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <FormField
                                control={form.control}
                                name='isChallenge'
                                render={({ field }) => (
                                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                                        <div className='space-y-0.5'>
                                            <FormLabel className='text-base'>
                                                Jadikan Tantangan Mingguan
                                            </FormLabel>
                                            <FormDescription>
                                                Tugas akan muncul di bagian
                                                Weekly HOTS Challenge
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {form.watch("isChallenge") && (
                                <FormField
                                    control={form.control}
                                    name='challengePoints'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Poin Tantangan
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    min={0}
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
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Penugasan Siswa</CardTitle>
                            <CardDescription>
                                Pilih siswa yang akan menerima tugas ini
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-4'>
                                {students.map((student) => (
                                    <div
                                        key={student.id}
                                        className='flex items-center space-x-2'
                                    >
                                        <input
                                            type='checkbox'
                                            id={`student-${student.id}`}
                                            value={student.id}
                                            onChange={(e) => {
                                                const currentValues =
                                                    form.getValues(
                                                        "assignedTo"
                                                    ) || [];
                                                if (e.target.checked) {
                                                    form.setValue(
                                                        "assignedTo",
                                                        [
                                                            ...currentValues,
                                                            student.id,
                                                        ]
                                                    );
                                                } else {
                                                    form.setValue(
                                                        "assignedTo",
                                                        currentValues.filter(
                                                            (id) =>
                                                                id !==
                                                                student.id
                                                        )
                                                    );
                                                }
                                            }}
                                            className='h-4 w-4 rounded border-gray-300'
                                        />
                                        <label
                                            htmlFor={`student-${student.id}`}
                                        >
                                            {student.name}
                                        </label>
                                    </div>
                                ))}
                                {form.formState.errors.assignedTo && (
                                    <p className='text-sm text-red-500'>
                                        {
                                            form.formState.errors.assignedTo
                                                .message
                                        }
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Publikasi</CardTitle>
                            <CardDescription>
                                Atur status publikasi tugas
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name='isPublished'
                                render={({ field }) => (
                                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                                        <div className='space-y-0.5'>
                                            <FormLabel className='text-base'>
                                                Publikasikan Sekarang
                                            </FormLabel>
                                            <FormDescription>
                                                Tugas akan langsung tersedia
                                                untuk siswa yang dipilih
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <div className='flex justify-end gap-2'>
                        <Button variant='outline' type='button'>
                            Batal
                        </Button>
                        <Button type='submit'>Buat Tugas</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
