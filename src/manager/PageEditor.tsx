"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { savePageAction } from "@/app/manager/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  findNode,
  insertNode,
  moveNode,
  removeNode,
  updateNodeProps,
} from "@/lib/page/tree";
import type { PageNode } from "@/lib/page/types";
import type { Site } from "@/lib/site/types";
import { FieldsForm } from "@/manager/FieldRenderer";
import { TreeOutline } from "@/manager/TreeOutline";
import { createNode, registry } from "@/registry";
import { RenderPage } from "@/renderer/RenderNode";
import { SiteThemeScope } from "@/renderer/SiteThemeScope";

type Status =
  | { kind: "idle" }
  | { kind: "saved"; at: string }
  | { kind: "error"; message: string };

type Props = {
  site: Site;
  page: { path: string; title: string; root: PageNode[] };
};

export function PageEditor({ site, page }: Props) {
  const [title, setTitle] = useState(page.title);
  const [root, setRoot] = useState<PageNode[]>(page.root);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [isSaving, startSaving] = useTransition();

  const selected = selectedId ? findNode(root, selectedId) : null;
  const selectedDefinition = selected ? registry[selected.type] : null;

  // Every tree change goes through here, so "unsaved changes" is always accurate.
  function changeTree(next: PageNode[]) {
    setRoot(next);
    setDirty(true);
  }

  function handleAdd(parentId: string | null, type: string) {
    const node = createNode(type);
    changeTree(insertNode(root, parentId, node));
    setSelectedId(node.id); // open the new component's form straight away
  }

  function handleRemove(id: string) {
    const node = findNode(root, id);
    if (
      node?.children?.length &&
      !window.confirm("Remove this section and everything inside it?")
    )
      return;
    const next = removeNode(root, id);
    changeTree(next);
    // If the selected node was removed (or was inside the removed one), clear the selection.
    if (selectedId && !findNode(next, selectedId)) setSelectedId(null);
  }

  function handleSave() {
    startSaving(async () => {
      const result = await savePageAction(site.slug, page.path, {
        title,
        root,
      });
      if (result.ok) {
        setDirty(false);
        setStatus({ kind: "saved", at: result.savedAt });
      } else {
        setStatus({ kind: "error", message: result.error });
      }
    });
  }

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const publicHref = `/sites/${site.slug}${page.path === "/" ? "" : page.path}`;

  return (
    <div className="flex h-screen flex-col">
      {/* ---------- Top bar ---------- */}
      <header className="flex items-center gap-3 border-b px-4 py-2">
        <Link
          href={`/manager/${site.slug}`}
          className="text-sm text-muted-foreground hover:underline"
        >
          ← {site.name}
        </Link>
        <Input
          aria-label="Page title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setDirty(true);
          }}
          className="max-w-xs"
        />
        <code className="text-xs text-muted-foreground">{page.path}</code>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm">
            {dirty ? (
              <span className="text-amber-600">Unsaved changes</span>
            ) : status.kind === "saved" ? (
              <span className="text-green-600">
                Saved {new Date(status.at).toLocaleTimeString("en-AU")}
              </span>
            ) : null}
            {status.kind === "error" && (
              <span className="ml-2 text-destructive">{status.message}</span>
            )}
          </span>
          <Button asChild variant="outline">
            <a href={publicHref} target="_blank" rel="noreferrer">
              View page ↗
            </a>
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !dirty}>
            {isSaving ? "Saving…" : "Save"}
          </Button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[300px_1fr_380px]">
        {/* ---------- Left: page outline ---------- */}
        <aside className="overflow-y-auto border-r p-3">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Page structure
          </h2>
          <TreeOutline
            nodes={root}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onAdd={handleAdd}
            onRemove={handleRemove}
            onMove={(id, direction) =>
              changeTree(moveNode(root, id, direction))
            }
          />
        </aside>

        {/* ---------- Middle: live preview with the site's theme ---------- */}
        <section className="overflow-y-auto bg-muted/40 p-4">
          <div className="overflow-hidden rounded-lg border shadow-sm">
            <SiteThemeScope theme={site.theme}>
              {root.length === 0 ? (
                <p className="p-12 text-center opacity-60">
                  Add a component from the left to get started.
                </p>
              ) : (
                <RenderPage nodes={root} />
              )}
            </SiteThemeScope>
          </div>
        </section>

        {/* ---------- Right: generated form for the selected component ---------- */}
        <aside className="overflow-y-auto border-l p-4">
          {selected && selectedDefinition ? (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="font-semibold">{selectedDefinition.label}</h2>
                {selectedDefinition.description && (
                  <p className="text-sm text-muted-foreground">
                    {selectedDefinition.description}
                  </p>
                )}
              </div>
              <FieldsForm
                key={selected.id}
                idPrefix={selected.id}
                fields={selectedDefinition.fields}
                value={selected.props}
                onChange={(props) =>
                  changeTree(updateNodeProps(root, selected.id, props))
                }
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Select a component on the left to edit it.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
