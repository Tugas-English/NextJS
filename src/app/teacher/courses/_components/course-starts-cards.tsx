import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/db';
import { count, eq } from 'drizzle-orm';
import {
  courseStudents,
  courseActivities,
  courseAssignments,
} from '@/db/schema';

interface CourseStatsCardsProps {
  courseId: string;
}

export async function CourseStatsCards({ courseId }: CourseStatsCardsProps) {
  const studentsCount = await db
    .select({ count: count() })
    .from(courseStudents)
    .where(eq(courseStudents.courseId, courseId));

  const activitiesCount = await db
    .select({ count: count() })
    .from(courseActivities)
    .where(eq(courseActivities.courseId, courseId));

  const assignmentsCount = await db
    .select({ count: count() })
    .from(courseAssignments)
    .where(eq(courseAssignments.courseId, courseId));

  const averageScore = 85;
  const notStartedAssignments = 2;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Jumlah Siswa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {studentsCount[0]?.count || 0}
          </div>
          <p className="text-muted-foreground text-xs">Aktif mengikuti kelas</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Aktivitas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {activitiesCount[0]?.count || 0}
          </div>
          <p className="text-muted-foreground text-xs">Total aktivitas HOTS</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Tugas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {assignmentsCount[0]?.count || 0}
          </div>
          <p className="text-muted-foreground text-xs">
            {notStartedAssignments} belum dimulai
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Rata-rata Nilai</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageScore}</div>
          <p className="text-muted-foreground text-xs">Dari semua tugas</p>
        </CardContent>
      </Card>
    </div>
  );
}
