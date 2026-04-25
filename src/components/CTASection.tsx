import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Phone, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const relatedLinks = [
  { label: "About Us", href: "/about" },
  { label: "FAQs", href: "/faqs" },
  { label: "Book Consultation", href: "/book" },
  { label: "Our Services", href: "/#services" },
];

const CTASection = () => {
  return (
    <section id="contact" className="py-20 lg:py-32 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-6 mb-10">
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Ready to Elevate Your Research?
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              Take the first step towards exceptional results. Our experts are ready to help you 
              achieve your research and business goals. Projects start from $100+.
            </p>
            <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full">
              <Clock className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-foreground">Limited project slots available — for serious clients only</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button variant="gold" size="xl" className="group" asChild>
              <a href="mailto:researchreadyservices@gmail.com?subject=Project%20Application%20-%20ResearchReady&body=Full%20Name%3A%0ACountry%3A%0AProject%20Type%3A%0ABudget%20Range%3A%0ADeadline%3A%0A%0AProject%20Description%3A%0A%0APlease%20attach%20any%20relevant%20documents.">
                Apply for a Project
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/book">
                Book a Consultation
              </Link>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-8 pt-8 border-t border-border">
            <a
              href="mailto:researchreadyservices@gmail.com"
              className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="h-5 w-5" />
              <span>researchreadyservices@gmail.com</span>
            </a>
            <a
              href="tel:+2349022282963"
              className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="h-5 w-5" />
              <span>+234 902 228 2963</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
