'use server';

import { db } from '@/db';
import {
  assignments,
  activities,
  submissions,
  evaluations,
  rubrics,
  user,
} from '@/db/schema';
import { eq, and, desc, asc } from 'drizzle-orm';
import { getServerSession } from '../session';
import { safelyParseJSONCriteria } from '@/utils';
import { isPast } from 'date-fns';
import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';
import { safeJsonStringify } from '@/lib/utils';

export type GetStudentAssignmentsOptions = {
  page?: number;
  perPage?: number;
  status?: string; // 'active', 'completed', 'revision'
  skill?: string | string[];
  hotsType?: string | string[];
  difficulty?: number | number[];
  search?: string;
};
interface EvaluationScores {
  [key: string]: any;
  total?: number;
}

export type AssignmentDetail = {
  assignment: typeof assignments.$inferSelect;
  activity: typeof activities.$inferSelect | null;
  rubric: typeof rubrics.$inferSelect | null;
  teacher: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
  studentSubmissions: (typeof submissions.$inferSelect)[];
  latestSubmission: typeof submissions.$inferSelect | null;
  evaluation: typeof evaluations.$inferSelect | null;
  rubricCriteria: Record<string, any>;
  evaluationScores: EvaluationScores;
  evaluationFeedback: Record<string, any>;
  submissionChecklist: any[];
  status:
    | 'not_submitted'
    | 'draft'
    | 'submitted'
    | 'completed'
    | 'needs_revision'
    | 'overdue';
  dueDate: Date | null;
  isOverdue: boolean;
  hasSubmission: boolean;
  isDraft: boolean | null;
  hasEvaluation: boolean;
  canSubmit: boolean;
  submissionCount: number;
  maxResubmissionsReached: boolean;
};

export async function getAssignmentDetail(
  assignmentId: string,
  userId: string,
): Promise<AssignmentDetail | null> {
  try {
    const assignment = await db.query.assignments.findFirst({
      where: and(
        eq(assignments.id, assignmentId),
        eq(assignments.isPublished, true),
      ),
    });

    if (!assignment) {
      return null;
    }

    let activity: typeof activities.$inferSelect | null = null;
    if (assignment.activityId) {
      activity =
        (await db.query.activities.findFirst({
          where: eq(activities.id, assignment.activityId),
        })) || null;
    }

    const rubric =
      (await db.query.rubrics.findFirst({
        where: eq(rubrics.id, assignment.rubricId),
      })) || null;

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

    const studentSubmissions = await db
      .select()
      .from(submissions)
      .where(
        and(
          eq(submissions.assignmentId, assignmentId),
          eq(submissions.studentId, userId),
        ),
      )
      .orderBy(desc(submissions.submittedAt));

    const latestSubmission = studentSubmissions[0] || null;

    const evaluation = latestSubmission
      ? await db
          .select()
          .from(evaluations)
          .where(eq(evaluations.submissionId, latestSubmission.id))
          .then((res) => res[0])
      : null;

    let rubricCriteria = {};
    if (rubric?.criteria) {
      try {
        rubricCriteria = safelyParseJSONCriteria(rubric.criteria);
      } catch (e) {
        console.error('Error parsing rubric criteria:', e);
      }
    }

    let evaluationScores: EvaluationScores = { total: 0 };
    if (evaluation?.scores) {
      try {
        const parsedScores = safelyParseJSONCriteria(evaluation.scores);
        evaluationScores = {
          ...parsedScores,
          total:
            typeof parsedScores.total === 'number' ? parsedScores.total : 0,
        };
      } catch (e) {
        console.error('Error parsing evaluation scores:', e);
      }
    }

    let evaluationFeedback = {};
    if (evaluation?.criteriaFeedback) {
      try {
        evaluationFeedback = safelyParseJSONCriteria(
          evaluation.criteriaFeedback,
        );
      } catch (e) {
        console.error('Error parsing evaluation feedback:', e);
      }
    }

    let submissionChecklist = [];
    if (latestSubmission?.checklist) {
      try {
        submissionChecklist = safelyParseJSONCriteria(
          latestSubmission.checklist,
          [],
        );
      } catch (e) {
        console.error('Error parsing submission checklist:', e);
      }
    }

    const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null;
    const isOverdue = dueDate ? isPast(dueDate) : false;
    const hasSubmission = !!latestSubmission;
    const isDraft = latestSubmission?.isDraft ?? null;
    const hasEvaluation = !!evaluation;

    let status = 'not_submitted' as AssignmentDetail['status'];
    if (hasSubmission) {
      if (isDraft) {
        status = 'draft';
      } else if (hasEvaluation) {
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

    const canSubmit =
      status === 'not_submitted' ||
      status === 'draft' ||
      (status === 'needs_revision' && assignment.allowResubmission) ||
      (status === 'submitted' && !isOverdue);

    const submissionCount = studentSubmissions.filter(
      (sub) => !sub.isDraft,
    ).length;

    const maxResubmissionsReached = !!(
      assignment.allowResubmission &&
      assignment.maxResubmissions !== null &&
      submissionCount >= assignment.maxResubmissions
    );

    return {
      assignment,
      activity,
      rubric,
      teacher,
      studentSubmissions,
      latestSubmission,
      evaluation,
      rubricCriteria,
      evaluationScores,
      evaluationFeedback,
      submissionChecklist,
      status,
      dueDate,
      isOverdue,
      hasSubmission,
      isDraft,
      hasEvaluation,
      canSubmit,
      submissionCount,
      maxResubmissionsReached,
    };
  } catch (error) {
    console.error('Error fetching assignment detail:', error);
    return null;
  }
}

export async function getStudentAssignments(
  options: GetStudentAssignmentsOptions = {},
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return {
        data: [],
        pageCount: 0,
        totalCount: 0,
        error: 'Anda harus login untuk melihat tugas',
      };
    }

    return {
      data: [],
      pageCount: 0,
      totalCount: 0,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching student assignments:', error);
    return {
      data: [],
      pageCount: 0,
      totalCount: 0,
      error: 'Gagal memuat data tugas',
    };
  }
}

export async function getAssignmentFilters() {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return {
        skills: {},
        hotsTypes: {},
        difficultyRange: { min: 1, max: 5 },
      };
    }

    return {
      skills: {},
      hotsTypes: {},
      difficultyRange: { min: 1, max: 5 },
    };
  } catch (error) {
    console.error('Error fetching assignment filters:', error);
    return {
      skills: {},
      hotsTypes: {},
      difficultyRange: { min: 1, max: 5 },
    };
  }
}

interface SubmitAssignmentParams {
  assignmentId: string;
  studentId: string;
  textResponse?: string;
  audioUrl?: string;
  videoUrl?: string;
  documentUrls?: string[];
  checklist?: any[];
  isDraft?: boolean;
  version?: number;
  submissionId?: string;
}

export async function submitAssignment({
  assignmentId,
  studentId,
  textResponse,
  audioUrl,
  videoUrl,
  documentUrls = [],
  checklist = [],
  isDraft = false,
  version = 1,
  submissionId,
}: SubmitAssignmentParams) {
  try {
    if (!isDraft && version > 1) {
      const assignment = await db.query.assignments.findFirst({
        where: eq(assignments.id, assignmentId),
      });

      if (!assignment) {
        return { error: 'Tugas tidak ditemukan' };
      }

      if (!assignment.allowResubmission) {
        return {
          error: 'Pengumpulan ulang tidak diperbolehkan untuk tugas ini',
        };
      }

      const maxResubmissions = assignment.maxResubmissions || 3;

      if (version > maxResubmissions + 1) {
        return {
          error: `Anda telah mencapai batas maksimal pengumpulan ulang (${maxResubmissions}x)`,
        };
      }
    }

    const validDocumentUrls = Array.isArray(documentUrls) ? documentUrls : [];

    const filteredDocumentUrls = validDocumentUrls.filter(
      (url) => typeof url === 'string' && url.trim() !== '',
    );

    const validChecklist = Array.isArray(checklist) ? checklist : [];

    const submissionData = {
      assignmentId,
      studentId,
      version,
      textResponse: textResponse || null,
      audioUrl: audioUrl || null,
      videoUrl: videoUrl || null,
      documentUrls: safeJsonStringify(filteredDocumentUrls, '[]'),
      checklist: safeJsonStringify(validChecklist, '[]'),
      isDraft,
      submittedAt: isDraft ? null : new Date(),
      revisedAt: submissionId ? new Date() : null,
    };

    if (submissionId) {
      await db
        .update(submissions)
        .set(submissionData)
        .where(eq(submissions.id, submissionId));
    } else {
      await db.insert(submissions).values({
        id: nanoid(),
        ...submissionData,
        createdAt: new Date(),
      });
    }

    revalidatePath(`/student/assignments/${assignmentId}`);

    return { success: true };
  } catch (error) {
    console.error('Error submitting assignment:', error);
    return {
      error: 'Gagal mengumpulkan tugas. Silakan coba lagi.',
    };
  }
}

export async function getSubmissionHistory(
  assignmentId: string,
  studentId: string,
) {
  try {
    const history = await db.query.submissions.findMany({
      where: and(
        eq(submissions.assignmentId, assignmentId),
        eq(submissions.studentId, studentId),
      ),
      orderBy: [submissions.version],
    });

    return { history };
  } catch (error) {
    console.error('Error fetching submission history:', error);
    return { error: 'Gagal mendapatkan riwayat pengumpulan' };
  }
}
