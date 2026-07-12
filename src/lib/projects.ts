export type ArtVariant = "rings" | "beam" | "grid" | "dune" | "halo" | "arc";

export type Project = {
  slug: string;
  client: string;
  sector: string;
  location: string;
  year: string;
  narrative: string;
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
    slug: "auren",
    client: "Auren",
    sector: "Private wealth advisory",
    location: "Zürich",
    year: "2025",
    narrative: "Trust, measured in milliseconds.",
    services: ["Web experience", "Brand refresh", "SEO"],
    categories: ["web", "brand", "seo"],
    summary:
      "A wealth advisory whose site had to feel like its meeting rooms: quiet, precise, and impossible to mistake for anyone else's.",
    challenge: [
      "Auren advises families whose relationships with money span generations, yet their site looked like a stock-photo bank from 2016. Prospective clients — often referred by word of mouth — would visit once, feel nothing, and revert to competitors with older names.",
      "The brief had a paradox in it: signal discretion and signal confidence at the same time, to an audience that distrusts anything that tries too hard.",
    ],
    approach: [
      "We removed before we added. The new experience says fewer things, more slowly: a single-column editorial rhythm, oversized numerals for the facts that matter, and micro-interactions timed like a good conversation — responsive, never eager.",
      "Performance became the trust signal. We set a 1-second budget for the largest contentful paint and engineered to it: static generation, zero third-party scripts above the fold, typography loaded before anything decorative.",
      "The intake flow was rebuilt around one insight from client interviews: wealthy families hate forms. Twelve fields became four, and the rest moved into the first human conversation.",
    ],
    outcome: [
      "Qualified enquiries tripled within two quarters, and — the number the partners quote — the average deal size of web-originated clients rose 40%, because the site finally attracted the audience the firm was built for.",
    ],
    metrics: [
      { value: "+212%", label: "Qualified enquiries, 6 months" },
      { value: "0.9s", label: "Largest contentful paint" },
      { value: "3×", label: "Discovery calls booked" },
    ],
    quote: {
      text: "They kept removing things until only the persuasive parts were left. Our enquiries tripled and the site somehow got calmer.",
      author: "Elena Marchetti",
      role: "Managing Partner, Auren",
    },
    art: { from: "#1b2233", to: "#4a5a7a", variant: "rings" },
    featured: true,
  },
  {
    slug: "kilnhouse",
    client: "Kilnhouse",
    sector: "Ceramics atelier · E-commerce",
    location: "Copenhagen",
    year: "2025",
    narrative: "A shop as quiet as a studio at dawn.",
    services: ["E-commerce", "Web experience", "Art direction"],
    categories: ["web", "commerce"],
    summary:
      "A two-person ceramics studio selling out kiln batches in hours — through a shop that feels less like a store and more like a visit.",
    challenge: [
      "Kilnhouse's work sold out at fairs but sat unsold online. Their template shop flattened one-of-a-kind pieces into grid thumbnails, and drop-day traffic crashed the checkout twice.",
      "The founders wanted commerce without the commerce feeling: no urgency banners, no popups, nothing that would embarrass the pieces.",
    ],
    approach: [
      "We designed the catalogue like an exhibition: full-bleed photography, one piece per viewport, provenance notes written by the makers. The cart is a quiet drawer, not a destination.",
      "Each piece carries its kiln batch, glaze recipe and firing date as structured data — collectors care, and so do search engines.",
      "Drops became infrastructure: static pages flip to live inventory at a scheduled second, tested to 50× expected load.",
    ],
    outcome: [
      "The first drop on the new shop sold out in 41 minutes without a single discount code. Online revenue passed fair revenue for the first time in the studio's history.",
    ],
    metrics: [
      { value: "+148%", label: "Online revenue, year one" },
      { value: "41%", label: "Returning customer rate" },
      { value: "41min", label: "First drop sell-out" },
    ],
    quote: {
      text: "ORVIQO treated a two-person pottery studio with the seriousness of a luxury house. The shop paid for itself in nine weeks.",
      author: "Mads Kjeldsen",
      role: "Founder, Kilnhouse",
    },
    art: { from: "#2a2019", to: "#8a6a4f", variant: "dune" },
    featured: true,
  },
  {
    slug: "solace-health",
    client: "Solace Health",
    sector: "Clinic network · Healthcare",
    location: "Toronto",
    year: "2024",
    narrative: "Booking a doctor shouldn't raise your pulse.",
    services: ["Web experience", "AI assistant", "Automation"],
    categories: ["web", "ai"],
    summary:
      "Eleven clinics, one front door: a booking experience and AI concierge that took the phone tree out behind the building.",
    challenge: [
      "Solace's growth had outrun its front desk. Patients waited on hold to ask questions the website technically answered — somewhere. A third of calls were about hours, parking and insurance.",
      "Healthcare raises the stakes on AI: a wrong answer isn't a bug, it's a liability. The client was rightly wary of a chatbot that improvises.",
    ],
    approach: [
      "We rebuilt the site around jobs, not departments: book, prepare, follow up. Every clinic page answers the eight questions the call centre heard most, before anyone has to ask.",
      "The assistant is deliberately narrow. It answers from a verified knowledge base, books into live calendars, and hands off to a human the moment a question smells clinical. Every response cites its source; anything uncertain escalates.",
      "Reception staff got their own dashboard — the assistant drafts, humans approve, and the system learns which drafts get edited.",
    ],
    outcome: [
      "Within four months, 78% of bookings were self-served and call volume fell by nearly two thirds — while patient satisfaction scores went up. The front desk now does the work only humans should.",
    ],
    metrics: [
      { value: "78%", label: "Bookings self-served" },
      { value: "−63%", label: "Front-desk call volume" },
      { value: "4.8/5", label: "Patient experience rating" },
    ],
    quote: {
      text: "The AI assistant they built answers questions our own staff used to get wrong. Call volume dropped by two thirds.",
      author: "Dr. Priya Raman",
      role: "COO, Solace Health",
    },
    art: { from: "#101c1a", to: "#3f7a6e", variant: "halo" },
    featured: true,
  },
  {
    slug: "vantar",
    client: "Vantar",
    sector: "Architecture practice",
    location: "Reykjavík",
    year: "2024",
    narrative: "Buildings deserve better than thumbnails.",
    services: ["Web experience", "Art direction", "Motion design"],
    categories: ["web", "brand"],
    summary:
      "A portfolio that treats architecture the way architecture treats light — slowly, generously, at full scale.",
    challenge: [
      "Vantar designs buildings that win competitions, presented on a site that scrolled like a spreadsheet. International juries and journalists formed their first impression from 240-pixel thumbnails.",
      "Architects are the hardest clients a designer can have. Every margin would be judged.",
    ],
    approach: [
      "One project per scroll. Each building unfolds as a sequence — site, structure, light, detail — with plans and photography given the pacing of a monograph, not a gallery grid.",
      "Motion mirrors the subject: reveals follow sightlines, transitions behave like walking between rooms. Nothing bounces. Concrete doesn't bounce.",
      "The whole site ships as static HTML with images art-directed per breakpoint — a monograph that loads like a landing page.",
    ],
    outcome: [
      "Average session length reached six minutes — unheard of for a portfolio — and within a year the practice attributed three international commissions to first contact through the site.",
    ],
    metrics: [
      { value: "6.1min", label: "Average session length" },
      { value: "3", label: "International commissions attributed" },
      { value: "97", label: "Lighthouse performance" },
    ],
    art: { from: "#16161a", to: "#5c5f6b", variant: "grid" },
    featured: true,
  },
  {
    slug: "loomline",
    client: "Loomline",
    sector: "Logistics AI · SaaS",
    location: "Singapore",
    year: "2025",
    narrative: "Complexity, folded flat.",
    services: ["Brand identity", "Web experience", "Product marketing"],
    categories: ["brand", "web", "seo"],
    summary:
      "A brand and site that make freight optimisation — the least glamorous AI category on earth — feel inevitable to buyers and investors alike.",
    challenge: [
      "Loomline's models were beating incumbents in every pilot, but the company looked like a hackathon project. Enterprise buyers couldn't tell the breakthrough from the noise, and a Series A was six months out.",
      "The founders needed gravity, fast — without pretending to be bigger than eleven people.",
    ],
    approach: [
      "The identity starts from their actual product: routes folding into simpler routes. A line system that untangles as you scroll became the brand's signature — strategy you can watch.",
      "We wrote the site like a term sheet, not a brochure: the problem in numbers, the mechanism in one diagram, the proof in customer arithmetic. Every claim carries a figure.",
      "Product marketing shipped as a system — comparison pages, integration pages and a technical blog engineered to own the queries buyers actually type.",
    ],
    outcome: [
      "Demo requests tripled in a quarter. The site did silent work too: the raise closed oversubscribed, and more than one investor mentioned the website in diligence.",
    ],
    metrics: [
      { value: "3.2×", label: "Demo requests, first quarter" },
      { value: "−38%", label: "Sales-cycle introduction time" },
      { value: "11→46", label: "Ranking keywords, page one" },
    ],
    quote: {
      text: "Investors kept mentioning the website in diligence calls. That has never happened to me before.",
      author: "Wei Lin Tan",
      role: "CEO, Loomline",
    },
    art: { from: "#0f1420", to: "#2f4f8a", variant: "beam" },
  },
  {
    slug: "ondo",
    client: "Ondo",
    sector: "Boutique hotels · Hospitality",
    location: "Kyoto & Lisbon",
    year: "2026",
    narrative: "The feeling of checking in, before you arrive.",
    services: ["Web experience", "Booking", "SEO & growth"],
    categories: ["web", "commerce", "seo"],
    summary:
      "Two hotels on opposite ends of the earth, one digital lobby — and a booking flow calm enough to match the rooms.",
    challenge: [
      "Ondo's rooms photographed beautifully and booked terribly: 70% of reservations came through online travel agencies taking a fifth of every night. The hotel's own site was where intent went to die.",
      "The brand promise is stillness. The old booking flow had eleven steps and a countdown timer.",
    ],
    approach: [
      "We rebuilt the site around the feeling of arrival: full-screen film of morning light in the rooms, sound off, no carousel. The rate calendar is one screen; booking takes three steps and never shouts.",
      "Direct-booking advantages — late checkout, the good rooms, breakfast — are stated once, plainly, where the OTA comparison actually happens.",
      "Structured data does invisible work: room schemas, locality content and multilingual pages built to be the answer when someone asks a machine where to stay in Kyoto.",
    ],
    outcome: [
      "Direct bookings nearly doubled in six months, clawing five figures a month back from commission spend. The site now converts best on the slowest connections — tourists on hotel wifi elsewhere, dreaming.",
    ],
    metrics: [
      { value: "+92%", label: "Direct bookings, 6 months" },
      { value: "−34%", label: "OTA commission spend" },
      { value: "3 steps", label: "Booking flow, was eleven" },
    ],
    quote: {
      text: "Direct bookings almost doubled. The site feels like our lobby — people arrive already relaxed.",
      author: "Sofia Almeida",
      role: "Brand Director, Ondo Hotels",
    },
    art: { from: "#1c1516", to: "#7a4a52", variant: "arc" },
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

export const categories = [
  { id: "all", label: "All" },
  { id: "web", label: "Web" },
  { id: "brand", label: "Brand" },
  { id: "ai", label: "AI" },
  { id: "commerce", label: "Commerce" },
  { id: "seo", label: "SEO" },
] as const;
