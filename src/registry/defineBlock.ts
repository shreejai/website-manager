import type { ComponentType } from "react";
import type { Field, FieldMap } from "./fields";

type EditableProps<P> = Omit<P, "children">;

/** Every editable prop must have a field. */
type FieldsFor<P> = { [K in keyof EditableProps<P>]-?: Field };

/** What the registry stores: one entry per component type. */
export type BlockDefinition = {
  type: string;
  label: string;
  description?: string;
  acceptsChildren: boolean;
  fields: FieldMap;
  defaultProps: Record<string, unknown>;
  // Props arrive as untyped JSON; this is the one place types are erased.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: ComponentType<any>;
};

export function defineBlock<P extends object>(definition: {
  type: string;
  label: string;
  description?: string;
  acceptsChildren?: boolean;
  Component: ComponentType<P>;
  fields: FieldsFor<P>;
  defaultProps: EditableProps<P>;
}): BlockDefinition {
  return { acceptsChildren: false, ...definition } as BlockDefinition;
}
