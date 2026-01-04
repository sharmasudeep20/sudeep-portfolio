import { Helmet } from "react-helmet-async";

const SITE_NAME = "Sudeep Sharma";
const DEFAULT_DESCRIPTION =
  "Portfolio of Sudeep Sharma, showcasing data engineering, software development, and cloud projects.";

export default function Seo({ title, description = DEFAULT_DESCRIPTION, path = "" }) {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const url =
    typeof window !== "undefined" ? `${window.location.origin}${path}` : undefined;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      {url ? <meta property="og:url" content={url} /> : null}
      <meta property="og:type" content="website" />
    </Helmet>
  );
}
