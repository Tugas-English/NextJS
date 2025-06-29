"use server";

import { db } from "@/db";
import { activities } from "@/db/schema";
import { ActivityFormValues } from "@/lib/schemas/activity";
import { and, desc, eq, gte, ilike, inArray, lte, sql } from "drizzle-orm";
import { unstable_cache as cache, revalidatePath } from "next/cache";

const CACHE_TAGS = {
    ACTIVITIES: "activities",
    ACTIVITY_COUNTS: "activity-counts",
    ACTIVITY_DETAIL: "activity-detail",
} as const;

const getCacheKey = {
    activities: (options: GetActivitiesOptions) =>
        `activities-${JSON.stringify(options)}`,
    activityDetail: (id: string) => `activity-${id}`,
    skillCounts: () => "activity-skill-counts",
    hotsTypeCounts: () => "activity-hots-type-counts",
    difficultyRange: () => "activity-difficulty-range",
};

export async function createActivity(data: ActivityFormValues, userId: string) {
    try {
        const id = crypto.randomUUID();

        const [newActivity] = await db
            .insert(activities)
            .values({
                id,
                title: data.title,
                description: data.description,
                skill: data.skill,
                hotsType: data.hotsType,
                difficulty: data.difficulty,
                estimatedDuration: data.estimatedDuration,
                content: data.content,
                instructions: data.instructions,
                scaffoldingSteps: data.scaffoldingSteps || [],
                audioUrl: data.audioUrl || null,
                videoUrl: data.videoUrl || null,
                attachmentUrls: data.attachmentUrls || [],
                isPublished: data.isPublished,
                tags: data.tags || [],
                createdBy: userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .returning();

        revalidatePath("/teacher/activities");

        return { activity: newActivity, error: null };
    } catch (error) {
        console.error("Error creating activity:", error);
        return {
            activity: null,
            error:
                error instanceof Error
                    ? error.message
                    : "Gagal membuat aktivitas",
        };
    }
}

export async function updateActivity(
    id: string,
    data: Partial<ActivityFormValues>,
    userId?: string
) {
    try {
        const existingActivity = await db
            .select()
            .from(activities)
            .where(eq(activities.id, id))
            .limit(1);

        if (existingActivity.length === 0) {
            return {
                activity: null,
                error: "Aktivitas tidak ditemukan",
            };
        }

        // If userId is provided, check ownership
        if (userId && existingActivity[0].createdBy !== userId) {
            return {
                activity: null,
                error: "Anda tidak memiliki izin untuk mengubah aktivitas ini",
            };
        }

        const [updatedActivity] = await db
            .update(activities)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(activities.id, id))
            .returning();

        revalidatePath("/teacher/activities");

        return { activity: updatedActivity, error: null };
    } catch (error) {
        console.error("Error updating activity:", error);
        return {
            activity: null,
            error:
                error instanceof Error
                    ? error.message
                    : "Gagal memperbarui aktivitas",
        };
    }
}

export async function getActivityById(id: string) {
    const cachedGetActivity = cache(
        async (activityId: string) => {
            try {
                const [activity] = await db
                    .select()
                    .from(activities)
                    .where(eq(activities.id, activityId))
                    .limit(1);

                return activity || null;
            } catch (error) {
                console.error("Error fetching activity by ID:", error);
                return null;
            }
        },
        [getCacheKey.activityDetail(id)],
        {
            tags: [
                CACHE_TAGS.ACTIVITY_DETAIL,
                `${CACHE_TAGS.ACTIVITY_DETAIL}-${id}`,
            ],
            revalidate: 300, // 5 minutes
        }
    );

    return cachedGetActivity(id);
}

export interface GetActivitiesOptions {
    page?: number;
    perPage?: number;
    skill?: string | string[];
    hotsType?: string | string[];
    difficulty?: number | number[];
    search?: string;
    createdBy?: string;
    isPublished?: boolean;
    createdAtRange?: Date[];
    updatedAtRange?: Date[];
}

export async function getActivities(options: GetActivitiesOptions = {}) {
    const cachedGetActivities = cache(
        async (opts: GetActivitiesOptions) => {
            try {
                const {
                    page = 1,
                    perPage = 10,
                    skill,
                    hotsType,
                    difficulty,
                    search,
                    createdBy,
                    isPublished,
                    createdAtRange,
                    updatedAtRange,
                } = opts;

                const offset = (page - 1) * perPage;
                const whereConditions = [];

                if (skill) {
                    if (Array.isArray(skill)) {
                        whereConditions.push(inArray(activities.skill, skill));
                    } else {
                        whereConditions.push(eq(activities.skill, skill));
                    }
                }

                if (hotsType) {
                    if (Array.isArray(hotsType)) {
                        whereConditions.push(
                            inArray(activities.hotsType, hotsType)
                        );
                    } else {
                        whereConditions.push(eq(activities.hotsType, hotsType));
                    }
                }

                if (difficulty) {
                    if (Array.isArray(difficulty)) {
                        whereConditions.push(
                            inArray(activities.difficulty, difficulty)
                        );
                    } else {
                        whereConditions.push(
                            eq(activities.difficulty, difficulty)
                        );
                    }
                }

                if (search) {
                    whereConditions.push(
                        sql`(${ilike(
                            activities.title,
                            `%${search}%`
                        )} OR ${ilike(activities.description, `%${search}%`)})`
                    );
                }

                if (createdBy) {
                    whereConditions.push(eq(activities.createdBy, createdBy));
                }

                if (isPublished !== undefined) {
                    whereConditions.push(
                        eq(activities.isPublished, isPublished)
                    );
                }

                // Date range filters
                if (createdAtRange && createdAtRange.length > 0) {
                    if (createdAtRange.length === 1) {
                        const startOfDay = new Date(createdAtRange[0]);
                        startOfDay.setHours(0, 0, 0, 0);
                        const endOfDay = new Date(createdAtRange[0]);
                        endOfDay.setHours(23, 59, 59, 999);

                        whereConditions.push(
                            gte(activities.createdAt, startOfDay)
                        );
                        whereConditions.push(
                            lte(activities.createdAt, endOfDay)
                        );
                    } else if (createdAtRange.length === 2) {
                        const startDate = new Date(createdAtRange[0]);
                        startDate.setHours(0, 0, 0, 0);
                        const endDate = new Date(createdAtRange[1]);
                        endDate.setHours(23, 59, 59, 999);

                        whereConditions.push(
                            gte(activities.createdAt, startDate)
                        );
                        whereConditions.push(
                            lte(activities.createdAt, endDate)
                        );
                    }
                }

                if (updatedAtRange && updatedAtRange.length > 0) {
                    if (updatedAtRange.length === 1) {
                        const startOfDay = new Date(updatedAtRange[0]);
                        startOfDay.setHours(0, 0, 0, 0);
                        const endOfDay = new Date(updatedAtRange[0]);
                        endOfDay.setHours(23, 59, 59, 999);

                        whereConditions.push(
                            gte(activities.updatedAt, startOfDay)
                        );
                        whereConditions.push(
                            lte(activities.updatedAt, endOfDay)
                        );
                    } else if (updatedAtRange.length === 2) {
                        const startDate = new Date(updatedAtRange[0]);
                        startDate.setHours(0, 0, 0, 0);
                        const endDate = new Date(updatedAtRange[1]);
                        endDate.setHours(23, 59, 59, 999);

                        whereConditions.push(
                            gte(activities.updatedAt, startDate)
                        );
                        whereConditions.push(
                            lte(activities.updatedAt, endDate)
                        );
                    }
                }

                const baseQuery =
                    whereConditions.length > 0
                        ? and(...whereConditions)
                        : undefined;

                const countResult = await db
                    .select({ count: sql<number>`count(*)` })
                    .from(activities)
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
                    .from(activities)
                    .where(baseQuery)
                    .orderBy(desc(activities.createdAt))
                    .limit(perPage)
                    .offset(offset);

                return {
                    data: result,
                    pageCount: Math.ceil(count / perPage),
                    totalCount: count,
                    error: null,
                };
            } catch (error) {
                console.error("Error fetching activities:", error);
                return {
                    data: [],
                    pageCount: 0,
                    totalCount: 0,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Gagal mengambil aktivitas",
                };
            }
        },
        [getCacheKey.activities(options)],
        {
            tags: [CACHE_TAGS.ACTIVITIES],
            revalidate: 180, // 3 minutes
        }
    );

    return cachedGetActivities(options);
}

export async function getActivitySkillCounts() {
    const cachedGetSkillCounts = cache(
        async () => {
            try {
                const result = await db
                    .select({
                        skill: activities.skill,
                        count: sql<number>`count(*)`,
                    })
                    .from(activities)
                    .where(eq(activities.isPublished, true))
                    .groupBy(activities.skill);

                return result.reduce((acc, { skill, count }) => {
                    acc[skill] = count;
                    return acc;
                }, {} as Record<string, number>);
            } catch (error) {
                console.error("Error fetching skill counts:", error);
                return {};
            }
        },
        [getCacheKey.skillCounts()],
        {
            tags: [CACHE_TAGS.ACTIVITY_COUNTS],
            revalidate: 600, // 10 minutes
        }
    );

    return cachedGetSkillCounts();
}

export async function getActivityHotsTypeCounts() {
    const cachedGetHotsTypeCounts = cache(
        async () => {
            try {
                const result = await db
                    .select({
                        hotsType: activities.hotsType,
                        count: sql<number>`count(*)`,
                    })
                    .from(activities)
                    .where(eq(activities.isPublished, true)) // Only count published activities
                    .groupBy(activities.hotsType);

                return result.reduce((acc, { hotsType, count }) => {
                    acc[hotsType] = count;
                    return acc;
                }, {} as Record<string, number>);
            } catch (error) {
                console.error("Error fetching HOTS type counts:", error);
                return {};
            }
        },
        [getCacheKey.hotsTypeCounts()],
        {
            tags: [CACHE_TAGS.ACTIVITY_COUNTS],
            revalidate: 600, // 10 minutes
        }
    );

    return cachedGetHotsTypeCounts();
}

export async function getDifficultyRange() {
    const cachedGetDifficultyRange = cache(
        async () => {
            try {
                const result = await db
                    .select({
                        min: sql<number>`min(${activities.difficulty})`,
                        max: sql<number>`max(${activities.difficulty})`,
                    })
                    .from(activities)
                    .where(eq(activities.isPublished, true));

                return {
                    min: result[0]?.min ?? 1,
                    max: result[0]?.max ?? 5,
                };
            } catch (error) {
                console.error("Error fetching difficulty range:", error);
                return { min: 1, max: 5 };
            }
        },
        [getCacheKey.difficultyRange()],
        {
            tags: [CACHE_TAGS.ACTIVITY_COUNTS],
            revalidate: 600, // 10 minutes
        }
    );

    return cachedGetDifficultyRange();
}

export async function deleteActivities(input: { ids: string[] }) {
    try {
        const result = await db.transaction(async (tx) => {
            // Get activities to be deleted for verification
            const activitiesToDelete = await tx
                .select({ id: activities.id, createdBy: activities.createdBy })
                .from(activities)
                .where(inArray(activities.id, input.ids));

            if (activitiesToDelete.length === 0) {
                throw new Error(
                    "Tidak ada aktivitas yang ditemukan untuk dihapus"
                );
            }

            // Delete the activities
            const deletedActivities = await tx
                .delete(activities)
                .where(inArray(activities.id, input.ids))
                .returning({ id: activities.id });

            return deletedActivities;
        });

        revalidatePath("/teacher/activities");

        return {
            data: result,
            error: null,
        };
    } catch (error) {
        console.error("Error deleting activities:", error);
        return {
            data: null,
            error:
                error instanceof Error
                    ? error.message
                    : "Gagal menghapus aktivitas",
        };
    }
}

export async function toggleActivityPublishStatus(id: string, userId?: string) {
    try {
        const [activity] = await db
            .select({
                isPublished: activities.isPublished,
                createdBy: activities.createdBy,
            })
            .from(activities)
            .where(eq(activities.id, id))
            .limit(1);

        if (!activity) {
            return {
                activity: null,
                error: "Aktivitas tidak ditemukan",
            };
        }

        // Check ownership if userId provided
        if (userId && activity.createdBy !== userId) {
            return {
                activity: null,
                error: "Anda tidak memiliki izin untuk mengubah status publikasi aktivitas ini",
            };
        }

        const [updatedActivity] = await db
            .update(activities)
            .set({
                isPublished: !activity.isPublished,
                updatedAt: new Date(),
            })
            .where(eq(activities.id, id))
            .returning();

        revalidatePath("/teacher/activities");

        return { activity: updatedActivity, error: null };
    } catch (error) {
        console.error("Error toggling activity publish status:", error);
        return {
            activity: null,
            error:
                error instanceof Error
                    ? error.message
                    : "Gagal mengubah status publikasi aktivitas",
        };
    }
}

export async function revalidateActivityData() {
    try {
        revalidatePath("/teacher/activities");
        return { success: true, error: null };
    } catch (error) {
        console.error("Error revalidating activity data:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Gagal memperbarui cache",
        };
    }
}
