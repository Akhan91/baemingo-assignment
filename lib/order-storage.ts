import type { OrderLine } from "./types";

const STORAGE_KEY = "baemingo-order";

const isBrowser = typeof window !== "undefined";

export function getOrderLines(): OrderLine[] {
  if (!isBrowser) return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is OrderLine => {
      return (
        item &&
        typeof item.id === "string" &&
        typeof item.itemId === "string" &&
        typeof item.name === "string" &&
        typeof item.unitPrice === "number" &&
        typeof item.quantity === "number"
      );
    });
  } catch {
    return [];
  }
}

export function saveOrderLines(lines: OrderLine[]): void {
  if (!isBrowser) return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // ignore write errors (e.g. quota exceeded, disabled storage)
  }
}

