"use client";

import * as React from "react";
import {
    BookOpen,
    ClipboardList,
    Users,
    FileText,
    Activity,
    LifeBuoy,
    MessageSquare,
    Award,
    BarChart2,
    FileEdit,
    BookMarked,
    Sparkles,
    GraduationCap,
    Settings,
    Calendar,
    LineChart,
    Newspaper,
    Clock,
    BrainCircuit,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "destructive" | "outline";

interface NavItem {
    title: string;
    url: string;
    icon: React.ElementType;
    isActive?: boolean;
    badge?: string | { text: string; variant: BadgeVariant };
    items?: Array<{
        title: string;
        url: string;
        icon?: React.ElementType;
        count?: number;
    }>;
}

interface SecondaryNavItem {
    title: string;
    url: string;
    icon: React.ElementType;
    badge?: { text: string; variant: BadgeVariant };
}

const data = {
    user: {
        name: "Ms. Johnson",
        email: "teacher@example.com",
        avatar: "/avatars/teacher.jpg",
        role: "English Teacher",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/teacher",
            icon: BarChart2,
            isActive: true,
        },
        {
            title: "Activities",
            url: "/teacher/activities",
            icon: Activity,
            badge: "124",
            items: [
                {
                    title: "Create New",
                    url: "/teacher/activities/create",
                    icon: Sparkles,
                },
                {
                    title: "Reading",
                    url: "/teacher/activities?skill=reading",
                    icon: Newspaper,
                    count: 45,
                },
                {
                    title: "Listening",
                    url: "/teacher/activities?skill=listening",
                    icon: BookOpen,
                    count: 32,
                },
                {
                    title: "Writing",
                    url: "/teacher/activities?skill=writing",
                    icon: FileEdit,
                    count: 28,
                },
                {
                    title: "Speaking",
                    url: "/teacher/activities?skill=speaking",
                    icon: MessageSquare,
                    count: 19,
                },
            ],
        },
        {
            title: "Assignments",
            url: "/teacher/assignments",
            icon: FileText,
            badge: {
                text: "5",
                variant: "destructive" as const,
            },
            items: [
                {
                    title: "Create Assignment",
                    url: "/teacher/assignments/create",
                    icon: Sparkles,
                },
                {
                    title: "To Grade",
                    url: "/teacher/assignments?status=ungraded",
                    icon: Clock,
                    count: 5,
                },
                {
                    title: "Active",
                    url: "/teacher/assignments?status=active",
                    icon: Calendar,
                    count: 8,
                },
                {
                    title: "Completed",
                    url: "/teacher/assignments?status=completed",
                    icon: Award,
                    count: 11,
                },
            ],
        },
        {
            title: "Students",
            url: "/teacher/students",
            icon: Users,
            badge: "85",
            items: [
                {
                    title: "Class List",
                    url: "/teacher/students",
                    icon: GraduationCap,
                },
                {
                    title: "Progress Reports",
                    url: "/teacher/students/progress",
                    icon: LineChart,
                },
                {
                    title: "HOTS Analytics",
                    url: "/teacher/students/analytics",
                    icon: BarChart2,
                },
            ],
        },
        {
            title: "Modules",
            url: "/teacher/modules",
            icon: BookMarked,
            badge: "12",
            items: [
                {
                    title: "Create Module",
                    url: "/teacher/modules/create",
                    icon: Sparkles,
                },
                {
                    title: "All Modules",
                    url: "/teacher/modules",
                    icon: BookMarked,
                },
            ],
        },
    ],
    navSecondary: [
        {
            title: "Discussions",
            url: "/teacher/discussions",
            icon: MessageSquare,
            badge: {
                text: "New",
                variant: "default" as const,
            },
        },
        {
            title: "Weekly Challenges",
            url: "/teacher/challenges",
            icon: Award,
        },
        {
            title: "Settings",
            url: "/teacher/settings",
            icon: Settings,
        },
        {
            title: "Support",
            url: "/teacher/support",
            icon: LifeBuoy,
        },
    ],
    courses: [
        {
            name: "English 10A",
            url: "/teacher/courses/english-10a",
            icon: BookOpen,
            students: 32,
        },
        {
            name: "HOTS Advanced",
            url: "/teacher/courses/hots-advanced",
            icon: Award,
            students: 28,
        },
        {
            name: "Creative Writing",
            url: "/teacher/courses/creative-writing",
            icon: FileEdit,
            students: 25,
        },
    ],
};

export function TeacherSidebar({
    ...props
}: React.ComponentProps<typeof Sidebar>) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        if (!mounted) {
            setMounted(true);
        }
    }, [mounted]);

    return (
        <Sidebar {...props}>
            <SidebarHeader className='pb-2'>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size='lg' asChild>
                            <a
                                href='/teacher'
                                className='flex items-center gap-2'
                            >
                                <div className='bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex aspect-square size-9 items-center justify-center rounded-lg shadow-sm'>
                                    <BrainCircuit className='size-5' />
                                </div>
                                <div className='grid flex-1 text-left text-sm leading-tight'>
                                    <span className='text-base font-semibold'>
                                        HOTS English
                                    </span>
                                    <span className='text-xs text-muted-foreground'>
                                        Teacher Portal
                                    </span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className='py-2 mx-4'>
                <NavMain items={data.navMain} />
                <SidebarSeparator className='my-2' />
                <NavCourses courses={data.courses} />
                <SidebarSeparator className='my-2' />
                <NavSecondary items={data.navSecondary} />
            </SidebarContent>
        </Sidebar>
    );
}

function NavMain({ items }: { items: NavItem[] }) {
    return (
        <SidebarMenu>
            {items.map((item) => (
                <NavMainItem key={item.title} item={item} />
            ))}
        </SidebarMenu>
    );
}

function NavMainItem({
    item,
}: {
    item: {
        title: string;
        url: string;
        icon: React.ElementType;
        isActive?: boolean;
        badge?:
            | string
            | { text: string; variant: "default" | "destructive" | "outline" };
        items?: Array<{
            title: string;
            url: string;
            icon?: React.ElementType;
            count?: number;
        }>;
    };
}) {
    const [isOpen, setIsOpen] = React.useState(item.isActive || false);
    const Icon = item.icon;

    return (
        <SidebarMenuItem>
            <div className='flex w-full flex-col'>
                <div className='flex items-center'>
                    <SidebarMenuButton
                        asChild
                        className={cn(
                            "flex-1",
                            isOpen && item.items?.length && "font-medium"
                        )}
                    >
                        <a
                            href={item.url}
                            className='flex items-center justify-between'
                        >
                            <div className='flex items-center gap-3'>
                                <Icon className='size-4' />
                                <span>{item.title}</span>
                            </div>

                            {item.badge &&
                                (typeof item.badge === "string" ? (
                                    <Badge
                                        variant='outline'
                                        className='ml-auto'
                                    >
                                        {item.badge}
                                    </Badge>
                                ) : (
                                    <Badge
                                        variant={item.badge.variant}
                                        className='ml-auto'
                                    >
                                        {item.badge.text}
                                    </Badge>
                                ))}
                        </a>
                    </SidebarMenuButton>

                    {item.items?.length && (
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className='flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent'
                        >
                            <svg
                                width='15'
                                height='15'
                                viewBox='0 0 15 15'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                                className={cn(
                                    "h-3 w-3 transition-transform",
                                    isOpen ? "rotate-90" : ""
                                )}
                            >
                                <path
                                    d='M6 11L10 7.5L6 4'
                                    stroke='currentColor'
                                    strokeWidth='1.5'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                            </svg>
                        </button>
                    )}
                </div>

                {isOpen && item.items?.length && (
                    <div className='mt-1 ml-6 space-y-1'>
                        {item.items.map((subItem) => (
                            <a
                                key={subItem.title}
                                href={subItem.url}
                                className='flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-accent'
                            >
                                <div className='flex items-center gap-2'>
                                    {subItem.icon && (
                                        <subItem.icon className='size-3.5' />
                                    )}
                                    <span>{subItem.title}</span>
                                </div>
                                {subItem.count !== undefined && (
                                    <span className='text-xs text-muted-foreground'>
                                        {subItem.count}
                                    </span>
                                )}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </SidebarMenuItem>
    );
}

function NavCourses({
    courses,
}: {
    courses: Array<{
        name: string;
        url: string;
        icon: React.ElementType;
        students?: number;
    }>;
}) {
    return (
        <div className='px-3 py-2'>
            <h3 className='mb-2 px-2 text-xs font-medium text-muted-foreground'>
                Kelas Aktif
            </h3>
            <div className='space-y-1'>
                {courses.map((course) => {
                    const Icon = course.icon;
                    return (
                        <a
                            key={course.name}
                            href={course.url}
                            className='flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent'
                        >
                            <div className='flex items-center gap-2'>
                                <Icon className='size-4 text-muted-foreground' />
                                <span className='text-sm'>{course.name}</span>
                            </div>
                            {course.students !== undefined && (
                                <span className='text-xs text-muted-foreground'>
                                    {course.students} siswa
                                </span>
                            )}
                        </a>
                    );
                })}

                <button className='flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent'>
                    <span className='flex h-4 w-4 items-center justify-center rounded-full border'>
                        +
                    </span>
                    <span>Tambah Kelas</span>
                </button>
            </div>
        </div>
    );
}

function NavSecondary({ items }: { items: SecondaryNavItem[] }) {
    return (
        <div className='px-3 py-2'>
            <div className='space-y-1'>
                {items.map((item) => {
                    const Icon = item.icon;
                    return (
                        <a
                            key={item.title}
                            href={item.url}
                            className='flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent'
                        >
                            <div className='flex items-center gap-2'>
                                <Icon className='size-4 text-muted-foreground' />
                                <span className='text-sm'>{item.title}</span>
                            </div>
                            {item.badge && (
                                <Badge
                                    variant={item.badge.variant}
                                    className='text-xs'
                                >
                                    {item.badge.text}
                                </Badge>
                            )}
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
