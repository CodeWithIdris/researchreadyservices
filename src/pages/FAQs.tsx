import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { consultationUrl, SITE_URL } from "@/lib/siteConfig";

const faqs = [
  { question: "What kind of research support do you provide?", answer: "We support research design, methodology, literature synthesis, systematic and scoping reviews, statistical analysis, data interpretation, dissertations, manuscripts, conference papers and professional research projects." },
  { question: "How does a research enquiry work?", answer: "Tell us about your research question, current stage, deadline and the difficulty you are facing. We assess the requirement and define what support is appropriate before agreeing on a scope." },
  { question: "Can you help with a PhD or Master's project?", answer: "Yes. Support can focus on narrowing the research problem, reviewing methodology, synthesising literature, selecting and interpreting analysis, and refining scholarly communication. Your work remains your responsibility." },
  { question: "Do you offer statistical analysis support?", answer: "We support method selection, data preparation, analysis in SPSS, R, STATA and Excel, diagnostics, results presentation and interpretation in relation to the research question." },
  { question: "Can I share a document securely?", answer: "The research enquiry form accepts a relevant PDF, Word, Excel, CSV or text document up to 10 MB. Documents are stored privately and are available to authorised staff for assessment." },
  { question: "How is a project priced?", answer: "Projects are scoped according to their requirements, complexity, timeline and type of support. Share the research problem for an assessment rather than assuming a standard price for complex work." },
  { question: "Do you guarantee publication or approval?", answer: "No. ResearchReady offers structured support and refinement, not guaranteed academic or publication outcomes. All support should be used consistently with your institution's academic integrity rules." },
];
const FAQs = () => <div className="min-h-screen bg-background"><SEOHead title="Research Support Questions" description="Answers about ResearchReady's methodology, literature review, data analysis, enquiry and consultation process." url={`${SITE_URL}/faqs`} /><Header /><main className="pt-24 pb-20"><div className="container max-w-4xl"><p className="eyebrow">Common questions</p><h1 className="font-playfair text-4xl text-primary sm:text-5xl">Before we begin.</h1><Accordion type="single" collapsible className="mt-10 border-t border-border">{faqs.map((faq, index) => <AccordionItem value={`faq-${index}`} key={faq.question}><AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger><AccordionContent className="leading-7 text-muted-foreground">{faq.answer}</AccordionContent></AccordionItem>)}</Accordion><Button className="mt-10" variant="gold" asChild><Link to={consultationUrl()}>Discuss Your Research</Link></Button></div></main><Footer /></div>;
export default FAQs;