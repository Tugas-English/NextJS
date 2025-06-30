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
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';
import { courseFormSchema, CourseFormValues } from '@/lib/schemas/courses';
import { createCourse } from '@/lib/actions/courses';
import { toast } from 'sonner';
import React, { useState } from 'react';
import Link from 'next/link';
import { getModules } from '@/lib/actions/modules';
import { getActivities, getStudents } from '@/lib/actions/assignments';

interface CreateCourseFormProps {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getModules>>,
      Awaited<ReturnType<typeof getActivities>>,
      Awaited<ReturnType<typeof getStudents>>,
    ]
  >;
}

export default function CreateCourseForm({ promises }: CreateCourseFormProps) {
  const [modules, activities, students] = React.use(promises);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: '',
      description: '',
      primarySkill: 'mixed',
      isActive: true,
      maxStudents: 30,
      selectedModules: [],
      selectedActivities: [],
      selectedStudents: [],
    },
  });

  async function onSubmit(data: CourseFormValues) {
    setIsSubmitting(true);
    try {
      const { course, error } = await createCourse(data);

      if (error) {
        toast.error(error);
        return;
      }

      toast.success('Kelas berhasil dibuat!');
      router.push('/teacher/courses');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Terjadi kesalahan saat membuat kelas');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tambah Kelas Baru</h1>
        <Button variant="outline" asChild>
          <Link href="/teacher/courses">Kembali</Link>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kelas</CardTitle>
              <CardDescription>
                Lengkapi informasi dasar untuk kelas baru
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Kelas</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contoh: Bahasa Inggris 10A"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Berikan nama yang jelas dan mudah dikenali
                    </FormDescription>
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
                        placeholder="Deskripsi tentang kelas ini"
                        rows={4}
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
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tanggal Mulai</FormLabel>
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

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tanggal Berakhir</FormLabel>
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="primarySkill"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skill Utama</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih skill utama" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="reading">Reading</SelectItem>
                          <SelectItem value="listening">Listening</SelectItem>
                          <SelectItem value="writing">Writing</SelectItem>
                          <SelectItem value="speaking">Speaking</SelectItem>
                          <SelectItem value="mixed">Campuran</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Skill yang akan menjadi fokus utama kelas ini
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxStudents"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jumlah Maksimum Siswa</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={100}
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

              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gambar Sampul (Opsional)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          // Handle file upload logic
                          if (e.target.files && e.target.files[0]) {
                            // Dalam implementasi sebenarnya, upload file ke server
                            // dan dapatkan URL-nya
                            field.onChange('uploaded-image-url.jpg');
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Unggah gambar sampul untuk kelas ini
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Status Aktif</FormLabel>
                      <FormDescription>
                        Kelas akan langsung aktif dan terlihat oleh siswa
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

          <Card>
            <CardHeader>
              <CardTitle>Modul Pembelajaran</CardTitle>
              <CardDescription>
                Pilih modul yang akan digunakan dalam kelas ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="selectedModules"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">
                        Modul yang Tersedia
                      </FormLabel>
                      <FormDescription>
                        Pilih satu atau lebih modul untuk kelas ini
                      </FormDescription>
                    </div>
                    <div className="space-y-2">
                      {modules.data?.map((module) => (
                        <div
                          key={module.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`module-${module.id}`}
                            checked={form
                              .watch('selectedModules')
                              .includes(module.id)}
                            onCheckedChange={(checked) => {
                              const currentValues =
                                form.getValues('selectedModules') || [];
                              if (checked) {
                                form.setValue('selectedModules', [
                                  ...currentValues,
                                  module.id,
                                ]);
                              } else {
                                form.setValue(
                                  'selectedModules',
                                  currentValues.filter(
                                    (id) => id !== module.id,
                                  ),
                                );
                              }
                            }}
                          />
                          <label
                            htmlFor={`module-${module.id}`}
                            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            <div className="flex items-center gap-2">
                              <span>{module.title}</span>
                              <span className="text-muted-foreground text-xs">
                                ({module.skill || 'mixed'})
                              </span>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                    {form.formState.errors.selectedModules && (
                      <p className="text-destructive mt-2 text-sm font-medium">
                        {form.formState.errors.selectedModules.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Pembelajaran</CardTitle>
              <CardDescription>
                Pilih aktivitas yang akan digunakan dalam kelas ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="selectedActivities"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">
                        Aktivitas yang Tersedia
                      </FormLabel>
                      <FormDescription>
                        Pilih aktivitas untuk kelas ini (opsional)
                      </FormDescription>
                    </div>
                    <div className="space-y-2">
                      {activities.activities?.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`activity-${activity.id}`}
                            checked={form
                              .watch('selectedActivities')
                              ?.includes(activity.id)}
                            onCheckedChange={(checked) => {
                              const currentValues =
                                form.getValues('selectedActivities') || [];
                              if (checked) {
                                form.setValue('selectedActivities', [
                                  ...currentValues,
                                  activity.id,
                                ]);
                              } else {
                                form.setValue(
                                  'selectedActivities',
                                  currentValues.filter(
                                    (id) => id !== activity.id,
                                  ),
                                );
                              }
                            }}
                          />
                          <label
                            htmlFor={`activity-${activity.id}`}
                            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            <div className="flex items-center gap-2">
                              <span>{activity.title}</span>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tambahkan Siswa</CardTitle>
              <CardDescription>
                Pilih siswa yang akan mengikuti kelas ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="selectedStudents"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Daftar Siswa</FormLabel>
                      <FormDescription>
                        Pilih satu atau lebih siswa untuk kelas ini
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      {students.students?.map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`student-${student.id}`}
                            checked={form
                              .watch('selectedStudents')
                              .includes(student.id)}
                            onCheckedChange={(checked) => {
                              const currentValues =
                                form.getValues('selectedStudents') || [];
                              if (checked) {
                                form.setValue('selectedStudents', [
                                  ...currentValues,
                                  student.id,
                                ]);
                              } else {
                                form.setValue(
                                  'selectedStudents',
                                  currentValues.filter(
                                    (id) => id !== student.id,
                                  ),
                                );
                              }
                            }}
                          />
                          <label
                            htmlFor={`student-${student.id}`}
                            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            <div className="flex flex-col">
                              <span>{student.name}</span>
                              <span className="text-muted-foreground text-xs">
                                {student.email}
                              </span>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                    {form.formState.errors.selectedStudents && (
                      <p className="text-destructive mt-2 text-sm font-medium">
                        {form.formState.errors.selectedStudents.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push('/teacher/courses')}
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
                'Buat Kelas'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
