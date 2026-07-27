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
    slug: "web-digital",
    name: "Web & Digital Experiences",
    line: "High-performance experiences, not just websites.",
    summary:
      "Design and engineering as one motion — sites, web apps and stores that load before doubt does, and increasingly, think for themselves.",
    detail: [
      "Most agencies design a picture, then hand it to someone else to build. We don't hand off. The people who set the type also set the performance budget, so nothing gets lost between the idea and the shipped page.",
      "And the modern site is no longer static: we build AI-powered websites with chat assistants, intelligent search, automated lead qualification, smart forms and personalised experiences — the kind of front door that works your night shift.",
    ],
    deliverables: [
      "Website design & development",
      "AI-powered websites (assistants, intelligent search, smart forms)",
      "Custom web applications",
      "E-commerce & landing pages",
      "UI/UX design & redesigns",
      "Performance optimisation & maintenance",
      "Hosting, cloud deployment & API integrations",
    ],
    tags: ["Design", "Next.js", "AI-powered", "Commerce", "Cloud"],
  },
  {
    slug: "mobile-apps",
    name: "Mobile Apps",
    line: "Your business, on the home screen.",
    summary:
      "iOS and Android apps for businesses that want to live in a customer's pocket — not just be found once and forgotten.",
    detail: [
      "A website is where people find you. An app is where they come back to you. For clinics taking bookings, restaurants taking orders, or any business with customers who return, that difference is the whole point.",
      "We build once and ship to both stores — the same app on iPhone and Android, so you're not paying twice. Where an app would be overkill, we say so and build an installable web app instead: it goes on the home screen, works offline, and costs nothing in store fees.",
    ],
    deliverables: [
      "iOS & Android apps, built once for both",
      "Installable web apps (PWA) — no store fees",
      "Booking, ordering & customer-account apps",
      "Push notifications & offline support",
      "AI built in — assistants, voice, automation",
      "App Store & Google Play submission",
      "Updates, monitoring & ongoing care",
    ],
    tags: ["iOS", "Android", "PWA", "Push", "Offline"],
  },
  {
    slug: "seo-ai-search",
    name: "SEO & AI Search",
    line: "Found by people. Cited by machines.",
    summary:
      "Search has split in two — classic results and AI answers. We engineer visibility across both, honestly.",
    detail: [
      "Traditional SEO still pays the bills: technical foundations, local presence, content that answers real questions. We do that rigorously — semantics, structured data, Core Web Vitals, analytics that track enquiries rather than vanity numbers.",
      "Alongside it sits the new discipline: AEO and GEO — structuring your content, authority and data so AI-driven search experiences can understand and cite you. No one can guarantee an AI will mention your business; anyone who promises that is selling weather. What we do is make you the clearest, best-structured source in your category — for crawlers and for the models that now summarise the web.",
    ],
    deliverables: [
      "Technical, local, e-commerce & content SEO",
      "AEO — answer engine optimisation",
      "GEO — generative engine optimisation",
      "Schema & structured data",
      "Search analytics & conversion measurement",
      "Quarterly growth reviews",
    ],
    tags: ["Technical SEO", "AEO", "GEO", "Content", "Analytics"],
  },
  {
    slug: "ai-agentic",
    name: "AI & Agentic Solutions",
    line: "From assistants that answer to agents that act.",
    summary:
      "Our flagship craft: chatbots, knowledge AI, voice, copilots and true agents — planned, guarded and wired into your real operations.",
    detail: [
      "This is the full AI bench: custom chat assistants grounded in your own knowledge (RAG), voice AI for calls, copilots that sit beside your team, document intelligence that reads paperwork, enterprise search across everything you know — and at the top, agentic AI: systems that understand a goal, plan the steps, use your tools and execute, asking a human when it matters.",
      "We build these with guardrails as a feature, not an afterthought — role-based access, human-in-the-loop approvals, logging and auditability. Try the live agent on our homepage: what it does for your brief is exactly the pattern we ship inside client businesses.",
    ],
    deliverables: [
      "AI agents & agentic workflows",
      "Multi-agent systems",
      "Custom AI chatbots & assistants",
      "RAG & enterprise knowledge AI",
      "Voice AI agents",
      "AI copilots for teams",
      "Document intelligence",
      "Enterprise AI search",
    ],
    tags: ["Agents", "RAG", "Voice", "Copilots", "Guardrails"],
  },
  {
    slug: "automation",
    name: "Business Automation",
    line: "Workflows that run themselves.",
    summary:
      "The repetitive 80% of operations — follow-ups, paperwork, reporting — automated end to end, with AI where it earns its keep.",
    detail: [
      "Every business has invisible payroll: hours spent moving leads into spreadsheets, chasing follow-ups, retyping invoices, assembling reports. We map those flows and automate them — CRM, email, WhatsApp, documents, approvals — so the work happens the moment it should, every time.",
      "A typical build: a lead arrives, AI qualifies it, your CRM is updated, the follow-up sends itself, sales gets a clean handover, and the numbers land in one report. Your team keeps the judgement calls; the machinery keeps the motion.",
    ],
    deliverables: [
      "Workflow, CRM & email automation",
      "WhatsApp workflow integration",
      "Lead management & sales automation",
      "Invoice, document & data-entry automation",
      "Reporting automation & approval workflows",
      "AI + RPA and API integrations",
    ],
    tags: ["Workflows", "CRM", "WhatsApp", "Documents", "Integration"],
  },
  {
    slug: "custom-software",
    name: "Custom Software & AI Products",
    line: "Where off-the-shelf ends, we begin.",
    summary:
      "Custom applications, internal tools and AI-powered products — from proof of concept to production.",
    detail: [
      "Some problems don't fit a template: an internal tool your whole operation would live in, an AI product you want to take to market, a prototype that has to earn its funding. We design and engineer these as products — scoped tightly, shipped fast, built to grow.",
      "Because we work AI-first, intelligence is a component we design with, not bolt on: model integration, evaluation and guardrails are part of the architecture from day one.",
    ],
    deliverables: [
      "Custom AI applications & internal tools",
      "AI-powered SaaS development",
      "Prototypes & proofs of concept",
      "AI model & API integration",
      "Product design & engineering",
    ],
    tags: ["Products", "Internal tools", "SaaS", "Prototypes"],
  },
  {
    slug: "ai-consulting",
    name: "AI Strategy & Consulting",
    line: "Know where AI pays before you spend.",
    summary:
      "For businesses that know AI matters but not where to start — a disciplined path from readiness to running systems.",
    detail: [
      "The arc is always the same: assess readiness, analyse the processes, identify the opportunities, prioritise the use cases by ROI and feasibility, then prove it — a roadmap, a prototype, an implementation, and the monitoring to keep it honest.",
      "We'd rather talk you out of AI you don't need than sell you a demo that dies in a drawer. The deliverable is working systems and a team that trusts them — with governance, access controls and human approval built in for the enterprise cases that demand it.",
    ],
    deliverables: [
      "AI readiness assessment",
      "Business process analysis & use-case prioritisation",
      "ROI & feasibility assessment",
      "AI roadmap, prototypes & proofs of concept",
      "Implementation, integration & optimisation",
      "Governance, guardrails & human-in-the-loop design",
    ],
    tags: ["Strategy", "Readiness", "Roadmap", "Governance"],
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
    slug: "continuous-care",
    name: "Continuous Care",
    line: "Systems are gardens, not statues.",
    summary:
      "A standing retainer of design, engineering and experimentation — so everything we build keeps improving every month it's alive.",
    detail: [
      "The launch is the starting line. Sites, automations and AI systems that win compound: small experiments, steady refinements, and a team that already knows the codebase when the big idea arrives.",
      "Care clients get a named crew, a monthly cadence, and honest reports — what we changed, what it did, what's next.",
    ],
    deliverables: [
      "Design & engineering retainers",
      "A/B testing & CRO",
      "AI model & automation upkeep",
      "Performance & uptime monitoring",
      "Security & dependency updates",
      "Monthly impact reports",
    ],
    tags: ["Retainer", "CRO", "Support", "Iteration"],
  },
];
