import { z } from 'zod';

export const submissionSchema = z.object({
  textResponse: z.string().optional(),
  audioUrl: z
    .string()
    .url({ message: 'URL audio tidak valid' })
    .optional()
    .or(z.literal('')),
  videoUrl: z
    .string()
    .url({ message: 'URL video tidak valid' })
    .optional()
    .or(z.literal('')),
  documentUrls: z.array(
    z.string().url({ message: 'URL dokumen tidak valid' }).or(z.literal('')),
  ),
  checklist: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
      checked: z.boolean(),
    }),
  ),
  isDraft: z.boolean().default(false),
});

export type SubmissionFormValues = z.infer<typeof submissionSchema>;
