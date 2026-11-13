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
