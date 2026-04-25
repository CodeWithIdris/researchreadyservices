import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/analytics";

/**
 * Tracks GA4 page_view on every SPA route change.
 * Mount once at the App level inside <BrowserRouter>.
 */
export const usePageViewTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Defer slightly so document.title reflects new route
    const id = window.setTimeout(() => {
      trackPageView(location.pathname + location.search, document.title);
    }, 50);
    return () => window.clearTimeout(id);
  }, [location.pathname, location.search]);
};
