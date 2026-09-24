import { Helmet } from "react-helmet-async";
import { SITE_URL } from "@/lib/siteConfig";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  type?: string;
  schema?: object | object[];
  noindex?: boolean;
}

const SEOHead = ({
  title = "ResearchReady — Professional Research Support & Consulting",
  description = "Structured research support for dissertations, literature reviews, methodology, data analysis, publishing and professional research projects.",
  keywords = "research support, research consulting, dissertation support, literature review, data analysis, academic publishing",
  url = `${SITE_URL}/`,
  type = "website",
  schema,
  noindex = false,
}: SEOHeadProps) => {
  const fullTitle = title.includes("ResearchReady")
    ? title
    : `${title} | ResearchReady`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="ResearchReady Services" />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <meta name="language" content="English" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="ResearchReady" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:site" content="@_researchready" />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      
      {/* Custom Schema (FAQ, Article, etc.) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
      
    </Helmet>
  );
};

export default SEOHead;
