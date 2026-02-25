import Link from 'next/link';
import { Button } from './ui/button';

export function Navbar() {
  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80'>
      <div className='mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6'>
        <Link
          href='/'
          className='font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80'
        >
          Baemingo assignment
        </Link>
        <nav className='flex items-center gap-3 text-sm font-medium' aria-label='Main'>
          <Button variant='default' size='default' asChild>
            <Link href='/menu-builder'>Menu Builder</Link>
          </Button>

          <Button variant='outline' size='default' asChild>
            <Link href='/order'>Order Screen</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
