import { Suspense } from 'react';
import {
  getModuleSkillCounts,
  getModuleHotsTypeCounts,
  getDifficultyRange,
} from '@/lib/actions/student-modules';
import { Skeleton } from '@/components/ui/skeleton';
import { BookMarked } from 'lucide-react';
import ModulesList from './_components/modules-list';
import ModulesFilter from './_components/modules-filter';

export const metadata = {
  title: 'Modul Pembelajaran | HOTS English',
  description:
    'Jelajahi modul pembelajaran interaktif untuk meningkatkan kemampuan bahasa Inggris dan keterampilan berpikir tingkat tinggi',
};

export default async function StudentModulesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    perPage?: string;
    search?: string;
    skill?: string | string[];
    hotsType?: string | string[];
    difficulty?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;

  const page = resolvedSearchParams.page
    ? parseInt(resolvedSearchParams.page)
    : 1;
  const perPage = resolvedSearchParams.perPage
    ? parseInt(resolvedSearchParams.perPage)
    : 9;

  let difficultyRange: number[] | undefined = undefined;
  if (resolvedSearchParams.difficulty) {
    difficultyRange = resolvedSearchParams.difficulty.split('-').map(Number);
  }

  const [skillCounts, hotsTypeCounts, difficultyRangeData] = await Promise.all([
    getModuleSkillCounts(),
    getModuleHotsTypeCounts(),
    getDifficultyRange(),
  ]);

  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center gap-2">
        <div className="bg-primary/10 rounded-lg p-2">
          <BookMarked className="text-primary h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          Modul Pembelajaran
        </h1>
      </div>

      <p className="text-muted-foreground mb-8">
        Jelajahi berbagai modul pembelajaran interaktif untuk meningkatkan
        kemampuan bahasa Inggris dan keterampilan berpikir tingkat tinggi
        (HOTS).
      </p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <ModulesFilter
            skillCounts={skillCounts}
            hotsTypeCounts={hotsTypeCounts}
            difficultyRange={difficultyRangeData}
            selectedSkills={
              resolvedSearchParams.skill
                ? Array.isArray(resolvedSearchParams.skill)
                  ? resolvedSearchParams.skill
                  : [resolvedSearchParams.skill]
                : []
            }
            selectedHotsTypes={
              resolvedSearchParams.hotsType
                ? Array.isArray(resolvedSearchParams.hotsType)
                  ? resolvedSearchParams.hotsType
                  : [resolvedSearchParams.hotsType]
                : []
            }
            selectedDifficulty={difficultyRange}
            search={resolvedSearchParams.search}
          />
        </div>

        <div className="lg:col-span-3">
          <Suspense fallback={<ModulesListSkeleton />}>
            <ModulesList
              page={page}
              perPage={perPage}
              search={resolvedSearchParams.search}
              skill={resolvedSearchParams.skill}
              hotsType={resolvedSearchParams.hotsType}
              difficulty={difficultyRange}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function ModulesListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="space-y-3 rounded-lg border p-4">
              <Skeleton className="h-40 w-full rounded-md" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          ))}
      </div>
      <div className="mt-6 flex justify-center">
        <Skeleton className="h-10 w-64" />
      </div>
    </div>
  );
}
