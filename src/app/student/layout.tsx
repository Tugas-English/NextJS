import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { ReactNode } from 'react';
import { studentNavigations } from '@/config/navigation';
import { getServerSession } from '@/lib/session';
import { AppSidebar } from '@/components/sidebar';

export default async function StudentLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();
  return (
    <SidebarProvider>
      <AppSidebar
        user={session?.user}
        data={studentNavigations}
        sidebarFor="Student"
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 transition-[width,height] ease-linear">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/teacher">Student Area</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="bg-muted/10 flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
