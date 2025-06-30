import { db } from '@/db';
import {
  assignments,
  activities,
  rubrics,
  submissions,
  user,
  evaluations,
} from '@/db/schema';
import { eq } from 'drizzle-orm';
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
  Clock,
  FileText,
  Calendar,
  User,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { cn, safeJsonParse } from '@/lib/utils';
import Link from 'next/link';

import EvaluationForm from '../../../_components/evaluation-form';
import { RoleRestricted } from '@/components/restricted-access';

interface SubmissionDetailPageProps {
  params: Promise<{
    id: string;
    submissionId: string;
  }>;
}

export default async function SubmissionDetailPage({
  params,
}: SubmissionDetailPageProps) {
  const { id, submissionId } = await params;
  const session = await getServerSession();

  if (!session?.user) {
    return redirect('/login');
  }

  if (session.user.role !== 'teacher' && session.user.role !== 'admin') {
    return <RoleRestricted />;
  }

  const assignment = await db.query.assignments.findFirst({
    where: eq(assignments.id, id),
  });

  if (!assignment) {
    notFound();
  }

  const submission = await db.query.submissions.findFirst({
    where: eq(submissions.id, submissionId),
  });

  if (!submission) {
    notFound();
  }

  const activity = assignment.activityId
    ? await db.query.activities.findFirst({
        where: eq(activities.id, assignment.activityId),
      })
    : null;

  const rubric = await db.query.rubrics.findFirst({
    where: eq(rubrics.id, assignment.rubricId),
  });

  if (!rubric) {
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <AlertTitle>Rubrik Tidak Ditemukan</AlertTitle>
          <AlertDescription>
            Rubrik penilaian untuk tugas ini tidak ditemukan.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const student = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    })
    .from(user)
    .where(eq(user.id, submission.studentId))
    .then((res) => res[0]);

  if (!student) {
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <AlertTitle>Siswa Tidak Ditemukan</AlertTitle>
          <AlertDescription>Informasi siswa tidak ditemukan.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const existingEvaluation = await db.query.evaluations.findFirst({
    where: eq(evaluations.submissionId, submissionId),
  });

  const rubricCriteria = safeJsonParse(rubric.criteria as string, {});
  const submissionChecklist = safeJsonParse(submission.checklist as string, []);
  const documentUrls = safeJsonParse(submission.documentUrls as string, []);

  const evaluationScores = existingEvaluation?.scores
    ? safeJsonParse(existingEvaluation.scores as string, {})
    : {};

  const evaluationFeedback = existingEvaluation?.criteriaFeedback
    ? safeJsonParse(existingEvaluation.criteriaFeedback as string, {})
    : {};

  const submittedAt = submission.submittedAt
    ? new Date(submission.submittedAt)
    : null;
  const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null;
  const isLate = submittedAt && dueDate && submittedAt > dueDate;

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link
            href={`/teacher/assignments/${id}`}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Tugas
          </Link>
        </Button>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              {submission.isDraft ? (
                <Badge
                  variant="outline"
                  className="border-yellow-200 bg-yellow-50 text-yellow-700"
                >
                  Draft
                </Badge>
              ) : existingEvaluation ? (
                <Badge
                  variant="outline"
                  className="border-green-200 bg-green-50 text-green-700"
                >
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Sudah Dinilai
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="border-blue-200 bg-blue-50 text-blue-700"
                >
                  Menunggu Penilaian
                </Badge>
              )}

              {isLate && <Badge variant="destructive">Terlambat</Badge>}

              <Badge variant="outline">Versi {submission.version || 1}</Badge>
            </div>

            <h1 className="text-2xl font-bold md:text-3xl">
              {assignment.title}
            </h1>

            <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
              {submittedAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Dikumpulkan: </span>
                </div>
              )}

              {submission.revisedAt && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Direvisi: </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-md border p-2">
                <User className="text-muted-foreground h-4 w-4" />
                <span className="font-medium">{student.name}</span>
                <span className="text-muted-foreground text-sm">
                  {student.email}
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium">Informasi</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {activity && (
                  <div>
                    <div className="text-sm font-medium">Aktivitas Terkait</div>
                    <div className="text-sm">
                      <Link
                        href={`/teacher/activities/${activity.id}`}
                        className="text-primary hover:underline"
                      >
                        {activity.title}
                      </Link>
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-sm font-medium">Rubrik Penilaian</div>
                  <div className="text-sm">{rubric.name}</div>
                </div>

                <div>
                  <div className="text-sm font-medium">Nilai Maksimal</div>
                  <div className="text-sm">{rubric.maxScore}</div>
                </div>

                {existingEvaluation && (
                  <div>
                    <div className="text-sm font-medium">Nilai</div>
                    <div className="text-lg font-semibold">
                      {evaluationScores.total || 0} / {rubric.maxScore}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="submission" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="submission">
                <FileText className="mr-2 h-4 w-4" />
                Jawaban Siswa
              </TabsTrigger>
              <TabsTrigger value="checklist">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Checklist
              </TabsTrigger>
            </TabsList>

            <TabsContent value="submission" className="space-y-6">
              {submission.textResponse && (
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-medium">Jawaban Teks</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap">
                        {submission.textResponse}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {submission.audioUrl && (
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-medium">Audio</h3>
                  </CardHeader>
                  <CardContent>
                    <audio controls className="w-full">
                      <source src={submission.audioUrl} />
                      Browser Anda tidak mendukung pemutaran audio.
                    </audio>

                    <div className="mt-2">
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={submission.audioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Buka di Tab Baru
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {submission.videoUrl && (
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-medium">Video</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="relative aspect-video overflow-hidden rounded-md">
                      {submission.videoUrl.includes('youtube') ||
                      submission.videoUrl.includes('youtu.be') ? (
                        <iframe
                          width="100%"
                          height="100%"
                          src={submission.videoUrl.replace(
                            'watch?v=',
                            'embed/',
                          )}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0"
                        ></iframe>
                      ) : (
                        <video controls className="h-full w-full">
                          <source src={submission.videoUrl} />
                          Browser Anda tidak mendukung pemutaran video.
                        </video>
                      )}
                    </div>

                    <div className="mt-2">
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={submission.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Buka di Tab Baru
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {documentUrls.length > 0 && (
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-medium">Dokumen</h3>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {documentUrls.map((url: string, index: number) => (
                        <li key={index}>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="w-full justify-start"
                          >
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
                              <FileText className="h-4 w-4" />
                              <span>{`Dokumen ${index + 1}`}</span>
                              <ExternalLink className="ml-auto h-4 w-4" />
                            </a>
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="checklist">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-medium">Checklist Siswa</h3>
                </CardHeader>
                <CardContent>
                  {submissionChecklist.length > 0 ? (
                    <ul className="space-y-2">
                      {submissionChecklist.map((item: any, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <div
                            className={cn(
                              'flex h-4 w-4 items-center justify-center rounded-sm border',
                              item.checked
                                ? 'bg-primary border-primary text-primary-foreground'
                                : 'border-input',
                            )}
                          >
                            {item.checked && (
                              <CheckCircle2 className="h-3 w-3" />
                            )}
                          </div>
                          <span
                            className={
                              item.checked
                                ? 'font-medium'
                                : 'text-muted-foreground'
                            }
                          >
                            {item.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">
                      Tidak ada checklist yang diisi oleh siswa.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Separator className="my-8" />

          <EvaluationForm
            submissionId={submissionId}
            rubric={rubric}
            rubricCriteria={rubricCriteria}
            existingEvaluation={existingEvaluation}
            evaluationScores={evaluationScores}
            evaluationFeedback={evaluationFeedback}
            teacherId={session.user.id}
          />
        </div>

        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Panduan Penilaian</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Gunakan rubrik untuk menilai tugas siswa. Berikan skor untuk
                setiap kriteria dan tambahkan feedback yang konstruktif.
              </p>

              <div className="space-y-2 text-sm">
                <p className="font-medium">Tips Penilaian:</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Berikan feedback spesifik untuk setiap kriteria</li>
                  <li>Fokus pada aspek HOTS yang diterapkan siswa</li>
                  <li>Berikan saran perbaikan yang jelas</li>
                  <li>Apresiasi hal positif dari pekerjaan siswa</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Rubrik Penilaian</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm font-medium">{rubric.name}</div>
              <p className="text-muted-foreground text-sm">
                Nilai Maksimal: {rubric.maxScore}
              </p>

              <div className="space-y-4">
                {Object.entries(rubricCriteria).map(
                  ([key, criteria]: [string, any]) => (
                    <div key={key} className="border-t pt-4">
                      <div className="font-medium">{criteria.name}</div>
                      <div className="text-muted-foreground text-sm">
                        Bobot: {criteria.weight}%
                      </div>
                      {criteria.description && (
                        <div className="mt-1 text-sm">
                          {criteria.description}
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
