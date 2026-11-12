This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Requires Node.js and Docker.

```bash
cp .env.example .env
docker compose up -d
npm install
npm run seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

`docker compose up -d` starts a local MongoDB 7 on `localhost:27017`, which matches the default `MONGODB_URI` in `.env.example`.

**Fallback (no Docker):** create a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) M0 cluster, set `MONGODB_URI` in `.env` to its connection string, then skip `docker compose up -d` and run the rest of the commands.

### Environment variables

All variables are listed in `.env.example`. Copy it to `.env` and fill in values. `.env*` files are gitignored (except `.env.example`), so keep secrets out of the repo.

| Variable      | Description                                                          |
| ------------- | -------------------------------------------------------------------- |
| `MONGODB_URI` | MongoDB connection string (local Docker by default, or an Atlas URI) |

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Theming

Each site's theme is applied as inline CSS variables (`--site-*`) on a wrapper element. See `SiteThemeScope` in `src/renderer/SiteThemeScope.tsx` and `themeToCssVars` in `src/lib/site/theme.ts`. Why this approach:

- **No flash of the wrong theme.** The variables are server-rendered into the HTML, so the page arrives already themed.
- **Scoped.** Themes don't leak, so two sites' themes can sit on one screen (e.g. a side-by-side dev page or a manager preview).
- **Adding a site is data only.** Site #31 needs a theme record, not a new CSS file or a build step.

## Trade-offs

- **`cacheComponents` and `partialPrefetching` are disabled in `next.config.ts`.** With `cacheComponents` on, every page that reads from MongoDB has to be wrapped in `<Suspense>` or marked `"use cache"` with revalidation rules, and `partialPrefetching` depends on it. For this exercise I chose plain per-request server rendering so a saved page shows up on the public site immediately and the rendering model stays simple. In production with 30+ sites, I'd turn it back on and cache rendered pages with `"use cache"` plus tag-based revalidation, e.g. `` revalidateTag(`page:${siteSlug}:${path}`) `` when a page is saved.
