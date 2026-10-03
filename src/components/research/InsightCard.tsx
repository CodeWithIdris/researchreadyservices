import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Insight } from "@/data/insights";

const InsightCard = ({ insight }: { insight: Insight }) => (
  <article className="group border-t border-border py-7">
    <div className="mb-4 flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground"><span>{insight.category}</span><span>·</span><span>{insight.readingTime}</span></div>
    <h3 className="font-playfair text-xl leading-snug text-primary sm:text-2xl"><Link to={`/insights/${insight.slug}`} className="hover:text-accent">{insight.title}</Link></h3>
    <p className="mt-3 text-sm leading-6 text-muted-foreground">{insight.excerpt}</p>
    <Link to={`/insights/${insight.slug}`} className="mt-5 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary">Read research note <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>
  </article>
);

export default InsightCard;