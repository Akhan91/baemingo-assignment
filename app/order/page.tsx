'use client';

import { useEffect, useMemo, useState } from 'react';

import type { SubmitEvent } from 'react';
import { MenuItem } from '@/lib/types';
import { getMenuItems } from '@/lib/menu-storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

type OrderLine = {
  id: string;
  itemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
};

function formatMoney(value: number): string {
  return value.toLocaleString('sv-SE', {
    style: 'currency',
    currency: 'SEK',
  });
}

export default function OrderPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orderLines, setOrderLines] = useState<OrderLine[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [openPriceDialogOpen, setOpenPriceDialogOpen] = useState(false);
  const [openPriceItem, setOpenPriceItem] = useState<MenuItem | null>(null);
  const [openPriceInput, setOpenPriceInput] = useState('');
  const [openPriceError, setOpenPriceError] = useState<string | null>(null);

  // Load menu items from localStorage on client only to avoid hydration issues.
  useEffect(() => {
    const stored = getMenuItems();
    queueMicrotask(() => {
      setMenuItems(stored);
      if (stored.length > 0) {
        const firstCategory = stored[0]?.category ?? null;
        setSelectedCategory(firstCategory);
      }
    });
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const item of menuItems) {
      if (item.category) {
        set.add(item.category);
      }
    }
    return Array.from(set);
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    if (!selectedCategory) return menuItems;
    return menuItems.filter((item) => item.category === selectedCategory);
  }, [menuItems, selectedCategory]);

  const orderTotal = useMemo(
    () => orderLines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0),
    [orderLines],
  );

  function addLineForItem(item: MenuItem, unitPrice: number) {
    setOrderLines((current) => {
      // For fixed-price items, merge by item+price; for open-price we also merge if same price.
      const existingIndex = current.findIndex(
        (line) => line.itemId === item.id && line.unitPrice === unitPrice,
      );

      if (existingIndex >= 0) {
        const copy = [...current];
        copy[existingIndex] = {
          ...copy[existingIndex],
          quantity: copy[existingIndex].quantity + 1,
        };
        return copy;
      }

      const newLine: OrderLine = {
        id:
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        itemId: item.id,
        name: item.name,
        unitPrice,
        quantity: 1,
      };

      return [...current, newLine];
    });
  }

  function handleItemClick(item: MenuItem) {
    if (item.price === 0) {
      // Open price item: prompt for price before adding.
      setOpenPriceItem(item);
      setOpenPriceInput('');
      setOpenPriceError(null);
      setOpenPriceDialogOpen(true);
    } else {
      addLineForItem(item, item.price);
    }
  }

  function handleConfirmOpenPrice(event: SubmitEvent) {
    event.preventDefault();
    const value = openPriceInput.trim();
    const amount = Number(value.replace(',', '.'));

    if (value === '' || Number.isNaN(amount)) {
      setOpenPriceError('Please enter a valid price.');
      return;
    }

    if (amount < 0) {
      setOpenPriceError('Price must be greater than or equal to 0.');
      return;
    }

    if (!openPriceItem) return;

    addLineForItem(openPriceItem, amount);
    setOpenPriceDialogOpen(false);
    setOpenPriceItem(null);
    setOpenPriceInput('');
    setOpenPriceError(null);
  }

  function handleQuantityChange(id: string, delta: number) {
    setOrderLines((current) =>
      current
        .map((line) => (line.id === id ? { ...line, quantity: Math.max(1, line.quantity + delta) } : line))
        .filter((line) => line.quantity > 0),
    );
  }

  function handleRemoveLine(id: string) {
    setOrderLines((current) => current.filter((line) => line.id !== id));
  }

  function handleClearOrder() {
    setOrderLines([]);
  }

  const hasMenu = menuItems.length > 0;

  return (
    <main className='min-h-screen bg-neutral-50 px-4 py-10 text-neutral-900'>
      <div className='mx-auto flex max-w-5xl flex-col gap-8'>
        <header className='flex flex-col gap-2'>
          <h1 className='text-2xl font-semibold tracking-tight'>Order Screen</h1>
          <p className='text-sm text-neutral-600'>
            Tap items to add them to the order. Open price items will ask you to enter a price before they are
            added.
          </p>
        </header>

        {!hasMenu ? (
          <Card>
            <CardHeader>
              <CardTitle>No menu items</CardTitle>
              <CardDescription>
                Configure your menu first on the {''}
                <a className='text-primary hover:underline' href='/menu-builder'>
                  Menu Builder
                </a>{' '}
                page. Items saved there will appear here.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <section className='grid gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]'>
            <Card>
              <CardHeader>
                <CardTitle>Menu</CardTitle>
                <CardDescription>Select a category and tap an item to add it to the order.</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                {categories.length > 1 && (
                  <div className='flex flex-wrap gap-2'>
                    {categories.map((category) => (
                      <Button
                        key={category}
                        type='button'
                        variant={category === selectedCategory ? 'default' : 'outline'}
                        size='sm'
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                )}

                <div className='grid grid-cols-2 gap-3 md:grid-cols-3'>
                  {filteredItems.map((item) => (
                    <button
                      key={item.id}
                      type='button'
                      onClick={() => handleItemClick(item)}
                      className='flex flex-col items-start justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2 text-left text-sm shadow-xs transition hover:border-neutral-900 hover:shadow-sm'
                    >
                      <span className='font-medium text-neutral-900'>{item.name}</span>
                      <span className='mt-1 text-xs text-neutral-600'>
                        {item.price === 0 ? 'Open price' : formatMoney(item.price)}
                      </span>
                    </button>
                  ))}

                  {filteredItems.length === 0 && (
                    <p className='col-span-full text-sm text-neutral-500'>No items in this category.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between gap-2'>
                <div className='flex flex-col gap-1'>
                  <CardTitle>Current order</CardTitle>
                  <CardDescription>Manage quantities, remove lines, and review the total.</CardDescription>
                </div>
                {orderLines.length > 0 && (
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={handleClearOrder}
                    className='cursor-pointer'
                  >
                    Clear order
                  </Button>
                )}
              </CardHeader>
              <CardContent className='space-y-4'>
                {orderLines.length === 0 ? (
                  <p className='text-sm text-neutral-500'>
                    No items in the order yet. Tap a menu item to add it.
                  </p>
                ) : (
                  <div className='space-y-3'>
                    {orderLines.map((line) => (
                      <div
                        key={line.id}
                        className='flex items-start justify-between gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm'
                      >
                        <div>
                          <div className='font-medium text-neutral-900'>{line.name}</div>
                          <div className='mt-0.5 text-xs text-neutral-600'>
                            {formatMoney(line.unitPrice)} each
                          </div>
                        </div>
                        <div className='flex flex-col items-end gap-1'>
                          <div className='flex items-center gap-2'>
                            <Button
                              type='button'
                              variant='outline'
                              size='xs'
                              className='cursor-pointer'
                              onClick={() => handleQuantityChange(line.id, -1)}
                            >
                              −
                            </Button>
                            <span className='min-w-[2ch] text-center text-sm'>{line.quantity}</span>
                            <Button
                              type='button'
                              variant='outline'
                              size='xs'
                              className='cursor-pointer'
                              onClick={() => handleQuantityChange(line.id, 1)}
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
                            className='cursor-pointer mt-4'
                            onClick={() => handleRemoveLine(line.id)}
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
                  <span>{formatMoney(orderTotal)}</span>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </div>

      <Dialog open={openPriceDialogOpen} onOpenChange={setOpenPriceDialogOpen}>
        <DialogContent>
          <form onSubmit={handleConfirmOpenPrice} className='space-y-4'>
            <DialogHeader>
              <DialogTitle>Set price</DialogTitle>
              <DialogDescription>
                Enter the price in SEK for{' '}
                <span className='font-medium'>{openPriceItem?.name ?? 'this item'}</span>.
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-1.5'>
              <Input
                type='number'
                min={0}
                step='0.01'
                value={openPriceInput}
                onChange={(event) => {
                  setOpenPriceInput(event.target.value);
                  setOpenPriceError(null);
                }}
                placeholder='0.00'
                aria-invalid={Boolean(openPriceError) || undefined}
              />
              {openPriceError && <p className='text-xs text-red-600'>{openPriceError}</p>}
            </div>
            <DialogFooter className='pt-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  setOpenPriceDialogOpen(false);
                  setOpenPriceItem(null);
                  setOpenPriceInput('');
                  setOpenPriceError(null);
                }}
              >
                Cancel
              </Button>
              <Button type='submit'>Add to order</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
