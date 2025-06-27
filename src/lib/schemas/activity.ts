import { z } from "zod";

export const activitySchema = z.object({
    title: z.string().min(5, { message: "Judul minimal 5 karakter" }),
    description: z
        .string()
        .min(10, { message: "Deskripsi minimal 10 karakter" }),
    skill: z.enum(["reading", "listening", "writing", "speaking"], {
        required_error: "Pilih jenis skill",
    }),
    hotsType: z.enum(
        ["analyze", "evaluate", "create", "problem-solve", "infer"],
        {
            required_error: "Pilih tipe HOTS",
        }
    ),
    difficulty: z.number().min(1).max(5),
    estimatedDuration: z.number().min(5).max(180),
    content: z
        .string()
        .min(20, { message: "Konten utama minimal 20 karakter" }),
    instructions: z
        .string()
        .min(20, { message: "Instruksi minimal 20 karakter" }),
    isPublished: z.boolean().default(false),
    tags: z.array(z.string()).optional(),
});

export type ActivityFormValues = z.infer<typeof activitySchema>;
