import { capitalizeFirstLetter } from '@/lib/functions';
import { z } from 'zod';

export const menuItemFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.').transform(capitalizeFirstLetter),
  price: z
    .string()
    .refine((s) => s.trim() !== '' && !Number.isNaN(Number(s)), {
      message: 'Price must be a number.',
    })
    .refine((s) => Number(s) >= 0, {
      message: 'Price must be greater than or equal to 0.',
    }),
  category: z.string().trim().min(1, 'Category is required.').transform(capitalizeFirstLetter),
});

export type MenuItemFormValid = z.output<typeof menuItemFormSchema>;
