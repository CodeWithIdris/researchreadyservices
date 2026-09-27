import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/analytics";
import { captureAttribution } from "@/lib/attribution";
import { CONSENT_EVENT, readConsent } from "@/lib/consent";

/**
 * Tracks GA4 page_view on every SPA route change.
 * Mount once at the App level inside <BrowserRouter>.
 */
export const usePageViewTracking = () => {
  const location = useLocation();

  useEffect(() => {
    captureAttribution();
    let tracked = false;
    const send = () => {
      if (tracked || readConsent()?.choice !== "accepted") return;
      tracked = true;
      trackPageView(location.pathname + location.search, document.title);
    };
    const id = window.setTimeout(send, 50);
    window.addEventListener(CONSENT_EVENT, send);
    return () => { window.clearTimeout(id); window.removeEventListener(CONSENT_EVENT, send); };
  }, [location.pathname, location.search]);
};
