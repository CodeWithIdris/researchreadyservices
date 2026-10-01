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
      className="fixed bottom-24 right-6 z-40 group"
      aria-label="Chat on WhatsApp"
    >
      <Button
        size="lg"
        className="h-14 w-14 rounded-full bg-accent text-accent-foreground shadow-lg transition-transform duration-300 group-hover:scale-105 hover:bg-accent/90"
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
