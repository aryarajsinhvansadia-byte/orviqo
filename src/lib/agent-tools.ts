import { projects } from "@/lib/projects";
import { processPhases } from "@/lib/content";

/**
 * Tools for the public agent demonstration ("Agent Theatre").
 * Deterministic functions over the site's own data — the agent decides when
 * to call them; the results are real, never hallucinated.
 */

export const DEMO_TOOLS = [
  {
    name: "classify_brief",
    description:
      "Classify a prospective client's project brief. Call this first, once, with the raw brief.",
    input_schema: {
      type: "object" as const,
      properties: {
        brief: { type: "string", description: "The client's brief, verbatim" },
      },
      required: ["brief"],
    },
  },
  {
    name: "match_case_study",
    description:
      "Find ORVIQO's most relevant shipped case study for a classified sector and needs. Call after classify_brief.",
    input_schema: {
      type: "object" as const,
      properties: {
        sector: { type: "string" },
        needs: { type: "array", items: { type: "string" } },
      },
      required: ["sector", "needs"],
    },
  },
  {
    name: "estimate_timeline",
    description:
      "Estimate a delivery timeline band from the classified needs, using ORVIQO's real five-phase process.",
    input_schema: {
      type: "object" as const,
      properties: {
        needs: { type: "array", items: { type: "string" } },
      },
      required: ["needs"],
    },
  },
];

const NEED_KEYWORDS: Record<string, string[]> = {
  "web experience": ["website", "web", "site", "landing", "portfolio", "online presence", "redesign"],
  "e-commerce": ["shop", "store", "commerce", "sell", "cart", "checkout", "product catalog", "catalogue"],
  "booking & scheduling": ["booking", "appointment", "reserve", "schedule", "no-show", "calendar"],
  "ai assistant": ["ai", "chatbot", "assistant", "automation", "agent", "whatsapp bot"],
  "brand identity": ["brand", "logo", "identity", "rebrand", "naming"],
  "seo & growth": ["seo", "google", "rank", "traffic", "leads", "enquiries", "growth", "marketing"],
};

const SECTOR_KEYWORDS: Record<string, string[]> = {
  healthcare: ["clinic", "dental", "doctor", "patient", "hospital", "diagnostic", "lab", "medical", "pharma", "health"],
  "interiors & architecture": ["interior", "architect", "furniture", "design studio", "real estate", "construction"],
  hospitality: ["hotel", "restaurant", "cafe", "resort", "spa", "salon"],
  retail: ["shop", "store", "boutique", "retail", "brand", "d2c"],
  "professional services": ["consult", "law", "account", "agency", "finance", "advisory"],
  technology: ["saas", "startup", "app", "software", "platform", "tech"],
};

export function classifyBrief(brief: string) {
  const b = brief.toLowerCase();
  const needs = Object.entries(NEED_KEYWORDS)
    .filter(([, kws]) => kws.some((k) => b.includes(k)))
    .map(([need]) => need);
  const sector =
    Object.entries(SECTOR_KEYWORDS).find(([, kws]) => kws.some((k) => b.includes(k)))?.[0] ??
    "general business";
  return {
    sector,
    needs: needs.length ? needs : ["web experience"],
    complexity: needs.length > 2 ? "multi-craft" : "focused",
  };
}

export function matchCaseStudy(sector: string, needs: string[]) {
  const healthcareish = /health|medical|clinic|diagnostic/.test(sector);
  const brandish = needs.some((n) => /brand|e-commerce/.test(n)) || /interior|hospitality|retail/.test(sector);
  const pick = healthcareish
    ? projects.find((p) => p.slug === "reva-diagnostics")!
    : brandish
      ? projects.find((p) => p.slug === "we2-interiors")!
      : projects[0];
  return {
    caseStudy: pick.client,
    sector: pick.sector,
    whyRelevant: healthcareish
      ? "Same trust-first sector: a healthcare supplier whose site had to make credibility instant."
      : "Closest craft match: a brand-led build where restraint and identity carried the sale.",
    liveUrl: pick.liveUrl,
    headline: pick.metrics[0],
  };
}

export function estimateTimeline(needs: string[]) {
  const base = 6;
  const extra = Math.min(needs.length - 1, 3) * 2;
  const weeks = `${base}–${base + extra + 2} weeks`;
  return {
    band: weeks,
    phases: processPhases.map((p) => `${p.name} (${p.duration})`),
    note: "Fixed scope and a written range after one call — no meter running.",
  };
}

export function runDemoTool(name: string, input: Record<string, unknown>) {
  switch (name) {
    case "classify_brief":
      return classifyBrief(String(input.brief ?? ""));
    case "match_case_study":
      return matchCaseStudy(String(input.sector ?? ""), (input.needs as string[]) ?? []);
    case "estimate_timeline":
      return estimateTimeline((input.needs as string[]) ?? []);
    default:
      return { error: `unknown tool: ${name}` };
  }
}
