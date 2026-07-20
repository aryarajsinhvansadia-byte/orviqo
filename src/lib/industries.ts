export type Industry = {
  slug: string;
  name: string;
  line: string;
  pains: string[];
  plays: { name: string; how: string; href: string }[];
  proof?: string;
};

/**
 * Industry playbooks — written honestly. Where we have real work (healthcare,
 * interiors) we say so; everywhere else we describe what we'd build, not what
 * we've built.
 */
export const industries: Industry[] = [
  {
    slug: "healthcare",
    name: "Healthcare & Diagnostics",
    line: "Trust is the product. The website and the follow-up carry it.",
    pains: [
      "Institutional buyers judge credibility in the first ten seconds",
      "Appointment calls and enquiries arrive faster than staff can answer",
      "Catalogues, reports and referrals live in paperwork",
    ],
    plays: [
      { name: "A credibility-first digital front door", how: "a fast, precise site that institutional buyers trust", href: "/services/#web-digital" },
      { name: "Voice AI for appointment lines", how: "calls answered, booked and routed at any hour", href: "/ai-solutions/#voice-ai" },
      { name: "Document intelligence", how: "referrals, reports and orders extracted into your systems", href: "/ai-solutions/#document-intelligence" },
      { name: "WhatsApp follow-up automation", how: "reminders and results notifications that send themselves", href: "/ai-solutions/#automation" },
    ],
    proof: "Real work: we built Reva Diagnostics' digital presence — see the case study.",
  },
  {
    slug: "interiors-architecture",
    name: "Interiors & Architecture",
    line: "Your portfolio is the pitch. It should feel like your rooms.",
    pains: [
      "Premium work undersold by a generic website",
      "Enquiries arrive at 11pm, after the studio closes",
      "Project updates and client approvals scattered across chats",
    ],
    plays: [
      { name: "An editorial portfolio site", how: "photography-first, quiet, premium — the work does the talking", href: "/services/#web-digital" },
      { name: "A website assistant", how: "answers services, process and fee questions; captures the lead", href: "/ai-solutions/#chatbots" },
      { name: "Consultation booking automation", how: "enquiry → qualified → scheduled, without a phone tag", href: "/ai-solutions/#automation" },
      { name: "Being found for design searches", how: "local SEO plus AI-search readiness for 'interior designer in…'", href: "/services/#seo-ai-search" },
    ],
    proof: "Real work: we built we2 Interiors' studio site — see the case study.",
  },
  {
    slug: "real-estate",
    name: "Real Estate & Construction",
    line: "Every missed enquiry is a buyer touring someone else's project.",
    pains: [
      "Leads from portals, ads and walk-ins go cold in hours",
      "Site visits and follow-ups tracked in someone's head",
      "Brochures answer nothing at 10pm",
    ],
    plays: [
      { name: "Project microsites that sell", how: "one fast page per development, built to convert", href: "/services/#web-digital" },
      { name: "An AI sales agent", how: "qualifies budget and intent, books the site visit", href: "/ai-solutions/#ai-agents" },
      { name: "Lead nurturing automation", how: "every enquiry followed up on time, every time", href: "/ai-solutions/#automation" },
      { name: "Voice AI for enquiry lines", how: "project details and availability answered instantly", href: "/ai-solutions/#voice-ai" },
    ],
  },
  {
    slug: "retail-ecommerce",
    name: "Retail & E-commerce",
    line: "The store that answers fastest wins the basket.",
    pains: [
      "Customers abandon when product questions go unanswered",
      "Support tickets repeat the same twenty questions",
      "Catalogue and inventory content is a full-time job",
    ],
    plays: [
      { name: "High-performance storefronts", how: "commerce experiences that load before doubt does", href: "/services/#web-digital" },
      { name: "A product-aware assistant", how: "answers sizing, stock and shipping; recovers the sale", href: "/ai-solutions/#chatbots" },
      { name: "Order & support automation", how: "status updates, returns and FAQs handled end to end", href: "/ai-solutions/#automation" },
      { name: "AI search visibility", how: "product content structured so machines cite you", href: "/services/#seo-ai-search" },
    ],
  },
  {
    slug: "hospitality",
    name: "Hospitality & Restaurants",
    line: "Bookings happen at midnight. Someone should be awake.",
    pains: [
      "Reservation calls missed during service hours",
      "Menus, events and offers outdated across platforms",
      "Reviews and repeat-guest follow-up left to chance",
    ],
    plays: [
      { name: "A booking-first web presence", how: "menus, moments and reservations without friction", href: "/services/#web-digital" },
      { name: "Voice AI reservations", how: "tables booked, changed and confirmed by phone, 24/7", href: "/ai-solutions/#voice-ai" },
      { name: "Guest follow-up automation", how: "review requests and return-visit offers on autopilot", href: "/ai-solutions/#automation" },
      { name: "Local & maps visibility", how: "found first for 'near me' — by people and by AI answers", href: "/services/#seo-ai-search" },
    ],
  },
  {
    slug: "education",
    name: "Education & Training",
    line: "Parents and students ask the same 40 questions. Answer them once, perfectly.",
    pains: [
      "Admissions enquiries spike seasonally and swamp staff",
      "Course details, fees and dates asked again and again",
      "Follow-up with interested families falls through",
    ],
    plays: [
      { name: "An admissions assistant", how: "courses, fees, eligibility and dates answered instantly", href: "/ai-solutions/#chatbots" },
      { name: "Enquiry-to-enrolment automation", how: "every prospect tracked, reminded and followed up", href: "/ai-solutions/#automation" },
      { name: "A knowledge assistant for staff", how: "policies and procedures searchable in plain language", href: "/ai-solutions/#rag" },
      { name: "A website that reassures", how: "credibility parents can feel before they visit", href: "/services/#web-digital" },
    ],
  },
  {
    slug: "professional-services",
    name: "Professional Services",
    line: "Law, accounting, consulting — billable hours lost to unbillable admin.",
    pains: [
      "Senior time spent on documents a machine could read",
      "Institutional knowledge trapped in inboxes and folders",
      "New-client intake slow and inconsistent",
    ],
    plays: [
      { name: "Document intelligence", how: "contracts, filings and invoices extracted and summarised", href: "/ai-solutions/#document-intelligence" },
      { name: "A firm knowledge assistant", how: "precedents and policies answered with sources", href: "/ai-solutions/#rag" },
      { name: "Client intake automation", how: "conflict checks, forms and onboarding without the back-and-forth", href: "/ai-solutions/#automation" },
      { name: "Copilots for the team", how: "drafts and summaries beside every fee-earner", href: "/ai-solutions/#copilots" },
    ],
  },
  {
    slug: "manufacturing-logistics",
    name: "Manufacturing & Logistics",
    line: "The paperwork moves slower than the goods.",
    pains: [
      "Orders, invoices and delivery notes re-typed between systems",
      "Status questions interrupt operations all day",
      "Dealer and distributor enquiries handled ad hoc",
    ],
    plays: [
      { name: "Order-to-invoice automation", how: "documents flow between ERP, email and accounts untouched", href: "/ai-solutions/#automation" },
      { name: "Document intelligence", how: "POs and delivery notes extracted, validated, filed", href: "/ai-solutions/#document-intelligence" },
      { name: "A dealer support assistant", how: "pricing, stock and dispatch questions answered instantly", href: "/ai-solutions/#chatbots" },
      { name: "Systems orchestration", how: "AI wired into the ERP and tools you already run", href: "/ai-solutions/#orchestration" },
    ],
  },
];

export function getIndustry(slug: string) {
  return industries.find((i) => i.slug === slug);
}
