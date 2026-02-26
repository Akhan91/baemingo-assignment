import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
      <main className='flex min-h-screen w-full max-w-3xl flex-col items-center gap-6 py-32 px-16 bg-white dark:bg-black sm:items-start'>
        <h1 className='text-4xl font-bold'>Baemingo assignment</h1>
        <p className='text-lg'>This is a simple example for the assignment</p>
        <span className='text-md text-gray-600'>
          Click on the buttons below to navigate to the order screen or the menu builder
        </span>
        <div className='flex flex-row gap-4 space-between'>
          <Button asChild variant='outline'>
            <Link href='/order'>Order Screen</Link>
          </Button>

          <Button asChild variant='default'>
            <Link href='/menu-builder'>Menu Builder</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
