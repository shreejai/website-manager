"use client";

import { useActionState } from "react";
import { createPageAction, type CreatePageState } from "@/app/manager/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: CreatePageState = { error: null };

export function NewPageForm({ siteSlug }: { siteSlug: string }) {
  const [state, formAction, pending] = useActionState(
    createPageAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="siteSlug" value={siteSlug} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Page title</Label>
        <Input
          id="title"
          name="title"
          required
          placeholder="Tickets"
          defaultValue={state.values?.title}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="path">URL path</Label>
        <Input
          id="path"
          name="path"
          required
          placeholder="/tickets"
          defaultValue={state.values?.path}
        />
        <p className="text-xs text-muted-foreground">
          Lowercase letters, numbers and dashes, e.g. /tickets or /news/2026
        </p>
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Creating…" : "Create page"}
      </Button>
    </form>
  );
}
