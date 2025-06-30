'use server';

import { db } from '@/db';
import { modules, moduleActivities, activities } from '@/db/schema';
import { count, eq, sql, inArray } from 'drizzle-orm';

export type GetStudentModulesOptions = {
  page?: number;
  perPage?: number;
  skill?: string | string[];
  hotsType?: string | string[];
  difficulty?: number | number[];
  search?: string;
};

export async function getStudentModules(
  options: GetStudentModulesOptions = {},
) {
  try {
    const {
      page = 1,
      perPage = 10,
      skill,
      hotsType,
      difficulty,
      search,
    } = options;

    const offset = (page - 1) * perPage;
    const limit = perPage;

    const query = db
      .select()
      .from(modules)
      .where(eq(modules.isPublished, true));

    if (skill) {
      const skillArray = Array.isArray(skill) ? skill : [skill];
      query.where(sql`${modules.skill} IN ${skillArray}`);
    }

    if (hotsType) {
      const hotsTypeArray = Array.isArray(hotsType) ? hotsType : [hotsType];
      query.where(sql`${modules.hotsType} IN ${hotsTypeArray}`);
    }

    if (difficulty) {
      if (Array.isArray(difficulty) && difficulty.length === 2) {
        query.where(
          sql`${modules.difficulty} BETWEEN ${difficulty[0]} AND ${difficulty[1]}`,
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

    const [modulesResult, countResult] = await Promise.all([
      query
        .orderBy(sql`${modules.createdAt} DESC`)
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(modules)
        .where(eq(modules.isPublished, true)),
    ]);

    // Ambil aktivitas untuk setiap modul
    const moduleIds = modulesResult.map((module) => module.id);

    const moduleActivitiesData =
      moduleIds.length > 0
        ? await db
            .select()
            .from(moduleActivities)
            .where(inArray(moduleActivities.moduleId, moduleIds))
            .orderBy(moduleActivities.order)
        : [];

    // Ambil detail aktivitas
    const activityIds = moduleActivitiesData.map((ma) => ma.activityId);

    const activitiesData =
      activityIds.length > 0
        ? await db
            .select({
              id: activities.id,
              title: activities.title,
              skill: activities.skill,
              hotsType: activities.hotsType,
              difficulty: activities.difficulty,
            })
            .from(activities)
            .where(inArray(activities.id, activityIds))
        : [];

    // Gabungkan data
    const modulesWithActivities = modulesResult.map((module) => {
      const moduleActivitiesList = moduleActivitiesData.filter(
        (ma) => ma.moduleId === module.id,
      );

      const activitiesList = moduleActivitiesList.map((ma) => {
        const activityDetail = activitiesData.find(
          (a) => a.id === ma.activityId,
        );
        return {
          ...ma,
          activity: activityDetail || null,
        };
      });

      return {
        ...module,
        activities: activitiesList,
      };
    });

    const totalCount = countResult[0].count;
    const pageCount = Math.ceil(totalCount / perPage);

    return {
      data: modulesWithActivities,
      pageCount,
      totalCount,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching student modules:', error);
    return {
      data: [],
      pageCount: 0,
      totalCount: 0,
      error: 'Gagal memuat data modul',
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
      .where(eq(modules.isPublished, true))
      .groupBy(modules.skill);

    return result.reduce(
      (acc, { skill, count }) => ({
        ...acc,
        [skill || 'undefined']: count,
      }),
      {} as Record<string, number>,
    );
  } catch (error) {
    console.error('Error getting module skill counts:', error);
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
      .where(eq(modules.isPublished, true))
      .groupBy(modules.hotsType);

    return result.reduce(
      (acc, { hotsType, count }) => ({
        ...acc,
        [hotsType || 'undefined']: count,
      }),
      {} as Record<string, number>,
    );
  } catch (error) {
    console.error('Error getting module HOTS type counts:', error);
    return {};
  }
}

export async function getDifficultyRange() {
  try {
    const minResult = await db
      .select({
        min: sql<number>`MIN(${modules.difficulty})`,
      })
      .from(modules)
      .where(eq(modules.isPublished, true));

    const maxResult = await db
      .select({
        max: sql<number>`MAX(${modules.difficulty})`,
      })
      .from(modules)
      .where(eq(modules.isPublished, true));

    return {
      min: minResult[0].min ?? 1,
      max: maxResult[0].max ?? 5,
    };
  } catch (error) {
    console.error('Error getting difficulty range:', error);
    return { min: 1, max: 5 };
  }
}
