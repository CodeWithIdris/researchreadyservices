import { Facebook, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    services: [
      { name: "Dissertation & Thesis Writing", href: "/work-with-us" },
      { name: "Literature Reviews", href: "/work-with-us" },
      { name: "Data Analysis", href: "/work-with-us" },
      { name: "Business Research", href: "/work-with-us" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Work With Us", href: "/work-with-us" },
      { name: "Book Consultation", href: "/book" },
    ],
    support: [
      { name: "Support", href: "/support" },
      { name: "FAQs", href: "/faqs" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Refund Policy", href: "/refund" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "https://web.facebook.com/profile.php?id=61577783386641", label: "Facebook" },
    { icon: Twitter, href: "https://x.com/_researchready", label: "X (Twitter)" },
    { icon: Instagram, href: "https://www.instagram.com/researchready_services/", label: "Instagram" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4" aria-label="Research Ready Services Homepage">
              <span className="font-playfair text-2xl font-bold">
                Research<span className="text-accent">Ready</span>
              </span>
            </Link>
            <p className="text-primary-foreground/70 mb-6 max-w-sm">
              Premium research and consulting services for professionals and businesses worldwide since 2014.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              {links.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <nav aria-label="Company navigation">
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {links.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Support Links */}
          <nav aria-label="Support navigation">
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {links.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © {currentYear} ResearchReady Services. All rights reserved.
          </p>
          <p className="text-primary-foreground/60 text-sm">
            Premium research & consulting for serious clients.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
