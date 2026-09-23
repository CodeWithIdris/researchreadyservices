export type ConsentChoice = "accepted" | "declined";

export interface ConsentRecord {
  choice: ConsentChoice;
  version: string;
  decidedAt: string;
  notice: string;
}

export const CONSENT_KEY = "researchready_ad_consent";
export const CONSENT_VERSION = "2026-09-20";
export const CONSENT_EVENT = "researchready-consent-change";
export const OPEN_CONSENT_EVENT = "researchready-open-consent";

export const readConsent = (): ConsentRecord | null => {
  if (typeof window === "undefined") return null;
  try {
    const record = JSON.parse(localStorage.getItem(CONSENT_KEY) || "null") as ConsentRecord | null;
    return record?.version === CONSENT_VERSION ? record : null;
  } catch {
    return null;
  }
};

export const writeConsent = (choice: ConsentChoice) => {
  const record: ConsentRecord = {
    choice,
    version: CONSENT_VERSION,
    decidedAt: new Date().toISOString(),
    notice: "Google Analytics and Meta advertising measurement; accept or reject; change later in Cookie settings.",
  };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: record }));
  return record;
};

export const openConsentSettings = () => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));