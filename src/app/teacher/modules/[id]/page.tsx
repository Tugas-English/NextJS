'use server';

import { db } from '@/db';
import {
  modules,
  moduleActivities,
  activities as activitiesTable,
} from '@/db/schema';
import { notFound } from 'next/navigation';
import { getServerSession } from '@/lib/session';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  BookMarked,
  Edit,
  FileText,
  MoreHorizontal,
  Plus,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { eq, desc, asc, sql } from 'drizzle-orm';

// Fungsi untuk mendapatkan detail modul berdasarkan ID
export async function getModuleById(moduleId: string) {
  try {
    const moduleData = await db.query.modules.findFirst({
      where: eq(modules.id, moduleId),
      with: {
        creator: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });

    return moduleData;
  } catch (error) {
    console.error('Error fetching module:', error);
    return null;
  }
}

// Fungsi untuk mendapatkan aktivitas dalam modul
export async function getModuleActivities(moduleId: string) {
  try {
    const moduleActivitiesData = await db
      .select({
        id: moduleActivities.id,
        activityId: moduleActivities.activityId,
        order: moduleActivities.order,
        isRequired: moduleActivities.isRequired,
        title: activitiesTable.title,
        skill: activitiesTable.skill,
        hotsType: activitiesTable.hotsType,
        difficulty: activitiesTable.difficulty,
        estimatedDuration: activitiesTable.estimatedDuration,
      })
      .from(moduleActivities)
      .innerJoin(
        activitiesTable,
        eq(moduleActivities.activityId, activitiesTable.id),
      )
      .where(eq(moduleActivities.moduleId, moduleId))
      .orderBy(asc(moduleActivities.order));

    return moduleActivitiesData;
  } catch (error) {
    console.error('Error fetching module activities:', error);
    return [];
  }
}

// Fungsi untuk mendapatkan aktivitas yang tersedia untuk ditambahkan ke modul
export async function getAvailableActivities(moduleId: string) {
  try {
    // Dapatkan ID aktivitas yang sudah ada di modul
    const existingActivityIds = await db
      .select({ activityId: moduleActivities.activityId })
      .from(moduleActivities)
      .where(eq(moduleActivities.moduleId, moduleId));

    const existingIds = existingActivityIds.map((item) => item.activityId);

    // Dapatkan aktivitas yang belum ada di modul
    const availableActivities = await db.query.activities.findMany({
      where:
        existingIds.length > 0
          ? sql`${activitiesTable.id} NOT IN ${existingIds}`
          : undefined,
      columns: {
        id: true,
        title: true,
        skill: true,
        hotsType: true,
        difficulty: true,
        estimatedDuration: true,
      },
      orderBy: [desc(activitiesTable.createdAt)],
    });

    return availableActivities;
  } catch (error) {
    console.error('Error fetching available activities:', error);
    return [];
  }
}

// Fungsi untuk mendapatkan data kemajuan siswa dalam modul
export async function getStudentProgress(moduleId: string) {
  try {
    // Fungsi ini akan diimplementasikan setelah tabel progress siswa dibuat
    // Untuk saat ini, kita menggunakan data dummy
    return [
      {
        id: '1',
        name: 'Andi Pratama',
        progress: 100,
        completedActivities: 5,
        totalActivities: 5,
        averageScore: 92,
      },
      {
        id: '2',
        name: 'Budi Santoso',
        progress: 80,
        completedActivities: 4,
        totalActivities: 5,
        averageScore: 85,
      },
      {
        id: '3',
        name: 'Citra Dewi',
        progress: 100,
        completedActivities: 5,
        totalActivities: 5,
        averageScore: 90,
      },
      {
        id: '4',
        name: 'Deni Kurniawan',
        progress: 60,
        completedActivities: 3,
        totalActivities: 5,
        averageScore: 78,
      },
      {
        id: '5',
        name: 'Eka Putri',
        progress: 40,
        completedActivities: 2,
        totalActivities: 5,
        averageScore: 82,
      },
    ];
  } catch (error) {
    console.error('Error fetching student progress:', error);
    return [];
  }
}

// Komponen untuk menampilkan detail modul
async function ModuleDetail({ moduleId }: { moduleId: string }) {
  const moduleData = await getModuleById(moduleId);

  if (!moduleData) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookMarked className="h-6 w-6" />
          <h1 className="text-3xl font-bold">{moduleData.title}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/teacher/modules/${moduleId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit Modul</span>
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Duplikat Modul</DropdownMenuItem>
              <DropdownMenuItem>Ekspor Modul</DropdownMenuItem>
              <DropdownMenuItem>Buat Tugas dari Modul</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Hapus Modul
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Detail Modul</CardTitle>
              <div className="flex items-center justify-between">
                <CardDescription>Dibuat pada </CardDescription>
                <Badge>
                  {moduleData.isPublished ? 'Dipublikasi' : 'Draft'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-1 font-medium">Deskripsi</div>
                <p className="text-sm">
                  {moduleData.description || 'Tidak ada deskripsi'}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm font-medium">Skill</div>
                  <Badge variant="outline">
                    {moduleData.skill || 'Tidak ditentukan'}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm font-medium">HOTS Type</div>
                  <Badge variant="secondary">
                    {moduleData.hotsType || 'Tidak ditentukan'}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm font-medium">Kesulitan</div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`mx-0.5 size-2 rounded-full ${
                          i < (moduleData.difficulty || 0)
                            ? 'bg-primary'
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <ModuleStats moduleId={moduleId} />
      </div>

      <Tabs defaultValue="activities">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="activities" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>Aktivitas</span>
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Siswa</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activities" className="mt-6">
          <Suspense fallback={<div>Memuat aktivitas...</div>}>
            <ActivitiesTab moduleId={moduleId} />
          </Suspense>
        </TabsContent>

        <TabsContent value="students" className="mt-6">
          <Suspense fallback={<div>Memuat data siswa...</div>}>
            <StudentsTab moduleId={moduleId} />
          </Suspense>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/teacher/modules">Kembali ke Daftar Modul</Link>
        </Button>
        <Button asChild>
          <Link href={`/teacher/assignments/create?moduleId=${moduleId}`}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Buat Tugas dari Modul</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}

// Komponen untuk menampilkan statistik modul
async function ModuleStats({ moduleId }: { moduleId: string }) {
  const activities = await getModuleActivities(moduleId);
  const studentProgress = await getStudentProgress(moduleId);

  const totalDuration = activities.reduce(
    (acc, activity) => acc + (activity.estimatedDuration || 0),
    0,
  );

  const requiredActivities = activities.filter((a) => a.isRequired).length;

  return (
    <div className="md:col-span-1">
      <Card>
        <CardHeader>
          <CardTitle>Statistik Modul</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center rounded-md border p-3">
              <span className="text-2xl font-bold">{activities.length}</span>
              <span className="text-muted-foreground text-xs">Aktivitas</span>
            </div>
            <div className="flex flex-col items-center rounded-md border p-3">
              <span className="text-2xl font-bold">{requiredActivities}</span>
              <span className="text-muted-foreground text-xs">
                Aktivitas Wajib
              </span>
            </div>
            <div className="flex flex-col items-center rounded-md border p-3">
              <span className="text-2xl font-bold">
                {studentProgress.length}
              </span>
              <span className="text-muted-foreground text-xs">Siswa</span>
            </div>
            <div className="flex flex-col items-center rounded-md border p-3">
              <span className="text-2xl font-bold">
                {Math.round(
                  studentProgress.reduce(
                    (acc, student) => acc + student.averageScore,
                    0,
                  ) / (studentProgress.length || 1),
                )}
              </span>
              <span className="text-muted-foreground text-xs">
                Nilai Rata-rata
              </span>
            </div>
          </div>

          <div>
            <div className="mb-1 text-sm font-medium">
              Total Durasi Estimasi
            </div>
            <div className="text-lg font-bold">{totalDuration} menit</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Komponen untuk menampilkan tab aktivitas
async function ActivitiesTab({ moduleId }: { moduleId: string }) {
  const activities = await getModuleActivities(moduleId);

  const skillLabels: Record<string, string> = {
    reading: 'Reading',
    listening: 'Listening',
    writing: 'Writing',
    speaking: 'Speaking',
  };

  const hotsLabels: Record<string, string> = {
    analyze: 'Analyze',
    evaluate: 'Evaluate',
    create: 'Create',
    'problem-solve': 'Problem Solve',
    infer: 'Infer',
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Aktivitas dalam Modul</CardTitle>
          <Button variant="outline" asChild>
            <Link href={`/teacher/modules/${moduleId}/edit`}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Tambah Aktivitas</span>
            </Link>
          </Button>
        </div>
        <CardDescription>Urutan aktivitas dalam modul ini</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Urutan</TableHead>
                <TableHead>Judul Aktivitas</TableHead>
                <TableHead>Skill</TableHead>
                <TableHead>HOTS Type</TableHead>
                <TableHead>Kesulitan</TableHead>
                <TableHead>Durasi</TableHead>
                <TableHead>Wajib</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>{activity.order}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Activity className="text-muted-foreground h-4 w-4" />
                      <Link href={`/teacher/activities/${activity.activityId}`}>
                        {activity.title}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {skillLabels[activity.skill as string] || activity.skill}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {hotsLabels[activity.hotsType as string] ||
                        activity.hotsType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex">
                      {Array.from({
                        length: 5,
                      }).map((_, i) => (
                        <span
                          key={i}
                          className={`mx-0.5 size-2 rounded-full ${
                            i < (activity.difficulty || 0)
                              ? 'bg-primary'
                              : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{activity.estimatedDuration || 0} menit</TableCell>
                  <TableCell>
                    <Badge
                      variant={activity.isRequired ? 'default' : 'outline'}
                    >
                      {activity.isRequired ? 'Ya' : 'Tidak'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              Belum ada aktivitas dalam modul ini
            </p>
            <Button className="mt-4" asChild>
              <Link href={`/teacher/modules/${moduleId}/edit`}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Aktivitas
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Komponen untuk menampilkan tab siswa
async function StudentsTab({ moduleId }: { moduleId: string }) {
  const studentProgress = await getStudentProgress(moduleId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kemajuan Siswa</CardTitle>
        <CardDescription>
          Progres siswa dalam menyelesaikan modul ini
        </CardDescription>
      </CardHeader>
      <CardContent>
        {studentProgress.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Siswa</TableHead>
                <TableHead>Progres</TableHead>
                <TableHead>Aktivitas Selesai</TableHead>
                <TableHead>Nilai Rata-rata</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentProgress.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="bg-muted h-2 w-32 overflow-hidden rounded-full">
                        <div
                          className="bg-primary h-full"
                          style={{
                            width: `${student.progress}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm">{student.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {student.completedActivities}/{student.totalActivities}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        student.averageScore >= 80 ? 'default' : 'outline'
                      }
                    >
                      {student.averageScore}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/teacher/students/${student.id}`}>
                      <Button variant="ghost" size="sm">
                        Lihat Detail
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              Belum ada data kemajuan siswa untuk modul ini
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Halaman utama
export default async function ModuleDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession();

  if (!session?.user) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold">Akses Ditolak</h1>
        <p className="text-muted-foreground mb-6">
          Anda harus login untuk melihat halaman ini
        </p>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Suspense fallback={<div>Memuat detail modul...</div>}>
        <ModuleDetail moduleId={params.id} />
      </Suspense>
    </div>
  );
}
