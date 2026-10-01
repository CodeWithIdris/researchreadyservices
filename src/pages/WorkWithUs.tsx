import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import ConsultationForm from "@/components/research/ConsultationForm";
import { Button } from "@/components/ui/button";
import { getAdLandingPage } from "@/data/adLandingPages";
import { SITE_URL, whatsappUrl } from "@/lib/siteConfig";
import { trackCTAClick, trackServiceView, trackWhatsAppClick } from "@/lib/analytics";
import { useEffect } from "react";

const WorkWithUs = () => {
  const { angle: routeAngle } = useParams();
  const [searchParams] = useSearchParams();
  const angle = routeAngle || searchParams.get("angle") || undefined;
  const page = getAdLandingPage(angle);
  useEffect(() => { if (page) trackServiceView(page.service, `ad_${page.slug}`); }, [page]);
  const headline = page?.headline || "Research becomes complicated when having more information stops making things clearer.";
  const intro = page?.intro || "ResearchReady helps you identify the problem beneath the research problem — and define a thoughtful way forward.";
  const stages = page?.stages || ["Tell us what you are working on", "We assess what support is appropriate", "We define a clear scope together"];
  const canonical = page ? `${SITE_URL}${routeAngle ? `/research/${page.slug}` : `/work-with-us?angle=${page.slug}`}` : `${SITE_URL}/work-with-us`;
  const source = page ? `ad_${page.slug}` : "work_with_us";

  return <div className="min-h-screen bg-background">
    <SEOHead title={page ? `${page.service} | ResearchReady` : "Discuss Your Research | ResearchReady"} description={intro} url={canonical} noindex />
    <header className="border-b border-border bg-background"><div className="container flex h-16 items-center justify-between"><Link to="/" className="font-playfair text-xl font-bold text-primary">Research<span className="text-accent">Ready</span></Link><a href="#enquiry" className="text-sm font-semibold text-primary">Discuss Your Research <ArrowRight className="ml-1 inline h-4 w-4" /></a></div></header>
    <main>
      <section className="border-b border-border bg-primary py-14 text-primary-foreground lg:py-20"><div className="container max-w-5xl"><p className="eyebrow text-accent">ResearchReady / Structured research support</p><h1 className="max-w-4xl font-playfair text-4xl leading-tight sm:text-5xl lg:text-6xl">{headline}</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-primary-foreground/80">{intro}</p><div className="mt-8 flex flex-wrap gap-3"><Button variant="gold" size="lg" asChild><a href="#enquiry" onClick={() => trackCTAClick("discuss_research", "Discuss Your Research", source)}>Discuss Your Research</a></Button><Button variant="outline" size="lg" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" asChild><a href="#enquiry" onClick={() => trackCTAClick("research_assessment", "Request a Research Assessment", source)}>Request a Research Assessment</a></Button><Button variant="outline" size="lg" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" asChild><a href={whatsappUrl(page?.service || "research project")} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick(source)}><MessageCircle className="mr-2 h-4 w-4" />Discuss on WhatsApp</a></Button></div></div></section>
      <section className="py-14 lg:py-20"><div className="container grid gap-12 lg:grid-cols-[1.1fr_.9fr]"><div><p className="eyebrow">The research problem</p><h2 className="section-title">Clarity matters more than another round of work.</h2><p className="mt-6 text-lg leading-8 text-muted-foreground">{page?.observation || "The challenge may be a literature review without a central argument, a dataset without a defensible analysis plan, or a manuscript whose contribution is not yet clear."}</p><p className="mt-5 leading-7 text-muted-foreground">{page?.explanation || "ResearchReady supports PhD and Master's researchers, academics, professionals and organisations through methodology, evidence synthesis, analysis, interpretation and refinement."}</p></div><div className="border-l-2 border-accent pl-7"><p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">How we approach it</p><ol className="mt-7 space-y-7">{stages.map((step, index) => <li key={step} className="flex gap-4"><span className="font-playfair text-xl text-accent">0{index + 1}</span><span className="border-b border-border pb-5 font-medium">{step}</span></li>)}</ol></div></div></section>
      <section className="border-y border-border bg-secondary py-12"><div className="container grid gap-8 md:grid-cols-3">{["Method-led support", "Evidence before claims", "A scope built for the project"].map((item) => <div key={item} className="flex items-start gap-3"><Check className="mt-1 h-5 w-5 shrink-0 text-accent" /><span className="font-playfair text-lg text-primary">{item}</span></div>)}</div></section>
      <section id="enquiry" className="scroll-mt-8 py-16 lg:py-24"><div className="container grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Research assessment</p><h2 className="section-title">Tell us what you're working on.</h2><p className="mt-5 leading-7 text-muted-foreground">Share the research question, current stage, difficulty and deadline. We will assess what kind of support is appropriate and define the next step.</p><p className="mt-6 border-l-2 border-accent pl-4 text-sm leading-6 text-muted-foreground">Projects are scoped according to their requirements. Please describe the problem in enough detail for a meaningful assessment.</p>{page && <div className="mt-9 space-y-3 text-sm"><Link className="block font-semibold text-primary underline" to={`/services/${page.serviceSlug}`}>Explore {page.service} support</Link><Link className="block font-semibold text-primary underline" to={`/insights/${page.noteSlug}`}>Read the related research note</Link></div>}</div><ConsultationForm source={source} /></div></section>
    </main>
    <footer className="border-t border-border py-7"><div className="container flex flex-col justify-between gap-3 text-sm text-muted-foreground sm:flex-row"><span>© {new Date().getFullYear()} ResearchReady Services</span><div className="flex gap-5"><Link to="/privacy">Privacy</Link><Link to="/services">Research services</Link></div></div></footer>
  </div>;
};
export default WorkWithUs;