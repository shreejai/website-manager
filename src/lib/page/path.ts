/**
 * Turns the catch-all route segments into a stored page path.
 *   undefined        → "/"
 *   ["about"]        → "/about"
 *   ["news", "2026"] → "/news/2026"
 */
export function toPagePath(segments?: string[]): string {
  if (!segments || segments.length === 0) return "/";
  return "/" + segments.join("/");
}

/**
 * Cleans what an editor types into a page path, or returns null if invalid.
 *   "About"      → "/about"
 *   "/news/2026/" → "/news/2026"
 *   "my page!"   → null
 */
export function normalizePagePath(input: string): string | null {
  const cleaned =
    "/" + input.trim().toLowerCase().split("/").filter(Boolean).join("/");
  return /^\/([a-z0-9-]+(\/[a-z0-9-]+)*)?$/.test(cleaned) ? cleaned : null;
}
