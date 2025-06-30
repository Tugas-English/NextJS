'use client';

import * as React from 'react';
import { BrainCircuit, ChevronRight } from 'lucide-react';

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
import { SidebarFooterUser } from '@/components/ui/sidebar-footer';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { NavItem, SidebarNavProps } from '@/types/nav';

export function AppSidebar({
  user,
  data,
  sidebarFor,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user?: User;
  data: SidebarNavProps;
  sidebarFor: 'Teacher' | 'Student';
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
                    Portal {sidebarFor}
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
