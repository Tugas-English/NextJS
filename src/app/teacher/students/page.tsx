'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  BarChart2,
  ChevronDown,
  Download,
  Mail,
  MoreHorizontal,
  Search,
  User,
  Users,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

// Data dummy untuk demo
const students = [
  {
    id: '1',
    name: 'Andi Pratama',
    email: 'andi.pratama@example.com',
    class: '10A',
    avatar: '/avatars/student-1.jpg',
    joinedDate: 'Agustus 2023',
    completedActivities: 45,
    averageScore: 92,
    lastActive: '2024-07-05',
  },
  {
    id: '2',
    name: 'Budi Santoso',
    email: 'budi.santoso@example.com',
    class: '10A',
    avatar: '/avatars/student-2.jpg',
    joinedDate: 'Agustus 2023',
    completedActivities: 42,
    averageScore: 88,
    lastActive: '2024-07-04',
  },
  {
    id: '3',
    name: 'Citra Dewi',
    email: 'citra.dewi@example.com',
    class: '10A',
    avatar: '/avatars/student-3.jpg',
    joinedDate: 'Agustus 2023',
    completedActivities: 44,
    averageScore: 90,
    lastActive: '2024-07-05',
  },
  {
    id: '4',
    name: 'Deni Kurniawan',
    email: 'deni.kurniawan@example.com',
    class: '10A',
    avatar: '/avatars/student-4.jpg',
    joinedDate: 'Agustus 2023',
    completedActivities: 38,
    averageScore: 85,
    lastActive: '2024-07-03',
  },
  {
    id: '5',
    name: 'Eka Putri',
    email: 'eka.putri@example.com',
    class: '10A',
    avatar: '/avatars/student-5.jpg',
    joinedDate: 'Agustus 2023',
    completedActivities: 40,
    averageScore: 87,
    lastActive: '2024-07-04',
  },
];

const classes = [
  { id: '1', name: 'Bahasa Inggris 10A', students: 32 },
  { id: '2', name: 'HOTS Lanjutan', students: 28 },
  { id: '3', name: 'Menulis Kreatif', students: 25 },
];

const hotsPerformance = [
  { name: 'Analyze', value: 78 },
  { name: 'Evaluate', value: 65 },
  { name: 'Create', value: 82 },
  { name: 'Problem-solve', value: 70 },
  { name: 'Infer', value: 75 },
];

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Siswa</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Ekspor Data</span>
          </Button>
          <Link href="/teacher/students/analytics">
            <Button variant="outline" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              <span>Analisis HOTS</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85</div>
            <p className="text-muted-foreground text-xs">Dalam 3 kelas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Rata-rata Nilai
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82</div>
            <p className="text-muted-foreground text-xs">+3 dari bulan lalu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Tingkat Partisipasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-muted-foreground text-xs">
              Aktif dalam 7 hari terakhir
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all-students">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all-students" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Semua Siswa</span>
          </TabsTrigger>
          <TabsTrigger value="classes" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Kelas</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <span>Performa HOTS</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <select className="border-input bg-background h-9 rounded-md border px-3 text-sm">
              <option value="all">Semua Kelas</option>
              <option value="10a">Bahasa Inggris 10A</option>
              <option value="hots">HOTS Lanjutan</option>
              <option value="writing">Menulis Kreatif</option>
            </select>

            <select className="border-input bg-background h-9 rounded-md border px-3 text-sm">
              <option value="newest">Terbaru</option>
              <option value="name-asc">Nama (A-Z)</option>
              <option value="name-desc">Nama (Z-A)</option>
              <option value="score-desc">Nilai Tertinggi</option>
              <option value="score-asc">Nilai Terendah</option>
            </select>
          </div>

          <div className="relative w-64">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input type="search" placeholder="Cari siswa..." className="pl-8" />
          </div>
        </div>

        <TabsContent value="all-students" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Siswa</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Aktivitas Selesai</TableHead>
                    <TableHead>Nilai Rata-rata</TableHead>
                    <TableHead>Terakhir Aktif</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={student.avatar}
                              alt={student.name}
                            />
                            <AvatarFallback>
                              {student.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-muted-foreground text-xs">
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.class}</Badge>
                      </TableCell>
                      <TableCell>{student.completedActivities}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            student.averageScore >= 90 ? 'default' : 'outline'
                          }
                        >
                          {student.averageScore}
                        </Badge>
                      </TableCell>
                      <TableCell>{student.lastActive}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Link
                                href={`/teacher/students/${student.id}`}
                                className="flex w-full"
                              >
                                Lihat Profil
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Kirim Pesan
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Ekspor Laporan
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-muted-foreground text-sm">
                Menampilkan 5 dari 85 siswa
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Sebelumnya
                </Button>
                <Button variant="outline" size="sm">
                  Selanjutnya
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Kelas</CardTitle>
              <CardDescription>Kelola kelas dan siswa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classes.map((classItem) => (
                  <div key={classItem.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">
                          {classItem.name}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {classItem.students} siswa terdaftar
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">
                            Aksi
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Lihat Siswa</DropdownMenuItem>
                          <DropdownMenuItem>Tambah Siswa</DropdownMenuItem>
                          <DropdownMenuItem>Edit Kelas</DropdownMenuItem>
                          <DropdownMenuItem>Ekspor Data</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <div className="rounded-md border p-3">
                        <div className="text-muted-foreground text-sm">
                          Nilai Rata-rata
                        </div>
                        <div className="mt-1 text-xl font-bold">82</div>
                      </div>
                      <div className="rounded-md border p-3">
                        <div className="text-muted-foreground text-sm">
                          Tugas Selesai
                        </div>
                        <div className="mt-1 text-xl font-bold">85%</div>
                      </div>
                      <div className="rounded-md border p-3">
                        <div className="text-muted-foreground text-sm">
                          Partisipasi
                        </div>
                        <div className="mt-1 text-xl font-bold">78%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Tambah Kelas Baru</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Performa HOTS</CardTitle>
              <CardDescription>
                Ringkasan performa Higher Order Thinking Skills siswa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {hotsPerformance.map((item) => (
                  <div key={item.name} className="space-y-2">
                    <div className="flex justify-between">
                      <div className="font-medium">{item.name}</div>
                      <div>{item.value}%</div>
                    </div>
                    <div className="bg-muted h-2 overflow-hidden rounded-full">
                      <div
                        className="bg-primary h-full"
                        style={{
                          width: `${item.value}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t pt-6">
                <h3 className="mb-4 text-lg font-medium">
                  Siswa Terbaik per Kategori
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-md border p-4">
                    <div className="text-sm font-medium">Analyze</div>
                    <div className="mt-2 flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src="/avatars/student-1.jpg"
                          alt="Andi Pratama"
                        />
                        <AvatarFallback>AP</AvatarFallback>
                      </Avatar>
                      <span>Andi Pratama</span>
                      <Badge className="ml-auto">95%</Badge>
                    </div>
                  </div>
                  <div className="rounded-md border p-4">
                    <div className="text-sm font-medium">Evaluate</div>
                    <div className="mt-2 flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src="/avatars/student-3.jpg"
                          alt="Citra Dewi"
                        />
                        <AvatarFallback>CD</AvatarFallback>
                      </Avatar>
                      <span>Citra Dewi</span>
                      <Badge className="ml-auto">92%</Badge>
                    </div>
                  </div>
                  <div className="rounded-md border p-4">
                    <div className="text-sm font-medium">Create</div>
                    <div className="mt-2 flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src="/avatars/student-5.jpg"
                          alt="Eka Putri"
                        />
                        <AvatarFallback>EP</AvatarFallback>
                      </Avatar>
                      <span>Eka Putri</span>
                      <Badge className="ml-auto">94%</Badge>
                    </div>
                  </div>
                  <div className="rounded-md border p-4">
                    <div className="text-sm font-medium">Problem-solve</div>
                    <div className="mt-2 flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src="/avatars/student-2.jpg"
                          alt="Budi Santoso"
                        />
                        <AvatarFallback>BS</AvatarFallback>
                      </Avatar>
                      <span>Budi Santoso</span>
                      <Badge className="ml-auto">90%</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/teacher/students/analytics">
                <Button className="w-full">Lihat Analisis Lengkap</Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
