export interface InsightSection { heading: string; paragraphs: string[]; }
export interface Insight { slug: string; title: string; category: string; readingTime: string; date: string; author: string; excerpt: string; relatedServices: string[]; sections: InsightSection[]; }

export const insights: Insight[] = [
  {
    slug: "more-papers-less-argument", title: "The more papers you read, the easier it becomes to lose your argument.", category: "Literature Reviews", readingTime: "6 min read", date: "20 September 2026", author: "ResearchReady Editorial", excerpt: "The problem is rarely the number of papers. It is whether the evidence is being organised around a clear intellectual question.", relatedServices: ["literature-review-services", "phd-dissertation-support"],
    sections: [
      { heading: "Reading is not the same as synthesising", paragraphs: ["A long bibliography can show effort without producing clarity. Synthesis begins when papers stop being isolated summaries and become evidence in a structured conversation.", "The useful unit is not the individual paper. It is the claim, disagreement, pattern or unresolved question that connects several papers."] },
      { heading: "Build around the argument", paragraphs: ["Start with the question your review must clarify. Record how each source changes that question: what it supports, complicates, contradicts or leaves open.", "A literature map organised around themes, methods and tensions makes it easier to see where your research belongs."] },
      { heading: "Know what the review must reveal", paragraphs: ["A strong review explains what is known, how it became known, where evidence conflicts and why the remaining uncertainty matters. More references help only when they sharpen one of those functions."] },
    ],
  },
  {
    slug: "systematic-review-before-first-paper", title: "A systematic review can go wrong before you read a single paper.", category: "Systematic Reviews", readingTime: "7 min read", date: "20 September 2026", author: "ResearchReady Editorial", excerpt: "Weak questions, inconsistent eligibility criteria and an incomplete search strategy can compromise the review before screening begins.", relatedServices: ["systematic-review-support", "scoping-review-support"],
    sections: [
      { heading: "The protocol is analytical work", paragraphs: ["A protocol is not administrative paperwork. It forces decisions about the population, concept, context, outcomes and evidence needed to answer the review question.", "When those decisions remain vague, reviewers make them repeatedly during screening, often inconsistently."] },
      { heading: "Search strategy shapes the evidence", paragraphs: ["Database selection, synonyms, subject headings and date or language limits determine what can enter the review. Transparent searches make those boundaries visible and reproducible."] },
      { heading: "Plan extraction and synthesis early", paragraphs: ["Extraction fields should be designed around the analysis the review will eventually perform. If the synthesis plan is unclear, teams often collect either too little data or large amounts they never use."] },
    ],
  },
  {
    slug: "software-answer-without-meaning", title: "Your statistical software can give you an answer without telling you what it means.", category: "Data Analysis", readingTime: "6 min read", date: "20 September 2026", author: "ResearchReady Editorial", excerpt: "Output is not interpretation. The meaning of a result depends on the question, assumptions, design and evidence around it.", relatedServices: ["spss-data-analysis", "r-statistical-analysis", "stata-data-analysis"],
    sections: [
      { heading: "The test follows the question", paragraphs: ["Software makes it easy to run many analyses. It does not decide which one represents the variables, design and hypothesis appropriately.", "Test selection begins with what the research question asks you to estimate, compare or explain."] },
      { heading: "Assumptions are part of the result", paragraphs: ["A coefficient or p-value is not meaningful in isolation from data quality, model assumptions, uncertainty and practical context. Diagnostics are not a formality after the analysis; they are part of judging the answer."] },
      { heading: "Interpretation returns to the research problem", paragraphs: ["The final task is to explain what the pattern means, what it does not establish, and how it relates to the wider evidence. That is where statistical output becomes research insight."] },
    ],
  },
  {
    slug: "twenty-more-references", title: "Adding another 20 references won't necessarily make your paper stronger.", category: "Academic Writing", readingTime: "5 min read", date: "20 September 2026", author: "ResearchReady Editorial", excerpt: "References strengthen a paper when they do specific intellectual work, not when they simply increase density.", relatedServices: ["academic-manuscript-support", "masters-thesis-support"],
    sections: [
      { heading: "Every citation needs a function", paragraphs: ["A citation may establish context, support a claim, introduce a method or reveal disagreement. When its function is unclear, it usually adds weight without direction."] },
      { heading: "Select evidence, do not catalogue it", paragraphs: ["Strong academic writing chooses the evidence needed for the argument and explains the relationship between sources. It does not attempt to display everything the researcher has read."] },
      { heading: "Clarity is a form of rigour", paragraphs: ["A reader should be able to follow why each body of evidence appears and how it changes the argument. Strategic omission can therefore be as important as adding another source."] },
    ],
  },
  {
    slug: "analysing-versus-understanding-data", title: "There is a difference between analysing data and understanding it.", category: "Data Analysis", readingTime: "6 min read", date: "20 September 2026", author: "ResearchReady Editorial", excerpt: "Analysis transforms data. Understanding connects that transformation to the question, context and limits of the study.", relatedServices: ["research-consulting", "spss-data-analysis"],
    sections: [
      { heading: "Analysis produces a pattern", paragraphs: ["Tables, themes and models organise information into a result. That result becomes useful only when the researcher can explain what produced it and why it matters."] },
      { heading: "Context prevents overclaiming", paragraphs: ["Sample, measurement, design and missing information all shape what a result can support. Understanding means being as clear about those limits as about the finding itself."] },
      { heading: "Meaning is built through comparison", paragraphs: ["Interpretation connects the result to theory, prior evidence and the original research purpose. It explains whether the study confirms, complicates or changes what was previously understood."] },
    ],
  },
];

export const insightCategories = ["Research Methodology", "Literature Reviews", "Data Analysis", "Academic Writing", "Publishing", "Systematic Reviews", "PhD Research", "Professional Research"];
export const getInsight = (slug?: string) => insights.find((insight) => insight.slug === slug);