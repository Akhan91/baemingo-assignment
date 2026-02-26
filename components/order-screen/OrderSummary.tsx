'use client';

import { OrderLine } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrashIcon } from 'lucide-react';

function formatMoney(value: number): string {
  return value.toLocaleString('sv-SE', {
    style: 'currency',
    currency: 'SEK',
  });
}

type OrderSummaryProps = {
  lines: OrderLine[];
  total: number;
  onChangeQuantity: (id: string, delta: number) => void;
  onRemoveLine: (id: string) => void;
  onClear: () => void;
};

export function OrderSummary({ lines, total, onChangeQuantity, onRemoveLine, onClear }: OrderSummaryProps) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between gap-2'>
        <div className='flex flex-col gap-1'>
          <CardTitle>Current order</CardTitle>
          <CardDescription>Manage quantities, remove lines, and review the total.</CardDescription>
        </div>
        {lines.length > 0 && (
          <Button type='button' variant='outline' size='sm' onClick={onClear} className='cursor-pointer'>
            <TrashIcon className='size-4' />
            Clear order
          </Button>
        )}
      </CardHeader>
      <CardContent className='space-y-4'>
        {lines.length === 0 ? (
          <p className='text-sm text-neutral-500'>No items in the order yet. Tap a menu item to add it.</p>
        ) : (
          <div className='space-y-3'>
            {lines.map((line) => (
              <div
                key={line.id}
                className='flex items-start justify-between gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm'
              >
                <div>
                  <div className='font-medium text-neutral-900'>{line.name}</div>
                  <div className='mt-0.5 text-xs text-neutral-600'>{formatMoney(line.unitPrice)} each</div>
                </div>
                <div className='flex flex-col items-end gap-1'>
                  <div className='flex items-center gap-2'>
                    <Button
                      type='button'
                      variant='outline'
                      size='xs'
                      className='cursor-pointer'
                      onClick={() => onChangeQuantity(line.id, -1)}
                    >
                      −
                    </Button>
                    <span className='min-w-[2ch] text-center text-sm'>{line.quantity}</span>
                    <Button
                      type='button'
                      variant='outline'
                      size='xs'
                      className='cursor-pointer'
                      onClick={() => onChangeQuantity(line.id, 1)}
                    >
                      +
                    </Button>
                  </div>
                  <div className='text-sm font-semibold text-neutral-900'>
                    {formatMoney(line.unitPrice * line.quantity)}
                  </div>
                  <Button
                    type='button'
                    variant='destructive'
                    size='xs'
                    className='mt-4 cursor-pointer'
                    onClick={() => onRemoveLine(line.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className='flex items-center justify-between border-t border-dashed border-neutral-200 pt-3 text-sm font-medium'>
          <span>Total</span>
          <span>{formatMoney(total)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
