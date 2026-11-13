import type { PageDocument } from "@/lib/page/types";

const img = (seed: string, alt: string) => ({
  url: `https://picsum.photos/seed/${seed}/600/450`,
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
                  image: img("wb-p1", "Captain"),
                  heading: "Captain",
                  link: {
                    label: "About the team",
                    href: "/sites/wallabies/about",
                  },
                },
                {
                  image: img("wb-p2", "Vice-captain"),
                  heading: "Vice-captain",
                },
                { image: img("wb-p3", "Head coach"), heading: "Head coach" },
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
                  image: img("wb-f1", "Stadium"),
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
                  image: img("wb-n1", "Training"),
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
                  image: img("wb-h1", "Early years"),
                  heading: "The early years",
                },
                {
                  image: img("wb-h2", "World Cup"),
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
                  image: img("hr-c1", "North club"),
                  heading: "North Harbour RFC",
                  link: {
                    label: "Learn more",
                    href: "/sites/harbour-rugby/about",
                  },
                },
                {
                  image: img("hr-c2", "East club"),
                  heading: "Eastern Suburbs RFC",
                },
                {
                  image: img("hr-c3", "West club"),
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
                      image: img("hr-j1", "Juniors"),
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
                      image: img("hr-w1", "Women's team"),
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
                { image: img("hr-b1", "Chair"), heading: "Chair" },
                { image: img("hr-b2", "CEO"), heading: "Chief Executive" },
              ],
            },
          },
        ],
      },
    ],
  },
];
