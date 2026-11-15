import { CardGrid, type CardGridProps } from "@/components/blocks/CardGrid";
import { defineBlock } from "../defineBlock";

export const cardGridBlock = defineBlock<CardGridProps>({
  type: "cardGrid",
  label: "Card Grid",
  description: "A heading with a grid of cards, e.g. 'Meet the team'.",
  Component: CardGrid,
  fields: {
    title: { kind: "text", label: "Title" },
    cards: {
      kind: "list",
      label: "Cards",
      itemLabel: "Card",
      of: {
        kind: "object",
        label: "Card",
        fields: {
          image: { kind: "image", label: "Image" },
          heading: { kind: "text", label: "Heading" },
          link: {
            kind: "object",
            label: "Link",
            optional: true,
            fields: {
              label: {
                kind: "text",
                label: "Button text",
                placeholder: "Read more",
              },
              href: {
                kind: "text",
                label: "URL",
                placeholder: "/sites/wallabies/about",
              },
            },
          },
        },
      },
    },
  },
  defaultProps: {
    title: "New card grid",
    cards: [
      {
        image: {
          url: "https://images.unsplash.com/photo-1679183446745-90d449f8ede0?w=600&h=450&fit=crop&auto=format",
          alt: "Placeholder image",
        },
        heading: "New card",
      },
    ],
  },
});
