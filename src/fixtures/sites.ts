import type { Site } from "@/lib/site/types";

export const sites: Site[] = [
  {
    slug: "wallabies",
    name: "Wallabies",
    theme: {
      colors: {
        brand: "#00573f", // deep green
        onBrand: "#ffd100", // gold text on green
        surface: "#fff6cc", // pale gold
        text: "#0b2e22",
        background: "#ffffff",
      },
      radius: "0", // sharp, bold
      font: '"Arial Black", "Helvetica Neue", Arial, sans-serif',
    },
  },
  {
    slug: "harbour-rugby",
    name: "Harbour Rugby Union",
    theme: {
      colors: {
        brand: "#0f1f4b", // navy
        onBrand: "#ffffff",
        surface: "#e6f4f8", // pale harbour blue
        text: "#1c2433",
        background: "#fafaf7",
      },
      radius: "1rem", // soft, rounded
      font: 'Georgia, "Times New Roman", serif',
    },
  },
];
