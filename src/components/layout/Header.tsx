
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Collection', href: '/collection' }, // Added Collection link
    { name: 'Products', href: '#products' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'About Us', href: '#about-us' },
    { name: 'FAQ', href: '#faq' },
    // { name: 'Contact', href: '#contact' }, // Contact can be in footer or a dedicated page
  ];

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="text-3xl font-bold text-primary">
              roge
            </Link>
          </div>
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href} // Use href directly
                onClick={(e) => {
                  if (item.href.startsWith('/')) {
                    // Let Link (if used inside) or default anchor behavior handle it.
                    // For direct <a> tags, no need to preventDefault if it's a page navigation.
                  } else if (item.href.startsWith('#') && window.location.pathname === '/') {
                    e.preventDefault();
                    const element = document.querySelector(item.href);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  } else if (item.href.startsWith('#') && window.location.pathname !== '/') {
                    // If on a different page and it's a hash link, navigate to home then scroll
                    // This might be better handled by Link component for hashes on different pages
                    // For now, let it be a direct link to home + hash
                  }
                }}
                className="text-foreground hover:text-primary transition-colors duration-200"
              >
                {item.href.startsWith('/') ? <Link to={item.href}>{item.name}</Link> : item.name}
              </a>
            ))}
          </nav>
          <div className="hidden md:flex items-center space-x-2">
            <Button asChild>
              <Link to="/designer">Get a Quote</Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/profile" aria-label="Profile">
                <User className="h-6 w-6" />
              </Link>
            </Button>
          </div>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href} // Use href directly
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  if (item.href.startsWith('/')) {
                    // Let Link (if used inside) or default anchor behavior handle it.
                  } else if (item.href.startsWith('#') && window.location.pathname === '/') {
                    e.preventDefault();
                    const element = document.querySelector(item.href);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  } else if (item.href.startsWith('#') && window.location.pathname !== '/'){
                     // If on a different page, Link component below will handle it correctly
                  }
                }}
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted hover:text-primary"
              >
                 {item.href.startsWith('/') ? (
                    <Link to={item.href}>{item.name}</Link>
                 ) : (
                    // For hash links on mobile when not on homepage, link to homepage + hash
                    window.location.pathname === '/' ? item.name : <Link to={`/${item.href}`}>{item.name}</Link>
                 )}
              </a>
            ))}
             <Link
              to="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted hover:text-primary"
            >
              Profile
            </Link>
          </nav>
          <div className="pt-2 pb-3 px-4">
             <Button className="w-full" asChild>
               <Link to="/designer">Get a Quote</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
