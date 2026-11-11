/**
 * One component placed on a page. This is the portable JSON format:
 * no React, no Mongo, just data. Any renderer can read it.
 */
export type PageNode = {
  id: string; // stable id, used by the manager to select/edit
  type: string; // matches a key in the component registry
  props: Record<string, unknown>; // validated per component later (Phase 4)
  children?: PageNode[]; // only containers (Section) use this
};

export type PageDocument = {
  siteSlug: string;
  path: string; // "/", "/about"
  title: string;
  root: PageNode[]; // top-level components, top to bottom
};
