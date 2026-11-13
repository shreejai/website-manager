import type { Site } from "@/lib/site/types";
import { sitesCollection } from "./collections";

export async function getSiteBySlug(slug: string): Promise<Site | null> {
  const sites = await sitesCollection();
  return sites.findOne<Site>({ slug }, { projection: { _id: 0 } });
}

export async function listSites(): Promise<Site[]> {
  const sites = await sitesCollection();
  return sites
    .find<Site>({}, { projection: { _id: 0 } })
    .sort({ name: 1 })
    .toArray();
}
