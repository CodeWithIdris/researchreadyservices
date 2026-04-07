import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const highlights = [
    "Publication-Grade Research",
    "100% Original Work",
    "Confidential Delivery",
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-20 lg:pt-0 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-background to-background" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-semibold rounded-full text-sm">
                Trusted by International Clients Worldwide
              </span>
              <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                <span className="text-accent">Premium</span> Research &{" "}
                Consulting Services for{" "}
                <span className="relative inline-block">
                  Professionals
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-accent rounded-full" />
                </span>{" "}
                & Businesses
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground max-w-xl leading-relaxed">
                We deliver publication-grade research, strategic reports, and expert analysis 
                for professionals, organizations, and businesses worldwide. Projects start from $100+.
              </p>
            </div>

            {/* Highlights */}
            <div className="flex flex-wrap gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <Button variant="gold" size="xl" className="group" asChild>
                <a href="mailto:researchreadyservices@gmail.com?subject=Project%20Application%20-%20ResearchReady&body=Full%20Name%3A%0ACountry%3A%0AProject%20Type%3A%0ABudget%20Range%3A%0ADeadline%3A%0A%0AProject%20Description%3A%0A%0APlease%20attach%20any%20relevant%20documents.">
                  Apply for a Project
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button variant="outline" size="xl" className="group" asChild>
                <Link to="/book">
                  <Clock className="h-5 w-5 mr-2" />
                  Book a Consultation
                </Link>
              </Button>
            </div>

            {/* Scarcity */}
            <div className="opacity-0 animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full">
                <Clock className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-foreground">Limited project slots available</span>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 border-t border-border opacity-0 animate-fade-in" style={{ animationDelay: "0.7s" }}>
              <div className="flex flex-wrap items-center gap-8">
                <div>
                  <p className="text-3xl font-bold font-playfair text-primary">98%</p>
                  <p className="text-sm text-muted-foreground">Client Satisfaction</p>
                </div>
                <div className="h-12 w-px bg-border" />
                <div>
                  <p className="text-3xl font-bold font-playfair text-primary">15K+</p>
                  <p className="text-sm text-muted-foreground">Projects Delivered</p>
                </div>
                <div className="h-12 w-px bg-border hidden sm:block" />
                <div className="hidden sm:block">
                  <p className="text-3xl font-bold font-playfair text-primary">30+</p>
                  <p className="text-sm text-muted-foreground">Countries Served</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative opacity-0 animate-fade-in-right" style={{ animationDelay: "0.4s" }}>
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent/20 rounded-lg rotate-12" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-lg -rotate-6" />
              
              <div className="relative bg-card rounded-2xl shadow-2xl overflow-hidden border border-border">
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 to-accent/10 p-8 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="font-playfair text-2xl font-bold text-foreground">Research Excellence</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto">
                      Professional research and consulting that meets the highest international standards
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
