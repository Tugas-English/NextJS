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
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    BookOpen,
    FileText,
    HelpCircle,
    LifeBuoy,
    Mail,
    MessageSquare,
    Play,
    Search,
    Video,
} from "lucide-react";
import { useState } from "react";

// Data dummy untuk FAQ
const faqItems = [
    {
        question: "Bagaimana cara membuat aktivitas HOTS baru?",
        answer: "Untuk membuat aktivitas HOTS baru, klik menu 'Aktivitas HOTS' di sidebar, lalu klik tombol 'Buat Aktivitas'. Isi form dengan informasi aktivitas yang diperlukan seperti judul, deskripsi, jenis skill, dan tipe HOTS. Anda juga dapat menambahkan konten utama, instruksi, dan file pendukung. Setelah selesai, klik tombol 'Buat Aktivitas' untuk menyimpan.",
        category: "aktivitas",
    },
    {
        question: "Bagaimana cara menilai tugas siswa menggunakan rubrik?",
        answer: "Untuk menilai tugas siswa, klik menu 'Tugas' di sidebar, pilih tugas yang ingin dinilai, lalu klik tab 'Pengumpulan'. Klik pada pengumpulan siswa yang ingin dinilai, lalu pilih tab 'Evaluasi'. Gunakan slider untuk memberikan nilai pada setiap kriteria rubrik, berikan feedback per kriteria dan feedback umum, lalu klik tombol 'Simpan Evaluasi'.",
        category: "tugas",
    },
    {
        question: "Bagaimana cara membuat tantangan mingguan?",
        answer: "Untuk membuat tantangan mingguan, klik menu 'Tantangan Mingguan' di sidebar, lalu klik tombol 'Buat Tantangan'. Anda dapat membuat tantangan baru dari awal atau berdasarkan aktivitas/tugas yang sudah ada. Isi form dengan informasi tantangan seperti judul, deskripsi, periode, dan poin hadiah. Setelah selesai, klik tombol 'Buat Tantangan' untuk menyimpan.",
        category: "tantangan",
    },
    {
        question: "Bagaimana cara mengekspor laporan nilai siswa?",
        answer: "Untuk mengekspor laporan nilai siswa, klik menu 'Laporan & Ekspor' di sidebar. Pilih jenis laporan yang ingin diekspor (misalnya 'Kemajuan Siswa'), terapkan filter yang diinginkan, pilih format ekspor (PDF, Excel, atau CSV), lalu klik tombol 'Ekspor'. File laporan akan diunduh ke perangkat Anda.",
        category: "laporan",
    },
    {
        question: "Bagaimana cara mengedit rubrik penilaian?",
        answer: "Untuk mengedit rubrik penilaian, klik menu 'Rubrik Penilaian' di sidebar, lalu cari rubrik yang ingin diedit. Klik tombol 'Edit' pada rubrik tersebut. Anda dapat mengubah nama rubrik, deskripsi, kriteria penilaian, bobot, dan level penilaian. Setelah selesai, klik tombol 'Simpan Rubrik' untuk menyimpan perubahan.",
        category: "rubrik",
    },
    {
        question: "Bagaimana cara membuat modul pembelajaran?",
        answer: "Untuk membuat modul pembelajaran, klik menu 'Modul Pembelajaran' di sidebar, lalu klik tombol 'Buat Modul'. Isi form dengan informasi modul seperti judul, deskripsi, skill, dan tingkat kesulitan. Tambahkan aktivitas ke dalam modul dengan mengklik tombol 'Tambah' pada aktivitas yang tersedia. Atur urutan aktivitas dan tentukan apakah aktivitas tersebut wajib atau opsional. Setelah selesai, klik tombol 'Simpan Modul' untuk menyimpan.",
        category: "modul",
    },
    {
        question: "Bagaimana cara melihat kemajuan siswa?",
        answer: "Untuk melihat kemajuan siswa, klik menu 'Siswa' di sidebar, lalu pilih siswa yang ingin dilihat kemajuannya. Pada halaman detail siswa, Anda dapat melihat informasi tentang nilai rata-rata, aktivitas yang telah diselesaikan, dan analisis HOTS. Anda juga dapat melihat tugas yang telah dikerjakan, badge yang diperoleh, dan partisipasi dalam diskusi.",
        category: "siswa",
    },
    {
        question: "Bagaimana cara membuat forum diskusi baru?",
        answer: "Untuk membuat forum diskusi baru, klik menu 'Forum Diskusi' di sidebar, lalu klik tombol 'Buat Diskusi Baru'. Isi form dengan informasi diskusi seperti judul, deskripsi, dan kategori. Jika diskusi terkait dengan tugas, modul, atau tantangan tertentu, pilih item yang sesuai. Anda juga dapat mengatur opsi tambahan seperti pin diskusi atau kunci diskusi. Setelah selesai, klik tombol 'Buat Diskusi' untuk menyimpan.",
        category: "diskusi",
    },
];

// Data dummy untuk panduan video
const videoGuides = [
    {
        id: "1",
        title: "Pengenalan Platform HOTS English",
        thumbnail: "/videos/intro-thumbnail.jpg",
        duration: "5:30",
        category: "pengenalan",
        url: "https://example.com/videos/intro",
    },
    {
        id: "2",
        title: "Cara Membuat Aktivitas HOTS",
        thumbnail: "/videos/activity-thumbnail.jpg",
        duration: "8:45",
        category: "aktivitas",
        url: "https://example.com/videos/activity",
    },
    {
        id: "3",
        title: "Menggunakan Rubrik Penilaian",
        thumbnail: "/videos/rubric-thumbnail.jpg",
        duration: "7:20",
        category: "rubrik",
        url: "https://example.com/videos/rubric",
    },
    {
        id: "4",
        title: "Mengelola Tugas dan Penilaian",
        thumbnail: "/videos/assignment-thumbnail.jpg",
        duration: "10:15",
        category: "tugas",
        url: "https://example.com/videos/assignment",
    },
    {
        id: "5",
        title: "Membuat Tantangan Mingguan",
        thumbnail: "/videos/challenge-thumbnail.jpg",
        duration: "6:50",
        category: "tantangan",
        url: "https://example.com/videos/challenge",
    },
    {
        id: "6",
        title: "Menganalisis Kemajuan Siswa",
        thumbnail: "/videos/progress-thumbnail.jpg",
        duration: "9:30",
        category: "laporan",
        url: "https://example.com/videos/progress",
    },
];

// Data dummy untuk dokumentasi
const documentationItems = [
    {
        id: "1",
        title: "Panduan Pengguna untuk Guru",
        description:
            "Panduan lengkap tentang penggunaan platform HOTS English untuk guru",
        url: "/docs/teacher-guide.pdf",
        icon: BookOpen,
    },
    {
        id: "2",
        title: "Panduan Membuat Aktivitas HOTS",
        description:
            "Langkah-langkah dan praktik terbaik untuk membuat aktivitas HOTS yang efektif",
        url: "/docs/hots-activity-guide.pdf",
        icon: FileText,
    },
    {
        id: "3",
        title: "Panduan Rubrik Penilaian",
        description:
            "Cara membuat dan menggunakan rubrik penilaian untuk evaluasi HOTS",
        url: "/docs/rubric-guide.pdf",
        icon: FileText,
    },
    {
        id: "4",
        title: "Panduan Fitur Laporan & Ekspor",
        description:
            "Cara menggunakan fitur laporan dan ekspor data untuk analisis",
        url: "/docs/report-guide.pdf",
        icon: FileText,
    },
    {
        id: "5",
        title: "Koleksi Template Aktivitas",
        description:
            "Berbagai template untuk membantu membuat aktivitas HOTS dengan cepat",
        url: "/docs/activity-templates.pdf",
        icon: FileText,
    },
];

export default function SupportPage() {
    const [searchQuery, setSearchQuery] = useState("");

    // Filter FAQ berdasarkan pencarian
    const filteredFaq = faqItems.filter(
        (item) =>
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter video berdasarkan pencarian
    const filteredVideos = videoGuides.filter(
        (video) =>
            video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            video.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter dokumentasi berdasarkan pencarian
    const filteredDocs = documentationItems.filter(
        (doc) =>
            doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-bold'>Pusat Bantuan</h1>
            </div>

            <div className='relative'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                    type='search'
                    placeholder='Cari bantuan...'
                    className='w-full pl-8'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <Tabs defaultValue='faq'>
                <TabsList className='grid w-full grid-cols-3'>
                    <TabsTrigger
                        value='faq'
                        className='flex items-center gap-2'
                    >
                        <HelpCircle className='h-4 w-4' />
                        <span>FAQ</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value='videos'
                        className='flex items-center gap-2'
                    >
                        <Video className='h-4 w-4' />
                        <span>Video Panduan</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value='documentation'
                        className='flex items-center gap-2'
                    >
                        <BookOpen className='h-4 w-4' />
                        <span>Dokumentasi</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value='faq' className='mt-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Pertanyaan yang Sering Diajukan
                            </CardTitle>
                            <CardDescription>
                                Jawaban untuk pertanyaan umum tentang platform
                                HOTS English
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Accordion
                                type='single'
                                collapsible
                                className='w-full'
                            >
                                {filteredFaq.length > 0 ? (
                                    filteredFaq.map((item, index) => (
                                        <AccordionItem
                                            key={index}
                                            value={`item-${index}`}
                                        >
                                            <AccordionTrigger className='text-left'>
                                                <div className='flex items-center gap-2'>
                                                    <span>{item.question}</span>
                                                    <Badge variant='outline'>
                                                        {item.category}
                                                    </Badge>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <p className='text-muted-foreground'>
                                                    {item.answer}
                                                </p>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))
                                ) : (
                                    <p className='text-center py-4 text-muted-foreground'>
                                        Tidak ada hasil yang ditemukan untuk
                                        &quot;
                                        {searchQuery}&quot;
                                    </p>
                                )}
                            </Accordion>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='videos' className='mt-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Video Panduan</CardTitle>
                            <CardDescription>
                                Pelajari cara menggunakan platform melalui video
                                tutorial
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                {filteredVideos.length > 0 ? (
                                    filteredVideos.map((video) => (
                                        <div
                                            key={video.id}
                                            className='border rounded-md overflow-hidden'
                                        >
                                            <div className='relative aspect-video bg-muted'>
                                                <div className='absolute inset-0 flex items-center justify-center'>
                                                    <Play className='h-12 w-12 text-primary/50' />
                                                </div>
                                                <Badge className='absolute top-2 right-2'>
                                                    {video.duration}
                                                </Badge>
                                            </div>
                                            <div className='p-3'>
                                                <h3 className='font-medium'>
                                                    {video.title}
                                                </h3>
                                                <div className='flex items-center justify-between mt-2'>
                                                    <Badge variant='outline'>
                                                        {video.category}
                                                    </Badge>
                                                    <Button
                                                        variant='ghost'
                                                        size='sm'
                                                    >
                                                        Tonton
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className='col-span-3 text-center py-8 text-muted-foreground'>
                                        Tidak ada video yang ditemukan untuk
                                        &quot;
                                        {searchQuery}&quot;
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='documentation' className='mt-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Dokumentasi</CardTitle>
                            <CardDescription>
                                Panduan lengkap dan referensi untuk platform
                                HOTS English
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                {filteredDocs.length > 0 ? (
                                    filteredDocs.map((doc) => {
                                        const DocIcon = doc.icon;
                                        return (
                                            <div
                                                key={doc.id}
                                                className='flex border rounded-md p-4'
                                            >
                                                <div className='mr-4 rounded-md bg-primary/10 p-2'>
                                                    <DocIcon className='h-6 w-6 text-primary' />
                                                </div>
                                                <div className='flex-1'>
                                                    <h3 className='font-medium'>
                                                        {doc.title}
                                                    </h3>
                                                    <p className='text-sm text-muted-foreground mt-1'>
                                                        {doc.description}
                                                    </p>
                                                    <Button
                                                        variant='link'
                                                        className='px-0 mt-2'
                                                    >
                                                        Unduh PDF
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className='col-span-2 text-center py-8 text-muted-foreground'>
                                        Tidak ada dokumentasi yang ditemukan
                                        untuk &quot;{searchQuery}&quot;
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Card>
                <CardHeader>
                    <CardTitle>Butuh Bantuan Lebih Lanjut?</CardTitle>
                    <CardDescription>
                        Hubungi tim dukungan kami jika Anda memiliki pertanyaan
                        atau masalah lain
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='flex border rounded-md p-4'>
                            <div className='mr-4 rounded-md bg-primary/10 p-2'>
                                <Mail className='h-6 w-6 text-primary' />
                            </div>
                            <div>
                                <h3 className='font-medium'>Email Support</h3>
                                <p className='text-sm text-muted-foreground mt-1'>
                                    Kirim pertanyaan atau masalah Anda ke alamat
                                    email kami
                                </p>
                                <p className='font-medium mt-2'>
                                    support@hotsenglish.com
                                </p>
                            </div>
                        </div>

                        <div className='flex border rounded-md p-4'>
                            <div className='mr-4 rounded-md bg-primary/10 p-2'>
                                <MessageSquare className='h-6 w-6 text-primary' />
                            </div>
                            <div>
                                <h3 className='font-medium'>Live Chat</h3>
                                <p className='text-sm text-muted-foreground mt-1'>
                                    Diskusikan masalah Anda secara langsung
                                    dengan tim dukungan kami
                                </p>
                                <Button className='mt-2'>Mulai Chat</Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className='flex justify-center border-t pt-6'>
                    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <LifeBuoy className='h-4 w-4' />
                        <span>
                            Dukungan tersedia Senin - Jumat, 08:00 - 17:00 WIB
                        </span>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
