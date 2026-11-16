import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, User, LogOut, Package, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navItems = [
  { name: 'Catalog', href: '#products' },
  { name: 'Collection', href: '/collection' },
  { name: 'Branding', href: '#branding' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Manufacturers', href: '/manufacturers' },
  { name: 'FAQ', href: '#faq' },
];

const Header = () => {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const go = (e: React.MouseEvent, href: string) => {
    setOpen(false);
    if (href.startsWith('/')) return;
    e.preventDefault();
    if (location.pathname !== '/') navigate('/', { state: { scrollTo: href } });
    else document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const NavLink = ({ item, className }: { item: typeof navItems[number]; className: string }) =>
    item.href.startsWith('/') ? (
      <Link to={item.href} onClick={() => setOpen(false)} className={className}>{item.name}</Link>
    ) : (
      <a href={item.href} onClick={(e) => go(e, item.href)} className={className}>{item.name}</a>
    );

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-primary text-primary-foreground text-center text-xs tracking-wide py-2 px-4">
        No minimums · Premium heavyweight blanks · Delivered to your door
      </div>
      <div className="bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="font-display text-2xl font-black tracking-tight text-foreground">roge</Link>
          <nav className="hidden lg:flex gap-7">
            {navItems.map((i) => (
              <NavLink key={i.name} item={i} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" />
            ))}
          </nav>
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Account"><User className="h-5 w-5" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild><Link to="/profile"><User className="mr-2 h-4 w-4" />Profile</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/manufacturer/orders"><Package className="mr-2 h-4 w-4" />Manufacturer Portal</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={async () => { await signOut(); navigate('/'); }}><LogOut className="mr-2 h-4 w-4" />Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" asChild><Link to="/auth">Sign in</Link></Button>
            )}
            <Button asChild className="rounded-full px-6"><Link to="/designer">Start designing</Link></Button>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        {open && (
          <nav className="lg:hidden border-t border-border px-4 py-3 space-y-1 bg-background">
            {navItems.map((i) => (
              <NavLink key={i.name} item={i} className="block py-2 text-base font-medium text-foreground" />
            ))}
            <Link to={user ? '/profile' : '/auth'} onClick={() => setOpen(false)} className="block py-2 text-base font-medium">
              {user ? 'Profile' : 'Sign in'}
            </Link>
            <Button asChild className="w-full rounded-full mt-2"><Link to="/designer">Start designing</Link></Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
