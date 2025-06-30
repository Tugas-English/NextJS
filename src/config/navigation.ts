'use client';
import {
  Activity,
  Award,
  BarChart2,
  BookMarked,
  BookOpen,
  Brain,
  CheckCircle,
  ClipboardList,
  Clock,
  FileEdit,
  FileOutput,
  FileText,
  Filter,
  Gauge,
  GraduationCap,
  Library,
  LifeBuoy,
  LineChart,
  MessageCircle,
  MessageSquare,
  Newspaper,
  Plus,
  Repeat,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';

export const studentNavigations = {
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

export const TeacherNavigations = {
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
};
