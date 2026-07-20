import { Fragment } from "react";

/**
 * An infinite, whisper-quiet capabilities strip. Two identical tracks scroll
 * as one continuous loop; pauses on hover and freezes under reduced-motion
 * (see the keyframe guard in globals.css).
 */
const CAPABILITIES = [
  "AI agents",
  "Next.js engineering",
  "Business automation",
  "SEO & AI search",
  "Voice AI",
  "Product design",
  "RAG & knowledge AI",
  "Brand identity",
  "AI copilots",
  "Zero-to-one product",
];

function Track() {
  return (
    <div className="marquee-track flex shrink-0 items-center gap-10 pr-10">
      {CAPABILITIES.map((c) => (
        <Fragment key={c}>
          <span className="display display-md whitespace-nowrap text-moon/85">{c}</span>
          <span
            aria-hidden
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, var(--color-corona-soft), var(--color-corona))",
            }}
          />
        </Fragment>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <section aria-label="What we build" className="border-y border-hairline py-8">
      <div className="marquee group relative flex overflow-hidden">
        <Track />
        <Track />
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-night to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-night to-transparent" />
      </div>
    </section>
  );
}
