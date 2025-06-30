/**
 * Generates initials from a name for avatar fallback
 * @param name Full name of the user
 * @returns Initials (usually 2 characters)
 */
export function getInitials(name: string): string {
  if (!name || typeof name !== 'string') return '';

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export const safeJsonParseactivities = (value: any, fallback: any = []) => {
  if (!value) return fallback;

  if (typeof value === 'object') return value;

  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (error) {
      console.error('Error parsing JSON:', error);

      if (value.startsWith('http')) {
        return [{ url: value, name: 'Lampiran' }];
      }

      return fallback;
    }
  }

  return fallback;
};

export function safelyParseJSONCriteria(
  jsonString: any,
  defaultValue: any = {},
) {
  if (typeof jsonString === 'object' && jsonString !== null) {
    return jsonString;
  }

  if (!jsonString || typeof jsonString !== 'string') {
    return defaultValue;
  }

  try {
    return JSON.parse(jsonString);
  } catch (e) {
    try {
      const fixedString = jsonString.replace(/""/g, '"');
      return JSON.parse(fixedString);
    } catch (e2) {
      console.error('Failed to parse JSON:', e2);
      return defaultValue;
    }
  }
}
