import type { PageDocument } from "@/lib/page/types";
import type { Site } from "@/lib/site/types";
import { getDb } from "./client";

/** A page as stored in Mongo: the portable JSON plus timestamps. */
export type PageRecord = PageDocument & {
  createdAt: Date;
  updatedAt: Date;
};

export async function sitesCollection() {
  const db = await getDb();
  return db.collection<Site>("sites");
}

export async function pagesCollection() {
  const db = await getDb();
  return db.collection<PageRecord>("pages");
}
/**
 * Indexes that matter at 30+ sites:
 * - a site is looked up by slug on every request
 * - a page is looked up by (site, path) on every request, and must be unique
 */
export async function ensureIndexes() {
  const sites = await sitesCollection();
  await sites.createIndexes([
    { key: { slug: 1 }, name: "slug_unique", unique: true },
  ]);

  const pages = await pagesCollection();
  await pages.createIndexes([
    { key: { siteSlug: 1, path: 1 }, name: "site_path_unique", unique: true },
  ]);
}
