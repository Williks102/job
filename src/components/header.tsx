import { Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

export default function Header() {
  return (
    <header className="bg-card border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <Home className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-headline tracking-tight text-foreground">
              Domicile Emploi
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Button variant="ghost" asChild>
                <Link href="/">Nos offres</Link>
            </Button>
             <Button variant="ghost" asChild>
                <Link href="/contact">Contact</Link>
            </Button>
            <Button asChild>
                <Link href="/login">Se connecter</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
