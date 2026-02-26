'use client';

import type { SubmitEvent } from 'react';
import type { MenuItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type OpenPriceDialogProps = {
  open: boolean;
  item: MenuItem | null;
  inputValue: string;
  error: string | null;
  onChangeInput: (value: string) => void;
  onCancel: () => void;
  onSubmit: (event: SubmitEvent) => void;
};

export function OpenPriceDialog({
  open,
  item,
  inputValue,
  error,
  onChangeInput,
  onCancel,
  onSubmit,
}: OpenPriceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <form onSubmit={onSubmit} className='space-y-4'>
          <DialogHeader>
            <DialogTitle>Set price</DialogTitle>
            <DialogDescription>
              Enter the price in SEK for <span className='font-medium'>{item?.name ?? 'this item'}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-1.5'>
            <Input
              type='number'
              min={0}
              value={inputValue}
              onChange={(event) => onChangeInput(event.target.value)}
              placeholder='0.00'
              aria-invalid={Boolean(error) || undefined}
            />
            {error && <p className='text-xs text-red-600'>{error}</p>}
          </div>
          <DialogFooter className='pt-2'>
            <Button type='button' variant='outline' onClick={onCancel}>
              Cancel
            </Button>
            <Button type='submit'>Add to order</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
