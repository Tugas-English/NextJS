import { TeacherSidebar } from "@/components/teacher/sidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import React, { ReactNode } from "react";
import { Bell, Search, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function getBreadcrumbItems(path: string): { label: string; href: string }[] {
    const segments = path.split("/").filter(Boolean);
    const items: { label: string; href: string }[] = [];

    let currentPath = "";

    segments.forEach((segment, index) => {
        currentPath += `/${segment}`;

        let label = segment.charAt(0).toUpperCase() + segment.slice(0);

        if (segment === "create" && index > 0) {
            const parentSegment = segments[index - 1];
            label = `Create ${
                parentSegment.charAt(0).toUpperCase() +
                parentSegment.slice(0, -1)
            }`;
        }

        items.push({
            label,
            href: currentPath,
        });
    });

    return items;
}

export default function TeacherLayout({ children }: { children: ReactNode }) {
    const pathname = "/teacher";

    const breadcrumbItems = getBreadcrumbItems(pathname);

    return (
        <SidebarProvider>
            <TeacherSidebar />
            <SidebarInset>
                <header className='flex h-16 shrink-0 items-center justify-between border-b px-4 transition-[width,height] ease-linear'>
                    <div className='flex items-center gap-2'>
                        <SidebarTrigger className='-ml-1' />
                        <Separator
                            orientation='vertical'
                            className='mr-2 data-[orientation=vertical]:h-4'
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className='hidden md:block'>
                                    <BreadcrumbLink href='/teacher'>
                                        Teacher Area
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                {breadcrumbItems.map((item, index) => (
                                    <React.Fragment key={item.href}>
                                        <BreadcrumbSeparator className='hidden md:block' />
                                        <BreadcrumbItem>
                                            {index ===
                                            breadcrumbItems.length - 1 ? (
                                                <BreadcrumbPage>
                                                    {item.label}
                                                </BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink
                                                    href={item.href}
                                                >
                                                    {item.label}
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                    </React.Fragment>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className='flex items-center gap-4'>
                        <div className='relative hidden md:block'>
                            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                            <Input
                                type='search'
                                placeholder='Search...'
                                className='w-64 rounded-full bg-background pl-8'
                            />
                        </div>

                        <Button
                            variant='ghost'
                            size='icon'
                            className='relative'
                        >
                            <Bell className='h-5 w-5' />
                            <span className='absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-red-500'></span>
                        </Button>

                        <Button variant='ghost' size='icon'>
                            <HelpCircle className='h-5 w-5' />
                        </Button>

                        <Separator orientation='vertical' className='h-8' />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant='ghost' className='gap-2 px-2'>
                                    <Avatar className='h-8 w-8'>
                                        <AvatarImage
                                            src='/avatars/teacher.jpg'
                                            alt='Ms. Johnson'
                                        />
                                        <AvatarFallback>MJ</AvatarFallback>
                                    </Avatar>
                                    <div className='hidden text-left md:block'>
                                        <p className='text-sm font-medium'>
                                            Ms. Johnson
                                        </p>
                                        <p className='text-xs text-muted-foreground'>
                                            English Teacher
                                        </p>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end' className='w-56'>
                                <DropdownMenuLabel>
                                    My Account
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Log out</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>
                <main className='flex-1 overflow-auto bg-muted/10 p-4 md:p-6'>
                    <div className='mx-auto'>{children}</div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
