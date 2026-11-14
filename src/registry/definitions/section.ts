import { Section, type SectionProps } from "@/components/blocks/Section";
import { defineBlock } from "../defineBlock";

export const sectionBlock = defineBlock<SectionProps>({
  type: "section",
  label: "Section",
  description: "Groups other components and controls their layout.",
  acceptsChildren: true,
  Component: Section,
  fields: {
    layout: {
      kind: "select",
      label: "Layout",
      options: [
        { value: "full", label: "Full width" },
        { value: "two-column", label: "Two columns" },
      ],
    },
    background: {
      kind: "select",
      label: "Background",
      help: "Colours come from the site's theme.",
      options: [
        { value: "none", label: "None" },
        { value: "light", label: "Light" },
        { value: "brand", label: "Brand colour" },
      ],
    },
  },
  defaultProps: { layout: "full", background: "none" },
});
