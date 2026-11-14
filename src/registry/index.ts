import { cardGridBlock } from "./definitions/cardGrid";
import { sectionBlock } from "./definitions/section";
import type { BlockDefinition } from "./defineBlock";
import { PageNode } from "@/lib/page/types";

export type { BlockDefinition } from "./defineBlock";

/** Every component editors can use. Adding a component = add it to this list. */
export const blockList: BlockDefinition[] = [sectionBlock, cardGridBlock];

export const registry: Record<string, BlockDefinition> = Object.fromEntries(
  blockList.map((block) => [block.type, block]),
);

/** A fresh instance of a component, using its default props. */
export function createNode(type: string): PageNode {
  const definition = registry[type];
  return {
    id: crypto.randomUUID(),
    type,
    props: structuredClone(definition.defaultProps), // copy, so instances never share objects
    ...(definition.acceptsChildren ? { children: [] } : {}),
  };
}
