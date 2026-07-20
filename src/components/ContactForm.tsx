"use client";

import { useState } from "react";
import { site } from "@/lib/site";

const budgets = ["Under $10k", "$10k – $25k", "$25k – $60k", "$60k+", "Not sure yet"];

const inputCls =
  "w-full border-b border-hairline bg-transparent py-3 text-moon placeholder:text-ash/60 focus:border-corona-soft/70 focus:outline-none transition-colors";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [budget, setBudget] = useState<string>("");
  const [status, setStatus] = useState<Status>("idle");
  const [fallbackHref, setFallbackHref] = useState<string>("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const data = new FormData(e.currentTarget);
    const payload = {
      name: data.get("name"),
      company: data.get("company"),
      email: data.get("email"),
      budget,
      message: data.get("message"),
      website: data.get("website"),
      page: window.location.pathname,
    };

    setStatus("sending");
    try {
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => null)) as { ok?: boolean } | null;
      if (res.ok && json?.ok) {
        setStatus("sent");
        return;
      }
      throw new Error("forward_failed");
    } catch {
      // Never dead-end a lead: offer a prefilled email instead.
      const body = encodeURIComponent(
        `Name: ${payload.name}\nCompany: ${payload.company}\nEmail: ${payload.email}\nBudget: ${budget || "Not specified"}\n\n${payload.message}`
      );
      const subject = encodeURIComponent(`New project — ${payload.company || payload.name}`);
      setFallbackHref(`mailto:${site.email}?subject=${subject}&body=${body}`);
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="rounded-[3px] border border-hairline bg-night/60 p-10 text-center" role="status">
        <p className="display display-lg">
          Received. <em className="serif-i not-italic">Thank you.</em>
        </p>
        <p className="mx-auto mt-4 max-w-sm text-ash">
          Your brief is in the studio&apos;s inbox. A real person replies within
          one working day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-9">
      <div className="grid gap-9 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="eyebrow mb-3 block">
            Your name
          </label>
          <input id="name" name="name" required autoComplete="name" className={inputCls} placeholder="Asha Mehta" />
        </div>
        <div>
          <label htmlFor="company" className="eyebrow mb-3 block">
            Company
          </label>
          <input id="company" name="company" className={inputCls} placeholder="Meridian & Co." />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="eyebrow mb-3 block">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputCls}
          placeholder="you@company.com"
        />
      </div>
      <fieldset>
        <legend className="eyebrow mb-4">Budget</legend>
        <div className="flex flex-wrap gap-2">
          {budgets.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBudget(b)}
              aria-pressed={budget === b}
              className={`rounded-full border px-4 py-2 text-sm transition-all duration-300 ${
                budget === b
                  ? "border-corona-soft/60 text-moon light-rim"
                  : "border-hairline text-ash hover:border-moon/30 hover:text-moon"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="message" className="eyebrow mb-3 block">
          The ambition
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className={`${inputCls} resize-none`}
          placeholder="What are you building, and what should it earn you?"
        />
      </div>

      {/* honeypot — hidden from humans, irresistible to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-6 pt-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex items-center gap-3 rounded-full bg-moon px-8 py-4 font-medium text-night transition-colors duration-300 hover:bg-corona-soft disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send the brief"}
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
        <p className="mono-s text-ash">
          Straight to the studio — a reply within one working day.
        </p>
      </div>

      {status === "error" && (
        <p className="mono-s text-corona-soft" role="alert">
          That didn&apos;t go through.{" "}
          <a href={fallbackHref} className="text-moon underline underline-offset-4">
            Send it by email instead →
          </a>
        </p>
      )}
    </form>
  );
}
