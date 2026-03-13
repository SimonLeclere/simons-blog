const publicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const vercelPreviewUrl = process.env.VERCEL_URL;

let computedSiteUrl = "http://localhost:3000";
if (vercelPreviewUrl) {
  computedSiteUrl = `https://${vercelPreviewUrl}`;
}
if (vercelProductionUrl) {
  computedSiteUrl = `https://${vercelProductionUrl}`;
}

export const siteURL = publicSiteUrl || computedSiteUrl;
