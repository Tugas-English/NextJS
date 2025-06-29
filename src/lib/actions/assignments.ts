"use server";

import { db } from "@/db";
import {
    assignments,
    courseAssignments,
    courses,
    courseStudents,
} from "@/db/schema";
import { nanoid } from "nanoid";
import { AssignmentFormValues } from "../schemas/assignment";
import { revalidatePath } from "next/cache";
import { getServerSession } from "../session";
import { unstable_cache as cache } from "next/cache";
import { and, desc, eq, ilike, sql, asc } from "drizzle-orm";
import { user } from "@/db/schema";

const CACHE_TAGS = {
    ASSIGNMENTS: "assignments",
    ASSIGNMENT_DETAIL: "assignment-detail",
} as const;

const getCacheKey = {
    assignments: (options: GetAssignmentsOptions) =>
        `assignments-${JSON.stringify(options)}`,
    assignmentDetail: (id: string) => `assignment-${id}`,
};

export async function createAssignment(data: AssignmentFormValues) {
    try {
        const session = await getServerSession();

        if (!session?.user?.id) {
            return { error: "Anda harus login untuk membuat tugas" };
        }

        const highestOrderResult = await db
            .select({ maxOrder: sql<number>`max(${courseAssignments.order})` })
            .from(courseAssignments)
            .where(eq(courseAssignments.courseId, data.courseId));

        const currentMaxOrder = highestOrderResult[0]?.maxOrder || 0;
        const newOrder = currentMaxOrder + 1;

        const assignmentId = nanoid();

        await db.insert(assignments).values({
            id: assignmentId,
            title: data.title,
            activityId: data.activityId,
            moduleId: data.moduleId,
            assignedBy: session.user.id,
            dueDate: data.dueDate,
            instructions: data.instructions,
            rubricId: data.rubricId,
            allowResubmission: data.allowResubmission,
            maxResubmissions: data.maxResubmissions,
            isChallenge: data.isChallenge,
            challengePoints: data.challengePoints,
            isPublished: data.isPublished,
        });

        await db.insert(courseAssignments).values({
            id: nanoid(),
            courseId: data.courseId,
            assignmentId: assignmentId,
            order: newOrder,
            isRequired: true,
        });

        revalidatePath("/teacher/assignments");

        return {
            assignment: { id: assignmentId },
            success: true,
        };
    } catch (error) {
        console.error("Error creating assignment:", error);
        return {
            error: "Gagal membuat tugas. Silakan coba lagi.",
        };
    }
}

export interface GetAssignmentsOptions {
    page?: number;
    perPage?: number;
    search?: string;
    assignedBy?: string;
    assignedTo?: string | string[];
    isPublished?: boolean;
    isChallenge?: boolean;
    dueDateRange?: Date[];
}

export async function getAssignments(options: GetAssignmentsOptions = {}) {
    const cachedGetAssignments = cache(
        async (opts: GetAssignmentsOptions) => {
            try {
                const {
                    page = 1,
                    perPage = 10,
                    search,
                    assignedBy,
                    isPublished,
                    isChallenge,
                    dueDateRange,
                } = opts;

                const offset = (page - 1) * perPage;
                const whereConditions = [];

                if (search) {
                    whereConditions.push(
                        ilike(assignments.title, `%${search}%`)
                    );
                }

                if (assignedBy) {
                    whereConditions.push(
                        eq(assignments.assignedBy, assignedBy)
                    );
                }

                if (isPublished !== undefined) {
                    whereConditions.push(
                        eq(assignments.isPublished, isPublished)
                    );
                }

                if (isChallenge !== undefined) {
                    whereConditions.push(
                        eq(assignments.isChallenge, isChallenge)
                    );
                }

                if (dueDateRange && dueDateRange.length > 0) {
                    if (dueDateRange.length === 1) {
                        const startOfDay = new Date(dueDateRange[0]);
                        startOfDay.setHours(0, 0, 0, 0);
                        const endOfDay = new Date(dueDateRange[0]);
                        endOfDay.setHours(23, 59, 59, 999);

                        whereConditions.push(
                            sql`${assignments.dueDate} >= ${startOfDay}`
                        );
                        whereConditions.push(
                            sql`${assignments.dueDate} <= ${endOfDay}`
                        );
                    } else if (dueDateRange.length === 2) {
                        const startDate = new Date(dueDateRange[0]);
                        startDate.setHours(0, 0, 0, 0);
                        const endDate = new Date(dueDateRange[1]);
                        endDate.setHours(23, 59, 59, 999);

                        whereConditions.push(
                            sql`${assignments.dueDate} >= ${startDate}`
                        );
                        whereConditions.push(
                            sql`${assignments.dueDate} <= ${endDate}`
                        );
                    }
                }

                const baseQuery =
                    whereConditions.length > 0
                        ? and(...whereConditions)
                        : undefined;

                const countResult = await db
                    .select({ count: sql<number>`count(*)` })
                    .from(assignments)
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
                    .from(assignments)
                    .where(baseQuery)
                    .orderBy(desc(assignments.dueDate))
                    .limit(perPage)
                    .offset(offset);

                return {
                    data: result,
                    pageCount: Math.ceil(count / perPage),
                    totalCount: count,
                    error: null,
                };
            } catch (error) {
                console.error("Error fetching assignments:", error);
                return {
                    data: [],
                    pageCount: 0,
                    totalCount: 0,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Gagal mengambil tugas",
                };
            }
        },
        [getCacheKey.assignments(options)],
        {
            tags: [CACHE_TAGS.ASSIGNMENTS],
            revalidate: 180, // 3 minutes
        }
    );

    return cachedGetAssignments(options);
}

export async function getAssignmentById(id: string) {
    const cachedGetAssignment = cache(
        async (assignmentId: string) => {
            try {
                const [assignment] = await db
                    .select()
                    .from(assignments)
                    .where(eq(assignments.id, assignmentId))
                    .limit(1);

                return assignment || null;
            } catch (error) {
                console.error("Error fetching assignment by ID:", error);
                return null;
            }
        },
        [getCacheKey.assignmentDetail(id)],
        {
            tags: [
                CACHE_TAGS.ASSIGNMENT_DETAIL,
                `${CACHE_TAGS.ASSIGNMENT_DETAIL}-${id}`,
            ],
            revalidate: 300, // 5 minutes
        }
    );

    return cachedGetAssignment(id);
}

export async function updateAssignment(
    id: string,
    data: Partial<AssignmentFormValues>,
    userId?: string
) {
    try {
        const existingAssignment = await db
            .select()
            .from(assignments)
            .where(eq(assignments.id, id))
            .limit(1);

        if (existingAssignment.length === 0) {
            return {
                assignment: null,
                error: "Tugas tidak ditemukan",
            };
        }

        // If userId is provided, check ownership
        if (userId && existingAssignment[0].assignedBy !== userId) {
            return {
                assignment: null,
                error: "Anda tidak memiliki izin untuk mengubah tugas ini",
            };
        }

        const [updatedAssignment] = await db
            .update(assignments)
            .set(data)
            .where(eq(assignments.id, id))
            .returning();

        revalidatePath("/teacher/assignments");

        return { assignment: updatedAssignment, error: null };
    } catch (error) {
        console.error("Error updating assignment:", error);
        return {
            assignment: null,
            error:
                error instanceof Error
                    ? error.message
                    : "Gagal memperbarui tugas",
        };
    }
}

export async function toggleAssignmentPublishStatus(
    id: string,
    userId?: string
) {
    try {
        const [assignment] = await db
            .select({
                isPublished: assignments.isPublished,
                assignedBy: assignments.assignedBy,
            })
            .from(assignments)
            .where(eq(assignments.id, id))
            .limit(1);

        if (!assignment) {
            return {
                assignment: null,
                error: "Tugas tidak ditemukan",
            };
        }

        // Check ownership if userId provided
        if (userId && assignment.assignedBy !== userId) {
            return {
                assignment: null,
                error: "Anda tidak memiliki izin untuk mengubah status publikasi tugas ini",
            };
        }

        const [updatedAssignment] = await db
            .update(assignments)
            .set({
                isPublished: !assignment.isPublished,
            })
            .where(eq(assignments.id, id))
            .returning();

        revalidatePath("/teacher/assignments");

        return { assignment: updatedAssignment, error: null };
    } catch (error) {
        console.error("Error toggling assignment publish status:", error);
        return {
            assignment: null,
            error:
                error instanceof Error
                    ? error.message
                    : "Gagal mengubah status publikasi tugas",
        };
    }
}

export async function deleteAssignments({ ids }: { ids: string[] }) {
    try {
        if (!ids.length) return { error: "Tidak ada tugas yang dipilih" };

        await db.delete(assignments).where(sql`${assignments.id} IN ${ids}`);

        revalidatePath("/teacher/assignments");
        return { success: true };
    } catch (error) {
        console.error("Error deleting assignments:", error);
        return { error: "Gagal menghapus tugas" };
    }
}

export async function getActivities() {
    try {
        const activities = await db.query.activities.findMany({
            orderBy: (activities, { desc }) => [desc(activities.createdAt)],
            columns: {
                id: true,
                title: true,
            },
        });

        return { activities };
    } catch (error) {
        console.error("Error fetching activities:", error);
        return { activities: [] };
    }
}

export async function getModules() {
    try {
        const modules = await db.query.modules.findMany({
            orderBy: (modules, { desc }) => [desc(modules.createdAt)],
            columns: {
                id: true,
                title: true,
            },
        });

        return { modules };
    } catch (error) {
        console.error("Error fetching modules:", error);
        return { modules: [] };
    }
}

export async function getRubrics() {
    try {
        const rubrics = await db.query.rubrics.findMany({
            orderBy: (rubrics, { asc }) => [asc(rubrics.name)],
            columns: {
                id: true,
                name: true,
            },
        });

        return { rubrics };
    } catch (error) {
        console.error("Error fetching rubrics:", error);
        return { rubrics: [] };
    }
}

export async function getStudents() {
    try {
        const students = await db.query.user.findMany({
            where: (user, { eq }) => eq(user.role, "student"),
            orderBy: (user, { asc }) => [asc(user.name)],
            columns: {
                id: true,
                name: true,
                email: true,
            },
        });

        return { students };
    } catch (error) {
        console.error("Error fetching students:", error);
        return { students: [] };
    }
}

export async function revalidateAssignmentData() {
    try {
        revalidatePath("/teacher/assignments");
        return { success: true, error: null };
    } catch (error) {
        console.error("Error revalidating assignment data:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Gagal memperbarui cache",
        };
    }
}

export async function getCourses() {
    try {
        const activeCourses = await db
            .select({
                id: courses.id,
                title: courses.title,
            })
            .from(courses)
            .where(eq(courses.isActive, true))
            .orderBy(asc(courses.title));

        return { courses: activeCourses };
    } catch (error) {
        console.error("Error fetching courses:", error);
        return { courses: [] };
    }
}

export async function getStudentsByCourse(courseId: string) {
    try {
        const students = await db
            .select({
                id: user.id,
                name: user.name,
                email: user.email,
            })
            .from(courseStudents)
            .innerJoin(user, eq(courseStudents.studentId, user.id))
            .where(eq(courseStudents.courseId, courseId));

        return { students };
    } catch (error) {
        console.error("Error fetching students by course:", error);
        return { students: [] };
    }
}
