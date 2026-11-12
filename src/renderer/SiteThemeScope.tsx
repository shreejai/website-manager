import type { ReactNode } from "react";
import type { SiteTheme } from "@/lib/site/types";
import { themeToCssVars } from "@/lib/site/theme";

/** Applies a site's theme to everything inside it. */
export function SiteThemeScope({
  theme,
  children,
}: {
  theme: SiteTheme;
  children: ReactNode;
}) {
  return (
    <div
      style={themeToCssVars(theme)}
      className="min-h-screen bg-site-bg font-site text-site-text"
    >
      {children}
    </div>
  );
}
