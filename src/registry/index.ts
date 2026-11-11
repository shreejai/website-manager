import type { ComponentType, ReactNode } from "react";
import { Section } from "@/components/blocks/Section";
import { CardGrid } from "@/components/blocks/CardGrid";

export type BlockDefinition = {
  type: string;
  label: string;
  acceptsChildren: boolean;
  // Props come from JSON, so at this boundary we can't know their type statically.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: ComponentType<any & { children?: ReactNode }>;
};

export const registry: Record<string, BlockDefinition> = {
  section: {
    type: "section",
    label: "Section",
    acceptsChildren: true,
    Component: Section,
  },
  cardGrid: {
    type: "cardGrid",
    label: "Card Grid",
    acceptsChildren: false,
    Component: CardGrid,
  },
};
