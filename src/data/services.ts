export interface ServicePage {
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  summary: string;
  problem: string;
  capabilities: string[];
  keywords: string;
}

export const serviceGroups = [
  {
    title: "Research & Dissertation Support",
    description: "Structured support from research question and design through synthesis, methodology, interpretation and refinement.",
    services: ["PhD Dissertation Support", "Master's Thesis Support", "Research Proposal Development", "Research Methodology", "Literature Review", "Systematic Review", "Scoping Review", "Research Design"],
    slug: "phd-dissertation-support",
  },
  {
    title: "Data & Analytics",
    description: "Analysis that connects the statistical method, the research question and the meaning of the result.",
    services: ["SPSS", "R", "STATA", "Excel", "Statistical Analysis", "Data Cleaning", "Data Interpretation", "Results Presentation"],
    slug: "spss-data-analysis",
  },
  {
    title: "Academic Publishing",
    description: "Manuscript and conference support focused on argument, structure, reporting clarity and publication readiness.",
    services: ["Journal Manuscripts", "Conference Papers", "Manuscript Editing", "Publication Preparation", "Academic Editing", "Referencing & Citation Management"],
    slug: "academic-manuscript-support",
  },
  {
    title: "Professional Research",
    description: "Evidence-led research for decisions, feasibility, proposals, reports and organisational questions.",
    services: ["Research Reports", "Feasibility Studies", "Business Research", "Grant Proposals", "Evidence Synthesis", "Data-driven Consulting"],
    slug: "professional-research-services",
  },
];

export const services: ServicePage[] = [
  { slug: "phd-dissertation-support", title: "PhD Dissertation Support", shortTitle: "PhD Research", category: "Research & Dissertation Support", summary: "Structured support for the decisions, analysis and refinement that make doctoral research defensible.", problem: "At some point, a PhD stops being about finding more information.", capabilities: ["Research problem refinement", "Literature synthesis", "Methodology review", "Analysis and interpretation", "Chapter development", "Defence preparation"], keywords: "PhD dissertation support, doctoral research methodology, dissertation data analysis" },
  { slug: "masters-thesis-support", title: "Master's Thesis Support", shortTitle: "Master's Research", category: "Research & Dissertation Support", summary: "Focused support for thesis development, methodology, literature review, analysis and academic refinement.", problem: "A clear thesis depends on more than collecting enough material.", capabilities: ["Research question development", "Proposal refinement", "Literature review", "Method selection", "Data interpretation", "Academic editing"], keywords: "Master's thesis support, thesis methodology, thesis data analysis" },
  { slug: "research-methodology-support", title: "Research Methodology Support", shortTitle: "Research Methodology", category: "Research & Dissertation Support", summary: "Align the question, design, sampling, measurement and analysis so the study can answer what it claims to ask.", problem: "A method can be technically correct and still be wrong for the research question.", capabilities: ["Research design", "Sampling strategy", "Instrument development", "Validity and reliability", "Qualitative approaches", "Quantitative approaches"], keywords: "research methodology support, research design consulting, methodology review" },
  { slug: "literature-review-services", title: "Literature Review Support", shortTitle: "Literature Reviews", category: "Research & Dissertation Support", summary: "Move from accumulating sources to constructing a clear, critical and defensible argument.", problem: "The more papers you read, the easier it becomes to lose your argument.", capabilities: ["Search planning", "Thematic synthesis", "Critical comparison", "Gap identification", "Conceptual mapping", "Argument structure"], keywords: "literature review services, literature synthesis, critical literature review" },
  { slug: "systematic-review-support", title: "Systematic Review Support", shortTitle: "Systematic Reviews", category: "Academic Publishing", summary: "Transparent support across protocol, search, screening, extraction, appraisal, synthesis and reporting.", problem: "A systematic review can go wrong before you read a single paper.", capabilities: ["Protocol development", "Eligibility criteria", "Search strategy", "Screening workflow", "Quality appraisal", "Transparent reporting"], keywords: "systematic review support, evidence synthesis, review protocol" },
  { slug: "scoping-review-support", title: "Scoping Review Support", shortTitle: "Scoping Reviews", category: "Academic Publishing", summary: "Map a field systematically, clarify concepts and identify the shape and limits of available evidence.", problem: "Before narrowing the answer, a scoping review must define the territory.", capabilities: ["Question framing", "Database strategy", "Evidence mapping", "Charting forms", "Descriptive synthesis", "PRISMA-ScR reporting"], keywords: "scoping review support, evidence mapping, PRISMA ScR" },
  { slug: "spss-data-analysis", title: "SPSS Data Analysis", shortTitle: "SPSS Analysis", category: "Data & Analytics", summary: "Select, run and interpret analyses in relation to the research question rather than software output alone.", problem: "SPSS can produce a result without explaining whether it answers your question.", capabilities: ["Data preparation", "Descriptive statistics", "Regression", "Correlation", "ANOVA", "Results interpretation"], keywords: "SPSS data analysis, statistical analysis support, SPSS interpretation" },
  { slug: "r-statistical-analysis", title: "R Statistical Analysis", shortTitle: "R Analysis", category: "Data & Analytics", summary: "Reproducible statistical analysis, visualisation and interpretation for complex research questions.", problem: "A reproducible script is useful only when the analytical decisions behind it are defensible.", capabilities: ["Data cleaning", "Statistical modelling", "Regression", "Reproducible workflows", "Visualisation", "Interpretation"], keywords: "R statistical analysis, R data analysis support, research statistics" },
  { slug: "stata-data-analysis", title: "STATA Data Analysis", shortTitle: "STATA Analysis", category: "Data & Analytics", summary: "Method-led STATA support for applied, panel, survey and econometric research.", problem: "The command that runs is not always the model the evidence requires.", capabilities: ["Data management", "Regression models", "Panel data", "Survey analysis", "Diagnostic testing", "Results tables"], keywords: "STATA data analysis, econometric analysis, STATA research support" },
  { slug: "academic-manuscript-support", title: "Academic Manuscript Support", shortTitle: "Journal Manuscripts", category: "Academic Publishing", summary: "Refine the argument, structure, reporting and presentation of research for journal submission.", problem: "Finishing the research and preparing the manuscript are different intellectual tasks.", capabilities: ["Argument refinement", "Manuscript structure", "Methods reporting", "Results presentation", "Academic editing", "Submission preparation"], keywords: "academic manuscript support, journal manuscript editing, publication preparation" },
  { slug: "conference-paper-support", title: "Conference Paper Support", shortTitle: "Conference Papers", category: "Academic Publishing", summary: "Shape completed or ongoing research into a focused conference paper and presentation narrative.", problem: "A conference paper cannot carry every argument from the full study.", capabilities: ["Scope refinement", "Abstract development", "Paper structure", "Evidence selection", "Presentation narrative", "Academic editing"], keywords: "conference paper support, conference abstract, research presentation" },
  { slug: "research-consulting", title: "Research Consulting", shortTitle: "Research Consulting", category: "Professional Research", summary: "Methodological and analytical guidance for complex academic, professional and organisational research.", problem: "Sometimes the most valuable research decision is identifying what not to do next.", capabilities: ["Problem definition", "Research strategy", "Method selection", "Evidence assessment", "Analytical review", "Decision support"], keywords: "research consulting, research consultant, methodological consulting" },
  { slug: "professional-research-services", title: "Professional Research Services", shortTitle: "Professional Research", category: "Professional Research", summary: "Evidence-led reports, feasibility work, business research and proposals for organisations and professionals.", problem: "Research isn't only an academic exercise.", capabilities: ["Research reports", "Feasibility studies", "Market evidence", "Programme evaluation", "Grant proposals", "Decision support"], keywords: "professional research services, feasibility research, business research consulting" },
];

export const getService = (slug?: string) => services.find((service) => service.slug === slug);