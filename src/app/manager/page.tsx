import Link from "next/link";
import { listSites } from "@/lib/db/sites";

export default async function ManagerHome() {
  const sites = await listSites();

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-bold">Website Manager</h1>
      <p className="mt-1 text-muted-foreground">
        Choose a site to edit its pages.
      </p>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {sites.map((site) => (
          <li key={site.slug}>
            <Link
              href={`/manager/${site.slug}`}
              className="flex items-center gap-3 rounded-lg border p-4 transition hover:bg-muted"
            >
              <span
                className="h-8 w-8 rounded"
                style={{ background: site.theme.colors.brand }}
              />
              <span className="font-medium">{site.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
