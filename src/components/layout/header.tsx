import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrainCircuit } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-gray-950/80 dark:border-gray-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-xl">kritica.com</span>
        </Link>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/#fitur" className="hover:text-blue-600 transition-colors">
            Fitur
          </Link>
          <Link href="/#untuk-guru" className="hover:text-blue-600 transition-colors">
            Untuk Guru
          </Link>
          <Link href="/#testimoni" className="hover:text-blue-600 transition-colors">
            Testimoni
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="outline">Masuk</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Daftar Gratis</Button>
        </div>
      </div>
    </header>
  );
}