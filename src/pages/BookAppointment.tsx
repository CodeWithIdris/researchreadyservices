import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import AppointmentBooking from "@/components/AppointmentBooking";
import TimezoneDisplay from "@/components/TimezoneDisplay";
import CurrencyDisplay from "@/components/CurrencyDisplay";
import { Clock, Shield } from "lucide-react";

const BookAppointment = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Book a Strategy Consultation - ResearchReady"
        description="Schedule a strategy consultation with our research experts. Get personalized advice for your research, business, or consulting project."
      />
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-semibold rounded-full text-sm mb-6">
              Schedule a Meeting
            </span>
            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Book a Paid Strategy Consultation
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
              This session is for serious clients seeking high-quality research support. 
              Connect with our experts to discuss your project and receive a tailored strategy.
            </p>
            
            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full">
                <Shield className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-foreground">Minimum project budget: $100</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Limited consultation slots available weekly</span>
              </div>
            </div>
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
                    One-on-one session with a senior research expert
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    Detailed project assessment and strategy
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    Video call link sent via email confirmation
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    Custom quote and timeline for your project
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    Confidential and professional discussion
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookAppointment;
