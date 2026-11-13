import { pages } from "@/fixtures/pages";
import { sites } from "@/fixtures/sites";
import { closeDb } from "@/lib/db/client";
import {
  ensureIndexes,
  pagesCollection,
  sitesCollection,
} from "@/lib/db/collections";

async function main() {
  await ensureIndexes();

  // Upsert = safe to re-run. Pages created in the manager are left alone;
  // seeded pages are reset to their original content.
  const sitesCol = await sitesCollection();
  for (const site of sites) {
    await sitesCol.replaceOne({ slug: site.slug }, site, { upsert: true });
  }

  const pagesCol = await pagesCollection();
  const now = new Date();
  for (const page of pages) {
    await pagesCol.replaceOne(
      { siteSlug: page.siteSlug, path: page.path },
      { ...page, createdAt: now, updatedAt: now },
      { upsert: true },
    );
  }

  console.log(`✅ Seeded ${sites.length} sites and ${pages.length} pages`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(closeDb);
