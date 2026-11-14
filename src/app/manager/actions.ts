"use server";

import { redirect } from "next/navigation";
import { createPage, savePage } from "@/lib/db/pages";
import { getSiteBySlug } from "@/lib/db/sites";
import { normalizePagePath } from "@/lib/page/path";
import type { PageNode } from "@/lib/page/types";
import { validateTree } from "@/lib/page/validate";

/* ---------- Create page (used with a <form> + useActionState) ---------- */

export type CreatePageState = {
  error: string | null;
  values?: { title: string; path: string }; // so the form keeps what the editor typed
};

export async function createPageAction(
  _prev: CreatePageState,
  formData: FormData,
): Promise<CreatePageState> {
  const siteSlug = String(formData.get("siteSlug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const rawPath = String(formData.get("path") ?? "");
  const values = { title, path: rawPath };

  if (!(await getSiteBySlug(siteSlug)))
    return { error: "Unknown site", values };
  if (!title) return { error: "Give the page a title", values };

  const path = normalizePagePath(rawPath);
  if (!path)
    return {
      error: "Use lowercase letters, numbers and dashes, e.g. /tickets",
      values,
    };

  const result = await createPage({ siteSlug, path, title });
  if (!result.ok) return { error: `A page already exists at ${path}`, values };

  // Outside any try/catch: redirect() works by throwing.
  redirect(`/manager/${siteSlug}/edit?path=${encodeURIComponent(path)}`);
}

/* ---------- Save page (called from the editor) ---------- */

export type SavePageResult =
  | { ok: true; savedAt: string }
  | { ok: false; error: string };

export async function savePageAction(
  siteSlug: string,
  path: string,
  data: { title: string; root: PageNode[] },
): Promise<SavePageResult> {
  const title = data.title.trim();
  if (!title) return { ok: false, error: "Page title can't be empty" };

  const treeError = validateTree(data.root);
  if (treeError) return { ok: false, error: treeError };

  const saved = await savePage(siteSlug, path, { title, root: data.root });
  if (!saved)
    return { ok: false, error: "Page not found. It may have been deleted." };

  return { ok: true, savedAt: new Date().toISOString() };
}
