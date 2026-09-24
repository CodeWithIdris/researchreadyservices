import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import InsightCard from "@/components/research/InsightCard";
import { insights, insightCategories } from "@/data/insights";
import { SITE_URL } from "@/lib/siteConfig";

const Insights = () => <div className="min-h-screen bg-background"><SEOHead title="Research Insights" description="Research notes on methodology, literature reviews, data analysis, academic publishing and professional research." url={`${SITE_URL}/insights`} /><Header /><main className="pt-20"><section className="border-b border-border py-16 lg:py-24"><div className="container max-w-5xl"><p className="eyebrow">Research Insights</p><h1 className="font-playfair text-4xl leading-tight text-primary sm:text-5xl">Notes for thinking more clearly about difficult research.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">Short, practical perspectives on the choices that shape credible academic and professional research.</p><div className="mt-8 flex flex-wrap gap-2">{insightCategories.map((category) => <span key={category} className="border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground">{category}</span>)}</div></div></section><section className="py-12 lg:py-20"><div className="container grid gap-x-12 md:grid-cols-2">{insights.map((insight) => <InsightCard insight={insight} key={insight.slug} />)}</div></section></main><Footer /></div>;
export default Insights;