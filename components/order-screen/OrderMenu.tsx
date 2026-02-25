'use client';

import { MenuItem } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderItemCard } from './OrderItemCard';

function formatMoney(value: number): string {
  return value.toLocaleString('sv-SE', {
    style: 'currency',
    currency: 'SEK',
  });
}

type OrderMenuProps = {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string) => void;
  items: MenuItem[];
  onItemClick: (item: MenuItem) => void;
};

export function OrderMenu({
  categories,
  selectedCategory,
  onSelectCategory,
  items,
  onItemClick,
}: OrderMenuProps) {
  return (
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
                onClick={() => onSelectCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        <div className='grid grid-cols-2 gap-3 md:grid-cols-3'>
          {items.map((item) => (
            <OrderItemCard
              key={item.id}
              item={item}
              displayPrice={item.price === 0 ? 'Open price' : formatMoney(item.price)}
              onClick={() => onItemClick(item)}
            />
          ))}

          {items.length === 0 && (
            <p className='col-span-full text-sm text-neutral-500'>No items in this category.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
