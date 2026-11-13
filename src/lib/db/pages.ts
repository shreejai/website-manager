import { pagesCollection, type PageRecord } from "./collections";

export type PageSummary = Pick<PageRecord, "path" | "title" | "updatedAt">;

export async function getPage(
  siteSlug: string,
  path: string,
): Promise<PageRecord | null> {
  const pages = await pagesCollection();
  return pages.findOne<PageRecord>(
    { siteSlug, path },
    { projection: { _id: 0 } },
  );
}

export async function listPages(siteSlug: string): Promise<PageSummary[]> {
  const pages = await pagesCollection();
  return pages
    .find<PageSummary>(
      { siteSlug },
      { projection: { _id: 0, path: 1, title: 1, updatedAt: 1 } },
    )
    .sort({ path: 1 })
    .toArray();
}
