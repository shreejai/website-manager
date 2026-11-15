# Website Manager

A small, purpose-built website manager and renderer for running many sports websites from one shared component library.

- **Manager** (`/manager`): editors create pages for a site, add/remove/reorder components (including inside Sections), and edit each component's content through forms generated from the component's own field schema. Includes a live, themed preview.
- **Renderer** (`/sites/[site]/[...path]`): the public websites. Resolves a page by site + path from MongoDB, server-renders it with the shared components and that site's theme, and returns a 404 for unknown sites or paths.

Two seeded sites, **Wallabies** and **Harbour Rugby Union**, use the same components with clearly different themes.

---

## Quick start

Requirements: Node 20+, Docker Desktop (or a free MongoDB Atlas cluster).

```bash
cp .env.example .env.local     # default points at the local Docker MongoDB
docker compose up -d           # starts MongoDB on localhost:27017
npm install
npm run seed                   # creates 2 sites with 2 pages each (safe to re-run)
npm run dev
```

Then open:

| URL                                       | What                |
| ----------------------------------------- | ------------------- |
| http://localhost:3000                     | Links to everything |
| http://localhost:3000/manager             | The manager         |
| http://localhost:3000/sites/wallabies     | Public site 1       |
| http://localhost:3000/sites/harbour-rugby | Public site 2       |

**Using Atlas instead of Docker:** put your Atlas connection string in `.env.local` as `MONGODB_URI` (include the database name, e.g. `.../website-manager?retryWrites=true&w=majority`) and skip `docker compose up`.

### Scripts

| Script              | Does                                                                                                |
| ------------------- | --------------------------------------------------------------------------------------------------- |
| `npm run dev`       | Start the app                                                                                       |
| `npm run seed`      | Upsert the seeded sites and pages, and create indexes. Pages created in the manager are left alone. |
| `npm run typecheck` | `tsc --noEmit`                                                                                      |
| `npm run lint`      | ESLint                                                                                              |

### Environment variables

| Name          | Example                                     | Notes                                |
| ------------- | ------------------------------------------- | ------------------------------------ |
| `MONGODB_URI` | `mongodb://localhost:27017/website-manager` | The database name comes from the URI |

---

## Architecture

One Next.js 16 app (App Router, TypeScript, Tailwind v4). Four parts, kept deliberately separate:

```
                ┌────────────────────────────┐
                │  Component library          │  src/components/{atoms,molecules,blocks}
                │  pure React, no editing     │  knows nothing about the manager or Mongo
                └──────────────┬─────────────┘
                               │ used by
                ┌──────────────▼─────────────┐
                │  Component definitions      │  src/registry
                │  type, label, fields,       │  the bridge: describes each block's
                │  defaultProps, Component    │  editable props for the manager
                └───────┬──────────────┬─────┘
                        │              │
        ┌───────────────▼───┐    ┌─────▼──────────────────┐
        │  Manager           │    │  Renderer               │
        │  src/manager       │    │  src/renderer           │
        │  src/app/manager   │    │  src/app/sites/...      │
        │  outline, generated│    │  RenderNode (recursive),│
        │  forms, save action│    │  SiteThemeScope         │
        └─────────┬─────────┘    └─────────▲──────────────┘
                  │ writes                  │ reads
                ┌─▼─────────────────────────┴──┐
                │  Page data (portable JSON)    │  MongoDB: sites, pages
                │  src/lib/db, src/lib/page     │
                └───────────────────────────────┘
```

### Folder structure

```
src/
  components/
    atoms/        Button, Heading, Image          (small building blocks)
    molecules/    Card
    blocks/       Section, CardGrid               (page-level components)
    ui/           shadcn/ui, used by the manager only
  registry/
    fields.ts               field schema types + emptyValue()
    defineBlock.ts          BlockDefinition + typed helper
    definitions/            one file per block
    index.ts                blockList, registry, createNode()
  renderer/
    RenderNode.tsx          recursive tree → React
    SiteThemeScope.tsx      theme tokens → CSS variables
    SiteHeader.tsx
  manager/
    FieldRenderer.tsx       generic, recursive form built from fields
    TreeOutline.tsx         page structure: select / add / remove / reorder
    PageEditor.tsx          editor state, preview, save
    NewPageForm.tsx
  lib/
    db/                     Mongo client, typed collections, repository functions
    page/                   types, pure tree helpers, path rules, tree validation
    site/                   site/theme types, themeToCssVars()
  fixtures/                 seed data (sites.ts, pages.ts)
  app/
    sites/[site]/[[...path]]/page.tsx    public renderer
    manager/...                          manager routes + server actions
scripts/seed.ts
```

**Atomic design:** atoms → molecules → blocks. Only blocks are registered as page components. Atoms and molecules are internal building blocks that every block reuses, so a theme change or a fix to `Button` applies everywhere.

---

## Data model

Two collections.

**`sites`**: seeded, not edited in the manager.

```ts
{ slug: "wallabies", name: "Wallabies", theme: { colors: { brand, onBrand, surface, text, background }, radius, font } }
```

Index: `{ slug: 1 }` unique.

**`pages`**: one document per page.

```ts
{ siteSlug: "wallabies", path: "/about", title: "About", root: PageNode[], createdAt, updatedAt }
```

Index: `{ siteSlug: 1, path: 1 }` unique. This is the lookup on every public request, and it also stops two pages being created at the same path.

**Component definitions are code, not data.** They live in `src/registry`, versioned in git alongside the components they describe. The database stores only content (pages) and configuration (sites).

### Why it holds up with 30+ sites

- Pages are their own documents, not embedded in the site document. A site with hundreds of pages never approaches Mongo's 16 MB document limit, a request loads one small document, and saving one page never rewrites the site.
- Every request is a single indexed lookup by `(siteSlug, path)`.
- Adding a site is adding data (a slug and theme tokens). No code, CSS or build changes are needed.

---

## Page JSON format

A page is a tree of component instances. Each node is `{ id, type, props, children? }`:

- `id`: stable, generated with `crypto.randomUUID()` when added in the manager; used to select and edit nodes
- `type`: a key in the component registry
- `props`: that component's values (plain JSON)
- `children`: only on components whose definition has `acceptsChildren: true` (Section)

The document doesn't depend on React, Next.js or the manager. Any renderer that knows the component types can render it.

### Example

```json
{
  "siteSlug": "harbour-rugby",
  "path": "/",
  "title": "Home",
  "root": [
    {
      "id": "hr-home-s2",
      "type": "section",
      "props": { "layout": "full", "background": "brand" },
      "children": [
        {
          "id": "hr-home-s3",
          "type": "section",
          "props": { "layout": "two-column", "background": "none" },
          "children": [
            {
              "id": "hr-home-juniors",
              "type": "cardGrid",
              "props": {
                "title": "Juniors",
                "cards": [
                  {
                    "image": {
                      "url": "https://images.unsplash.com/photo-1679183446745-90d449f8ede0?w=600&h=450&fit=crop&auto=format",
                      "alt": "Juniors"
                    },
                    "heading": "Register for 2027",
                    "link": {
                      "label": "Find out more",
                      "href": "/sites/harbour-rugby/juniors"
                    }
                  }
                ]
              }
            },
            {
              "id": "hr-home-womens",
              "type": "cardGrid",
              "props": {
                "title": "Women's rugby",
                "cards": [
                  {
                    "image": {
                      "url": "https://images.unsplash.com/photo-1534583000938-a375b825ea16?w=600&h=450&fit=crop&auto=format",
                      "alt": "Women's team"
                    },
                    "heading": "Premier grade draw"
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  ]
}
```

---

## Component definitions and field schemas

Each block has a definition that describes its editable props:

```ts
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
              label: { kind: "text", label: "Button text" },
              href: { kind: "text", label: "URL" },
            },
          },
        },
      },
    },
  },
  defaultProps: {
    title: "New card grid",
    cards: [
      /* one starter card */
    ],
  },
});
```

Five field kinds: `text`, `select`, `image`, `object`, `list`, plus an `optional` flag. Together they cover lists, nested objects and optional fields. `FieldRenderer` walks the fields recursively and renders the right input for each kind, so **no component has a hand-written form**.

`defineBlock<Props>()` is typed so that **every editable prop must have a field** and `defaultProps` must match the component's props. Add a prop to a component and forget its field, and TypeScript reports an error.

---

## How to add a new component

Example: a "Call to action" banner.

**1. Build the component** in `src/components/blocks/CallToAction.tsx`, using the atoms and the `site-*` theme classes:

```tsx
import { Button } from "@/components/atoms/Button";
import { Heading } from "@/components/atoms/Heading";

export type CallToActionProps = {
  heading: string;
  body?: string;
  button: { label: string; href: string };
};

export function CallToAction({ heading, body, button }: CallToActionProps) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-site bg-site-brand p-8 text-site-on-brand">
      <Heading level={2}>{heading}</Heading>
      {body && <p className="max-w-prose opacity-90">{body}</p>}
      <Button href={button.href} variant="secondary">
        {button.label}
      </Button>
    </div>
  );
}
```

**2. Describe its props** in `src/registry/definitions/callToAction.ts`:

```ts
import {
  CallToAction,
  type CallToActionProps,
} from "@/components/blocks/CallToAction";
import { defineBlock } from "../defineBlock";

export const callToActionBlock = defineBlock<CallToActionProps>({
  type: "callToAction",
  label: "Call to action",
  description: "A coloured banner with a heading and a button.",
  Component: CallToAction,
  fields: {
    heading: { kind: "text", label: "Heading" },
    body: { kind: "text", label: "Body", multiline: true, optional: true },
    button: {
      kind: "object",
      label: "Button",
      fields: {
        label: { kind: "text", label: "Button text" },
        href: { kind: "text", label: "URL" },
      },
    },
  },
  defaultProps: {
    heading: "Get your tickets",
    button: { label: "Buy now", href: "/" },
  },
});
```

**3. Register it** by adding it to `blockList` in `src/registry/index.ts`:

```ts
export const blockList: BlockDefinition[] = [
  sectionBlock,
  cardGridBlock,
  callToActionBlock,
];
```

That's it. It now appears in the manager's "Add component" menu (at the page root and inside Sections), gets a generated form, renders in the live preview and on the public site, and is accepted by the save validation.

**Adding a prop to an existing component** is the same idea, smaller: add it to the component's props type, then add one line to its `fields`. TypeScript tells you if you forget the second step.

---

## Theming

Each site's theme is a small set of design tokens (brand, on-brand, surface, text and background colours, corner radius, font stack). `SiteThemeScope` turns them into CSS variables (`--site-brand`, …) on a wrapper element. Tailwind v4's `@theme inline` maps those variables to utility classes (`bg-site-brand`, `rounded-site`, `font-site`), which the components use.

- Components never reference a specific site, so the same component looks different on each site with no conditionals.
- The variables are server-rendered inline, so there's no flash of the wrong theme.
- Themes are scoped, which is how the manager's live preview shows the site's real theme inside the manager UI.
- The `site-` prefix keeps public site tokens separate from shadcn's tokens used by the manager.

---

## Key decisions and trade-offs

- **One Next.js app rather than a monorepo.** It's simpler to run and review. The boundaries a monorepo would enforce (components, registry, manager, renderer) are kept as folders. Splitting `components` + `registry` + `renderer` into a shared package would be the first step if the public sites were deployed separately from the manager.
- **App Router.** Server components make the public renderer server-rendered by default, and server actions give the manager typed create/save calls without hand-written API routes.
- **A custom field format rather than Zod or JSON Schema.** The format describes _editing UI_ (labels, help text, item labels, "image" as a concept), not just validation, and it's small enough to read in one file. Trade-off: prop _values_ aren't validated on save yet (see next steps).
- **Definitions kept separate from components.** Components stay pure rendering code. The definition is the only place that knows about editing.
- **Pages keyed by `siteSlug` rather than a site ObjectId.** Readable data and simple queries. Renaming a site slug would mean updating its pages, which is acceptable because sites are seeded configuration.
- **Per-request rendering; `cacheComponents` disabled.** Next.js 16's `cacheComponents` (and `partialPrefetching`, which depends on it) requires every page that reads from MongoDB to be wrapped in `<Suspense>` or marked `"use cache"` with revalidation rules. For this exercise I turned both off in `next.config.ts` and render public pages per request: a saved page appears on the public site immediately, and the rendering model stays simple to reason about. At 30+ sites in production I'd re-enable it and cache page reads with `"use cache"` + `cacheTag(\`page:${siteSlug}:${path}\`)`, calling `revalidateTag`from`savePageAction` on save.
- **Whole-tree save.** The editor sends the full `root` on save. It's simple and always consistent, but it's last-write-wins if two editors edit the same page at once. Optimistic concurrency (compare `updatedAt` on save) would fix that.
- **Server-side tree validation on save.** It checks structure (known types, children only where allowed, ids present), so a bad request can't store a page the renderer can't handle. Unknown types in existing data render as nothing in production and as a visible warning in development.
- **Plain `<img>` instead of `next/image`.** Editors can paste any image URL. `next/image` would need every remote domain allow-listed.
- **Internal links include `/sites/<slug>`.** That's how this single app routes sites. In production each site would have its own domain and links would be plain `/about` (see next steps).
- **List items use the index as a React key** in the props form. That's fine for controlled inputs; stable item ids would be better if lists got heavier.

---

## What's missing and how I'd build it next

- **Prop value validation:** generate a Zod schema from each definition's `fields` and validate `props` in `savePageAction`, returning per-field errors to the form.
- **Draft and publish:** store `draft` and `published` trees on the page document. The editor saves `draft`, Publish copies it to `published` (with `publishedAt`), and the renderer reads only `published`.
- **Drag and drop:** dnd-kit's sortable lists, one per sibling list in the outline, with `onDragEnd` calling a `moveNode(nodes, id, toParentId, toIndex)` variant of the existing pure helper. The ▲/▼ buttons already cover reordering.
- **Custom domains:** middleware maps the request `Host` to a site slug and rewrites to `/sites/[slug]/[...path]`, so links become plain `/about`.
- **Caching at scale:** re-enable `cacheComponents`, cache page reads with `"use cache"` + `cacheTag(\`page:${siteSlug}:${path}\`)`, and call `revalidateTag`from`savePageAction`.
- **Data-driven component (e.g. Latest news):** fields for `source` and `limit`, plus an optional async `loader` on the definition that `RenderNode` awaits on the server before rendering.
- **Per-site navigation:** a `nav` array on the site document, rendered by `SiteHeader` (currently hardcoded Home/About).
- **Delete and rename pages** in the manager.
- **Tests:** unit tests for `src/lib/page/tree.ts`, `validate.ts` and `normalizePagePath`, the riskiest pure logic.

---

## Time spent

About **7 hours** in total.

## AI usage

I used Claude as a pair programmer to plan the phases, discuss trade-offs and draft code, which I reviewed, tested and adjusted. I understand and can explain every part of the codebase.
