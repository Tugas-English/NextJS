import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Parse JSON string dengan aman
 * @param jsonString String JSON yang akan di-parse
 * @param fallback Nilai default jika parsing gagal
 * @returns Hasil parsing atau nilai default
 */
export function safeJsonParse(jsonString: any, fallback: any = {}) {
  // Jika sudah berupa objek, kembalikan langsung
  if (typeof jsonString === 'object' && jsonString !== null) {
    return jsonString;
  }

  // Jika bukan string atau string kosong, kembalikan fallback
  if (!jsonString || typeof jsonString !== 'string') {
    return fallback;
  }

  // Coba parse JSON
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    // Jika gagal dan string dimulai dengan http, mungkin ini URL
    if (jsonString.trim().startsWith('http')) {
      // Kembalikan array dengan satu URL atau URL itu sendiri tergantung fallback
      return Array.isArray(fallback) ? [jsonString] : jsonString;
    }

    console.error('Failed to parse JSON:', e, jsonString);
    return fallback;
  }
}

/**
 * Stringify objek ke JSON dengan aman
 * @param value Nilai yang akan di-stringify
 * @param fallback Nilai default jika stringify gagal
 * @returns String JSON atau nilai default
 */
export function safeJsonStringify(value: any, fallback: string = '[]') {
  try {
    return JSON.stringify(value);
  } catch (e) {
    console.error('Failed to stringify object:', e);
    return fallback;
  }
}
