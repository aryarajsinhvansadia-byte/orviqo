/**
 * The ORVIQO orb — the site's signature body of light.
 * "eclipse": dark disc with a burning corona rim (hero).
 * "dawn": half-risen glow over a horizon line (closing CTA).
 * "ember": small free-floating glow (menu, accents).
 */
export default function Orb({
  variant = "eclipse",
  className = "",
}: {
  variant?: "eclipse" | "dawn" | "ember";
  className?: string;
}) {
  if (variant === "dawn") {
    return (
      <div
        aria-hidden
        className={`pointer-events-none relative overflow-hidden ${className}`}
      >
        {/* ambient sky glow */}
        <div
          className="absolute bottom-0 left-1/2 h-[130%] w-[140vw] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(58% 95% at 50% 100%, rgba(255,139,61,0.22) 0%, rgba(255,139,61,0.06) 45%, transparent 70%)",
          }}
        />
        {/* the rising disc */}
        <div
          className="absolute bottom-0 left-1/2 aspect-square w-[min(46vmin,23rem)] -translate-x-1/2 translate-y-[58%] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 38%, rgba(255,228,190,0.95) 0%, rgba(255,180,110,0.85) 38%, rgba(255,139,61,0.45) 62%, transparent 76%)",
            boxShadow: "0 0 90px 30px rgba(255,150,75,0.35)",
            filter: "blur(2px)",
            animation: "orb-breathe 8s ease-in-out infinite",
          }}
        />
        {/* horizon line */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-hairline" />
      </div>
    );
  }

  if (variant === "ember") {
    return (
      <div
        aria-hidden
        className={`pointer-events-none rounded-full ${className}`}
        style={{
          background:
            "radial-gradient(circle at 42% 38%, rgba(255,228,190,0.75) 0%, rgba(255,170,100,0.4) 40%, rgba(255,139,61,0.12) 62%, transparent 75%)",
          filter: "blur(8px)",
          animation: "orb-breathe 7s ease-in-out infinite",
        }}
      />
    );
  }

  // eclipse
  return (
    <div aria-hidden className={`pointer-events-none relative aspect-square ${className}`}>
      {/* far corona haze */}
      <div
        className="absolute -inset-[28%] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,139,61,0.22) 30%, rgba(255,139,61,0.07) 52%, transparent 68%)",
          animation: "orb-breathe 9s ease-in-out infinite",
        }}
      />
      {/* burning rim */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow:
            "0 0 42px 6px rgba(255,160,90,0.5), 0 0 130px 24px rgba(255,139,61,0.22), inset 0 0 40px 6px rgba(255,180,110,0.35)",
          animation: "orb-breathe 7s ease-in-out infinite",
        }}
      />
      {/* crescent highlight */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 200deg, rgba(255,217,163,0.65) 0deg, transparent 80deg, transparent 280deg, rgba(255,217,163,0.4) 360deg)",
          mask: "radial-gradient(circle, transparent 62%, black 66%, black 69%, transparent 73%)",
          WebkitMask:
            "radial-gradient(circle, transparent 62%, black 66%, black 69%, transparent 73%)",
          animation: "slow-spin 60s linear infinite",
        }}
      />
      {/* the occluding disc */}
      <div
        className="absolute inset-[3%] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 40% 36%, #17171f 0%, #0b0b11 55%, #060609 100%)",
        }}
      />
    </div>
  );
}
