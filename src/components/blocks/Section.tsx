import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type SectionProps = {
  layout: "full" | "two-column";
  background: "none" | "light" | "brand";
  children?: ReactNode;
};

const backgrounds = {
  none: "",
  light: "bg-site-surface text-site-text",
  brand: "bg-site-brand text-site-on-brand",
} as const;

const layouts = {
  full: "flex flex-col gap-8",
  "two-column": "grid gap-8 md:grid-cols-2",
} as const;

export function Section({ layout, background, children }: SectionProps) {
  return (
    <section className={cn(backgrounds[background])}>
      <div className={cn("mx-auto max-w-6xl px-6 py-12", layouts[layout])}>
        {children}
      </div>
    </section>
  );
}
