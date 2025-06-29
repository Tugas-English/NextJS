import { z } from "zod";

export const assignmentSchema = z
    .object({
        title: z.string().min(5, { message: "Judul minimal 5 karakter" }),
        activityId: z.string().optional(),
        moduleId: z.string().optional(),
        instructions: z
            .string()
            .min(10, { message: "Instruksi minimal 10 karakter" }),
        rubricId: z.string({ required_error: "Pilih rubrik penilaian" }),
        dueDate: z.date({ required_error: "Pilih tenggat waktu" }),
        courseId: z.string({ required_error: "Pilih kelas" }),
        allowResubmission: z.boolean().default(true),
        maxResubmissions: z.number().min(0).max(10).default(3),
        isChallenge: z.boolean().default(false),
        challengePoints: z.number().min(0).max(1000).default(0),
        isPublished: z.boolean().default(false),
    })
    .refine((data) => data.activityId || data.moduleId, {
        message: "Pilih aktivitas atau modul",
        path: ["activityId"],
    });

export type AssignmentFormValues = z.infer<typeof assignmentSchema>;
