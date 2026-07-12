import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How ORVIQO handles the little data it collects — plainly stated.",
  alternates: { canonical: "/privacy/" },
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal — updated July 2026"
        lines={[<span key="l1">Privacy, plainly.</span>]}
      />
      <section className="shell border-t border-hairline pt-16 pb-32">
        <div className="prose-orv mx-auto">
          <p>
            ORVIQO collects as little personal data as a working website
            allows. This page explains what we do collect, why, and what we
            will never do with it.
          </p>
          <h2>What we collect</h2>
          <ul>
            <li>
              <strong>Email you send us.</strong> When you contact{" "}
              {site.email} — directly or through the contact form, which
              simply opens your own mail app — we receive whatever you chose
              to write. We keep that correspondence for as long as the
              conversation (or the project) lives.
            </li>
            <li>
              <strong>Basic, anonymous analytics.</strong> We may measure page
              views and performance in aggregate to understand what's working.
              These measurements are not tied to your identity.
            </li>
          </ul>
          <h2>What we don't do</h2>
          <ul>
            <li>We don't sell, rent or trade your information — to anyone, ever.</li>
            <li>We don't run advertising trackers or build marketing profiles.</li>
            <li>We don't send newsletters you didn't ask for.</li>
          </ul>
          <h2>Cookies</h2>
          <p>
            This site works without tracking cookies. Your browser may keep a
            small session note (for example, that you've already seen the
            loading animation) which never leaves your device.
          </p>
          <h2>Your rights</h2>
          <p>
            You can ask what we hold about you, ask us to correct it, or ask
            us to delete it — one email to {site.email} does it, and we
            respond within 30 days.
          </p>
          <h2>Changes</h2>
          <p>
            If this policy changes materially, the date at the top of this
            page changes with it. No silent edits.
          </p>
        </div>
      </section>
    </>
  );
}
