import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

const variants = {
  primary: "bg-site-brand text-site-on-brand hover:opacity-90",
  secondary: "border border-current hover:bg-black/5",
} as const;

/** Site CTAs are links, so Button renders a Link styled as a button. */
export function Button({
  href,
  children,
  variant = "primary",
  className,
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center rounded-site px-4 py-2 text-sm font-semibold transition",
        variants[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
