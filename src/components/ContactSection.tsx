import { Button } from "@/components/ui/button";
import { Mail, Phone, MessageSquare, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ContactSection = () => {
  return (
    <section id="contact-form" className="py-20 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content Side */}
          <div className="space-y-8">
            <div>
              <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-semibold rounded-full text-sm mb-6">
                Get In Touch
              </span>
              <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Let's Discuss Your Project
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Ready to work with us? Apply for a project and our team will review your 
                requirements and respond within 24 hours with a tailored proposal.
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Email Us</p>
                  <a href="mailto:researchreadyservices@gmail.com" className="text-muted-foreground hover:text-accent transition-colors">
                    researchreadyservices@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Call Us</p>
                  <a href="tel:+2349022282963" className="text-muted-foreground hover:text-accent transition-colors">
                    +234 902 228 2963
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Response Time</p>
                  <p className="text-muted-foreground">We respond within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Side */}
          <div className="bg-card rounded-2xl p-8 lg:p-12 shadow-lg border border-border text-center space-y-6">
            <h3 className="font-playfair text-2xl lg:text-3xl font-bold text-foreground">
              Ready to Start?
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Submit your project application and receive a tailored proposal from our research experts. 
              Projects start from $100+.
            </p>
            <Button variant="gold" size="xl" className="group w-full sm:w-auto" asChild>
              <a href="mailto:researchreadyservices@gmail.com?subject=Project%20Application%20-%20ResearchReady&body=Full%20Name%3A%0ACountry%3A%0AProject%20Type%3A%0ABudget%20Range%3A%0ADeadline%3A%0A%0AProject%20Description%3A%0A%0APlease%20attach%20any%20relevant%20documents.">
                Apply for a Project
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <p className="text-sm text-muted-foreground">For serious clients only</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
