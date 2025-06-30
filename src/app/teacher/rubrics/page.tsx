import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { Button } from '@/components/ui/button';
import { getRubrics } from '@/lib/actions/rubrics';
import { getServerSession } from '@/lib/session';
import { SearchParams } from '@/types';
import { Plus, Upload } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { RubricsTable } from './_components/rubrics-table';

interface RubricsPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function RubricsPage(props: RubricsPageProps) {
  const session = await getServerSession();
  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;
  const perPage = Number(searchParams.perPage) || 10;
  const search = searchParams.search?.toString();

  const rubricsPromise = Promise.all([
    getRubrics({
      page,
      perPage,
      search,
      createdBy: session?.user.id,
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Rubrik Penilaian</h1>
        <div className="flex gap-2">
          <Link href="/teacher/rubrics/import">
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span>Import/Export</span>
            </Button>
          </Link>
          <Link href="/teacher/rubrics/create">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Buat Rubrik</span>
            </Button>
          </Link>
        </div>
      </div>
      <Suspense
        fallback={
          <DataTableSkeleton columnCount={6} filterCount={3} rowCount={5} />
        }
      >
        <RubricsTable promises={rubricsPromise} />
      </Suspense>
    </div>
  );
}
