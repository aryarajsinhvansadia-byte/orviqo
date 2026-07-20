"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * AI readiness assessment — 8 questions, client-side scoring, mapped to the
 * solutions that fit. A conversation starter, honestly labelled as such.
 */
type Option = { label: string; score: number; hint?: string };
type Q = { q: string; options: Option[] };

const QUESTIONS: Q[] = [
  {
    q: "Where does your business live digitally today?",
    options: [
      { label: "No real website yet", score: 0, hint: "start" },
      { label: "A website that's mostly a brochure", score: 5 },
      { label: "A site that brings enquiries", score: 10 },
      { label: "Site + CRM + tools working together", score: 15 },
    ],
  },
  {
    q: "How much of your team's week is repetitive admin?",
    options: [
      { label: "Very little", score: 3 },
      { label: "A few hours per person", score: 8, hint: "automation" },
      { label: "A day or more per person", score: 12, hint: "automation" },
      { label: "It sometimes feels like the whole job", score: 15, hint: "automation" },
    ],
  },
  {
    q: "How do customers reach you after hours?",
    options: [
      { label: "They can't — they wait", score: 3, hint: "chatbot" },
      { label: "A contact form we answer later", score: 6, hint: "chatbot" },
      { label: "Some automated replies", score: 10 },
      { label: "An assistant answers instantly", score: 15 },
    ],
  },
  {
    q: "Where does company knowledge live?",
    options: [
      { label: "In people's heads", score: 3, hint: "rag" },
      { label: "Scattered files and chats", score: 6, hint: "rag" },
      { label: "Organised docs, hard to search", score: 10, hint: "rag" },
      { label: "Searchable and structured", score: 15 },
    ],
  },
  {
    q: "How are phone calls handled?",
    options: [
      { label: "We miss plenty", score: 3, hint: "voice" },
      { label: "Front desk, business hours only", score: 6, hint: "voice" },
      { label: "Rarely miss, but it costs staff time", score: 10, hint: "voice" },
      { label: "Calls aren't a big channel for us", score: 8 },
    ],
  },
  {
    q: "How much paperwork flows through the business?",
    options: [
      { label: "Barely any", score: 8 },
      { label: "Invoices and forms, weekly", score: 8, hint: "documents" },
      { label: "Daily document handling", score: 10, hint: "documents" },
      { label: "It's a department of its own", score: 12, hint: "documents" },
    ],
  },
  {
    q: "Has your team tried AI tools?",
    options: [
      { label: "Not really", score: 3 },
      { label: "A few people experiment", score: 6 },
      { label: "Regular use, no strategy", score: 10, hint: "strategy" },
      { label: "Deliberate use with owners", score: 13 },
    ],
  },
  {
    q: "If AI saved 10 hours a week, you would…",
    options: [
      { label: "Not sure it applies to us", score: 3, hint: "strategy" },
      { label: "Be curious, cautiously", score: 6 },
      { label: "Want it this quarter", score: 10 },
      { label: "Want it yesterday", score: 13 },
    ],
  },
];

const HINT_SOLUTIONS: Record<string, { name: string; href: string }> = {
  start: { name: "Web & Digital Experiences", href: "/services/#web-digital" },
  automation: { name: "Business Automation", href: "/ai-solutions/#automation" },
  chatbot: { name: "Custom AI Chatbots", href: "/ai-solutions/#chatbots" },
  rag: { name: "RAG & Knowledge AI", href: "/ai-solutions/#rag" },
  voice: { name: "Voice AI Agents", href: "/ai-solutions/#voice-ai" },
  documents: { name: "Document Intelligence", href: "/ai-solutions/#document-intelligence" },
  strategy: { name: "AI Strategy & Consulting", href: "/services/#ai-consulting" },
};

function tier(score: number) {
  if (score < 45)
    return {
      name: "Foundations first",
      read: "The biggest wins right now are digital basics done excellently — presence, findability, and one or two focused automations.",
    };
  if (score < 75)
    return {
      name: "Ready to automate",
      read: "You have the base. The next leap is automation and assistance — removing repetitive hours and answering customers instantly.",
    };
  return {
    name: "Agent-ready",
    read: "Your operation can support serious AI — knowledge assistants, copilots and agentic workflows with proper guardrails.",
  };
}

export default function ReadinessQuiz() {
  const [answers, setAnswers] = useState<(number | null)[]>(QUESTIONS.map(() => null));
  const [done, setDone] = useState(false);

  const answered = answers.filter((a) => a !== null).length;
  const score = answers.reduce<number>(
    (sum, a, i) => sum + (a === null ? 0 : QUESTIONS[i].options[a].score),
    0
  );
  const maxScore = QUESTIONS.reduce(
    (sum, q) => sum + Math.max(...q.options.map((o) => o.score)),
    0
  );
  const pct = Math.round((score / maxScore) * 100);

  const hints = new Set<string>();
  answers.forEach((a, i) => {
    if (a !== null) {
      const h = QUESTIONS[i].options[a].hint;
      if (h) hints.add(h);
    }
  });
  const suggestions = [...hints].slice(0, 3).map((h) => HINT_SOLUTIONS[h]);

  if (done) {
    const t = tier(pct);
    return (
      <div className="rounded-[3px] border border-hairline bg-night/60 p-8">
        <p className="eyebrow">Your indicative readiness</p>
        <div className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <span className="display light-text text-6xl tabular-nums">{pct}</span>
          <span className="display display-md">{t.name}</span>
        </div>
        <div className="mt-4 h-1 w-full overflow-hidden rounded bg-hairline">
          <div
            className="h-full bg-gradient-to-r from-corona-soft to-corona transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-6 max-w-xl text-ash">{t.read}</p>
        {suggestions.length > 0 && (
          <>
            <p className="eyebrow mt-8">Where we&apos;d look first</p>
            <ul className="mt-3 space-y-2">
              {suggestions.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="text-moon underline decoration-corona/60 underline-offset-4 transition-colors hover:text-corona-soft">
                    {s.name} →
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
        <p className="mono-s mt-8 text-ash">
          An indicative score, not an audit — the real assessment is a conversation.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link href="/contact/" className="rounded-full bg-moon px-6 py-3 font-medium text-night transition-colors hover:bg-corona-soft">
            Get the full AI readiness assessment
          </Link>
          <button
            type="button"
            onClick={() => {
              setAnswers(QUESTIONS.map(() => null));
              setDone(false);
            }}
            className="mono-s text-ash underline-offset-4 hover:text-moon hover:underline"
          >
            Retake
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="mono-s text-ash">
          {answered} / {QUESTIONS.length} answered
        </p>
        <div className="h-px w-40 overflow-hidden bg-hairline">
          <div
            className="h-full bg-corona transition-all duration-500"
            style={{ width: `${(answered / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>
      <ol className="space-y-8">
        {QUESTIONS.map((q, qi) => (
          <li key={qi}>
            <p className="mb-3 font-medium text-moon">
              <span className="mono-s mr-3 text-corona-soft/80">{String(qi + 1).padStart(2, "0")}</span>
              {q.q}
            </p>
            <div className="flex flex-wrap gap-2">
              {q.options.map((o, oi) => (
                <button
                  key={oi}
                  type="button"
                  onClick={() =>
                    setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)))
                  }
                  aria-pressed={answers[qi] === oi}
                  className={`rounded-full border px-4 py-2 text-sm transition-all duration-200 ${
                    answers[qi] === oi
                      ? "border-corona-soft/60 text-moon light-rim"
                      : "border-hairline text-ash hover:border-moon/30 hover:text-moon"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <button
        type="button"
        disabled={answered < QUESTIONS.length}
        onClick={() => setDone(true)}
        className="mt-10 rounded-full bg-moon px-7 py-3.5 font-medium text-night transition-colors hover:bg-corona-soft disabled:opacity-40"
      >
        Reveal my readiness score
      </button>
    </div>
  );
}
