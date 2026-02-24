import type { MenuItem } from '@/lib/types';

const STORAGE_KEY = 'baemingo-menu';
const isBrowser = typeof window !== 'undefined';

export function getMenuItems(): MenuItem[] {
  if (!isBrowser) return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is MenuItem => {
      return (
        item &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.category === 'string' &&
        typeof item.price === 'number'
      );
    });
  } catch {
    return [];
  }
}

export function setMenuItems(items: MenuItem[]): void {
  if (!isBrowser) return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore write errors (e.g. quota exceeded, disabled storage)
  }
}
