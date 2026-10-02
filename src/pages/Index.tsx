import { ArrowRight, BarChart3, BookOpenCheck, Building2, Check, Microscope, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import WhatsAppButton from "@/components/WhatsAppButton";
import ResearchWorkspace from "@/components/research/ResearchWorkspace";
import InsightCard from "@/components/research/InsightCard";
import { serviceGroups } from "@/data/services";
import { insights } from "@/data/insights";
import { consultationUrl } from "@/lib/siteConfig";
import { trackCTAClick } from "@/lib/analytics";

const audiences = [
  { icon: Microscope, title: "PhD Research", copy: "Dissertations, research methodology, literature synthesis, data analysis, interpretation and academic editing.", slug: "phd-dissertation-support" },
  { icon: BookOpenCheck, title: "Master's Research", copy: "Thesis development, methodology, literature review, data analysis and research refinement.", slug: "masters-thesis-support" },
  { icon: Quote, title: "Academic Publishing", copy: "Journal manuscripts, systematic reviews, scoping reviews, conference papers and publication preparation.", slug: "academic-manuscript-support" },
  { icon: Building2, title: "Professional Research", copy: "Research reports, feasibility studies, evidence analysis, grant proposals and consulting.", slug: "professional-research-services" },
];

const problems = ["You have hundreds of papers, but the argument still isn't clear.", "Your dataset is ready, but you're unsure which analysis actually answers the research question.", "Your methodology is technically sound, but revisions keep exposing a deeper problem.", "You've finished the research, but turning it into a conference paper is another challenge entirely.", "Your results are significant, but interpreting what they mean is not straightforward."];
const steps = ["Tell us what you're working on", "We assess the requirement", "We define the scope", "We work through the research problem", "You receive structured output"];

const Index = () => (
  <div className="min-h-screen bg-background">
    <SEOHead schema={{ "@context": "https://schema.org", "@type": "Service", name: "Professional research support and consulting", provider: { "@type": "Organization", name: "ResearchReady Services" } }} />
    <Header />
    <main>
      <section className="border-b border-border pt-24 lg:pt-32">
        <div className="container grid items-center gap-12 py-12 lg:grid-cols-[1.1fr_.9fr] lg:py-20">
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-accent">Professional research support & consulting</p>
            <h1 className="max-w-4xl font-playfair text-4xl leading-[1.12] text-primary sm:text-5xl lg:text-6xl">Research becomes complicated when having more information stops making things clearer.</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">From literature reviews and research methodology to advanced data analysis, dissertations, manuscripts and conference papers, ResearchReady helps researchers turn complex research problems into structured, defensible work.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="gold" size="xl" asChild><Link to={consultationUrl()} onClick={() => trackCTAClick("discuss_research", "Discuss Your Research", "homepage_hero")}>Discuss Your Research <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
              <Button variant="outline" size="xl" asChild><Link to={consultationUrl()} onClick={() => trackCTAClick("research_assessment", "Request a Research Assessment", "homepage_hero")}>Request a Research Assessment</Link></Button>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">For PhD and Master's researchers, academics, professionals and organisations.</p>
          </div>
          <ResearchWorkspace />
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container"><div className="mb-10 max-w-2xl"><p className="eyebrow">Choose your pathway</p><h2 className="section-title">Research support for different stages of serious work</h2></div>
          <div className="grid border-l border-t border-border md:grid-cols-2 lg:grid-cols-4">{audiences.map((audience) => <article key={audience.title} className="border-b border-r border-border p-6 lg:p-7"><audience.icon className="h-6 w-6 text-accent" /><h3 className="mt-8 font-playfair text-xl text-primary">{audience.title}</h3><p className="mt-3 min-h-24 text-sm leading-6 text-muted-foreground">{audience.copy}</p><Link className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary" to={`/services/${audience.slug}`}>Explore support <ArrowRight className="h-4 w-4" /></Link></article>)}</div>
        </div>
      </section>

      <section className="bg-primary py-16 text-primary-foreground lg:py-24">
        <div className="container grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow text-accent">Recognition</p><h2 className="font-playfair text-3xl leading-tight sm:text-4xl">The difficult part isn't always doing the research.</h2><p className="mt-5 text-primary-foreground/70">It is recognising where complexity has replaced clarity.</p></div><div className="divide-y divide-primary-foreground/15 border-y border-primary-foreground/15">{problems.map((problem, index) => <p key={problem} className="grid grid-cols-[2rem_1fr] gap-4 py-5 text-base leading-7"><span className="text-accent">0{index + 1}</span>{problem}</p>)}</div></div>
      </section>

      <section className="border-y border-border py-16 lg:py-24"><div className="container"><div className="mb-10 flex items-end justify-between gap-5"><div><p className="eyebrow">Research Notes</p><h2 className="section-title">Ideas for thinking through difficult research</h2></div><Link className="hidden text-sm font-semibold text-primary sm:block" to="/insights">View all notes <ArrowRight className="ml-1 inline h-4 w-4" /></Link></div><div className="grid gap-x-10 md:grid-cols-2 lg:grid-cols-3">{insights.slice(0, 3).map((insight) => <InsightCard insight={insight} key={insight.slug} />)}</div></div></section>

      <section id="services" className="py-16 lg:py-24"><div className="container"><div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div className="max-w-2xl"><p className="eyebrow">Research services</p><h2 className="section-title">Support organised around the problem you're solving</h2></div><Button variant="outline" asChild><Link to="/services">View all services</Link></Button></div><div className="grid gap-px border border-border bg-border md:grid-cols-2">{serviceGroups.map((group) => <article key={group.title} className="bg-background p-7 lg:p-9"><h3 className="font-playfair text-2xl text-primary">{group.title}</h3><p className="mt-3 leading-7 text-muted-foreground">{group.description}</p><ul className="mt-6 grid gap-2 sm:grid-cols-2">{group.services.map((service) => <li key={service} className="flex items-start gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{service}</li>)}</ul><Link to={`/services/${group.slug}`} className="mt-7 inline-flex items-center gap-1 text-sm font-semibold text-primary">Explore this area <ArrowRight className="h-4 w-4" /></Link></article>)}</div></div></section>

      <section className="border-y border-border bg-secondary py-16 lg:py-24"><div className="container grid items-center gap-12 lg:grid-cols-2"><div><p className="eyebrow">Data & analytics</p><h2 className="section-title">The numbers are only the beginning.</h2><p className="mt-5 text-lg leading-8 text-muted-foreground">Running an analysis is one thing. Knowing which analysis to run, why it is appropriate, and what the results mean in relation to your research questions is another.</p><div className="mt-7 flex flex-wrap gap-2">{["SPSS", "R", "STATA", "Excel"].map((item) => <span className="border border-primary/20 bg-background px-4 py-2 text-sm font-semibold text-primary" key={item}>{item}</span>)}</div><Button variant="gold" size="lg" className="mt-8" asChild><Link to={consultationUrl("Data analysis and interpretation")}>Discuss Your Research</Link></Button></div><div className="border-l-2 border-accent pl-7"><BarChart3 className="h-8 w-8 text-accent" /><ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-sm font-medium">{["Statistical test selection", "Data preparation", "Descriptive statistics", "Inferential statistics", "Regression & correlation", "ANOVA", "Hypothesis testing", "Results interpretation", "Tables & visualisation"].map((item) => <li key={item}>{item}</li>)}</ul></div></div></section>

      <section className="py-16 lg:py-24"><div className="container grid gap-12 lg:grid-cols-[1.1fr_.9fr]"><div><p className="eyebrow">Literature review</p><h2 className="section-title">The more papers you read, the easier it becomes to lose your argument.</h2><p className="mt-6 text-lg leading-8 text-muted-foreground">And most researchers don't realise it until they're already hundreds of papers in.</p><p className="mt-4 leading-7 text-muted-foreground">The problem isn't necessarily the number of papers. It's whether you're extracting a clear argument from them. A strong literature review should reveal what is known, where the evidence conflicts, what remains unresolved and where your research fits.</p><Button className="mt-8" variant="gold" asChild><Link to={consultationUrl("Literature review")}>Discuss Your Literature Review</Link></Button></div><div className="border border-border p-7"><p className="font-playfair text-2xl text-primary">A review should leave the reader with a clearer problem than the one it began with.</p><div className="mt-8 space-y-5">{["Map what is known", "Identify disagreement", "Trace methodological patterns", "Locate the unresolved question", "Position your contribution"].map((item, index) => <div className="flex items-center gap-4 border-t border-border pt-4" key={item}><span className="text-xs font-semibold text-accent">0{index + 1}</span><span className="font-medium">{item}</span></div>)}</div></div></div></section>

      <section className="border-y border-border bg-secondary py-16 lg:py-24"><div className="container grid gap-12 lg:grid-cols-2"><div><p className="eyebrow">Systematic review</p><h2 className="section-title">Rigour starts before screening.</h2><p className="mt-5 leading-7 text-muted-foreground">A transparent review depends on the decisions made before results are counted: the question, eligibility criteria, databases, search strategy and planned synthesis.</p><ul className="mt-7 grid gap-3 text-sm sm:grid-cols-2">{["Protocol development", "Search strategy", "Screening workflow", "Data extraction", "Quality appraisal", "Evidence synthesis"].map((item) => <li className="border-t border-border pt-3 font-medium" key={item}>{item}</li>)}</ul><Button className="mt-8" variant="gold" asChild><Link to={consultationUrl("Systematic or scoping review")}>Discuss Your Research</Link></Button></div><div className="border-l-2 border-accent pl-7"><p className="font-playfair text-2xl leading-snug text-primary">A review should make its boundaries visible, not hide them in the methods section.</p><p className="mt-5 leading-7 text-muted-foreground">We support systematic and scoping review decisions with transparent methods and reporting appropriate to the review design.</p><Link className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary" to="/services/systematic-review-support">Explore systematic review support <ArrowRight className="h-4 w-4" /></Link></div></div></section>

      <section className="py-16 lg:py-24"><div className="container grid gap-12 lg:grid-cols-2"><article><p className="eyebrow">Doctoral research</p><h2 className="font-playfair text-3xl leading-tight text-primary">PhD support for decisions that shape the whole study.</h2><p className="mt-5 leading-7 text-muted-foreground">Refine the research problem, align design and method, interpret evidence and prepare clear, defensible scholarly communication while retaining authorship and academic responsibility.</p><Link className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary" to="/services/phd-dissertation-support">Explore PhD research support <ArrowRight className="h-4 w-4" /></Link></article><article className="border-l-2 border-accent pl-7"><p className="eyebrow">Professional research</p><h2 className="font-playfair text-3xl leading-tight text-primary">Evidence for decisions beyond academia.</h2><p className="mt-5 leading-7 text-muted-foreground">Research reports, feasibility studies, programme evaluation and evidence analysis can help organisations make decisions with a clearer view of the question, method and limits.</p><Link className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary" to="/services/professional-research-services">Explore professional research <ArrowRight className="h-4 w-4" /></Link></article></div></section>

      <section className="py-16 lg:py-24"><div className="container"><div className="mb-10 max-w-2xl"><p className="eyebrow">A clear process</p><h2 className="section-title">From research question to structured support</h2></div><div className="grid border-l border-t border-border md:grid-cols-5">{steps.map((step, index) => <div key={step} className="border-b border-r border-border p-5"><span className="text-xs font-semibold text-accent">0{index + 1}</span><h3 className="mt-10 font-playfair text-lg leading-snug text-primary">{step}</h3></div>)}</div><div className="mt-8"><Button variant="gold" size="lg" asChild><Link to={consultationUrl()}>Discuss Your Research</Link></Button></div></div></section>

      <section className="border-y border-border bg-secondary py-14"><div className="container grid gap-6 md:grid-cols-[.6fr_1.4fr] md:items-center"><p className="eyebrow">A considered scope</p><p className="max-w-3xl text-lg leading-8 text-primary">Each project is scoped around its research question, methods, materials, stage and timeline. Fees are discussed against that scope before work begins.</p></div></section>

      <section className="py-16 text-center lg:py-24"><div className="container max-w-3xl"><p className="eyebrow">A research assessment</p><h2 className="font-playfair text-3xl leading-tight text-primary sm:text-4xl">Start with the question you are trying to answer.</h2><p className="mx-auto mt-5 max-w-2xl leading-7 text-muted-foreground">Tell us where the work stands and what is proving difficult. We will review the requirement and discuss an appropriate next step.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Button variant="gold" size="lg" asChild><Link to={consultationUrl()}>Discuss Your Research</Link></Button><Button variant="outline" size="lg" asChild><Link to={consultationUrl()}>Request a Research Assessment</Link></Button></div></div></section>
    </main>
    <Footer /><WhatsAppButton />
  </div>
);

export default Index;