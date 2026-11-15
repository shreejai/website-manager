import type { PageDocument } from "@/lib/page/types";

// Unsplash CDN photos (Unsplash License, free to use). Pass the "photo-…" id.
const img = (photoId: string, alt: string) => ({
  url: `https://images.unsplash.com/photo-${photoId}?w=600&h=450&fit=crop&auto=format`,
  alt,
});

export const pages: PageDocument[] = [
  // ---------------- Wallabies ----------------
  {
    siteSlug: "wallabies",
    path: "/",
    title: "Home",
    root: [
      {
        id: "wb-home-s1",
        type: "section",
        props: { layout: "full", background: "brand" },
        children: [
          {
            id: "wb-home-squad",
            type: "cardGrid",
            props: {
              title: "Meet the squad",
              cards: [
                {
                  image: img("1495329167757-7a95435de2d7", "Captain"),
                  heading: "Captain",
                  link: {
                    label: "About the team",
                    href: "/sites/wallabies/about",
                  },
                },
                {
                  image: img("1512299286776-c18be8ed6a1a", "Vice-captain"),
                  heading: "Vice-captain",
                },
                { image: img("1600679472868-eae382e28b34", "Head coach"), heading: "Head coach" },
              ],
            },
          },
        ],
      },
      {
        id: "wb-home-s2",
        type: "section",
        props: { layout: "two-column", background: "light" },
        children: [
          {
            id: "wb-home-fixtures",
            type: "cardGrid",
            props: {
              title: "Upcoming fixtures",
              cards: [
                {
                  image: img("1529663297269-6d349ec39b57", "Stadium"),
                  heading: "Round 1 vs New Zealand",
                },
              ],
            },
          },
          {
            id: "wb-home-news",
            type: "cardGrid",
            props: {
              title: "Latest news",
              cards: [
                {
                  image: img("1652107958116-c50793d81b0f", "Training"),
                  heading: "Squad named for spring tour",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    siteSlug: "wallabies",
    path: "/about",
    title: "About",
    root: [
      {
        id: "wb-about-s1",
        type: "section",
        props: { layout: "full", background: "none" },
        children: [
          {
            id: "wb-about-history",
            type: "cardGrid",
            props: {
              title: "Our history",
              cards: [
                {
                  image: img("1501176395966-be7bab349695", "Early years"),
                  heading: "The early years",
                },
                {
                  image: img("1646350639591-e324c3e72b9c", "World Cup"),
                  heading: "World Cup moments",
                },
              ],
            },
          },
        ],
      },
    ],
  },

  // ---------------- Harbour Rugby Union ----------------
  {
    siteSlug: "harbour-rugby",
    path: "/",
    title: "Home",
    root: [
      {
        id: "hr-home-s1",
        type: "section",
        props: { layout: "full", background: "light" },
        children: [
          {
            id: "hr-home-clubs",
            type: "cardGrid",
            props: {
              title: "Our clubs",
              cards: [
                {
                  image: img("1480099225005-2513c8947aec", "North club"),
                  heading: "North Harbour RFC",
                  link: {
                    label: "Learn more",
                    href: "/sites/harbour-rugby/about",
                  },
                },
                {
                  image: img("1496224027003-38fc92be458c", "East club"),
                  heading: "Eastern Suburbs RFC",
                },
                {
                  image: img("1512299286776-c18be8ed6a1a", "West club"),
                  heading: "Western Bays RFC",
                },
              ],
            },
          },
        ],
      },
      {
        id: "hr-home-s2",
        type: "section",
        props: { layout: "full", background: "brand" },
        children: [
          {
            id: "hr-home-s3",
            type: "section",
            props: { layout: "two-column", background: "none" },
            children: [
              {
                id: "hr-home-juniors",
                type: "cardGrid",
                props: {
                  title: "Juniors",
                  cards: [
                    {
                      image: img("1679183446745-90d449f8ede0", "Juniors"),
                      heading: "Register for 2027",
                    },
                  ],
                },
              },
              {
                id: "hr-home-womens",
                type: "cardGrid",
                props: {
                  title: "Women's rugby",
                  cards: [
                    {
                      image: img("1534583000938-a375b825ea16", "Women's team"),
                      heading: "Premier grade draw",
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    siteSlug: "harbour-rugby",
    path: "/about",
    title: "About",
    root: [
      {
        id: "hr-about-s1",
        type: "section",
        props: { layout: "full", background: "none" },
        children: [
          {
            id: "hr-about-board",
            type: "cardGrid",
            props: {
              title: "Our board",
              cards: [
                { image: img("1696603865152-74514c198a07", "Chair"), heading: "Chair" },
                { image: img("1791573454886-e674df80132e", "CEO"), heading: "Chief Executive" },
              ],
            },
          },
        ],
      },
    ],
  },
];
