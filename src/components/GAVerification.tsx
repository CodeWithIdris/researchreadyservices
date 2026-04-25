import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Activity, X } from "lucide-react";
import { isGAReady, GA_MEASUREMENT_ID, trackEvent } from "@/lib/analytics";

/**
 * Dev-only floating widget to verify GA4 is loaded and events fire.
 * Visible only in development OR when ?ga_debug=1 is in the URL.
 */
const GAVerification = () => {
  const [ready, setReady] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const debug = params.get("ga_debug") === "1";
    setShow(import.meta.env.DEV || debug);
  }, []);

  useEffect(() => {
    if (!show) return;
    let attempts = 0;
    const interval = window.setInterval(() => {
      attempts++;
      if (isGAReady()) {
        setReady(true);
        window.clearInterval(interval);
      } else if (attempts > 20) {
        window.clearInterval(interval);
      }
    }, 250);
    return () => window.clearInterval(interval);
  }, [show]);

  useEffect(() => {
    if (!show) return;
    // Wrap gtag to log fired events locally
    const originalGtag = window.gtag;
    if (!originalGtag) return;
    window.gtag = function (...args: any[]) {
      if (args[0] === "event") {
        setEvents((prev) => [`${args[1]}`, ...prev].slice(0, 8));
      }
      return originalGtag.apply(window, args as any);
    };
    return () => {
      window.gtag = originalGtag;
    };
  }, [show, ready]);

  if (!show || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[60] bg-card border border-border rounded-lg shadow-xl p-3 text-xs max-w-xs">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <Activity className="w-4 h-4 text-accent" />
          GA4 Debug
        </div>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Close GA debug"
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-2">
        {ready ? (
          <CheckCircle2 className="w-4 h-4 text-green-500" />
        ) : (
          <XCircle className="w-4 h-4 text-destructive" />
        )}
        <span className="text-foreground">
          {ready ? "gtag loaded" : "gtag not detected"}
        </span>
      </div>
      <div className="text-muted-foreground mb-2 truncate">
        ID: {GA_MEASUREMENT_ID}
      </div>

      <button
        onClick={() =>
          trackEvent("debug_test_click", { source: "ga_verification_widget" })
        }
        className="w-full bg-primary text-primary-foreground rounded px-2 py-1 mb-2 hover:bg-primary/90"
      >
        Send test event
      </button>

      <div className="text-foreground font-medium mb-1">Recent events:</div>
      {events.length === 0 ? (
        <div className="text-muted-foreground italic">none yet</div>
      ) : (
        <ul className="space-y-0.5 max-h-32 overflow-auto">
          {events.map((e, i) => (
            <li key={i} className="text-muted-foreground">
              • {e}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-2 pt-2 border-t border-border text-muted-foreground">
        Verify in GA4 → Admin → DebugView (add{" "}
        <code className="text-foreground">?ga_debug=1</code> in prod)
      </div>
    </div>
  );
};

export default GAVerification;
