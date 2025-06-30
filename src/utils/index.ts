/**
 * Generates initials from a name for avatar fallback
 * @param name Full name of the user
 * @returns Initials (usually 2 characters)
 */
export function getInitials(name: string): string {
  if (!name || typeof name !== 'string') return '';

  // Remove extra spaces and split into parts
  const parts = name.trim().split(/\s+/);

  // If only one part, take first 2 letters
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  // Take first letter of first and last parts
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
