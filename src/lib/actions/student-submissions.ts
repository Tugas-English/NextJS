'use server';

import { db } from '@/db';
import { submissions } from '@/db/schema';
import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';
import { safeJsonStringify } from '@/lib/utils';
import { eq } from 'drizzle-orm';

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
