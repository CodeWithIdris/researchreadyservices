import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import WhyUsSection from "@/components/WhyUsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import LiveChatWidget from "@/components/LiveChatWidget";
import ScrollToTop from "@/components/ScrollToTop";
import CookieConsent from "@/components/CookieConsent";
import SEOHead from "@/components/SEOHead";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead />
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <WhyUsSection />
        <TestimonialsSection />
        <ContactSection />
        <CTASection />
      </main>
      <Footer />
      <ScrollToTop />
      <LiveChatWidget />
      <WhatsAppButton />
      <CookieConsent />
    </div>
  );
};

export default Index;
