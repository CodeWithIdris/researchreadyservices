import { Star, Quote } from "lucide-react";
import { Link } from "react-router-dom";

const testimonials = [
  {
    name: "Dr. Adaobi Nwankwo",
    role: "Research Consultant, Lagos",
    content: "ResearchReady transformed my research output. Their expert guidance and meticulous attention to detail helped me achieve publication in a top-tier journal. Highly recommended for serious professionals.",
    rating: 5,
  },
  {
    name: "Prof. Chukwuemeka Okonkwo",
    role: "Associate Professor, University of Nigeria",
    content: "The literature review they provided was comprehensive and insightful. It saved me weeks of work and gave me a solid foundation for my research paper.",
    rating: 5,
  },
  {
    name: "Sarah Mitchell",
    role: "Strategy Consultant, London, UK",
    content: "Outstanding quality. They understood our business research requirements perfectly and delivered beyond expectations. The turnaround time was impressive without compromising quality.",
    rating: 5,
  },
  {
    name: "Dr. James Okafor",
    role: "Research Director, Abuja",
    content: "Professional, reliable, and incredibly thorough. They helped our organization navigate complex research methodology with precision. A true premium service.",
    rating: 5,
  },
  {
    name: "Dr. Ngozi Eze",
    role: "Senior Researcher, Covenant University",
    content: "Their data analysis was exceptional. The statistical interpretation and methodology guidance were exactly what I needed for my publication.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Business Analyst, Toronto, Canada",
    content: "From initial briefing to final delivery, ResearchReady demonstrated the highest level of professionalism. Their research quality is unmatched.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <span className="inline-block px-4 py-2 bg-primary-foreground/10 text-accent font-semibold rounded-full text-sm mb-6">
            Client Testimonials
          </span>
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Trusted by Professionals Globally
          </h2>
          <p className="text-lg text-primary-foreground/80">
            Hear from professionals and researchers who have elevated their work with our premium services.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="bg-primary-foreground/5 backdrop-blur-sm rounded-xl p-6 lg:p-8 border border-primary-foreground/10 opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <Quote className="w-10 h-10 text-accent mb-6" />
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-primary-foreground/90 leading-relaxed mb-6">
                "{testimonial.content}"
              </p>
              <div className="pt-4 border-t border-primary-foreground/10">
                <p className="font-semibold text-primary-foreground">{testimonial.name}</p>
                <p className="text-sm text-primary-foreground/60">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Internal Linking - CTA */}
        <div className="mt-16 text-center">
          <p className="text-primary-foreground/80 mb-6">Join thousands of satisfied clients worldwide</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/work-with-us" 
              className="inline-flex items-center px-6 py-3 bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg font-semibold transition-colors"
            >
              Apply for a Project
            </Link>
            <Link 
              to="/about" 
              className="inline-flex items-center px-6 py-3 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg text-primary-foreground font-medium transition-colors"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
