import { Shield, Clock, Users, Award, MessageCircle, RefreshCw } from "lucide-react";

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
    title: "Expert Writers",
    description: "PhD-qualified writers with expertise across all academic disciplines.",
  },
  {
    icon: Award,
    title: "Quality Assured",
    description: "Multi-level quality control ensures the highest academic standards.",
  },
  {
    icon: MessageCircle,
    title: "24/7 Support",
    description: "Round-the-clock assistance for all your queries and concerns.",
  },
  {
    icon: RefreshCw,
    title: "Free Revisions",
    description: "Unlimited revisions until you're completely satisfied with the result.",
  },
];

const WhyUsSection = () => {
  return (
    <section id="why-us" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content Side */}
          <div className="space-y-8">
            <div>
              <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-semibold rounded-full text-sm mb-6">
                Why Choose Us
              </span>
              <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Your Success Is Our Priority
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We combine academic expertise with personalized service to deliver research that 
                exceeds expectations. Our commitment to excellence has made us the trusted choice 
                for thousands of scholars worldwide.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-8 border-y border-border">
              <div className="text-center">
                <p className="text-3xl lg:text-4xl font-bold font-playfair text-primary">10+</p>
                <p className="text-sm text-muted-foreground mt-1">Years Experience</p>
              </div>
              <div className="text-center">
                <p className="text-3xl lg:text-4xl font-bold font-playfair text-primary">50+</p>
                <p className="text-sm text-muted-foreground mt-1">Disciplines</p>
              </div>
              <div className="text-center">
                <p className="text-3xl lg:text-4xl font-bold font-playfair text-primary">A+</p>
                <p className="text-sm text-muted-foreground mt-1">Average Grade</p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
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
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
