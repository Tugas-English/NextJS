'use server';

import { db } from '@/db';
import { activities, user, assignments } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { cache } from 'react';

// Get activity by ID with caching
export const getActivityById = cache(async (activityId: string) => {
  return await db.query.activities.findFirst({
    where: and(eq(activities.id, activityId), eq(activities.isPublished, true)),
  });
});

// Get activity creator info
export const getActivityCreator = cache(async (userId: string) => {
  return await db
    .select({
      name: user.name,
      image: user.image,
    })
    .from(user)
    .where(eq(user.id, userId))
    .then((res) => res[0]);
});

// Get related assignments
export const getRelatedAssignments = cache(async (activityId: string) => {
  return await db
    .select()
    .from(assignments)
    .where(eq(assignments.activityId, activityId))
    .limit(1);
});
