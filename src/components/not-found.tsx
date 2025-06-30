'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Search,
  Home,
  ArrowLeft,
  FileQuestion,
  Compass,
  RotateCcw,
  Mail,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type NotFoundType =
  | 'page'
  | 'activity'
  | 'assignment'
  | 'user'
  | 'file'
  | 'module'
  | 'discussion'
  | 'general';

interface NotFoundProps {
  type?: NotFoundType;
  title?: string;
  description?: string;
  backUrl?: string;
  backLabel?: string;
  showSearch?: boolean;
  showSuggestions?: boolean;
  suggestions?: Array<{
    label: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
  className?: string;
}

const notFoundConfig = {
  page: {
    title: 'Halaman Tidak Ditemukan',
    description:
      'Maaf, halaman yang Anda cari tidak ditemukan atau telah dipindahkan.',
    emoji: '🔍',
    suggestions: [
      { label: 'Beranda', href: '/', icon: Home },
      { label: 'Dashboard', href: '/dashboard', icon: Compass },
      { label: 'Bantuan', href: '/help', icon: HelpCircle },
    ],
  },
  activity: {
    title: 'Aktivitas Tidak Ditemukan',
    description: 'Aktivitas yang Anda cari tidak ditemukan atau telah dihapus.',
    emoji: '📚',
    suggestions: [
      {
        label: 'Semua Aktivitas',
        href: '/student/activities',
        icon: FileQuestion,
      },
      { label: 'Modul Pembelajaran', href: '/student/modules', icon: Compass },
      { label: 'Dashboard', href: '/dashboard', icon: Home },
    ],
  },
  assignment: {
    title: 'Tugas Tidak Ditemukan',
    description: 'Tugas yang Anda cari tidak ditemukan atau telah berakhir.',
    emoji: '📝',
    suggestions: [
      {
        label: 'Semua Tugas',
        href: '/student/assignments',
        icon: FileQuestion,
      },
      { label: 'Dashboard', href: '/dashboard', icon: Home },
    ],
  },
  user: {
    title: 'Pengguna Tidak Ditemukan',
    description: 'Profil pengguna yang Anda cari tidak ditemukan.',
    emoji: '👤',
    suggestions: [
      { label: 'Daftar Pengguna', href: '/users', icon: Compass },
      { label: 'Dashboard', href: '/dashboard', icon: Home },
    ],
  },
  file: {
    title: 'File Tidak Ditemukan',
    description: 'File yang Anda cari tidak ditemukan atau telah dipindahkan.',
    emoji: '📄',
    suggestions: [
      { label: 'Perpustakaan', href: '/library', icon: FileQuestion },
      { label: 'Dashboard', href: '/dashboard', icon: Home },
    ],
  },
  module: {
    title: 'Modul Tidak Ditemukan',
    description: 'Modul pembelajaran yang Anda cari tidak ditemukan.',
    emoji: '📖',
    suggestions: [
      { label: 'Semua Modul', href: '/student/modules', icon: Compass },
      { label: 'Dashboard', href: '/dashboard', icon: Home },
    ],
  },
  discussion: {
    title: 'Diskusi Tidak Ditemukan',
    description:
      'Topik diskusi yang Anda cari tidak ditemukan atau telah dihapus.',
    emoji: '💬',
    suggestions: [
      { label: 'Forum Diskusi', href: '/student/discussions', icon: Compass },
      { label: 'Dashboard', href: '/dashboard', icon: Home },
    ],
  },
  general: {
    title: 'Konten Tidak Ditemukan',
    description: 'Konten yang Anda cari tidak ditemukan.',
    emoji: '❓',
    suggestions: [
      { label: 'Beranda', href: '/', icon: Home },
      { label: 'Bantuan', href: '/help', icon: HelpCircle },
    ],
  },
};

export default function NotFound({
  type = 'page',
  title,
  description,
  backUrl,
  backLabel,
  showSearch = true,
  showSuggestions = true,
  suggestions,
  className = '',
}: NotFoundProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const config = notFoundConfig[type];

  const finalTitle = title || config.title;
  const finalDescription = description || config.description;
  const finalSuggestions = suggestions || config.suggestions;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to search page with query
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <div className={`container py-12 ${className}`}>
      <div className="mx-auto max-w-2xl text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="text-muted-foreground/20 text-9xl font-bold select-none">
            404
          </div>
          <div className="mb-4 text-6xl">{config.emoji}</div>
        </div>

        {/* Main Content */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <h1 className="mb-2 text-3xl font-bold">{finalTitle}</h1>
            <p className="text-muted-foreground text-lg">{finalDescription}</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Search Bar */}
            {showSearch && (
              <form onSubmit={handleSearch} className="mx-auto max-w-md">
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  <Input
                    type="text"
                    placeholder="Cari di situs ini..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-4 pl-10"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="absolute top-1/2 right-1 -translate-y-1/2 transform"
                    disabled={!searchQuery.trim()}
                  >
                    Cari
                  </Button>
                </div>
              </form>
            )}

            {/* Back Button */}
            {(backUrl || backLabel) && (
              <div className="flex justify-center">
                <Button variant="outline" asChild>
                  <Link
                    href={backUrl || '/'}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {backLabel || 'Kembali'}
                  </Link>
                </Button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mx-auto grid max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
              <Button asChild>
                <Link href="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Ke Beranda
                </Link>
              </Button>
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Suggestions */}
        {showSuggestions && finalSuggestions && finalSuggestions.length > 0 && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Mungkin Anda Mencari</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {finalSuggestions.map((suggestion, index) => {
                  const Icon = suggestion.icon || Compass;
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      asChild
                      className="h-auto flex-col gap-2 p-4"
                    >
                      <Link href={suggestion.href}>
                        <Icon className="h-5 w-5" />
                        <span className="text-sm">{suggestion.label}</span>
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4 text-sm">
            Masih tidak menemukan yang Anda cari?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/help" className="flex items-center gap-1">
                <HelpCircle className="h-4 w-4" />
                Bantuan
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/contact" className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                Hubungi Kami
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.reload()}
            >
              <RotateCcw className="mr-1 h-4 w-4" />
              Muat Ulang
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PageNotFound(props: Omit<NotFoundProps, 'type'>) {
  return <NotFound type="page" {...props} />;
}

export function ActivityNotFound(props: Omit<NotFoundProps, 'type'>) {
  return <NotFound type="activity" {...props} />;
}

export function AssignmentNotFound(props: Omit<NotFoundProps, 'type'>) {
  return <NotFound type="assignment" {...props} />;
}

export function UserNotFound(props: Omit<NotFoundProps, 'type'>) {
  return <NotFound type="user" {...props} />;
}

export function FileNotFound(props: Omit<NotFoundProps, 'type'>) {
  return <NotFound type="file" {...props} />;
}

export function ModuleNotFound(props: Omit<NotFoundProps, 'type'>) {
  return <NotFound type="module" {...props} />;
}

export function DiscussionNotFound(props: Omit<NotFoundProps, 'type'>) {
  return <NotFound type="discussion" {...props} />;
}
