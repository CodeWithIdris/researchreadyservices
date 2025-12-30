import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import { Users, Target, Award, BookOpen, GraduationCap, Heart } from "lucide-react";

const AboutUs = () => {

  const milestones = [
    { year: "2014", title: "Founded in Lagos", description: "ResearchReady was established to support African researchers in achieving academic excellence." },
    { year: "2016", title: "Expanded Services", description: "Added statistical analysis and data interpretation services to our offerings." },
    { year: "2018", title: "1,000 Projects Completed", description: "Celebrated helping over 1,000 students and researchers achieve their academic goals." },
    { year: "2020", title: "Pan-African Reach", description: "Extended our services across Africa, supporting researchers in Ghana, Kenya, South Africa, and beyond." },
    { year: "2023", title: "5,000+ Success Stories", description: "Reached the milestone of 5,000 successfully completed research projects." },
    { year: "2024", title: "AI-Enhanced Services", description: "Integrated cutting-edge AI tools to enhance research quality while maintaining human expertise." },
  ];

  const values = [
    { icon: Award, title: "Excellence", description: "We maintain the highest standards in every project we undertake." },
    { icon: Heart, title: "Integrity", description: "Honesty and ethical practices guide everything we do." },
    { icon: Users, title: "Collaboration", description: "We work closely with clients to understand and meet their unique needs." },
    { icon: GraduationCap, title: "Empowerment", description: "We aim to educate and empower researchers for long-term success." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="About Us - Our Story & Mission"
        description="Learn about ResearchReady's journey since 2014. Discover our mission to empower African researchers with world-class academic writing and research support services."
        url="https://researchready.com/about"
      />
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 lg:pt-32 pb-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-playfair text-4xl lg:text-5xl font-bold text-primary mb-6">
              About ResearchReady
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Since 2014, we've been dedicated to empowering researchers across Africa and beyond 
              with world-class academic writing and research support services.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-primary/5 rounded-2xl p-8 lg:p-12">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-playfair text-2xl lg:text-3xl font-bold text-primary mb-4">
                Our Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To provide exceptional academic research support that empowers students, scholars, 
                and professionals to achieve their educational goals. We are committed to delivering 
                high-quality, original, and timely research assistance while maintaining the highest 
                ethical standards in academic integrity.
              </p>
            </div>
            <div className="bg-accent/5 rounded-2xl p-8 lg:p-12">
              <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-accent" />
              </div>
              <h2 className="font-playfair text-2xl lg:text-3xl font-bold text-primary mb-4">
                Our Vision
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To become Africa's leading academic research support partner, recognized globally 
                for excellence, innovation, and commitment to advancing scholarly achievement. 
                We envision a world where every researcher has access to the support they need 
                to contribute meaningfully to their fields.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-primary mb-4">
              Our Core Values
            </h2>
            <p className="text-muted-foreground">
              The principles that guide everything we do at ResearchReady.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-background rounded-xl p-6 text-center shadow-sm">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-primary mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company History */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-primary mb-4">
              Our Journey
            </h2>
            <p className="text-muted-foreground">
              A decade of empowering researchers and advancing academic excellence.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 transform lg:-translate-x-1/2" />
              
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-start mb-8 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'lg:pr-12 lg:text-right' : 'lg:pl-12'} pl-12 lg:pl-0`}>
                    <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
                      <span className="inline-block bg-accent/10 text-accent font-semibold px-3 py-1 rounded-full text-sm mb-2">
                        {milestone.year}
                      </span>
                      <h3 className="font-semibold text-primary mb-2">{milestone.title}</h3>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                  {/* Timeline dot */}
                  <div className="absolute left-4 lg:left-1/2 w-3 h-3 bg-primary rounded-full transform -translate-x-1/2 mt-8" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <NewsletterSignup />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-accent mb-2">10+</div>
              <p className="text-primary-foreground/70">Years of Experience</p>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-accent mb-2">5,000+</div>
              <p className="text-primary-foreground/70">Projects Completed</p>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-accent mb-2">50+</div>
              <p className="text-primary-foreground/70">Expert Researchers</p>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-accent mb-2">98%</div>
              <p className="text-primary-foreground/70">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default AboutUs;
