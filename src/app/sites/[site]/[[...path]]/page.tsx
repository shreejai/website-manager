import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getPage } from "@/lib/db/pages";
import { getSiteBySlug } from "@/lib/db/sites";
import { toPagePath } from "@/lib/page/path";
import { RenderPage } from "@/renderer/RenderNode";
import { SiteHeader } from "@/renderer/SiteHeader";
import { SiteThemeScope } from "@/renderer/SiteThemeScope";

type Params = Promise<{ site: string; path?: string[] }>;

// cache() dedupes the DB calls between generateMetadata and the page
// within a single request.
const loadSiteAndPage = cache(async (siteSlug: string, path: string) => {
  const site = await getSiteBySlug(siteSlug);
  if (!site) return null;
  const page = await getPage(siteSlug, path);
  if (!page) return null;
  return { site, page };
});

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { site, path } = await params;
  const data = await loadSiteAndPage(site, toPagePath(path));
  return {
    title: data ? `${data.page.title} | ${data.site.name}` : "Not found",
  };
}

export default async function SitePage({ params }: { params: Params }) {
  const { site: siteSlug, path } = await params;
  const data = await loadSiteAndPage(siteSlug, toPagePath(path));

  if (!data) notFound(); // unknown site OR unknown path → 404

  const { site, page } = data;

  return (
    <SiteThemeScope theme={site.theme}>
      <SiteHeader site={site} />
      <main>
        <RenderPage nodes={page.root} />
      </main>
    </SiteThemeScope>
  );
}
