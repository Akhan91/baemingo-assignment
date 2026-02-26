'use client';

import { MenuItemsTableProps } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PencilIcon, TrashIcon } from 'lucide-react';

export function MenuItemsTable({ items, onEdit, onDelete }: MenuItemsTableProps) {
  return (
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
                    {item.price === 0 && <p className='mt-0.5 text-xs text-neutral-500'>Open price item</p>}
                  </TableCell>
                  <TableCell className='align-middle text-neutral-700'>{item.category}</TableCell>
                  <TableCell className='align-middle text-right text-neutral-800'>
                    {item.price === 0
                      ? 'Open'
                      : item.price.toLocaleString('sv-SE', {
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
                        onClick={() => onEdit(item)}
                        className='cursor-pointer'
                      >
                        <PencilIcon className='size-4' />
                        Edit
                      </Button>
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        onClick={() => onDelete(item.id)}
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
  );
}
