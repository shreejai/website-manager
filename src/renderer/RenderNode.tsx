import type { PageNode } from "@/lib/page/types";
import { registry } from "@/registry";

export function RenderNode({ node }: { node: PageNode }) {
  const definition = registry[node.type];

  // Unknown type (e.g. a component was removed from the library):
  // don't crash the whole page; show a hint in dev, nothing in prod.
  if (!definition) {
    if (process.env.NODE_ENV !== "production") {
      return (
        <div className="border border-dashed border-red-500 p-4 text-red-600">
          Unknown component: {node.type}
        </div>
      );
    }
    return null;
  }

  const { Component } = definition;

  return (
    <Component {...node.props}>
      {node.children?.map((child) => (
        <RenderNode key={child.id} node={child} />
      ))}
    </Component>
  );
}

export function RenderPage({ nodes }: { nodes: PageNode[] }) {
  return (
    <>
      {nodes.map((node) => (
        <RenderNode key={node.id} node={node} />
      ))}
    </>
  );
}
