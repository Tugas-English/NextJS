'use client';

import * as React from 'react';
import {
  FileText,
  LifeBuoy,
  MessageSquare,
  Award,
  BarChart2,
  BookMarked,
  Sparkles,
  Settings,
  LineChart,
  BrainCircuit,
  Clock,
  CheckCircle,
  Gauge,
  FileEdit,
  Repeat,
  Filter,
  Brain,
  ChevronRight,
  MessageCircle,
  Plus,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { User } from '@/lib/auth';
import { SidebarFooterUser } from '@/app/teacher/_components/sidebar-footer';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

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

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/student',
      icon: BarChart2,
      isActive: true,
    },
    {
      title: 'Kemajuan Belajar',
      url: '/student/progress',
      icon: LineChart,
      badge: '14%',
      items: [
        {
          title: 'Statistik HOTS',
          url: '/student/progress/hots',
          icon: Brain,
        },
        {
          title: 'Pencapaian',
          url: '/student/progress/achievements',
          icon: Award,
        },
        {
          title: 'Riwayat Aktivitas',
          url: '/student/progress/history',
          icon: Clock,
        },
      ],
    },
    {
      title: 'Tugas',
      url: '/student/assignments',
      icon: FileText,
      badge: {
        text: '5',
        variant: 'destructive' as const,
      },
      items: [
        {
          title: 'Tugas Aktif',
          url: '/student/assignments/active',
          icon: Clock,
          count: 5,
        },
        {
          title: 'Tugas Selesai',
          url: '/student/assignments/completed',
          icon: CheckCircle,
        },
        {
          title: 'Perlu Revisi',
          url: '/student/assignments/revisions',
          icon: Repeat,
          count: 2,
        },
      ],
    },
    {
      title: 'Modul Pembelajaran',
      url: '/student/modules',
      icon: BookMarked,
      badge: '12',
      items: [
        {
          title: 'Semua Modul',
          url: '/student/modules',
          icon: BookMarked,
        },
        {
          title: 'Filter HOTS',
          url: '/student/modules/filter',
          icon: Filter,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Forum Diskusi',
      url: '/student/discussions',
      icon: MessageSquare,
      badge: {
        text: 'Baru',
        variant: 'default' as const,
      },
      items: [
        {
          title: 'Semua Diskusi',
          url: '/student/discussions',
          icon: MessageCircle,
        },
        {
          title: 'Diskusi Saya',
          url: '/student/discussions/mine',
          icon: FileEdit,
        },
        {
          title: 'Buat Diskusi',
          url: '/student/discussions/create',
          icon: Plus,
        },
      ],
    },
    {
      title: 'Tantangan Mingguan',
      url: '/student/challenges',
      icon: Award,
      badge: '3',
      items: [
        {
          title: 'Tantangan Aktif',
          url: '/student/challenges/active',
          icon: Sparkles,
        },
        {
          title: 'Leaderboard',
          url: '/student/challenges/leaderboard',
          icon: Gauge,
        },
        {
          title: 'Riwayat',
          url: '/student/challenges/history',
          icon: Clock,
        },
      ],
    },
    {
      title: 'Pengaturan',
      url: '/student/settings',
      icon: Settings,
    },
    {
      title: 'Bantuan',
      url: '/student/support',
      icon: LifeBuoy,
    },
  ],
};

export function StudentSidebar({
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
              <Link href="/student" className="flex items-center gap-2">
                <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-sm">
                  <BrainCircuit className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="text-base font-semibold">HOTS English</span>
                  <span className="text-muted-foreground text-xs">
                    Portal Siswa
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
