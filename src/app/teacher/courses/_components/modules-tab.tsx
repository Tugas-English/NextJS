import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/db";
import { count, eq } from "drizzle-orm";
import {
    courseModules,
    modules,
    activities,
    moduleActivities,
} from "@/db/schema";

interface ModulesTabProps {
    courseId: string;
}

export async function ModulesTab({ courseId }: ModulesTabProps) {
    const modulesData = await db
        .select({
            id: modules.id,
            title: modules.title,
            description: modules.description,
            skill: modules.skill,
            difficulty: modules.difficulty,
            moduleId: courseModules.moduleId,
        })
        .from(courseModules)
        .innerJoin(modules, eq(courseModules.moduleId, modules.id))
        .where(eq(courseModules.courseId, courseId));

    const modulesWithStats = await Promise.all(
        modulesData.map(async (module) => {
            const activitiesResult = await db
                .select({ count: count() })
                .from(activities)
                .innerJoin(
                    moduleActivities,
                    eq(activities.id, moduleActivities.activityId)
                )
                .where(eq(moduleActivities.moduleId, module.id));

            const activitiesCount = activitiesResult[0]?.count || 0;

            return {
                ...module,
                activitiesCount,
                completionRate: Math.floor(Math.random() * 100), // 0-100%
            };
        })
    );

    return (
        <Card>
            <CardHeader>
                <div className='flex items-center justify-between'>
                    <div>
                        <CardTitle>Modul Pembelajaran</CardTitle>
                        <CardDescription>
                            Modul yang digunakan dalam kelas ini
                        </CardDescription>
                    </div>
                    <Button className='flex items-center gap-2' asChild>
                        <Link href={`/teacher/modules/create`}>
                            <Plus className='h-4 w-4' />
                            <span>Tambah Modul</span>
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {modulesWithStats.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        {modulesWithStats.map((module) => (
                            <Card key={module.id} className='overflow-hidden'>
                                <div className='h-2 bg-primary' />
                                <CardHeader>
                                    <CardTitle className='text-lg'>
                                        {module.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className='space-y-4'>
                                    <div className='flex items-center justify-between'>
                                        <span className='text-sm text-muted-foreground'>
                                            Aktivitas:
                                        </span>
                                        <span>{module.activitiesCount}</span>
                                    </div>
                                    <div className='space-y-1'>
                                        <div className='flex items-center justify-between'>
                                            <span className='text-sm text-muted-foreground'>
                                                Penyelesaian:
                                            </span>
                                            <span>
                                                {module.completionRate}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={module.completionRate}
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Link
                                        href={`/teacher/modules/${module.id}`}
                                        className='w-full'
                                    >
                                        <Button
                                            variant='outline'
                                            className='w-full'
                                        >
                                            Lihat Detail
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className='text-center py-8'>
                        <p className='text-muted-foreground'>
                            Belum ada modul yang ditambahkan ke kelas ini
                        </p>
                        <Button className='mt-4' asChild>
                            <Link href={`/teacher/modules/create`}>
                                <Plus className='mr-2 h-4 w-4' />
                                Tambah Modul
                            </Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
