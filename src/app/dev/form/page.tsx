"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FieldsForm } from "@/manager/FieldRenderer";
import { blockList, registry } from "@/registry";

export default function DevFormPage() {
  const [type, setType] = useState("cardGrid");
  const [props, setProps] = useState<Record<string, unknown>>(
    registry.cardGrid.defaultProps,
  );

  const definition = registry[type];
  const { Component } = definition;

  const choose = (nextType: string) => {
    setType(nextType);
    setProps(registry[nextType].defaultProps);
  };

  return (
    <div className="grid min-h-screen grid-cols-[400px_1fr]">
      <aside className="flex flex-col gap-4 overflow-y-auto border-r p-4">
        <div className="flex gap-2">
          {blockList.map((block) => (
            <Button
              key={block.type}
              size="sm"
              variant={block.type === type ? "default" : "outline"}
              onClick={() => choose(block.type)}
            >
              {block.label}
            </Button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          {definition.description}
        </p>
        <FieldsForm
          key={type}
          fields={definition.fields}
          value={props}
          onChange={setProps}
        />
      </aside>

      <div className="overflow-y-auto">
        <Component {...props}>
          {definition.acceptsChildren && (
            <p className="rounded border border-dashed p-6 text-center">
              Child components go here
            </p>
          )}
        </Component>
        <pre className="m-6 overflow-auto rounded bg-zinc-950 p-4 text-xs text-zinc-100">
          {JSON.stringify({ type, props }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
