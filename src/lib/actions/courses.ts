'use server';

import { db } from '@/db';
import {
  courses,
  courseModules,
  courseStudents,
  courseActivities,
  courseAssignments,
} from '@/db/schema';
import { nanoid } from 'nanoid';
import { revalidatePath, unstable_cache as cache } from 'next/cache';
import { getServerSession } from '../session';

import { and, desc, eq, ilike, inArray, sql } from 'drizzle-orm';
import { CourseFormValues } from '@/lib/schemas/courses';

const CACHE_TAGS = {
  COURSES: 'courses',
  COURSE_DETAIL: 'course-detail',
  TEACHER_COURSES: 'teacher-courses',
} as const;

const getCacheKey = {
  courses: (options: GetCoursesOptions) => `courses-${JSON.stringify(options)}`,
  courseDetail: (id: string) => `course-${id}`,
  teacherCourses: (teacherId: string) => `teacher-courses-${teacherId}`,
};

export interface GetCoursesOptions {
  page?: number;
  perPage?: number;
  search?: string;
  createdBy?: string;
  isActive?: boolean;
  primarySkill?: string[];
  dateRange?: Date[];
}

export async function createCourse(data: CourseFormValues) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return { error: 'Anda harus login untuk membuat kelas' };
    }

    const courseId = nanoid();

    await db.insert(courses).values({
      id: courseId,
      title: data.title,
      description: data.description,
      coverImage: data.coverImage || null,
      primarySkill: data.primarySkill,
      startDate: data.startDate,
      endDate: data.endDate,
      maxStudents: data.maxStudents,
      isActive: data.isActive,
      createdBy: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (data.selectedModules && data.selectedModules.length > 0) {
      const courseModulesData = data.selectedModules.map((moduleId, index) => ({
        id: nanoid(),
        courseId: courseId,
        moduleId: moduleId,
        order: index + 1,
      }));

      await db.insert(courseModules).values(courseModulesData);
    }

    if (data.selectedActivities && data.selectedActivities.length > 0) {
      const courseActivitiesData = data.selectedActivities.map(
        (activityId, index) => ({
          id: nanoid(),
          courseId: courseId,
          activityId: activityId,
          order: index + 1,
        }),
      );

      await db.insert(courseActivities).values(courseActivitiesData);
    }

    if (data.selectedStudents && data.selectedStudents.length > 0) {
      const courseStudentsData = data.selectedStudents.map((studentId) => ({
        id: nanoid(),
        courseId: courseId,
        studentId: studentId,
        joinedAt: new Date(),
      }));

      await db.insert(courseStudents).values(courseStudentsData);
    }

    revalidatePath('/teacher/courses');
    return { course: { id: courseId }, success: true };
  } catch (error) {
    console.error('Error creating course:', error);

    return { error: 'Gagal membuat kelas. Silakan coba lagi.' };
  }
}

export async function getCourses(options: GetCoursesOptions = {}) {
  const cachedGetCourses = cache(
    async (opts: GetCoursesOptions) => {
      try {
        const {
          page = 1,
          perPage = 10,
          search,
          createdBy,
          isActive,
          primarySkill,
          dateRange,
        } = opts;

        const offset = (page - 1) * perPage;
        const whereConditions = [];

        if (search) {
          whereConditions.push(ilike(courses.title, `%${search}%`));
        }

        if (createdBy) {
          whereConditions.push(eq(courses.createdBy, createdBy));
        }

        if (isActive !== undefined) {
          whereConditions.push(eq(courses.isActive, isActive));
        }

        if (primarySkill && primarySkill.length > 0) {
          whereConditions.push(inArray(courses.primarySkill, primarySkill));
        }

        if (dateRange && dateRange.length === 2) {
          const [startDate, endDate] = dateRange;
          whereConditions.push(
            sql`${courses.startDate} >= ${startDate} AND ${courses.endDate} <= ${endDate}`,
          );
        }

        const baseQuery =
          whereConditions.length > 0 ? and(...whereConditions) : undefined;

        const countResult = await db
          .select({ count: sql<number>`count(*)` })
          .from(courses)
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
          .from(courses)
          .where(baseQuery)
          .orderBy(desc(courses.createdAt))
          .limit(perPage)
          .offset(offset);

        return {
          data: result,
          pageCount: Math.ceil(count / perPage),
          totalCount: count,
          error: null,
        };
      } catch (error) {
        console.error('Error fetching courses:', error);
        return {
          data: [],
          pageCount: 0,
          totalCount: 0,
          error:
            error instanceof Error ? error.message : 'Gagal mengambil kelas',
        };
      }
    },
    [getCacheKey.courses(options)],
    {
      tags: [CACHE_TAGS.COURSES],
      revalidate: 180, // 3 minutes
    },
  );

  return cachedGetCourses(options);
}

export async function getCourseById(id: string) {
  const cachedGetCourse = cache(
    async (courseId: string) => {
      try {
        const [course] = await db
          .select()
          .from(courses)
          .where(eq(courses.id, courseId))
          .limit(1);

        return course || null;
      } catch (error) {
        console.error('Error fetching course by ID:', error);
        return null;
      }
    },
    [getCacheKey.courseDetail(id)],
    {
      tags: [CACHE_TAGS.COURSE_DETAIL, `${CACHE_TAGS.COURSE_DETAIL}-${id}`],
      revalidate: 300, // 5 minutes
    },
  );

  return cachedGetCourse(id);
}

export async function updateCourse(
  id: string,
  data: Partial<CourseFormValues>,
  userId?: string,
) {
  try {
    const existingCourse = await db
      .select()
      .from(courses)
      .where(eq(courses.id, id))
      .limit(1);

    if (existingCourse.length === 0) {
      return {
        course: null,
        error: 'Kelas tidak ditemukan',
      };
    }

    if (userId && existingCourse[0].createdBy !== userId) {
      return {
        course: null,
        error: 'Anda tidak memiliki izin untuk mengubah kelas ini',
      };
    }

    const updateData: Partial<typeof courses.$inferInsert> = {
      updatedAt: new Date(),
      ...data,
    };

    const [updatedCourse] = await db
      .update(courses)
      .set(updateData)
      .where(eq(courses.id, id))
      .returning();

    revalidatePath('/teacher/courses');
    return { course: updatedCourse, error: null };
  } catch (error) {
    console.error('Error updating course:', error);
    return {
      course: null,
      error: error instanceof Error ? error.message : 'Gagal memperbarui kelas',
    };
  }
}

export async function toggleCourseStatus(id: string, userId?: string) {
  try {
    const [course] = await db
      .select({
        isActive: courses.isActive,
        createdBy: courses.createdBy,
      })
      .from(courses)
      .where(eq(courses.id, id))
      .limit(1);

    if (!course) {
      return {
        course: null,
        error: 'Kelas tidak ditemukan',
      };
    }

    if (userId && course.createdBy !== userId) {
      return {
        course: null,
        error: 'Anda tidak memiliki izin untuk mengubah status kelas ini',
      };
    }

    const [updatedCourse] = await db
      .update(courses)
      .set({
        isActive: !course.isActive,
      })
      .where(eq(courses.id, id))
      .returning();

    revalidatePath('/teacher/courses');
    return { course: updatedCourse, error: null };
  } catch (error) {
    console.error('Error toggling course status:', error);
    return {
      course: null,
      error:
        error instanceof Error ? error.message : 'Gagal mengubah status kelas',
    };
  }
}

export async function deleteCourses({
  ids,
  userId,
}: {
  ids: string[];
  userId?: string;
}) {
  try {
    if (!ids.length) return { error: 'Tidak ada kelas yang dipilih' };

    const whereClause = userId
      ? and(sql`${courses.id} IN ${ids}`, eq(courses.createdBy, userId))
      : sql`${courses.id} IN ${ids}`;

    const result = await db
      .delete(courses)
      .where(whereClause)
      .returning({ id: courses.id });

    revalidatePath('/teacher/courses');
    return {
      success: true,
      deletedCount: result.length,
    };
  } catch (error) {
    console.error('Error deleting courses:', error);
    return { error: 'Gagal menghapus kelas' };
  }
}

export async function revalidateCourseData() {
  try {
    revalidatePath('/teacher/courses');
    return { success: true, error: null };
  } catch (error) {
    console.error('Error revalidating course data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal memperbarui cache',
    };
  }
}

interface CourseStats {
  totalCourses: number;
  totalStudents: number;
  averageScore: number;
  totalAssignments: number;
}

interface TopStudent {
  id: string;
  name: string;
  email: string;
  courseTitle: string;
  score: number;
  avatar?: string | null;
}

interface RecentAssignment {
  id: string;
  title: string;
  courseTitle: string;
  dueDate: Date;
  submissions: string;
  submissionCount: number;
  totalStudents: number;
  avgScore: number | null;
}

export async function getCourseStats(userId?: string): Promise<CourseStats> {
  try {
    // Mendapatkan total kelas
    const coursesQuery = userId
      ? db.select().from(courses).where(eq(courses.createdBy, userId))
      : db.select().from(courses);

    const coursesResult = await coursesQuery;
    const totalCourses = coursesResult.length;

    // Mendapatkan total siswa unik dari semua kelas
    const studentsResult = await db
      .select({ studentId: courseStudents.studentId })
      .from(courseStudents)
      .innerJoin(courses, eq(courseStudents.courseId, courses.id))
      .where(userId ? eq(courses.createdBy, userId) : undefined);

    // Menghitung siswa unik
    const uniqueStudents = new Set(studentsResult.map((s) => s.studentId));
    const totalStudents = uniqueStudents.size;

    // Mendapatkan data assignments untuk statistik
    const assignmentsResult = await db.query.assignments.findMany({
      where: userId
        ? (assignments, { eq }) => eq(assignments.assignedBy, userId)
        : undefined,
    });

    const totalAssignments = assignmentsResult.length;

    // Menghitung rata-rata nilai (dummy untuk sementara)
    const averageScore = 85; // Nilai dummy, idealnya diambil dari submissions

    return {
      totalCourses,
      totalStudents,
      averageScore,
      totalAssignments,
    };
  } catch (error) {
    console.error('Error fetching course stats:', error);
    return {
      totalCourses: 0,
      totalStudents: 0,
      averageScore: 0,
      totalAssignments: 0,
    };
  }
}

export async function getTopStudents(
  limit: number = 5,
  userId?: string,
): Promise<TopStudent[]> {
  try {
    // Ini adalah implementasi dummy
    // Idealnya, kita akan query dari submissions untuk mendapatkan siswa dengan nilai tertinggi

    // Mendapatkan data siswa dari kelas yang diajar oleh guru
    const studentsResult = await db
      .select({
        studentId: courseStudents.studentId,
        courseId: courseStudents.courseId,
      })
      .from(courseStudents)
      .innerJoin(courses, eq(courseStudents.courseId, courses.id))
      .where(userId ? eq(courses.createdBy, userId) : undefined)
      .limit(limit * 2); // Ambil lebih untuk filter

    if (studentsResult.length === 0) {
      return [];
    }

    // Mendapatkan data siswa
    const studentIds = [...new Set(studentsResult.map((s) => s.studentId))];
    const studentsData = await db.query.user.findMany({
      where: (user, { inArray }) => inArray(user.id, studentIds),
    });

    // Mendapatkan data kelas
    const courseIds = [...new Set(studentsResult.map((s) => s.courseId))];
    const coursesData = await db
      .select({
        id: courses.id,
        title: courses.title,
      })
      .from(courses)
      .where(inArray(courses.id, courseIds));

    const coursesMap = new Map(coursesData.map((c) => [c.id, c.title]));

    const topStudents: TopStudent[] = studentsData
      .map((student) => {
        const studentCourse = studentsResult.find(
          (s) => s.studentId === student.id,
        );
        const courseTitle = studentCourse
          ? coursesMap.get(studentCourse.courseId) || 'Unknown'
          : 'Unknown';

        return {
          id: student.id,
          name: student.name,
          email: student.email,
          courseTitle,
          score: 75 + Math.floor(Math.random() * 20),
          avatar: student.image,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return topStudents;
  } catch (error) {
    console.error('Error fetching top students:', error);
    return [];
  }
}

export async function getRecentAssignments(
  limit: number = 3,
  userId?: string,
): Promise<RecentAssignment[]> {
  try {
    // Mendapatkan tugas terbaru menggunakan cache
    const cachedGetRecentAssignments = cache(
      async (limitParam: number, userIdParam?: string) => {
        // Mendapatkan tugas terbaru
        const assignmentsResult = await db.query.assignments.findMany({
          where: userIdParam
            ? (assignments, { eq }) => eq(assignments.assignedBy, userIdParam)
            : undefined,
          orderBy: (assignments, { desc }) => [desc(assignments.createdAt)],
          limit: limitParam,
        });

        if (assignmentsResult.length === 0) {
          return [];
        }

        // Mendapatkan data kelas melalui courseAssignments
        const assignmentIds = assignmentsResult.map((a) => a.id);

        // Mendapatkan courseAssignments untuk tugas-tugas ini
        const courseAssignmentsData = await db
          .select({
            assignmentId: courseAssignments.assignmentId,
            courseId: courseAssignments.courseId,
          })
          .from(courseAssignments)
          .where(inArray(courseAssignments.assignmentId, assignmentIds));

        // Membuat map dari assignmentId ke courseId
        const assignmentToCourseMap = new Map(
          courseAssignmentsData.map((ca) => [ca.assignmentId, ca.courseId]),
        );

        // Mendapatkan semua courseId yang terkait
        const courseIds = [
          ...new Set(courseAssignmentsData.map((ca) => ca.courseId)),
        ];

        // Mendapatkan data kelas jika ada courseIds
        const coursesData =
          courseIds.length > 0
            ? await db
                .select({
                  id: courses.id,
                  title: courses.title,
                })
                .from(courses)
                .where(inArray(courses.id, courseIds))
            : [];

        // Map untuk lookup cepat
        const coursesMap = new Map(coursesData.map((c) => [c.id, c.title]));

        // Buat data recent assignments (dengan data dummy untuk submissions)
        const recentAssignments: RecentAssignment[] = assignmentsResult.map(
          (assignment) => {
            const courseId = assignmentToCourseMap.get(assignment.id);
            const courseTitle = courseId
              ? coursesMap.get(courseId) || 'Unknown'
              : 'Unknown';
            const totalStudents = 25 + Math.floor(Math.random() * 10); // Dummy data
            const submissionCount = Math.floor(totalStudents * 0.7); // Dummy data

            return {
              id: assignment.id,
              title: assignment.title,
              courseTitle,
              dueDate: assignment.dueDate || new Date(),
              submissions: `${submissionCount}/${totalStudents}`,
              submissionCount,
              totalStudents,
              avgScore:
                Math.random() > 0.3
                  ? 70 + Math.floor(Math.random() * 20)
                  : null, // 70% chance to have score
            };
          },
        );

        return recentAssignments;
      },
      [`recent-assignments-${userId}-${limit}`],
      {
        tags: ['assignments', 'recent-assignments'],
        revalidate: 300, // 5 menit
      },
    );

    return cachedGetRecentAssignments(limit, userId);
  } catch (error) {
    console.error('Error fetching recent assignments:', error);
    return [];
  }
}
