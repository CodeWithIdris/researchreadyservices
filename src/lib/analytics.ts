import { getAttribution } from "@/lib/attribution";
import { CONSENT_EVENT, readConsent } from "@/lib/consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    _fbq?: (...args: unknown[]) => void;
  }
}

export const GA_MEASUREMENT_ID = "G-HX5E527N45";
export const META_PIXEL_ID = "1205385174319256";
let initialized = false;

const loadScript = (id: string, src: string) => {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
};

const initializeVendors = () => {
  if (initialized || readConsent()?.choice !== "accepted") return;
  initialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
  loadScript("researchready-ga", `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);

  type MetaQueue = ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[][]; loaded?: boolean; version?: string };
  const fbq: MetaQueue = (...args: unknown[]) => {
    if (fbq.callMethod) fbq.callMethod(...args);
    else (fbq.queue ||= []).push(args);
  };
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  window.fbq = fbq;
  window._fbq = fbq;
  window.fbq?.("init", META_PIXEL_ID);
  loadScript("researchready-meta", "https://connect.facebook.net/en_US/fbevents.js");
};

const handleConsentChange = () => {
  if (readConsent()?.choice === "accepted") initializeVendors();
};

if (typeof window !== "undefined") {
  initializeVendors();
  window.addEventListener(CONSENT_EVENT, handleConsentChange);
}

const allowed = () => readConsent()?.choice === "accepted";
const baseParams = () => ({ ...getAttribution() });

export const trackEvent = (eventName: string, params: Record<string, unknown> = {}) => {
  if (!allowed()) return;
  initializeVendors();
  window.gtag?.("event", eventName, { ...baseParams(), ...params });
};

export const trackPageView = (path: string, title?: string) => {
  if (!allowed()) return;
  initializeVendors();
  const params = { page_path: path, page_title: title || document.title, page_location: window.location.href, ...baseParams() };
  window.gtag?.("event", "page_view", params);
  window.fbq?.("track", "PageView");
};

export const trackCTAClick = (ctaId: string, label: string, location: string, extra: Record<string, unknown> = {}) =>
  trackEvent("CTA_Click", { cta_id: ctaId, cta_label: label, cta_location: location, ...extra });

export const trackServiceView = (serviceName: string, source: string) => {
  trackEvent("ServiceView", { service_name: serviceName, source });
  if (allowed()) window.fbq?.("track", "ViewContent", { content_name: serviceName, content_category: "research_service" });
};

export const trackWhatsAppClick = (source: string) => trackEvent("WhatsApp_Click", { source });
export const trackConsultationStarted = (source: string) => trackEvent("ConsultationStarted", { source });
export const trackResearchLevelSelected = (level: string) => trackEvent("ResearchLevelSelected", { research_level: level });
export const trackFileUploaded = (type: string, size: number) => trackEvent("FileUploaded", { file_type: type, file_size: size });

export const trackConversion = (conversionType: string, params: Record<string, unknown> = {}) => {
  trackEvent("generate_lead", { conversion_type: conversionType, currency: "USD", ...params });
  if (allowed()) window.fbq?.("track", "Lead", { content_name: conversionType, ...params });
};

export const isGAReady = () => allowed() && typeof window.gtag === "function";