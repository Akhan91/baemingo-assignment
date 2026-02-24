'use client';

import { useState, FormEvent } from 'react';

import { MenuItem } from '@/lib/types';
import { getMenuItems, setMenuItems } from '@/lib/menu-storage';
import {
  MenuBuilderHeader,
  MenuItemForm,
  MenuItemsTable,
  type FormState,
  type FormErrors,
} from '@/components/menu-builder';

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
        <MenuBuilderHeader />

        <section className='grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]'>
          <MenuItemForm
            form={form}
            errors={errors}
            isEditing={isEditing}
            onFormChange={setForm}
            onSubmit={handleSubmit}
            onReset={resetForm}
          />

          <MenuItemsTable items={items} onEdit={handleEdit} onDelete={handleDelete} />
        </section>
      </div>
    </main>
  );
}
