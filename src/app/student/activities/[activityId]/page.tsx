import { db } from '@/db';
import { activities, user, assignments } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Brain,
  BarChart3,
  Clock,
  FileText,
  Video,
  AudioLines,
  File,
  PenTool,
  Download,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getServerSession } from '@/lib/session';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ActivityDetailPageProps {
  params: {
    activityId: string;
  };
}

function safeJsonParse(value: any, fallback: any = []) {
  if (!value) return fallback;

  if (typeof value === 'object') return value;

  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (error) {
      console.error('Error parsing JSON:', error);

      if (value.startsWith('http')) {
        return [{ url: value, name: 'Lampiran' }];
      }

      return fallback;
    }
  }

  return fallback;
}

export default async function ActivityDetailPage({
  params,
}: ActivityDetailPageProps) {
  const { activityId } = params;
  const session = await getServerSession();

  if (!session?.user) {
    return (
      <div className="container py-12">
        <Alert>
          <AlertTitle>Akses Dibatasi</AlertTitle>
          <AlertDescription>
            Anda harus login untuk melihat aktivitas ini.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Ambil detail aktivitas
  const activityData = await db.query.activities.findFirst({
    where: and(eq(activities.id, activityId), eq(activities.isPublished, true)),
  });

  if (!activityData) {
    notFound();
  }

  // Ambil informasi pembuat aktivitas
  const creator = activityData.createdBy
    ? await db
        .select({
          name: user.name,
          image: user.image,
        })
        .from(user)
        .where(eq(user.id, activityData.createdBy))
        .then((res) => res[0])
    : null;

  // Cek apakah ada tugas terkait aktivitas ini
  const relatedAssignments = await db
    .select()
    .from(assignments)
    .where(eq(assignments.activityId, activityId))
    .limit(1);

  const hasAssignment = relatedAssignments.length > 0;

  // Parse JSON data dengan aman
  const scaffoldingSteps = safeJsonParse(activityData.scaffoldingSteps, []);
  const attachmentUrls = safeJsonParse(activityData.attachmentUrls, []);

  console.log('Scaffolding Steps:', activityData.scaffoldingSteps);
  console.log('Parsed Scaffolding Steps:', scaffoldingSteps);
  console.log('Attachment URLs:', activityData.attachmentUrls);
  console.log('Parsed Attachment URLs:', attachmentUrls);

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/student/modules" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Modul
          </Link>
        </Button>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-4 md:col-span-2">
            <h1 className="text-2xl font-bold md:text-3xl">
              {activityData.title}
            </h1>

            {activityData.description && (
              <p className="text-muted-foreground">
                {activityData.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {activityData.skill && (
                <Badge variant="outline" className="capitalize">
                  {activityData.skill}
                </Badge>
              )}
              {activityData.hotsType && (
                <Badge variant="secondary" className="capitalize">
                  <Brain className="mr-1 h-3 w-3" />
                  {activityData.hotsType}
                </Badge>
              )}
              {activityData.difficulty && (
                <Badge
                  className={cn(
                    'capitalize',
                    activityData.difficulty <= 2
                      ? 'bg-green-500'
                      : activityData.difficulty <= 4
                        ? 'bg-yellow-500'
                        : 'bg-red-500',
                    'text-white',
                  )}
                >
                  <BarChart3 className="mr-1 h-3 w-3" />
                  Level {activityData.difficulty}
                </Badge>
              )}
              {activityData.estimatedDuration && (
                <Badge variant="outline">
                  <Clock className="mr-1 h-3 w-3" />
                  {activityData.estimatedDuration} menit
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="content">Konten</TabsTrigger>
              <TabsTrigger value="instructions">Instruksi</TabsTrigger>
              {Array.isArray(scaffoldingSteps) &&
                scaffoldingSteps.length > 0 && (
                  <TabsTrigger value="scaffolding">Langkah Bantuan</TabsTrigger>
                )}
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              {activityData.content && (
                <Card>
                  <CardHeader>
                    <h3 className="flex items-center gap-2 text-lg font-medium">
                      <FileText className="h-5 w-5" />
                      Materi Pembelajaran
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: activityData.content,
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {activityData.audioUrl && (
                <Card>
                  <CardHeader>
                    <h3 className="flex items-center gap-2 text-lg font-medium">
                      <AudioLines className="h-5 w-5" />
                      Audio
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <audio controls className="w-full">
                      <source src={activityData.audioUrl} />
                      Browser Anda tidak mendukung pemutaran audio.
                    </audio>
                  </CardContent>
                </Card>
              )}

              {activityData.videoUrl && (
                <Card>
                  <CardHeader>
                    <h3 className="flex items-center gap-2 text-lg font-medium">
                      <Video className="h-5 w-5" />
                      Video
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="relative aspect-video overflow-hidden rounded-md">
                      {activityData.videoUrl.includes('youtube') ||
                      activityData.videoUrl.includes('youtu.be') ? (
                        <iframe
                          width="100%"
                          height="100%"
                          src={activityData.videoUrl.replace(
                            'watch?v=',
                            'embed/',
                          )}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0"
                        ></iframe>
                      ) : (
                        <video controls className="h-full w-full">
                          <source src={activityData.videoUrl} />
                          Browser Anda tidak mendukung pemutaran video.
                        </video>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {Array.isArray(attachmentUrls) && attachmentUrls.length > 0 && (
                <Card>
                  <CardHeader>
                    <h3 className="flex items-center gap-2 text-lg font-medium">
                      <File className="h-5 w-5" />
                      Lampiran
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {attachmentUrls.map((attachment: any, index: number) => {
                        // Handle both object format and string format
                        const url =
                          typeof attachment === 'string'
                            ? attachment
                            : attachment.url;
                        const name =
                          typeof attachment === 'string'
                            ? `Lampiran ${index + 1}`
                            : attachment.name || `Lampiran ${index + 1}`;

                        return (
                          <li key={index}>
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="w-full justify-start"
                            >
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                              >
                                <FileText className="h-4 w-4" />
                                <span>{name}</span>
                                <Download className="ml-auto h-4 w-4" />
                              </a>
                            </Button>
                          </li>
                        );
                      })}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="instructions">
              <Card>
                <CardHeader>
                  <h3 className="flex items-center gap-2 text-lg font-medium">
                    <PenTool className="h-5 w-5" />
                    Instruksi Aktivitas
                  </h3>
                </CardHeader>
                <CardContent>
                  {activityData.instructions ? (
                    <div className="prose prose-sm max-w-none">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: activityData.instructions,
                        }}
                      />
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Tidak ada instruksi khusus untuk aktivitas ini.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {Array.isArray(scaffoldingSteps) && scaffoldingSteps.length > 0 && (
              <TabsContent value="scaffolding">
                <Card>
                  <CardHeader>
                    <h3 className="flex items-center gap-2 text-lg font-medium">
                      <Brain className="h-5 w-5" />
                      Langkah Bantuan Berpikir
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <ol className="list-inside list-decimal space-y-4">
                      {scaffoldingSteps.map((step: any, index: number) => (
                        <li key={index} className="pl-2">
                          <div className="font-medium">
                            {step.title || `Langkah ${step.step || index + 1}`}
                          </div>
                          {step.description && (
                            <p className="text-muted-foreground mt-1 ml-6 text-sm">
                              {step.description}
                            </p>
                          )}
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>

        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Informasi Aktivitas</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium">Jenis Keterampilan</div>
                <div className="text-muted-foreground text-sm capitalize">
                  {activityData.skill || 'Tidak ditentukan'}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Tipe HOTS</div>
                <div className="text-muted-foreground text-sm capitalize">
                  {activityData.hotsType || 'Tidak ditentukan'}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Tingkat Kesulitan</div>
                <div className="text-muted-foreground text-sm">
                  Level {activityData.difficulty || 'Tidak ditentukan'}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Estimasi Durasi</div>
                <div className="text-muted-foreground text-sm">
                  {activityData.estimatedDuration
                    ? `${activityData.estimatedDuration} menit`
                    : 'Tidak ditentukan'}
                </div>
              </div>
              {creator && (
                <div>
                  <div className="text-sm font-medium">Dibuat oleh</div>
                  <div className="text-muted-foreground text-sm">
                    {creator.name}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {hasAssignment && (
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <h3 className="flex items-center gap-2 text-lg font-medium">
                  <FileText className="h-5 w-5" />
                  Tugas Terkait
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm">
                  Aktivitas ini memiliki tugas yang perlu Anda kerjakan.
                </p>
                <Button asChild className="w-full">
                  <Link
                    href={`/student/assignments/${relatedAssignments[0].id}`}
                  >
                    Lihat Tugas
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Diskusi</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                Diskusikan aktivitas ini dengan teman sekelas dan guru Anda.
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link href={`/student/discussions?activityId=${activityId}`}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Lihat Diskusi
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
