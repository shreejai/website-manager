import { cardGridBlock } from "./definitions/cardGrid";
import { sectionBlock } from "./definitions/section";
import type { BlockDefinition } from "./defineBlock";

export type { BlockDefinition } from "./defineBlock";

/** Every component editors can use. Adding a component = add it to this list. */
export const blockList: BlockDefinition[] = [sectionBlock, cardGridBlock];

export const registry: Record<string, BlockDefinition> = Object.fromEntries(
  blockList.map((block) => [block.type, block]),
);
