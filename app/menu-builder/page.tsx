'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';

import { MenuItem } from '@/lib/types';
import { getMenuItems, setMenuItems } from '@/lib/menu-storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PencilIcon, TrashIcon } from 'lucide-react';

type FormState = {
  name: string;
  price: string;
  category: string;
};

type FormErrors = {
  name?: string;
  price?: string;
  category?: string;
};

export default function MenuBuilderPage() {
  const [items, setItems] = useState<MenuItem[]>(() => getMenuItems());
  const [form, setForm] = useState<FormState>({
    name: '',
    price: '',
    category: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const isEditing = editingId !== null;

  function resetForm() {
    setForm({ name: '', price: '', category: '' });
    setErrors({});
    setEditingId(null);
  }

  function validate(): boolean {
    const nextErrors: FormErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = 'Name is required.';
    }

    const priceNumber = Number(form.price);
    if (Number.isNaN(priceNumber) || form.price.trim() === '') {
      nextErrors.price = 'Price must be a number.';
    } else if (priceNumber < 0) {
      nextErrors.price = 'Price must be greater than or equal to 0.';
    }

    if (!form.category.trim()) {
      nextErrors.category = 'Category is required.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    const priceNumber = Number(form.price);

    if (isEditing && editingId) {
      const updated = items.map((item) =>
        item.id === editingId
          ? {
              ...item,
              name: form.name.trim(),
              price: priceNumber,
              category: form.category.trim(),
            }
          : item,
      );

      setItems(updated);
      setMenuItems(updated);
    } else {
      const newItem: MenuItem = {
        id:
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name: form.name.trim(),
        price: priceNumber,
        category: form.category.trim(),
      };

      const updated = [...items, newItem];
      setItems(updated);
      setMenuItems(updated);
    }

    resetForm();
  }

  function handleEdit(item: MenuItem) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      price: String(item.price),
      category: item.category,
    });
    setErrors({});
  }

  function handleDelete(id: string) {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    setMenuItems(updated);
    if (editingId === id) {
      resetForm();
    }
  }

  return (
    <main className='min-h-screen bg-neutral-50 px-4 py-10 text-neutral-900'>
      <div className='mx-auto flex max-w-5xl flex-col gap-8'>
        <header className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-2xl font-semibold tracking-tight'>Menu Builder</h1>
            <p className='mt-1 text-sm text-neutral-600'>
              Create, edit, and delete menu items. Items are saved in this browser so they can be used on the
              order screen.
            </p>
          </div>
          <nav className='flex gap-2 text-sm'>
            <Button variant='outline' asChild>
              <Link
                href='/'
                className='rounded-md border border-neutral-200 px-4 py-2 text-neutral-700 transition hover:bg-neutral-100'
              >
                Home
              </Link>
            </Button>
            <Button variant='default' asChild>
              <Link
                href='/order'
                className='rounded-md bg-neutral-900 px-4 py-2 font-medium text-neutral-50 transition hover:bg-neutral-800'
              >
                Order Screen
              </Link>
            </Button>
          </nav>
        </header>

        <section className='grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>{isEditing ? 'Edit menu item' : 'Add new menu item'}</CardTitle>
              <CardDescription className='text-xs'>
                Price 0 means the item is open price. The cashier will choose the price when ordering.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='space-y-1.5'>
                  <Label htmlFor='name'>Name</Label>
                  <Input
                    id='name'
                    type='text'
                    value={form.name}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        name: e.target.value,
                      }))
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
                      setForm((current) => ({
                        ...current,
                        price: e.target.value,
                      }))
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
                      setForm((current) => ({
                        ...current,
                        category: e.target.value,
                      }))
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
                      <Button type='button' variant='outline' onClick={resetForm}>
                        Cancel edit
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between gap-2'>
              <div>
                <CardTitle className='text-lg'>Current menu</CardTitle>
                <CardDescription className='text-xs'>
                  {items.length === 0
                    ? 'No items yet. Add your first item on the left.'
                    : `${items.length} item${items.length === 1 ? '' : 's'}`}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <p className='py-6 text-center text-sm text-neutral-500'>No menu items yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='text-left'>Name</TableHead>
                      <TableHead className='text-left'>Category</TableHead>
                      <TableHead className='text-right'>Price</TableHead>
                      <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className='align-middle'>
                          <div className='font-medium text-neutral-900'>{item.name}</div>
                          {item.price === 0 && (
                            <p className='mt-0.5 text-xs text-neutral-500'>Open price item</p>
                          )}
                        </TableCell>
                        <TableCell className='align-middle text-neutral-700'>{item.category}</TableCell>
                        <TableCell className='align-middle text-right text-neutral-800'>
                          {item.price === 0
                            ? 'Open'
                            : item.price.toLocaleString(undefined, {
                                style: 'currency',
                                currency: 'SEK',
                              })}
                        </TableCell>
                        <TableCell className='align-middle text-right'>
                          <div className='flex justify-end gap-4'>
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              onClick={() => handleEdit(item)}
                              className='cursor-pointer'
                            >
                              <PencilIcon className='size-4' />
                              Edit
                            </Button>
                            <Button
                              type='button'
                              variant='destructive'
                              size='sm'
                              onClick={() => handleDelete(item.id)}
                              className='cursor-pointer'
                            >
                              <TrashIcon className='size-4' />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
