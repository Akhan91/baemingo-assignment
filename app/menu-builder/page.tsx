'use client';

import { useMemo, useState, useEffect } from "react";
import type { SubmitEvent } from 'react';
import { MenuItem } from '@/lib/types';
import { getMenuItems, setMenuItems } from '@/lib/menu-storage';
import {
  MenuBuilderHeader,
  MenuItemForm,
  MenuItemsTable,
  menuItemFormSchema,
  type FormState,
  type FormErrors,
} from '@/components/menu-builder';

export default function MenuBuilderPage() {
  const [items, setItems] = useState<MenuItem[]>([]);

  // Load from localStorage only on client to avoid hydration mismatch (server has no localStorage).
  useEffect(() => {
    const stored = getMenuItems();
    queueMicrotask(() => setItems(stored));
  }, []);

  const [form, setForm] = useState<FormState>({
    name: "",
    price: "",
    category: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const isEditing = editingId !== null;

  function resetForm() {
    setForm({ name: "", price: "", category: "" });
    setErrors({});
    setEditingId(null);
  }

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    const result = menuItemFormSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        price: fieldErrors.price?.[0],
        category: fieldErrors.category?.[0],
      });
      return;
    }

    const { name, price, category } = result.data;
    const priceNumber = Number(price);

    if (isEditing && editingId) {
      const updated = items.map((item) =>
        item.id === editingId
          ? {
              ...item,
              name,
              price: priceNumber,
              category,
            }
          : item,
      );

      setItems(updated);
      setMenuItems(updated);
    } else {
      const newItem: MenuItem = {
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name,
        price: priceNumber,
        category,
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

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const item of items) {
      if (item.category) {
        set.add(item.category);
      }
    }
    return Array.from(set);
  }, [items]);

  return (
    <div className="py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <MenuBuilderHeader />

        <section className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <MenuItemForm
            form={form}
            errors={errors}
            isEditing={isEditing}
            categories={categories}
            onFormChange={setForm}
            onSubmit={handleSubmit}
            onReset={resetForm}
          />

          <MenuItemsTable
            items={items}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>
      </div>
    </div>
  );
}
