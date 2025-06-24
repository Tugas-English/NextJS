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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, FileText } from "lucide-react";

// Data dummy untuk demo
const submission = {
    id: "1",
    assignmentId: "1",
    assignmentTitle: "Analisis Artikel Berita",
    student: {
        id: "1",
        name: "Andi Pratama",
        avatar: "/avatars/student-1.jpg",
    },
    submittedAt: "2024-07-03 14:30",
    version: 1,
    textResponse: `Analisis Artikel "Dampak Perubahan Iklim di Indonesia"

Artikel ini membahas dampak perubahan iklim yang terjadi di Indonesia dalam beberapa tahun terakhir. Penulis mengemukakan beberapa fakta penting seperti kenaikan suhu rata-rata, perubahan pola cuaca, dan meningkatnya frekuensi bencana alam seperti banjir dan kekeringan.

Dalam analisis saya, artikel ini berhasil menyajikan data-data yang relevan dan terkini. Penulis menggunakan sumber yang kredibel seperti laporan BMKG dan penelitian dari lembaga internasional. Argumentasi yang dibangun cukup kuat dengan menghubungkan antara data ilmiah dengan fenomena yang dapat diamati secara langsung.

Namun, artikel ini memiliki beberapa kelemahan. Pertama, penulis terlalu berfokus pada masalah tanpa memberikan solusi yang memadai. Kedua, artikel ini kurang mengeksplorasi perspektif ekonomi dari perubahan iklim, seperti dampaknya terhadap sektor pertanian dan pariwisata yang merupakan penopang ekonomi di banyak daerah di Indonesia.

Kesimpulannya, artikel ini memberikan gambaran yang baik tentang dampak perubahan iklim di Indonesia, namun akan lebih komprehensif jika dilengkapi dengan analisis solusi dan dampak ekonomi yang lebih mendalam.`,
    documentUrls: ["document1.pdf", "document2.pdf"],
    checklist: [
        { id: "1", text: "Identifikasi sumber artikel", completed: true },
        { id: "2", text: "Analisis argumen utama", completed: true },
        { id: "3", text: "Evaluasi kredibilitas sumber", completed: true },
        { id: "4", text: "Identifikasi bias dalam artikel", completed: false },
        {
            id: "5",
            text: "Berikan kesimpulan dan rekomendasi",
            completed: true,
        },
    ],
};

const rubric = {
    id: "1",
    name: "Rubrik Analisis Artikel",
    maxScore: 100,
    criteria: [
        {
            id: "1",
            name: "HOTS Integration & Variety",
            description:
                "Sejauh mana siswa menerapkan berbagai keterampilan berpikir tingkat tinggi",
            weight: 40,
            levels: [
                {
                    value: "4",
                    description: "Integrasi HOTS sangat baik",
                    score: 40,
                },
                { value: "3", description: "Integrasi HOTS baik", score: 30 },
                { value: "2", description: "Integrasi HOTS cukup", score: 20 },
                { value: "1", description: "Integrasi HOTS kurang", score: 10 },
            ],
        },
        {
            id: "2",
            name: "Clarity & Scaffolding",
            description: "Kejelasan dan struktur dalam menyampaikan pemikiran",
            weight: 35,
            levels: [
                {
                    value: "4",
                    description: "Sangat jelas dan terstruktur",
                    score: 35,
                },
                { value: "3", description: "Jelas dan terstruktur", score: 26 },
                { value: "2", description: "Cukup jelas", score: 17 },
                { value: "1", description: "Kurang jelas", score: 8 },
            ],
        },
        {
            id: "3",
            name: "Content Quality",
            description: "Kualitas konten dan kedalaman pemikiran",
            weight: 25,
            levels: [
                { value: "4", description: "Kualitas sangat baik", score: 25 },
                { value: "3", description: "Kualitas baik", score: 19 },
                { value: "2", description: "Kualitas cukup", score: 13 },
                { value: "1", description: "Kualitas kurang", score: 6 },
            ],
        },
    ],
};

// Schema validasi untuk form evaluasi
const evaluationFormSchema = z.object({
    scores: z.record(z.number()),
    criteriaFeedback: z.record(z.string().optional()),
    generalFeedback: z
        .string()
        .min(10, { message: "Feedback umum minimal 10 karakter" }),
    allowResubmission: z.boolean().optional(),
});

type EvaluationFormValues = z.infer<typeof evaluationFormSchema>;

export default function EvaluateSubmissionPage() {
    const form = useForm<EvaluationFormValues>({
        resolver: zodResolver(evaluationFormSchema),
        defaultValues: {
            scores: rubric.criteria.reduce((acc, criterion) => {
                acc[criterion.id] = criterion.levels[1].score; // Default ke level 3 (baik)
                return acc;
            }, {} as Record<string, number>),
            criteriaFeedback: {},
            generalFeedback: "",
            allowResubmission: false,
        },
    });

    // Hitung total skor berdasarkan nilai yang dipilih
    const calculateTotalScore = () => {
        const scores = form.getValues("scores");
        return Object.values(scores).reduce((total, score) => total + score, 0);
    };

    async function onSubmit(data: EvaluationFormValues) {
        try {
            console.log("Form data:", data);
            // Implementasi API call untuk menyimpan evaluasi
            // await submitEvaluation(submission.id, data);

            // Tampilkan notifikasi sukses
            alert("Evaluasi berhasil disimpan!");
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Terjadi kesalahan saat menyimpan evaluasi");
        }
    }

    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-bold'>Evaluasi Pengumpulan</h1>
                <div className='flex items-center gap-2'>
                    <span className='text-sm text-muted-foreground'>
                        Total Skor:
                    </span>
                    <Badge className='text-lg'>
                        {calculateTotalScore()}/{rubric.maxScore}
                    </Badge>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='md:col-span-1 space-y-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Detail Pengumpulan</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='flex items-center gap-3'>
                                <Avatar className='h-10 w-10'>
                                    <AvatarImage
                                        src={submission.student.avatar}
                                        alt={submission.student.name}
                                    />
                                    <AvatarFallback>AP</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className='font-medium'>
                                        {submission.student.name}
                                    </div>
                                    <div className='text-xs text-muted-foreground'>
                                        Dikumpulkan: {submission.submittedAt}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className='text-sm font-medium'>
                                    Tugas:
                                </div>
                                <div className='flex items-center gap-2'>
                                    <FileText className='h-4 w-4 text-muted-foreground' />
                                    <span>{submission.assignmentTitle}</span>
                                </div>
                            </div>

                            <div>
                                <div className='text-sm font-medium'>
                                    Versi:
                                </div>
                                <Badge variant='outline'>
                                    {submission.version}
                                </Badge>
                            </div>

                            <div>
                                <div className='text-sm font-medium'>
                                    Checklist Pengerjaan:
                                </div>
                                <ul className='mt-1 space-y-1'>
                                    {submission.checklist.map((item) => (
                                        <li
                                            key={item.id}
                                            className='flex items-center gap-2 text-sm'
                                        >
                                            {item.completed ? (
                                                <CheckCircle className='h-4 w-4 text-green-500' />
                                            ) : (
                                                <div className='h-4 w-4 rounded-full border border-muted' />
                                            )}
                                            <span
                                                className={
                                                    item.completed
                                                        ? ""
                                                        : "text-muted-foreground"
                                                }
                                            >
                                                {item.text}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {submission.documentUrls &&
                                submission.documentUrls.length > 0 && (
                                    <div>
                                        <div className='text-sm font-medium'>
                                            Dokumen:
                                        </div>
                                        <ul className='mt-1 space-y-1'>
                                            {submission.documentUrls.map(
                                                (doc, index) => (
                                                    <li
                                                        key={index}
                                                        className='flex items-center gap-2 text-sm'
                                                    >
                                                        <FileText className='h-4 w-4 text-muted-foreground' />
                                                        <a
                                                            href='#'
                                                            className='text-blue-600 hover:underline'
                                                        >
                                                            {doc}
                                                        </a>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Rubrik Penilaian</CardTitle>
                            <CardDescription>{rubric.name}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-4'>
                                {rubric.criteria.map((criterion) => (
                                    <div
                                        key={criterion.id}
                                        className='border-b pb-3'
                                    >
                                        <div className='font-medium'>
                                            {criterion.name}
                                        </div>
                                        <div className='text-sm text-muted-foreground mt-1'>
                                            {criterion.description}
                                        </div>
                                        <div className='text-sm mt-1'>
                                            <span className='font-medium'>
                                                Bobot:
                                            </span>{" "}
                                            {criterion.weight}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className='md:col-span-2 space-y-6'>
                    <Tabs defaultValue='submission'>
                        <TabsList className='grid w-full grid-cols-2'>
                            <TabsTrigger value='submission'>
                                Pengumpulan
                            </TabsTrigger>
                            <TabsTrigger value='evaluation'>
                                Evaluasi
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value='submission' className='mt-4'>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Jawaban Siswa</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className='whitespace-pre-wrap border rounded-md p-4 bg-muted/20'>
                                        {submission.textResponse}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value='evaluation' className='mt-4'>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className='space-y-6'
                                >
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                Penilaian Kriteria
                                            </CardTitle>
                                            <CardDescription>
                                                Berikan nilai untuk setiap
                                                kriteria
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className='space-y-6'>
                                            {rubric.criteria.map(
                                                (criterion) => (
                                                    <div
                                                        key={criterion.id}
                                                        className='space-y-4'
                                                    >
                                                        <div className='flex justify-between items-center'>
                                                            <div className='font-medium'>
                                                                {criterion.name}
                                                            </div>
                                                            <div className='text-sm'>
                                                                Skor:{" "}
                                                                {form.watch(
                                                                    `scores.${criterion.id}`
                                                                )}{" "}
                                                                /{" "}
                                                                {
                                                                    criterion
                                                                        .levels[0]
                                                                        .score
                                                                }
                                                            </div>
                                                        </div>

                                                        <FormField
                                                            control={
                                                                form.control
                                                            }
                                                            name={`scores.${criterion.id}`}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Slider
                                                                            min={
                                                                                criterion
                                                                                    .levels[
                                                                                    criterion
                                                                                        .levels
                                                                                        .length -
                                                                                        1
                                                                                ]
                                                                                    .score
                                                                            }
                                                                            max={
                                                                                criterion
                                                                                    .levels[0]
                                                                                    .score
                                                                            }
                                                                            step={
                                                                                1
                                                                            }
                                                                            value={[
                                                                                field.value,
                                                                            ]}
                                                                            onValueChange={(
                                                                                vals
                                                                            ) =>
                                                                                field.onChange(
                                                                                    vals[0]
                                                                                )
                                                                            }
                                                                        />
                                                                    </FormControl>
                                                                    <div className='flex justify-between text-xs text-muted-foreground mt-1'>
                                                                        {criterion.levels.map(
                                                                            (
                                                                                level
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        level.value
                                                                                    }
                                                                                    className='text-center'
                                                                                >
                                                                                    <div>
                                                                                        {
                                                                                            level.value
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={
                                                                form.control
                                                            }
                                                            name={`criteriaFeedback.${criterion.id}`}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormItem>
                                                                    <FormLabel>
                                                                        Feedback
                                                                        untuk{" "}
                                                                        {
                                                                            criterion.name
                                                                        }
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Textarea
                                                                            placeholder={`Berikan feedback untuk kriteria ${criterion.name}`}
                                                                            rows={
                                                                                3
                                                                            }
                                                                            {...field}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <div className='border-t pt-2'>
                                                            <div className='text-sm font-medium'>
                                                                Level Deskripsi:
                                                            </div>
                                                            <div className='grid grid-cols-2 gap-2 mt-2'>
                                                                {criterion.levels.map(
                                                                    (level) => (
                                                                        <div
                                                                            key={
                                                                                level.value
                                                                            }
                                                                            className='border rounded-md p-2'
                                                                        >
                                                                            <div className='font-medium'>
                                                                                Level{" "}
                                                                                {
                                                                                    level.value
                                                                                }
                                                                            </div>
                                                                            <div className='text-xs text-muted-foreground mt-1'>
                                                                                {
                                                                                    level.description
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Feedback Umum</CardTitle>
                                            <CardDescription>
                                                Berikan feedback umum untuk
                                                pengumpulan ini
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <FormField
                                                control={form.control}
                                                name='generalFeedback'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder='Berikan feedback umum untuk siswa'
                                                                rows={5}
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                Opsi Pengumpulan Ulang
                                            </CardTitle>
                                            <CardDescription>
                                                Tentukan apakah siswa dapat
                                                mengumpulkan ulang
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className='flex items-center gap-2'>
                                                <input
                                                    type='checkbox'
                                                    id='allowResubmission'
                                                    checked={form.watch(
                                                        "allowResubmission"
                                                    )}
                                                    onChange={(e) =>
                                                        form.setValue(
                                                            "allowResubmission",
                                                            e.target.checked
                                                        )
                                                    }
                                                    className='h-4 w-4 rounded border-gray-300'
                                                />
                                                <label htmlFor='allowResubmission'>
                                                    Izinkan siswa untuk
                                                    mengumpulkan ulang tugas ini
                                                </label>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <div className='flex justify-end gap-2'>
                                        <Button variant='outline' type='button'>
                                            Batal
                                        </Button>
                                        <Button type='submit'>
                                            Simpan Evaluasi
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
