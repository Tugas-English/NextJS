import { z } from 'zod';

export const levelSchema = z.object({
  value: z.string(),
  description: z.string(),
  score: z.number(),
});

export const criterionSchema = z.object({
  name: z.string(),
  description: z.string(),
  weight: z.number(),
  levels: z.array(levelSchema),
});

export const rubricFormSchema = z.object({
  name: z.string().min(5, { message: 'Nama rubrik minimal 5 karakter' }),
  description: z.string().min(10, { message: 'Deskripsi minimal 10 karakter' }),
  maxScore: z.number().min(10).max(100),
  isDefault: z.boolean().default(false),
  criteria: z
    .array(criterionSchema)
    .min(1, { message: 'Minimal 1 kriteria penilaian' }),
});

export const transformRubricSchema = rubricFormSchema.transform((data) => {
  const criteria = data.criteria.reduce((acc, criterion) => {
    const levels = criterion.levels.reduce((levelAcc, level) => {
      return {
        ...levelAcc,
        [level.value]: {
          description: level.description,
          score: level.score,
        },
      };
    }, {});

    const key = criterion.name.toLowerCase().replace(/ /g, '_');

    return {
      ...acc,
      [key]: {
        name: criterion.name,
        description: criterion.description,
        weight: criterion.weight,
        levels,
      },
    };
  }, {});

  return {
    ...data,
    criteria,
  };
});

export type TransformedRubric = z.infer<typeof transformRubricSchema>;
export type RubricFormValues = z.infer<typeof rubricFormSchema>;
