import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Lock,
  Shield,
  UserX,
  AlertTriangle,
  Home,
  LogIn,
  Mail,
  Phone,
} from 'lucide-react';
import Link from 'next/link';

type RestrictedAccessType =
  | 'login'
  | 'role'
  | 'permission'
  | 'subscription'
  | 'maintenance'
  | 'banned';

interface RestrictedAccessProps {
  type?: RestrictedAccessType;
  title?: string;
  description?: string;
  showActions?: boolean;
  redirectUrl?: string;
  contactInfo?: boolean;
  className?: string;
}

const restrictedAccessConfig = {
  login: {
    icon: LogIn,
    title: 'Akses Dibatasi',
    description: 'Anda harus login untuk mengakses halaman ini.',
    variant: 'default' as const,
    actions: [
      { label: 'Login', href: '/login', variant: 'default' as const },
      { label: 'Daftar', href: '/register', variant: 'outline' as const },
    ],
  },
  role: {
    icon: Shield,
    title: 'Akses Ditolak',
    description:
      'Anda tidak memiliki role yang sesuai untuk mengakses halaman ini.',
    variant: 'destructive' as const,
    actions: [
      {
        label: 'Kembali ke Dashboard',
        href: '/dashboard',
        variant: 'default' as const,
      },
    ],
  },
  permission: {
    icon: Lock,
    title: 'Izin Tidak Mencukupi',
    description: 'Anda tidak memiliki izin untuk mengakses konten ini.',
    variant: 'destructive' as const,
    actions: [
      { label: 'Hubungi Admin', href: '/contact', variant: 'default' as const },
      { label: 'Kembali', href: '/', variant: 'outline' as const },
    ],
  },
  subscription: {
    icon: AlertTriangle,
    title: 'Langganan Diperlukan',
    description: 'Konten ini memerlukan langganan premium untuk diakses.',
    variant: 'default' as const,
    actions: [
      {
        label: 'Upgrade Premium',
        href: '/subscription',
        variant: 'default' as const,
      },
      { label: 'Lihat Paket', href: '/pricing', variant: 'outline' as const },
    ],
  },
  maintenance: {
    icon: AlertTriangle,
    title: 'Sedang Maintenance',
    description: 'Halaman ini sedang dalam perbaikan. Silakan coba lagi nanti.',
    variant: 'default' as const,
    actions: [
      { label: 'Kembali ke Beranda', href: '/', variant: 'default' as const },
    ],
  },
  banned: {
    icon: UserX,
    title: 'Akun Diblokir',
    description:
      'Akun Anda telah diblokir. Hubungi administrator untuk informasi lebih lanjut.',
    variant: 'destructive' as const,
    actions: [
      {
        label: 'Hubungi Support',
        href: '/contact',
        variant: 'default' as const,
      },
    ],
  },
};

export default function RestrictedAccess({
  type = 'login',
  title,
  description,
  showActions = true,
  redirectUrl,
  contactInfo = false,
  className = '',
}: RestrictedAccessProps) {
  const config = restrictedAccessConfig[type];
  const Icon = config.icon;

  const finalTitle = title || config.title;
  const finalDescription = description || config.description;
  const actions = config.actions.map((action) => ({
    ...action,
    href:
      redirectUrl && action.label.toLowerCase().includes('kembali')
        ? redirectUrl
        : action.href,
  }));

  return (
    <div className={`container py-12 ${className}`}>
      <div className="mx-auto max-w-lg">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Icon className="text-muted-foreground h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold">{finalTitle}</h1>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant={config.variant}>
              <Icon className="h-4 w-4" />
              <AlertTitle>{finalTitle}</AlertTitle>
              <AlertDescription>{finalDescription}</AlertDescription>
            </Alert>

            {showActions && actions.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3">
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant}
                    asChild
                    className="min-w-[120px]"
                  >
                    <Link href={action.href}>{action.label}</Link>
                  </Button>
                ))}
              </div>
            )}

            {contactInfo && (
              <div className="border-t pt-6">
                <p className="text-muted-foreground mb-4 text-sm">
                  Butuh bantuan? Hubungi kami:
                </p>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="text-muted-foreground flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>support@example.com</span>
                  </div>
                  <div className="text-muted-foreground flex items-center justify-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>+62 123 456 789</span>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/" className="flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  Kembali ke Beranda
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function LoginRequired(props: Omit<RestrictedAccessProps, 'type'>) {
  return <RestrictedAccess type="login" {...props} />;
}

export function RoleRestricted(props: Omit<RestrictedAccessProps, 'type'>) {
  return <RestrictedAccess type="role" {...props} />;
}

export function PermissionDenied(props: Omit<RestrictedAccessProps, 'type'>) {
  return <RestrictedAccess type="permission" {...props} />;
}

export function SubscriptionRequired(
  props: Omit<RestrictedAccessProps, 'type'>,
) {
  return <RestrictedAccess type="subscription" {...props} />;
}

export function MaintenanceMode(props: Omit<RestrictedAccessProps, 'type'>) {
  return <RestrictedAccess type="maintenance" {...props} />;
}

export function AccountBanned(props: Omit<RestrictedAccessProps, 'type'>) {
  return <RestrictedAccess type="banned" {...props} />;
}
