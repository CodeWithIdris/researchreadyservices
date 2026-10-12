import researchEditorial from "@/assets/research-editorial.jpg";

const ResearchWorkspace = () => (
  <figure className="group relative overflow-hidden border-l border-border bg-secondary">
    <img src={researchEditorial} alt="Layered research reports with statistical charts and evidence visualisations" width={1024} height={1280} fetchPriority="high" className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.025] lg:aspect-auto lg:h-[570px]" />
    <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-border bg-card/95 px-6 py-5 text-[0.65rem] font-semibold uppercase tracking-wider text-primary">
      <span>Evidence. Method. Interpretation.</span><span className="text-accent">ResearchReady</span>
    </figcaption>
  </figure>
);

export default ResearchWorkspace;