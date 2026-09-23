export interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  gclid?: string;
  referrer?: string;
  landing_page?: string;
  captured_at?: string;
}

const STORAGE_KEY = "researchready_attribution";
const PARAMS: Array<keyof Attribution> = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"];

export const captureAttribution = () => {
  if (typeof window === "undefined") return;
  const query = new URLSearchParams(window.location.search);
  const existing = getAttribution();
  const captured: Attribution = { ...existing };
  PARAMS.forEach((key) => {
    const value = query.get(key);
    if (value) captured[key] = value.slice(0, 160);
  });
  if (!captured.referrer && document.referrer) captured.referrer = document.referrer.slice(0, 500);
  if (!captured.landing_page) captured.landing_page = window.location.href.slice(0, 500);
  if (!captured.captured_at) captured.captured_at = new Date().toISOString();
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(captured));
  if (!localStorage.getItem(STORAGE_KEY)) localStorage.setItem(STORAGE_KEY, JSON.stringify(captured));
};

export const getAttribution = (): Attribution => {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};