import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEOHead = ({
  title = "ResearchReady - Professional Academic Research & Writing Services",
  description = "Expert academic writing, dissertation support, literature reviews, and thesis editing services. Trusted by 10,000+ researchers across Africa. Get professional research assistance today.",
  keywords = "academic writing, dissertation help, thesis editing, literature review, research analysis, academic research services, Nigeria, Africa, professional writing",
  image = "/og-image.png",
  url = "https://researchready.com",
  type = "website",
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
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="ResearchReady" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@_researchready" />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "ResearchReady",
          description: description,
          url: url,
          logo: `${url}/logo.png`,
          foundingDate: "2014",
          address: {
            "@type": "PostalAddress",
            addressCountry: "NG",
          },
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+234-902-228-2963",
            contactType: "customer service",
            email: "researchreadyservices@gmail.com",
            availableLanguage: "English",
          },
          sameAs: [
            "https://web.facebook.com/profile.php?id=61577783386641",
            "https://www.instagram.com/researchready_services/",
            "https://x.com/_researchready",
          ],
          areaServed: {
            "@type": "GeoCircle",
            geoMidpoint: {
              "@type": "GeoCoordinates",
              latitude: 9.082,
              longitude: 8.6753,
            },
            geoRadius: "5000",
          },
          priceRange: "$$",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            reviewCount: "5000",
          },
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;
