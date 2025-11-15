import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO = ({
  title = "Hayat Foods - Premium Bakery Products | Fresh Chapati, Buns, Bread in Kannur, Kerala",
  description = "Hayat Foods - Leading bakery manufacturer in Kannur, Kerala. Premium fresh bakery products including chapati, cream bun, baby chocolate bun, bread, and rusk. Hayat Foods delivers quality baked goods throughout Kannur district.",
  keywords = "hayat foods, hayat foods india, hayat foods kannur, hayat foods kerala, bakery products kannur, fresh chapati kannur, cream bun kannur, bread kannur, rusk kannur, bakery manufacturer kerala, fresh bakery products, kannur bakery, hayat foods bakery, hayat foods products",
  image = "https://vyshnav17.github.io/hayat-foodies-landing/logo.png",
  url = "https://vyshnav17.github.io/hayat-foodies-landing/",
  type = "website",
}: SEOProps) => {
  const fullTitle = title.includes("Hayat Foods") ? title : `Hayat Foods - ${title}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Hayat Foods" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;

