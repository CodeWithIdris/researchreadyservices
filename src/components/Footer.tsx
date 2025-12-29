import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const phoneNumber = "2349022282963";

  const getServiceWhatsAppLink = (serviceName: string) => {
    const message = encodeURIComponent(`Hello, I need support with ${serviceName}. Please provide more information.`);
    return `https://wa.me/${phoneNumber}?text=${message}`;
  };

  const links = {
    services: [
      { name: "Dissertation Writing", href: getServiceWhatsAppLink("Dissertation Writing"), external: true },
      { name: "Literature Reviews", href: getServiceWhatsAppLink("Literature Reviews"), external: true },
      { name: "Thesis Editing", href: getServiceWhatsAppLink("Thesis Editing"), external: true },
      { name: "Research Analysis", href: getServiceWhatsAppLink("Research Analysis"), external: true },
    ],
    company: [
      { name: "About Us", href: "#", external: false },
      { name: "Our Writers", href: "#", external: false },
      { name: "Pricing", href: "#", external: false },
      { name: "Contact", href: "#contact", external: false },
    ],
    support: [
      { name: "Support", href: "/support", external: false },
      { name: "FAQs", href: "/faqs", external: false },
      { name: "Terms of Service", href: "/terms", external: false },
      { name: "Privacy Policy", href: "/privacy", external: false },
      { name: "Refund Policy", href: "/refund", external: false },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="inline-block mb-4">
              <span className="font-playfair text-2xl font-bold">
                Research<span className="text-accent">Ready</span>
              </span>
            </a>
            <p className="text-primary-foreground/70 mb-6 max-w-sm">
              Empowering researchers worldwide with professional academic writing 
              and research support services since 2014.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
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
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {links.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {links.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © {currentYear} ResearchReady Services. All rights reserved.
          </p>
          <p className="text-primary-foreground/60 text-sm">
            Designed with excellence in mind.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
