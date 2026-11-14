import { notFound } from "next/navigation";
import { getPage } from "@/lib/db/pages";
import { getSiteBySlug } from "@/lib/db/sites";
import { PageEditor } from "@/manager/PageEditor";

type Props = {
  params: Promise<{ site: string }>;
  searchParams: Promise<{ path?: string }>;
};

export default async function EditPage({ params, searchParams }: Props) {
  const { site: siteSlug } = await params;
  const { path = "/" } = await searchParams;

  const site = await getSiteBySlug(siteSlug);
  if (!site) notFound();

  const page = await getPage(siteSlug, path);
  if (!page) notFound();

  // Pass only plain JSON to the client component (no Dates / ObjectIds).
  return (
    <PageEditor
      site={site}
      page={{ path: page.path, title: page.title, root: page.root }}
    />
  );
}
