'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Save, Send, Trash } from 'lucide-react';
import { submitAssignment } from '@/lib/actions/student-submissions';
import { safeJsonParse } from '@/lib/utils';
import { toast } from 'sonner';

interface SubmissionFormProps {
  assignmentId: string;
  studentId: string;
  existingSubmission?: any;
  submissionChecklist: any[];
  isRevision: boolean;
  version: number;
}

export default function SubmissionForm({
  assignmentId,
  studentId,
  existingSubmission,
  submissionChecklist,
  isRevision,
  version,
}: SubmissionFormProps) {
  const router = useRouter();

  const [textResponse, setTextResponse] = useState(
    existingSubmission?.textResponse || '',
  );
  const [audioUrl, setAudioUrl] = useState(existingSubmission?.audioUrl || '');
  const [videoUrl, setVideoUrl] = useState(existingSubmission?.videoUrl || '');
  const [documentUrls, setDocumentUrls] = useState<string[]>(() => {
    if (!existingSubmission?.documentUrls) return [];

    const parsed = safeJsonParse(existingSubmission.documentUrls, []);

    if (typeof parsed === 'string') return [parsed];

    if (!Array.isArray(parsed)) return [];

    return parsed;
  });
  const [checklist, setChecklist] = useState<any[]>(() => {
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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChecklistChange = (id: string, checked: boolean) => {
    setChecklist(
      checklist.map((item) => (item.id === id ? { ...item, checked } : item)),
    );
  };

  const handleDocumentUrlChange = (index: number, url: string) => {
    const newUrls = [...documentUrls];
    newUrls[index] = url;
    setDocumentUrls(newUrls);
  };

  const addDocumentUrl = () => {
    setDocumentUrls([...documentUrls, '']);
  };

  const removeDocumentUrl = (index: number) => {
    const newUrls = [...documentUrls];
    newUrls.splice(index, 1);
    setDocumentUrls(newUrls);
  };

  const handleSaveDraft = async () => {
    await handleSubmit(true);
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    try {
      setIsSubmitting(true);

      const filteredDocumentUrls = documentUrls.filter(
        (url) => url.trim() !== '',
      );

      const validChecklist = checklist.map((item) => ({
        id: item.id || String(Math.random()),
        text: item.text || '',
        checked: Boolean(item.checked),
      }));

      const result = await submitAssignment({
        assignmentId,
        studentId,
        textResponse,
        audioUrl,
        videoUrl,
        documentUrls: filteredDocumentUrls,
        checklist: validChecklist,
        isDraft,
        version,
        submissionId: existingSubmission?.id,
      });

      if (result.error) {
        toast.error(`Gagal mengumpulkan tugas`);
      }

      const title = isDraft ? 'Draft tersimpan' : 'Tugas berhasil dikumpulkan';

      const description = isDraft
        ? 'Draft tugas Anda telah disimpan. Anda dapat melanjutkan pengerjaan nanti.'
        : 'Tugas Anda telah berhasil dikumpulkan dan menunggu penilaian.';

      toast.success(`${title} ${description}`);

      router.refresh();

      if (!isDraft) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
      toast.error('error');
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
        <p className="text-muted-foreground text-sm">
          {isRevision
            ? 'Silakan perbaiki tugas Anda sesuai dengan feedback yang diberikan.'
            : 'Isi form berikut untuk mengumpulkan tugas Anda.'}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="textResponse">Jawaban Teks</Label>
          <Textarea
            id="textResponse"
            placeholder="Tulis jawaban Anda di sini..."
            value={textResponse}
            onChange={(e) => setTextResponse(e.target.value)}
            rows={10}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="audioUrl">URL Audio (opsional)</Label>
          <Input
            id="audioUrl"
            placeholder="Masukkan URL audio (mis. link Google Drive, Soundcloud)"
            value={audioUrl}
            onChange={(e) => setAudioUrl(e.target.value)}
          />
          <p className="text-muted-foreground text-xs">
            Unggah rekaman audio ke layanan cloud dan masukkan URL-nya di sini.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="videoUrl">URL Video (opsional)</Label>
          <Input
            id="videoUrl"
            placeholder="Masukkan URL video (mis. link YouTube, Google Drive)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <p className="text-muted-foreground text-xs">
            Unggah video ke YouTube atau layanan cloud lain dan masukkan URL-nya
            di sini.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Dokumen Pendukung (opsional)</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addDocumentUrl}
            >
              Tambah Dokumen
            </Button>
          </div>

          {documentUrls.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Belum ada dokumen yang ditambahkan.
            </p>
          ) : (
            <div className="space-y-2">
              {documentUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`URL Dokumen ${index + 1}`}
                    value={url}
                    onChange={(e) =>
                      handleDocumentUrlChange(index, e.target.value)
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeDocumentUrl(index)}
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
            {checklist.map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`checklist-${item.id}`}
                  checked={item.checked}
                  onCheckedChange={(checked) =>
                    handleChecklistChange(item.id, checked === true)
                  }
                />
                <Label htmlFor={`checklist-${item.id}`} className="text-sm">
                  {item.text}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handleSaveDraft}
          disabled={isSubmitting}
        >
          <Save className="mr-2 h-4 w-4" />
          Simpan Draft
        </Button>
        <Button
          type="button"
          onClick={() => handleSubmit(false)}
          disabled={isSubmitting}
        >
          <Send className="mr-2 h-4 w-4" />
          {isRevision ? 'Kirim Revisi' : 'Kumpulkan Tugas'}
        </Button>
      </CardFooter>
    </Card>
  );
}
