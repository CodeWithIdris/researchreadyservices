export interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  first_utm_source?: string;
  first_utm_medium?: string;
  first_utm_campaign?: string;
  first_utm_content?: string;
  first_utm_term?: string;
  first_referrer?: string;
  first_landing_page?: string;
  fbclid?: string;
  gclid?: string;
  referrer?: string;
  landing_page?: string;
  captured_at?: string;
}

const STORAGE_KEY = "researchready_attribution";
const FIRST_TOUCH_KEY = "researchready_first_touch";
const PARAMS: Array<keyof Attribution> = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"];

const cleanPageUrl = (value: string) => {
  try {
    const url = new URL(value, window.location.origin);
    const safeParams = new URLSearchParams();
    PARAMS.forEach((key) => {
      const value = url.searchParams.get(key);
      if (value) safeParams.set(key, value.slice(0, 160));
    });
    return `${url.origin}${url.pathname}${safeParams.size ? `?${safeParams}` : ""}`.slice(0, 500);
  } catch {
    return `${window.location.origin}${window.location.pathname}`;
  }
};

const readStored = (key: string, storage: Storage): Attribution => {
  try {
    return JSON.parse(storage.getItem(key) || "{}") as Attribution;
  } catch {
    return {};
  }
};

export const captureAttribution = () => {
  if (typeof window === "undefined") return;
  const query = new URLSearchParams(window.location.search);
  const existing = readStored(STORAGE_KEY, sessionStorage);
  const captured: Attribution = { ...existing };
  PARAMS.forEach((key) => {
    const value = query.get(key);
    if (value) captured[key] = value.slice(0, 160);
  });
  if (!captured.referrer && document.referrer) captured.referrer = cleanPageUrl(document.referrer);
  if (!captured.landing_page) captured.landing_page = cleanPageUrl(window.location.href);
  if (!captured.captured_at) captured.captured_at = new Date().toISOString();
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(captured));

  if (!localStorage.getItem(FIRST_TOUCH_KEY)) {
    const firstTouch: Attribution = {
      first_referrer: captured.referrer,
      first_landing_page: captured.landing_page,
    };
    PARAMS.slice(0, 5).forEach((key) => {
      const value = query.get(key);
      if (value) firstTouch[`first_${key}` as keyof Attribution] = value.slice(0, 160);
    });
    localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(firstTouch));
  }
};

export const getAttribution = (): Attribution => {
  if (typeof window === "undefined") return {};
  return { ...readStored(STORAGE_KEY, sessionStorage), ...readStored(FIRST_TOUCH_KEY, localStorage) };
};