import demo from "@/fixtures/demo-page.json";
import type { PageDocument } from "@/lib/page/types";
import { RenderPage } from "@/renderer/RenderNode";

export default function DevRenderPage() {
  const page = demo as PageDocument;
  return (
    <main className="min-h-screen bg-white">
      <RenderPage nodes={page.root} />
    </main>
  );
}
