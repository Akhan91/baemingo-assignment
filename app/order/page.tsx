'use client';

import { useEffect, useMemo, useState } from 'react';
import type { SubmitEvent } from 'react';
import { MenuItem, OrderLine } from '@/lib/types';
import { getMenuItems } from '@/lib/menu-storage';
import { getOrderLines, saveOrderLines } from '@/lib/order-storage';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderMenu } from '@/components/order-screen/OrderMenu';
import { OrderSummary } from '@/components/order-screen/OrderSummary';
import { OpenPriceDialog } from '@/components/order-screen/OpenPriceDialog';

export default function OrderPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orderLines, setOrderLines] = useState<OrderLine[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openPriceDialogOpen, setOpenPriceDialogOpen] = useState(false);
  const [openPriceItem, setOpenPriceItem] = useState<MenuItem | null>(null);
  const [openPriceInput, setOpenPriceInput] = useState('');
  const [openPriceError, setOpenPriceError] = useState<string | null>(null);

  // Load menu items and any existing order from localStorage on client only, to avoid hydration issues.
  useEffect(() => {
    const storedMenu = getMenuItems();
    const storedOrder = getOrderLines();
    queueMicrotask(() => {
      setMenuItems(storedMenu);
      if (storedMenu.length > 0) {
        const firstCategory = storedMenu[0]?.category ?? null;
        setSelectedCategory(firstCategory);
      }
      setOrderLines(storedOrder);
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

  const hasMenu = menuItems.length > 0;

  function addLineForItem(item: MenuItem, unitPrice: number) {
    setOrderLines((current) => {
      // This isfor preventing duplicate items in the cart if they have the same price, since open price items can have the same price.
      const existingIndex = current.findIndex(
        (line) => line.itemId === item.id && line.unitPrice === unitPrice,
      );

      let nextOrderLines: OrderLine[];

      if (existingIndex >= 0) {
        nextOrderLines = [...current];
        nextOrderLines[existingIndex] = {
          ...nextOrderLines[existingIndex],
          quantity: nextOrderLines[existingIndex].quantity + 1,
        };
      } else {
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

        nextOrderLines = [...current, newLine];
      }

      saveOrderLines(nextOrderLines);
      return nextOrderLines;
    });
  }

  function handleItemClick(item: MenuItem) {
    if (item.price === 0) {
      // Open price item: prompt user to enter price before adding.
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
    setOrderLines((current) => {
      const next = current
        .map((line) => (line.id === id ? { ...line, quantity: Math.max(1, line.quantity + delta) } : line))
        .filter((line) => line.quantity > 0);

      saveOrderLines(next);
      return next;
    });
  }

  function handleRemoveLine(id: string) {
    setOrderLines((current) => {
      const next = current.filter((line) => line.id !== id);
      saveOrderLines(next);
      return next;
    });
  }

  function handleClearOrder() {
    setOrderLines([]);
    saveOrderLines([]);
  }

  function handleSendOrder() {
    if (orderLines.length === 0) return;
    // Alert is used for simplicity, to confirm order is sent
    alert('Order sent!');
    handleClearOrder();
  }

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
                Configure your menu first on the{' '}
                <a className='text-primary hover:underline' href='/menu-builder'>
                  Menu Builder
                </a>{' '}
                page. Items saved there will appear here.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <section className='grid gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]'>
            <OrderMenu
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              items={filteredItems}
              onItemClick={handleItemClick}
            />

            <OrderSummary
              orderLines={orderLines}
              total={orderTotal}
              onChangeQuantity={handleQuantityChange}
              onRemoveLine={handleRemoveLine}
              onClear={handleClearOrder}
              onSendOrder={handleSendOrder}
            />
          </section>
        )}
      </div>

      <OpenPriceDialog
        open={openPriceDialogOpen}
        item={openPriceItem}
        inputValue={openPriceInput}
        error={openPriceError}
        onChangeInput={(value) => {
          setOpenPriceInput(value);
          setOpenPriceError(null);
        }}
        onCancel={() => {
          setOpenPriceDialogOpen(false);
          setOpenPriceItem(null);
          setOpenPriceInput('');
          setOpenPriceError(null);
        }}
        onSubmit={handleConfirmOpenPrice}
      />
    </main>
  );
}
