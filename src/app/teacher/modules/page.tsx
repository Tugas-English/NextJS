import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import {
    getModules,
    getModuleSkillCounts,
    getModuleHotsTypeCounts,
    getDifficultyRange,
} from "@/lib/actions/modules";
import { getServerSession } from "@/lib/session";
import { SearchParams } from "@/types";
import { ModulesTable } from "./_components/modules-table";

interface ModulesPageProps {
    searchParams: Promise<SearchParams>;
}

export default async function ModulesPage(props: ModulesPageProps) {
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

    const modulesPromise = Promise.all([
        getModules({
            page,
            perPage,
            skill,
            hotsType,
            difficulty,
            search,
            createdBy: session?.user?.id,
        }),
        getModuleSkillCounts(),
        getModuleHotsTypeCounts(),
        getDifficultyRange(),
    ]);

    return (
        <div className='space-y-4 p-4 sm:p-6 lg:p-8'>
            <div className='flex items-center justify-between'>
                <h1 className='text-3xl font-bold'>Modul Pembelajaran</h1>
                <Button asChild>
                    <Link href='/teacher/modules/create'>
                        <Plus className='mr-2 h-4 w-4' />
                        Buat Modul
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
                <ModulesTable promises={modulesPromise} />
            </Suspense>
        </div>
    );
}
