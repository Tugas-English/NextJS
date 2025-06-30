'use server';

import { db } from '@/db';
import { rubrics } from '@/db/schema';
import { nanoid } from 'nanoid';
import { revalidatePath, unstable_cache as cache } from 'next/cache';
import { getServerSession } from '../session';

import { and, desc, eq, ilike, sql } from 'drizzle-orm';
import { RubricFormValues } from '../schemas/rubrics';

const CACHE_TAGS = {
  RUBRICS: 'rubrics',
  RUBRIC_DETAIL: 'rubric-detail',
  USER_RUBRICS: 'user-rubrics',
} as const;

const getCacheKey = {
  rubrics: (options: GetRubricsOptions) => `rubrics-${JSON.stringify(options)}`,
  rubricDetail: (id: string) => `rubric-${id}`,
  userRubrics: (userId: string) => `user-rubrics-${userId}`,
};

// Helper function untuk transformasi criteria
const transformCriteria = (criteria: RubricFormValues['criteria']) => {
  return criteria.reduce((acc, criterion) => {
    const levels = criterion.levels.reduce((levelAcc, level) => {
      return {
        ...levelAcc,
        [level.value]: {
          description: level.description,
          score: level.score,
        },
      };
    }, {});

    return {
      ...acc,
      [criterion.name.toLowerCase().replace(/ /g, '_')]: {
        name: criterion.name,
        description: criterion.description,
        weight: criterion.weight,
        levels,
      },
    };
  }, {});
};

export interface GetRubricsOptions {
  page?: number;
  perPage?: number;
  search?: string;
  createdBy?: string;
  isDefault?: boolean;
  includePublic?: boolean;
}

export async function createRubric(data: RubricFormValues) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return { error: 'Anda harus login untuk membuat rubrik' };
    }

    const id = nanoid();
    const criteriaObject = transformCriteria(data.criteria);

    await db.insert(rubrics).values({
      id,
      name: data.name,
      description: data.description,
      criteria: criteriaObject,
      maxScore: data.maxScore,
      isDefault: data.isDefault,
      createdBy: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath('/teacher/rubrics');
    return { rubric: { id }, success: true };
  } catch (error) {
    console.error('Error creating rubric:', error);
    return { error: 'Gagal membuat rubrik. Silakan coba lagi.' };
  }
}

export async function getRubrics(options: GetRubricsOptions = {}) {
  const cachedGetRubrics = cache(
    async (opts: GetRubricsOptions) => {
      try {
        const {
          page = 1,
          perPage = 10,
          search,
          createdBy,
          isDefault,
          includePublic = false,
        } = opts;

        const offset = (page - 1) * perPage;
        const whereConditions = [];

        if (search) {
          whereConditions.push(ilike(rubrics.name, `%${search}%`));
        }

        if (createdBy) {
          whereConditions.push(eq(rubrics.createdBy, createdBy));
        }

        if (isDefault !== undefined) {
          whereConditions.push(eq(rubrics.isDefault, isDefault));
        }

        if (!includePublic && !createdBy) {
          return {
            data: [],
            pageCount: 0,
            totalCount: 0,
            error: null,
          };
        }

        const baseQuery =
          whereConditions.length > 0 ? and(...whereConditions) : undefined;

        const countResult = await db
          .select({ count: sql<number>`count(*)` })
          .from(rubrics)
          .where(baseQuery);

        const count = Number(countResult[0]?.count || 0);

        if (count === 0) {
          return {
            data: [],
            pageCount: 0,
            totalCount: 0,
            error: null,
          };
        }

        const result = await db
          .select()
          .from(rubrics)
          .where(baseQuery)
          .orderBy(desc(rubrics.createdAt))
          .limit(perPage)
          .offset(offset);

        return {
          data: result,
          pageCount: Math.ceil(count / perPage),
          totalCount: count,
          error: null,
        };
      } catch (error) {
        console.error('Error fetching rubrics:', error);
        return {
          data: [],
          pageCount: 0,
          totalCount: 0,
          error:
            error instanceof Error ? error.message : 'Gagal mengambil rubrik',
        };
      }
    },
    [getCacheKey.rubrics(options)],
    {
      tags: [CACHE_TAGS.RUBRICS],
      revalidate: 180, // 3 minutes
    },
  );

  return cachedGetRubrics(options);
}

export async function getRubricById(id: string) {
  const cachedGetRubric = cache(
    async (rubricId: string) => {
      try {
        const [rubric] = await db
          .select()
          .from(rubrics)
          .where(eq(rubrics.id, rubricId))
          .limit(1);

        return rubric || null;
      } catch (error) {
        console.error('Error fetching rubric by ID:', error);
        return null;
      }
    },
    [getCacheKey.rubricDetail(id)],
    {
      tags: [CACHE_TAGS.RUBRIC_DETAIL, `${CACHE_TAGS.RUBRIC_DETAIL}-${id}`],
      revalidate: 300, // 5 minutes
    },
  );

  return cachedGetRubric(id);
}

export async function updateRubric(
  id: string,
  data: Partial<RubricFormValues>,
  userId?: string,
) {
  try {
    const existingRubric = await db
      .select()
      .from(rubrics)
      .where(eq(rubrics.id, id))
      .limit(1);

    if (existingRubric.length === 0) {
      return {
        rubric: null,
        error: 'Rubrik tidak ditemukan',
      };
    }

    if (userId && existingRubric[0].createdBy !== userId) {
      return {
        rubric: null,
        error: 'Anda tidak memiliki izin untuk mengubah rubrik ini',
      };
    }

    const updateData: Partial<typeof rubrics.$inferInsert> = {
      updatedAt: new Date(),
      ...data,
    };

    if (data.criteria) {
      updateData.criteria = transformCriteria(data.criteria);
    }

    const [updatedRubric] = await db
      .update(rubrics)
      .set(updateData)
      .where(eq(rubrics.id, id))
      .returning();

    revalidatePath('/teacher/rubrics');
    return { rubric: updatedRubric, error: null };
  } catch (error) {
    console.error('Error updating rubric:', error);
    return {
      rubric: null,
      error:
        error instanceof Error ? error.message : 'Gagal memperbarui rubrik',
    };
  }
}

export async function toggleRubricDefaultStatus(id: string, userId: string) {
  try {
    const [rubric] = await db
      .select({
        isDefault: rubrics.isDefault,
        createdBy: rubrics.createdBy,
      })
      .from(rubrics)
      .where(eq(rubrics.id, id))
      .limit(1);

    if (!rubric) {
      return {
        rubric: null,
        error: 'Rubrik tidak ditemukan',
      };
    }

    if (rubric.createdBy !== userId) {
      return {
        rubric: null,
        error:
          'Anda tidak memiliki izin untuk mengubah status default rubrik ini',
      };
    }

    if (!rubric.isDefault) {
      await db
        .update(rubrics)
        .set({ isDefault: false })
        .where(and(eq(rubrics.createdBy, userId), eq(rubrics.isDefault, true)));
    }

    const [updatedRubric] = await db
      .update(rubrics)
      .set({
        isDefault: !rubric.isDefault,
      })
      .where(eq(rubrics.id, id))
      .returning();

    revalidatePath('/teacher/rubrics');
    return { rubric: updatedRubric, error: null };
  } catch (error) {
    console.error('Error toggling rubric default status:', error);
    return {
      rubric: null,
      error:
        error instanceof Error
          ? error.message
          : 'Gagal mengubah status default rubrik',
    };
  }
}

export async function deleteRubrics({
  ids,
  userId,
}: {
  ids: string[];
  userId?: string;
}) {
  try {
    if (!ids.length) return { error: 'Tidak ada rubrik yang dipilih' };

    const whereClause = userId
      ? and(sql`${rubrics.id} IN ${ids}`, eq(rubrics.createdBy, userId))
      : sql`${rubrics.id} IN ${ids}`;

    const result = await db
      .delete(rubrics)
      .where(whereClause)
      .returning({ id: rubrics.id });

    revalidatePath('/teacher/rubrics');
    return {
      success: true,
      deletedCount: result.length,
    };
  } catch (error) {
    console.error('Error deleting rubrics:', error);
    return { error: 'Gagal menghapus rubrik' };
  }
}

export async function getUserDefaultRubric(userId: string) {
  const cachedGetDefaultRubric = cache(
    async (id: string) => {
      try {
        const [rubric] = await db
          .select()
          .from(rubrics)
          .where(and(eq(rubrics.createdBy, id), eq(rubrics.isDefault, true)))
          .limit(1);

        return rubric || null;
      } catch (error) {
        console.error('Error fetching user default rubric:', error);
        return null;
      }
    },
    [`user-default-rubric-${userId}`],
    {
      tags: [CACHE_TAGS.USER_RUBRICS, `${CACHE_TAGS.USER_RUBRICS}-${userId}`],
      revalidate: 300, // 5 minutes
    },
  );

  return cachedGetDefaultRubric(userId);
}

export async function revalidateRubricData() {
  try {
    revalidatePath('/teacher/rubrics');
    return { success: true, error: null };
  } catch (error) {
    console.error('Error revalidating rubric data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal memperbarui cache',
    };
  }
}
