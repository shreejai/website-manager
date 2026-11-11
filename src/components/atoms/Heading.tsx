import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type HeadingProps = {
  level?: 1 | 2 | 3;
  children: ReactNode;
  className?: string;
};

const sizes = {
  1: "text-4xl md:text-5xl",
  2: "text-2xl md:text-3xl",
  3: "text-lg md:text-xl",
} as const;

export function Heading({ level = 2, children, className }: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag
      className={cn(
        "font-site font-bold tracking-tight",
        sizes[level],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
