"use client";

import { useEffect, useState, FormEvent } from "react";
import { MenuItem } from "@/lib/types";
import { getMenuItems, setMenuItems } from "@/lib/menu-storage";
import Link from "next/link";

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
  const [items, setItems] = useState<MenuItem[]>([]);
  const [form, setForm] = useState<FormState>({
    name: "",
    price: "",
    category: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const stored = getMenuItems();
    setItems(stored);
  }, []);

  const isEditing = editingId !== null;

  function resetForm() {
    setForm({ name: "", price: "", category: "" });
    setErrors({});
    setEditingId(null);
  }

  function validate(): boolean {
    const nextErrors: FormErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Name is required.";
    }

    const priceNumber = Number(form.price);
    if (Number.isNaN(priceNumber) || form.price.trim() === "") {
      nextErrors.price = "Price must be a number.";
    } else if (priceNumber < 0) {
      nextErrors.price = "Price must be greater than or equal to 0.";
    }

    if (!form.category.trim()) {
      nextErrors.category = "Category is required.";
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
          typeof crypto !== "undefined" && "randomUUID" in crypto
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
    <main className="min-h-screen bg-neutral-50 px-4 py-10 text-neutral-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Menu Builder
            </h1>
            <p className="mt-1 text-sm text-neutral-600">
              Create, edit, and delete menu items. Items are saved in this
              browser so they can be used on the order screen.
            </p>
          </div>
          <nav className="flex gap-2 text-sm">
            <Link
              href="/"
              className="rounded-full border border-neutral-200 px-4 py-2 text-neutral-700 transition hover:bg-neutral-100"
            >
              Home
            </Link>
            <Link
              href="/order"
              className="rounded-full bg-neutral-900 px-4 py-2 font-medium text-neutral-50 transition hover:bg-neutral-800"
            >
              Order Screen
            </Link>
          </nav>
        </header>

        <section className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200"
          >
            <h2 className="text-lg font-semibold">
              {isEditing ? "Edit menu item" : "Add new menu item"}
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              Price 0 means the item is open price. The cashier will choose the
              price when ordering.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-800">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      name: e.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm shadow-sm outline-none focus:border-neutral-800 focus:ring-1 focus:ring-neutral-800"
                  placeholder="Espresso"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-800">
                  Price
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      price: e.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm shadow-sm outline-none focus:border-neutral-800 focus:ring-1 focus:ring-neutral-800"
                  placeholder="3.50"
                />
                <p className="mt-1 text-xs text-neutral-500">
                  Set to 0 for open price items (cashier chooses price when
                  ordering).
                </p>
                {errors.price && (
                  <p className="mt-1 text-xs text-red-600">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-800">
                  Category
                </label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      category: e.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm shadow-sm outline-none focus:border-neutral-800 focus:ring-1 focus:ring-neutral-800"
                  placeholder="Drinks"
                />
                {errors.category && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.category}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-neutral-50 shadow-sm transition hover:bg-neutral-800"
              >
                {isEditing ? "Save changes" : "Add item"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
                >
                  Cancel edit
                </button>
              )}
            </div>
          </form>

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">Current menu</h2>
              <p className="text-xs text-neutral-500">
                {items.length === 0
                  ? "No items yet. Add your first item on the left."
                  : `${items.length} item${items.length === 1 ? "" : "s"}`}
              </p>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-neutral-200">
              <table className="min-w-full divide-y divide-neutral-200 text-sm">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-neutral-600">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-neutral-600">
                      Category
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-neutral-600">
                      Price
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-neutral-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 bg-white">
                  {items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-6 text-center text-sm text-neutral-500"
                      >
                        No menu items yet.
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 align-middle text-sm">
                          <div className="font-medium text-neutral-900">
                            {item.name}
                          </div>
                          {item.price === 0 && (
                            <p className="mt-0.5 text-xs text-neutral-500">
                              Open price item
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3 align-middle text-sm text-neutral-700">
                          {item.category}
                        </td>
                        <td className="px-4 py-3 align-middle text-right text-sm text-neutral-800">
                          {item.price === 0
                            ? "Open"
                            : item.price.toLocaleString(undefined, {
                                style: "currency",
                                currency: "USD",
                              })}
                        </td>
                        <td className="px-4 py-3 align-middle text-right text-sm">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

