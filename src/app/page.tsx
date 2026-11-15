import Link from "next/link";
import { listSites } from "@/lib/db/sites";
import { connection } from "next/server";

export default async function Home() {
  await connection(); // render per request, not at build time
  const sites = await listSites();

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold">Website Manager</h1>

      <h2 className="mt-8 font-semibold">Public sites</h2>
      <ul className="mt-2 list-disc pl-6">
        {sites.map((site) => (
          <li key={site.slug}>
            <Link href={`/sites/${site.slug}`} className="underline">
              {site.name}
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-8 font-semibold">Editor</h2>
      <ul className="mt-2 list-disc pl-6">
        <li>
          <Link href="/manager" className="underline">
            Manager
          </Link>{" "}
          (coming in Phase 5)
        </li>
      </ul>
    </main>
  );
}
