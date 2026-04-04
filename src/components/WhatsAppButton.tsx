import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WhatsAppButton = () => {
  const phoneNumber = "2349022282963";
  const message = encodeURIComponent("Hello! I'd like to inquire about your research and consulting services.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 z-40 group"
      aria-label="Chat on WhatsApp"
    >
      <Button
        size="lg"
        className="rounded-full w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </Button>
      <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-card text-foreground px-3 py-2 rounded-lg shadow-md text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-border">
        Support via WhatsApp
      </span>
    </a>
  );
};

export default WhatsAppButton;
