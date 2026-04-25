import { Shield, Clock, Users, Award, Globe, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Shield,
    title: "100% Original Work",
    description: "Every project is crafted from scratch with rigorous plagiarism checks.",
  },
  {
    icon: Clock,
    title: "On-Time Delivery",
    description: "We respect your deadlines and deliver quality work when you need it.",
  },
  {
    icon: Users,
    title: "Expert Researchers",
    description: "PhD-qualified researchers with expertise across disciplines and industries.",
  },
  {
    icon: Award,
    title: "Publication-Grade Quality",
    description: "Multi-level quality control ensures the highest professional standards.",
  },
  {
    icon: Globe,
    title: "International Reach",
    description: "Serving professionals in 30+ countries with confidential, premium service.",
  },
  {
    icon: RefreshCw,
    title: "Revisions Included",
    description: "Revisions until you're completely satisfied with the final deliverable.",
  },
];

const WhyUsSection = () => {
  return (
    <section id="why-us" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8">
            <div>
              <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-semibold rounded-full text-sm mb-6">
                Why Choose Us
              </span>
              <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Trusted by Professionals Worldwide
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We combine deep research expertise with professional service to deliver results that 
                exceed expectations. Our commitment to excellence has made us the trusted partner 
                for professionals and organizations across 30+ countries.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 py-8 border-y border-border">
              <div className="text-center">
                <p className="text-3xl lg:text-4xl font-bold font-playfair text-primary">10+</p>
                <p className="text-sm text-muted-foreground mt-1">Years Experience</p>
              </div>
              <div className="text-center">
                <p className="text-3xl lg:text-4xl font-bold font-playfair text-primary">30+</p>
                <p className="text-sm text-muted-foreground mt-1">Countries Served</p>
              </div>
              <div className="text-center">
                <p className="text-3xl lg:text-4xl font-bold font-playfair text-primary">98%</p>
                <p className="text-sm text-muted-foreground mt-1">Satisfaction Rate</p>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="flex gap-4 p-4 rounded-lg hover:bg-secondary/50 transition-colors opacity-0 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Internal Linking - CTA */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">Ready to experience our premium service?</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/work-with-us" 
                className="inline-flex items-center px-6 py-3 bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg font-semibold transition-colors"
              >
                Apply for a Project
              </Link>
              <Link 
                to="/book" 
                className="inline-flex items-center px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-lg text-foreground font-medium transition-colors"
              >
                Book a Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
