import { MongoServerError } from "mongodb";
import { PageNode } from "@/lib/page/types";
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

export async function createPage(input: {
  siteSlug: string;
  path: string;
  title: string;
}): Promise<{ ok: true } | { ok: false; reason: "exists" }> {
  const pages = await pagesCollection();
  const now = new Date();
  try {
    await pages.insertOne({
      ...input,
      root: [],
      createdAt: now,
      updatedAt: now,
    });
    return { ok: true };
  } catch (error) {
    // 11000 = duplicate key: our unique (siteSlug, path) index caught it
    if (error instanceof MongoServerError && error.code === 11000) {
      return { ok: false, reason: "exists" };
    }
    throw error;
  }
}

export async function savePage(
  siteSlug: string,
  path: string,
  update: { title: string; root: PageNode[] },
): Promise<boolean> {
  const pages = await pagesCollection();
  const result = await pages.updateOne(
    { siteSlug, path },
    { $set: { ...update, updatedAt: new Date() } },
  );
  return result.matchedCount === 1;
}
