import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import { Users, Target, Award, BookOpen, Heart, Globe, Briefcase, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AboutUs = () => {
  const milestones = [
    { year: "2014", title: "Founded in Lagos", description: "ResearchReady was established to provide premium research support for professionals and organizations." },
    { year: "2016", title: "Expanded Services", description: "Added data analysis, business research, and consulting services to our portfolio." },
    { year: "2018", title: "1,000 Projects Delivered", description: "Reached our first major milestone serving professionals across multiple industries." },
    { year: "2020", title: "International Expansion", description: "Extended our services globally, serving clients in the US, UK, Canada, Australia, and beyond." },
    { year: "2023", title: "5,000+ Projects Completed", description: "Achieved 5,000 successfully delivered research projects for clients in 30+ countries." },
    { year: "2024", title: "AI-Enhanced Research", description: "Integrated advanced research tools to enhance quality while maintaining expert human oversight." },
  ];

  const values = [
    { icon: Award, title: "Excellence", description: "We maintain the highest standards in every project we undertake." },
    { icon: Heart, title: "Integrity", description: "Confidentiality, honesty, and ethical practices guide everything we do." },
    { icon: Users, title: "Collaboration", description: "We work closely with clients to understand and exceed their unique needs." },
    { icon: Globe, title: "Global Reach", description: "Serving professionals across 30+ countries with premium, reliable service." },
  ];

  const whoWeWorkWith = [
    { icon: Briefcase, title: "Consultants & Advisors", description: "Strategic research and reports for consulting engagements." },
    { icon: Building, title: "Founders & Entrepreneurs", description: "Market research, feasibility studies, and business analysis." },
    { icon: BookOpen, title: "Researchers & Academics", description: "Publication-grade research, analysis, and writing support." },
    { icon: Users, title: "Organizations & NGOs", description: "Policy research, impact assessments, and technical reports." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="About Us – Premium Research & Consulting | ResearchReady"
        description="Since 2014, ResearchReady has supported professionals, researchers, and organizations globally with premium research and consulting services."
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
              Since 2014, we have supported professionals, researchers, and organizations globally 
              with premium research, analysis, and consulting services that drive real results.
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
                To deliver exceptional research and consulting services that empower professionals, 
                businesses, and organizations to make data-driven decisions and achieve their goals. 
                We are committed to providing publication-grade quality with the highest standards 
                of confidentiality and professionalism.
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
                To become the world's most trusted research and consulting partner, recognized globally 
                for excellence, innovation, and commitment to delivering transformative insights 
                for professionals and organizations across every industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Work With */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-primary mb-4">
              Who We Work With
            </h2>
            <p className="text-muted-foreground">
              We partner with serious professionals and organizations who demand the highest quality.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whoWeWorkWith.map((item, index) => (
              <div key={index} className="bg-background rounded-xl p-6 text-center shadow-sm border border-border">
                <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-semibold text-primary mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button variant="gold" size="lg" asChild>
              <a href="mailto:researchreadyservices@gmail.com?subject=Project%20Application%20-%20ResearchReady&body=Full%20Name%3A%0ACountry%3A%0AProject%20Type%3A%0ABudget%20Range%3A%0ADeadline%3A%0A%0AProject%20Description%3A%0A%0APlease%20attach%20any%20relevant%20documents.">Apply for a Project</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 lg:py-24">
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
              <div key={index} className="bg-card rounded-xl p-6 text-center shadow-sm border border-border">
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

      {/* Timeline */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-primary mb-4">
              Our Journey
            </h2>
            <p className="text-muted-foreground">
              A decade of delivering excellence and building trust worldwide.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
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
                  <div className="absolute left-4 lg:left-1/2 w-3 h-3 bg-primary rounded-full transform -translate-x-1/2 mt-8" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <NewsletterSignup />
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-accent mb-2">10+</div>
              <p className="text-primary-foreground/70">Years of Excellence</p>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-accent mb-2">5,000+</div>
              <p className="text-primary-foreground/70">Projects Delivered</p>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-accent mb-2">30+</div>
              <p className="text-primary-foreground/70">Countries Served</p>
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
