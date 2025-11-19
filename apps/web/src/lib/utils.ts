import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { theme } from './theme';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number): string {
  return score.toFixed(1);
}

export function getScoreColor(score: number): string {
  if (score >= 9) return theme.colors.accent.gold;
  if (score >= 8) return theme.colors.success;
  if (score >= 7) return theme.colors.accent.blue;
  if (score >= 6) return theme.colors.warning;
  return theme.colors.error;
}

export function getScoreLabel(score: number): string {
  if (score >= 9) return 'Exceptional';
  if (score >= 8) return 'Outstanding';
  if (score >= 7) return 'Excellent';
  if (score >= 6) return 'Good';
  if (score >= 5) return 'Average';
  if (score >= 4) return 'Fair';
  return 'Needs Improvement';
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function validateImageFile(file: File): boolean {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  return allowedTypes.includes(file.type) && file.size <= maxSize;
}

export function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const maxWidth = 1024;
      const maxHeight = 1024;
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(resolve, 'image/jpeg', 0.8);
    };

    img.src = URL.createObjectURL(file);
  });
}

export function getTrendDirection(current: number, previous: number): 'up' | 'down' | 'stable' {
  const threshold = 0.05;
  const change = (current - previous) / previous;

  if (Math.abs(change) < threshold) return 'stable';
  return change > 0 ? 'up' : 'down';
}

export function calculateConfidence(score: number): number {
  // Higher confidence for more extreme scores
  if (score <= 3 || score >= 8) return Math.min(0.95, 0.7 + Math.abs(score - 5.5) * 0.1);
  return Math.max(0.6, 0.8 - Math.abs(score - 5.5) * 0.05);
}