import { registry } from "@/registry";

/** Returns an error message, or null if the tree is structurally valid. */
export function validateTree(nodes: unknown): string | null {
  if (!Array.isArray(nodes)) return "Page content must be a list of components";

  for (const node of nodes) {
    if (typeof node !== "object" || node === null) return "Invalid component";
    const { id, type, props, children } = node as Record<string, unknown>;

    if (typeof id !== "string" || id === "")
      return "Every component needs an id";

    const definition = registry[type as string];
    if (!definition) return `Unknown component type: ${String(type)}`;

    if (typeof props !== "object" || props === null || Array.isArray(props)) {
      return `${definition.label} has invalid props`;
    }

    if (children !== undefined) {
      if (!definition.acceptsChildren)
        return `${definition.label} can't contain other components`;
      const childError = validateTree(children);
      if (childError) return childError;
    }
  }
  return null;
}
