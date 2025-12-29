import { FileText, BookOpen, PenTool, Search, GraduationCap, LineChart } from "lucide-react";

const services = [
  {
    icon: FileText,
    title: "Dissertation Writing",
    description: "Comprehensive dissertation support from proposal to final defense preparation.",
  },
  {
    icon: BookOpen,
    title: "Literature Reviews",
    description: "Thorough analysis and synthesis of existing research in your field of study.",
  },
  {
    icon: PenTool,
    title: "Thesis Editing",
    description: "Professional editing and proofreading to polish your academic work to perfection.",
  },
  {
    icon: Search,
    title: "Research Analysis",
    description: "Expert data analysis and interpretation using advanced statistical methods.",
  },
  {
    icon: GraduationCap,
    title: "Academic Coaching",
    description: "One-on-one guidance to develop your research and writing skills.",
  },
  {
    icon: LineChart,
    title: "Publication Support",
    description: "Navigate the peer review process and get your research published.",
  },
];

const ServicesSection = () => {
  const phoneNumber = "2349022282963";

  const handleServiceClick = (serviceTitle: string) => {
    const message = encodeURIComponent(`Hello, I need support with ${serviceTitle}. Please provide more information about this service.`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <section id="services" className="py-20 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-semibold rounded-full text-sm mb-6">
            Our Services
          </span>
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Comprehensive Research Support
          </h2>
          <p className="text-lg text-muted-foreground">
            From initial concept to final publication, we provide expert guidance at every stage of your academic journey.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <button
              key={service.title}
              onClick={() => handleServiceClick(service.title)}
              className="group bg-card rounded-xl p-6 lg:p-8 shadow-sm border border-border hover:shadow-lg hover:border-accent/30 transition-all duration-300 opacity-0 animate-fade-in text-left cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
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
                Get Support →
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
