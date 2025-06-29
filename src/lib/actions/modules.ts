"use server";

import { db } from "@/db";
import { modules, moduleActivities } from "@/db/schema";
import { nanoid } from "nanoid";
import { ModuleFormValues } from "../schemas/module";
import { revalidatePath } from "next/cache";
import { getServerSession } from "../session";
import { count, eq, sql } from "drizzle-orm";

export type GetModulesOptions = {
    page?: number;
    perPage?: number;
    skill?: string | string[];
    hotsType?: string | string[];
    difficulty?: number | number[];
    search?: string;
    createdBy?: string;
};

export async function createModule(data: ModuleFormValues) {
    try {
        const session = await getServerSession();

        if (!session?.user?.id) {
            return { error: "Anda harus login untuk membuat modul" };
        }

        const moduleId = nanoid();

        await db.insert(modules).values({
            id: moduleId,
            title: data.title,
            description: data.description,
            coverImage: data.coverImage || null,
            skill: data.skill || null,
            hotsType: data.hotsType || null,
            difficulty: data.difficulty,
            isPublished: data.isPublished,
            createdBy: session.user.id,
        });

        if (data.activities && data.activities.length > 0) {
            const moduleActivitiesData = data.activities.map(
                (activity, index) => ({
                    id: nanoid(),
                    moduleId,
                    activityId: activity.activityId,
                    order: activity.order || index + 1,
                    isRequired: activity.isRequired,
                })
            );

            await db.insert(moduleActivities).values(moduleActivitiesData);
        }

        revalidatePath("/teacher/modules");

        return {
            module: { id: moduleId },
            success: true,
        };
    } catch (error) {
        console.error("Error creating module:", error);
        return {
            error: "Gagal membuat modul. Silakan coba lagi.",
        };
    }
}

export async function getActivities() {
    try {
        const activities = await db.query.activities.findMany({
            orderBy: (activities, { desc }) => [desc(activities.createdAt)],
            columns: {
                id: true,
                title: true,
                skill: true,
                hotsType: true,
                difficulty: true,
            },
        });

        return activities;
    } catch (error) {
        console.error("Error fetching activities:", error);
        return [];
    }
}

export async function getModules(options: GetModulesOptions = {}) {
    try {
        const {
            page = 1,
            perPage = 10,
            skill,
            hotsType,
            difficulty,
            search,
            createdBy,
        } = options;

        const offset = (page - 1) * perPage;
        const limit = perPage;

        const query = db.select().from(modules);

        // Menambahkan kondisi filter
        if (skill) {
            const skillArray = Array.isArray(skill) ? skill : [skill];
            query.where(sql`${modules.skill} IN ${skillArray}`);
        }

        if (hotsType) {
            const hotsTypeArray = Array.isArray(hotsType)
                ? hotsType
                : [hotsType];
            query.where(sql`${modules.hotsType} IN ${hotsTypeArray}`);
        }

        if (difficulty) {
            if (Array.isArray(difficulty) && difficulty.length === 2) {
                query.where(
                    sql`${modules.difficulty} BETWEEN ${difficulty[0]} AND ${difficulty[1]}`
                );
            } else {
                const difficultyValue = Array.isArray(difficulty)
                    ? difficulty[0]
                    : difficulty;
                query.where(eq(modules.difficulty, difficultyValue));
            }
        }

        if (search) {
            query.where(sql`${modules.title} ILIKE ${`%${search}%`}`);
        }

        if (createdBy) {
            query.where(eq(modules.createdBy, createdBy));
        }

        // // Hitung total
        // const countQuery = db
        //     .select({ count: count() })
        //     .from(modules)
        //     .as("count");

        const [modulesResult, countResult] = await Promise.all([
            query
                .orderBy(sql`${modules.createdAt} DESC`)
                .limit(limit)
                .offset(offset),
            db.select({ count: count() }).from(modules),
        ]);

        const totalCount = countResult[0].count;
        const pageCount = Math.ceil(totalCount / perPage);

        return {
            data: modulesResult,
            pageCount,
            totalCount,
            error: null,
        };
    } catch (error) {
        console.error("Error fetching modules:", error);
        return {
            data: [],
            pageCount: 0,
            totalCount: 0,
            error: "Gagal memuat data modul",
        };
    }
}

export async function getModuleSkillCounts() {
    try {
        const result = await db
            .select({
                skill: modules.skill,
                count: count(),
            })
            .from(modules)
            .groupBy(modules.skill);

        return result.reduce(
            (acc, { skill, count }) => ({
                ...acc,
                [skill || "undefined"]: count,
            }),
            {} as Record<string, number>
        );
    } catch (error) {
        console.error("Error getting module skill counts:", error);
        return {};
    }
}

export async function getModuleHotsTypeCounts() {
    try {
        const result = await db
            .select({
                hotsType: modules.hotsType,
                count: count(),
            })
            .from(modules)
            .groupBy(modules.hotsType);

        return result.reduce(
            (acc, { hotsType, count }) => ({
                ...acc,
                [hotsType || "undefined"]: count,
            }),
            {} as Record<string, number>
        );
    } catch (error) {
        console.error("Error getting module HOTS type counts:", error);
        return {};
    }
}

export async function getDifficultyRange() {
    try {
        const minResult = await db
            .select({
                min: sql<number>`MIN(${modules.difficulty})`,
            })
            .from(modules);

        const maxResult = await db
            .select({
                max: sql<number>`MAX(${modules.difficulty})`,
            })
            .from(modules);

        return {
            min: minResult[0].min ?? 1,
            max: maxResult[0].max ?? 5,
        };
    } catch (error) {
        console.error("Error getting difficulty range:", error);
        return { min: 1, max: 5 };
    }
}

export async function deleteModules({ ids }: { ids: string[] }) {
    try {
        if (!ids.length) return { error: "Tidak ada modul yang dipilih" };

        // Hapus modul activities terlebih dahulu
        await db
            .delete(moduleActivities)
            .where(sql`${moduleActivities.moduleId} IN ${ids}`);

        // Kemudian hapus modul
        await db.delete(modules).where(sql`${modules.id} IN ${ids}`);

        revalidatePath("/teacher/modules");
        return { success: true };
    } catch (error) {
        console.error("Error deleting modules:", error);
        return { error: "Gagal menghapus modul" };
    }
}
