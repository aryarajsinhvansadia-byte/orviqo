import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import BookingChat from "@/components/BookingChat";
import { Rise } from "@/components/motion";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Talk to us — book a free consultation",
  description:
    "Tell ORVIQO's assistant about your business and book a free 30-minute consultation. No forms, no waiting — a real conversation, and a time in the diary.",
  alternates: { canonical: "/talk/" },
};

const STEPS = [
  ["01", "Tell it what you do", "Your business, and what's actually frustrating you right now."],
  ["02", "Get an honest read", "It will say plainly what we'd look at first — before you commit to anything."],
  ["03", "Pick a time", "Thirty minutes with Aryarajsinh. Free, and no obligation."],
];

export default function TalkPage() {
  return (
    <>
      <PageHero
        eyebrow="Talk to us"
        lines={[
          <span key="l1">Start with</span>,
          <span key="l2">
            a <em className="serif-i not-italic">conversation.</em>
          </span>,
        ]}
        intro="No contact form that disappears into an inbox. Tell our assistant what you're building — it will give you a straight answer and put a consultation in the diary."
      />

      <section className="shell pb-10">
        <Rise>
          <BookingChat />
        </Rise>
        <Rise delay={0.1}>
          <p className="mono-s mt-4 text-center text-ash">
            A live AI — the same kind we build for our clients. It books straight
            into the studio calendar.
          </p>
        </Rise>
      </section>

      <section className="shell section border-t border-hairline">
        <div className="grid gap-10 sm:grid-cols-3">
          {STEPS.map(([n, title, body]) => (
            <Rise key={n}>
              <p className="mono-s text-corona-soft/80">{n}</p>
              <h2 className="display display-md mt-2">{title}</h2>
              <p className="mt-2 text-sm text-ash">{body}</p>
            </Rise>
          ))}
        </div>
        <Rise delay={0.12}>
          <p className="mt-14 text-ash">
            Prefer email? Write to{" "}
            <a
              href={`mailto:${site.email}`}
              className="text-moon underline decoration-corona/60 underline-offset-8 transition-colors hover:text-corona-soft"
            >
              {site.email}
            </a>
            . A real person replies within one working day.
          </p>
        </Rise>
      </section>
    </>
  );
}
