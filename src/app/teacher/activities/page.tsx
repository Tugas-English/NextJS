import { Suspense } from "react";
import { ActivitiesTable } from "./_components/activitity-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import {
    getActivities,
    getActivitySkillCounts,
    getActivityHotsTypeCounts,
    getDifficultyRange,
} from "@/lib/actions/activities";
import { getServerSession } from "@/lib/session";
import { SearchParams } from "@/types";

interface ActivitiesPageProps {
    searchParams: Promise<SearchParams>;
}

export default async function ActivitiesPage(props: ActivitiesPageProps) {
    const session = await getServerSession();
    const searchParams = await props.searchParams;

    const page = Number(searchParams.page) || 1;
    const perPage = Number(searchParams.perPage) || 10;
    const skill = searchParams.skill;
    const hotsType = searchParams.hotsType;
    const difficulty = searchParams.difficulty
        ? Array.isArray(searchParams.difficulty)
            ? searchParams.difficulty.map(Number)
            : Number(searchParams.difficulty)
        : undefined;
    const search = searchParams.search?.toString();

    const activitiesPromise = Promise.all([
        getActivities({
            page,
            perPage,
            skill,
            hotsType,
            difficulty,
            search,
            createdBy: session?.user?.id,
        }),
        getActivitySkillCounts(),
        getActivityHotsTypeCounts(),
        getDifficultyRange(),
    ]);

    return (
        <div className='space-y-4 p-4 sm:p-6 lg:p-8'>
            <div className='flex items-center justify-between'>
                <h1 className='text-3xl font-bold'>Aktivitas</h1>
                <Button asChild>
                    <Link href='/teacher/activities/create'>
                        <Plus className='mr-2 h-4 w-4' />
                        Buat Aktivitas
                    </Link>
                </Button>
            </div>
            <Suspense
                fallback={
                    <DataTableSkeleton
                        columnCount={6}
                        filterCount={3}
                        rowCount={5}
                    />
                }
            >
                <ActivitiesTable promises={activitiesPromise} />
            </Suspense>
        </div>
    );
}
