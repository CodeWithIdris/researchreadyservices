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
import { supabase } from "@/integrations/supabase/client";
import {
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Lock,
  Globe,
  Award,
  AlertTriangle,
  Zap,
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

const VAGUE_PATTERNS = [
  /^help\s*me/i,
  /^i\s*need\s*help/i,
  /^assignment/i,
  /^urgent\s*work/i,
  /^do\s*my/i,
  /^write\s*my/i,
  /^homework/i,
  /^please\s*help/i,
  /^can\s*you\s*help/i,
];

const DELIVERABLE_KEYWORDS = [
  "report", "analysis", "thesis", "dissertation", "proposal",
  "literature review", "data", "methodology", "research",
  "strategy", "publication", "manuscript", "survey", "framework",
  "findings", "recommendations", "deliverable", "chapters",
];

function classifyLead(
  budgetRange: string,
  description: string
): "high" | "medium" | "low" {
  const trimmed = description.trim();
  const isVague = VAGUE_PATTERNS.some((p) => p.test(trimmed));
  const highBudgets = ["$300 – $700", "$700 – $1,500", "$1,500+"];
  const mediumBudgets = ["$150 – $300"];
  const hasDeliverables = DELIVERABLE_KEYWORDS.some((kw) =>
    trimmed.toLowerCase().includes(kw)
  );

  if (isVague || trimmed.length < 50) return "low";
  if (
    highBudgets.includes(budgetRange) &&
    trimmed.length >= 100 &&
    hasDeliverables
  )
    return "high";
  if (mediumBudgets.includes(budgetRange) && trimmed.length >= 50)
    return "medium";
  if (highBudgets.includes(budgetRange)) return "medium";
  return "medium";
}

function detectSource(): string {
  const params = new URLSearchParams(window.location.search);
  if (params.get("utm_source") || params.get("fbclid") || params.get("gclid"))
    return "ads";
  if (document.referrer && !document.referrer.includes(window.location.hostname))
    return "referral";
  return "organic";
}

const WorkWithUs = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const budgetRanges = ["$150 – $300", "$300 – $700", "$700 – $1,500", "$1,500+"];

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

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsSubmitting(true);
    const priority = classifyLead(formData.budgetRange, formData.description);
    const source = detectSource();
    const fastResponse = priority === "high";

    try {
      const { error } = await supabase.from("project_leads").insert({
        name: formData.name,
        email: formData.email,
        country: formData.country,
        budget_range: formData.budgetRange,
        project_type: formData.projectType,
        deadline: formData.deadline,
        description: formData.description,
        priority,
        source,
        fast_response: fastResponse,
      });

      if (error) throw error;

      // Fire Meta Pixel Lead event (once per submission)
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Lead", {
          content_name: formData.projectType,
          currency: "USD",
          value: formData.budgetRange,
        });
      }

      // Show response based on priority
      if (priority === "high") {
        toast({
          title: "Application Received ✓",
          description:
            "Your project appears to be a strong fit. Our team will review your requirements and get back to you shortly with next steps.",
        });
      } else if (priority === "medium") {
        toast({
          title: "Application Received",
          description:
            "We will review your request and respond within 24–48 hours if your project aligns with our current availability.",
        });
      } else {
        toast({
          title: "Thank you for your interest",
          description:
            "At this time, we prioritize projects with clearly defined scope and objectives. You may resubmit with more detailed information.",
        });
      }

      setFormData({
        name: "",
        email: "",
        country: "",
        budgetRange: "",
        projectType: "",
        deadline: "",
        description: "",
      });
    } catch {
      toast({
        title: "Submission failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Work With Us – Premium Research & Consulting | ResearchReady"
        description="Apply for premium research and consulting services. We deliver publication-grade research, reports, and analysis for professionals and businesses worldwide."
      />

      {/* Minimal top bar */}
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
            Premium Research & Consulting for Professionals Who{" "}
            <span className="text-accent">Demand Quality</span>
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            We deliver publication-grade research, reports, and analysis for
            professionals and businesses worldwide.
          </p>

          {/* Pricing */}
          <div className="bg-card border-2 border-accent/30 rounded-2xl p-6 lg:p-8 max-w-xl mx-auto shadow-lg">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2 font-medium">
              Typical Investment
            </p>
            <p className="text-2xl lg:text-3xl font-bold text-foreground font-playfair">
              $150 – $500+
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
              { icon: Globe, text: "Serving Clients Across the US, UK, Canada & Europe" },
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
                  <li key={item} className="flex items-start gap-3 text-muted-foreground">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <XCircle className="w-6 h-6 text-destructive" />
                Who This Is NOT For
              </h2>
              <ul className="space-y-4">
                {[
                  "Low-budget requests under $150",
                  "Last-minute urgent work (under 48 hours)",
                  "Basic assignments or homework",
                  "Copy-paste or plagiarized work seekers",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-muted-foreground">
                    <XCircle className="w-5 h-5 text-destructive/60 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Scarcity */}
      <section className="py-4">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-accent/10 rounded-xl py-4 px-6 max-w-2xl mx-auto flex items-center justify-center gap-3">
            <Clock className="w-5 h-5 text-accent" />
            <p className="text-foreground font-medium">
              Due to high demand, we accept a{" "}
              <span className="text-accent font-bold">limited number of projects weekly</span>.
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
                Apply to Work With Us
              </h2>
              <p className="text-muted-foreground">
                Complete the form below. We review applications and respond within 24 hours.
              </p>
            </div>

            {/* Qualification warning */}
            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                We only respond to applications with a clear project scope and a minimum budget of $100.
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
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Country *</Label>
                    <Select
                      value={formData.country}
                      onValueChange={(v) => setFormData({ ...formData, country: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Project Investment Range *</Label>
                    <p className="text-xs text-muted-foreground">
                      Our projects are priced based on scope. Select the range that best reflects your expected investment.
                    </p>
                    <Select
                      value={formData.budgetRange}
                      onValueChange={(v) => setFormData({ ...formData, budgetRange: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        {budgetRanges.map((b) => (
                          <SelectItem key={b} value={b}>{b}</SelectItem>
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
                      onValueChange={(v) => setFormData({ ...formData, projectType: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectTypes.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Deadline *</Label>
                    <Select
                      value={formData.deadline}
                      onValueChange={(v) => setFormData({ ...formData, deadline: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select deadline" />
                      </SelectTrigger>
                      <SelectContent>
                        {deadlines.map((d) => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Project Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your project requirements, research topic, methodology preferences, and expected deliverables... (minimum 100 characters recommended for faster review)"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="min-h-[140px]"
                    required
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {formData.description.length} characters
                    {formData.description.length > 0 && formData.description.length < 100 && (
                      <span className="text-destructive"> — add more detail for faster review</span>
                    )}
                  </p>
                </div>

                {/* Pre-submit qualification note */}
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground">
                    We review applications based on project clarity and budget. Only qualified projects will receive a response.
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  size="xl"
                  className="w-full gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Apply to Work With Us"}
                  {!isSubmitting && <ArrowRight className="w-5 h-5" />}
                </Button>
              </form>

              {/* Trust signals below form */}
              <div className="mt-8 pt-6 border-t border-border">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Lock className="w-4 h-4 text-accent" />
                    <span>Confidential & professional handling</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Globe className="w-4 h-4 text-accent" />
                    <span>Trusted by international clients</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Zap className="w-4 h-4 text-accent" />
                    <span>Limited slots available weekly</span>
                  </div>
                </div>
              </div>

              <div className="text-center mt-6 space-y-2">
                <p className="text-sm text-muted-foreground">
                  We review applications and respond within 24 hours. Your information is kept strictly confidential.
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  We typically accept only 3–5 new projects per week.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Content - Internal Linking for SEO */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-playfair text-2xl lg:text-3xl font-bold text-foreground mb-3">Learn More About Our Services</h2>
            <p className="text-muted-foreground">Explore how we can help you achieve your research and business goals</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <a 
              href="/about" 
              className="block p-6 bg-background rounded-xl border border-border hover:border-accent/30 hover:shadow-md transition-all text-center"
            >
              <h3 className="font-semibold text-foreground mb-2">About Us</h3>
              <p className="text-sm text-muted-foreground">Learn about our 10+ year journey and mission</p>
            </a>
            <a 
              href="/faqs" 
              className="block p-6 bg-background rounded-xl border border-border hover:border-accent/30 hover:shadow-md transition-all text-center"
            >
              <h3 className="font-semibold text-foreground mb-2">FAQs</h3>
              <p className="text-sm text-muted-foreground">Find answers to common questions</p>
            </a>
            <a 
              href="/book" 
              className="block p-6 bg-background rounded-xl border border-border hover:border-accent/30 hover:shadow-md transition-all text-center"
            >
              <h3 className="font-semibold text-foreground mb-2">Book Consultation</h3>
              <p className="text-sm text-muted-foreground">Schedule a free 15-minute discovery call</p>
            </a>
            <a 
              href="/#services" 
              className="block p-6 bg-background rounded-xl border border-border hover:border-accent/30 hover:shadow-md transition-all text-center"
            >
              <h3 className="font-semibold text-foreground mb-2">Our Services</h3>
              <p className="text-sm text-muted-foreground">Explore our full range of research services</p>
            </a>
          </div>
        </div>
      </section>

      {/* Minimal footer */}
      <div className="bg-primary py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} ResearchReady Services. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkWithUs;
