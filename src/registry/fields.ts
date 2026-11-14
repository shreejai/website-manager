/**
 * How a component describes its editable props.
 * The manager turns these into a form, so new components never need a hand-written form.
 */

type BaseField = {
  label: string;
  help?: string; // small hint under the label
  optional?: boolean; // value may be undefined
};

export type TextField = BaseField & {
  kind: "text";
  multiline?: boolean;
  placeholder?: string;
};

export type SelectField = BaseField & {
  kind: "select";
  options: { value: string; label: string }[];
};

/** Value shape: { url: string; alt: string }. Its own kind so the editor can show a preview. */
export type ImageField = BaseField & {
  kind: "image";
};

export type ObjectField = BaseField & {
  kind: "object";
  fields: FieldMap;
};

export type ListField = BaseField & {
  kind: "list";
  of: Field; // shape of each item
  itemLabel?: string; // "Card" → "Card 1", "+ Add Card"
};

export type Field =
  | TextField
  | SelectField
  | ImageField
  | ObjectField
  | ListField;
export type FieldMap = Record<string, Field>;

/** A blank value for a field, used when adding a list item or switching on an optional group. */
export function emptyValue(field: Field): unknown {
  switch (field.kind) {
    case "text":
      return "";
    case "select":
      return field.options[0]?.value ?? "";
    case "image":
      return { url: "", alt: "" };
    case "list":
      return [];
    case "object": {
      const value: Record<string, unknown> = {};
      for (const [key, child] of Object.entries(field.fields)) {
        if (!child.optional) value[key] = emptyValue(child);
      }
      return value;
    }
  }
}
