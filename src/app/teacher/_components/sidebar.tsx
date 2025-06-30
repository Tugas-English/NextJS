'use client';
import * as React from 'react';
import {
  BookOpen,
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
  Clock,
  BrainCircuit,
  ClipboardList,
  Gauge,
  FileOutput,
  ChevronRight,
  Plus,
  Library,
  TrendingUp,
  MessageCircle,
  Newspaper,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../../components/ui/collapsible';
import { SidebarFooterUser } from './sidebar-footer';
import { User } from '@/lib/auth';

type BadgeVariant = 'default' | 'destructive' | 'outline';

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

interface CourseItem {
  name: string;
  url: string;
  icon: React.ElementType;
  students: number;
  isActive?: boolean;
}

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/teacher',
      icon: BarChart2,
      isActive: true,
    },
    {
      title: 'Aktivitas HOTS',
      url: '/teacher/activities',
      icon: Activity,
      badge: '124',
      items: [
        {
          title: 'Semua Aktivitas',
          url: '/teacher/activities',
          icon: Newspaper,
        },
        {
          title: 'Buat Aktivitas Baru',
          url: '/teacher/activities/create',
          icon: Sparkles,
        },
      ],
    },
    {
      title: 'Tugas',
      url: '/teacher/assignments',
      icon: FileText,
      badge: {
        text: '5',
        variant: 'destructive' as const,
      },
      items: [
        {
          title: 'Daftar Tugas',
          url: '/teacher/assignments',
          icon: Clock,
          count: 5,
        },
        {
          title: 'Buat Tugas Baru',
          url: '/teacher/assignments/create',
          icon: Sparkles,
        },
      ],
    },
    {
      title: 'Rubrik Penilaian',
      url: '/teacher/rubrics',
      icon: ClipboardList,
      items: [
        {
          title: 'Buat Rubrik Baru',
          url: '/teacher/rubrics/create',
          icon: Sparkles,
        },
        {
          title: 'Semua Rubrik',
          url: '/teacher/rubrics',
          icon: ClipboardList,
        },
        {
          title: 'Import/Export',
          url: '/teacher/rubrics/import',
          icon: FileOutput,
        },
      ],
    },
    {
      title: 'Modul Pembelajaran',
      url: '/teacher/modules',
      icon: BookMarked,
      badge: '12',
      items: [
        {
          title: 'Semua Modul',
          url: '/teacher/modules',
          icon: BookMarked,
        },
        {
          title: 'Buat Modul Baru',
          url: '/teacher/modules/create',
          icon: Sparkles,
        },
      ],
    },
    {
      title: 'Siswa',
      url: '/teacher/students',
      icon: Users,
      badge: '85',
      items: [
        {
          title: 'Daftar Siswa',
          url: '/teacher/students',
          icon: GraduationCap,
        },
        {
          title: 'Laporan Kemajuan',
          url: '/teacher/students/progress',
          icon: LineChart,
        },
        {
          title: 'Analisis HOTS',
          url: '/teacher/students/analytics',
          icon: Gauge,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Forum Diskusi',
      url: '/teacher/discussions',
      icon: MessageSquare,
      badge: {
        text: 'Baru',
        variant: 'default' as const,
      },
      items: [
        {
          title: 'Daftar Diskusi',
          url: '/teacher/discussions',
          icon: MessageCircle,
        },
        {
          title: 'Buat Diskusi',
          url: '/teacher/discussions/create',
          icon: Plus,
        },
      ],
    },
    {
      title: 'Tantangan Mingguan',
      url: '/teacher/challenges',
      icon: Award,
      badge: '3',
      items: [
        {
          title: 'Daftar Tantangan',
          url: '/teacher/challenges',
          icon: MessageCircle,
        },
        {
          title: 'Buat Tantangan',
          url: '/teacher/challenges/create',
          icon: Plus,
        },
      ],
    },
    {
      title: 'Laporan & Ekspor',
      url: '/teacher/reports',
      icon: FileOutput,
      items: [
        {
          title: 'Laporan Kelas',
          url: '/teacher/reports/class',
          icon: BarChart2,
        },
        {
          title: 'Laporan Siswa',
          url: '/teacher/reports/student',
          icon: Users,
        },
        {
          title: 'Ekspor Data',
          url: '/teacher/reports/export',
          icon: FileOutput,
        },
      ],
    },
    {
      title: 'Pengaturan',
      url: '/teacher/settings',
      icon: Settings,
      items: [
        {
          title: 'Profil',
          url: '/teacher/settings/profile',
          icon: Users,
        },
        {
          title: 'Notifikasi',
          url: '/teacher/settings/notifications',
          icon: MessageSquare,
        },
        {
          title: 'Keamanan',
          url: '/teacher/settings/security',
          icon: Settings,
        },
      ],
    },
    {
      title: 'Bantuan',
      url: '/teacher/support',
      icon: LifeBuoy,
      items: [
        {
          title: 'Panduan Pengguna',
          url: '/teacher/support/guide',
          icon: BookOpen,
        },
        {
          title: 'FAQ',
          url: '/teacher/support/faq',
          icon: MessageSquare,
        },
        {
          title: 'Kontak Support',
          url: '/teacher/support/contact',
          icon: LifeBuoy,
        },
      ],
    },
  ],
  courses: [
    {
      name: 'Bahasa Inggris 10A',
      url: '/teacher/courses/english-10a',
      icon: BookOpen,
      students: 32,
      isActive: false,
    },
    {
      name: 'HOTS Lanjutan',
      url: '/teacher/courses/hots-advanced',
      icon: TrendingUp,
      students: 28,
      isActive: true,
    },
    {
      name: 'Menulis Kreatif',
      url: '/teacher/courses/creative-writing',
      icon: FileEdit,
      students: 25,
      isActive: false,
    },
  ],
  coursesManagement: {
    title: 'Manajemen Kursus',
    url: '/teacher/courses',
    icon: Library,
    items: [
      {
        title: 'Buat Kursus Baru',
        url: '/teacher/courses/create',
        icon: Plus,
      },
      {
        title: 'Semua Kursus',
        url: '/teacher/courses',
        icon: Library,
      },
      {
        title: 'Arsip Kursus',
        url: '/teacher/courses/archived',
        icon: BookMarked,
      },
    ],
  },
};

export function TeacherSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user?: User;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (!mounted) {
      setMounted(true);
    }
  }, [mounted]);

  return (
    <Sidebar {...props} collapsible="icon" variant="floating">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/teacher" className="flex items-center gap-2">
                <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-sm">
                  <BrainCircuit className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="text-base font-semibold">HOTS English</span>
                  <span className="text-muted-foreground text-xs">
                    Portal Guru
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <NavMain items={data.navMain} />
        <SidebarSeparator />
        <NavSecondary items={data.navSecondary} />
        <SidebarSeparator />
        <CoursesManagement item={data.coursesManagement} />
        <NavCourses items={data.courses} />
      </SidebarContent>
      <SidebarFooter>{user && <SidebarFooterUser user={user} />}</SidebarFooter>
    </Sidebar>
  );
}

function NavMain({ items }: { items: NavItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <NavMainItem key={item.title} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavSecondary({ items }: { items: NavItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Alat & Bantuan</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <NavMainItem key={item.title} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function CoursesManagement({ item }: { item: NavItem }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Kursus</SidebarGroupLabel>
      <SidebarMenu>
        <NavMainItem item={item} />
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavCourses({ items }: { items: CourseItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Kursus Aktif</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              tooltip={`${item.name} - ${item.students} siswa`}
              asChild
            >
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
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
      | { text: string; variant: 'default' | 'destructive' | 'outline' };
    items?: Array<{
      title: string;
      url: string;
      icon?: React.ElementType;
      count?: number;
    }>;
  };
}) {
  return (
    <Collapsible
      key={item.title}
      asChild
      defaultOpen={item.isActive}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <Link href={item.url}>
            <SidebarMenuButton
              tooltip={item.title}
              className="hover:cursor-pointer"
            >
              {item.icon && <item.icon />}
              <span>{item.title}</span>
              {item.items?.length && (
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              )}
            </SidebarMenuButton>
          </Link>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {item.items?.length && (
            <SidebarMenuSub>
              {item.items?.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton asChild>
                    <Link href={subItem.url}>
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          )}
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
