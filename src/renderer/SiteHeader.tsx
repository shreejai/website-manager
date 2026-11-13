import Link from "next/link";
import type { Site } from "@/lib/site/types";

export function SiteHeader({ site }: { site: Site }) {
  return (
    <header className="border-b border-black/10 bg-site-bg">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4">
        <Link
          href={`/sites/${site.slug}`}
          className="font-site text-xl font-bold text-site-brand"
        >
          {site.name}
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link href={`/sites/${site.slug}`} className="hover:underline">
            Home
          </Link>
          <Link href={`/sites/${site.slug}/about`} className="hover:underline">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
