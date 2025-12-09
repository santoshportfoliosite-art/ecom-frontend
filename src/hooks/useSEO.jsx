import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

export default function useSEO(page) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [seo, setSEO] = useState(null);

  useEffect(() => {
    let mounted = true;

    fetch(`${backendUrl}/api/seo/page/${encodeURIComponent(page)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (data && data.page) {
          setSEO(data);
        } else {
          console.warn("SEO not found for page:", page);
        }
      })
      .catch((err) => console.error("SEO fetch failed:", err));

    return () => { mounted = false };
  }, [page]);

  if (!seo) return null;

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:url" content={seo.url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
    </Helmet>
  );
}
