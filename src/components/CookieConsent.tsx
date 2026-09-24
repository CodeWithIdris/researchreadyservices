import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";
import { OPEN_CONSENT_EVENT, readConsent, writeConsent } from "@/lib/consent";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const open = () => setIsVisible(true);
    window.addEventListener(OPEN_CONSENT_EVENT, open);
    if (!readConsent()) setIsVisible(true);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, open);
  }, []);

  const acceptCookies = () => {
    writeConsent("accepted");
    setIsVisible(false);
  };

  const declineCookies = () => {
    writeConsent("declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-in" role="dialog" aria-label="Cookie choices">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-background border border-border rounded-md shadow-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-11 h-11 bg-accent/10 rounded-md flex items-center justify-center">
              <Cookie className="w-6 h-6 text-accent" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">We value your privacy</h3>
            <p className="text-sm text-muted-foreground">
              Google Analytics and Meta help us measure visits and advertising. You can accept or reject them, then change this choice later. 
              Read our{" "}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>{" "}
              for more information.
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={declineCookies}
              className="flex-1 sm:flex-none"
            >
              Decline
            </Button>
            <Button
              variant="gold"
              size="sm"
              onClick={acceptCookies}
              className="flex-1 sm:flex-none"
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
