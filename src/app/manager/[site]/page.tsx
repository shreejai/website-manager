import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listPages } from "@/lib/db/pages";
import { getSiteBySlug } from "@/lib/db/sites";
import { NewPageForm } from "@/manager/NewPageForm";

export default async function SitePagesPage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site: siteSlug } = await params;
  const site = await getSiteBySlug(siteSlug);
  if (!site) notFound();

  const pages = await listPages(siteSlug);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
      <div>
        <Link
          href="/manager"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← All sites
        </Link>
        <h1 className="mt-2 text-2xl font-bold">{site.name}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {pages.map((page) => (
              <li key={page.path} className="flex items-center gap-4 py-3">
                <div className="flex-1">
                  <p className="font-medium">{page.title}</p>
                  <p className="text-xs text-muted-foreground">
                    <code>{page.path}</code> · updated{" "}
                    {page.updatedAt.toLocaleString("en-AU")}
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <a
                    href={`/sites/${site.slug}${page.path === "/" ? "" : page.path}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View ↗
                  </a>
                </Button>
                <Button asChild size="sm">
                  <Link
                    href={`/manager/${site.slug}/edit?path=${encodeURIComponent(page.path)}`}
                  >
                    Edit
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>New page</CardTitle>
        </CardHeader>
        <CardContent>
          <NewPageForm siteSlug={site.slug} />
        </CardContent>
      </Card>
    </main>
  );
}
