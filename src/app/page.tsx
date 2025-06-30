import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ArrowRight,
  BrainCircuit,
  BookOpen,
  PenSquare,
  Mic,
  Users,
  Trophy,
  BarChart3,
  CheckCircle,
  GraduationCap,
  LayoutDashboard,
  FileText,
  Settings,
} from 'lucide-react';
import { getServerSession } from '@/lib/session';
import Link from 'next/link';

export default async function HomePage() {
  const session = await getServerSession();
  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <a href="#" className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">HOTS English</span>
          </a>
          <nav className="hidden gap-6 text-sm font-medium md:flex">
            <a href="#fitur" className="transition-colors hover:text-blue-600">
              Fitur
            </a>
            <a
              href="#untuk-guru"
              className="transition-colors hover:text-blue-600"
            >
              Untuk Guru
            </a>
            <a
              href="#testimoni"
              className="transition-colors hover:text-blue-600"
            >
              Testimoni
            </a>
          </nav>
          <div className="flex items-center gap-4">
            {session?.user && (
              <Link
                href={session?.user.role === 'student' ? '/student' : 'teacher'}
                className={buttonVariants({ variant: 'outline' })}
              >
                Dashboard
              </Link>
            )}
            {!session?.user && (
              <>
                <Link
                  href="/sign-in"
                  className={buttonVariants({ variant: 'outline' })}
                >
                  Masuk
                </Link>
                <Link
                  href={'/sign-up'}
                  className={buttonVariants({
                    variant: 'default',
                    className: 'bg-blue-600 text-white hover:bg-blue-700',
                  })}
                >
                  Daftar Gratis
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section
          id="hero"
          className="container mx-auto px-4 py-20 text-center md:px-6 md:py-32"
        >
          <Badge
            variant="outline"
            className="mb-4 rounded-full border-blue-300 px-3 py-1 text-blue-600"
          >
            Platform Belajar Bahasa Inggris Berbasis HOTS
          </Badge>
          <h1 className="text-4xl leading-tight font-bold tracking-tight md:text-6xl">
            Tingkatkan Keterampilan{' '}
            <span className="text-blue-600">Berpikir Kritis</span> Bahasa
            Inggris Anda
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            HOTS English membantu siswa menganalisis, mengevaluasi, dan mencipta
            melalui aktivitas interaktif yang dirancang khusus untuk mengasah
            Higher-Order Thinking Skills.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button
              size="lg"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Mulai Belajar Sekarang <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">
              Lihat Demo
            </Button>
          </div>
        </section>

        {/* Fitur Utama untuk Siswa */}
        <section
          id="fitur"
          className="bg-gray-50 py-16 md:py-24 dark:bg-gray-900"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold">
                Platform Lengkap untuk Siswa 👦
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Semua yang Anda butuhkan untuk menjadi pemikir kritis dalam
                Bahasa Inggris.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {studentFeatures.map((feature, index) => (
                <Card key={index} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                        <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Fitur Utama untuk Guru */}
        <section id="untuk-guru" className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold">
                Peralatan Canggih untuk Guru 👩‍🏫
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Kelola kelas, buat tugas HOTS, dan pantau kemajuan siswa dengan
                mudah.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {teacherFeatures.map((feature, index) => (
                <Card
                  key={index}
                  className="flex flex-col bg-gray-50 dark:bg-gray-900"
                >
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                        <feature.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimoni */}
        <section
          id="testimoni"
          className="bg-gray-50 py-16 md:py-24 dark:bg-gray-900"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold">Apa Kata Mereka?</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Pengalaman nyata dari siswa dan guru yang telah menggunakan HOTS
                English.
              </p>
            </div>
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
              <Card>
                <CardContent className="pt-6">
                  <p className="italic">
                    &quot;Platform ini benar-benar mengubah cara saya belajar.
                    Feedback berbasis rubriknya sangat membantu saya tahu di
                    mana letak kekurangan saya. Weekly Challenge-nya juga
                    seru!&quot;
                  </p>
                </CardContent>
                <CardFooter className="mt-4 flex items-center gap-4">
                  <Avatar>
                    <AvatarImage
                      src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                      alt="Siti"
                    />
                    <AvatarFallback>S</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Siti Aisyah</p>
                    <p className="text-sm text-gray-500">Siswa Kelas 11</p>
                  </div>
                </CardFooter>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="italic">
                    &quot;Membuat soal HOTS yang berkualitas kini jauh lebih
                    mudah. Dashboard performa siswa sangat powerful untuk
                    memetakan kemampuan kelas. Fitur ekspor laporan juga
                    menghemat waktu saya.&quot;
                  </p>
                </CardContent>
                <CardFooter className="mt-4 flex items-center gap-4">
                  <Avatar>
                    <AvatarImage
                      src="https://i.pravatar.cc/150?u=a042581f4e29026704e"
                      alt="Budi"
                    />
                    <AvatarFallback>B</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Budi Santoso, M.Pd.</p>
                    <p className="text-sm text-gray-500">Guru Bahasa Inggris</p>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 text-center md:px-6">
            <h2 className="text-3xl font-bold md:text-4xl">
              Siap Mengubah Cara Belajar Anda?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-600 dark:text-gray-400">
              Bergabunglah dengan ribuan siswa dan guru lainnya. Mulai
              perjalanan berpikir kritis Anda hari ini.
            </p>
            <div className="mt-8">
              <Button
                size="lg"
                className="bg-blue-600 px-8 py-6 text-lg text-white hover:bg-blue-700"
              >
                Daftar Gratis Sekarang
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t dark:border-gray-800">
        <div className="container mx-auto flex flex-col items-center justify-between px-4 py-8 md:flex-row md:px-6">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-blue-600" />
            <span className="font-semibold">HOTS English</span>
          </div>
          <p className="mt-4 text-sm text-gray-500 md:mt-0">
            © {new Date().getFullYear()} HOTS English. All rights reserved.
          </p>
          <div className="mt-4 flex gap-4 md:mt-0">
            <a
              href="#"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
            >
              Privasi
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
            >
              Ketentuan
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
            >
              Kontak
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Data untuk fitur siswa
const studentFeatures = [
  {
    icon: BrainCircuit,
    title: 'HOTS Activity Explorer',
    description:
      'Pilih aktivitas berdasarkan skill (Reading, Listening, Writing, Speaking) dan filter berdasarkan tipe HOTS.',
  },
  {
    icon: BookOpen,
    title: 'Interactive Learning Modules',
    description:
      'Materi dan tugas berbasis teks, audio, dan video yang dirancang untuk memancing pemikiran kritis.',
  },
  {
    icon: CheckCircle,
    title: 'HOTS-Based Rubric Feedback',
    description:
      'Dapatkan feedback detail berdasarkan rubrik yang jelas untuk memahami kekuatan dan kelemahan Anda.',
  },
  {
    icon: Trophy,
    title: 'Weekly HOTS Challenge',
    description:
      'Ikuti tantangan mingguan, dapatkan poin, lencana, dan naiki papan peringkat.',
  },
  {
    icon: Users,
    title: 'Discussion Board',
    description:
      'Asah pemikiran kritis bersama teman melalui diskusi dan saling memberikan masukan (peer-to-peer).',
  },
  {
    icon: BarChart3,
    title: 'My Learning Progress',
    description:
      'Lacak kemajuan nilai, tugas, dan skill HOTS yang paling sering Anda asah melalui grafik visual.',
  },
];

// Data untuk fitur guru
const teacherFeatures = [
  {
    icon: PenSquare,
    title: 'Buat Tugas HOTS Custom',
    description:
      'Desain dan berikan tugas custom berdasarkan jenis HOTS, lengkap dengan materi pendukung dan rubrik.',
  },
  {
    icon: LayoutDashboard,
    title: 'Siswa Performance Dashboard',
    description:
      'Pantau performa setiap siswa dan identifikasi skill HOTS mana yang perlu ditingkatkan melalui data visual.',
  },
  {
    icon: Settings,
    title: 'Rubrik Editor Fleksibel',
    description:
      'Ubah bobot skor, impor, atau ekspor rubrik penilaian dalam format JSON/CSV sesuai kebutuhan Anda.',
  },
  {
    icon: GraduationCap,
    title: 'Review & Feedback Panel',
    description:
      'Nilai jawaban siswa secara efisien langsung pada panel, berikan komentar membangun sesuai rubrik.',
  },
  {
    icon: FileText,
    title: 'Export Laporan',
    description:
      'Ekspor hasil tugas dan nilai siswa ke format PDF atau Excel untuk keperluan rapor atau laporan belajar.',
  },
  {
    icon: Mic,
    title: 'Dukung Multi-Format',
    description:
      'Buat tugas dan terima jawaban siswa dalam berbagai format: teks, audio, hingga video.',
  },
];
