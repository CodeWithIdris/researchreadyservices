import { BarChart3, BookOpen, Braces, FileText } from "lucide-react";

const ResearchWorkspace = () => (
  <div className="relative min-h-[380px] border border-primary/20 bg-card p-5 shadow-xl lg:min-h-[470px]" aria-label="Research workspace showing papers, notes and analysis">
    <div className="flex items-center justify-between border-b border-border pb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
      <span>Research workspace</span><span>Evidence → argument</span>
    </div>
    <div className="mt-5 grid grid-cols-[1.4fr_1fr] gap-4">
      <div className="space-y-4">
        <div className="border border-border bg-background p-4">
          <div className="flex items-center gap-2 text-sm font-semibold"><BookOpen className="h-4 w-4 text-accent" /> Literature map</div>
          <div className="mt-4 space-y-3">
            {["Conceptual tension", "Methodological pattern", "Unresolved question"].map((label, index) => (
              <div key={label} className="grid grid-cols-[auto_1fr] items-center gap-3"><span className="font-playfair text-lg text-accent">0{index + 1}</span><div><p className="text-xs font-medium">{label}</p><div className="mt-1 h-1.5 bg-muted"><div className="h-full bg-primary" style={{ width: `${78 - index * 14}%` }} /></div></div></div>
            ))}
          </div>
        </div>
        <div className="border border-border bg-primary p-4 text-primary-foreground">
          <div className="flex items-center gap-2 text-sm font-semibold"><Braces className="h-4 w-4 text-accent" /> Method decision</div>
          <p className="mt-3 font-playfair text-xl leading-snug">Does the analysis answer the question the study is actually asking?</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="border border-border bg-secondary p-4">
          <BarChart3 className="h-5 w-5 text-primary" />
          <div className="mt-5 flex h-24 items-end gap-2">
            {[42, 68, 55, 88, 72].map((height, index) => <div key={index} className="flex-1 bg-primary" style={{ height: `${height}%` }} />)}
          </div>
          <p className="mt-3 text-xs font-medium text-muted-foreground">Interpretation, not output alone</p>
        </div>
        <div className="border border-border bg-background p-4">
          <FileText className="h-5 w-5 text-accent" />
          <p className="mt-3 text-sm font-semibold">Working synthesis</p>
          <div className="mt-3 space-y-2"><div className="h-1.5 bg-muted" /><div className="h-1.5 w-4/5 bg-muted" /><div className="h-1.5 w-3/5 bg-muted" /></div>
        </div>
      </div>
    </div>
    <div className="absolute -bottom-4 -left-4 border border-accent bg-background px-4 py-3 text-xs font-semibold uppercase tracking-widest text-primary shadow-lg">Structured expertise</div>
  </div>
);

export default ResearchWorkspace;