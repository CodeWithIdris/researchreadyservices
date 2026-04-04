import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import SEOHead from "@/components/SEOHead";
import {
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Lock,
  Globe,
  Users,
  Award,
} from "lucide-react";

const applicationSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  country: z.string().min(1, "Please select your country"),
  budgetRange: z.string().min(1, "Please select a budget range"),
  projectType: z.string().min(1, "Please select a project type"),
  deadline: z.string().min(1, "Please select a deadline"),
  description: z
    .string()
    .trim()
    .min(20, "Please provide more details about your project")
    .max(2000),
});

const WorkWithUs = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    budgetRange: "",
    projectType: "",
    deadline: "",
    description: "",
  });

  const countries = [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "Nigeria",
    "Ghana",
    "South Africa",
    "Kenya",
    "India",
    "UAE",
    "Other",
  ];

  const budgetRanges = ["$50 – $100", "$100 – $300", "$300+"];

  const projectTypes = [
    "Research Report",
    "Dissertation / Thesis",
    "Literature Review",
    "Data Analysis & Interpretation",
    "Research Proposal",
    "Business Report / Strategy",
    "Publication Support",
    "Consulting & Advisory",
    "Other",
  ];

  const deadlines = [
    "1–2 weeks",
    "2–4 weeks",
    "1–2 months",
    "2–3 months",
    "3+ months",
    "Flexible",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = applicationSchema.safeParse(formData);
    if (!result.success) {
      toast({
        title: "Please complete all required fields",
        description: result.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    const subject = encodeURIComponent(
      `Project Application: ${formData.projectType} – ${formData.name}`
    );
    const body = encodeURIComponent(
      `PROJECT APPLICATION\n\n` +
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Country: ${formData.country}\n\n` +
        `Budget Range: ${formData.budgetRange}\n` +
        `Project Type: ${formData.projectType}\n` +
        `Deadline: ${formData.deadline}\n\n` +
        `Project Description:\n${formData.description}\n\n` +
        `---\n` +
        `Submitted via ResearchReady – Work With Us`
    );

    window.location.href = `mailto:researchreadyservices@gmail.com?subject=${subject}&body=${body}`;

    toast({
      title: "Application ready",
      description:
        "Your email client has been opened. Please send the email to submit your application.",
    });

    setFormData({
      name: "",
      email: "",
      country: "",
      budgetRange: "",
      projectType: "",
      deadline: "",
      description: "",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Work With Us – Premium Research & Consulting | ResearchReady"
        description="Apply for premium research and consulting services. We deliver publication-grade research, reports, and analysis for professionals and businesses worldwide."
      />

      {/* Minimal top bar – no navigation */}
      <div className="bg-primary py-4">
        <div className="container mx-auto px-4 text-center">
          <span className="font-playfair text-xl font-bold text-primary-foreground">
            Research<span className="text-accent">Ready</span>
          </span>
        </div>
      </div>

      {/* Hero */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
          <div className="inline-block px-4 py-2 bg-accent/10 text-accent font-semibold rounded-full text-sm mb-6">
            Limited Project Slots Available
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            Premium Research & Consulting Services for{" "}
            <span className="text-accent">Serious Clients</span>
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            We deliver publication-grade research, reports, and analysis for
            professionals and businesses worldwide.
          </p>

          {/* Pricing filter – prominent */}
          <div className="bg-card border-2 border-accent/30 rounded-2xl p-6 lg:p-8 max-w-xl mx-auto shadow-lg">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2 font-medium">
              Investment Range
            </p>
            <p className="text-2xl lg:text-3xl font-bold text-foreground font-playfair">
              $100 – $500+
            </p>
            <p className="text-muted-foreground mt-2">
              Depending on project scope and complexity
            </p>
          </div>
        </div>
      </section>

      {/* Authority Badges */}
      <section className="py-12 border-y border-border bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Globe, text: "Trusted by International Clients" },
              { icon: Lock, text: "Confidential & Professional Delivery" },
              { icon: Award, text: "Publication-Grade Quality" },
              { icon: Shield, text: "10+ Years of Excellence" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-3 justify-center text-center"
              >
                <item.icon className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Qualification Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Who this is for */}
            <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-accent" />
                Who This Is For
              </h2>
              <ul className="space-y-4">
                {[
                  "Professionals needing research support",
                  "Business owners & founders",
                  "Postgraduate researchers (Masters & PhD)",
                  "International clients seeking quality",
                  "Organizations & consultancies",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-muted-foreground"
                  >
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Who this is NOT for */}
            <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <XCircle className="w-6 h-6 text-destructive" />
                Who This Is NOT For
              </h2>
              <ul className="space-y-4">
                {[
                  "Low-budget requests under $50",
                  "Last-minute urgent work (under 48 hours)",
                  "Basic assignments or homework",
                  "Copy-paste or plagiarized work seekers",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-muted-foreground"
                  >
                    <XCircle className="w-5 h-5 text-destructive/60 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Scarcity + CTA */}
      <section className="py-4">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-accent/10 rounded-xl py-4 px-6 max-w-2xl mx-auto flex items-center justify-center gap-3">
            <Clock className="w-5 h-5 text-accent" />
            <p className="text-foreground font-medium">
              Due to high demand, we accept a{" "}
              <span className="text-accent font-bold">
                limited number of projects weekly
              </span>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Apply for a Project
              </h2>
              <p className="text-muted-foreground">
                Complete the form below. We review applications and respond
                within 24 hours.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 lg:p-10 border border-border shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Country *</Label>
                    <Select
                      value={formData.country}
                      onValueChange={(v) =>
                        setFormData({ ...formData, country: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Budget Range (USD) *</Label>
                    <Select
                      value={formData.budgetRange}
                      onValueChange={(v) =>
                        setFormData({ ...formData, budgetRange: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget" />
                      </SelectTrigger>
                      <SelectContent>
                        {budgetRanges.map((b) => (
                          <SelectItem key={b} value={b}>
                            {b}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Project Type *</Label>
                    <Select
                      value={formData.projectType}
                      onValueChange={(v) =>
                        setFormData({ ...formData, projectType: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectTypes.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Deadline *</Label>
                    <Select
                      value={formData.deadline}
                      onValueChange={(v) =>
                        setFormData({ ...formData, deadline: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select deadline" />
                      </SelectTrigger>
                      <SelectContent>
                        {deadlines.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Project Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your project requirements, research topic, methodology preferences, and expected deliverables..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="min-h-[140px]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  size="xl"
                  className="w-full gap-2"
                >
                  Apply for a Project
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                We review applications and respond within 24 hours. Your
                information is kept strictly confidential.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal footer */}
      <div className="bg-primary py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} ResearchReady Services. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkWithUs;
