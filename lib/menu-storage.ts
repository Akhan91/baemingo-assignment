import type { MenuItem } from '@/lib/types';

const STORAGE_KEY = 'baemingo-menu';
const isBrowser = typeof window !== 'undefined';

export function getMenuItems(): MenuItem[] {
  if (!isBrowser) return [];

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) return [];

    const parsed = JSON.parse(rawValue) as unknown;
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
  } catch (error) {
    console.error(error, 'Error saving menu items to localStorage');
  }
}
