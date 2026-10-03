import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackWhatsAppClick } from "@/lib/analytics";
import { whatsappUrl } from "@/lib/siteConfig";

const WhatsAppButton = () => {
  return (
    <a
      href={whatsappUrl("research project")}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        trackWhatsAppClick("floating_button");
      }}
      className="group fixed bottom-20 right-4 z-40 sm:bottom-6 sm:right-6"
      aria-label="Chat on WhatsApp"
    >
      <Button
        size="lg"
        className="h-12 w-12 rounded-sm border border-accent bg-accent text-accent-foreground shadow-lg transition-transform duration-300 group-hover:-translate-y-1 hover:bg-primary hover:text-primary-foreground"
      >
        <MessageCircle className="h-7 w-7" />
      </Button>
      <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-card text-foreground px-3 py-2 rounded-lg shadow-md text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-border">
        Discuss on WhatsApp
      </span>
    </a>
  );
};

export default WhatsAppButton;
