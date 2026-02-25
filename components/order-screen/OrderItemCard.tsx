'use client';

import type { OrderItemCardProps } from '@/lib/types';

export function OrderItemCard({ item, displayPrice, onClick }: OrderItemCardProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='flex cursor-pointer flex-col items-start justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2 text-left text-sm shadow-xs transition hover:border-neutral-900 hover:shadow-sm'
    >
      <span className='font-medium text-neutral-900'>{item.name}</span>
      <span className='mt-1 text-xs text-neutral-600'>{displayPrice}</span>
    </button>
  );
}
