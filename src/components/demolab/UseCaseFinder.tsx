"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * "Find your AI use case" — five choices in, a tailored shortlist out.
 * Deterministic mapping onto the real solutions catalogue.
 */
const DEPARTMENTS = [
  { label: "Sales", picks: ["ai-agents", "automation", "copilots"] },
  { label: "Marketing", picks: ["copilots", "automation", "chatbots"] },
  { label: "Customer service", picks: ["chatbots", "voice-ai", "rag"] },
  { label: "Operations", picks: ["automation", "document-intelligence", "ai-agents"] },
  { label: "HR & finance", picks: ["document-intelligence", "copilots", "enterprise-search"] },
  { label: "Management", picks: ["enterprise-search", "governance", "copilots"] },
] as const;

const CHALLENGES = [
  { label: "We miss enquiries & follow-ups", add: "automation" },
  { label: "Answers live in people's heads", add: "rag" },
  { label: "Too much manual paperwork", add: "document-intelligence" },
  { label: "Phones ring unanswered", add: "voice-ai" },
  { label: "We don't know where to start with AI", add: "governance" },
] as const;

const NAMES: Record<string, { name: string; why: string }> = {
  "ai-agents": { name: "AI Agents", why: "an agent that qualifies and progresses work the moment it arrives" },
  "multi-agent": { name: "Multi-Agent Systems", why: "specialists collaborating on your heaviest workflow" },
  chatbots: { name: "Custom AI Chatbots", why: "instant, grounded answers for every customer, any hour" },
  rag: { name: "RAG & Knowledge AI", why: "your documents becoming answers your team can search" },
  "voice-ai": { name: "Voice AI Agents", why: "a receptionist that never lets a call ring out" },
  copilots: { name: "AI Copilots", why: "drafts, summaries and recommendations beside every seat" },
  "document-intelligence": { name: "Document Intelligence", why: "paperwork that extracts and files itself" },
  "enterprise-search": { name: "Enterprise AI Search", why: "one question box over everything the company knows" },
  automation: { name: "Business Automation", why: "the repetitive 80% running without anyone touching it" },
  governance: { name: "AI Strategy & Governance", why: "a prioritised roadmap before a rupee is spent" },
};

export default function UseCaseFinder() {
  const [dept, setDept] = useState<number | null>(null);
  const [challenge, setChallenge] = useState<number | null>(null);

  const picks: string[] = [];
  if (dept !== null) picks.push(...DEPARTMENTS[dept].picks);
  if (challenge !== null) picks.unshift(CHALLENGES[challenge].add);
  const unique = [...new Set(picks)].slice(0, 3);

  return (
    <div>
      <p className="eyebrow mb-4">Your department</p>
      <div className="flex flex-wrap gap-2">
        {DEPARTMENTS.map((d, i) => (
          <button
            key={d.label}
            type="button"
            onClick={() => setDept(i)}
            aria-pressed={dept === i}
            className={`rounded-full border px-4 py-2 text-sm transition-all ${
              dept === i
                ? "border-corona-soft/60 text-moon light-rim"
                : "border-hairline text-ash hover:border-moon/30 hover:text-moon"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <p className="eyebrow mb-4 mt-8">Your biggest drain</p>
      <div className="flex flex-wrap gap-2">
        {CHALLENGES.map((c, i) => (
          <button
            key={c.label}
            type="button"
            onClick={() => setChallenge(i)}
            aria-pressed={challenge === i}
            className={`rounded-full border px-4 py-2 text-sm transition-all ${
              challenge === i
                ? "border-corona-soft/60 text-moon light-rim"
                : "border-hairline text-ash hover:border-moon/30 hover:text-moon"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {unique.length > 0 && (
        <div className="mt-10 rounded-[3px] border border-hairline bg-night/60 p-7">
          <p className="eyebrow">Where AI would work hardest for you</p>
          <ul className="mt-5 space-y-4">
            {unique.map((slug, i) => (
              <li key={slug} className="flex items-baseline gap-4">
                <span className="mono-s text-corona-soft/80">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <Link
                    href={`/ai-solutions/#${slug === "governance" ? "governance" : slug}`}
                    className="display display-md text-moon transition-colors hover:text-corona-soft"
                  >
                    {NAMES[slug].name}
                  </Link>
                  <span className="block text-sm text-ash">{NAMES[slug].why}</span>
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/contact/"
            className="mono-s mt-7 inline-block text-moon underline decoration-corona/60 underline-offset-8 transition-colors hover:text-corona-soft"
          >
            Discuss these for your business →
          </Link>
        </div>
      )}
    </div>
  );
}
