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
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  ActivityFormValues,
  ScaffoldingStep,
  activitySchema,
} from '@/lib/schemas/activity';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Save, Trash } from 'lucide-react';
import { updateActivity } from '@/lib/actions/activities';
import { Activitie } from '@/db/schema';

interface ActivityEditFormProps {
  activity: Activitie;
  userId?: string;
}

export function ActivityEditForm({ activity, userId }: ActivityEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [newAttachment, setNewAttachment] = useState('');
  const [newScaffoldingStep, setNewScaffoldingStep] = useState<
    Partial<ScaffoldingStep>
  >({
    step: 1,
    title: '',
    description: '',
  });
  const router = useRouter();

  const defaultValues: ActivityFormValues = {
    title: activity.title,
    description: activity.description || '',
    skill: activity.skill,
    hotsType: activity.hotsType,
    difficulty: activity.difficulty,
    estimatedDuration: activity.estimatedDuration || 30,
    content: activity.content || '',
    instructions: activity.instructions || '',
    scaffoldingSteps: (activity.scaffoldingSteps as any[]) || [],
    audioUrl: activity.audioUrl || '',
    videoUrl: activity.videoUrl || '',
    attachmentUrls: (activity.attachmentUrls as string[]) || [],
    isPublished: activity.isPublished,
    tags: (activity.tags as string[]) || [],
  };

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues,
    mode: 'onChange',
  });

  const { watch, setValue } = form;
  const currentTags = watch('tags') || [];
  const currentAttachments = watch('attachmentUrls') || [];
  const currentScaffoldingSteps = watch('scaffoldingSteps') || [];

  const addTag = () => {
    if (newTag.trim() && !currentTags.includes(newTag.trim())) {
      setValue('tags', [...currentTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue(
      'tags',
      currentTags.filter((tag) => tag !== tagToRemove),
    );
  };

  const addAttachment = () => {
    if (
      newAttachment.trim() &&
      !currentAttachments.includes(newAttachment.trim())
    ) {
      setValue('attachmentUrls', [...currentAttachments, newAttachment.trim()]);
      setNewAttachment('');
    }
  };

  const removeAttachment = (urlToRemove: string) => {
    setValue(
      'attachmentUrls',
      currentAttachments.filter((url) => url !== urlToRemove),
    );
  };

  const addScaffoldingStep = () => {
    if (
      newScaffoldingStep.title?.trim() &&
      newScaffoldingStep.description?.trim()
    ) {
      const step = {
        step: currentScaffoldingSteps.length + 1,
        title: newScaffoldingStep.title.trim(),
        description: newScaffoldingStep.description.trim(),
      };
      setValue('scaffoldingSteps', [...currentScaffoldingSteps, step]);
      setNewScaffoldingStep({
        step: currentScaffoldingSteps.length + 2,
        title: '',
        description: '',
      });
    }
  };

  const removeScaffoldingStep = (stepIndex: number) => {
    const updatedSteps = currentScaffoldingSteps
      .filter((_, index) => index !== stepIndex)
      .map((step, index) => ({ ...step, step: index + 1 }));
    setValue('scaffoldingSteps', updatedSteps);
    setNewScaffoldingStep({
      ...newScaffoldingStep,
      step: updatedSteps.length + 1,
    });
  };

  async function onSubmit(data: ActivityFormValues) {
    if (!userId) {
      toast.error('Anda harus login terlebih dahulu');
      return;
    }

    setIsSubmitting(true);

    try {
      const { activity: updatedActivity, error } = await updateActivity(
        activity.id,
        data,
        userId,
      );

      if (error || !updatedActivity) {
        throw new Error(error || 'Gagal memperbarui aktivitas');
      }

      toast.success('Aktivitas berhasil diperbarui!');
      router.push(`/teacher/activities/${activity.id}`);
      router.refresh();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat memperbarui aktivitas',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Detail Aktivitas</CardTitle>
              <CardDescription>
                Lengkapi detail untuk aktivitas HOTS Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan judul aktivitas"
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
                  name="skill"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skill</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih skill" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="reading">Reading</SelectItem>
                          <SelectItem value="listening">Listening</SelectItem>
                          <SelectItem value="writing">Writing</SelectItem>
                          <SelectItem value="speaking">Speaking</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hotsType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipe HOTS</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih tipe HOTS" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="analyze">Analyze</SelectItem>
                          <SelectItem value="evaluate">Evaluate</SelectItem>
                          <SelectItem value="create">Create</SelectItem>
                          <SelectItem value="problem-solve">
                            Problem Solve
                          </SelectItem>
                          <SelectItem value="infer">Infer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Masukkan deskripsi aktivitas"
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
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tingkat Kesulitan: {field.value}</FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={5}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                        />
                      </FormControl>
                      <FormDescription>
                        1 (Mudah) hingga 5 (Sangat Sulit)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimatedDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Durasi Estimasi: {field.value} menit
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={5}
                          max={180}
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

              {/* Tags Input */}
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <div className="flex gap-2">
                  <Input
                    placeholder="Tambahkan tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag}>
                    <Plus className="mr-1 h-4 w-4" />
                    Tambah
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {currentTags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <FormDescription>
                  Tambahkan tag untuk memudahkan pencarian aktivitas
                </FormDescription>
              </FormItem>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Konten Aktivitas</CardTitle>
              <CardDescription>
                Tambahkan konten utama dan instruksi untuk aktivitas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konten Utama</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Masukkan konten utama aktivitas"
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Teks utama yang akan dibaca/didengar/dilihat siswa
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instruksi</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Masukkan instruksi langkah demi langkah"
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Panduan langkah demi langkah untuk siswa
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Media URLs */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="audioUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Audio</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/audio.mp3"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormDescription>
                        URL audio untuk aktivitas listening
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="videoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Video</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://youtube.com/watch?v=..."
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormDescription>
                        URL video untuk aktivitas visual
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Attachment URLs */}
              <FormItem>
                <FormLabel>URL Lampiran</FormLabel>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com/document.pdf"
                    value={newAttachment}
                    onChange={(e) => setNewAttachment(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addAttachment();
                      }
                    }}
                  />
                  <Button type="button" onClick={addAttachment}>
                    <Plus className="mr-1 h-4 w-4" />
                    Tambah
                  </Button>
                </div>
                <div className="mt-2 flex flex-col gap-2">
                  {currentAttachments.map((url, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded border p-2"
                    >
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-blue-500 hover:underline"
                      >
                        {url}
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(url)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <FormDescription>
                  Tambahkan URL dokumen atau sumber daya tambahan
                </FormDescription>
              </FormItem>

              {/* Scaffolding Steps */}
              <FormItem>
                <FormLabel>Langkah-langkah Scaffolding</FormLabel>
                <Card>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <FormLabel>Judul Langkah</FormLabel>
                      <Input
                        placeholder="Judul langkah"
                        value={newScaffoldingStep.title || ''}
                        onChange={(e) =>
                          setNewScaffoldingStep({
                            ...newScaffoldingStep,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <FormLabel>Deskripsi Langkah</FormLabel>
                      <Textarea
                        placeholder="Deskripsi langkah"
                        value={newScaffoldingStep.description || ''}
                        onChange={(e) =>
                          setNewScaffoldingStep({
                            ...newScaffoldingStep,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Button type="button" onClick={addScaffoldingStep}>
                      <Plus className="mr-1 h-4 w-4" />
                      Tambah Langkah
                    </Button>
                  </CardContent>
                </Card>

                <div className="mt-4 space-y-2">
                  {currentScaffoldingSteps.map((step, index) => (
                    <Card key={index}>
                      <CardHeader className="px-4 py-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">
                            Langkah {step.step}: {step.title}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeScaffoldingStep(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="px-4 py-2">
                        <p className="text-sm">{step.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <FormDescription>
                  Tambahkan langkah-langkah scaffolding untuk membantu siswa
                </FormDescription>
              </FormItem>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Publikasi</CardTitle>
              <CardDescription>Atur status publikasi aktivitas</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Publikasikan</FormLabel>
                      <FormDescription>
                        Aktivitas akan tersedia untuk siswa
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
              onClick={() => router.push(`/teacher/activities/${activity.id}`)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                'Menyimpan...'
              ) : (
                <>
                  <Save className="mr-1 h-4 w-4" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
