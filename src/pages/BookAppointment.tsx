import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import AppointmentBooking from "@/components/AppointmentBooking";
import TimezoneDisplay from "@/components/TimezoneDisplay";
import CurrencyDisplay from "@/components/CurrencyDisplay";
import WhatsAppButton from "@/components/WhatsAppButton";

const BookAppointment = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Book a Consultation - ResearchReady"
        description="Schedule a free consultation with our research experts. Get personalized advice for your thesis, dissertation, or research project."
      />
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-semibold rounded-full text-sm mb-6">
              Schedule a Meeting
            </span>
            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Book Your Free Consultation
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with our research experts via video call. Discuss your project, get personalized advice, 
              and learn how we can help you succeed.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Main Booking Form */}
            <div className="lg:col-span-2">
              <AppointmentBooking />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <TimezoneDisplay />
              <CurrencyDisplay />
              
              <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                <h3 className="font-semibold text-foreground mb-4">What to Expect</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    Free 30-minute initial consultation
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    One-on-one session with a research expert
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    Video call link sent via email
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    No obligation to proceed
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    Get a custom quote for your project
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default BookAppointment;