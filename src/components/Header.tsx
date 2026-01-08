import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Gamepad2, CalendarDays, LayoutDashboard, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Services", href: "/#services" },
    { name: "Book Consultation", href: "/book", icon: CalendarDays },
    { name: "Word Game", href: "/game", highlight: true, icon: Gamepad2 },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-playfair text-xl lg:text-2xl font-bold text-primary">
              Research<span className="text-accent">Ready</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              link.href.startsWith("/") && !link.href.includes("#") ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`transition-colors duration-200 font-medium flex items-center gap-1 ${
                    link.highlight 
                      ? "text-accent hover:text-accent/80" 
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
                >
                  {link.name}
                </a>
              )
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <Button variant="outline" asChild>
                <Link to="/dashboard">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  My Dashboard
                </Link>
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link to="/auth">
                  <LogIn className="w-4 h-4 mr-2" />
                  Client Login
                </Link>
              </Button>
            )}
            <Button variant="gold" asChild>
              <a href="https://wa.me/2349022282963?text=Hello%2C%20I%27m%20interested%20in%20your%20research%20services" target="_blank" rel="noopener noreferrer">
                Get Started
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-primary" />
            ) : (
              <Menu className="h-6 w-6 text-primary" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                link.href.startsWith("/") && !link.href.includes("#") ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`transition-colors duration-200 font-medium py-2 flex items-center gap-2 ${
                      link.highlight 
                        ? "text-accent hover:text-accent/80" 
                        : "text-muted-foreground hover:text-primary"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.icon && <link.icon className="w-4 h-4" />}
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                )
              ))}
              {user ? (
                <Button variant="outline" className="mt-2" asChild>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    My Dashboard
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" className="mt-2" asChild>
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <LogIn className="w-4 h-4 mr-2" />
                    Client Login
                  </Link>
                </Button>
              )}
              <Button variant="gold" size="lg" className="mt-2" asChild>
                <a href="https://wa.me/2349022282963?text=Hello%2C%20I%27m%20interested%20in%20your%20research%20services" target="_blank" rel="noopener noreferrer">
                  Get Started
                </a>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
