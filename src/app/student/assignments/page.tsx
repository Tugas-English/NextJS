import { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Clock, CheckCircle, Repeat } from 'lucide-react';
import AssignmentsList from './_components/assignments-list';
import AssignmentsFilter from './_components/assignments-filter';

export const metadata = {
  title: 'Tugas | HOTS English',
  description: 'Daftar tugas yang perlu dikerjakan dan diselesaikan',
};

export default async function StudentAssignmentsPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    perPage?: string;
    search?: string;
    status?: string;
    skill?: string | string[];
    hotsType?: string | string[];
    difficulty?: string;
    tab?: string;
  };
}) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const perPage = searchParams.perPage ? parseInt(searchParams.perPage) : 10;
  const status = searchParams.status || 'active';
  const tab = searchParams.tab || 'active';

  let difficultyRange: number[] | undefined = undefined;
  if (searchParams.difficulty) {
    difficultyRange = searchParams.difficulty.split('-').map(Number);
  }

  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center gap-2">
        <div className="bg-primary/10 rounded-lg p-2">
          <FileText className="text-primary h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Tugas</h1>
      </div>

      <p className="text-muted-foreground mb-8">
        Kelola dan selesaikan tugas-tugas yang diberikan kepada Anda.
      </p>

      <Tabs defaultValue={tab} className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="active" asChild>
            <a
              href="/student/assignments?tab=active"
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Tugas Aktif
            </a>
          </TabsTrigger>
          <TabsTrigger value="completed" asChild>
            <a
              href="/student/assignments?tab=completed"
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Tugas Selesai
            </a>
          </TabsTrigger>
          <TabsTrigger value="revisions" asChild>
            <a
              href="/student/assignments?tab=revisions"
              className="flex items-center gap-2"
            >
              <Repeat className="h-4 w-4" />
              Perlu Revisi
            </a>
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <AssignmentsFilter
              search={searchParams.search}
              skill={
                searchParams.skill
                  ? Array.isArray(searchParams.skill)
                    ? searchParams.skill
                    : [searchParams.skill]
                  : []
              }
              hotsType={
                searchParams.hotsType
                  ? Array.isArray(searchParams.hotsType)
                    ? searchParams.hotsType
                    : [searchParams.hotsType]
                  : []
              }
              difficulty={difficultyRange}
              status={status}
              tab={tab}
            />
          </div>

          <div className="lg:col-span-3">
            <TabsContent value="active" className="mt-0">
              <Suspense fallback={<AssignmentsListSkeleton />}>
                <AssignmentsList
                  page={page}
                  perPage={perPage}
                  search={searchParams.search}
                  skill={searchParams.skill}
                  hotsType={searchParams.hotsType}
                  difficulty={difficultyRange}
                  status="active"
                />
              </Suspense>
            </TabsContent>

            <TabsContent value="completed" className="mt-0">
              <Suspense fallback={<AssignmentsListSkeleton />}>
                <AssignmentsList
                  page={page}
                  perPage={perPage}
                  search={searchParams.search}
                  skill={searchParams.skill}
                  hotsType={searchParams.hotsType}
                  difficulty={difficultyRange}
                  status="completed"
                />
              </Suspense>
            </TabsContent>

            <TabsContent value="revisions" className="mt-0">
              <Suspense fallback={<AssignmentsListSkeleton />}>
                <AssignmentsList
                  page={page}
                  perPage={perPage}
                  search={searchParams.search}
                  skill={searchParams.skill}
                  hotsType={searchParams.hotsType}
                  difficulty={difficultyRange}
                  status="revision"
                />
              </Suspense>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

function AssignmentsListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="space-y-4">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="space-y-3 rounded-lg border p-4">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-4 w-2/3" />
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
