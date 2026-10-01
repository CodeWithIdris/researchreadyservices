import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import AppointmentBooking from "@/components/AppointmentBooking";
import TimezoneDisplay from "@/components/TimezoneDisplay";
import { SITE_URL } from "@/lib/siteConfig";

const BookAppointment = () => <div className="min-h-screen bg-background"><SEOHead title="Book a Research Consultation" description="Schedule a consultation to discuss your research question, methodology, literature review, analysis or professional project." url={`${SITE_URL}/book`} /><Header /><main className="pt-24 pb-16"><div className="container"><div className="mb-12 max-w-3xl"><p className="eyebrow">Research consultation</p><h1 className="font-playfair text-4xl leading-tight text-primary sm:text-5xl">Make space for a more focused research conversation.</h1><p className="mt-5 text-lg leading-8 text-muted-foreground">Share the problem you are working through and select a time to discuss what kind of support could be appropriate.</p></div><div className="grid gap-8 lg:grid-cols-[1.5fr_.5fr]"><AppointmentBooking /><div className="space-y-5"><TimezoneDisplay /><div className="border-l-2 border-accent pl-5 text-sm leading-7 text-muted-foreground">Research projects are scoped around the question, methods, materials, stage and timeline. Fees are discussed against that scope before work begins. A booking is a conversation, not a guarantee of availability or outcome.</div></div></div></div></main><Footer /></div>;
export default BookAppointment;