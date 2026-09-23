export const SITE_URL = "https://researchreadyservices.lovable.app";
export const CONTACT_EMAIL = "researchreadyservices@gmail.com";
export const WHATSAPP_NUMBER = "2349022282963";

export const consultationUrl = (service?: string, angle?: string) => {
  const params = new URLSearchParams();
  if (service) params.set("service", service);
  if (angle) params.set("angle", angle);
  const query = params.toString();
  return `/work-with-us${query ? `?${query}` : ""}#enquiry`;
};

export const whatsappUrl = (context = "research") => {
  const message = encodeURIComponent(`Hello ResearchReady, I'd like to discuss my ${context}.`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
};