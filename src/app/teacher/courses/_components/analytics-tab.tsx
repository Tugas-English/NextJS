import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, GraduationCap, LineChart } from "lucide-react";
import { ScoreDistributionChart } from "./chart-components";

interface AnalyticsTabProps {
    studentsWithScores: {
        averageScore: number;
        id: string;
        name: string;
        email: string;
        image: string | null;
    }[];
    scoreDistribution: {
        score: string;
        count: number;
    }[];
}

export function AnalyticsTab({
    studentsWithScores,
    scoreDistribution,
}: AnalyticsTabProps) {
    const topStudents = [...studentsWithScores]
        .sort((a, b) => b.averageScore - a.averageScore)
        .slice(0, 3);

    const bottomStudents = [...studentsWithScores]
        .sort((a, b) => a.averageScore - b.averageScore)
        .slice(0, 3);

    return (
        <>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <Card>
                    <CardHeader>
                        <CardTitle>Distribusi Nilai</CardTitle>
                        <CardDescription>
                            Distribusi nilai siswa
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='h-80'>
                            <ScoreDistributionChart data={scoreDistribution} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Statistik Siswa</CardTitle>
                        <CardDescription>Berdasarkan performa</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                        <div className='border rounded-md p-4'>
                            <h3 className='text-sm font-medium mb-3'>
                                Siswa Terbaik
                            </h3>
                            <div className='space-y-4'>
                                {topStudents.map((student, index) => (
                                    <div
                                        key={student.id}
                                        className='flex items-center justify-between'
                                    >
                                        <div className='flex items-center gap-3'>
                                            <Badge
                                                variant={
                                                    index === 0
                                                        ? "default"
                                                        : "outline"
                                                }
                                            >
                                                {index + 1}
                                            </Badge>
                                            <Avatar className='h-8 w-8'>
                                                <AvatarImage
                                                    src={
                                                        student.image ||
                                                        undefined
                                                    }
                                                    alt={student.name}
                                                />
                                                <AvatarFallback>
                                                    {student.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className='font-medium'>
                                                {student.name}
                                            </span>
                                        </div>
                                        <Badge>{student.averageScore}</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='border rounded-md p-4'>
                            <h3 className='text-sm font-medium mb-3'>
                                Perlu Perhatian
                            </h3>
                            <div className='space-y-4'>
                                {bottomStudents.map((student) => (
                                    <div
                                        key={student.id}
                                        className='flex items-center justify-between'
                                    >
                                        <div className='flex items-center gap-3'>
                                            <Avatar className='h-8 w-8'>
                                                <AvatarImage
                                                    src={
                                                        student.image ||
                                                        undefined
                                                    }
                                                    alt={student.name}
                                                />
                                                <AvatarFallback>
                                                    {student.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className='font-medium'>
                                                {student.name}
                                            </span>
                                        </div>
                                        <Badge variant='outline'>
                                            {student.averageScore}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className='mt-6'>
                <CardHeader>
                    <CardTitle>Ringkasan Analisis</CardTitle>
                    <CardDescription>
                        Analisis performa kelas secara keseluruhan
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='space-y-4'>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                            <div className='border rounded-md p-4'>
                                <div className='flex items-center gap-2'>
                                    <Award className='h-5 w-5 text-primary' />
                                    <h3 className='font-medium'>Pencapaian</h3>
                                </div>
                                <p className='mt-2 text-sm text-muted-foreground'>
                                    Rata-rata nilai kelas berada di atas target
                                    minimal 75. Mayoritas siswa (62.5%)
                                    mendapatkan nilai di atas 80.
                                </p>
                            </div>

                            <div className='border rounded-md p-4'>
                                <div className='flex items-center gap-2'>
                                    <GraduationCap className='h-5 w-5 text-primary' />
                                    <h3 className='font-medium'>Kemajuan</h3>
                                </div>
                                <p className='mt-2 text-sm text-muted-foreground'>
                                    Tingkat penyelesaian tugas mencapai 85.7%
                                    untuk tugas yang sudah dimulai. Partisipasi
                                    siswa dalam aktivitas cukup tinggi.
                                </p>
                            </div>

                            <div className='border rounded-md p-4'>
                                <div className='flex items-center gap-2'>
                                    <LineChart className='h-5 w-5 text-primary' />
                                    <h3 className='font-medium'>Tren</h3>
                                </div>
                                <p className='mt-2 text-sm text-muted-foreground'>
                                    Terlihat peningkatan nilai rata-rata sebesar
                                    7% dibandingkan dengan awal semester.
                                    Keterampilan HOTS yang paling berkembang
                                    adalah Analyze.
                                </p>
                            </div>
                        </div>

                        <div className='border rounded-md p-4'>
                            <h3 className='font-medium mb-2'>Rekomendasi</h3>
                            <ul className='space-y-2 text-sm text-muted-foreground'>
                                <li className='flex items-start gap-2'>
                                    <span className='rounded-full bg-primary h-1.5 w-1.5 mt-1.5' />
                                    <span>
                                        Fokus lebih banyak pada aktivitas tipe
                                        Infer yang masih rendah (5%).
                                    </span>
                                </li>
                                <li className='flex items-start gap-2'>
                                    <span className='rounded-full bg-primary h-1.5 w-1.5 mt-1.5' />
                                    <span>
                                        Berikan bantuan tambahan untuk 4 siswa
                                        yang mendapat nilai di bawah 70.
                                    </span>
                                </li>
                                <li className='flex items-start gap-2'>
                                    <span className='rounded-full bg-primary h-1.5 w-1.5 mt-1.5' />
                                    <span>
                                        Tambahkan lebih banyak aktivitas
                                        collaborative problem-solving untuk
                                        meningkatkan keterlibatan.
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className='w-full'>Ekspor Analisis Lengkap</Button>
                </CardFooter>
            </Card>
        </>
    );
}
