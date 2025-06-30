import { getStudentModules } from '@/lib/actions/student-modules';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import Image from 'next/image';
import Link from 'next/link';
import { Brain, BookOpen, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModulesListProps {
  page: number;
  perPage: number;
  search?: string;
  skill?: string | string[];
  hotsType?: string | string[];
  difficulty?: number[];
}

export default async function ModulesList({
  page,
  perPage,
  search,
  skill,
  hotsType,
  difficulty,
}: ModulesListProps) {
  const {
    data: modules,
    pageCount,
    totalCount,
    error,
  } = await getStudentModules({
    page,
    perPage,
    search,
    skill,
    hotsType,
    difficulty,
  });

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (modules.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <BookOpen className="text-muted-foreground mx-auto h-12 w-12" />
        <h3 className="mt-4 text-lg font-medium">Tidak ada modul</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Tidak ada modul yang sesuai dengan filter yang dipilih.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Menampilkan <strong>{modules.length}</strong> dari{' '}
          <strong>{totalCount}</strong> modul
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Card key={module.id} className="overflow-hidden">
            <div className="relative aspect-video">
              {module.coverImage ? (
                <img
                  src={module.coverImage}
                  alt={module.title}
                  className="object-cover"
                />
              ) : (
                <div className="bg-muted flex h-full w-full items-center justify-center">
                  <BookOpen className="text-muted-foreground/50 h-12 w-12" />
                </div>
              )}
            </div>
            <CardHeader className="p-4">
              <h3 className="line-clamp-2 text-lg font-semibold">
                {module.title}
              </h3>
            </CardHeader>
            <CardContent className="space-y-2 p-4 pt-0">
              {module.description && (
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {module.description}
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                {module.skill && (
                  <Badge variant="outline" className="capitalize">
                    {module.skill}
                  </Badge>
                )}
                {module.hotsType && (
                  <Badge variant="secondary" className="capitalize">
                    <Brain className="mr-1 h-3 w-3" />
                    {module.hotsType}
                  </Badge>
                )}
                {module.difficulty && (
                  <Badge
                    className={cn(
                      'capitalize',
                      module.difficulty <= 2
                        ? 'bg-green-500'
                        : module.difficulty <= 4
                          ? 'bg-yellow-500'
                          : 'bg-red-500',
                      'text-white',
                    )}
                  >
                    <BarChart3 className="mr-1 h-3 w-3" />
                    Level {module.difficulty}
                  </Badge>
                )}
              </div>
              <div className="text-muted-foreground mt-2 text-xs">
                {module.activities?.length} aktivitas
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button asChild className="w-full">
                <Link href={`/student/modules/${module.id}`}>Lihat Modul</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {pageCount > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={pageCount}
            baseUrl="/student/modules"
            searchParams={{
              search,
              skill,
              hotsType,
              difficulty: difficulty
                ? `${difficulty[0]}-${difficulty[1]}`
                : undefined,
            }}
          />
        </div>
      )}
    </div>
  );
}
