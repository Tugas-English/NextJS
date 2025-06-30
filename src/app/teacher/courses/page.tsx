import { Suspense } from 'react';
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
import {
  BookOpen,
  FileText,
  GraduationCap,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Users,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { getServerSession } from '@/lib/session';
import {
  getCourses,
  getCourseStats,
  getTopStudents,
  getRecentAssignments,
} from '@/lib/actions/courses';

async function CourseStatsCards() {
  const session = await getServerSession();
  const userId = session?.user?.id;

  const stats = await getCourseStats(userId);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Kelas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCourses}</div>
          <p className="text-muted-foreground text-xs">Aktif semester ini</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalStudents}</div>
          <p className="text-muted-foreground text-xs">Dari semua kelas</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Nilai Rata-rata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageScore}</div>
          <p className="text-muted-foreground text-xs">Dari semua kelas</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Tugas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalAssignments}</div>
          <p className="text-muted-foreground text-xs">Aktif & Selesai</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Komponen untuk menampilkan tabel kelas
async function CoursesTable() {
  const session = await getServerSession();
  const userId = session?.user?.id;

  const { data: courses } = await getCourses({
    createdBy: userId,
    isActive: true,
    perPage: 100,
  });

  if (!courses || courses.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Belum ada kelas yang dibuat</p>
        <Link href="/teacher/courses/create" className="mt-4 inline-block">
          <Button>Buat Kelas Baru</Button>
        </Link>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama Kelas</TableHead>
          <TableHead>Skill</TableHead>
          <TableHead>Tanggal Mulai</TableHead>
          <TableHead>Tanggal Berakhir</TableHead>
          <TableHead>Max Siswa</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses.map((course) => (
          <TableRow key={course.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <BookOpen className="text-muted-foreground h-4 w-4" />
                <div>
                  <div>{course.title}</div>
                  <div className="text-muted-foreground text-xs">
                    {course.description?.substring(0, 50)}
                    {course.description && course.description.length > 50
                      ? '...'
                      : ''}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{course.primarySkill || 'mixed'}</Badge>
            </TableCell>
            <TableCell>
              {course.startDate
                ? format(new Date(course.startDate), 'dd MMM yyyy')
                : '-'}
            </TableCell>
            <TableCell>
              {course.endDate
                ? format(new Date(course.endDate), 'dd MMM yyyy')
                : '-'}
            </TableCell>
            <TableCell>{course.maxStudents || 30}</TableCell>
            <TableCell>
              <Badge variant={course.isActive ? 'default' : 'outline'}>
                {course.isActive ? 'Aktif' : 'Nonaktif'}
              </Badge>
            </TableCell>
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
                      href={`/teacher/courses/${course.id}`}
                      className="flex w-full"
                    >
                      Lihat Detail
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href={`/teacher/courses/${course.id}/students`}
                      className="flex w-full"
                    >
                      Lihat Siswa
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href={`/teacher/courses/${course.id}/assignments`}
                      className="flex w-full"
                    >
                      Lihat Tugas
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href={`/teacher/courses/${course.id}/edit`}
                      className="flex w-full"
                    >
                      Edit Kelas
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// Komponen untuk menampilkan siswa terbaik
async function TopStudentsTab() {
  const session = await getServerSession();
  const userId = session?.user?.id;

  const topStudents = await getTopStudents(5, userId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Siswa dengan Performa Terbaik</CardTitle>
        <CardDescription>
          Berdasarkan nilai rata-rata dari semua kelas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topStudents.length > 0 ? (
            topStudents.map((student, index) => (
              <div
                key={student.id}
                className="flex items-center justify-between border-b pb-3 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full font-medium">
                    {index + 1}
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={student.avatar || ''}
                      alt={student.name}
                    />
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{student.name}</div>
                    <div className="text-muted-foreground text-xs">
                      {student.courseTitle}
                    </div>
                  </div>
                </div>
                <Badge variant={student.score >= 90 ? 'default' : 'outline'}>
                  {student.score}
                </Badge>
              </div>
            ))
          ) : (
            <div className="py-4 text-center">
              <p className="text-muted-foreground">Belum ada data siswa</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <Link href="/teacher/students" className="flex w-full justify-center">
            Lihat Semua Siswa
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

async function RecentAssignmentsTab() {
  const session = await getServerSession();
  const userId = session?.user?.id;

  let recentAssignments: any[] = [];
  try {
    recentAssignments = await getRecentAssignments(5, userId);
  } catch (error) {
    console.error('Error fetching recent assignments:', error);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tugas Terbaru</CardTitle>
        <CardDescription>
          Tugas yang sedang berjalan di semua kelas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentAssignments.length > 0 ? (
            recentAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between border-b pb-3 last:border-0"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="text-muted-foreground h-4 w-4" />
                    <span className="font-medium">{assignment.title}</span>
                  </div>
                  <div className="text-muted-foreground mt-1 text-xs">
                    {assignment.courseTitle} • Tenggat:{' '}
                    {format(new Date(assignment.dueDate), 'dd MMM yyyy')}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <div className="text-right">{assignment.submissions}</div>
                    <div className="text-muted-foreground text-xs">
                      Pengumpulan
                    </div>
                  </div>
                  {assignment.avgScore ? (
                    <Badge>{assignment.avgScore}</Badge>
                  ) : (
                    <Badge variant="outline">Belum dinilai</Badge>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-4 text-center">
              <p className="text-muted-foreground">
                Belum ada tugas yang dibuat
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <Link
            href="/teacher/assignments"
            className="flex w-full justify-center"
          >
            Lihat Semua Tugas
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default async function CoursesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Kelas</h1>
        <Link href="/teacher/courses/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Buat Kelas Baru</span>
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div>Memuat statistik...</div>}>
        <CourseStatsCards />
      </Suspense>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Daftar Kelas</CardTitle>
              <CardDescription>
                Kelola semua kelas yang Anda ajar
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                type="search"
                placeholder="Cari kelas..."
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Memuat daftar kelas...</div>}>
            <CoursesTable />
          </Suspense>
        </CardContent>
      </Card>

      <Tabs defaultValue="students">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="students">Siswa Terbaik</TabsTrigger>
          <TabsTrigger value="assignments">Tugas Terbaru</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-6">
          <Suspense fallback={<div>Memuat data siswa...</div>}>
            <TopStudentsTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="assignments" className="mt-6">
          <Suspense fallback={<div>Memuat data tugas...</div>}>
            <RecentAssignmentsTab />
          </Suspense>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Mendatang</CardTitle>
            <CardDescription>Jadwal aktivitas di semua kelas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b pb-3">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-md">
                  <BookOpen className="text-primary h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">Sesi Bahasa Inggris 10A</div>
                  <div className="text-muted-foreground mt-1 text-xs">
                    Senin, 08:00 - 09:30 • Ruang 101
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 border-b pb-3">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-md">
                  <GraduationCap className="text-primary h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">Sesi HOTS Lanjutan</div>
                  <div className="text-muted-foreground mt-1 text-xs">
                    Selasa, 10:00 - 11:30 • Ruang 203
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-md">
                  <FileText className="text-primary h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">
                    Tenggat Tugas: Analisis Artikel
                  </div>
                  <div className="text-muted-foreground mt-1 text-xs">
                    Jumat, 23:59 • Bahasa Inggris 10A
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Link
                href="/teacher/calendar"
                className="flex w-full justify-center"
              >
                Lihat Kalender
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Kelas</CardTitle>
            <CardDescription>Akses cepat ke pengaturan kelas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-auto flex-col items-center justify-center py-4"
                asChild
              >
                <Link href="/teacher/students">
                  <Users className="mb-2 h-6 w-6" />
                  <span>Kelola Siswa</span>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col items-center justify-center py-4"
                asChild
              >
                <Link href="/teacher/assignments/create">
                  <FileText className="mb-2 h-6 w-6" />
                  <span>Buat Tugas</span>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col items-center justify-center py-4"
                asChild
              >
                <Link href="/teacher/modules/create">
                  <BookOpen className="mb-2 h-6 w-6" />
                  <span>Buat Modul</span>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col items-center justify-center py-4"
                asChild
              >
                <Link href="/settings">
                  <Settings className="mb-2 h-6 w-6" />
                  <span>Pengaturan</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
