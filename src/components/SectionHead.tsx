import { Rise } from "@/components/motion";

/** Standard section opener: mono eyebrow over a hairline, then a display headline. */
export default function SectionHead({
  eyebrow,
  title,
  light = false,
  className = "",
}: {
  eyebrow: string;
  title?: React.ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <Rise>
        <div
          className={`flex items-center gap-4 border-t pt-4 ${
            light ? "border-inkline" : "border-hairline"
          }`}
        >
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, var(--color-corona-soft), var(--color-corona))",
              boxShadow: "0 0 8px rgba(255,139,61,0.6)",
            }}
          />
          <span className={`eyebrow ${light ? "text-night/55" : ""}`}>{eyebrow}</span>
        </div>
      </Rise>
      {title && (
        <Rise delay={0.08}>
          <h2 className="display display-xl mt-8 max-w-4xl">{title}</h2>
        </Rise>
      )}
    </div>
  );
}
