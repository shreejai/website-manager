import type { CSSProperties } from "react";
import type { SiteTheme } from "./types";

/** Maps theme tokens onto the --site-* CSS variables the components use. */
export function themeToCssVars(theme: SiteTheme): CSSProperties {
  return {
    "--site-brand": theme.colors.brand,
    "--site-on-brand": theme.colors.onBrand,
    "--site-surface": theme.colors.surface,
    "--site-text": theme.colors.text,
    "--site-bg": theme.colors.background,
    "--site-radius": theme.radius,
    "--site-font": theme.font,
  } as CSSProperties;
}
