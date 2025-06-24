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

// Schema validasi untuk form diskusi
const discussionFormSchema = z.object({
    title: z.string().min(5, { message: "Judul minimal 5 karakter" }),
    description: z
        .string()
        .min(10, { message: "Deskripsi minimal 10 karakter" }),
    category: z.enum(["general", "assignment", "module", "challenge"]),
    relatedItemId: z.string().optional(),
    isPinned: z.boolean().default(false),
    isLocked: z.boolean().default(false),
});

type DiscussionFormValues = z.infer<typeof discussionFormSchema>;

// Data dummy untuk demo
const assignments = [
    { id: "1", title: "Analisis Artikel Berita" },
    { id: "2", title: "Menulis Esai Argumentatif" },
    { id: "3", title: "Presentasi Solusi Masalah" },
];

const modules = [
    { id: "1", title: "Modul Berpikir Kritis" },
    { id: "2", title: "Modul Pemecahan Masalah" },
    { id: "3", title: "Modul Komunikasi Efektif" },
];

const challenges = [
    { id: "1", title: "Tulis Surat Opini tentang AI di Masa Depan" },
    { id: "2", title: "Analisis Dampak Perubahan Iklim" },
];

export default function CreateDiscussionPage() {
    const form = useForm<DiscussionFormValues>({
        resolver: zodResolver(discussionFormSchema),
        defaultValues: {
            title: "",
            description: "",
            category: "general",
            isPinned: false,
            isLocked: false,
        },
    });

    const watchCategory = form.watch("category");

    async function onSubmit(data: DiscussionFormValues) {
        try {
            console.log("Form data:", data);
            // Implementasi API call untuk menyimpan diskusi
            // await createDiscussion(data);

            // Tampilkan notifikasi sukses
            alert("Diskusi berhasil dibuat!");
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Terjadi kesalahan saat membuat diskusi");
        }
    }

    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-bold'>Buat Diskusi Baru</h1>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-8'
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Detail Diskusi</CardTitle>
                            <CardDescription>
                                Lengkapi detail untuk diskusi baru
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            <FormField
                                control={form.control}
                                name='title'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Judul Diskusi</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Masukkan judul diskusi'
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
                                                placeholder='Masukkan deskripsi diskusi'
                                                rows={4}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Berikan konteks dan tujuan dari
                                            diskusi ini
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='category'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kategori</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Pilih kategori' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value='general'>
                                                    Umum
                                                </SelectItem>
                                                <SelectItem value='assignment'>
                                                    Tugas
                                                </SelectItem>
                                                <SelectItem value='module'>
                                                    Modul
                                                </SelectItem>
                                                <SelectItem value='challenge'>
                                                    Tantangan
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            Pilih kategori yang sesuai dengan
                                            jenis diskusi
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {watchCategory === "assignment" && (
                                <FormField
                                    control={form.control}
                                    name='relatedItemId'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Pilih Tugas</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Pilih tugas terkait' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {assignments.map(
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

                            {watchCategory === "module" && (
                                <FormField
                                    control={form.control}
                                    name='relatedItemId'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Pilih Modul</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Pilih modul terkait' />
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
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {watchCategory === "challenge" && (
                                <FormField
                                    control={form.control}
                                    name='relatedItemId'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Pilih Tantangan
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Pilih tantangan terkait' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {challenges.map(
                                                        (challenge) => (
                                                            <SelectItem
                                                                key={
                                                                    challenge.id
                                                                }
                                                                value={
                                                                    challenge.id
                                                                }
                                                            >
                                                                {
                                                                    challenge.title
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
                            <CardTitle>Pengaturan Diskusi</CardTitle>
                            <CardDescription>
                                Atur opsi tambahan untuk diskusi
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            <FormField
                                control={form.control}
                                name='isPinned'
                                render={({ field }) => (
                                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                                        <div className='space-y-0.5'>
                                            <FormLabel className='text-base'>
                                                Pin Diskusi
                                            </FormLabel>
                                            <FormDescription>
                                                Diskusi akan selalu muncul di
                                                bagian atas daftar
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

                            <FormField
                                control={form.control}
                                name='isLocked'
                                render={({ field }) => (
                                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                                        <div className='space-y-0.5'>
                                            <FormLabel className='text-base'>
                                                Kunci Diskusi
                                            </FormLabel>
                                            <FormDescription>
                                                Siswa tidak akan dapat
                                                menambahkan postingan baru
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
                        <Button type='submit'>Buat Diskusi</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
