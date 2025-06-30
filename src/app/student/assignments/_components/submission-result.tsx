import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { CheckCircle, AlertTriangle, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubmissionResultProps {
  evaluation: any;
  rubric: any;
  rubricCriteria: Record<string, any>;
  evaluationScores: Record<string, any>;
  evaluationFeedback: Record<string, any>;
}

export default function SubmissionResult({
  evaluation,
  rubric,
  rubricCriteria,
  evaluationScores,
  evaluationFeedback,
}: SubmissionResultProps) {
  if (!evaluation) return null;

  // Ambil skor total dengan aman
  let totalScore = 0;
  if (
    typeof evaluationScores === 'object' &&
    evaluationScores !== null &&
    'total' in evaluationScores
  ) {
    totalScore = Number(evaluationScores.total) || 0;
  }

  const maxScore = Number(rubric?.maxScore) || 100;
  const scorePercentage = (totalScore / maxScore) * 100;

  // Tentukan status berdasarkan skor
  let statusColor = 'bg-green-500';
  let statusText = 'Lulus';

  if (totalScore < 70) {
    statusColor = 'bg-red-500';
    statusText = 'Perlu Perbaikan';
  }

  // Cek apakah ada feedback yang meminta revisi
  const generalFeedback = evaluation.generalFeedback || '';
  const needsRevision =
    typeof generalFeedback === 'string' &&
    generalFeedback.toLowerCase().includes('revisi');

  if (needsRevision) {
    statusColor = 'bg-orange-500';
    statusText = 'Perlu Revisi';
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Hasil Penilaian</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">Ringkasan Nilai</h3>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold">
                {totalScore} / {maxScore}
              </div>
              <div className="mt-2">
                <Badge className={cn('capitalize', statusColor)}>
                  <div className="flex items-center">
                    {statusText === 'Lulus' && (
                      <CheckCircle className="mr-1 h-3 w-3" />
                    )}
                    {statusText !== 'Lulus' && (
                      <AlertTriangle className="mr-1 h-3 w-3" />
                    )}
                    {statusText}
                  </div>
                </Badge>
              </div>
              <div className="mt-4 w-full">
                <Progress value={scorePercentage} className="h-2" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-muted-foreground text-sm">
                Dinilai pada:{' '}
                {evaluation.evaluatedAt
                  ? format(
                      new Date(evaluation.evaluatedAt),
                      'd MMMM yyyy, HH:mm',
                      { locale: id },
                    )
                  : 'Tidak diketahui'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">Feedback Umum</h3>
          </CardHeader>
          <CardContent>
            {generalFeedback ? (
              <div className="prose prose-sm max-w-none">
                <p>{generalFeedback}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Tidak ada feedback umum yang diberikan.
              </p>
            )}

            {needsRevision && (
              <Alert className="mt-4 border-orange-200 bg-orange-50 text-orange-800">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Perlu Revisi</AlertTitle>
                <AlertDescription>
                  Tugas ini memerlukan revisi. Silakan perhatikan feedback yang
                  diberikan dan kumpulkan kembali tugas yang sudah direvisi.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">Kriteria Penilaian</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(rubricCriteria).map(([key, criteria]) => {
              if (!criteria || typeof criteria !== 'object') return null;

              // Ambil nilai kriteria dengan aman
              const name = criteria.name || key;
              const description = criteria.description || '';
              const weight = criteria.weight || 0;

              // Ambil skor kriteria dari evaluasi jika ada
              const score = evaluationScores[key] || 0;
              const feedback = evaluationFeedback[key] || '';

              return (
                <div key={key} className="overflow-hidden rounded-md border">
                  <div className="bg-muted/30 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{name}</h4>
                        <p className="text-muted-foreground mt-1 text-sm">
                          {description}
                        </p>
                      </div>
                      <Badge>Bobot: {weight}%</Badge>
                    </div>
                  </div>

                  {score > 0 && (
                    <div className="border-t p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          Nilai: Level {score}
                        </span>
                        <span className="text-sm">
                          {((weight / 100) * score * maxScore) / 4} poin
                        </span>
                      </div>

                      {feedback && (
                        <div className="bg-muted mt-3 rounded-md p-3 text-sm">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            <p>{feedback}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
