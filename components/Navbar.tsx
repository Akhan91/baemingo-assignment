import Link from 'next/link';

export function Navbar() {
  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80'>
      <div className='mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6'>
        <Link
          href='/'
          className='font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80'
        >
          Baemingo
        </Link>
        <nav className='flex items-center gap-1 text-sm font-medium' aria-label='Main'>
          <Link
            href='/'
            className='rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground'
          >
            Home
          </Link>
          <Link
            href='/order'
            className='rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground'
          >
            Order
          </Link>
          <Link
            href='/menu-builder'
            className='rounded-md bg-primary px-3 py-2 text-primary-foreground transition-colors hover:bg-primary/90'
          >
            Menu Builder
          </Link>
        </nav>
      </div>
    </header>
  );
}
