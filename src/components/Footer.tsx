import { Facebook, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { openConsentSettings } from "@/lib/consent";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    services: [
      { name: "PhD Research Support", href: "/services/phd-dissertation-support" },
      { name: "Literature Reviews", href: "/services/literature-review-services" },
      { name: "Data Analysis", href: "/services/spss-data-analysis" },
      { name: "Professional Research", href: "/services/professional-research-services" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Research Insights", href: "/insights" },
      { name: "Discuss Your Research", href: "/work-with-us" },
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
    <footer className="border-t border-primary-foreground/15 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4" aria-label="Research Ready Services Homepage">
              <span className="font-playfair text-2xl font-bold">ResearchReady</span>
            </Link>
            <p className="text-primary-foreground/70 mb-6 max-w-sm">
              Research support built around the problem you're actually trying to solve.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center border border-primary-foreground/20 transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground"
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
            ResearchReady is where serious research problems meet structured expertise.
          </p>
          <Button variant="link" className="h-auto p-0 text-primary-foreground/60" onClick={openConsentSettings}>Cookie settings</Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
