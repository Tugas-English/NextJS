type BadgeVariant = 'default' | 'destructive' | 'outline';

export interface NavItem {
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

export interface SidebarNavProps {
  navMain: NavItem[];
  navSecondary: NavItem[];
}
