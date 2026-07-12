import type { ArtVariant } from "@/lib/projects";

/**
 * Generated cover art — each project gets an original abstract composition
 * (no stock imagery). Two-tone gradient ground + a line drawing per variant.
 */
export default function ProjectArt({
  from,
  to,
  variant,
  className = "",
  fill = false,
}: {
  from: string;
  to: string;
  variant: ArtVariant;
  className?: string;
  /** Fill an already-positioned parent, used for immersive artwork backdrops. */
  fill?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={`${fill ? "absolute inset-0" : "relative"} h-full w-full overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {variant === "rings" && (
          <g stroke="#eae8e3" strokeOpacity="0.28">
            {[70, 130, 200, 280, 370, 470].map((r) => (
              <circle key={r} cx="560" cy="300" r={r} />
            ))}
            <circle cx="560" cy="300" r="26" fill="#eae8e3" fillOpacity="0.55" stroke="none" />
          </g>
        )}
        {variant === "beam" && (
          <g>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <path
                key={i}
                d={`M-50 ${520 - i * 62} C 250 ${500 - i * 78}, 500 ${210 + i * 22}, 850 ${140 - i * 18}`}
                stroke="#eae8e3"
                strokeOpacity={0.34 - i * 0.045}
              />
            ))}
            <circle cx="652" cy="128" r="7" fill="#ffd9a3" fillOpacity="0.9" />
          </g>
        )}
        {variant === "grid" && (
          <g stroke="#eae8e3" strokeOpacity="0.22">
            {Array.from({ length: 11 }, (_, i) => (
              <line key={`v${i}`} x1={80 + i * 64} y1="60" x2={80 + i * 64} y2="540" />
            ))}
            {Array.from({ length: 8 }, (_, i) => (
              <line key={`h${i}`} x1="80" y1={60 + i * 68.5} x2="720" y2={60 + i * 68.5} />
            ))}
            <rect x="336" y="197" width="128" height="137" fill="#eae8e3" fillOpacity="0.3" stroke="none" />
          </g>
        )}
        {variant === "dune" && (
          <g stroke="#eae8e3" strokeOpacity="0.3">
            {[0, 1, 2, 3, 4].map((i) => (
              <path
                key={i}
                d={`M-20 ${330 + i * 52} Q 200 ${230 + i * 44} 420 ${330 + i * 50} T 840 ${300 + i * 52}`}
              />
            ))}
            <circle cx="410" cy="170" r="34" stroke="#ffd9a3" strokeOpacity="0.8" />
          </g>
        )}
        {variant === "halo" && (
          <g>
            <circle cx="400" cy="300" r="150" stroke="#eae8e3" strokeOpacity="0.5" />
            <circle cx="400" cy="300" r="196" stroke="#eae8e3" strokeOpacity="0.25" />
            <circle cx="400" cy="300" r="248" stroke="#eae8e3" strokeOpacity="0.12" />
            <circle cx="400" cy="152" r="6" fill="#ffd9a3" fillOpacity="0.95" />
          </g>
        )}
        {variant === "arc" && (
          <g stroke="#eae8e3">
            <path d="M 60 540 A 380 380 0 0 1 740 540" strokeOpacity="0.4" />
            <path d="M 140 540 A 300 300 0 0 1 660 540" strokeOpacity="0.25" />
            <path d="M 220 540 A 220 220 0 0 1 580 540" strokeOpacity="0.14" />
            <circle cx="400" cy="160" r="8" fill="#ffd9a3" fillOpacity="0.9" stroke="none" />
          </g>
        )}
      </svg>
      {/* vignette + top light */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, rgba(234,232,227,0.08) 0%, transparent 45%), radial-gradient(130% 110% at 50% 110%, rgba(6,6,9,0.55) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}
