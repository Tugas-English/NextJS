// src/app/student/assignments/_components/submission-form.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Save, Send, Trash, Plus, AlertTriangle, InfoIcon } from 'lucide-react';
import { submitAssignment } from '@/lib/actions/student-submissions';
import { safeJsonParse } from '@/lib/utils';
import { toast } from 'sonner';
import {
  submissionSchema,
  type SubmissionFormValues,
} from '@/lib/schemas/submission';

interface SubmissionFormProps {
  assignmentId: string;
  studentId: string;
  existingSubmission?: any;
  submissionChecklist: any[];
  isRevision: boolean;
  version: number;
  maxResubmissions?: number;
  assignmentDetails?: {
    allowResubmission: boolean;
    maxResubmissions: number;
    title: string;
  };
}

export default function SubmissionForm({
  assignmentId,
  studentId,
  existingSubmission,
  submissionChecklist,
  isRevision,
  version,
  maxResubmissions = 3,
  assignmentDetails,
}: SubmissionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cek apakah sudah mencapai batas pengumpulan ulang
  const reachedMaxResubmissions =
    version > (assignmentDetails?.maxResubmissions || maxResubmissions);
  const isLastSubmission =
    version === (assignmentDetails?.maxResubmissions || maxResubmissions);
  const remainingSubmissions = Math.max(
    0,
    (assignmentDetails?.maxResubmissions || maxResubmissions) - version + 1,
  );

  const defaultChecklist = () => {
    if (submissionChecklist && submissionChecklist.length > 0) {
      return submissionChecklist;
    }

    if (existingSubmission?.checklist) {
      const parsed = safeJsonParse(existingSubmission.checklist, []);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }

    return [
      {
        id: '1',
        text: 'Saya sudah membaca instruksi dengan seksama',
        checked: false,
      },
      {
        id: '2',
        text: 'Saya sudah menerapkan konsep HOTS dalam jawaban',
        checked: false,
      },
      {
        id: '3',
        text: 'Saya sudah memeriksa tata bahasa dan ejaan',
        checked: false,
      },
      {
        id: '4',
        text: 'Saya sudah melampirkan semua file yang diperlukan',
        checked: false,
      },
    ];
  };

  const defaultDocumentUrls = () => {
    if (!existingSubmission?.documentUrls) return [];

    const parsed = safeJsonParse(existingSubmission.documentUrls, []);

    if (typeof parsed === 'string') return [parsed];

    if (!Array.isArray(parsed)) return [];

    return parsed;
  };

  const form = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      textResponse: existingSubmission?.textResponse || '',
      audioUrl: existingSubmission?.audioUrl || '',
      videoUrl: existingSubmission?.videoUrl || '',
      documentUrls: defaultDocumentUrls(),
      checklist: defaultChecklist(),
      isDraft: false,
    },
  });

  const {
    fields: documentFields,
    append: appendDocument,
    remove: removeDocument,
  } = useFieldArray({
    control: form.control,
    name: 'documentUrls' as never,
  });

  const addDocumentUrl = () => {
    appendDocument('');
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    try {
      setIsSubmitting(true);

      form.setValue('isDraft', isDraft);

      const valid = await form.trigger();
      if (!valid && !isDraft) {
        toast.error('Mohon periksa kembali form pengumpulan');
        setIsSubmitting(false);
        return;
      }

      // Jika mencapai batas pengumpulan dan bukan draft, tampilkan pesan error
      if (reachedMaxResubmissions && !isDraft && isRevision) {
        toast.error(
          `Anda telah mencapai batas maksimal pengumpulan ulang (${maxResubmissions}x)`,
        );
        setIsSubmitting(false);
        return;
      }

      const values = form.getValues();

      const filteredDocumentUrls = values.documentUrls.filter(
        (url) => url.trim() !== '',
      );

      const validChecklist = values.checklist.map((item) => ({
        id: item.id || String(Math.random()),
        text: item.text || '',
        checked: Boolean(item.checked),
      }));

      const result = await submitAssignment({
        assignmentId,
        studentId,
        textResponse: values.textResponse,
        audioUrl: values.audioUrl,
        videoUrl: values.videoUrl,
        documentUrls: filteredDocumentUrls,
        checklist: validChecklist,
        isDraft,
        version,
        submissionId: existingSubmission?.id,
      });

      if (result.error) {
        toast.error(`Gagal mengumpulkan tugas: ${result.error}`);
        return;
      }

      const title = isDraft ? 'Draft tersimpan' : 'Tugas berhasil dikumpulkan';
      const description = isDraft
        ? 'Draft tugas Anda telah disimpan. Anda dapat melanjutkan pengerjaan nanti.'
        : 'Tugas Anda telah berhasil dikumpulkan dan menunggu penilaian.';

      toast.success(`${title}`, {
        description: description,
      });

      router.refresh();

      if (!isDraft) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
      toast.error('Terjadi kesalahan saat mengumpulkan tugas');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold">
          {isRevision
            ? 'Revisi Tugas'
            : existingSubmission?.isDraft
              ? 'Lanjutkan Pengerjaan'
              : 'Kumpulkan Tugas'}
        </h3>
        <CardDescription>
          {isRevision
            ? 'Silakan perbaiki tugas Anda sesuai dengan feedback yang diberikan.'
            : 'Isi form berikut untuk mengumpulkan tugas Anda.'}
        </CardDescription>

        {isRevision && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Pengumpulan ulang:</span>
              <span className="font-medium">
                Maksimal{' '}
                {assignmentDetails?.maxResubmissions || maxResubmissions}x (
                {Math.min(
                  version - 1,
                  assignmentDetails?.maxResubmissions || maxResubmissions,
                )}
                /{assignmentDetails?.maxResubmissions || maxResubmissions})
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Versi</span>
              <span className="font-medium">{version}</span>
            </div>

            {isLastSubmission && (
              <Alert className="mt-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Perhatian</AlertTitle>
                <AlertDescription>
                  Ini adalah kesempatan terakhir Anda untuk melakukan revisi.
                </AlertDescription>
              </Alert>
            )}

            {reachedMaxResubmissions && (
              <Alert variant="destructive" className="mt-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Batas revisi tercapai</AlertTitle>
                <AlertDescription>
                  Anda telah mencapai batas maksimal pengumpulan ulang. Tidak
                  dapat melakukan revisi lagi.
                </AlertDescription>
              </Alert>
            )}

            {!reachedMaxResubmissions && !isLastSubmission && (
              <Alert variant="default" className="mt-2">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Informasi</AlertTitle>
                <AlertDescription>
                  Anda masih memiliki {remainingSubmissions} kesempatan lagi
                  untuk melakukan revisi.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardHeader>

      <Form {...form}>
        <form>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="textResponse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="textResponse">Jawaban Teks</FormLabel>
                  <FormControl>
                    <Textarea
                      id="textResponse"
                      placeholder="Tulis jawaban Anda di sini..."
                      rows={10}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="audioUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="audioUrl">URL Audio (opsional)</FormLabel>
                  <FormControl>
                    <Input
                      id="audioUrl"
                      placeholder="Masukkan URL audio (mis. link Google Drive, Soundcloud)"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-muted-foreground text-xs">
                    Unggah rekaman audio ke layanan cloud dan masukkan URL-nya
                    di sini.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="videoUrl">URL Video (opsional)</FormLabel>
                  <FormControl>
                    <Input
                      id="videoUrl"
                      placeholder="Masukkan URL video (mis. link YouTube, Google Drive)"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-muted-foreground text-xs">
                    Unggah video ke YouTube atau layanan cloud lain dan masukkan
                    URL-nya di sini.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Dokumen Pendukung (opsional)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addDocumentUrl}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Dokumen
                </Button>
              </div>

              {documentFields.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Belum ada dokumen yang ditambahkan.
                </p>
              ) : (
                <div className="space-y-2">
                  {documentFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`documentUrls.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                placeholder={`URL Dokumen ${index + 1}`}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeDocument(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-muted-foreground text-xs">
                Unggah dokumen ke layanan cloud dan masukkan URL-nya di sini.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Checklist Pengumpulan</Label>
              <div className="space-y-2 rounded-md border p-4">
                {form.getValues().checklist.map((item, index) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <FormField
                      control={form.control}
                      name={`checklist.${index}.checked`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                          <FormControl>
                            <Checkbox
                              id={`checklist-${item.id}`}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel
                            htmlFor={`checklist-${item.id}`}
                            className="text-sm font-normal"
                          >
                            {item.text}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
            >
              <Save className="mr-2 h-4 w-4" />
              Simpan Draft
            </Button>
            <Button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting || (reachedMaxResubmissions && isRevision)}
            >
              <Send className="mr-2 h-4 w-4" />
              {isRevision ? 'Kirim Revisi' : 'Kumpulkan Tugas'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
