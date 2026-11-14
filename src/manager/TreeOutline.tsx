"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PageNode } from "@/lib/page/types";
import { cn } from "@/lib/utils";
import { blockList, registry } from "@/registry";

export type OutlineHandlers = {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd: (parentId: string | null, type: string) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
};

export function TreeOutline({
  nodes,
  ...handlers
}: { nodes: PageNode[] } & OutlineHandlers) {
  return <OutlineList nodes={nodes} parentId={null} {...handlers} />;
}

function OutlineList({
  nodes,
  parentId,
  ...handlers
}: { nodes: PageNode[]; parentId: string | null } & OutlineHandlers) {
  return (
    <div className="flex flex-col gap-1">
      {nodes.length === 0 && (
        <p className="px-2 py-1 text-xs text-muted-foreground">
          {parentId ? "Empty section" : "This page has no components yet."}
        </p>
      )}
      {nodes.map((node, index) => (
        <OutlineItem
          key={node.id}
          node={node}
          isFirst={index === 0}
          isLast={index === nodes.length - 1}
          {...handlers}
        />
      ))}
      <AddComponentMenu
        label={parentId ? "Add inside section" : "Add component"}
        onAdd={(type) => handlers.onAdd(parentId, type)}
      />
    </div>
  );
}

function OutlineItem({
  node,
  isFirst,
  isLast,
  ...handlers
}: { node: PageNode; isFirst: boolean; isLast: boolean } & OutlineHandlers) {
  const definition = registry[node.type];
  const isSelected = handlers.selectedId === node.id;

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1 rounded-md border px-2 py-1.5 text-sm",
          isSelected ? "border-primary bg-primary/5" : "hover:bg-muted",
        )}
      >
        <button
          type="button"
          onClick={() => handlers.onSelect(node.id)}
          className="flex min-w-0 flex-1 flex-col items-start text-left"
        >
          <span className="font-medium">
            {definition?.label ?? `Unknown (${node.type})`}
          </span>
          <span className="w-full truncate text-xs text-muted-foreground">
            {summarise(node)}
          </span>
        </button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          disabled={isFirst}
          onClick={() => handlers.onMove(node.id, -1)}
          aria-label="Move up"
        >
          ↑
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          disabled={isLast}
          onClick={() => handlers.onMove(node.id, 1)}
          aria-label="Move down"
        >
          ↓
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-destructive"
          onClick={() => handlers.onRemove(node.id)}
          aria-label="Remove"
        >
          ✕
        </Button>
      </div>

      {definition?.acceptsChildren && (
        <div className="mt-1 ml-3 border-l pl-3">
          <OutlineList
            nodes={node.children ?? []}
            parentId={node.id}
            {...handlers}
          />
        </div>
      )}
    </div>
  );
}

function AddComponentMenu({
  label,
  onAdd,
}: {
  label: string;
  onAdd: (type: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="justify-start text-muted-foreground"
        >
          + {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        {blockList.map((block) => (
          <DropdownMenuItem key={block.type} onSelect={() => onAdd(block.type)}>
            <div className="flex flex-col">
              <span>{block.label}</span>
              {block.description && (
                <span className="text-xs text-muted-foreground">
                  {block.description}
                </span>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** A short hint under each item so editors can tell instances apart. */
function summarise(node: PageNode): string {
  if (typeof node.props.title === "string" && node.props.title)
    return node.props.title;
  if (node.children)
    return `${node.children.length} item${node.children.length === 1 ? "" : "s"} inside`;
  return "";
}
