export type ArtVariant = "rings" | "beam" | "grid" | "dune" | "halo" | "arc";

export type Project = {
  slug: string;
  client: string;
  sector: string;
  location: string;
  year: string;
  narrative: string;
  liveUrl?: string;
  cover?: string;
  services: string[];
  categories: ("web" | "brand" | "ai" | "commerce" | "seo")[];
  summary: string;
  challenge: string[];
  approach: string[];
  outcome: string[];
  metrics: { value: string; label: string }[];
  quote?: { text: string; author: string; role: string };
  art: { from: string; to: string; variant: ArtVariant };
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "we2-interiors",
    client: "we2 Interiors",
    sector: "Interior & architecture studio",
    location: "Vadodara",
    year: "2025",
    narrative: "Rooms that feel inevitable.",
    liveUrl: "https://we2interiors.com",
    cover: "/work/we2-interiors.jpg",
    services: ["Web experience", "Art direction", "Brand identity"],
    categories: ["web", "brand"],
    summary:
      "An editorial, project-led site for an interior and architecture studio — restrained enough to match the quiet-luxury spaces it presents.",
    challenge: [
      "we2 designs interiors and architecture built to age well — limed oak, brushed brass, rooms meant to feel inevitable a decade on. A studio like that lives or dies on how its work photographs and how considered it appears online, and a templated portfolio would have flattened exactly the craft it sells.",
      "The brief was really one word: restraint. The site had to carry the same quiet confidence as the interiors, without a single loud gesture.",
    ],
    approach: [
      "We designed the site like a monograph — one project at a time, photography given room to breathe, typography and whitespace doing the work that decoration usually does. Completed residences are told in full rather than reduced to a grid of thumbnails.",
      "Seven disciplines, from residential to hospitality to turnkey, are presented under one calm identity, with a journal for the studio's design thinking.",
      "Everything was built bespoke on a modern static stack — fast, editorial, and unmistakably theirs.",
    ],
    outcome: [
      "we2 now presents online with the same restraint as its interiors: a portfolio that treats each project as a story, and a site that quietly signals the studio's standard before a prospect ever picks up the phone.",
    ],
    metrics: [
      { value: "7", label: "Disciplines, one identity" },
      { value: "Editorial", label: "Every project told in full" },
      { value: "Bespoke", label: "Designed, never templated" },
    ],
    art: { from: "#241d16", to: "#7a6248", variant: "dune" },
    featured: true,
  },
  {
    slug: "reva-diagnostics",
    client: "Reva Diagnostics",
    sector: "Medical devices & diagnostics",
    location: "Vadodara",
    year: "2025",
    narrative: "Credibility, catalogued.",
    liveUrl: "https://revadiagnostics.com",
    cover: "/work/reva-diagnostics.jpg",
    services: ["Web experience", "Content architecture", "SEO"],
    categories: ["web", "seo"],
    summary:
      "A fully static website for a medical-supply company — presenting a deep catalogue of analysers, diagnostic kits and lab consumables to the institutional buyers who purchase them.",
    challenge: [
      "Reva Diagnostics supplies devices, diagnostic kits and laboratory consumables to hospitals and pathology labs — buyers who commit only once they trust the supplier. Their range spans proprietary biochemistry and haematology analysers alongside hundreds of third-party products, and it all had to be legible to a procurement officer scanning quickly.",
      "In healthcare supply, credibility is the whole sale. The site had to make certifications, turnaround and product breadth obvious in seconds, not buried three clicks deep.",
    ],
    approach: [
      "We built the catalogue around how buyers actually shop: clear product families, the in-house analyser line given its own space, and consumables organised so nothing gets lost. Compliance — ISO 13485, CE — is surfaced early rather than tucked into a footer.",
      "The whole site ships as a static export on a global CDN, so it loads fast and there is no server to break or patch. An enquiry flow turns a product page into a quote request in a couple of clicks.",
      "The build auto-deploys: the Reva team pushes a change and the live site updates itself, no developer in the loop.",
    ],
    outcome: [
      "Reva now has a credible digital front door for institutional buyers — a place where a lab manager can find a product, verify certification, and request a quote without friction. The catalogue is structured for search engines as cleanly as it is for people.",
    ],
    metrics: [
      { value: "500+", label: "Products organised for buyers" },
      { value: "Static", label: "Zero-server, CDN-delivered" },
      { value: "Auto", label: "Publishes on every edit" },
    ],
    art: { from: "#0e1a24", to: "#2f6f7a", variant: "halo" },
    featured: true,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function nextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}

const allCategories = [
  { id: "all", label: "All" },
  { id: "web", label: "Web" },
  { id: "brand", label: "Brand" },
  { id: "ai", label: "AI" },
  { id: "commerce", label: "Commerce" },
  { id: "seo", label: "SEO" },
] as const;

/** Only surface filters that actually have work behind them. */
export const categories = allCategories.filter(
  (c) => c.id === "all" || projects.some((p) => p.categories.includes(c.id as never))
);
