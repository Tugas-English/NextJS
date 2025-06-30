import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart2,
  BookOpen,
  FileText,
  Pencil,
  UserPlus,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { getCourseById } from '@/lib/actions/courses';
import { notFound } from 'next/navigation';
import { CourseStatsCards } from '../_components/course-starts-cards';
import { CourseInfoCardWrapper } from '../_components/course-info-card-wrapper';
import { StudentsTab } from '../_components/student-tab';
import { AssignmentsTab } from '../_components/assignments-tab';
import { ModulesTab } from '../_components/modules-tab';
import { AnalyticsTabWrapper } from '../_components/analytics-tab-wrapper';

interface CourseDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}
export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { id } = await params;
  const course = await getCourseById(id);

  if (!course) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">{course.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2" asChild>
            <Link href={`/teacher/courses/${course.id}/edit`}>
              <Pencil className="h-4 w-4" />
              <span>Edit Kelas</span>
            </Link>
          </Button>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <span>Tambah Siswa</span>
          </Button>
        </div>
      </div>

      <Suspense fallback={<div>Memuat statistik...</div>}>
        <CourseStatsCards courseId={id} />
      </Suspense>

      <Suspense fallback={<div>Memuat informasi kelas...</div>}>
        <CourseInfoCardWrapper courseId={id} />
      </Suspense>

      <Tabs defaultValue="students">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="students" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Siswa</span>
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Tugas</span>
          </TabsTrigger>
          <TabsTrigger value="modules" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Modul</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <span>Analisis</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-6">
          <Suspense fallback={<div>Memuat data siswa...</div>}>
            <StudentsTab courseId={id} />
          </Suspense>
        </TabsContent>

        <TabsContent value="assignments" className="mt-6">
          <Suspense fallback={<div>Memuat data tugas...</div>}>
            <AssignmentsTab courseId={id} />
          </Suspense>
        </TabsContent>

        <TabsContent value="modules" className="mt-6">
          <Suspense fallback={<div>Memuat data modul...</div>}>
            <ModulesTab courseId={id} />
          </Suspense>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Suspense fallback={<div>Memuat data analisis...</div>}>
            <AnalyticsTabWrapper courseId={id} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
