'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  createAssignment,
  getActivities,
  getCourses,
  getModules,
  getRubrics,
} from '@/lib/actions/assignments';
import {
  assignmentSchema,
  AssignmentFormValues,
} from '@/lib/schemas/assignment';
import Link from 'next/link';

interface CreateAssignmentProps {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getActivities>>,
      Awaited<ReturnType<typeof getModules>>,
      Awaited<ReturnType<typeof getRubrics>>,
      Awaited<ReturnType<typeof getCourses>>,
    ]
  >;
}

export default function CreateAssignmentForm({
  promises,
}: CreateAssignmentProps) {
  const [activities, modules, rubrics, courses] = React.use(promises);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: '',
      instructions: '',
      courseId: undefined,
      allowResubmission: true,
      maxResubmissions: 3,
      isChallenge: false,
      challengePoints: 0,
      isPublished: false,
    },
  });

  async function onSubmit(data: AssignmentFormValues) {
    setIsSubmitting(true);
    try {
      const result = await createAssignment(data);

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success('Tugas berhasil dibuat!');
      router.push('/teacher/assignments');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat membuat tugas',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Buat Tugas Baru</h1>
        <Button variant="outline" asChild>
          <Link href="/teacher/assignments">Kembali</Link>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Detail Tugas</CardTitle>
              <CardDescription>
                Lengkapi detail untuk tugas baru Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul Tugas</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan judul tugas" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kelas</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kelas" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courses.courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Tugas akan diberikan ke semua siswa dalam kelas ini
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="activityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aktivitas</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih aktivitas" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {activities.activities.map((activity) => (
                            <SelectItem key={activity.id} value={activity.id}>
                              {activity.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Pilih aktivitas atau modul
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="moduleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modul</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih modul" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {modules.modules.map((module) => (
                            <SelectItem key={module.id} value={module.id}>
                              {module.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Pilih aktivitas atau modul
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instruksi Tugas</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Masukkan instruksi tugas"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rubricId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rubrik Penilaian</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih rubrik" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {rubrics.rubrics.map((rubric) => (
                          <SelectItem key={rubric.id} value={rubric.id}>
                            {rubric.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tenggat Waktu</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pilih tanggal</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Pengumpulan</CardTitle>
              <CardDescription>Atur opsi pengumpulan tugas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="allowResubmission"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Izinkan Pengumpulan Ulang
                      </FormLabel>
                      <FormDescription>
                        Siswa dapat mengumpulkan ulang tugas setelah mendapat
                        feedback
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

              {form.watch('allowResubmission') && (
                <FormField
                  control={form.control}
                  name="maxResubmissions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jumlah Maksimum Pengumpulan Ulang</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={10}
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
              )}

              <FormField
                control={form.control}
                name="isChallenge"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Jadikan Tantangan Mingguan
                      </FormLabel>
                      <FormDescription>
                        Tugas akan muncul di bagian Weekly HOTS Challenge
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

              {form.watch('isChallenge') && (
                <FormField
                  control={form.control}
                  name="challengePoints"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poin Tantangan</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={1000}
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
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Publikasi</CardTitle>
              <CardDescription>Atur status publikasi tugas</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Publikasikan Sekarang
                      </FormLabel>
                      <FormDescription>
                        Tugas akan langsung tersedia untuk siswa yang dipilih
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
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push('/teacher/assignments')}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Membuat...
                </>
              ) : (
                'Buat Tugas'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
