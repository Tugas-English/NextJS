import { db } from '@/db';
import {
  assignments,
  activities,
  rubrics,
  submissions,
  evaluations,
  user,
} from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from '@/lib/session';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  ArrowLeft,
  Brain,
  BarChart3,
  Clock,
  FileText,
  Calendar,
  CheckCircle,
  AlertTriangle,
  PenTool,
  MessageSquare,
  FileUp,
  Clipboard,
  Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { formatDistanceToNow, isPast, format } from 'date-fns';
import { id } from 'date-fns/locale';
import SubmissionForm from './_components/submission-form';
import SubmissionResult from './_components/submission-result';

interface AssignmentDetailPageProps {
  params: {
    assignmentId: string;
  };
}

function safelyParseJSON(jsonString: any, defaultValue: any = {}) {
  if (typeof jsonString === 'object' && jsonString !== null) {
    return jsonString;
  }

  if (!jsonString || typeof jsonString !== 'string') {
    return defaultValue;
  }

  try {
    // Coba parse JSON string biasa
    return JSON.parse(jsonString);
  } catch (e) {
    // Jika gagal, coba parse JSON string dengan double quotes
    try {
      // Ganti semua double quotes yang di-escape
      const fixedString = jsonString.replace(/""/g, '"');
      return JSON.parse(fixedString);
    } catch (e2) {
      console.error('Failed to parse JSON:', e2);
      return defaultValue;
    }
  }
}

export default async function AssignmentDetailPage({
  params,
}: AssignmentDetailPageProps) {
  const { assignmentId } = params;
  const session = await getServerSession();

  if (!session?.user) {
    return redirect('/login');
  }

  // Ambil detail tugas
  const assignment = await db.query.assignments.findFirst({
    where: and(
      eq(assignments.id, assignmentId),
      eq(assignments.isPublished, true),
    ),
  });

  if (!assignment) {
    notFound();
  }

  // Ambil detail aktivitas terkait
  const activity = assignment.activityId
    ? await db.query.activities.findFirst({
        where: eq(activities.id, assignment.activityId),
      })
    : null;

  // Ambil rubrik penilaian
  const rubric = await db.query.rubrics.findFirst({
    where: eq(rubrics.id, assignment.rubricId),
  });

  // Ambil informasi pembuat tugas
  const teacher = assignment.assignedBy
    ? await db
        .select({
          id: user.id,
          name: user.name,
          image: user.image,
        })
        .from(user)
        .where(eq(user.id, assignment.assignedBy))
        .then((res) => res[0])
    : null;

  // Ambil submission siswa
  const studentSubmissions = await db
    .select()
    .from(submissions)
    .where(
      and(
        eq(submissions.assignmentId, assignmentId),
        eq(submissions.studentId, session.user.id),
      ),
    )
    .orderBy(desc(submissions.submittedAt));

  const latestSubmission = studentSubmissions[0] || null;

  // Ambil evaluasi untuk submission terbaru
  const evaluation = latestSubmission
    ? await db
        .select()
        .from(evaluations)
        .where(eq(evaluations.submissionId, latestSubmission.id))
        .then((res) => res[0])
    : null;

  // Parse data JSON dengan aman
  let rubricCriteria = {};
  if (rubric?.criteria) {
    try {
      rubricCriteria = safelyParseJSON(rubric.criteria);
      console.log('Successfully parsed rubric criteria:', rubricCriteria);
    } catch (e) {
      console.error('Error parsing rubric criteria:', e);
    }
  }

  let evaluationScores = {};
  if (evaluation?.scores) {
    try {
      evaluationScores = safelyParseJSON(evaluation.scores);
    } catch (e) {
      console.error('Error parsing evaluation scores:', e);
    }
  }

  let evaluationFeedback = {};
  if (evaluation?.criteriaFeedback) {
    try {
      evaluationFeedback = safelyParseJSON(evaluation.criteriaFeedback);
    } catch (e) {
      console.error('Error parsing evaluation feedback:', e);
    }
  }

  let submissionChecklist = [];
  if (latestSubmission?.checklist) {
    try {
      submissionChecklist = safelyParseJSON(latestSubmission.checklist, []);
    } catch (e) {
      console.error('Error parsing submission checklist:', e);
    }
  }

  // Log untuk debugging
  console.log('Rubric:', rubric);
  console.log('Rubric Criteria (parsed):', rubricCriteria);
  console.log('Evaluation Scores (parsed):', evaluationScores);

  // Tentukan status tugas
  const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null;
  const isOverdue = dueDate && isPast(dueDate);
  const hasSubmission = !!latestSubmission;
  const isDraft = latestSubmission?.isDraft;
  const hasEvaluation = !!evaluation;

  let status = 'not_submitted';
  if (hasSubmission) {
    if (isDraft) {
      status = 'draft';
    } else if (hasEvaluation) {
      // Cek apakah perlu revisi
      const totalScore = evaluationScores.total || 0;
      const needsRevision =
        totalScore < 70 ||
        (evaluation?.generalFeedback &&
          evaluation.generalFeedback.toLowerCase().includes('revisi'));

      status = needsRevision ? 'needs_revision' : 'completed';
    } else {
      status = 'submitted';
    }
  } else if (isOverdue) {
    status = 'overdue';
  }

  // Cek apakah masih bisa mengumpulkan tugas
  const canSubmit =
    status === 'not_submitted' ||
    status === 'draft' ||
    (status === 'needs_revision' && assignment.allowResubmission) ||
    (status === 'submitted' && !isOverdue);

  // Cek jumlah submission
  const submissionCount = studentSubmissions.filter(
    (sub) => !sub.isDraft,
  ).length;
  const maxResubmissionsReached =
    assignment.allowResubmission &&
    assignment.maxResubmissions !== null &&
    submissionCount >= assignment.maxResubmissions;

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/student/assignments" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Tugas
          </Link>
        </Button>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-2">
              {status === 'not_submitted' && (
                <Badge
                  variant="outline"
                  className="border-blue-200 bg-blue-50 text-blue-700"
                >
                  <Clock className="mr-1 h-3 w-3" />
                  Belum Dikerjakan
                </Badge>
              )}
              {status === 'draft' && (
                <Badge
                  variant="outline"
                  className="border-yellow-200 bg-yellow-50 text-yellow-700"
                >
                  <FileText className="mr-1 h-3 w-3" />
                  Draft Tersimpan
                </Badge>
              )}
              {status === 'submitted' && (
                <Badge
                  variant="outline"
                  className="border-blue-200 bg-blue-50 text-blue-700"
                >
                  <Clock className="mr-1 h-3 w-3" />
                  Menunggu Penilaian
                </Badge>
              )}
              {status === 'completed' && (
                <Badge
                  variant="outline"
                  className="border-green-200 bg-green-50 text-green-700"
                >
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Selesai
                </Badge>
              )}
              {status === 'needs_revision' && (
                <Badge
                  variant="outline"
                  className="border-orange-200 bg-orange-50 text-orange-700"
                >
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  Perlu Revisi
                </Badge>
              )}
              {status === 'overdue' && (
                <Badge variant="destructive">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  Terlambat
                </Badge>
              )}

              {assignment.isChallenge && (
                <Badge variant="secondary">
                  <Award className="mr-1 h-3 w-3" />
                  Tantangan
                </Badge>
              )}
            </div>

            <h1 className="text-2xl font-bold md:text-3xl">
              {assignment.title}
            </h1>

            <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
              {dueDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {isOverdue ? 'Tenggat: ' : 'Tenggat: '}
                    <span
                      className={
                        isOverdue ? 'text-destructive font-medium' : ''
                      }
                    >
                      {format(dueDate, 'd MMMM yyyy', {
                        locale: id,
                      })}
                    </span>{' '}
                    (
                    {formatDistanceToNow(dueDate, {
                      addSuffix: true,
                      locale: id,
                    })}
                    )
                  </span>
                </div>
              )}

              {teacher && (
                <div className="flex items-center gap-1">
                  <span>Diberikan oleh: {teacher.name}</span>
                </div>
              )}

              {assignment.allowResubmission && (
                <div className="flex items-center gap-1">
                  <span>
                    Pengumpulan ulang:
                    {assignment.maxResubmissions
                      ? ` Maksimal ${assignment.maxResubmissions}x`
                      : ' Diperbolehkan'}
                    {submissionCount > 0 &&
                      ` (${submissionCount}/${
                        assignment.maxResubmissions || '∞'
                      })`}
                  </span>
                </div>
              )}
            </div>

            {activity && (
              <div className="flex flex-wrap gap-2">
                {activity.skill && (
                  <Badge variant="outline" className="capitalize">
                    {activity.skill}
                  </Badge>
                )}
                {activity.hotsType && (
                  <Badge variant="secondary" className="capitalize">
                    <Brain className="mr-1 h-3 w-3" />
                    {activity.hotsType}
                  </Badge>
                )}
                {activity.difficulty && (
                  <Badge
                    className={cn(
                      'capitalize',
                      activity.difficulty <= 2
                        ? 'bg-green-500'
                        : activity.difficulty <= 4
                          ? 'bg-yellow-500'
                          : 'bg-red-500',
                      'text-white',
                    )}
                  >
                    <BarChart3 className="mr-1 h-3 w-3" />
                    Level {activity.difficulty}
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium">Aksi</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {activity && (
                  <Button variant="outline" asChild className="w-full">
                    <Link href={`/student/activities/${activity.id}`}>
                      <FileText className="mr-2 h-4 w-4" />
                      Lihat Aktivitas
                    </Link>
                  </Button>
                )}

                <Button variant="outline" asChild className="w-full">
                  <Link
                    href={`/student/discussions?assignmentId=${assignmentId}`}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Diskusi
                  </Link>
                </Button>

                {canSubmit && !maxResubmissionsReached && (
                  <Button asChild className="w-full">
                    <a href="#submission-form">
                      <FileUp className="mr-2 h-4 w-4" />
                      {latestSubmission?.isDraft
                        ? 'Lanjutkan Pengerjaan'
                        : 'Kumpulkan Tugas'}
                    </a>
                  </Button>
                )}

                {maxResubmissionsReached && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTitle>Batas Pengumpulan Tercapai</AlertTitle>
                    <AlertDescription>
                      Anda telah mencapai batas maksimal pengumpulan ulang untuk
                      tugas ini.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="instructions" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="instructions">
                <PenTool className="mr-2 h-4 w-4" />
                Instruksi
              </TabsTrigger>
              <TabsTrigger value="rubric">
                <Clipboard className="mr-2 h-4 w-4" />
                Rubrik Penilaian
              </TabsTrigger>
            </TabsList>

            <TabsContent value="instructions" className="space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-medium">Instruksi Tugas</h3>
                </CardHeader>
                <CardContent>
                  {assignment.instructions ? (
                    <div className="prose prose-sm max-w-none">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: assignment.instructions,
                        }}
                      />
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Tidak ada instruksi khusus untuk tugas ini.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rubric">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-medium">Rubrik Penilaian</h3>
                  {rubric && (
                    <p className="text-muted-foreground text-sm">
                      {rubric.name} - Nilai Maksimal: {rubric.maxScore}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  {Object.keys(rubricCriteria).length > 0 ? (
                    <div className="space-y-6">
                      {Object.entries(rubricCriteria).map(
                        ([key, criteria]: [string, any]) => {
                          if (!criteria || typeof criteria !== 'object')
                            return null;

                          const name = criteria.name || key;
                          const description = criteria.description || '';
                          const weight = criteria.weight || 0;
                          const levels = criteria.levels || {};

                          return (
                            <div key={key} className="space-y-2">
                              <div className="flex justify-between">
                                <h4 className="font-medium">{name}</h4>
                                <span className="text-muted-foreground text-sm">
                                  Bobot: {weight}%
                                </span>
                              </div>

                              {description && (
                                <p className="text-muted-foreground text-sm">
                                  {description}
                                </p>
                              )}

                              <div className="rounded-md border">
                                <table className="w-full text-sm">
                                  <thead className="bg-muted/50">
                                    <tr>
                                      <th className="p-2 text-left">Level</th>
                                      <th className="p-2 text-left">
                                        Deskripsi
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {Object.entries(levels).map(
                                      ([level, levelInfo]: [string, any]) => {
                                        // Tangani berbagai format level info
                                        let levelDescription = '';

                                        if (typeof levelInfo === 'string') {
                                          levelDescription = levelInfo;
                                        } else if (
                                          typeof levelInfo === 'object' &&
                                          levelInfo !== null
                                        ) {
                                          levelDescription =
                                            levelInfo.description || '';
                                        }

                                        return (
                                          <tr key={level} className="border-t">
                                            <td className="p-2 font-medium">
                                              {level}
                                            </td>
                                            <td className="p-2">
                                              {levelDescription}
                                            </td>
                                          </tr>
                                        );
                                      },
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Tidak ada kriteria penilaian yang ditentukan.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {hasEvaluation && (
            <>
              <Separator className="my-8" />

              <SubmissionResult
                evaluation={evaluation}
                rubric={rubric}
                rubricCriteria={rubricCriteria}
                evaluationScores={evaluationScores}
                evaluationFeedback={evaluationFeedback}
              />
            </>
          )}

          {canSubmit && !maxResubmissionsReached && (
            <>
              <Separator className="my-8" id="submission-form" />

              <SubmissionForm
                assignmentId={assignmentId}
                studentId={session.user.id}
                existingSubmission={latestSubmission}
                submissionChecklist={submissionChecklist}
                isRevision={status === 'needs_revision'}
                version={
                  latestSubmission
                    ? (latestSubmission.version || 1) +
                      (latestSubmission.isDraft ? 0 : 1)
                    : 1
                }
              />
            </>
          )}
        </div>

        <div className="space-y-6 lg:col-span-1">
          {latestSubmission && !latestSubmission.isDraft && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium">Riwayat Pengumpulan</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium">Status</div>
                  <div className="text-muted-foreground text-sm">
                    {status === 'submitted' && 'Menunggu Penilaian'}
                    {status === 'completed' && 'Selesai'}
                    {status === 'needs_revision' && 'Perlu Revisi'}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium">Tanggal Pengumpulan</div>
                  <div className="text-muted-foreground text-sm">
                    {latestSubmission.submittedAt
                      ? format(
                          new Date(latestSubmission.submittedAt),
                          'd MMMM yyyy, HH:mm',
                          { locale: id },
                        )
                      : 'Belum dikumpulkan'}
                  </div>
                </div>

                {latestSubmission.revisedAt && (
                  <div>
                    <div className="text-sm font-medium">Tanggal Revisi</div>
                    <div className="text-muted-foreground text-sm">
                      {format(
                        new Date(latestSubmission.revisedAt),
                        'd MMMM yyyy, HH:mm',
                        { locale: id },
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-sm font-medium">Versi</div>
                  <div className="text-muted-foreground text-sm">
                    {latestSubmission.version || 1}
                  </div>
                </div>

                {hasEvaluation && (
                  <div>
                    <div className="text-sm font-medium">Nilai</div>
                    <div className="text-sm font-semibold">
                      {evaluationScores.total || 0} / {rubric?.maxScore || 100}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {studentSubmissions.length > 1 && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium">Versi Sebelumnya</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {studentSubmissions.slice(1).map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium">
                          Versi {sub.version || 1}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {sub.submittedAt
                            ? format(
                                new Date(sub.submittedAt),
                                'd MMM yyyy, HH:mm',
                                { locale: id },
                              )
                            : 'Draft'}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/student/submissions/${sub.id}`}>
                          Lihat
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
