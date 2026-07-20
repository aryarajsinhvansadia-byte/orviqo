export type Solution = {
  slug: string;
  name: string;
  oneLiner: string;
  businessUse: string;
  explain: string[];
  flow: string[];
  useCases: string[];
  cta: string;
};

export const solutions: Solution[] = [
  {
    slug: "ai-agents",
    name: "AI Agents",
    oneLiner: "Software that takes a goal, plans the steps, and does the work.",
    businessUse: "A sales agent that qualifies every lead the minute it arrives.",
    explain: [
      "A chatbot answers; an agent acts. Given a goal, an agent breaks it into steps, uses your business tools, reads authorised company data, executes the workflow — and pauses for human approval where you decide it must.",
      "The live demonstration on our homepage is a real one: it classifies your brief, calls its tools, and plans your project in front of you.",
    ],
    flow: ["Business request", "AI agent", "Reasoning & planning", "Company data", "Tools & APIs", "Action", "Human approval", "Result"],
    useCases: ["Sales agent", "Customer support agent", "Lead qualification", "Research agent", "Operations agent", "HR & finance assistants"],
    cta: "Build an AI agent",
  },
  {
    slug: "multi-agent",
    name: "Multi-Agent Systems",
    oneLiner: "Specialist agents that collaborate on work too big for one.",
    businessUse: "Research, analysis, strategy and reporting — run as a relay, not a bottleneck.",
    explain: [
      "Complex workflows rarely suit one generalist. Multi-agent systems give each step a specialist — one researches, one analyses, one drafts, one checks — coordinated so the output of each feeds the next, with a coordinator keeping the whole run honest.",
    ],
    flow: ["Research agent", "Analysis agent", "Strategy agent", "Execution agent", "Reporting agent"],
    useCases: ["Market research pipelines", "Content production systems", "Due-diligence workflows", "Operations coordination"],
    cta: "Explore multi-agent systems",
  },
  {
    slug: "chatbots",
    name: "Custom AI Chatbots",
    oneLiner: "Assistants that understand any phrasing — not menu trees.",
    businessUse: "A website assistant that answers at 11pm and captures the lead.",
    explain: [
      "Rule-based bots break the moment a customer phrases something unexpectedly. Modern AI assistants understand intent, stay grounded in your approved knowledge, hand over to humans gracefully — and work every hour you don't.",
      "You're one click from a live example: the assistant on this site is exactly this service.",
    ],
    flow: ["Customer question", "AI assistant", "Your knowledge", "Grounded answer", "Lead captured"],
    useCases: ["Website & support chatbots", "Lead generation", "Internal employee assistants", "Knowledge-base & e-commerce assistants"],
    cta: "Get an assistant like ours",
  },
  {
    slug: "rag",
    name: "RAG & Knowledge AI",
    oneLiner: "AI that answers from your documents — not from guesswork.",
    businessUse: "Staff find any policy, SOP or product fact in seconds.",
    explain: [
      "Retrieval-Augmented Generation connects an AI assistant to a secure layer over your own material — PDFs, SOPs, policies, catalogues, FAQs, approved databases — so every answer is grounded in what your company actually knows, with sources.",
      "Access controls, permissions and architecture are designed per client; the assistant only sees what it's authorised to see.",
    ],
    flow: ["Documents & databases", "Secure knowledge layer", "AI assistant", "Grounded answer + source"],
    useCases: ["Employee knowledge assistant", "Customer support assistant", "Sales knowledge assistant", "Policy & product assistants"],
    cta: "Ground AI in your knowledge",
  },
  {
    slug: "voice-ai",
    name: "Voice AI Agents",
    oneLiner: "A phone line that answers instantly, politely, always.",
    businessUse: "An AI receptionist that books appointments and never misses a call.",
    explain: [
      "Voice AI answers calls, handles FAQs, qualifies leads, books and reschedules appointments, routes what it can't handle, and makes follow-up calls — in a voice your customers are happy to talk to.",
      "Try the simulated conversation in our Demo Lab; production systems connect to your real phone lines.",
    ],
    flow: ["Incoming call", "Voice AI", "Intent & answers", "Booking / routing", "Summary to your team"],
    useCases: ["AI receptionist", "Appointment scheduling", "Lead qualification calls", "Support & follow-up calls"],
    cta: "Hear the Voice AI demo",
  },
  {
    slug: "copilots",
    name: "AI Copilots",
    oneLiner: "An expert beside every member of your team.",
    businessUse: "A sales copilot that drafts the proposal while the call is still warm.",
    explain: [
      "A copilot assists a human: drafting, summarising, recommending — the person stays in charge and moves twice as fast. An agent goes further: it executes authorised multi-step workflows itself, within defined controls. Most businesses want both — copilots for judgement work, agents for repeatable work.",
    ],
    flow: ["Team member", "Copilot", "Draft / analysis / recommendation", "Human decides", "Done faster"],
    useCases: ["Sales & marketing copilots", "HR & finance copilots", "Operations & management copilots"],
    cta: "Give your team copilots",
  },
  {
    slug: "document-intelligence",
    name: "Document Intelligence",
    oneLiner: "Paperwork that reads itself.",
    businessUse: "Invoices arrive, get extracted, validated and posted — untouched.",
    explain: [
      "AI-powered document processing classifies what arrives, extracts the fields that matter, validates them against your rules, and sends clean data into your business systems — invoices, forms, contracts, reports. Summaries and intelligent search included.",
    ],
    flow: ["Upload document", "AI processing", "Extract information", "Validate", "Into your systems"],
    useCases: ["Invoice & form processing", "Contract analysis support", "Document summarisation", "Data extraction at volume"],
    cta: "Automate your paperwork",
  },
  {
    slug: "enterprise-search",
    name: "Enterprise AI Search",
    oneLiner: "Ask your company anything, in plain language.",
    businessUse: "“Show me our refund policy for enterprise customers” — answered, with the source.",
    explain: [
      "One search box over your approved internal knowledge — documents, knowledge bases, policies, data sources. Natural-language questions come back as direct answers with references where supported, instead of forty tabs of guesswork.",
    ],
    flow: ["Plain-language question", "AI search", "Approved sources", "Answer + references"],
    useCases: ["Internal knowledge search", "Support macros from real policy", "Onboarding acceleration"],
    cta: "Search everything you know",
  },
  {
    slug: "automation",
    name: "Business Automation",
    oneLiner: "The repetitive 80% of operations, running itself.",
    businessUse: "Every lead qualified, logged, followed up and reported — automatically.",
    explain: [
      "We map your workflows and automate them end to end — CRM, email, WhatsApp, documents, approvals, reporting — with AI in the loop where it earns its keep. Your team keeps the judgement calls; the machinery keeps the motion.",
    ],
    flow: ["Lead comes in", "AI qualification", "CRM", "Automated follow-up", "Sales team", "Conversion", "Analytics"],
    useCases: ["Lead & sales automation", "Invoice and document flows", "Reporting & approvals", "WhatsApp workflows"],
    cta: "Automate your business",
  },
  {
    slug: "orchestration",
    name: "AI Orchestration & Integration",
    oneLiner: "AI connected to your real systems — not isolated demos.",
    businessUse: "Models, agents, CRM, ERP and APIs working as one wired workflow.",
    explain: [
      "The hard part of AI isn't the model — it's the plumbing. We connect AI models and agents to your company data, CRM, ERP, APIs and business tools so intelligence flows through the processes you already run. That's the difference between a demo and an operating system for your business.",
    ],
    flow: ["AI models & agents", "Company data", "CRM / ERP / APIs", "Integrated workflows", "Business outcomes"],
    useCases: ["CRM-connected agents", "ERP data flows", "Cross-tool workflows", "Legacy system bridges"],
    cta: "Wire AI into your stack",
  },
  {
    slug: "custom-ai",
    name: "Custom AI Development",
    oneLiner: "For the requirement no product on a shelf can meet.",
    businessUse: "An internal AI tool shaped exactly to how your business works.",
    explain: [
      "Custom AI applications, internal tools, workflow builds, API integrations, proofs of concept and AI-powered SaaS — scoped tightly, prototyped fast, and engineered to production standard when they prove themselves.",
    ],
    flow: ["Your requirement", "Prototype", "Proof of value", "Production build", "Integration"],
    useCases: ["Internal AI tools", "AI product development", "Proofs of concept", "Model & API integration"],
    cta: "Scope a custom build",
  },
  {
    slug: "governance",
    name: "AI Strategy & Governance",
    oneLiner: "AI adopted deliberately — with guardrails, not vibes.",
    businessUse: "A roadmap of the AI worth doing, and controls for doing it safely.",
    explain: [
      "For organisations that need AI to be auditable: readiness assessment, use-case prioritisation, ROI analysis and a roadmap — then role-based access, human-in-the-loop approvals, guardrails, logging and monitoring designed into everything we ship. We implement responsibly and claim no certification we don't hold.",
    ],
    flow: ["Assess", "Prioritise", "Roadmap", "Pilot", "Govern & monitor"],
    useCases: ["AI readiness assessment", "Use-case prioritisation", "Guardrails & approvals design", "Audit & logging"],
    cta: "Start with strategy",
  },
];

export function getSolution(slug: string) {
  return solutions.find((s) => s.slug === slug);
}
