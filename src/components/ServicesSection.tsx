import { FileText, BookOpen, PenTool, Search, Briefcase, LineChart } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: FileText,
    title: "Dissertation & Thesis Writing",
    description: "Comprehensive support from proposal development to final submission, meeting rigorous academic standards.",
  },
  {
    icon: BookOpen,
    title: "Literature Reviews",
    description: "Thorough analysis and synthesis of existing research, delivering publication-ready reviews.",
  },
  {
    icon: PenTool,
    title: "Research Editing & Proofreading",
    description: "Professional editing to refine your academic and business documents to the highest standard.",
  },
  {
    icon: Search,
    title: "Data Analysis & Interpretation",
    description: "Expert quantitative and qualitative analysis using advanced statistical and research methods.",
  },
  {
    icon: Briefcase,
    title: "Business Research & Strategy",
    description: "Market research, feasibility studies, and strategic reports for organizations and entrepreneurs.",
  },
  {
    icon: LineChart,
    title: "Publication & Advisory Support",
    description: "Navigate peer review, journal selection, and publication strategy with expert guidance.",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-semibold rounded-full text-sm mb-6">
            Our Services
          </span>
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Premium Research & Consulting Solutions
          </h2>
          <p className="text-lg text-muted-foreground">
            From strategic research to expert analysis, we provide end-to-end support for professionals and organizations globally.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <Link
              key={service.title}
              to="/work-with-us"
              className="group bg-card rounded-xl p-6 lg:p-8 shadow-sm border border-border hover:shadow-lg hover:border-accent/30 transition-all duration-300 opacity-0 animate-fade-in text-left block"
              style={{ animationDelay: `${index * 0.1}s` }}
              aria-label={`Learn more about ${service.title}`}
            >
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <service.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-playfair text-xl font-bold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
              <span className="inline-block mt-4 text-accent font-semibold text-sm group-hover:underline">
                Apply Now →
              </span>
            </Link>
          ))}
        </div>

        {/* Internal Linking - Related Pages */}
        <div className="mt-16 pt-12 border-t border-border">
          <div className="text-center mb-8">
            <h3 className="font-playfair text-2xl font-bold text-foreground mb-2">Explore More</h3>
            <p className="text-muted-foreground">Learn more about how we can help you succeed</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/about" 
              className="inline-flex items-center px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-lg text-foreground font-medium transition-colors"
            >
              About Our Company
            </Link>
            <Link 
              to="/faqs" 
              className="inline-flex items-center px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-lg text-foreground font-medium transition-colors"
            >
              Frequently Asked Questions
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
    </section>
  );
};

export default ServicesSection;
