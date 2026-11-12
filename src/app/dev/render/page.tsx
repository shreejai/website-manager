import demo from "@/fixtures/demo-page.json";
import { sites } from "@/fixtures/sites";
import type { PageDocument } from "@/lib/page/types";
import { RenderPage } from "@/renderer/RenderNode";
import { SiteThemeScope } from "@/renderer/SiteThemeScope";

export default function DevRenderPage() {
  const page = demo as PageDocument;
  return (
    <main className="min-h-screen bg-white">
      {sites.map((site) => (
        <div key={site.slug} className="border-b-8 border-black">
          <p className="bg-black px-6 py-2 font-mono text-sm text-white">
            Theme: {site.name}
          </p>
          <SiteThemeScope theme={site.theme}>
            <RenderPage nodes={page.root} />
          </SiteThemeScope>
        </div>
      ))}
      {/* <RenderPage nodes={page.root} /> */}
    </main>
  );
}
