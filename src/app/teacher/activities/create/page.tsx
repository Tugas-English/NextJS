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
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

// Schema validasi untuk form aktivitas
const activityFormSchema = z.object({
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
    difficulty: z.number().min(1).max(5),
    estimatedDuration: z.number().min(5).max(180),
    content: z
        .string()
        .min(20, { message: "Konten utama minimal 20 karakter" }),
    instructions: z
        .string()
        .min(20, { message: "Instruksi minimal 20 karakter" }),
    isPublished: z.boolean().default(false),
    tags: z.array(z.string()).optional(),
});

type ActivityFormValues = z.infer<typeof activityFormSchema>;

export default function CreateActivityPage() {
    const [isPublished, setIsPublished] = useState(false);

    const form = useForm<ActivityFormValues>({
        resolver: zodResolver(activityFormSchema),
        defaultValues: {
            title: "",
            description: "",
            difficulty: 1,
            estimatedDuration: 30,
            content: "",
            instructions: "",
            isPublished: false,
            tags: [],
        },
    });

    async function onSubmit(data: ActivityFormValues) {
        try {
            console.log("Form data:", data);
            alert("Aktivitas berhasil dibuat!");
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Terjadi kesalahan saat membuat aktivitas");
        }
    }

    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-bold'>Buat Aktivitas HOTS Baru</h1>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-8'
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Detail Aktivitas</CardTitle>
                            <CardDescription>
                                Lengkapi detail untuk aktivitas HOTS baru Anda
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            <FormField
                                control={form.control}
                                name='title'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Judul</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Masukkan judul aktivitas'
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
                                                defaultValue={field.value}
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
                                                defaultValue={field.value}
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

                            <FormField
                                control={form.control}
                                name='description'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Deskripsi</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder='Masukkan deskripsi aktivitas'
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
                                    name='difficulty'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Tingkat Kesulitan: {field.value}
                                            </FormLabel>
                                            <FormControl>
                                                <Slider
                                                    min={1}
                                                    max={5}
                                                    step={1}
                                                    value={[field.value]}
                                                    onValueChange={(vals) =>
                                                        field.onChange(vals[0])
                                                    }
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                1 (Mudah) hingga 5 (Sangat
                                                Sulit)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='estimatedDuration'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Durasi Estimasi: {field.value}{" "}
                                                menit
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    min={5}
                                                    max={180}
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
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Konten Aktivitas</CardTitle>
                            <CardDescription>
                                Tambahkan konten utama dan instruksi untuk
                                aktivitas
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            <FormField
                                control={form.control}
                                name='content'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Konten Utama</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder='Masukkan konten utama aktivitas'
                                                rows={6}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Teks utama yang akan
                                            dibaca/didengar/dilihat siswa
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='instructions'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Instruksi</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder='Masukkan instruksi langkah demi langkah'
                                                rows={6}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Panduan langkah demi langkah untuk
                                            siswa
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pengaturan Publikasi</CardTitle>
                            <CardDescription>
                                Atur status publikasi aktivitas
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
                                                Aktivitas akan langsung tersedia
                                                untuk siswa
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
                        <Button type='submit'>Buat Aktivitas</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
