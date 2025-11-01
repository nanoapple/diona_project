import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return 'N/A';
  
  if (typeof date === 'string') {
    if (date.trim() === '') return 'N/A';
    date = new Date(date);
  }
  
  // Check if date is valid
  if (isNaN(date.getTime())) return 'N/A';
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

/**
 * Generate a random 6-digit passcode
 */
export function generatePasscode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generate a simple UUID (v4-like)
 * Note: This is not a proper v4 UUID but works for demo purposes
 */
export function v4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
