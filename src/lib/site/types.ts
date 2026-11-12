export type SiteTheme = {
  colors: {
    brand: string;
    onBrand: string; // text colour on top of brand
    surface: string; // "light" section background
    text: string;
    background: string;
  };
  radius: string; // e.g. "0", "1rem"
  font: string; // CSS font-family stack
};

export type Site = {
  slug: string; // used in URLs: /sites/[slug]/...
  name: string;
  theme: SiteTheme;
};
