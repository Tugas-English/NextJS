import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { ArrowLeft, FileText, Clock, Calendar, User } from 'lucide-react';
import { db } from '@/db';
import {
  submissions,
  evaluations,
  user,
  activities,
  modules,
  assignments,
} from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getServerSession } from '@/lib/session';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { formatDate } from 'date-fns';

async function getAssignmentWithDetails(assignmentId: string) {
  try {
    const assignment = await db.query.assignments.findFirst({
      where: eq(assignments.id, assignmentId),
      with: {
        rubric: {
          columns: {
            id: true,
            name: true,
            maxScore: true,
          },
        },
        assignedBy: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!assignment) {
      return null;
    }

    let activityData = null;
    if (assignment.activityId) {
      activityData = await db.query.activities.findFirst({
        where: eq(activities.id, assignment.activityId),
        columns: {
          id: true,
          title: true,
        },
      });
    }

    let moduleData = null;
    if (assignment.moduleId) {
      moduleData = await db.query.modules.findFirst({
        where: eq(modules.id, assignment.moduleId),
        columns: {
          id: true,
          title: true,
        },
      });
    }

    return {
      ...assignment,
      activityTitle: activityData?.title || null,
      moduleTitle: moduleData?.title || null,
    };
  } catch (error) {
    console.error('Error fetching assignment details:', error);
    return null;
  }
}

async function getSubmissionsByAssignmentId(assignmentId: string) {
  try {
    const submissionData = await db
      .select({
        id: submissions.id,
        studentId: submissions.studentId,
        studentName: user.name,
        submittedAt: submissions.submittedAt,
        version: submissions.version,
        hasEvaluation: evaluations.id,
        score: evaluations.scores,
      })
      .from(submissions)
      .innerJoin(user, eq(submissions.studentId, user.id))
      .leftJoin(evaluations, eq(submissions.id, evaluations.submissionId))
      .where(
        and(
          eq(submissions.assignmentId, assignmentId),
          eq(submissions.isDraft, false),
        ),
      )
      .orderBy(desc(submissions.submittedAt));

    return submissionData.map((submission) => ({
      id: submission.id,
      studentId: submission.studentId,
      studentName: submission.studentName,
      submittedAt: submission.submittedAt
        ? formatDate(submission.submittedAt, 'dd MMM yyyy HH:mm')
        : '-',
      status: submission.hasEvaluation ? 'evaluated' : 'pending',
      score: submission.score ? calculateTotalScore(submission.score) : null,
      version: submission.version,
    }));
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return [];
  }
}

function calculateTotalScore(scores: any) {
  if (!scores || typeof scores !== 'object') return 0;

  let totalScore = 0;
  for (const criteriaId in scores) {
    if (scores[criteriaId] && scores[criteriaId].score) {
      totalScore += Number(scores[criteriaId].score);
    }
  }

  return totalScore;
}

async function AssignmentDetail({ assignmentId }: { assignmentId: string }) {
  const assignment = await getAssignmentWithDetails(assignmentId);

  if (!assignment) {
    notFound();
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" asChild>
        <Link href="/teacher/assignments">
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
      <h1 className="text-3xl font-bold">{assignment.title}</h1>
      {assignment.isPublished ? (
        <Badge variant="default">Dipublikasi</Badge>
      ) : (
        <Badge variant="outline">Draft</Badge>
      )}
      {assignment.isChallenge && <Badge variant="secondary">Challenge</Badge>}
    </div>
  );
}

// Komponen untuk menampilkan informasi tugas
async function AssignmentInfo({ assignmentId }: { assignmentId: string }) {
  const assignment = await getAssignmentWithDetails(assignmentId);

  if (!assignment) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detail Tugas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-center gap-2">
            <FileText className="text-muted-foreground h-4 w-4" />
            <div>
              <p className="text-muted-foreground text-sm">
                {assignment.activityTitle
                  ? 'Aktivitas'
                  : assignment.moduleTitle
                    ? 'Modul'
                    : 'Sumber'}
              </p>
              <p className="font-medium">
                {assignment.activityTitle || assignment.moduleTitle || '-'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="text-muted-foreground h-4 w-4" />
            <div>
              <p className="text-muted-foreground text-sm">Tenggat Waktu</p>
              <p className="font-medium">
                {assignment.dueDate
                  ? formatDate(assignment.dueDate, 'dd MMMM yyyy')
                  : 'Tidak ada tenggat'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="text-muted-foreground h-4 w-4" />
            <div>
              <p className="text-muted-foreground text-sm">Dibuat Pada</p>
              <p className="font-medium">
                {formatDate(assignment.createdAt ?? '', 'dd MMMM yyyy')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <User className="text-muted-foreground h-4 w-4" />
            <div>
              <p className="text-muted-foreground text-sm">Rubrik</p>
              <p className="font-medium">{assignment.rubric?.name || '-'}</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-muted-foreground mb-1 text-sm">Instruksi</p>
          <p>{assignment.instructions || 'Tidak ada instruksi'}</p>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" asChild>
            <Link href={`/teacher/assignments/${assignmentId}/edit`}>
              Edit Tugas
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Komponen untuk menampilkan statistik submission
async function SubmissionStats({ assignmentId }: { assignmentId: string }) {
  const submissions = await getSubmissionsByAssignmentId(assignmentId);
  const assignment = await getAssignmentWithDetails(assignmentId);

  if (!assignment) {
    return null;
  }

  const evaluatedSubmissions = submissions.filter(
    (s) => s.status === 'evaluated',
  );
  const pendingSubmissions = submissions.filter((s) => s.status === 'pending');

  const avgScore =
    evaluatedSubmissions.length > 0
      ? Math.round(
          evaluatedSubmissions.reduce(
            (acc, curr) => acc + (curr.score || 0),
            0,
          ) / evaluatedSubmissions.length,
        )
      : 0;

  const highestScore =
    evaluatedSubmissions.length > 0
      ? Math.max(...evaluatedSubmissions.map((s) => s.score || 0))
      : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistik Pengumpulan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-lg border p-4">
              <p className="text-muted-foreground text-sm">Total Pengumpulan</p>
              <p className="text-2xl font-bold">{submissions.length}</p>
            </div>

            <div className="bg-card rounded-lg border p-4">
              <p className="text-muted-foreground text-sm">Menunggu Review</p>
              <p className="text-2xl font-bold">{pendingSubmissions.length}</p>
            </div>

            <div className="bg-card rounded-lg border p-4">
              <p className="text-muted-foreground text-sm">Nilai Rata-rata</p>
              <p className="text-2xl font-bold">
                {evaluatedSubmissions.length > 0 ? avgScore : '-'}
              </p>
            </div>

            <div className="bg-card rounded-lg border p-4">
              <p className="text-muted-foreground text-sm">Nilai Tertinggi</p>
              <p className="text-2xl font-bold">
                {evaluatedSubmissions.length > 0 ? highestScore : '-'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

async function SubmissionsList({ assignmentId }: { assignmentId: string }) {
  const submissions = await getSubmissionsByAssignmentId(assignmentId);
  const assignment = await getAssignmentWithDetails(assignmentId);

  if (!assignment) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengumpulan Siswa</CardTitle>
        <CardDescription>Review dan evaluasi hasil kerja siswa</CardDescription>
      </CardHeader>
      <CardContent>
        {submissions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Siswa</TableHead>
                <TableHead>Waktu Pengumpulan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Nilai</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">
                    {submission.studentName}
                  </TableCell>
                  <TableCell>{submission.submittedAt}</TableCell>
                  <TableCell>
                    {submission.status === 'evaluated' ? (
                      <Badge
                        variant="outline"
                        className="border-green-200 bg-green-50 text-green-700"
                      >
                        Sudah Dinilai
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-amber-200 bg-amber-50 text-amber-700"
                      >
                        Menunggu Review
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {submission.score !== null ? (
                      <span>
                        {submission.score}/{assignment.rubric?.maxScore || 100}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        href={`/teacher/assignments/${assignmentId}/submissions/${submission.id}`}
                      >
                        {submission.status === 'evaluated'
                          ? 'Lihat'
                          : 'Evaluasi'}
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-10 text-center">
            <p className="text-muted-foreground">
              Belum ada pengumpulan untuk tugas ini
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface AssignmentDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AssignmentDetailPage({
  params,
}: AssignmentDetailPageProps) {
  const { id } = await params;
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
      <Suspense fallback={<div>Memuat detail tugas...</div>}>
        <AssignmentDetail assignmentId={id} />
      </Suspense>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Suspense fallback={<div>Memuat informasi tugas...</div>}>
          <AssignmentInfo assignmentId={id} />
        </Suspense>

        <Suspense fallback={<div>Memuat statistik pengumpulan...</div>}>
          <SubmissionStats assignmentId={id} />
        </Suspense>
      </div>

      <Suspense fallback={<div>Memuat daftar pengumpulan...</div>}>
        <SubmissionsList assignmentId={id} />
      </Suspense>
    </div>
  );
}
