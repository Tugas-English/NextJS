import { z } from "zod";

export const moduleActivitySchema = z.object({
    id: z.string(),
    activityId: z.string(),
    title: z.string(),
    isRequired: z.boolean().default(true),
    order: z.number().int().positive(),
});

export const moduleSchema = z.object({
    title: z.string().min(5, { message: "Judul minimal 5 karakter" }),
    description: z
        .string()
        .min(10, { message: "Deskripsi minimal 10 karakter" }),
    coverImage: z.string().optional(),
    skill: z
        .enum(["reading", "listening", "writing", "speaking"], {
            required_error: "Pilih jenis skill",
        })
        .optional(),
    hotsType: z
        .enum(["analyze", "evaluate", "create", "problem-solve", "infer"], {
            required_error: "Pilih tipe HOTS",
        })
        .optional(),
    difficulty: z.number().min(1).max(5).default(3),
    isPublished: z.boolean().default(false),
    activities: z.array(moduleActivitySchema).optional(),
});

export type ModuleFormValues = z.infer<typeof moduleSchema>;
export type ModuleActivityValues = z.infer<typeof moduleActivitySchema>;
