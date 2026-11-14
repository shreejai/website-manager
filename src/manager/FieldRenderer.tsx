"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  emptyValue,
  type Field,
  type FieldMap,
  type ImageField,
  type ListField,
  type ObjectField,
  type SelectField,
  type TextField,
} from "@/registry/fields";

type Value = Record<string, unknown>;

/* ------------------------------------------------------------------ */
/* Entry point: renders one input per field in a FieldMap              */
/* ------------------------------------------------------------------ */

export function FieldsForm({
  fields,
  value,
  onChange,
  idPrefix = "field",
}: {
  fields: FieldMap;
  value: Value;
  onChange: (next: Value) => void;
  idPrefix?: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      {Object.entries(fields).map(([key, field]) => (
        <FieldRenderer
          key={key}
          id={`${idPrefix}-${key}`}
          field={field}
          value={value[key]}
          onChange={(next) => onChange({ ...value, [key]: next })}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Picks the right input for a field's kind                            */
/* ------------------------------------------------------------------ */

type FieldProps<F extends Field = Field> = {
  id: string;
  field: F;
  value: unknown;
  onChange: (next: unknown) => void;
};

export function FieldRenderer(props: FieldProps) {
  const { field } = props;
  switch (field.kind) {
    case "text":
      return <TextInput {...props} field={field} />;
    case "select":
      return <SelectInput {...props} field={field} />;
    case "image":
      return <ImageInput {...props} field={field} />;
    case "object":
      return <ObjectInput {...props} field={field} />;
    case "list":
      return <ListInput {...props} field={field} />;
  }
}

/* ------------------------------------------------------------------ */
/* Inputs                                                              */
/* ------------------------------------------------------------------ */

function FieldLabel({ id, field }: { id?: string; field: Field }) {
  return (
    <div className="flex flex-col gap-0.5">
      <Label htmlFor={id}>
        {field.label}
        {field.optional && (
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            (optional)
          </span>
        )}
      </Label>
      {field.help && (
        <p className="text-xs text-muted-foreground">{field.help}</p>
      )}
    </div>
  );
}

function TextInput({ id, field, value, onChange }: FieldProps<TextField>) {
  const text = typeof value === "string" ? value : "";
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel id={id} field={field} />
      {field.multiline ? (
        <Textarea
          id={id}
          value={text}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Input
          id={id}
          value={text}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

function SelectInput({ id, field, value, onChange }: FieldProps<SelectField>) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel id={id} field={field} />
      <Select
        value={typeof value === "string" ? value : undefined}
        onValueChange={onChange}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder="Choose…" />
        </SelectTrigger>
        <SelectContent>
          {field.options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ImageInput({ id, field, value, onChange }: FieldProps<ImageField>) {
  const image = (value ?? {}) as { url?: string; alt?: string };
  const update = (patch: { url?: string; alt?: string }) =>
    onChange({ url: "", alt: "", ...image, ...patch });

  return (
    <fieldset className="flex flex-col gap-2 rounded-md border p-3">
      <legend className="px-1 text-sm font-medium">{field.label}</legend>
      {image.url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image.url}
          alt={image.alt ?? ""}
          className="h-24 w-full rounded object-cover"
        />
      )}
      <Label htmlFor={`${id}-url`} className="text-xs">
        Image URL
      </Label>
      <Input
        id={`${id}-url`}
        value={image.url ?? ""}
        placeholder="https://…"
        onChange={(e) => update({ url: e.target.value })}
      />
      <Label htmlFor={`${id}-alt`} className="text-xs">
        Alt text
      </Label>
      <Input
        id={`${id}-alt`}
        value={image.alt ?? ""}
        placeholder="Describe the image for screen readers"
        onChange={(e) => update({ alt: e.target.value })}
      />
    </fieldset>
  );
}

function ObjectInput({ id, field, value, onChange }: FieldProps<ObjectField>) {
  const object = value as Value | undefined;
  const isOn = object !== undefined;

  return (
    <fieldset className="rounded-md border p-3">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium">{field.label}</span>
        {field.optional && (
          <Switch
            checked={isOn}
            onCheckedChange={(on) =>
              onChange(on ? emptyValue(field) : undefined)
            }
            aria-label={`Include ${field.label}`}
          />
        )}
      </div>
      {(isOn || !field.optional) && (
        <FieldsForm
          fields={field.fields}
          value={object ?? {}}
          onChange={onChange}
          idPrefix={id}
        />
      )}
    </fieldset>
  );
}

function ListInput({ id, field, value, onChange }: FieldProps<ListField>) {
  const items = Array.isArray(value) ? value : [];
  const itemLabel = field.itemLabel ?? "Item";

  const update = (index: number, next: unknown) =>
    onChange(items.map((item, i) => (i === index ? next : item)));
  const remove = (index: number) =>
    onChange(items.filter((_, i) => i !== index));
  const add = () => onChange([...items, emptyValue(field.of)]);
  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-2">
      <FieldLabel field={field} />

      {items.map((item, index) => (
        <div key={index} className="rounded-md border p-3">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium">
              {itemLabel} {index + 1}
            </span>
            <div className="flex gap-1">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="Move up"
              >
                ↑
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                aria-label="Move down"
              >
                ↓
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            </div>
          </div>

          {/* Object items render their fields directly to avoid a box inside a box */}
          {field.of.kind === "object" ? (
            <FieldsForm
              fields={field.of.fields}
              value={(item ?? {}) as Value}
              onChange={(next) => update(index, next)}
              idPrefix={`${id}-${index}`}
            />
          ) : (
            <FieldRenderer
              id={`${id}-${index}`}
              field={field.of}
              value={item}
              onChange={(next) => update(index, next)}
            />
          )}
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={add}
        className="self-start"
      >
        + Add {itemLabel}
      </Button>
    </div>
  );
}
