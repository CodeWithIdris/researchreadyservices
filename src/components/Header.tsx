import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LayoutDashboard, LogIn, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { trackCTAClick } from "@/lib/analytics";
import { consultationUrl } from "@/lib/siteConfig";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  const navLinks = [
    { name: "Services", href: "/services" },
    { name: "Research Insights", href: "/insights" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
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
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium flex items-center gap-1"
                >
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
                  Client Portal
                </Link>
              </Button>
            )}
            <Button variant="gold" asChild>
              <a
                href={consultationUrl()}
                onClick={() => {
                  trackCTAClick("discuss_research", "Discuss Your Research", "header_desktop");
                }}
              >
                Discuss Your Research
                <ArrowRight className="w-4 h-4 ml-1" />
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
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium py-2 flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
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
                    Client Portal
                  </Link>
                </Button>
              )}
              <Button variant="gold" size="lg" className="mt-2" asChild>
                <a
                  href={consultationUrl()}
                  onClick={() => {
                    trackCTAClick("discuss_research", "Discuss Your Research", "header_mobile");
                    setIsMenuOpen(false);
                  }}
                >
                  Discuss Your Research
                  <ArrowRight className="w-4 h-4 ml-1" />
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
