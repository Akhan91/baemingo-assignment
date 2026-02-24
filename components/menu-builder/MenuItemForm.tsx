'use client';

import { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export type FormState = {
  name: string;
  price: string;
  category: string;
};

export type FormErrors = {
  name?: string;
  price?: string;
  category?: string;
};

type MenuItemFormProps = {
  form: FormState;
  errors: FormErrors;
  isEditing: boolean;
  onFormChange: (next: FormState) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
};

export function MenuItemForm({
  form,
  errors,
  isEditing,
  onFormChange,
  onSubmit,
  onReset,
}: MenuItemFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>{isEditing ? 'Edit menu item' : 'Add new menu item'}</CardTitle>
        <CardDescription className='text-xs'>Create your menu items here</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className='space-y-4'>
          <div className='space-y-1.5'>
            <Label htmlFor='name'>Name</Label>
            <Input
              id='name'
              type='text'
              value={form.name}
              onChange={(e) =>
                onFormChange({
                  ...form,
                  name: e.target.value,
                })
              }
              placeholder='Espresso'
              aria-invalid={Boolean(errors.name) || undefined}
            />
            {errors.name && <p className='text-xs text-red-600'>{errors.name}</p>}
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='price'>Price</Label>
            <Input
              id='price'
              type='number'
              min={0}
              step='0.01'
              value={form.price}
              onChange={(e) =>
                onFormChange({
                  ...form,
                  price: e.target.value,
                })
              }
              placeholder='3.50'
              aria-invalid={Boolean(errors.price) || undefined}
            />
            <p className='text-xs text-neutral-500'>
              Set to 0 for open price items (cashier chooses price when ordering).
            </p>
            {errors.price && <p className='text-xs text-red-600'>{errors.price}</p>}
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='category'>Category</Label>
            <Input
              id='category'
              type='text'
              value={form.category}
              onChange={(e) =>
                onFormChange({
                  ...form,
                  category: e.target.value,
                })
              }
              placeholder='Drinks'
              aria-invalid={Boolean(errors.category) || undefined}
            />
            {errors.category && <p className='text-xs text-red-600'>{errors.category}</p>}
          </div>

          <CardFooter className='px-0'>
            <div className='flex flex-wrap gap-3'>
              <Button type='submit' className='cursor-pointer'>
                {isEditing ? 'Save changes' : 'Add item'}
              </Button>
              {isEditing && (
                <Button type='button' variant='outline' onClick={onReset}>
                  Cancel edit
                </Button>
              )}
            </div>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
