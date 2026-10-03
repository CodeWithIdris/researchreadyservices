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

  if (!isVisible) return <Button variant="outline" size="icon" className="fixed bottom-4 left-4 z-40" aria-label="Cookie settings" title="Cookie settings" onClick={() => setIsVisible(true)}><Cookie className="h-4 w-4" /></Button>;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-3 animate-fade-in sm:p-5" role="dialog" aria-label="Cookie choices">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col items-start gap-4 border border-border bg-card p-4 shadow-xl sm:flex-row sm:items-center sm:p-5">
          <div className="flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center border border-accent/40 bg-accent/10">
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
