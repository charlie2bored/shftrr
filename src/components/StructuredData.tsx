import { Metadata } from "next";

interface StructuredDataProps {
  type: 'WebSite' | 'SoftwareApplication' | 'Organization';
  data: Record<string, any>;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  );
}

// Predefined structured data components
export function WebSiteStructuredData() {
  return (
    <StructuredData
      type="WebSite"
      data={{
        name: "Career Pivot Coach",
        description: "AI-powered career coaching and pivot planning platform",
        url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  );
}

export function SoftwareApplicationStructuredData() {
  return (
    <StructuredData
      type="SoftwareApplication"
      data={{
        name: "Career Pivot Coach",
        description: "AI-powered career coaching application for professional development and career transitions",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web Browser",
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        author: {
          '@type': 'Organization',
          name: 'Career Pivot Coach Team',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '1250',
        },
      }}
    />
  );
}

export function OrganizationStructuredData() {
  return (
    <StructuredData
      type="Organization"
      data={{
        name: "Career Pivot Coach",
        description: "AI-powered career coaching platform helping professionals navigate career transitions",
        url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
        logo: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/logo.png`,
        sameAs: [
          "https://twitter.com/careerpivotcoach",
          "https://linkedin.com/company/career-pivot-coach",
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: 'support@careerpivotcoach.com',
        },
      }}
    />
  );
}
