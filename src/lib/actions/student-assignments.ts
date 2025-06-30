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
import { count, eq, and, or, lt, gt, sql, desc, isNull } from 'drizzle-orm';
import { getServerSession } from '../session';

export type GetStudentAssignmentsOptions = {
  page?: number;
  perPage?: number;
  status?: string; // 'active', 'completed', 'revision'
  skill?: string | string[];
  hotsType?: string | string[];
  difficulty?: number | number[];
  search?: string;
};

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

    const {
      page = 1,
      perPage = 10,
      status = 'active',
      skill,
      hotsType,
      difficulty,
      search,
    } = options;

    const offset = (page - 1) * perPage;
    const limit = perPage;

    // Subquery untuk mendapatkan submission terbaru dari setiap tugas
    const latestSubmissions = db
      .select({
        assignmentId: submissions.assignmentId,
        submissionId: submissions.id,
        version: submissions.version,
        submittedAt: submissions.submittedAt,
        isDraft: submissions.isDraft,
      })
      .from(submissions)
      .where(eq(submissions.studentId, session.user.id))
      .groupBy(submissions.assignmentId)
      .orderBy(desc(submissions.submittedAt));

    // Query utama
    const query = db
      .select({
        assignment: assignments,
        activity: activities,
        submission: {
          id: submissions.id,
          version: submissions.version,
          submittedAt: submissions.submittedAt,
          isDraft: submissions.isDraft,
        },
        evaluation: {
          id: evaluations.id,
          scores: evaluations.scores,
          generalFeedback: evaluations.generalFeedback,
          evaluatedAt: evaluations.evaluatedAt,
        },
        rubric: {
          id: rubrics.id,
          name: rubrics.name,
          maxScore: rubrics.maxScore,
        },
        teacher: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      })
      .from(assignments)
      .leftJoin(activities, eq(assignments.activityId, activities.id))
      .leftJoin(
        submissions,
        and(
          eq(submissions.assignmentId, assignments.id),
          eq(submissions.studentId, session.user.id),
        ),
      )
      .leftJoin(evaluations, eq(evaluations.submissionId, submissions.id))
      .leftJoin(rubrics, eq(assignments.rubricId, rubrics.id))
      .leftJoin(user, eq(assignments.assignedBy, user.id))
      .where(eq(assignments.isPublished, true));

    // Filter berdasarkan status
    let statusFilter = {};
    if (status === 'active') {
      // Tugas aktif adalah yang belum dikumpulkan atau sudah dikumpulkan tapi belum dinilai
      statusFilter = {
        OR: [
          { submission: { is: null } },
          {
            AND: [
              { submission: { isNot: null } },
              { evaluation: { is: null } },
              { submission: { isDraft: false } },
            ],
          },
          {
            AND: [
              { submission: { isNot: null } },
              { submission: { isDraft: true } },
            ],
          },
        ],
      };
    } else if (status === 'completed') {
      // Tugas selesai adalah yang sudah dinilai dan tidak perlu revisi
      statusFilter = {
        AND: [
          { submission: { isNot: null } },
          { evaluation: { isNot: null } },
          // Tambahkan kondisi untuk memastikan tidak perlu revisi jika ada
        ],
      };
    } else if (status === 'revision') {
      // Tugas yang perlu direvisi
      statusFilter = {
        AND: [
          { submission: { isNot: null } },
          { evaluation: { isNot: null } },
          // Tambahkan kondisi untuk mendeteksi perlu revisi
          // Misalnya berdasarkan feedback atau status khusus
        ],
      };
    }

    // Filter berdasarkan skill
    if (skill) {
      const skillArray = Array.isArray(skill) ? skill : [skill];
      query.where(sql`${activities.skill} IN ${skillArray}`);
    }

    // Filter berdasarkan hotsType
    if (hotsType) {
      const hotsTypeArray = Array.isArray(hotsType) ? hotsType : [hotsType];
      query.where(sql`${activities.hotsType} IN ${hotsTypeArray}`);
    }

    // Filter berdasarkan difficulty
    if (difficulty) {
      if (Array.isArray(difficulty) && difficulty.length === 2) {
        query.where(
          sql`${activities.difficulty} BETWEEN ${difficulty[0]} AND ${difficulty[1]}`,
        );
      } else {
        const difficultyValue = Array.isArray(difficulty)
          ? difficulty[0]
          : difficulty;
        query.where(eq(activities.difficulty, difficultyValue));
      }
    }

    // Filter berdasarkan search
    if (search) {
      query.where(
        or(
          sql`${assignments.title} ILIKE ${`%${search}%`}`,
          sql`${activities.title} ILIKE ${`%${search}%`}`,
        ),
      );
    }

    // Hitung total
    const countQuery = db
      .select({ count: count() })
      .from(assignments)
      .leftJoin(activities, eq(assignments.activityId, activities.id))
      .leftJoin(
        submissions,
        and(
          eq(submissions.assignmentId, assignments.id),
          eq(submissions.studentId, session.user.id),
        ),
      )
      .leftJoin(evaluations, eq(evaluations.submissionId, submissions.id))
      .where(eq(assignments.isPublished, true));

    // Terapkan filter yang sama dengan query utama
    if (status === 'active') {
      countQuery.where(
        or(
          isNull(submissions.id),
          eq(submissions.isDraft, true),
          and(eq(submissions.isDraft, false), isNull(evaluations.id)),
        ),
      );

      countQuery.where(
        or(isNull(assignments.dueDate), gt(assignments.dueDate, new Date())),
      );
    } else if (status === 'completed') {
      countQuery.where(
        and(eq(submissions.isDraft, false), sql`${evaluations.id} IS NOT NULL`),
      );
    } else if (status === 'revision') {
      countQuery.where(
        and(
          eq(submissions.isDraft, false),
          sql`${evaluations.id} IS NOT NULL`,
          or(
            lt(sql`(${evaluations.scores}->>'total')::numeric`, 70),
            sql`${evaluations.generalFeedback} LIKE '%revisi%'`,
          ),
        ),
      );
    }

    if (skill) {
      const skillArray = Array.isArray(skill) ? skill : [skill];
      countQuery.where(sql`${activities.skill} IN ${skillArray}`);
    }

    if (hotsType) {
      const hotsTypeArray = Array.isArray(hotsType) ? hotsType : [hotsType];
      countQuery.where(sql`${activities.hotsType} IN ${hotsTypeArray}`);
    }

    if (difficulty) {
      if (Array.isArray(difficulty) && difficulty.length === 2) {
        countQuery.where(
          sql`${activities.difficulty} BETWEEN ${difficulty[0]} AND ${difficulty[1]}`,
        );
      } else {
        const difficultyValue = Array.isArray(difficulty)
          ? difficulty[0]
          : difficulty;
        countQuery.where(eq(activities.difficulty, difficultyValue));
      }
    }

    if (search) {
      countQuery.where(
        or(
          sql`${assignments.title} ILIKE ${`%${search}%`}`,
          sql`${activities.title} ILIKE ${`%${search}%`}`,
        ),
      );
    }

    const [assignmentsResult, countResult] = await Promise.all([
      query
        .orderBy(
          sql`CASE WHEN ${assignments.dueDate} IS NULL THEN 1 ELSE 0 END`,
          assignments.dueDate,
          desc(assignments.createdAt),
        )
        .limit(limit)
        .offset(offset),
      countQuery,
    ]);

    const totalCount = await countQuery.execute().then((res) => res.length);
    const pageCount = Math.ceil(totalCount / perPage);

    return {
      data: assignmentsResult,
      pageCount,
      totalCount,
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

    // Ambil semua skill dari tugas yang diberikan kepada siswa
    const skillsQuery = await db
      .select({
        skill: activities.skill,
        count: count(),
      })
      .from(assignments)
      .leftJoin(activities, eq(assignments.activityId, activities.id))
      .where(eq(assignments.isPublished, true))
      .groupBy(activities.skill);

    const skills = skillsQuery.reduce(
      (acc, { skill, count }) => ({
        ...acc,
        [skill || 'undefined']: count,
      }),
      {} as Record<string, number>,
    );

    // Ambil semua hotsType dari tugas yang diberikan kepada siswa
    const hotsTypesQuery = await db
      .select({
        hotsType: activities.hotsType,
        count: count(),
      })
      .from(assignments)
      .leftJoin(activities, eq(assignments.activityId, activities.id))
      .where(eq(assignments.isPublished, true))
      .groupBy(activities.hotsType);

    const hotsTypes = hotsTypesQuery.reduce(
      (acc, { hotsType, count }) => ({
        ...acc,
        [hotsType || 'undefined']: count,
      }),
      {} as Record<string, number>,
    );

    // Ambil rentang difficulty
    const minResult = await db
      .select({
        min: sql<number>`MIN(${activities.difficulty})`,
      })
      .from(assignments)
      .leftJoin(activities, eq(assignments.activityId, activities.id))
      .where(eq(assignments.isPublished, true));

    const maxResult = await db
      .select({
        max: sql<number>`MAX(${activities.difficulty})`,
      })
      .from(assignments)
      .leftJoin(activities, eq(assignments.activityId, activities.id))
      .where(eq(assignments.isPublished, true));

    const difficultyRange = {
      min: minResult[0].min ?? 1,
      max: maxResult[0].max ?? 5,
    };

    return {
      skills,
      hotsTypes,
      difficultyRange,
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
