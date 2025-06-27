"use server";

import { db } from "@/db";
import { activities } from "@/db/schema";
import { ActivityFormValues } from "@/lib/schemas/activity";

export async function createActivity(data: ActivityFormValues, userId: string) {
    try {
        // Generate ID unik
        const id = crypto.randomUUID();

        // Simpan ke database
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
                scaffoldingSteps: [],
                audioUrl: null,
                videoUrl: null,
                attachmentUrls: [],
                isPublished: data.isPublished,
                tags: data.tags || [],
                createdBy: userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .returning();

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
