'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { saveEvaluation } from '@/lib/actions/teacher-evaluations';
import { toast } from 'sonner';

interface EvaluationFormProps {
  submissionId: string;
  rubric: any;
  rubricCriteria: Record<string, any>;
  existingEvaluation?: any;
  evaluationScores: Record<string, any>;
  evaluationFeedback: Record<string, any>;
  teacherId: string;
}

export default function EvaluationForm({
  submissionId,
  rubric,
  rubricCriteria,
  existingEvaluation,
  evaluationScores,
  evaluationFeedback,
  teacherId,
}: EvaluationFormProps) {
  const router = useRouter();

  const [scores, setScores] = useState<Record<string, number>>(() => {
    const initialScores: Record<string, number> = {};

    Object.keys(rubricCriteria).forEach((key) => {
      initialScores[key] = evaluationScores[key] || 0;
    });

    return initialScores;
  });

  const [feedback, setFeedback] = useState<Record<string, string>>(() => {
    const initialFeedback: Record<string, string> = {};

    Object.keys(rubricCriteria).forEach((key) => {
      initialFeedback[key] = evaluationFeedback[key] || '';
    });

    return initialFeedback;
  });

  const [generalFeedback, setGeneralFeedback] = useState<string>(
    existingEvaluation?.generalFeedback || '',
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateTotalScore = () => {
    let total = 0;

    Object.entries(rubricCriteria).forEach(([key, criteria]: [string, any]) => {
      const score = scores[key] || 0;
      const weight = criteria.weight || 0;
      const levels = criteria.levels || {};

      // Jika level memiliki skor spesifik, gunakan itu
      if (
        levels[score] &&
        typeof levels[score] === 'object' &&
        levels[score].score
      ) {
        total += levels[score].score;
      } else {
        // Jika tidak, hitung berdasarkan bobot dan nilai maksimum
        const maxLevel = Object.keys(levels).length;
        total += (weight / 100) * score * (rubric.maxScore / maxLevel);
      }
    });

    return Math.round(total);
  };

  // Handler untuk perubahan skor
  const handleScoreChange = (criteriaKey: string, value: number) => {
    setScores((prev) => ({
      ...prev,
      [criteriaKey]: value,
    }));
  };

  // Handler untuk perubahan feedback
  const handleFeedbackChange = (criteriaKey: string, value: string) => {
    setFeedback((prev) => ({
      ...prev,
      [criteriaKey]: value,
    }));
  };

  // Handler untuk submit
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Hitung total skor
      const totalScore = calculateTotalScore();

      // Buat objek skor final
      const finalScores = {
        ...scores,
        total: totalScore,
      };

      // Simpan evaluasi
      const result = await saveEvaluation({
        submissionId,
        evaluatorId: teacherId,
        rubricId: rubric.id,
        scores: finalScores,
        criteriaFeedback: feedback,
        generalFeedback,
        evaluationId: existingEvaluation?.id,
      });

      if (result.error) {
        toast.error('gagal menyimpan peneliania');
        return;
      }

      toast.success('peneliania berhasil disimpan');

      router.refresh();
    } catch (error) {
      console.error('Error saving evaluation:', error);
      toast.error('terjadi keselahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold">
          {existingEvaluation ? 'Edit Penilaian' : 'Beri Penilaian'}
        </h3>
        <p className="text-muted-foreground text-sm">
          Gunakan rubrik untuk menilai tugas siswa.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(rubricCriteria).map(
          ([key, criteria]: [string, any]) => {
            const levels = criteria.levels || {};

            return (
              <div key={key} className="space-y-4 border-b pb-6">
                <div>
                  <h4 className="font-medium">{criteria.name}</h4>
                  <p className="text-muted-foreground text-sm">
                    {criteria.description}
                  </p>
                  <p className="mt-1 text-sm">Bobot: {criteria.weight}%</p>
                </div>

                <div>
                  <Label>Skor</Label>
                  <RadioGroup
                    value={scores[key]?.toString() || '0'}
                    onValueChange={(value) =>
                      handleScoreChange(key, parseInt(value))
                    }
                    className="mt-2 space-y-2"
                  >
                    {Object.entries(levels).map(
                      ([level, levelInfo]: [string, any]) => {
                        // Tangani berbagai format level info
                        let levelDescription = '';
                        let levelScore = 0;

                        if (typeof levelInfo === 'string') {
                          levelDescription = levelInfo;
                        } else if (
                          typeof levelInfo === 'object' &&
                          levelInfo !== null
                        ) {
                          levelDescription = levelInfo.description || '';
                          levelScore = levelInfo.score || 0;
                        }

                        return (
                          <div
                            key={level}
                            className="flex items-start space-x-2"
                          >
                            <RadioGroupItem
                              value={level}
                              id={`${key}-level-${level}`}
                            />
                            <Label
                              htmlFor={`${key}-level-${level}`}
                              className="cursor-pointer font-normal"
                            >
                              <span className="font-medium">Level {level}</span>
                              {levelScore > 0 && (
                                <span className="text-muted-foreground ml-2">
                                  ({levelScore} poin)
                                </span>
                              )}
                              <p className="text-muted-foreground mt-0.5 text-sm">
                                {levelDescription}
                              </p>
                            </Label>
                          </div>
                        );
                      },
                    )}
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor={`feedback-${key}`}>
                    Feedback untuk Kriteria Ini
                  </Label>
                  <Textarea
                    id={`feedback-${key}`}
                    value={feedback[key] || ''}
                    onChange={(e) => handleFeedbackChange(key, e.target.value)}
                    placeholder="Berikan feedback spesifik untuk kriteria ini..."
                    className="mt-2"
                    rows={3}
                  />
                </div>
              </div>
            );
          },
        )}

        <div className="space-y-2">
          <Label htmlFor="general-feedback">Feedback Umum</Label>
          <Textarea
            id="general-feedback"
            value={generalFeedback}
            onChange={(e) => setGeneralFeedback(e.target.value)}
            placeholder="Berikan feedback umum untuk tugas ini..."
            rows={5}
          />
        </div>

        <div className="bg-muted/50 rounded-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Total Skor</h4>
              <p className="text-muted-foreground text-sm">
                Berdasarkan kriteria dan bobot penilaian
              </p>
            </div>
            <div className="text-2xl font-bold">
              {calculateTotalScore()} / {rubric.maxScore}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting
            ? 'Menyimpan...'
            : existingEvaluation
              ? 'Perbarui Penilaian'
              : 'Simpan Penilaian'}
        </Button>
      </CardFooter>
    </Card>
  );
}
