import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  schema?: object | object[];
  noindex?: boolean;
}

const SEOHead = ({
  title = "Research Ready Services - Academic Writing & Research Experts",
  description = "Professional academic writing services. Expert dissertation, thesis, and literature review support trusted by 10,000+ researchers across Africa.",
  keywords = "academic writing, dissertation help, thesis editing, literature review, research analysis, academic research services, Nigeria, Africa, professional writing",
  image = "/og-image.png",
  url = "https://researchready.com",
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

      {/* Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Research Ready Services",
          alternateName: "ResearchReady",
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
        })}
      </script>

      {/* Service Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Academic Writing Services",
          provider: {
            "@type": "Organization",
            name: "Research Ready Services",
          },
          areaServed: {
            "@type": "GeoCircle",
            geoMidpoint: {
              "@type": "GeoCoordinates",
              latitude: 9.082,
              longitude: 8.6753,
            },
            geoRadius: "5000",
          },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Academic Services",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Dissertation Writing",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Thesis Editing",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Literature Review",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Research Analysis",
                },
              },
            ],
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            reviewCount: "5000",
          },
        })}
      </script>
      
      {/* Custom Schema (FAQ, Article, etc.) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
      
      {/* Noindex for pages that shouldn't be indexed */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
};

export default SEOHead;
