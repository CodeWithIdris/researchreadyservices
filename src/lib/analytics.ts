// Google Analytics 4 helper utilities
// Measurement ID: G-HX5E527N45 (configured in index.html)

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const GA_MEASUREMENT_ID = "G-HX5E527N45";

/**
 * Check if GA4 is loaded and ready to receive events.
 */
export const isGAReady = (): boolean => {
  return typeof window !== "undefined" && typeof window.gtag === "function";
};

/**
 * Send a generic GA4 event.
 */
export const trackEvent = (
  eventName: string,
  params: Record<string, any> = {}
): void => {
  if (!isGAReady()) {
    console.warn(`[GA4] Not ready — skipping event: ${eventName}`, params);
    return;
  }
  window.gtag!("event", eventName, params);
  if (import.meta.env.DEV) {
    console.log(`[GA4] event: ${eventName}`, params);
  }
};

/**
 * Track a manual page_view (useful for SPA route changes).
 */
export const trackPageView = (path: string, title?: string): void => {
  trackEvent("page_view", {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  });
};

/**
 * Track a CTA click. Use a stable cta_id for funnel analysis.
 */
export const trackCTAClick = (
  ctaId: string,
  label: string,
  location: string,
  extra: Record<string, any> = {}
): void => {
  trackEvent("cta_click", {
    cta_id: ctaId,
    cta_label: label,
    cta_location: location,
    ...extra,
  });
};

/**
 * Track a conversion (lead, booking, signup, etc.).
 * In GA4, mark these event names as "Key Events" in the Admin UI.
 */
export const trackConversion = (
  conversionType:
    | "lead_apply_email"
    | "lead_form_submit"
    | "appointment_booked"
    | "newsletter_subscribe"
    | "whatsapp_contact"
    | "phone_contact"
    | "email_contact",
  params: Record<string, any> = {}
): void => {
  trackEvent("generate_lead", {
    conversion_type: conversionType,
    currency: "USD",
    value: params.value ?? 1,
    ...params,
  });
  // Also send a dedicated event so GA4 can mark it as Key Event by name
  trackEvent(conversionType, params);
};
