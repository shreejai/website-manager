import type { PageNode } from "./types";

/** Finds a node anywhere in the tree. */
export function findNode(nodes: PageNode[], id: string): PageNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

/** Replaces one node's props. Returns a new tree (never mutates). */
export function updateNodeProps(
  nodes: PageNode[],
  id: string,
  props: PageNode["props"],
): PageNode[] {
  return nodes.map((node) => {
    if (node.id === id) return { ...node, props };
    if (node.children)
      return { ...node, children: updateNodeProps(node.children, id, props) };
    return node;
  });
}

/** Removes a node (and everything inside it). */
export function removeNode(nodes: PageNode[], id: string): PageNode[] {
  return nodes
    .filter((node) => node.id !== id)
    .map((node) =>
      node.children
        ? { ...node, children: removeNode(node.children, id) }
        : node,
    );
}

/** Appends a node to the page root (parentId = null) or to a container's children. */
export function insertNode(
  nodes: PageNode[],
  parentId: string | null,
  newNode: PageNode,
): PageNode[] {
  if (parentId === null) return [...nodes, newNode];
  return nodes.map((node) => {
    if (node.id === parentId)
      return { ...node, children: [...(node.children ?? []), newNode] };
    if (node.children)
      return {
        ...node,
        children: insertNode(node.children, parentId, newNode),
      };
    return node;
  });
}

/** Swaps a node with its previous (-1) or next (+1) sibling. */
export function moveNode(
  nodes: PageNode[],
  id: string,
  direction: -1 | 1,
): PageNode[] {
  const index = nodes.findIndex((node) => node.id === id);
  if (index !== -1) {
    const target = index + direction;
    if (target < 0 || target >= nodes.length) return nodes;
    const next = [...nodes];
    [next[index], next[target]] = [next[target], next[index]];
    return next;
  }
  return nodes.map((node) =>
    node.children
      ? { ...node, children: moveNode(node.children, id, direction) }
      : node,
  );
}
