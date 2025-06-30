'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowUpRight,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Mail,
  MessageSquare,
  Phone,
} from 'lucide-react';

// Data dummy untuk demo
const studentData = {
  id: '1',
  name: 'Andi Pratama',
  email: 'andi.pratama@example.com',
  phone: '+62 812-3456-7890',
  class: '10A',
  avatar: '/avatars/student-1.jpg',
  joinedDate: 'Agustus 2023',
  completedActivities: 45,
  averageScore: 85,
  streak: 12,
  badges: 8,
  challenges: 8,
  challengeWins: 3,
};

const hotsSkillsData = [
  { skill: 'Analyze', value: 78 },
  { skill: 'Evaluate', value: 65 },
  { skill: 'Create', value: 82 },
  { skill: 'Problem-solve', value: 70 },
  { skill: 'Infer', value: 75 },
];

const progressData = [
  { month: 'Jan', score: 65 },
  { month: 'Feb', score: 68 },
  { month: 'Mar', score: 72 },
  { month: 'Apr', score: 75 },
  { month: 'Mei', score: 80 },
  { month: 'Jun', score: 85 },
];

const recentAssignments = [
  {
    id: '1',
    title: 'Analisis Artikel Berita',
    dueDate: '2024-07-05',
    status: 'completed',
    score: 85,
    submittedAt: '2024-07-03',
  },
  {
    id: '2',
    title: 'Menulis Esai Argumentatif',
    dueDate: '2024-07-10',
    status: 'completed',
    score: 92,
    submittedAt: '2024-07-08',
  },
  {
    id: '3',
    title: 'Presentasi Solusi Masalah',
    dueDate: '2024-07-15',
    status: 'pending',
    score: null,
    submittedAt: null,
  },
];

const badges = [
  {
    id: '1',
    name: 'HOTS Master',
    image: '/badges/hots-master.png',
    earnedAt: '2024-06-15',
  },
  {
    id: '2',
    name: 'Writing Expert',
    image: '/badges/writing-expert.png',
    earnedAt: '2024-05-20',
  },
  {
    id: '3',
    name: 'Critical Thinker',
    image: '/badges/critical-thinker.png',
    earnedAt: '2024-04-10',
  },
];

export default function StudentDetailPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profil Siswa</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Ekspor Laporan</span>
          </Button>
          <Button className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>Kirim Pesan</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Informasi Siswa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={studentData.avatar} alt={studentData.name} />
                <AvatarFallback>AP</AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-semibold">{studentData.name}</h2>
              <Badge className="mt-1">Kelas {studentData.class}</Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="text-muted-foreground h-4 w-4" />
                <span>{studentData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="text-muted-foreground h-4 w-4" />
                <span>{studentData.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="text-muted-foreground h-4 w-4" />
                <span>Bergabung sejak {studentData.joinedDate}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex flex-col items-center rounded-md border p-3">
                <span className="text-2xl font-bold">
                  {studentData.completedActivities}
                </span>
                <span className="text-muted-foreground text-xs">
                  Aktivitas Selesai
                </span>
              </div>
              <div className="flex flex-col items-center rounded-md border p-3">
                <span className="text-2xl font-bold">
                  {studentData.averageScore}
                </span>
                <span className="text-muted-foreground text-xs">
                  Skor Rata-rata
                </span>
              </div>
              <div className="flex flex-col items-center rounded-md border p-3">
                <span className="text-2xl font-bold">{studentData.streak}</span>
                <span className="text-muted-foreground text-xs">
                  Hari Streak
                </span>
              </div>
              <div className="flex flex-col items-center rounded-md border p-3">
                <span className="text-2xl font-bold">{studentData.badges}</span>
                <span className="text-muted-foreground text-xs">Badge</span>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="mb-2 text-sm font-medium">Tantangan Mingguan</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="text-muted-foreground h-4 w-4" />
                  <span>{studentData.challenges} diikuti</span>
                </div>
                <Badge variant="secondary">
                  {studentData.challengeWins} kemenangan
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Analisis HOTS</CardTitle>
            <CardDescription>
              Kemampuan Higher Order Thinking Skills
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={hotsSkillsData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar
                    name="Nilai"
                    dataKey="value"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-5 gap-2">
              {hotsSkillsData.map((item) => (
                <div key={item.skill} className="text-center">
                  <div className="text-lg font-bold">{item.value}%</div>
                  <div className="text-muted-foreground text-xs">
                    {item.skill}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="progress">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="progress">Kemajuan</TabsTrigger>
          <TabsTrigger value="assignments">Tugas</TabsTrigger>
          <TabsTrigger value="badges">Badge</TabsTrigger>
          <TabsTrigger value="discussions">Diskusi</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Perkembangan Nilai</CardTitle>
              <CardDescription>
                Grafik perkembangan nilai dalam 6 bulan terakhir
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#8884d8"
                      name="Nilai Rata-rata"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-md border p-4">
                  <div className="text-muted-foreground text-sm">
                    Nilai Terendah
                  </div>
                  <div className="mt-1 text-2xl font-bold">65</div>
                  <div className="text-muted-foreground mt-1 text-xs">
                    Januari 2024
                  </div>
                </div>
                <div className="rounded-md border p-4">
                  <div className="text-muted-foreground text-sm">
                    Nilai Tertinggi
                  </div>
                  <div className="mt-1 text-2xl font-bold">85</div>
                  <div className="text-muted-foreground mt-1 text-xs">
                    Juni 2024
                  </div>
                </div>
                <div className="rounded-md border p-4">
                  <div className="text-muted-foreground text-sm">
                    Peningkatan
                  </div>
                  <div className="mt-1 flex items-center text-2xl font-bold">
                    +20
                    <ArrowUpRight className="ml-1 h-4 w-4 text-green-500" />
                  </div>
                  <div className="text-muted-foreground mt-1 text-xs">
                    6 bulan terakhir
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tugas Terbaru</CardTitle>
              <CardDescription>
                Daftar tugas yang dikerjakan siswa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul Tugas</TableHead>
                    <TableHead>Tenggat</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Nilai</TableHead>
                    <TableHead>Tanggal Pengumpulan</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAssignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="text-muted-foreground h-4 w-4" />
                          {assignment.title}
                        </div>
                      </TableCell>
                      <TableCell>{assignment.dueDate}</TableCell>
                      <TableCell>
                        {assignment.status === 'completed' ? (
                          <Badge className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            <span>Selesai</span>
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Clock className="h-3 w-3" />
                            <span>Belum</span>
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {assignment.score ? (
                          <Badge variant="secondary">{assignment.score}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{assignment.submittedAt || '-'}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Lihat Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Badge yang Diperoleh</CardTitle>
              <CardDescription>
                Badge pencapaian yang telah diraih
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="flex flex-col items-center rounded-md border p-4"
                  >
                    <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
                      <Award className="text-primary h-10 w-10" />
                    </div>
                    <h3 className="mt-4 font-medium">{badge.name}</h3>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Diperoleh pada {badge.earnedAt}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discussions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Diskusi</CardTitle>
              <CardDescription>
                Partisipasi siswa dalam forum diskusi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="text-muted-foreground h-4 w-4" />
                      <span className="font-medium">
                        Diskusi: Dampak AI pada Masa Depan Pendidikan
                      </span>
                    </div>
                    <Badge variant="outline">5 postingan</Badge>
                  </div>
                  <p className="text-muted-foreground mt-2 text-sm">
                    &quot;Saya setuju dengan pendapat Budi. AI dapat membantu
                    personalisasi pembelajaran, tetapi tidak bisa menggantikan
                    peran guru sepenuhnya...&quot;
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">
                      2 Juli 2024
                    </span>
                    <Button variant="ghost" size="sm">
                      Lihat Diskusi
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="text-muted-foreground h-4 w-4" />
                      <span className="font-medium">
                        Diskusi: Analisis Puisi &quot;Aku&quot; karya Chairil
                        Anwar
                      </span>
                    </div>
                    <Badge variant="outline">3 postingan</Badge>
                  </div>
                  <p className="text-muted-foreground mt-2 text-sm">
                    &quot;Menurut analisis saya, puisi ini menggambarkan
                    semangat individualisme dan kebebasan. Penggunaan kata
                    &apos;aku&apos; yang berulang menekankan...&quot;
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">
                      25 Juni 2024
                    </span>
                    <Button variant="ghost" size="sm">
                      Lihat Diskusi
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
