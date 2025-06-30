'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Plus, Trash2 } from 'lucide-react';
import {
  RubricFormValues,
  rubricFormSchema,
  transformRubricSchema,
} from '@/lib/schemas/rubrics';
import { createRubric } from '@/lib/actions/rubrics';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/auth';
import { toast } from 'sonner';

interface CreateRubricsFormProps {
  user?: User;
}
export default function CreateRubricsForm({ user }: CreateRubricsFormProps) {
  const router = useRouter();

  const form = useForm<RubricFormValues>({
    resolver: zodResolver(rubricFormSchema),
    defaultValues: {
      name: 'testingggggggggggg',
      description: 'ddddddddddddddddddddddddddddddd',
      maxScore: 100,
      isDefault: false,
      criteria: [
        {
          name: 'HOTS Integration & Variety',
          description:
            'Sejauh mana siswa menerapkan berbagai keterampilan berpikir tingkat tinggi',
          weight: 40,
          levels: [
            {
              value: '4',
              description: 'Integrasi HOTS sangat baik',
              score: 40,
            },
            {
              value: '3',
              description: 'Integrasi HOTS baik',
              score: 30,
            },
            {
              value: '2',
              description: 'Integrasi HOTS cukup',
              score: 20,
            },
            {
              value: '1',
              description: 'Integrasi HOTS kurang',
              score: 10,
            },
          ],
        },
        {
          name: 'Clarity & Scaffolding',
          description: 'Kejelasan dan struktur dalam menyampaikan pemikiran',
          weight: 35,
          levels: [
            {
              value: '4',
              description: 'Sangat jelas dan terstruktur',
              score: 35,
            },
            {
              value: '3',
              description: 'Jelas dan terstruktur',
              score: 26,
            },
            { value: '2', description: 'Cukup jelas', score: 17 },
            { value: '1', description: 'Kurang jelas', score: 8 },
          ],
        },
      ],
    },
  });

  const {
    fields: criteriaFields,
    append: appendCriteria,
    remove: removeCriteria,
  } = useFieldArray({
    control: form.control,
    name: 'criteria',
  });

  async function onSubmit(data: RubricFormValues) {
    if (!user) {
      toast.error('Anda harus login terlebih dahulu');
      return;
    }
    try {
      const { rubric, error } = await createRubric(data);

      if (error || !rubric) {
        toast.error(error || 'Gagal membuat aktivitas');
      }

      alert('Rubrik berhasil dibuat!');
      router.push('/teacher/rubrics');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Terjadi kesalahan saat membuat rubrik');
    }
  }

  const getTransformedData = () => {
    try {
      const formData = form.getValues();
      return transformRubricSchema.parse(formData);
    } catch (error) {
      console.error('Error transforming data:', error);
      return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Buat Rubrik Penilaian</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Detail Rubrik</CardTitle>
              <CardDescription>
                Lengkapi detail untuk rubrik penilaian baru
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Rubrik</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama rubrik" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Masukkan deskripsi rubrik"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="maxScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skor Maksimum: {field.value}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={10}
                          max={100}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Skor total maksimum untuk rubrik ini
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isDefault"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Jadikan Rubrik Default
                        </FormLabel>
                        <FormDescription>
                          Rubrik ini akan menjadi pilihan default saat membuat
                          tugas
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Kriteria Penilaian</CardTitle>
                <CardDescription>
                  Tambahkan kriteria dan bobot penilaian
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  appendCriteria({
                    name: '',
                    description: '',
                    weight: 25,
                    levels: [
                      {
                        value: '4',
                        description: 'Sangat baik',
                        score: 25,
                      },
                      {
                        value: '3',
                        description: 'Baik',
                        score: 19,
                      },
                      {
                        value: '2',
                        description: 'Cukup',
                        score: 13,
                      },
                      {
                        value: '1',
                        description: 'Kurang',
                        score: 6,
                      },
                    ],
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Tambah Kriteria
              </Button>
            </CardHeader>
            <CardContent className="space-y-8">
              {criteriaFields.map((field, index) => (
                <div key={field.id} className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                      Kriteria {index + 1}
                    </h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCriteria(index)}
                      disabled={criteriaFields.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name={`criteria.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Kriteria</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Contoh: HOTS Integration"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`criteria.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deskripsi Kriteria</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Jelaskan kriteria ini secara detail"
                            rows={2}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`criteria.${index}.weight`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bobot: {field.value}%</FormLabel>
                        <FormControl>
                          <Slider
                            min={5}
                            max={100}
                            step={5}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                          />
                        </FormControl>
                        <FormDescription>
                          Persentase bobot kriteria ini dalam penilaian total
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <h4 className="font-medium">Level Penilaian</h4>

                    {form
                      .getValues(`criteria.${index}.levels`)
                      ?.map((_, levelIndex) => (
                        <div
                          key={levelIndex}
                          className="grid grid-cols-3 items-center gap-2"
                        >
                          <FormField
                            control={form.control}
                            name={`criteria.${index}.levels.${levelIndex}.value`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="Level" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`criteria.${index}.levels.${levelIndex}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder="Deskripsi level"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`criteria.${index}.levels.${levelIndex}.score`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Skor"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              ))}

              {form.formState.errors.criteria?.message && (
                <p className="text-destructive text-sm font-medium">
                  {form.formState.errors.criteria?.message}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Review Format JSON</CardTitle>
              <CardDescription>
                Preview format JSON dari rubrik ini sebelum disimpan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="max-h-64 overflow-auto rounded-md p-4 text-xs">
                  {JSON.stringify(getTransformedData(), null, 2)}
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-5"
                  onClick={() => {
                    const data = getTransformedData();
                    if (data) {
                      navigator.clipboard.writeText(
                        JSON.stringify(data, null, 2),
                      );
                      alert('JSON berhasil disalin!');
                    }
                  }}
                >
                  Salin JSON
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button">
              Batal
            </Button>
            <Button type="submit">Simpan Rubrik</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
