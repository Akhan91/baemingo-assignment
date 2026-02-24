import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function MenuBuilderHeader() {
  return (
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
  );
}
