export type Service = {
  slug: string;
  name: string;
  line: string;
  summary: string;
  detail: string[];
  deliverables: string[];
  tags: string[];
};

export const services: Service[] = [
  {
    slug: "web-experiences",
    name: "Web Experiences",
    line: "Websites that feel engineered, because they are.",
    summary:
      "Design and engineering as one motion — sites that load before doubt does, and read beautifully on every screen they meet.",
    detail: [
      "Most agencies design a picture, then hand it to someone else to build. We don't hand off. The people who set the type also set the performance budget, so nothing gets lost between the idea and the shipped page.",
      "Every build starts from a content model and a speed target, not a template. The result is a site that ranks, converts, and still feels like yours three years from now.",
    ],
    deliverables: [
      "Art direction & UI design",
      "Next.js / React engineering",
      "CMS architecture & content modelling",
      "E-commerce & payment flows",
      "Motion design & interaction systems",
      "Performance budgets & Core Web Vitals",
    ],
    tags: ["Design", "Next.js", "CMS", "Commerce", "Motion"],
  },
  {
    slug: "ai-solutions",
    name: "AI Solutions",
    line: "Intelligence that works the back of the house.",
    summary:
      "Assistants, automation and search that quietly remove work — your customers feel the speed, never the machinery.",
    detail: [
      "The best AI on a website is the kind visitors never think about: answers that arrive instantly, forms that fill themselves, support that resolves before it escalates.",
      "We scope AI by the job it does, not the demo it makes. If a feature doesn't save your team hours or win your customers time, we'll tell you — and build the smaller thing that does.",
    ],
    deliverables: [
      "Customer assistants & concierge chat",
      "Workflow & back-office automation",
      "AI-powered site search & recommendations",
      "Content operations & pipelines",
      "Model selection, evaluation & guardrails",
      "Integration with your existing stack",
    ],
    tags: ["Assistants", "Automation", "Search", "Integration"],
  },
  {
    slug: "brand-identity",
    name: "Brand & Identity",
    line: "A face people can pick out of a crowd.",
    summary:
      "Naming, identity systems and art direction with enough restraint to last — brands built for memory, not for launch day.",
    detail: [
      "Trends are rented; identity is owned. We design marks, type systems and voice that hold their shape across a decade of touchpoints — from a favicon to the side of a building.",
      "Everything ships as a living system: tokens, templates and rules your team can actually use, so the brand stays sharp long after the handover call.",
    ],
    deliverables: [
      "Brand strategy & positioning",
      "Visual identity & logo systems",
      "Typography & colour systems",
      "Voice, tone & messaging",
      "Motion identity",
      "Brand guidelines & asset libraries",
    ],
    tags: ["Strategy", "Identity", "Art direction", "Guidelines"],
  },
  {
    slug: "seo-growth",
    name: "SEO & Growth",
    line: "Be the answer, not the ad.",
    summary:
      "Technical SEO, content systems and AI-search readiness — engineered so machines cite you and humans choose you.",
    detail: [
      "Search has split in two: classic results and AI answers. We build for both — clean semantics and structured data for the crawlers, genuinely useful content for the models that now summarise the web.",
      "No dashboards for the sake of dashboards. We track the numbers that pay invoices: qualified enquiries, direct bookings, revenue per visit.",
    ],
    deliverables: [
      "Technical SEO & site architecture",
      "Structured data & AI-answer readiness",
      "Content strategy & editorial systems",
      "Local & international SEO",
      "Analytics & conversion measurement",
      "Quarterly growth reviews",
    ],
    tags: ["Technical SEO", "AEO", "Content", "Analytics"],
  },
  {
    slug: "continuous-care",
    name: "Continuous Care",
    line: "Websites are gardens, not statues.",
    summary:
      "A standing retainer of design, engineering and experimentation — so your site improves every month it's alive.",
    detail: [
      "The launch is the starting line. Sites that win compound: small experiments, steady refinements, and a team that already knows the codebase when the big idea arrives.",
      "Care clients get a named crew, a monthly cadence, and honest reports — what we changed, what it did, what's next.",
    ],
    deliverables: [
      "Design & engineering retainers",
      "A/B testing & CRO",
      "Content & campaign support",
      "Performance & uptime monitoring",
      "Security & dependency updates",
      "Monthly impact reports",
    ],
    tags: ["Retainer", "CRO", "Support", "Iteration"],
  },
];
