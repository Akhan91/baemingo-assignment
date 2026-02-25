import { z } from 'zod';

export const menuItemFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
  price: z
    .string()
    .refine((s) => s.trim() !== '' && !Number.isNaN(Number(s)), {
      message: 'Price must be a number.',
    })
    .refine((s) => Number(s) >= 0, {
      message: 'Price must be greater than or equal to 0.',
    }),
  category: z.string().trim().min(1, 'Category is required.'),
});

export type MenuItemFormValid = z.output<typeof menuItemFormSchema>;
