import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Sarah Mitchell",
    role: "PhD Candidate, Stanford University",
    content: "ResearchReady transformed my dissertation journey. Their expert guidance and meticulous attention to detail helped me achieve distinction. Highly recommended for any serious researcher.",
    rating: 5,
  },
  {
    name: "Prof. James Chen",
    role: "Associate Professor, MIT",
    content: "The literature review they provided was comprehensive and insightful. It saved me weeks of work and gave me a solid foundation for my research paper.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Master's Student, Columbia University",
    content: "Outstanding service! They understood exactly what I needed and delivered beyond my expectations. The turnaround time was impressive without compromising quality.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <span className="inline-block px-4 py-2 bg-primary-foreground/10 text-accent font-semibold rounded-full text-sm mb-6">
            Testimonials
          </span>
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            What Our Clients Say
          </h2>
          <p className="text-lg text-primary-foreground/80">
            Join thousands of satisfied researchers who have elevated their academic work with our support.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="bg-primary-foreground/5 backdrop-blur-sm rounded-xl p-6 lg:p-8 border border-primary-foreground/10 opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Quote Icon */}
              <Quote className="w-10 h-10 text-accent mb-6" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>

              {/* Content */}
              <p className="text-primary-foreground/90 leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="pt-4 border-t border-primary-foreground/10">
                <p className="font-semibold text-primary-foreground">{testimonial.name}</p>
                <p className="text-sm text-primary-foreground/60">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
