import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Phone, MessageCircle, Clock } from "lucide-react";

const Support = () => {
  const phoneNumber = "2349022282963";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Support Center
            </h1>
            <p className="text-lg text-muted-foreground">
              We're here to help you every step of the way.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* WhatsApp Support */}
            <a
              href={`https://wa.me/${phoneNumber}?text=Hello%2C%20I%20need%20support%20with%20ResearchReady%20services.`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card border border-border rounded-xl p-6 hover:border-accent/30 hover:shadow-lg transition-all group"
            >
              <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                <MessageCircle className="w-7 h-7 text-green-500" />
              </div>
              <h3 className="font-playfair text-xl font-bold text-foreground mb-2">
                WhatsApp Support
              </h3>
              <p className="text-muted-foreground mb-4">
                Get instant support via WhatsApp. Our team typically responds within minutes.
              </p>
              <span className="text-accent font-semibold">Chat Now →</span>
            </a>

            {/* Email Support */}
            <a
              href="mailto:researchreadyservices@gmail.com?subject=Support%20Request"
              className="bg-card border border-border rounded-xl p-6 hover:border-accent/30 hover:shadow-lg transition-all group"
            >
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <Mail className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-playfair text-xl font-bold text-foreground mb-2">
                Email Support
              </h3>
              <p className="text-muted-foreground mb-4">
                Send us a detailed email and we'll get back to you within 24 hours.
              </p>
              <span className="text-accent font-semibold">Send Email →</span>
            </a>

            {/* Phone Support */}
            <a
              href="tel:+2349022282963"
              className="bg-card border border-border rounded-xl p-6 hover:border-accent/30 hover:shadow-lg transition-all group"
            >
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                <Phone className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="font-playfair text-xl font-bold text-foreground mb-2">
                Phone Support
              </h3>
              <p className="text-muted-foreground mb-4">
                Call us directly for urgent inquiries or complex discussions.
              </p>
              <span className="text-accent font-semibold">+234 902 228 2963</span>
            </a>

            {/* Response Time */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-7 h-7 text-purple-500" />
              </div>
              <h3 className="font-playfair text-xl font-bold text-foreground mb-2">
                Response Times
              </h3>
              <ul className="text-muted-foreground space-y-2">
                <li>• WhatsApp: Within 30 minutes</li>
                <li>• Email: Within 24 hours</li>
                <li>• Phone: Immediate (during business hours)</li>
              </ul>
            </div>
          </div>

          <div className="bg-secondary/30 rounded-xl p-8 text-center">
            <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
              Need Help with Your Order?
            </h2>
            <p className="text-muted-foreground mb-6">
              If you have questions about an existing order, revisions, or delivery, our support team is ready to assist you.
            </p>
            <a
              href={`https://wa.me/${phoneNumber}?text=Hello%2C%20I%20need%20help%20with%20my%20order.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Support;
