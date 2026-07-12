"use client";

import { useState } from "react";
import { site } from "@/lib/site";

const budgets = ["Under $10k", "$10k – $25k", "$25k – $60k", "$60k+", "Not sure yet"];

const inputCls =
  "w-full border-b border-hairline bg-transparent py-3 text-moon placeholder:text-ash/60 focus:border-corona-soft/70 focus:outline-none transition-colors";

export default function ContactForm() {
  const [budget, setBudget] = useState<string>("");

  // Static site: submitting composes an email in the visitor's mail client,
  // pre-filled with everything they typed.
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get("name");
    const company = data.get("company");
    const email = data.get("email");
    const message = data.get("message");
    const body = encodeURIComponent(
      `Name: ${name}\nCompany: ${company}\nEmail: ${email}\nBudget: ${budget || "Not specified"}\n\n${message}`
    );
    const subject = encodeURIComponent(`New project — ${company || name}`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  };

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
      <div className="flex flex-wrap items-center gap-6 pt-2">
        <button
          type="submit"
          className="group inline-flex items-center gap-3 rounded-full bg-moon px-8 py-4 font-medium text-night transition-colors duration-300 hover:bg-corona-soft"
        >
          Send the brief
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
        <p className="mono-s text-ash">Opens in your mail app — nothing is stored here.</p>
      </div>
    </form>
  );
}
