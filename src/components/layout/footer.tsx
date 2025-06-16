import Link from "next/link";
import { BrainCircuit } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-blue-600" />
          <span className="font-semibold">kritica.com</span>
        </div>
        <p className="text-sm text-gray-500 mt-4 md:mt-0">
          © {new Date().getFullYear()} kritica.com
        </p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-200">
            Privasi
          </Link>
          <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-200">
            Ketentuan
          </Link>
          <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-200">
            Kontak
          </Link>
        </div>
      </div>
    </footer>
  );
}