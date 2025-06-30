/* eslint-disable @next/next/no-img-element */
import { db } from '@/db';
import { modules, moduleActivities, activities, user } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Brain,
  BarChart3,
  BookOpen,
  Play,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModuleDetailPageProps {
  params: Promise<{
    moduleId: string;
  }>;
}

export default async function ModuleDetailPage({
  params,
}: ModuleDetailPageProps) {
  // Await the params promise
  const { moduleId } = await params;

  const moduleData = await db.query.modules.findFirst({
    where: and(eq(modules.id, moduleId), eq(modules.isPublished, true)),
  });

  if (!moduleData) {
    notFound();
  }

  const moduleActivitiesData = await db
    .select()
    .from(moduleActivities)
    .where(eq(moduleActivities.moduleId, moduleId))
    .orderBy(moduleActivities.order);

  const activityIds = moduleActivitiesData.map((ma) => ma.activityId);

  const activitiesData =
    activityIds.length > 0
      ? await db
          .select({
            id: activities.id,
            title: activities.title,
            description: activities.description,
            skill: activities.skill,
            hotsType: activities.hotsType,
            difficulty: activities.difficulty,
            estimatedDuration: activities.estimatedDuration,
            isPublished: activities.isPublished,
            createdBy: activities.createdBy,
          })
          .from(activities)
          .where(eq(activities.isPublished, true))
      : [];

  const creator = moduleData.createdBy
    ? await db
        .select({
          name: user.name,
          image: user.image,
        })
        .from(user)
        .where(eq(user.id, moduleData.createdBy))
        .then((res) => res[0])
    : null;

  const moduleActivitiesList = moduleActivitiesData
    .map((ma) => {
      const activityDetail = activitiesData.find((a) => a.id === ma.activityId);
      return {
        ...ma,
        activity: activityDetail || null,
      };
    })
    .filter((ma) => ma.activity && ma.activity.isPublished);

  const totalDuration = moduleActivitiesList.reduce((total, ma) => {
    return total + (ma.activity?.estimatedDuration || 0);
  }, 0);

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
              {moduleData.title}
            </h1>

            {moduleData.description && (
              <p className="text-muted-foreground">{moduleData.description}</p>
            )}

            <div className="flex flex-wrap gap-2">
              {moduleData.skill && (
                <Badge variant="outline" className="capitalize">
                  {moduleData.skill}
                </Badge>
              )}
              {moduleData.hotsType && (
                <Badge variant="secondary" className="capitalize">
                  <Brain className="mr-1 h-3 w-3" />
                  {moduleData.hotsType}
                </Badge>
              )}
              {moduleData.difficulty && (
                <Badge
                  className={cn(
                    'capitalize',
                    moduleData.difficulty <= 2
                      ? 'bg-green-500'
                      : moduleData.difficulty <= 4
                        ? 'bg-yellow-500'
                        : 'bg-red-500',
                    'text-white',
                  )}
                >
                  <BarChart3 className="mr-1 h-3 w-3" />
                  Level {moduleData.difficulty}
                </Badge>
              )}
              {totalDuration > 0 && (
                <Badge variant="outline">
                  <Clock className="mr-1 h-3 w-3" />
                  {totalDuration} menit
                </Badge>
              )}
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="overflow-hidden rounded-lg border">
              {moduleData.coverImage ? (
                <div className="relative aspect-video">
                  <img
                    src={moduleData.coverImage}
                    alt={moduleData.title}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="bg-muted flex aspect-video items-center justify-center">
                  <BookOpen className="text-muted-foreground/50 h-12 w-12" />
                </div>
              )}

              <div className="p-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Dibuat oleh:</span>
                  {creator ? (
                    <span className="font-medium">{creator.name}</span>
                  ) : (
                    <span className="font-medium">Admin</span>
                  )}
                </div>

                <div className="mt-4">
                  <Button className="w-full">Mulai Modul</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">
          Daftar Aktivitas ({moduleActivitiesList.length})
        </h2>

        {moduleActivitiesList.length === 0 ? (
          <div className="rounded-lg border p-8 text-center">
            <BookOpen className="text-muted-foreground mx-auto h-12 w-12" />
            <h3 className="mt-4 text-lg font-medium">Tidak ada aktivitas</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Modul ini belum memiliki aktivitas.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {moduleActivitiesList.map((item, index) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 p-4 md:p-6">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full">
                        {index + 1}
                      </div>
                      <div className="flex gap-2">
                        {item.activity?.skill && (
                          <Badge variant="outline" className="capitalize">
                            {item.activity.skill}
                          </Badge>
                        )}
                        {item.activity?.hotsType && (
                          <Badge variant="secondary" className="capitalize">
                            <Brain className="mr-1 h-3 w-3" />
                            {item.activity.hotsType}
                          </Badge>
                        )}
                      </div>
                      {item.isRequired && (
                        <Badge variant="destructive">Wajib</Badge>
                      )}
                    </div>

                    <h3 className="mb-2 text-lg font-semibold">
                      {item.activity?.title}
                    </h3>

                    {item.activity?.description && (
                      <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
                        {item.activity.description}
                      </p>
                    )}

                    <div className="text-muted-foreground flex items-center gap-4 text-sm">
                      {item.activity?.estimatedDuration && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{item.activity.estimatedDuration} menit</span>
                        </div>
                      )}
                      {item.activity?.difficulty && (
                        <div className="flex items-center gap-1">
                          <BarChart3 className="h-4 w-4" />
                          <span>Level {item.activity.difficulty}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-muted/30 flex flex-row items-center justify-between gap-4 p-4 md:w-48 md:flex-col md:justify-center md:p-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="text-muted-foreground h-5 w-5" />
                      <span className="text-muted-foreground text-sm">
                        Belum selesai
                      </span>
                    </div>

                    <Button asChild>
                      <Link href={`/student/activities/${item.activity?.id}`}>
                        <Play className="mr-2 h-4 w-4" />
                        Mulai
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
