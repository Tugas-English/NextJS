import { z } from "zod";

export const courseFormSchema = z.object({
    title: z.string().min(5, { message: "Nama kelas minimal 5 karakter" }),
    description: z
        .string()
        .min(10, { message: "Deskripsi minimal 10 karakter" }),
    coverImage: z.string().optional(),
    primarySkill: z.enum(
        ["reading", "listening", "writing", "speaking", "mixed"],
        {
            required_error: "Pilih skill utama",
        }
    ),
    startDate: z.date({ required_error: "Pilih tanggal mulai" }),
    endDate: z.date({ required_error: "Pilih tanggal berakhir" }),
    maxStudents: z.number().min(1).max(100),
    isActive: z.boolean().default(true),
    selectedModules: z
        .array(z.string())
        .min(1, { message: "Pilih minimal 1 modul" }),
    selectedActivities: z.array(z.string()).optional(),
    selectedStudents: z
        .array(z.string())
        .min(1, { message: "Pilih minimal 1 siswa" }),
});

export type CourseFormValues = z.infer<typeof courseFormSchema>;
